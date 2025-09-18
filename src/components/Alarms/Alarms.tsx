import React, { useEffect, useState, useRef } from 'react';
import './Alarms.css';
import alarmSound from '../../assets/fire_alarm.mp3';
import outageSound from '../../assets/kesinti.mp3';
import { ElectronAPI, Measurement, Limit } from '../../types';

declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}

interface AlarmsProps {
    visible?: boolean;
}

const Alarms: React.FC<AlarmsProps> = ({ visible = true }) => {
    const [measurements, setMeasurements] = useState<Measurement[]>([]);
    const [limits, setLimits] = useState<Record<string, number>>({});
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [editingGES, setEditingGES] = useState<string | null>(null);
    const [newLimitValue, setNewLimitValue] = useState<string>('');
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const outageAudioRef = useRef<HTMLAudioElement | null>(null);
    
    // Spont olmayan verilerin başlangıç zamanlarını takip etmek için
    const [nonSpontaneousStartTimes, setNonSpontaneousStartTimes] = useState<Record<string, number>>({});
    const gesInfoRef=useRef<Record<string,any>>({});
    
    // Uygulama açılış zamanını takip et
    const appStartTime = useRef<number>(Date.now());
    
    // Gruplandırılmış veriler için state
    const [groupedMeasurements, setGroupedMeasurements] = useState<Record<string, Measurement[]>>({});
    
    const prevOutagesNames=useRef<Set<string>>(new Set());

    useEffect(()=> {console.log(nonSpontaneousStartTimes)},[nonSpontaneousStartTimes])
    const fetchData = async () => {
        try {
            const [measurementsRes, limitsRes] = await Promise.all([
                window.electronAPI.getMssqlTables(),
                window.electronAPI.getLimits()
            ]);

            setNonSpontaneousStartTimes(prev => {
                const newTimes = { ...prev };

            
                measurementsRes.forEach(measurement => {
                    if (measurement.isSpontaneous && Object.prototype.hasOwnProperty.call(newTimes,measurement.name)) {
                        console.log("delete",measurement)
                        delete newTimes[measurement.name];
                      
                    }
                    if (!measurement.isSpontaneous && !Object.prototype.hasOwnProperty.call(newTimes,measurement.name)) {
                        const dataTime = new Date(measurement.DATUMZEIT).getTime();
                        if (dataTime < appStartTime.current) {
                            newTimes[measurement.name] = 0; // 0 = süre gösterme
                        } else {
                            newTimes[measurement.name] = dataTime;
                        }
                    }
                });
                
                return newTimes;
            });
            
            const limitsMap: Record<string, number> = {};
            limitsRes.forEach(limit => {
                limitsMap[limit.name] = limit.limit_value;
            });
            setLimits(limitsMap);
            setMeasurements(measurementsRes);
            
            // Gruplandırılmış verileri güncelle
            const grouped = getGroupedMeasurements(measurementsRes);
            setGroupedMeasurements(grouped);
            
            const differents=Object.keys(limitsMap).filter(name => !measurementsRes.some(m => m.name === name));
        } catch (err) {
            console.error("Veri çekme hatası:", err);
            setError(err instanceof Error ? err.message : "Veri çekilirken bir hata oluştu");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000);
        const getGesInfo= async ()=>{
            const gesInfoRes= await window.electronAPI.getGesInfo();
            gesInfoRef.current=gesInfoRes;
            console.log("🏢 GES Info yüklendi:", gesInfoRes);
            console.log("🏢 İlk GES örneği:", gesInfoRes[0]);
            
            // GES bilgileri değiştiğinde gruplandırmayı yenile
            if (measurements.length > 0) {
                const grouped = getGroupedMeasurements(measurements);
                setGroupedMeasurements(grouped);
            }
        }
        getGesInfo();
        //console.log("gesInfoRef.current",gesInfoRef.current);
        return () => {
            console.log("interval temizlendi");
            clearInterval(interval);
        }
    }, []);

    useEffect(() => {
        const anyAlarm = measurements.some(m => m.WERT > (limits[m.name] ?? 200));
        if (anyAlarm && audioRef.current) {
            console.log("alarm çalındı");
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(err => console.error('Alarm sesi çalma hatası:', err));
        }
    }, [measurements, limits]);

    useEffect(()=>{
        const currentOutages=measurements.filter(m => m.isOutage);
        const currentNames=new Set(currentOutages.map(m => m.name))
        const prevNames=prevOutagesNames.current;

        const newOutages=currentOutages.filter(m => !prevNames.has(m.name));
        if(newOutages.length>0){
            console.log("newOutages",newOutages);
            window.electronAPI.logToOutage(newOutages);
        }
        if(newOutages.length>0 && outageAudioRef.current){
            outageAudioRef.current.currentTime=0;
            outageAudioRef.current.play().catch(err => console.error('Kesinti sesi çalma hatası:', err));
        }
        prevOutagesNames.current=currentNames;
    },[measurements])

    // Spont olmayan verilerin süresini gerçek zamanlı güncellemek için
    useEffect(() => {
        if (Object.keys(nonSpontaneousStartTimes).length === 0) return;
        
        const interval = setInterval(() => {
            // Sadece state'i güncellemek için boş bir setState çağrısı
            setMeasurements(prev => [...prev]);
        }, 1000); // Her saniye güncelle
        
        return () => clearInterval(interval);
    }, [nonSpontaneousStartTimes]);


    const updateLimit = async (name: string, newLimit: number) => {
        const updated = { ...limits, [name]: newLimit };
        setLimits(updated);
        try {
            const response = await window.electronAPI.updateLimit(name, newLimit);
            if (!response.success) {
                setError(response.error || 'Limit güncelleme başarısız oldu.');
            }
        } catch (err) {
            setError('Limit güncellenirken bir hata oluştu.');
        }
    };
    
    const getGesName = (name: string) => {
        const parts = name.split('.');
        return parts.length >= 2 ? parts[1] : name;
    };

    // Performanslı gruplandırma fonksiyonu - sadece gerektiğinde çalışır
    const getGroupedMeasurements = (measurements: Measurement[]) => {
        const grouped: Record<string, Measurement[]> = {};
        
        measurements.forEach(measurement => {
            const parts = measurement.name.split('.');
            const ilName = parts[0];
            const gesName = parts[1];
            const fullGesName = `${ilName}.${gesName}`;
            
            // gesInfoRef.current'ta bu GES'i ara
            const gesInfo = gesInfoRef.current.find((ges: any) => 
                ges.name && (ges.name.includes(fullGesName))
            );
            
            const district = gesInfo?.district;
            // İl bilgisini measurement adından çıkar
            const province = ilName; // parts[0] zaten il adı
            
            if (district && province) {
                const groupKey = `${province} - ${district}`;
                
                if (!grouped[groupKey]) {
                    grouped[groupKey] = [];
                }
                grouped[groupKey].push(measurement);
            }
        });
        
        //console.log("📋 Oluşturulan gruplar:", Object.keys(grouped));
        
        // Her grup içinde alfabetik sırala
        Object.keys(grouped).forEach(groupKey => {
            grouped[groupKey].sort((a, b) => {
                const gesNameA = getGesName(a.name);
                const gesNameB = getGesName(b.name);
                return gesNameA.localeCompare(gesNameB, 'tr');
            });
        });
        
        // Grupları il ve ilçe adına göre alfabetik sırala
        const sortedGrouped: Record<string, Measurement[]> = {};
        const sortedKeys = Object.keys(grouped).sort((a, b) => {
            return a.localeCompare(b, 'tr');
        });
        
        sortedKeys.forEach(key => {
            sortedGrouped[key] = grouped[key];
        });
        
        return sortedGrouped;
    };

    if (!visible) return (
        <>
            <audio ref={audioRef} src={alarmSound} preload="auto" />
            <audio ref={outageAudioRef} src={outageSound} preload="auto" />
        </>
    );

    return (
        <div className="alarms-container">
            <div className="alarms-content">
                {loading ? (
                    <div className="loading">Yükleniyor...</div>
                ) : error ? (
                    <div className="error-message">Hata: {error}</div>
                ) : (
                    <div>
                        <h2>
                            Ölçüm Değerleri
                            <span style={{ fontSize: '1rem', color: '#7f8c8d' }}>({measurements.length} adet)</span>
                            <div className="sound-test-buttons">
                                <button
                                    className="test-sound-btn alarm-test"
                                    onClick={() => {
                                        if (audioRef.current) {
                                            audioRef.current.currentTime = 0;
                                            audioRef.current.play()
                                                .then(() => {
                                                    setTimeout(() => {
                                                        audioRef.current && audioRef.current.pause();
                                                        audioRef.current && (audioRef.current.currentTime = 0);
                                                    }, 2000);
                                                })
                                                .catch(err => console.error('Alarm sesi çalma hatası:', err));
                                        }
                                    }}
                                >
                                    🔥 Alarm Sesi Test
                                </button>
                                <button
                                    className="test-sound-btn outage-test"
                                    onClick={() => {
                                        if (outageAudioRef.current) {
                                            outageAudioRef.current.currentTime = 0;
                                            outageAudioRef.current.play()
                                                .then(() => {
                                                    setTimeout(() => {
                                                        outageAudioRef.current && outageAudioRef.current.pause();
                                                        outageAudioRef.current && (outageAudioRef.current.currentTime = 0);
                                                    }, 2000);
                                                })
                                                .catch(err => console.error('Kesinti sesi çalma hatası:', err));
                                        }
                                    }}
                                >
                                    ⚡ Kesinti Sesi Test
                                </button>
                               
                            </div>
                        </h2>
                        <div className="alarms-grid">

                            {Object.keys(groupedMeasurements).length > 0 ? (
                                // Gruplandırılmış görünüm
                                Object.entries(groupedMeasurements).map(([groupKey, groupMeasurements]) => (
                                    <div key={groupKey} className="district-group">
                                        <h3 className="district-title">
                                            {groupKey}
                                            <span style={{ 
                                                fontSize: '0.9rem', 
                                                opacity: 0.9, 
                                                marginLeft: '10px',
                                                fontWeight: '400'
                                            }}>
                                                ({groupMeasurements.length} GES)
                                            </span>
                                        </h3>
                                        <div className="district-measurements">
                                            {groupMeasurements.map((m, index) => {
                                                const limit = limits[m.name] ?? 200;
                                                const isAlarm = m.WERT > limit;
                                                const gesName = getGesName(m.name);
                                                const isSpontaneous = m.isSpontaneous;
                                    const datum=new Date(m.DATUMZEIT);
                                    const now = Date.now();
                                    const isDataLate =(now-datum.getTime()) > 4*60*1000;
                                    const isDataOutage = m.isOutage;
                      
                                    return (
                                        <div
                                            key={m.name}
                                            className={`measurement-list-item${isAlarm ? ' alarm-blink' : isDataOutage ? ' data-outage-blink' : isDataLate ? ' data-late' : ''}`}
                                        >

                                            <div className="measurement-row">
                                                <div className={`ges-title${isDataOutage ? ' outage-title' : ''}${!isSpontaneous ? ' invalid-title' : ''}`}>
                                                    {gesName}
                                                    {isDataOutage && <span className="outage-indicator">⚡</span>}
                                                    {!isSpontaneous && (
                                                        <>
                                                            <span className="invalid-indicator">🔴</span>
                                                            {nonSpontaneousStartTimes[m.name] && nonSpontaneousStartTimes[m.name] > 0 ? (
                                                                <span className="invalid-duration-small">
                                                                    {(() => {
                                                                        const durationMs = Date.now() - nonSpontaneousStartTimes[m.name];
                                                                        const hours = Math.floor(durationMs / 3600000);
                                                                        const minutes = Math.floor((durationMs % 3600000) / 60000);
                                                                        const seconds = Math.floor((durationMs % 60000) / 1000);
                                                                        return `${hours>0?`${hours}sa`:' '}${minutes>0?`${minutes}dk`:' '}${seconds>0?`${seconds}sn`:' '}`;
                                                                    })()}
                                                                </span>
                                                            ) : (
                                                                <span className="invalid-duration-small" style={{ opacity: 0.7 }}>
                                                                    Bir süredir Invalid
                                                                </span>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                                <div className="info-table">
                                                    <div className="info-table-row">
                                                        <span className="label">Değer</span>
                                                        <span className={`value${isDataOutage ? ' outage-value' : ''}`}>
                                                            {m.WERT}
                                                        </span>
                                                    </div>
                                                    <div className="info-table-row">
                                                        <span className="label">Zaman</span>
                                                        <span className={`value${isDataOutage ? ' outage-value' : ''}`}>{m.DATUMZEIT}</span>
                                                    </div>
                                                    <div className={`info-table-row${isAlarm ? ' alarm-row' : ''}`}>
                                                        <span className="label">Eşik Değeri</span>
                                                        <span className="value">
                                                            {limit}
                                                            <button
                                                                className="update-threshold-btn edit icon-btn"
                                                                style={{ marginLeft: 8 }}
                                                                onClick={() => {
                                                                    setEditingGES(m.name);
                                                                    setNewLimitValue(String(limit));
                                                                }}
                                                                aria-label="Düzenle"
                                                            >
                                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b0b7c3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
                                                            </button>
                                                        </span>
                                                    </div>
                                                    

                                                    {editingGES === m.name && (
                                                        <div className="edit-row">
                                                            <input
                                                                type="number"
                                                                value={newLimitValue}
                                                                onChange={e => setNewLimitValue(e.target.value)}
                                                            />
                                                            <button
                                                                className="update-threshold-btn"
                                                                onClick={() => {
                                                                    if (newLimitValue !== '' && !isNaN(Number(newLimitValue))) {
                                                                        updateLimit(m.name, Number(newLimitValue));
                                                                        setEditingGES(null);
                                                                        setNewLimitValue('');
                                                                    }
                                                                }}
                                                            >Kaydet</button>
                                                            <button
                                                                className="update-threshold-btn"
                                                                style={{ backgroundColor: '#95a5a6' }}
                                                                onClick={() => {
                                                                    setEditingGES(null);
                                                                    setNewLimitValue('');
                                                                }}
                                                            >İptal</button>
                                                        </div>
                                                    )}
                                                    {/* <div className="info-table-row">
                                                        <span className="label">Ölçüm</span>
                                                        <span className="value measure-name">{m.name}</span>
                                                    </div> */}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="loading">GES bilgileri yükleniyor...</div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <audio ref={audioRef} src={alarmSound} preload="auto" />
            <audio ref={outageAudioRef} src={outageSound} preload="auto" />
        </div>
    );
};

export default Alarms;
