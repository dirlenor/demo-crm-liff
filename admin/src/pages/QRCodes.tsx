import { useEffect, useState } from 'react';
import { getAllQRCodes, createQRCode, deleteQRCode } from '../services/adminService';
import type { QRCoupon } from '../types';
import './QRCodes.css';

export default function QRCodes() {
  const [qrCodes, setQRCodes] = useState<QRCoupon[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [points, setPoints] = useState(10);

  useEffect(() => {
    loadQRCodes();
  }, []);

  const loadQRCodes = async () => {
    try {
      const data = await getAllQRCodes();
      setQRCodes(data);
    } catch (error) {
      console.error('Error loading QR codes:', error);
    }
  };

  const handleCreate = async () => {
    try {
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      await createQRCode(code, points);
      await loadQRCodes();
      setShowCreate(false);
    } catch (error) {
      alert('Failed to create QR code');
    }
  };

  const handleDelete = async (code: string) => {
    if (!confirm('Delete this QR code?')) return;
    try {
      await deleteQRCode(code);
      await loadQRCodes();
    } catch (error) {
      alert('Failed to delete QR code');
    }
  };

  return (
    <div className="qrcodes-page">
      <div className="dashboard-controls">
        <div className="control-tabs">
          <button className="tab active">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/></svg>
            QR Code Generator
          </button>
        </div>
        <div className="control-actions">
          <button className="add-btn" onClick={() => setShowCreate(!showCreate)}>+ Generate New QR</button>
        </div>
      </div>

      {showCreate && (
        <div className="create-form-modern qr-form">
          <div className="form-header">
            <h2>Generate QR Code</h2>
            <button className="close-form" onClick={() => setShowCreate(false)}>✕</button>
          </div>
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Points for this QR</label>
              <input type="number" value={points} onChange={(e) => setPoints(Number(e.target.value))} min="1" />
            </div>
          </div>
          <div className="form-footer">
            <button onClick={handleCreate} className="submit-btn-modern">Generate</button>
          </div>
        </div>
      )}

      <div className="table-section-modern">
        <div className="table-header-modern qrcodes-grid">
          <div className="col-checkbox"><input type="checkbox" /></div>
          <div className="col-code">Code</div>
          <div className="col-pts">Points</div>
          <div className="col-status">Status</div>
          <div className="col-used">Used By</div>
          <div className="col-actions">Actions</div>
        </div>
        <div className="table-body-modern">
          {qrCodes.length === 0 ? (
            <div className="empty-state">No QR codes generated</div>
          ) : (
            qrCodes.map((qr) => (
              <div key={qr.code} className={`table-row-modern qrcodes-grid ${qr.used ? 'used-row' : ''}`}>
                <div className="col-checkbox"><input type="checkbox" /></div>
                <div className="col-code"><span className="code-modern">{qr.code}</span></div>
                <div className="col-pts">{qr.points} pts</div>
                <div className="col-status">
                  <span className={`status-badge ${qr.used ? 'out-stock' : 'in-stock'}`}>
                    {qr.used ? 'Used' : 'Active'}
                  </span>
                </div>
                <div className="col-used">{qr.used_by ? qr.used_by.substring(0, 10) + '...' : '-'}</div>
                <div className="col-actions">
                  {!qr.used && (
                    <button onClick={() => handleDelete(qr.code)} className="icon-action-btn delete">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
