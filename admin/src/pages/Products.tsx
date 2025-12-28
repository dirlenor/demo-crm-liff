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
    try {
      await createProduct(formData);
      await loadProducts();
      resetForm();
      setShowCreateForm(false);
    } catch (error: any) {
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
    } catch (error: any) {
      alert(error.message || 'Failed to update product');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('ต้องการลบสินค้านี้ใช่หรือไม่?')) return;
    try {
      await deleteProduct(id);
      await loadProducts();
    } catch (error) {
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
      <div className="dashboard-controls">
        <div className="control-tabs">
          <button className="tab active">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            Table View
          </button>
        </div>
        <div className="control-actions">
          <button className="action-btn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M6 12h12m-9 6h6"/></svg> Filter</button>
          <button className="action-btn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 10l5-5 5 5M7 14l5 5 5-5"/></svg> Sort</button>
          <button className="export-btn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M16 10l-4 4m0 0l-4-4m4 4V4"/></svg> Export</button>
          <button className="add-btn" onClick={() => { resetForm(); setShowCreateForm(true); }}>+ Add New Product</button>
        </div>
      </div>

      {showCreateForm && (
        <div className="create-form-modern">
          <div className="form-header">
            <h2>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
            <button className="close-form" onClick={() => setShowCreateForm(false)}>✕</button>
          </div>
          <form onSubmit={editingId ? handleUpdate : handleCreate}>
            <div className="form-grid">
              <div className="form-group">
                <label>Product Name (TH) *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Product Name (EN)</label>
                <input type="text" value={formData.name_en} onChange={(e) => setFormData({ ...formData, name_en: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Points Required *</label>
                <input type="number" value={formData.points_required} onChange={(e) => setFormData({ ...formData, points_required: Number(e.target.value) })} min="1" required />
              </div>
              <div className="form-group">
                <label>Stock (-1 = unlimited)</label>
                <input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })} min="-1" />
              </div>
              <div className="form-group full-width">
                <label>Image URL</label>
                <input type="url" value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} placeholder="https://example.com/image.jpg" />
              </div>
              <div className="form-group full-width">
                <label>Description (TH)</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={2} />
              </div>
            </div>
            <div className="form-footer">
              <label className="checkbox-label">
                <input type="checkbox" checked={formData.active} onChange={(e) => setFormData({ ...formData, active: e.target.checked })} />
                Active
              </label>
              <button type="submit" className="submit-btn-modern">{editingId ? 'Save Changes' : 'Create Product'}</button>
            </div>
          </form>
        </div>
      )}

      <div className="table-section-modern">
        <div className="table-header-modern">
          <div className="col-checkbox"><input type="checkbox" /></div>
          <div className="col-product">Product</div>
          <div className="col-price">Points</div>
          <div className="col-stock">Stock</div>
          <div className="col-status">Status</div>
          <div className="col-actions">Actions</div>
        </div>
        <div className="table-body-modern">
          {products.map((product) => (
            <div key={product.id} className="table-row-modern">
              <div className="col-checkbox"><input type="checkbox" /></div>
              <div className="col-product">
                <div className="product-cell">
                  {product.image_url ? (
                    <img src={product.image_url} className="product-image-small" alt={product.name} />
                  ) : (
                    <div className="product-image-small"></div>
                  )}
                  <div className="product-info-cell">
                    <span className="product-name-main">{product.name}</span>
                    <span className="product-name-sub">{product.name_en || 'No English Name'}</span>
                  </div>
                </div>
              </div>
              <div className="col-price">{product.points_required.toLocaleString()} pts</div>
              <div className="col-stock">{product.stock === -1 ? 'Unlimited' : product.stock}</div>
              <div className="col-status">
                <span className={`status-badge ${product.active ? 'in-stock' : 'out-stock'}`}>
                  {product.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="col-actions">
                <div className="action-buttons-group">
                  <button onClick={() => handleEdit(product)} className="icon-action-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="icon-action-btn delete">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
