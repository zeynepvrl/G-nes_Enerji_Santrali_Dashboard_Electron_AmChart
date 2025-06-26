import React, { useState } from 'react';

const Settings: React.FC = () => {
  const [notifications, setNotifications] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [theme, setTheme] = useState('light');

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '32px 0' 
    }}>
      <div className="card" style={{ padding: '40px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px', 
          marginBottom: '32px' 
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '24px'
          }}>
            ⚙️
          </div>
          <div>
            <h1 style={{ 
              margin: '0', 
              fontSize: '2rem', 
              fontWeight: '700', 
              color: '#2d3748',
              letterSpacing: '-0.5px'
            }}>
              Ayarlar
            </h1>
            <p style={{ 
              margin: '4px 0 0 0', 
              color: '#718096', 
              fontSize: '1rem' 
            }}>
              Uygulama tercihleri ve sistem konfigürasyonu
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '32px',
          marginTop: '32px'
        }}>
          {/* Bildirim Ayarları */}
          <div className="card" style={{ 
            padding: '24px', 
            border: '1px solid #e2e8f0',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
          }}>
            <h3 style={{ 
              margin: '0 0 20px 0', 
              color: '#2d3748', 
              fontSize: '1.25rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              🔔 Bildirim Ayarları
            </h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                padding: '12px',
                borderRadius: '8px',
                transition: 'background 0.2s ease'
              }}>
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  style={{
                    width: '18px',
                    height: '18px',
                    accentColor: '#667eea'
                  }}
                />
                <span style={{ color: '#4a5568', fontWeight: '500' }}>
                  Alarm bildirimlerini etkinleştir
                </span>
              </label>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                padding: '12px',
                borderRadius: '8px',
                transition: 'background 0.2s ease'
              }}>
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  style={{
                    width: '18px',
                    height: '18px',
                    accentColor: '#667eea'
                  }}
                />
                <span style={{ color: '#4a5568', fontWeight: '500' }}>
                  Otomatik veri yenileme
                </span>
              </label>
            </div>
          </div>

          {/* Görünüm Ayarları */}
          <div className="card" style={{ 
            padding: '24px', 
            border: '1px solid #e2e8f0',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
          }}>
            <h3 style={{ 
              margin: '0 0 20px 0', 
              color: '#2d3748', 
              fontSize: '1.25rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              🎨 Görünüm Ayarları
            </h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#4a5568',
                fontWeight: '500',
                fontSize: '14px'
              }}>
                Tema Seçimi
              </label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  background: '#ffffff',
                  color: '#2d3748'
                }}
              >
                <option value="light">Açık Tema</option>
                <option value="dark">Koyu Tema</option>
                <option value="auto">Sistem</option>
              </select>
            </div>
          </div>

          {/* Sistem Bilgileri */}
          <div className="card" style={{ 
            padding: '24px', 
            border: '1px solid #e2e8f0',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
          }}>
            <h3 style={{ 
              margin: '0 0 20px 0', 
              color: '#2d3748', 
              fontSize: '1.25rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              💻 Sistem Bilgileri
            </h3>
            
            <div style={{ marginBottom: '12px' }}>
              <span style={{ color: '#718096', fontSize: '14px' }}>Uygulama Versiyonu:</span>
              <span style={{ color: '#2d3748', fontWeight: '500', marginLeft: '8px' }}>1.0.9</span>
            </div>
            
            <div style={{ marginBottom: '12px' }}>
              <span style={{ color: '#718096', fontSize: '14px' }}>Platform:</span>
              <span style={{ color: '#2d3748', fontWeight: '500', marginLeft: '8px' }}>Windows</span>
            </div>
            
            <div style={{ marginBottom: '12px' }}>
              <span style={{ color: '#718096', fontSize: '14px' }}>Node.js:</span>
              <span style={{ color: '#2d3748', fontWeight: '500', marginLeft: '8px' }}>v18.0.0</span>
            </div>
            
            <div style={{ marginBottom: '12px' }}>
              <span style={{ color: '#718096', fontSize: '14px' }}>Electron:</span>
              <span style={{ color: '#2d3748', fontWeight: '500', marginLeft: '8px' }}>v28.1.0</span>
            </div>
          </div>

          {/* Veritabanı Ayarları */}
          <div className="card" style={{ 
            padding: '24px', 
            border: '1px solid #e2e8f0',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
          }}>
            <h3 style={{ 
              margin: '0 0 20px 0', 
              color: '#2d3748', 
              fontSize: '1.25rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              🗄️ Veritabanı Ayarları
            </h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#4a5568',
                fontWeight: '500',
                fontSize: '14px'
              }}>
                Bağlantı Durumu
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                background: '#f0fff4',
                border: '1px solid #9ae6b4',
                borderRadius: '6px',
                color: '#22543d'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  background: '#48bb78',
                  borderRadius: '50%'
                }}></div>
                <span style={{ fontSize: '14px', fontWeight: '500' }}>Bağlı</span>
              </div>
            </div>

            <button style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '14px',
              width: '100%'
            }}>
              Veritabanını Test Et
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 