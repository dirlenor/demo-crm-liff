import { useEffect, useState } from 'react';
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../services/adminService';
import type { Product } from '../types';
import './Products.css';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    name_en: '',
    description: '',
    description_en: '',
    points_required: 10,
    image_url: '',
    active: true,
    stock: -1,
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('กรุณากรอกชื่อสินค้า');
      return;
    }

    try {
      await createProduct(formData);
      await loadProducts();
      resetForm();
      setShowCreateForm(false);
    } catch (error: any) {
      console.error('Error creating product:', error);
      alert(error.message || 'Failed to create product');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      name_en: product.name_en || '',
      description: product.description || '',
      description_en: product.description_en || '',
      points_required: product.points_required,
      image_url: product.image_url || '',
      active: product.active,
      stock: product.stock,
    });
    setShowCreateForm(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;

    try {
      await updateProduct(editingId, formData);
      await loadProducts();
      resetForm();
      setShowCreateForm(false);
      setEditingId(null);
    } catch (error: any) {
      console.error('Error updating product:', error);
      alert(error.message || 'Failed to update product');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('ต้องการลบสินค้านี้ใช่หรือไม่?')) return;

    try {
      await deleteProduct(id);
      await loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      name_en: '',
      description: '',
      description_en: '',
      points_required: 10,
      image_url: '',
      active: true,
      stock: -1,
    });
    setEditingId(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="products-page">
      <div className="page-header">
        <h1 className="page-title">สินค้า ({products.length})</h1>
        <button onClick={() => { resetForm(); setShowCreateForm(!showCreateForm); }} className="create-btn">
          {showCreateForm ? '✕ ยกเลิก' : '+ สร้างสินค้า'}
        </button>
      </div>

      {showCreateForm && (
        <div className="create-form">
          <h2>{editingId ? 'แก้ไขสินค้า' : 'สร้างสินค้าใหม่'}</h2>
          <form onSubmit={editingId ? handleUpdate : handleCreate}>
            <div className="form-row">
              <div className="form-group">
                <label>ชื่อสินค้า (ไทย) *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>ชื่อสินค้า (อังกฤษ)</label>
                <input
                  type="text"
                  value={formData.name_en}
                  onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>รายละเอียด (ไทย)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label>รายละเอียด (อังกฤษ)</label>
                <textarea
                  value={formData.description_en}
                  onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                  rows={3}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>แต้มที่ต้องใช้ *</label>
                <input
                  type="number"
                  value={formData.points_required}
                  onChange={(e) => setFormData({ ...formData, points_required: Number(e.target.value) })}
                  min="1"
                  required
                />
              </div>
              <div className="form-group">
                <label>จำนวนสต็อก (-1 = ไม่จำกัด)</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                  min="-1"
                />
              </div>
            </div>

            <div className="form-group">
              <label>URL รูปภาพ</label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                />
                แสดงในระบบ (Active)
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">
                {editingId ? 'บันทึกการแก้ไข' : 'สร้างสินค้า'}
              </button>
              <button type="button" onClick={() => { resetForm(); setShowCreateForm(false); }} className="cancel-btn">
                ยกเลิก
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="products-grid">
        {products.length === 0 ? (
          <div className="empty-state">ไม่มีสินค้า</div>
        ) : (
          products.map((product) => (
            <div key={product.id} className={`product-card ${!product.active ? 'inactive' : ''}`}>
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="product-image" />
              ) : (
                <div className="product-image-placeholder">📦</div>
              )}
              
              <div className="product-info">
                <div className="product-header">
                  <h3 className="product-name">{product.name}</h3>
                  {!product.active && <span className="inactive-badge">ไม่แสดง</span>}
                </div>
                
                {product.name_en && (
                  <p className="product-name-en">{product.name_en}</p>
                )}
                
                {product.description && (
                  <p className="product-description">{product.description}</p>
                )}
                
                <div className="product-details">
                  <div className="product-points">
                    <span className="points-icon">⭐</span>
                    <span className="points-value">{product.points_required.toLocaleString()}</span>
                    <span className="points-label">แต้ม</span>
                  </div>
                  
                  {product.stock >= 0 && (
                    <div className="product-stock">
                      {product.stock > 0 ? `เหลือ ${product.stock}` : 'หมด'}
                    </div>
                  )}
                </div>

                <div className="product-actions">
                  <button onClick={() => handleEdit(product)} className="edit-btn">
                    แก้ไข
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="delete-btn">
                    ลบ
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

