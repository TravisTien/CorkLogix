import { useState, useMemo } from 'react';
import { PendingOrder, PRODUCTS, CartItem } from '@/data/mockData';
import { ArrowLeft, ShoppingCart, Trash2, Plus, Minus, Edit2, Check, AlertCircle, Clock, User, Package } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { GiftModal } from './GiftModal';
import { useToast } from '@/hooks/useToast';

interface OrderReviewDetailProps {
    order: PendingOrder;
    onBack: () => void;
    onApprove: (orderId: string) => void;
    onModify: (orderId: string, items: CartItem[], reason: string) => void;
    onReject: (orderId: string, reason: string) => void;
}

interface OrderItem extends CartItem {
    productName: string;
    originalPrice: number;
    isEditing?: boolean;
}

export function OrderReviewDetail({ order, onBack, onApprove, onModify, onReject }: OrderReviewDetailProps) {
    const [orderItems, setOrderItems] = useState<OrderItem[]>(() =>
        order.items.map(item => {
            const product = PRODUCTS.find(p => p.id === item.productId);
            return {
                ...item,
                productName: product?.name || item.productId,
                originalPrice: item.price,
            };
        })
    );
    const [selectedGifts, setSelectedGifts] = useState<OrderItem[]>(() =>
        order.items
            .filter(item => item.isGift)
            .map(item => {
                const product = PRODUCTS.find(p => p.id === item.productId);
                return {
                    ...item,
                    productName: product?.name || item.productId,
                    originalPrice: 0,
                };
            })
    );
    const [showGiftModal, setShowGiftModal] = useState(false);
    const [modificationReason, setModificationReason] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectDialog, setShowRejectDialog] = useState(false);
    const [isModified, setIsModified] = useState(false);
    const { showToast, ToastContainer } = useToast();

    const totalAmount = useMemo(() =>
        orderItems.reduce((sum, item) => sum + (item.price * item.qty), 0),
        [orderItems]
    );

    const handleUpdateQty = (index: number, newQty: number) => {
        if (newQty < 1) return;
        const updated = [...orderItems];
        updated[index].qty = newQty;
        setOrderItems(updated);
        setIsModified(true);
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
        setIsModified(true);
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
        setIsModified(true);
    };

    const handleRemoveItem = (index: number) => {
        setOrderItems(orderItems.filter((_, i) => i !== index));
        setIsModified(true);
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
        setIsModified(true);
    };

    const handleRemoveGift = (index: number) => {
        setSelectedGifts(selectedGifts.filter((_, i) => i !== index));
        setIsModified(true);
    };

    const handleUpdateGiftQty = (index: number, newQty: number) => {
        if (newQty < 1) return;
        const updated = [...selectedGifts];
        updated[index].qty = newQty;
        setSelectedGifts(updated);
        setIsModified(true);
    };

    const handleApprove = () => {
        if (confirm(`確定要核准訂單 ${order.id} 嗎？`)) {
            onApprove(order.id);
        }
    };

    const handleModify = () => {
        if (!modificationReason.trim()) {
            showToast('請填寫修改原因');
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

        if (confirm(`確定要修改訂單 ${order.id} 嗎？\n修改後需等待商家確認。`)) {
            onModify(order.id, allItems, modificationReason);
        }
    };

    const handleReject = () => {
        if (!rejectionReason.trim()) {
            showToast('請填寫退回原因');
            return;
        }

        if (confirm(`確定要退回訂單 ${order.id} 嗎？\n此操作無法復原。`)) {
            onReject(order.id, rejectionReason);
        }
    };

    const formatDateTime = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleString('zh-TW', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
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
                        <h1 className="text-xl font-bold text-gray-900 truncate">審核訂單</h1>
                        <p className="text-xs text-gray-500 truncate">{order.id}</p>
                    </div>
                    <Badge variant={order.status === 'pending_review' ? 'warning' : 'info'} className="scale-90 origin-right">
                        {order.status === 'pending_review' ? '待審核' : '待商家確認'}
                    </Badge>
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* 商家資訊 */}
                <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <User size={18} />
                        商家資訊
                    </h2>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">商家名稱</span>
                            <span className="font-medium text-gray-900">{order.merchantName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">下單日期</span>
                            <span className="font-medium text-gray-900">{order.date}</span>
                        </div>
                        {order.salesNote && (
                            <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                                <p className="text-xs text-amber-600 font-medium mb-1">商家備註</p>
                                <p className="text-sm text-gray-700">{order.salesNote}</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* 訂單明細 */}
                <section>
                    <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <ShoppingCart size={20} />
                        訂單明細
                        {isModified && <Badge variant="warning">已修改</Badge>}
                    </h2>
                    <div className="space-y-4">
                        {orderItems.map((item, index) => (
                            <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
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

                {/* 修改原因 */}
                {isModified && (
                    <section>
                        <label className="block font-bold text-gray-900 mb-2">修改原因 *</label>
                        <textarea
                            value={modificationReason}
                            onChange={(e) => setModificationReason(e.target.value)}
                            placeholder="請說明修改訂單的原因..."
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-800 resize-none"
                            rows={3}
                        />
                    </section>
                )}

                {/* 訂單歷史 */}
                {order.history && order.history.length > 0 && (
                    <section className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Clock size={18} />
                            訂單歷史
                        </h2>
                        <div className="space-y-4">
                            {order.history.map((record, index) => (
                                <div key={index} className="flex gap-3">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${record.action === 'created' ? 'bg-blue-100 text-blue-600' :
                                            record.action === 'modified' ? 'bg-amber-100 text-amber-600' :
                                                record.action === 'approved' ? 'bg-green-100 text-green-600' :
                                                    'bg-red-100 text-red-600'
                                            }`}>
                                            <Package size={16} />
                                        </div>
                                        {index < order.history!.length - 1 && (
                                            <div className="w-0.5 h-full bg-gray-200 mt-1"></div>
                                        )}
                                    </div>
                                    <div className="flex-1 pb-4">
                                        <div className="flex items-start justify-between mb-1">
                                            <span className="font-bold text-gray-900">
                                                {record.action === 'created' ? '訂單建立' :
                                                    record.action === 'modified' ? '訂單修改' :
                                                        record.action === 'approved' ? '訂單核准' :
                                                            record.action === 'rejected' ? '訂單退回' :
                                                                '商家確認'}
                                            </span>
                                            <span className="text-xs text-gray-500">{formatDateTime(record.timestamp)}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-1">{record.actor} ({record.actorRole === 'merchant' ? '商家' : record.actorRole === 'sales' ? '業務' : '系統'})</p>
                                        {record.note && (
                                            <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{record.note}</p>
                                        )}
                                        {record.changes && record.changes.length > 0 && (
                                            <div className="mt-2 space-y-1">
                                                {record.changes.map((change, idx) => (
                                                    <div key={idx} className="text-xs text-gray-600 bg-amber-50 p-2 rounded">
                                                        <span className="font-medium">{change.field}:</span> {change.oldValue} → {change.newValue}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {/* 底部操作區 */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-30">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-600">訂單總額</span>
                    <span className="text-2xl font-bold text-primary-800">${totalAmount.toLocaleString()}</span>
                </div>

                {order.status === 'pending_review' && (
                    <div className="grid grid-cols-3 gap-2">
                        <Button
                            onClick={() => setShowRejectDialog(true)}
                            variant="outline"
                            className="border-red-200 text-red-600 hover:bg-red-50"
                        >
                            退回
                        </Button>
                        {isModified ? (
                            <Button
                                onClick={handleModify}
                                variant="outline"
                                className="col-span-2 border-amber-200 text-amber-700 hover:bg-amber-50"
                            >
                                提交修改
                            </Button>
                        ) : (
                            <Button
                                onClick={handleApprove}
                                className="col-span-2"
                            >
                                核准訂單
                            </Button>
                        )}
                    </div>
                )}
            </div>

            {/* 退回訂單對話框 */}
            {showRejectDialog && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                <AlertCircle size={24} className="text-red-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-gray-900">退回訂單</h3>
                                <p className="text-sm text-gray-500">請說明退回原因</p>
                            </div>
                        </div>
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="例如：商品缺貨、地址錯誤..."
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none mb-4"
                            rows={4}
                            autoFocus
                        />
                        <div className="flex gap-2">
                            <Button
                                onClick={() => setShowRejectDialog(false)}
                                variant="outline"
                                className="flex-1"
                            >
                                取消
                            </Button>
                            <Button
                                onClick={handleReject}
                                className="flex-1 bg-red-600 hover:bg-red-700"
                            >
                                確認退回
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* 贈品選擇彈窗 */}
            <GiftModal
                isOpen={showGiftModal}
                onClose={() => setShowGiftModal(false)}
                onAddGift={handleAddGift}
            />
        </div>
    );
}
