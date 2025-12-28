import { useEffect, useState } from 'react';
import { getAllMembers, updateMemberPoints } from '../services/adminService';
import type { TourMember } from '../types';
import './Members.css';

export default function Members() {
  const [members, setMembers] = useState<TourMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPoints, setEditPoints] = useState<number>(0);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const data = await getAllMembers();
      setMembers(data);
    } catch (error) {
      console.error('Error loading members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePoints = async (userId: string) => {
    try {
      await updateMemberPoints(userId, editPoints);
      await loadMembers();
      setEditingId(null);
    } catch (error) {
      alert('Failed to update points');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="members-page">
      <div className="dashboard-controls">
        <div className="control-tabs">
          <button className="tab active">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Customer Table
          </button>
        </div>
        <div className="control-actions">
          <button className="action-btn" onClick={loadMembers}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.001 0 01-15.357-2m15.357 2H15"/></svg> Refresh</button>
          <button className="export-btn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M16 10l-4 4m0 0l-4-4m4 4V4"/></svg> Export</button>
        </div>
      </div>

      <div className="table-section-modern">
        <div className="table-header-modern members-grid">
          <div className="col-checkbox"><input type="checkbox" /></div>
          <div className="col-customer">Customer</div>
          <div className="col-tour">Current Tour</div>
          <div className="col-points">Points Balance</div>
          <div className="col-joined">Joined Date</div>
          <div className="col-actions">Actions</div>
        </div>
        <div className="table-body-modern">
          {members.length === 0 ? (
            <div className="empty-state">No customers found</div>
          ) : (
            members.map((member) => (
              <div key={member.line_user_id} className="table-row-modern members-grid">
                <div className="col-checkbox"><input type="checkbox" /></div>
                <div className="col-customer">
                  <div className="customer-cell">
                    <div className="customer-avatar">
                      {member.display_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="customer-info">
                      <span className="customer-name-main">{member.display_name}</span>
                      <span className="customer-id-sub">{member.line_user_id.substring(0, 8)}...</span>
                    </div>
                  </div>
                </div>
                <div className="col-tour">{member.current_tour || 'None'}</div>
                <div className="col-points">
                  {editingId === member.line_user_id ? (
                    <div className="points-edit">
                      <input type="number" value={editPoints} onChange={(e) => setEditPoints(Number(e.target.value))} className="points-input-modern" />
                      <button onClick={() => handleUpdatePoints(member.line_user_id)} className="save-mini-btn">✓</button>
                      <button onClick={() => setEditingId(null)} className="cancel-mini-btn">✕</button>
                    </div>
                  ) : (
                    <span className="points-value-modern">{member.points_balance.toLocaleString()} pts</span>
                  )}
                </div>
                <div className="col-joined">{new Date(member.created_at).toLocaleDateString('th-TH')}</div>
                <div className="col-actions">
                  <button onClick={() => { setEditingId(member.line_user_id); setEditPoints(member.points_balance); }} className="icon-action-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
