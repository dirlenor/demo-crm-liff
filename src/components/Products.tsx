import { useEffect, useState } from 'react';
import { getActiveProducts, redeemProduct } from '../services/productService';
import { getUserPoints } from '../services/pointsService';
import type { Product, TourMember } from '../types';
import { t, getLanguage } from '../utils/i18n';
import './Products.css';

interface ProductsProps {
  userId: string;
  onRedeemSuccess?: () => void;
}

export const Products = ({ userId, onRedeemSuccess }: ProductsProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [user, setUser] = useState<TourMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [redeemingId, setRedeemingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, userData] = await Promise.all([
        getActiveProducts(),
        getUserPoints(userId),
      ]);
      setProducts(productsData);
      setUser(userData);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (product: Product) => {
    if (!user) return;

    if (user.points_balance < product.points_required) {
      setMessage(t('message.insufficientPoints'));
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    if (product.stock >= 0 && product.stock < 1) {
      setMessage('สินค้าหมด');
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setRedeemingId(product.id);
    setMessage(null);

    try {
      await redeemProduct(userId, product.id);
      setMessage(t('message.productRedeemed') || `แลก ${product.name} สำเร็จ`);
      onRedeemSuccess?.();
      await loadData();
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      console.error('Error redeeming product:', error);
      const errorMsg = error.message?.includes('Insufficient') 
        ? t('message.insufficientPoints')
        : error.message?.includes('out of stock')
        ? 'สินค้าหมด'
        : t('message.error');
      setMessage(errorMsg);
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setRedeemingId(null);
    }
  };

  const getProductName = (product: Product) => {
    const lang = getLanguage();
    return lang === 'th' ? product.name : (product.name_en || product.name);
  };

  const getProductDescription = (product: Product) => {
    const lang = getLanguage();
    return lang === 'th' ? product.description : (product.description_en || product.description);
  };

  if (loading) {
    return (
      <div className="products-loading">
        <div className="spinner"></div>
        <p>{t('message.loading')}</p>
      </div>
    );
  }

  return (
    <div className="products-section">
      {message && (
        <div className={`products-message ${message.includes('สำเร็จ') || message.includes('success') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      {products.length === 0 ? (
        <div className="no-products">
          <div className="no-products-icon">📦</div>
          <p>{t('products.noProducts') || 'ยังไม่มีสินค้า'}</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => {
            const canRedeem = user && user.points_balance >= product.points_required;
            const inStock = product.stock < 0 || product.stock > 0;
            const isRedeeming = redeemingId === product.id;

            return (
              <div key={product.id} className={`product-card ${!canRedeem ? 'disabled' : ''}`}>
                {product.image_url ? (
                  <img src={product.image_url} alt={getProductName(product)} className="product-image" />
                ) : (
                  <div className="product-image-placeholder">📦</div>
                )}
                
                <div className="product-info">
                  <h3 className="product-name">{getProductName(product)}</h3>
                  {getProductDescription(product) && (
                    <p className="product-description">{getProductDescription(product)}</p>
                  )}
                  
                  <div className="product-footer">
                    <div className="product-points">
                      <span className="points-icon">⭐</span>
                      <span className="points-value">{product.points_required.toLocaleString()}</span>
                      <span className="points-label">{t('common.points')}</span>
                    </div>
                    
                    {product.stock >= 0 && (
                      <div className="product-stock">
                        {product.stock > 0 ? `เหลือ ${product.stock}` : 'หมด'}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleRedeem(product)}
                    disabled={!canRedeem || !inStock || isRedeeming}
                    className={`redeem-product-btn ${!canRedeem ? 'disabled' : ''}`}
                  >
                    {isRedeeming ? (
                      <>
                        <span className="button-spinner"></span>
                        {t('message.loading')}
                      </>
                    ) : !inStock ? (
                      'สินค้าหมด'
                    ) : !canRedeem ? (
                      'แต้มไม่พอ'
                    ) : (
                      t('products.redeem') || 'แลกเลย'
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
