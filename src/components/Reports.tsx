import React from 'react';

const Reports: React.FC = () => {
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
            📊
          </div>
          <div>
            <h1 style={{ 
              margin: '0', 
              fontSize: '2rem', 
              fontWeight: '700', 
              color: '#2d3748',
              letterSpacing: '-0.5px'
            }}>
              Raporlar
            </h1>
            <p style={{ 
              margin: '4px 0 0 0', 
              color: '#718096', 
              fontSize: '1rem' 
            }}>
              Enerji santrali performans raporları ve analizler
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginTop: '32px'
        }}>
          <div className="card" style={{ 
            padding: '24px', 
            border: '1px solid #e2e8f0',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
          }}>
            <h3 style={{ 
              margin: '0 0 16px 0', 
              color: '#2d3748', 
              fontSize: '1.25rem',
              fontWeight: '600'
            }}>
              📈 Günlük Performans
            </h3>
            <p style={{ 
              color: '#718096', 
              margin: '0 0 16px 0',
              lineHeight: '1.6'
            }}>
              Günlük enerji üretimi ve verimlilik raporları
            </p>
            <button style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '14px'
            }}>
              Raporu Görüntüle
            </button>
          </div>

          <div className="card" style={{ 
            padding: '24px', 
            border: '1px solid #e2e8f0',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
          }}>
            <h3 style={{ 
              margin: '0 0 16px 0', 
              color: '#2d3748', 
              fontSize: '1.25rem',
              fontWeight: '600'
            }}>
              📊 Aylık Analiz
            </h3>
            <p style={{ 
              color: '#718096', 
              margin: '0 0 16px 0',
              lineHeight: '1.6'
            }}>
              Aylık trend analizi ve karşılaştırma raporları
            </p>
            <button style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '14px'
            }}>
              Raporu Görüntüle
            </button>
          </div>

          <div className="card" style={{ 
            padding: '24px', 
            border: '1px solid #e2e8f0',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
          }}>
            <h3 style={{ 
              margin: '0 0 16px 0', 
              color: '#2d3748', 
              fontSize: '1.25rem',
              fontWeight: '600'
            }}>
              🔧 Bakım Raporları
            </h3>
            <p style={{ 
              color: '#718096', 
              margin: '0 0 16px 0',
              lineHeight: '1.6'
            }}>
              Ekipman durumu ve bakım geçmişi raporları
            </p>
            <button style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '14px'
            }}>
              Raporu Görüntüle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports; 