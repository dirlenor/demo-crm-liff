import { useEffect, useState } from 'react';
import { getAllQRCodes, createQRCode, deleteQRCode } from '../services/adminService';
import type { QRCoupon } from '../types';
import './QRCodes.css';

export default function QRCodes() {
  const [qrCodes, setQRCodes] = useState<QRCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newPoints, setNewPoints] = useState(10);

  useEffect(() => {
    loadQRCodes();
  }, []);

  const loadQRCodes = async () => {
    try {
      const data = await getAllQRCodes();
      setQRCodes(data);
    } catch (error) {
      console.error('Error loading QR codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) {
      alert('กรุณากรอกโค้ด');
      return;
    }

    try {
      await createQRCode(newCode.trim().toUpperCase(), newPoints);
      await loadQRCodes();
      setNewCode('');
      setNewPoints(10);
      setShowCreateForm(false);
    } catch (error: any) {
      console.error('Error creating QR code:', error);
      alert(error.message || 'Failed to create QR code');
    }
  };

  const handleDelete = async (code: string) => {
    if (!confirm(`ต้องการลบ QR Code "${code}" ใช่หรือไม่?`)) return;

    try {
      await deleteQRCode(code);
      await loadQRCodes();
    } catch (error) {
      console.error('Error deleting QR code:', error);
      alert('Failed to delete QR code');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="qrcodes-page">
      <div className="page-header">
        <h1 className="page-title">QR Codes ({qrCodes.length})</h1>
        <button onClick={() => setShowCreateForm(!showCreateForm)} className="create-btn">
          {showCreateForm ? '✕ ยกเลิก' : '+ สร้าง QR Code'}
        </button>
      </div>

      {showCreateForm && (
        <div className="create-form">
          <h2>สร้าง QR Code ใหม่</h2>
          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label>โค้ด</label>
              <input
                type="text"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                placeholder="เช่น TEST123"
                required
              />
            </div>
            <div className="form-group">
              <label>จำนวนแต้ม</label>
              <input
                type="number"
                value={newPoints}
                onChange={(e) => setNewPoints(Number(e.target.value))}
                min="1"
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-btn">สร้าง</button>
              <button type="button" onClick={() => setShowCreateForm(false)} className="cancel-btn">
                ยกเลิก
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="qrcodes-grid">
        {qrCodes.length === 0 ? (
          <div className="empty-state">ไม่มี QR Codes</div>
        ) : (
          qrCodes.map((qr) => (
            <div key={qr.code} className={`qr-card ${qr.used ? 'used' : 'active'}`}>
              <div className="qr-header">
                <div className="qr-code">{qr.code}</div>
                <span className={`qr-status ${qr.used ? 'used' : 'active'}`}>
                  {qr.used ? 'ใช้แล้ว' : 'พร้อมใช้'}
                </span>
              </div>
              <div className="qr-points">+{qr.points} แต้ม</div>
              <div className="qr-info">
                <div>สร้าง: {new Date(qr.created_at).toLocaleDateString('th-TH')}</div>
                {qr.used && qr.used_at && (
                  <div>ใช้เมื่อ: {new Date(qr.used_at).toLocaleDateString('th-TH')}</div>
                )}
              </div>
              {!qr.used && (
                <button onClick={() => handleDelete(qr.code)} className="delete-btn">
                  ลบ
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

