import React, { useEffect, useState, useRef } from 'react';
import './Alarms.css';
import alarmSound from '../../assets/fire_alarm.mp3';

interface Measurement {
    name: string;
    WERT: number;
    DATUMZEIT: string;
}
interface Limit {
    name: string;
    limit_value: number;
}
declare global {
    interface Window {
        electronAPI: {
            getMssqlTables: () => Promise<Measurement[]>;
            getLimits: () => Promise<Limit[]>;
            updateLimit: (name: string, newLimit: number) => Promise<{ success: boolean; error?: string }>;
        };
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

    const fetchData = async () => {
        
        try {
            const [measurementsRes, limitsRes] = await Promise.all([
                window.electronAPI.getMssqlTables(),
                window.electronAPI.getLimits()
            ]);

            const limitsMap: Record<string, number> = {};
            limitsRes.forEach(limit => {
                limitsMap[limit.name] = limit.limit_value;
            });


            setLimits(limitsMap);
            setMeasurements(measurementsRes);
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
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const anyAlarm = measurements.some(m => m.WERT > (limits[m.name] ?? 200));
        if (anyAlarm && audioRef.current) {
            console.log("alarm çalındı");
            audioRef.current.currentTime = 0;
            audioRef.current.play();
        }
    }, [measurements, limits]);

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

    if (!visible) return <audio ref={audioRef} src={alarmSound} preload="auto" />;

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
                            <button
                                className="test-sound-btn"
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
                                            .catch(err => console.error('Ses çalma hatası:', err));
                                    }
                                }}
                            >
                                🔊 Sesi Test Et
                            </button>
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
                                    const datum=new Date(m.DATUMZEIT);
                                    const now = Date.now();
                                    const isDataOutage =(now-datum.getTime()) > 2*60*1000;
                      
                                    return (
                                        <div
                                            key={m.name}
                                            className={`measurement-list-item${isAlarm ? ' alarm-blink' : isDataOutage ? ' data-outage opacity-50' : ''}`}
                                        >
                                            <div className="measurement-row">
                                                <div className="ges-title">{gesName}</div>
                                                <div className="info-table">
                                                    <div className="info-table-row">
                                                        <span className="label">Değer</span>
                                                        <span className="value">{m.WERT.toFixed(2)}</span>
                                                    </div>
                                                    <div className="info-table-row">
                                                        <span className="label">Zaman</span>
                                                        <span className="value">{m.DATUMZEIT}</span>
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
                )}
            </div>
            <audio ref={audioRef} src={alarmSound} preload="auto" />
        </div>
    );
};

export default Alarms;
