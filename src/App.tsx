import { useState, useEffect } from 'react';
import { initLiff, getLiffProfile, type LiffProfile } from './services/liff';
import { redeemQRCode, validateQRCode } from './services/qrService';
import { PointsDashboard } from './components/PointsDashboard';
import { t } from './utils/i18n';
import './App.css';

function App() {
  const [profile, setProfile] = useState<LiffProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qrMessage, setQrMessage] = useState<string | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await initLiff();

        const userProfile = await getLiffProfile();
        if (!userProfile) {
          setError('Failed to get user profile. Please make sure you are logged in to LINE.');
          setLoading(false);
          return;
        }

        setProfile(userProfile);

        const urlParams = new URLSearchParams(window.location.search);
        const qrCode = urlParams.get('code');

        if (qrCode) {
          await handleQRRedemption(qrCode, userProfile.userId);
        }
      } catch (err: any) {
        console.error('Error initializing app:', err);
        const errorMessage = err?.message || 'Failed to initialize the application.';
        setError(`Error: ${errorMessage}. Please make sure you are opening this app from LINE app.`);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  const handleQRRedemption = async (code: string, userId: string) => {
    try {
      setQrMessage(null);

      const qrCoupon = await validateQRCode(code);
      if (!qrCoupon) {
        setQrMessage(t('message.qrCodeNotFound'));
        setTimeout(() => setQrMessage(null), 5000);
        return;
      }

      if (qrCoupon.used) {
        setQrMessage(t('message.qrCodeInvalid'));
        setTimeout(() => setQrMessage(null), 5000);
        return;
      }

      const points = await redeemQRCode(code, userId);
      setQrMessage(t('message.qrCodeRedeemed', { amount: points }));
      
      window.history.replaceState({}, '', window.location.pathname);
      
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err: any) {
      console.error('Error redeeming QR code:', err);
      const errorMessage = err.message?.includes('already used') || err.message?.includes('not found')
        ? t('message.qrCodeInvalid')
        : t('message.error');
      setQrMessage(errorMessage);
      setTimeout(() => setQrMessage(null), 5000);
    }
  };

  if (loading) {
    return (
      <div className="app-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>{t('message.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <div className="error-container">
          <div className="error-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 9v4M12 17h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
            </svg>
          </div>
          <h2 className="error-title">{error}</h2>
          <div className="error-tips">
            <p className="tips-title">ตรวจสอบ:</p>
            <ul className="tips-list">
              <li>เปิดแอปจาก LINE app (ไม่ใช่ browser ธรรมดา)</li>
              <li>ตรวจสอบว่า LIFF Endpoint URL ถูกต้อง</li>
              <li>ตรวจสอบ Environment Variables ใน Vercel</li>
              <li>ดู Console Log สำหรับรายละเอียดเพิ่มเติม</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="app-container">
        <div className="error-container">
          <div className="error-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M15 9l-6 6M9 9l6 6"/>
            </svg>
          </div>
          <p className="error-title">{t('message.error')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {qrMessage && (
        <div className={`qr-message ${qrMessage.includes('สำเร็จ') || qrMessage.includes('successfully') ? 'success' : 'error'}`}>
          <div className="qr-message-content">
            <span>{qrMessage}</span>
          </div>
        </div>
      )}
      <PointsDashboard userId={profile.userId} displayName={profile.displayName} profilePicture={profile.pictureUrl} />
    </div>
  );
}

export default App;
