import React, { useEffect, useState, useRef } from 'react';
import './Alarms.css';
import alarmSound from '../../assets/fire_alarm.mp3';

interface Measurement {
    tableName: string;
    name: string;
    WERT: number;
    DATUMZEIT: string;
}

declare global {
    interface Window {
        electronAPI: {
            getMssqlTables: () => Promise<Measurement[]>;
        };
    }
}

const defaultLimits: Record<string, number> = {
    'Konya.Eforges6.RTU.H02.Meas.P_TC_SQL': 950,
    'Konya.Espeges3.RTU.H02.Meas.P_TC_SQL': 950,
    'Konya.Worldmedicine.RTU.H02.Meas.P_TC_SQL': 950,
};

interface AlarmsProps {
    visible?: boolean;
}

const Alarms: React.FC<AlarmsProps> = ({ visible = true }) => {
    const [measurements, setMeasurements] = useState<Measurement[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [gesLimits, setGesLimits] = useState<Record<string, number>>(() => {
        const saved = localStorage.getItem('gesLimits');
        return saved ? JSON.parse(saved) : defaultLimits;
    });
    const [editingGES, setEditingGES] = useState<string | null>(null);
    const [newLimitValue, setNewLimitValue] = useState<string>('');
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const fetchMeasurements = async () => {
        try {
            const result = await window.electronAPI.getMssqlTables();
            setMeasurements(result);
        } catch (err) {
            console.error("Database connection error:", err);
            setError(err instanceof Error ? err.message : "An error occurred while connecting to the database");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMeasurements();
        const interval = setInterval(fetchMeasurements, 10000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const anyAlarm = measurements.some(measurement => {
            const limit = gesLimits[measurement.name] ?? 950;
            return measurement.WERT > limit;
        });
        if (anyAlarm && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
        }
    }, [measurements, gesLimits]);

    const updateLimit = (ges: string, newLimit: number) => {
        const updated = { ...gesLimits, [ges]: newLimit };
        setGesLimits(updated);
        localStorage.setItem('gesLimits', JSON.stringify(updated));
    };

    function formatDateUTC(dateString: string): string {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('tr-TR', {
            timeZone: 'UTC',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        }).format(date);
    }

    function getGesName(name: string): string {
        // NAME formatından GES adını çıkar
        const parts = name.split('.');
        if (parts.length >= 2) {
            return parts[1]; // GES adı genellikle ikinci parçada
        }
        return name;
    }

    if (!visible) return <audio ref={audioRef} src={alarmSound} preload="auto" />;

    return (
        <div className="alarms-container">
            <h1>Alarmlar</h1>
            <div className="alarms-content">
                {loading ? (
                    <div>Loading...</div>
                ) : error ? (
                    <div className="error-message">Error: {error}</div>
                ) : (
                    <div>
                        <h2>Ölçüm Değerleri</h2>
                        <div>
                            {measurements.map((measurement, index) => {
                                const limit = gesLimits[measurement.name] ?? 950;
                                const isAlarm = measurement.WERT > limit;
                                const gesName = getGesName(measurement.name);

                                return (
                                    <div
                                        key={index}
                                        className={`measurement-list-item measurement-row${isAlarm ? ' alarm-blink' : ''}`}
                                    >
                                        <div className="measurement-row">
                                            <div className="ges-title">{gesName}</div>
                                            <div className="ges-detail">
                                                <span><strong>Ölçüm:</strong> {measurement.name}</span>
                                                <span><strong>Değer:</strong> {measurement.WERT}</span>
                                                <span><strong>Zaman:</strong> {formatDateUTC(measurement.DATUMZEIT)}</span>
                                                <span>
                                                    <strong>Eşik:</strong> {limit}
                                                    {editingGES === measurement.name ? (
                                                        <>
                                                            <input
                                                                type="number"
                                                                value={newLimitValue}
                                                                onChange={e => setNewLimitValue(e.target.value)}
                                                                style={{ width: 70, marginLeft: 8 }}
                                                            />
                                                            <button
                                                                className="update-threshold-btn"
                                                                onClick={() => {
                                                                    if (newLimitValue !== '' && !isNaN(Number(newLimitValue))) {
                                                                        updateLimit(measurement.name, Number(newLimitValue));
                                                                        setEditingGES(null);
                                                                        setNewLimitValue('');
                                                                    }
                                                                }}
                                                                style={{ marginLeft: 8 }}
                                                            >Kaydet</button>
                                                            <button
                                                                style={{ marginLeft: 4 }}
                                                                onClick={() => {
                                                                    setEditingGES(null);
                                                                    setNewLimitValue('');
                                                                }}
                                                            >İptal</button>
                                                        </>
                                                    ) : (
                                                        <button
                                                            className="update-threshold-btn edit"
                                                            style={{ marginLeft: 8 }}
                                                            onClick={() => {
                                                                setEditingGES(measurement.name);
                                                                setNewLimitValue(String(limit));
                                                            }}
                                                        >Düzenle</button>
                                                    )}
                                                </span>
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
