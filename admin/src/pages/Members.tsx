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

  const handleEdit = (member: TourMember) => {
    setEditingId(member.line_user_id);
    setEditPoints(member.points_balance);
  };

  const handleSave = async (userId: string) => {
    try {
      await updateMemberPoints(userId, editPoints);
      await loadMembers();
      setEditingId(null);
    } catch (error) {
      console.error('Error updating points:', error);
      alert('Failed to update points');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="members-page">
      <div className="page-header">
        <h1 className="page-title">สมาชิก ({members.length})</h1>
        <button onClick={loadMembers} className="refresh-btn">🔄 Refresh</button>
      </div>

      <div className="members-table-container">
        <table className="members-table">
          <thead>
            <tr>
              <th>ชื่อ</th>
              <th>ทริปปัจจุบัน</th>
              <th>แต้ม</th>
              <th>วันที่สมัคร</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {members.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty-state">ไม่มีสมาชิก</td>
              </tr>
            ) : (
              members.map((member) => (
                <tr key={member.line_user_id}>
                  <td>
                    <div className="member-name">{member.display_name}</div>
                    <div className="member-id">{member.line_user_id.substring(0, 20)}...</div>
                  </td>
                  <td>{member.current_tour || '-'}</td>
                  <td>
                    {editingId === member.line_user_id ? (
                      <input
                        type="number"
                        value={editPoints}
                        onChange={(e) => setEditPoints(Number(e.target.value))}
                        className="points-input"
                      />
                    ) : (
                      <span className="points-value">{member.points_balance.toLocaleString()}</span>
                    )}
                  </td>
                  <td>{new Date(member.created_at).toLocaleDateString('th-TH')}</td>
                  <td>
                    {editingId === member.line_user_id ? (
                      <div className="action-buttons">
                        <button onClick={() => handleSave(member.line_user_id)} className="save-btn">
                          บันทึก
                        </button>
                        <button onClick={handleCancel} className="cancel-btn">
                          ยกเลิก
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => handleEdit(member)} className="edit-btn">
                        แก้ไขแต้ม
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

