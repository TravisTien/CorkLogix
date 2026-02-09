import { Layout } from "@/components/layout/Layout";
import { SalesContact } from "@/features/sales/SalesContact";
import { ProductList } from "@/features/product/ProductList";
import { OrderList } from "@/features/order/OrderList";
import { OrderDetail } from "@/features/order/OrderDetail";
import { CartList } from "@/features/cart/CartList";
import { ProductDetail } from "@/features/product/ProductDetail";
import { useState } from "react";
import { INITIAL_CART, CartItem, PRODUCTS } from "@/data/mockData";
import { UserProvider, useUser } from "@/context/UserContext";

import { UserProfile } from "@/features/profile/UserProfile";

function App() {
    return (
        <UserProvider>
            <AppContent />
        </UserProvider>
    );
}

function AppContent() {
    const [activeTab, setActiveTab] = useState('home');
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const [cartItems, setCartItems] = useState<CartItem[]>(INITIAL_CART);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        setSelectedOrderId(null);
        setSelectedProductId(null);
    };

    const refreshCartPromotions = (currentCart: CartItem[]) => {
        // 1. Remove all existing gifts
        const nonGiftItems = currentCart.filter(item => !item.isGift);
        const newCart = [...nonGiftItems];

        // 2. Check conditions and add gifts
        // Group by product to check thresholds (assuming simple logic: one product triggers gift)
        // In reality, might need to sum quantities across different units if they map to same SKU base.
        // For this demo, let's look at specific products in cart.

        PRODUCTS.forEach(product => {
            if (product.activePromotion?.type === 'buy_x_get_y') {
                const promo = product.activePromotion;
                // Find all items in cart matching this product
                const cartItemsForProduct = newCart.filter(item => item.productId === product.id);
                const totalQty = cartItemsForProduct.reduce((sum, item) => sum + item.qty, 0); // Simplified: treating all units as 1 for threshold? 
                // Wait, units have different sizes (Case vs Bottle). 
                // Let's assume the promotion is based on "Case" (Box) quantity implies typical B2B unit.
                // Or simplified: Just check "qty" sum.

                if (totalQty >= (promo.conditionQty || 5)) {
                    // Check if gift already exists? No, we rebuilt from nonGiftItems.
                    // Add Gift
                    newCart.push({
                        productId: promo.giftId || 'gift-generic',
                        qty: 1, // Usually 1 gift per threshold? Or 1 per N? Let's say 1 per order meeting threshold.
                        unit: '個',
                        price: 0,
                        isGift: true,
                        giftSourceId: product.id
                    });
                }
            }
        });

        return newCart;
    };

    const addToCart = (productId: string, qty: number = 1, unit?: string, price?: number) => {
        setCartItems(prev => {
            const product = PRODUCTS.find(p => p.id === productId);
            // logic to use salePrice if valid
            let finalPrice = price || product?.price || 0;

            if (product?.activePromotion?.type === 'limited_time' && product.activePromotion.salePrice) {
                // Check date validity
                const endDate = new Date(product.activePromotion.endDate || '');
                // Check if the item being added corresponds to the main unit (price matches base price)
                // This avoids applying case-price sales to single bottles
                const isBaseUnit = !price || price === product.price;

                if (endDate > new Date() && isBaseUnit) {
                    finalPrice = product.activePromotion.salePrice;
                }
            }

            const existingIndex = prev.findIndex(item => item.productId === productId && item.unit === unit);
            let nextCart = [...prev];

            if (existingIndex >= 0) {
                nextCart[existingIndex].qty += qty;
            } else {
                nextCart.push({ productId, qty, unit: unit || '預設', price: finalPrice });
            }

            return refreshCartPromotions(nextCart);
        });
    };

    const removeFromCart = (productId: string, unit?: string) => {
        setCartItems(prev => {
            const nextCart = prev.filter(item => !(item.productId === productId && item.unit === unit));
            return refreshCartPromotions(nextCart);
        });
    };

    const updateQuantity = (productId: string, newQty: number, unit?: string) => {
        if (newQty < 1) return;
        setCartItems(prev => {
            const nextCart = prev.map(item =>
                (item.productId === productId && item.unit === unit)
                    ? { ...item, qty: newQty }
                    : item
            );
            return refreshCartPromotions(nextCart);
        });
    };

    const { currentUser } = useUser();

    const handleCheckout = () => {
        const total = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

        let message = `確定要送出訂單嗎？\n總計 ${cartItems.length} 項商品\n總金額: $${total.toLocaleString()}`;
        if (currentUser.customerType === 'monthly') {
            message += `\n\n[月結模式] 此訂單將計入本月帳款，無需立即付款。`;
        } else if (currentUser.customerType === 'single') {
            message += `\n\n[單次匯款] 貨到簽收後，請記得上傳匯款憑證。`;
        }

        if (confirm(message)) {
            alert(currentUser.customerType === 'monthly' ? "訂單已建立！(月結)" : "訂單已建立！請留意配送通知。");
            setCartItems([]);
            setActiveTab('orders');
        }
    };

    return (
        <Layout activeTab={activeTab} onTabChange={handleTabChange}>
            {activeTab === 'home' && !selectedProductId && (
                <>
                    <section>
                        <SalesContact />
                    </section>

                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-900">本月推薦</h2>
                            <span className="text-sm text-primary-800 font-medium cursor-pointer">查看全部</span>
                        </div>
                        <ProductList
                            onAddToCart={(id) => addToCart(id, 1)}
                            onProductClick={setSelectedProductId}
                        />
                    </section>
                </>
            )}

            {activeTab === 'home' && selectedProductId && (
                <div className="fixed inset-0 z-50 bg-white">
                    <ProductDetail
                        productId={selectedProductId}
                        onBack={() => setSelectedProductId(null)}
                        onAddToCart={addToCart}
                    />
                </div>
            )}

            {activeTab === 'cart' && (
                <CartList
                    items={cartItems}
                    onUpdateQty={updateQuantity}
                    onRemove={removeFromCart}
                    onCheckout={handleCheckout}
                />
            )}

            {activeTab === 'orders' && !selectedOrderId && (
                <OrderList onSelectOrder={setSelectedOrderId} />
            )}

            {activeTab === 'orders' && selectedOrderId && (
                <OrderDetail
                    orderId={selectedOrderId}
                    onBack={() => setSelectedOrderId(null)}
                />
            )}




            {activeTab === 'profile' && (
                <UserProfile />
            )}
        </Layout>
    );
}

export default App;
