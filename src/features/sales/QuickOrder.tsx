import { useState, useMemo } from 'react';
import { MERCHANTS, PRODUCTS, CartItem } from '@/data/mockData';
import { ShoppingCart, Trash2, Plus, Minus, Edit2, Check, ChevronDown, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { GiftModal } from './GiftModal';
import { FilterBar } from '@/components/ui/FilterBar';
import { useToast } from '@/hooks/useToast';

interface QuickOrderProps {
    onSubmitOrder: (merchantId: string, items: CartItem[], salesNote: string) => void;
    onBack: () => void;
}

interface OrderItem extends CartItem {
    productName: string;
    originalPrice: number;
    isEditing?: boolean;
}

/**
 * 代客下單頁面 - 簡化版
 * 直接顯示商品選單，在頂部選擇商家
 */
export function QuickOrder({ onSubmitOrder, onBack }: QuickOrderProps) {
    const [selectedMerchantId, setSelectedMerchantId] = useState<string>('');
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [selectedGifts, setSelectedGifts] = useState<OrderItem[]>([]);
    const [showGiftModal, setShowGiftModal] = useState(false);
    const [salesNote, setSalesNote] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('全部');
    const { showToast, ToastContainer } = useToast();

    const categories = ['全部', '啤酒', '葡萄酒', '烈酒', '清酒'];

    const filteredProducts = useMemo(() => {
        if (categoryFilter === '全部') return PRODUCTS;
        return PRODUCTS.filter(p => p.category === categoryFilter);
    }, [categoryFilter]);

    const totalAmount = useMemo(() =>
        orderItems.reduce((sum, item) => sum + (item.price * item.qty), 0),
        [orderItems]
    );

    const selectedMerchant = MERCHANTS.find(m => m.id === selectedMerchantId);

    const handleAddProduct = (productId: string) => {
        const product = PRODUCTS.find(p => p.id === productId);
        if (!product || !product.units || product.units.length === 0) return;

        const existingIndex = orderItems.findIndex(item => item.productId === productId);
        if (existingIndex >= 0) {
            const updated = [...orderItems];
            updated[existingIndex].qty += 1;
            setOrderItems(updated);
        } else {
            const defaultUnit = product.units[0];
            setOrderItems([...orderItems, {
                productId,
                productName: product.name,
                qty: 1,
                unit: defaultUnit.name,
                price: defaultUnit.price,
                originalPrice: defaultUnit.price,
            }]);
        }
        showToast(`已加入 ${product.name}`);
    };

    const handleUpdateQty = (index: number, newQty: number) => {
        if (newQty < 1) return;
        const updated = [...orderItems];
        updated[index].qty = newQty;
        setOrderItems(updated);
    };

    const handleUpdateUnit = (index: number, newUnitName: string) => {
        const item = orderItems[index];
        const product = PRODUCTS.find(p => p.id === item.productId);
        if (!product || !product.units) return;

        const newUnit = product.units.find(u => u.name === newUnitName);
        if (!newUnit) return;

        const updated = [...orderItems];
        updated[index] = {
            ...item,
            unit: newUnit.name,
            price: newUnit.price,
            originalPrice: newUnit.price,
        };
        setOrderItems(updated);
    };

    const handleToggleEditPrice = (index: number) => {
        const updated = [...orderItems];
        updated[index].isEditing = !updated[index].isEditing;
        setOrderItems(updated);
    };

    const handleUpdatePrice = (index: number, newPrice: number) => {
        const updated = [...orderItems];
        updated[index].price = newPrice;
        setOrderItems(updated);
    };

    const handleRemoveItem = (index: number) => {
        setOrderItems(orderItems.filter((_, i) => i !== index));
    };

    const handleAddGift = (giftId: string, qty: number) => {
        const gift = PRODUCTS.find(p => p.id === giftId);
        if (!gift) return;

        const existingIndex = selectedGifts.findIndex(g => g.productId === giftId);
        if (existingIndex >= 0) {
            const updated = [...selectedGifts];
            updated[existingIndex].qty += qty;
            setSelectedGifts(updated);
        } else {
            setSelectedGifts([...selectedGifts, {
                productId: giftId,
                productName: gift.name,
                qty,
                unit: '件',
                price: 0,
                originalPrice: 0,
                isGift: true,
            }]);
        }
        setShowGiftModal(false);
    };

    const handleRemoveGift = (index: number) => {
        setSelectedGifts(selectedGifts.filter((_, i) => i !== index));
    };

    const handleUpdateGiftQty = (index: number, newQty: number) => {
        if (newQty < 1) return;
        const updated = [...selectedGifts];
        updated[index].qty = newQty;
        setSelectedGifts(updated);
    };

    const handleSubmit = () => {
        if (!selectedMerchantId) {
            showToast('請選擇商家');
            return;
        }

        if (orderItems.length === 0) {
            showToast('請至少加入一項商品');
            return;
        }

        const allItems: CartItem[] = [
            ...orderItems.map(item => ({
                productId: item.productId,
                qty: item.qty,
                unit: item.unit,
                price: item.price,
            })),
            ...selectedGifts.map(gift => ({
                productId: gift.productId,
                qty: gift.qty,
                unit: gift.unit,
                price: 0,
                isGift: true,
            })),
        ];

        onSubmitOrder(selectedMerchantId, allItems, salesNote);

        // 重置表單
        setSelectedMerchantId('');
        setOrderItems([]);
        setSelectedGifts([]);
        setSalesNote('');
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-32">
            <ToastContainer />

            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-20">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="p-1 -ml-1 text-gray-600 hover:text-gray-900 cursor-pointer">
                        <ArrowLeft size={24} />
                    </button>
                    {/* 頁面標題 */}
                    <div className="flex-1">
                        <h1 className="text-xl font-bold text-gray-900">代客下單</h1>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* 商家選擇器 */}
                <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <label className="block text-sm font-bold text-gray-900 mb-3">選擇商家 *</label>
                    <div className="relative">
                        <select
                            value={selectedMerchantId}
                            onChange={(e) => setSelectedMerchantId(e.target.value)}
                            className="w-full appearance-none bg-white border-2 border-gray-200 text-gray-900 py-3 pl-4 pr-10 rounded-lg text-base font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-pointer hover:border-gray-300 transition-colors"
                        >
                            <option value="">請選擇商家...</option>
                            {MERCHANTS.map(merchant => (
                                <option key={merchant.id} value={merchant.id}>
                                    {merchant.name}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                    </div>
                    {selectedMerchant && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500 mb-1">商家資訊</p>
                            <p className="text-sm font-medium text-gray-900">{selectedMerchant.name}</p>
                            <p className="text-xs text-gray-600">聯絡人：{selectedMerchant.contactPerson}</p>
                        </div>
                    )}
                </section>

                {/* 商品分類篩選 */}
                <section>
                    <h2 className="text-base font-bold text-gray-900 mb-3">選擇商品</h2>
                    <FilterBar
                        filters={categories}
                        activeFilter={categoryFilter}
                        onChange={setCategoryFilter}
                    />
                </section>

                {/* 商品列表 */}
                <section className="grid grid-cols-2 gap-3">
                    {filteredProducts.map(product => (
                        <div
                            key={product.id}
                            onClick={() => handleAddProduct(product.id)}
                            className="bg-white rounded-lg p-3 border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all cursor-pointer active:scale-95"
                        >
                            <h3 className="font-bold text-sm text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
                            <p className="text-xs text-gray-500 mb-2">{product.category}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-base font-bold text-primary-800">
                                    ${product.units?.[0]?.price.toLocaleString()}
                                </span>
                                <Badge variant="default" className="text-xs">
                                    {product.units?.[0]?.name}
                                </Badge>
                            </div>
                        </div>
                    ))}
                </section>

                {/* 購物車 */}
                {orderItems.length > 0 && (
                    <section>
                        <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <ShoppingCart size={20} />
                            購物車 ({orderItems.length})
                        </h2>
                        <div className="space-y-4">
                            {orderItems.map((item, index) => (
                                <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1 min-w-0 mr-3">
                                            <h3 className="font-bold text-base text-gray-900 mb-1">{item.productName}</h3>

                                            {/* 單位選擇 */}
                                            <div className="relative inline-block">
                                                <select
                                                    value={item.unit}
                                                    onChange={(e) => handleUpdateUnit(index, e.target.value)}
                                                    className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-1 pl-3 pr-8 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer hover:bg-gray-100 transition-colors"
                                                >
                                                    {PRODUCTS.find(p => p.id === item.productId)?.units?.map(u => (
                                                        <option key={u.name} value={u.name}>
                                                            {u.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={14} />
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveItem(index)}
                                            className="p-2 -mr-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    {/* 數量調整 */}
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-gray-500 text-sm">數量</span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleUpdateQty(index, item.qty - 1)}
                                                className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 active:scale-95 transition-all cursor-pointer"
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="w-10 text-center font-bold text-lg">{item.qty}</span>
                                            <button
                                                onClick={() => handleUpdateQty(index, item.qty + 1)}
                                                className="w-8 h-8 flex items-center justify-center bg-primary-50 rounded-lg hover:bg-primary-100 active:scale-95 transition-all cursor-pointer text-primary-700"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* 單價編輯 */}
                                    <div className="flex items-center justify-between py-2 border-t border-gray-100">
                                        <span className="text-gray-500 text-sm">單價</span>
                                        <div className="flex items-center gap-2">
                                            {item.isEditing ? (
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        value={item.price}
                                                        onChange={(e) => handleUpdatePrice(index, Number(e.target.value))}
                                                        className="w-24 px-2 py-1 border-2 border-primary-500 rounded-lg text-base font-bold text-right focus:outline-none"
                                                        autoFocus
                                                    />
                                                    <button
                                                        onClick={() => handleToggleEditPrice(index)}
                                                        className="w-8 h-8 flex items-center justify-center bg-primary-800 text-white rounded-lg hover:bg-primary-900 cursor-pointer"
                                                    >
                                                        <Check size={16} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => handleToggleEditPrice(index)}
                                                    className="flex items-center gap-2 cursor-pointer group px-2 py-1 rounded-lg hover:bg-gray-50"
                                                >
                                                    {item.price !== item.originalPrice && (
                                                        <span className="text-xs text-gray-400 line-through">${item.originalPrice}</span>
                                                    )}
                                                    <span className={`text-base font-bold ${item.price !== item.originalPrice ? 'text-red-600' : 'text-gray-900'}`}>
                                                        ${item.price.toLocaleString()}
                                                    </span>
                                                    <Edit2 size={14} className="text-gray-400 group-hover:text-primary-600" />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* 小計 */}
                                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                                        <span className="text-sm text-gray-600 font-medium">小計</span>
                                        <span className="text-lg font-bold text-primary-800">${(item.price * item.qty).toLocaleString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* 業務自選贈品 */}
                <section className="bg-primary-50 p-4 rounded-lg border border-primary-100">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-primary-800">業務自選贈品</h3>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowGiftModal(true)}
                            className="text-primary-800 border-primary-200 hover:bg-primary-50"
                        >
                            + 選擇贈品
                        </Button>
                    </div>
                    {selectedGifts.length > 0 ? (
                        <div className="space-y-2">
                            {selectedGifts.map((gift, index) => (
                                <div key={index} className="flex justify-between items-center bg-white p-3 rounded-lg border border-primary-100">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-gray-900 text-sm">{gift.productName}</span>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handleUpdateGiftQty(index, gift.qty - 1)}
                                                className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200 cursor-pointer"
                                            >
                                                <Minus size={12} />
                                            </button>
                                            <span className="min-w-[1.5rem] text-center font-bold text-sm">{gift.qty}</span>
                                            <button
                                                onClick={() => handleUpdateGiftQty(index, gift.qty + 1)}
                                                className="w-6 h-6 flex items-center justify-center bg-primary-50 rounded hover:bg-primary-100 cursor-pointer text-primary-700"
                                            >
                                                <Plus size={12} />
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveGift(index)}
                                        className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">尚未選擇贈品</p>
                    )}
                </section>

                {/* 業務備註 */}
                <section>
                    <label className="block font-bold text-gray-900 mb-2">業務備註</label>
                    <textarea
                        value={salesNote}
                        onChange={(e) => setSalesNote(e.target.value)}
                        placeholder="選填：特殊需求、配送時間等..."
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                        rows={3}
                    />
                </section>
            </div>

            {/* 底部提交區 */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-30">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-600">訂單總額</span>
                    <span className="text-2xl font-bold text-primary-800">${totalAmount.toLocaleString()}</span>
                </div>
                <Button
                    onClick={handleSubmit}
                    className="w-full"
                    disabled={!selectedMerchantId || orderItems.length === 0}
                >
                    建立訂單
                </Button>
            </div>

            {/* 贈品選擇彈窗 */}
            <GiftModal
                isOpen={showGiftModal}
                onClose={() => setShowGiftModal(false)}
                onAddGift={handleAddGift}
            />
        </div>
    );
}
