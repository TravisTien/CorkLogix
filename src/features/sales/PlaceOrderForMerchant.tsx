import { useState, useMemo } from 'react';
import { Merchant, PRODUCTS, CartItem } from '@/data/mockData';
import { ArrowLeft, ShoppingCart, Trash2, Plus, Minus, Edit2, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { GiftModal } from './GiftModal';
import { FilterBar } from '@/components/ui/FilterBar';
import { useToast } from '@/hooks/useToast';

interface PlaceOrderForMerchantProps {
    merchant: Merchant;
    onBack: () => void;
    onSubmitOrder: (items: CartItem[], salesNote: string) => void;
}

interface OrderItem extends CartItem {
    productName: string;
    originalPrice: number;
    isEditing?: boolean;
}

export function PlaceOrderForMerchant({ merchant, onBack, onSubmitOrder }: PlaceOrderForMerchantProps) {
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [selectedGifts, setSelectedGifts] = useState<OrderItem[]>([]);
    const [showGiftModal, setShowGiftModal] = useState(false);
    const [salesNote, setSalesNote] = useState('');
    const [activeCategory, setActiveCategory] = useState('全部');
    const { showToast, ToastContainer } = useToast();

    // 提取不包含贈品的商品類別
    const categories = useMemo(() => {
        const cats = PRODUCTS
            .filter(p => p.category !== 'Gift')
            .map(p => p.category);
        return ['全部', ...Array.from(new Set(cats))];
    }, []);

    // 根據類別篩選商品
    const filteredProducts = useMemo(() => {
        const baseProducts = PRODUCTS.filter(p => p.category !== 'Gift');
        if (activeCategory === '全部') return baseProducts;
        return baseProducts.filter(p => p.category === activeCategory);
    }, [activeCategory]);

    const handleAddProduct = (productId: string) => {
        const product = PRODUCTS.find(p => p.id === productId);
        if (!product) return;

        showToast(`已加入: ${product.name}`);

        const defaultUnit = product.units?.[product.units.length - 1] || { name: '預設', price: product.price };

        const existingIndex = orderItems.findIndex(item => item.productId === productId && item.unit === defaultUnit.name);

        if (existingIndex >= 0) {
            const updated = [...orderItems];
            updated[existingIndex].qty += 1;
            setOrderItems(updated);
        } else {
            setOrderItems([...orderItems, {
                productId,
                productName: product.name,
                qty: 1,
                unit: defaultUnit.name,
                price: defaultUnit.price,
                originalPrice: defaultUnit.price,
            }]);
        }
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

    const totalAmount = orderItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

    const handleSubmit = () => {
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

        if (allItems.length === 0) {
            alert('請至少添加一項商品');
            return;
        }

        if (confirm(`確定要為 ${merchant.name} 建立訂單嗎？\n總金額: $${totalAmount.toLocaleString()}`)) {
            onSubmitOrder(allItems, salesNote);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-32">
            <ToastContainer />
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-3 py-2 z-20">
                <div className="flex items-center gap-2">
                    <button onClick={onBack} className="p-1 -ml-1 text-gray-600 hover:text-gray-900 cursor-pointer">
                        <ArrowLeft size={22} />
                    </button>
                    <div className="flex-1 min-w-0">
                        <h1 className="font-bold text-base text-gray-900 truncate">{merchant.name}</h1>
                        <p className="text-xs text-gray-500 truncate">{merchant.contactPerson} · {merchant.phone}</p>
                    </div>
                    <Badge variant={merchant.customerType === 'monthly' ? 'info' : 'warning'} className="scale-90 origin-right">
                        {merchant.customerType === 'monthly' ? '月結' : '單次'}
                    </Badge>
                </div>
            </div>

            <div className="p-4 space-y-4">
                {/* 商品選單 */}
                <section>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="font-bold text-gray-900">商品選單</h2>
                        <span className="text-xs text-gray-500">共 {filteredProducts.length} 項</span>
                    </div>

                    {/* 分類篩選 */}
                    <div className="mb-4 -mx-1">
                        <FilterBar
                            filters={categories}
                            activeFilter={activeCategory}
                            onChange={setActiveCategory}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {filteredProducts.map(product => (
                            <button
                                key={product.id}
                                onClick={() => handleAddProduct(product.id)}
                                className="bg-white p-4 rounded-xl border border-gray-200 hover:border-primary-200 hover:shadow-lg transition-all text-left cursor-pointer flex flex-col h-full"
                            >
                                <h3 className="font-bold text-lg text-gray-900 line-clamp-2 mb-2 leading-tight">{product.name}</h3>
                                <div className="mt-auto flex items-end justify-between w-full">
                                    <p className="text-xl font-extrabold text-primary-800">${product.price.toLocaleString()}</p>
                                    {product.stock === 0 && (
                                        <Badge variant="error">缺貨</Badge>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </section>

                {/* 業務自選贈品 */}
                <section className="bg-primary-50 p-4 rounded-lg border border-primary-100">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-primary-800">
                            業務自選贈品
                        </h3>
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
                        <div className="space-y-3">
                            {selectedGifts.map((gift, index) => (
                                <div key={index} className="flex justify-between items-center bg-white p-4 rounded-lg border border-primary-100 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div>
                                            <span className="font-bold text-gray-900 block text-base mb-1">{gift.productName}</span>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleUpdateGiftQty(index, gift.qty - 1)}
                                                    className="w-7 h-7 flex items-center justify-center bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer text-gray-600"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="min-w-[1.5rem] text-center font-bold text-gray-900">{gift.qty}</span>
                                                <button
                                                    onClick={() => handleUpdateGiftQty(index, gift.qty + 1)}
                                                    className="w-7 h-7 flex items-center justify-center bg-primary-50 rounded-md hover:bg-primary-100 cursor-pointer text-primary-700"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                                <span className="text-xs text-gray-500 ml-1">{gift.unit}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => handleRemoveGift(index)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">尚未選擇贈品</p>
                    )}
                </section>

                {/* 訂單明細 */}
                {orderItems.length > 0 && (
                    <section>
                        <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <ShoppingCart size={20} />
                            訂單明細
                        </h2>
                        <div className="space-y-3">
                            {orderItems.map((item, index) => (
                                <div key={index} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1 min-w-0 mr-3">
                                            <h3 className="font-bold text-lg text-gray-900 leading-snug mb-1">{item.productName}</h3>

                                            {/* 單位選擇 */}
                                            <div className="relative inline-block">
                                                <select
                                                    value={item.unit}
                                                    onChange={(e) => handleUpdateUnit(index, e.target.value)}
                                                    className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-1 pl-3 pr-8 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-pointer hover:bg-gray-100 transition-colors"
                                                >
                                                    {PRODUCTS.find(p => p.id === item.productId)?.units?.map(u => (
                                                        <option key={u.name} value={u.name}>
                                                            {u.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveItem(index)}
                                            className="p-2 -mr-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer flex-shrink-0"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>

                                    {/* 數量調整 */}
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-gray-500 text-base">數量</span>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => handleUpdateQty(index, item.qty - 1)}
                                                className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 active:scale-95 transition-all cursor-pointer text-gray-600"
                                            >
                                                <Minus size={18} />
                                            </button>
                                            <span className="w-12 text-center font-bold text-xl text-gray-900">{item.qty}</span>
                                            <button
                                                onClick={() => handleUpdateQty(index, item.qty + 1)}
                                                className="w-10 h-10 flex items-center justify-center bg-primary-50 rounded-lg hover:bg-primary-100 active:scale-95 transition-all cursor-pointer text-primary-700"
                                            >
                                                <Plus size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* 單價編輯 */}
                                    <div className="flex items-center justify-between py-3 border-t border-gray-100">
                                        <span className="text-gray-500 text-base">單價</span>
                                        <div className="flex items-center gap-2">
                                            {item.isEditing ? (
                                                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-200">
                                                    <input
                                                        type="number"
                                                        value={item.price}
                                                        onChange={(e) => handleUpdatePrice(index, Number(e.target.value))}
                                                        className="w-28 px-3 py-2 border-2 border-primary-500 rounded-lg text-lg font-bold text-right focus:outline-none focus:ring-2 focus:ring-primary-200"
                                                        autoFocus
                                                    />
                                                    <button
                                                        onClick={() => handleToggleEditPrice(index)}
                                                        className="w-10 h-10 flex items-center justify-center bg-primary-800 text-white rounded-lg hover:bg-primary-900 shadow-sm cursor-pointer"
                                                    >
                                                        <Check size={18} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => handleToggleEditPrice(index)}
                                                    className="flex items-center gap-2 cursor-pointer group px-3 py-1.5 -mr-2 rounded-lg bg-gray-50 border border-gray-200 hover:bg-primary-50 hover:border-primary-200 transition-all active:scale-95"
                                                >
                                                    {item.price !== item.originalPrice && (
                                                        <span className="text-sm text-gray-400 line-through decoration-gray-400">${item.originalPrice}</span>
                                                    )}
                                                    <span className={`text-lg font-bold ${item.price !== item.originalPrice ? 'text-red-600' : 'text-gray-900 group-hover:text-primary-800'}`}>
                                                        ${item.price.toLocaleString()}
                                                    </span>
                                                    <Edit2 size={16} className="text-gray-400 group-hover:text-primary-600 transition-colors" />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* 小計 */}
                                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                                        <span className="text-base text-gray-600 font-medium">小計</span>
                                        <span className="text-xl font-extrabold text-primary-800">${(item.price * item.qty).toLocaleString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* 業務備註 */}
                <section>
                    <label className="block font-bold text-gray-900 mb-2">業務備註</label>
                    <textarea
                        value={salesNote}
                        onChange={(e) => setSalesNote(e.target.value)}
                        placeholder="輸入特殊需求或備註..."
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-800 resize-none"
                        rows={3}
                    />
                </section>
            </div>

            {/* 底部操作區 */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-30">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-600">訂單總額</span>
                    <span className="text-2xl font-bold text-primary-800">${totalAmount.toLocaleString()}</span>
                </div>
                <Button
                    onClick={handleSubmit}
                    disabled={orderItems.length === 0}
                    className="w-full"
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
