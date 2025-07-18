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

    const prevOutagesNames=useRef<Set<string>>(new Set());
   
    const fetchData = async () => {
        try {
            const [measurementsRes, limitsRes] = await Promise.all([
                window.electronAPI.getMssqlTables(),
                window.electronAPI.getLimits()
            ]);
            
            // Spont olmayan verilerin başlangıç zamanlarını güncelle
            setNonSpontaneousStartTimes(prev => {
                const newTimes = { ...prev };
                
                // Yeni gelen verilerde spont olanları temizle
                measurementsRes.forEach(measurement => {
                    if (measurement.isSpontaneous && newTimes[measurement.name]) {
                        console.log(`🔄 ${measurement.name} tekrar spont hale geldi, başlangıç zamanı temizlendi`);
                        delete newTimes[measurement.name];
                    }
                });
                
                // Yeni spont olmayan veriler için başlangıç zamanı ekle
                measurementsRes.forEach(measurement => {
                    if (!measurement.isSpontaneous && !newTimes[measurement.name]) {
                        console.log(`⚠️ ${measurement.name} spont olmayan duruma geçti, başlangıç zamanı kaydedildi`);
                        newTimes[measurement.name] = new Date(measurement.DATUMZEIT).getTime();
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
        }
        getGesInfo();
        console.log("gesInfoRef.current",gesInfoRef.current);
        return () => clearInterval(interval);
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

    const getGesProvince=(name:string)=>{
        const parts=name.split('.');
        return parts.length>=2?parts[0]:name;
    }

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
                            {measurements
                                .sort((a, b) => {
                                    const gesNameA = getGesName(a.name);
                                    const gesNameB = getGesName(b.name);
                                    return gesNameA.localeCompare(gesNameB, 'tr');
                                })
                                .map((m, index) => {
                                    const limit = limits[m.name] ?? 200;
                                    const isAlarm = m.WERT > limit;
                                    const gesName = getGesName(m.name);
                                    const gesProvince=getGesProvince(m.name);
                                    const gesDistrict=gesInfoRef.current.find((ges:any)=>ges.name===m.name)?.district;
                                    const isSpontaneous = m.isSpontaneous;
                                    const datum=new Date(m.DATUMZEIT);
                                    const now = Date.now();
                                    const isDataLate =(now-datum.getTime()) > 2*60*1000;
                                    const isDataOutage = m.isOutage;
                      
                                    return (
                                        <div
                                            key={m.name}
                                            className={`measurement-list-item${isAlarm ? ' alarm-blink' : isDataOutage ? ' data-outage-blink' : isDataLate ? ' data-late' : ''}`}
                                        >
                                            <div className="measurement-row">
                                                <div className={`ges-title${isDataOutage ? ' outage-title' : ''}`}>
                                                    {gesName}
                                                    {isDataOutage && <span className="outage-indicator">⚡ KESİNTİ</span>}
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
                                                    {/* Spontane olmayan alarmlar için detaylı bilgi */}
                                                    {!isSpontaneous && (() => {
                                                        const durationMs = Date.now() - (nonSpontaneousStartTimes[m.name] || new Date(m.DATUMZEIT).getTime());
                                                        const hours = Math.floor(durationMs / 3600000);
                                                        const minutes = Math.floor((durationMs % 3600000) / 60000);
                                                        const seconds = Math.floor((durationMs % 60000) / 1000);
                                                        const durationText = `${hours>0?`${hours}sa `:' '}${minutes>0?`${minutes}dk `:' '}${seconds>0?`${seconds}sn `:' '}süredir`;
                                                        
                                                        let colorClass = 'non-spontaneous-red';
                                                        if (durationMs < 5 * 60 * 1000) colorClass = 'non-spontaneous-yellow';
                                                        else if (durationMs < 15 * 60 * 1000) colorClass = 'non-spontaneous-orange';
                                                        
                                                        return (
                                                            <div className="info-table-row">
                                                                <span className="label">Durum</span>
                                                                <span className="value">
                                                                    <span className={`manual-alarm-indicator ${colorClass}`}>
                                                                        🔴 Veri İnvalid
                                                                        <br />
                                                                        <small>
                                                                            {durationText}
                                                                        </small>
                                                                    </span>
                                                                </span>
                                                            </div>
                                                        );
                                                    })()}
                                                    {isDataOutage && (
                                                        <div className="info-table-row outage-status">
                                                            <span className="label">Durum</span>
                                                            <span className="value">
                                                                <span className="outage-status-indicator">⚡ Elektrik Kesintisi</span>
                                                            </span>
                                                        </div>
                                                    )}
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
                )}
            </div>
            <audio ref={audioRef} src={alarmSound} preload="auto" />
            <audio ref={outageAudioRef} src={outageSound} preload="auto" />
        </div>
    );
};

export default Alarms;
