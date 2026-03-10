import { useState } from "react";
import { ArrowLeft, Check, AlertCircle, Truck, Package, DollarSign, Pen, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SignaturePad } from "@/components/ui/SignaturePad";
import { cn } from "@/lib/utils";
import { INITIAL_ORDERS, PRODUCTS } from "@/data/mockData";
import { useUser } from "@/context/UserContext";

type OrderStatus = 'pending_review' | 'pending_confirm' | 'shipping' | 'delivered' | 'completed';

export function OrderDetail({ orderId, onBack }: { orderId: string, onBack: () => void }) {
    const { currentUser, isBusinessConfig } = useUser();

    // Simulate fetching order
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const initialOrder = INITIAL_ORDERS.find(o => o.id === orderId) || INITIAL_ORDERS[0] as any;

    const [status, setStatus] = useState<OrderStatus>(initialOrder.status as OrderStatus);
    // Determine if we show driver options. For demo, if user is sales/admin they might want to see everything, 
    // but originally this was a toggle. Let's keep the toggle but default based on role?
    // Actually, "Driver Mode" is a specific simulation. Let's keep it manual.
    const [isDriverMode, setIsDriverMode] = useState(false);

    const [showSignaturePad, setShowSignaturePad] = useState(false);
    const [signature, setSignature] = useState<string | null>(null);
    const [virtualAccount, setVirtualAccount] = useState<string | null>(null);
    const [paymentDeadline, setPaymentDeadline] = useState<string | null>(null);
    const [isPaymentCompleted, setIsPaymentCompleted] = useState(false);

    // Demo State: Modifications
    const [modifiedItems, setModifiedItems] = useState(initialOrder.items);

    const handleSalesModify = () => {
        // Simulate Sales Rep changing quantity
        const newItems = [...modifiedItems];
        if (newItems[0]) {
            newItems[0] = { ...newItems[0], qty: 2 }; // Changed from 1 to 2
        }
        setModifiedItems(newItems);
        setStatus('pending_confirm');
    };

    const handleMerchantConfirm = () => {
        setStatus('shipping');
    };

    const handleSignatureSave = (dataUrl: string) => {
        setSignature(dataUrl);
        setShowSignaturePad(false);
        setStatus('delivered');
    };

    const handleGenerateVirtualAccount = () => {
        // Generate random 16 digit ID
        const randomAccount = Array.from({ length: 4 }, () => Math.floor(1000 + Math.random() * 9000)).join('-');
        setVirtualAccount(randomAccount);

        // Set deadline to 24 hours from now
        const deadline = new Date(Date.now() + 24 * 60 * 60 * 1000);
        setPaymentDeadline(deadline.toLocaleString('zh-TW', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }));
    };

    const handleSimulatePaymentReceived = () => {
        setIsPaymentCompleted(true);
        setTimeout(() => {
            setStatus('completed');
        }, 1500);
    };

    const handleBusinessConfirmPayment = () => {
        if (confirm("確認收到款項並將訂單設為已結案？")) {
            setStatus('completed');
        }
    };

    const getStatusDisplay = () => {
        const steps = [
            { id: 'pending_review', label: '待確認', icon: AlertCircle },
            { id: 'pending_confirm', label: '需確認', icon: Check },
            { id: 'shipping', label: '配送中', icon: Truck },
            { id: 'delivered', label: '已達/待付', icon: Package },
            { id: 'completed', label: '已結案', icon: DollarSign },
        ];

        // Simple progress logic
        const currentIndex = steps.findIndex(s => s.id === status);

        return (
            <div className="flex justify-between relative mb-8 px-2">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10" />
                {steps.map((s, index) => {
                    const Icon = s.icon;
                    const isActive = index <= currentIndex;
                    const isCurrent = index === currentIndex;

                    return (
                        <div key={s.id} className="flex flex-col items-center bg-gray-50 px-1">
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors",
                                isActive ? "bg-primary-800 border-primary-800 text-white" : "bg-white border-gray-300 text-gray-400"
                            )}>
                                <Icon className="w-4 h-4" />
                            </div>
                            <span className={cn(
                                "text-[10px] mt-1 font-medium",
                                isCurrent ? "text-primary-800" : "text-gray-400"
                            )}>{s.label}</span>
                        </div>
                    );
                })}
            </div>
        );
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const renderProductItem = (item: any, isOriginal = false) => {
        const product = PRODUCTS.find(p => p.id === item.productId);
        if (!product) return null;

        const isGift = item.isGift || item.price === 0;
        const bottlesPerCase = item.bottlesPerCase || 1;
        const totalBottles = item.unitType === 'case' ? item.qty * bottlesPerCase : item.qty;
        const displayQty = item.unitType === 'case'
            ? `${item.qty} 箱 / ${totalBottles} 瓶`
            : `${item.qty} 瓶`;

        return (
            <div className={cn(
                "flex gap-3 py-3 border-b border-gray-100 last:border-0 items-center",
                isOriginal && "opacity-50 line-through",
                isGift && "bg-gray-50/50 -mx-4 px-4"
            )}>
                {/* Product Image */}
                <div className="w-16 h-16 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                        <h4 className="text-sm font-bold text-gray-900 truncate">{product.name}</h4>
                        {isGift && (
                            <span className="bg-primary-100 text-primary-800 text-[10px] px-1.5 py-0.5 rounded font-bold">贈品</span>
                        )}
                    </div>

                    <div className="flex justify-between items-end">
                        <div className="space-y-0.5">
                            <p className="text-xs font-medium text-gray-600">
                                {!isGift ? (
                                    <>
                                        批發價：${item.price.toLocaleString()}/{item.unitType === 'case' ? '箱' : '瓶'}
                                        {" "}x {displayQty} =
                                        <span className="text-gray-900 ml-1 font-bold">
                                            ${(item.price * item.qty).toLocaleString()}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        贈品數量：{displayQty} =
                                        <span className="text-primary-600 ml-1 font-bold">$0</span>
                                    </>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6 animate-in slide-in-from-right duration-300 pb-20">
            {/* Header */}
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={onBack} className="-ml-2">
                    <ArrowLeft className="h-6 w-6" />
                </Button>
                <div>
                    <h1 className="text-xl font-bold text-gray-900">訂單詳情</h1>
                    <p className="text-xs text-gray-500">#{orderId}</p>
                </div>
                <div className="ml-auto">
                    <Button variant="ghost" size="sm" onClick={() => setIsDriverMode(!isDriverMode)} className="text-[10px] text-gray-300">
                        {isDriverMode ? '物流模式' : '商家模式'}
                    </Button>
                </div>
            </div>

            {/* Progress */}
            {getStatusDisplay()}

            {/* Order Basic Info */}
            <Card className="p-4">
                <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-5 h-5 text-gray-500" />
                    <h3 className="font-bold text-gray-900">基本資訊</h3>
                </div>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-500">訂單編號</span>
                        <span className="font-mono font-medium text-gray-900">{orderId}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">下單時間</span>
                        <span className="font-medium text-gray-900">{initialOrder.date.replace(/-/g, '/')} 14:00</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500">付款狀態</span>
                        {(() => {
                            let label = "未付款";
                            let colorClass = "bg-orange-50 text-orange-700 border-orange-100";

                            if (currentUser?.customerType === 'monthly') {
                                label = "月結 (帳期中)";
                                colorClass = "bg-blue-50 text-blue-700 border-blue-100";
                            } else if (status === 'completed') {
                                label = "已付款";
                                colorClass = "bg-green-50 text-green-700 border-green-100";
                            } else if (isPaymentCompleted) {
                                label = "核款中";
                                colorClass = "bg-amber-50 text-amber-700 border-amber-100";
                            }

                            return (
                                <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold border", colorClass)}>
                                    {label}
                                </span>
                            );
                        })()}
                    </div>
                </div>
            </Card>

            {/* Changes Alert for Merchant */}
            {status === 'pending_confirm' && !isDriverMode && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 text-amber-800">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <div className="space-y-2">
                        <h3 className="font-bold text-sm">訂單修改待確認</h3>

                        {initialOrder.modificationReason && (
                            <p className="text-xs font-medium bg-white/50 p-2 rounded border border-amber-100 mb-2">
                                原因：{initialOrder.modificationReason}
                            </p>
                        )}
                        {!initialOrder.modificationReason && (
                            <p className="text-xs">業務調整了部分內容，請確認後繼續。</p>
                        )}

                        <Button size="sm" className="w-full bg-amber-600 hover:bg-amber-700 text-white border-none" onClick={handleMerchantConfirm}>
                            確認並同意修改
                        </Button>
                    </div>
                </div>
            )}

            {/* Delivery Info */}
            <Card className="p-4">
                <div className="flex items-center gap-2 mb-4">
                    <Truck className="w-5 h-5 text-gray-500" />
                    <h3 className="font-bold text-gray-900">配送資訊</h3>
                </div>

                <div className="space-y-4">
                    {/* Store & Contact */}
                    <div className="space-y-1.5">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">收貨資訊</p>
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">門市名稱</span>
                                <span className="font-bold text-gray-900">{currentUser?.name || "Le Bistro Parisien"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">收件人</span>
                                <span className="font-medium text-gray-900">Pierre Chef</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">聯絡電話</span>
                                <span className="font-medium text-gray-900">0912-345-678</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-gray-50" />

                    {/* Address */}
                    <div className="space-y-1.5">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">配送地址</p>
                        <p className="text-sm font-medium text-gray-900 leading-relaxed">
                            台北市信義區松仁路100號
                        </p>
                    </div>

                    <div className="h-px bg-gray-50" />

                    {/* Logistics Detail */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">配送方式</p>
                            <p className="text-sm font-medium text-gray-900">公司車配送</p>
                        </div>
                        <div className="space-y-1.5">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">預計到貨</p>
                            <p className="text-sm font-bold text-primary-700">2026/03/11</p>
                        </div>
                    </div>

                    {/* Optional Tracking Code (e.g. for third party) */}
                    <div className="mt-2 bg-gray-50 p-2 rounded border border-dashed border-gray-200">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-gray-400 uppercase">物流追蹤碼</span>
                            <a href="#" className="text-[10px] font-bold text-primary-600 hover:underline">點此查詢物流狀態</a>
                        </div>
                        <p className="text-xs font-mono mt-1 text-gray-600">TW-EXP-1029384756</p>
                    </div>
                </div>
            </Card>

            {/* Items List */}
            <Card className="p-4">
                <h3 className="font-bold text-gray-900 mb-2">商品明細</h3>
                {modifiedItems.map((item: any, idx: number) => (
                    <div key={idx}>
                        {status === 'pending_confirm' && initialOrder.items[idx] && initialOrder.items[idx].qty !== item.qty && (
                            renderProductItem(initialOrder.items[idx], true)
                        )}
                        {renderProductItem(item)}
                    </div>
                ))}

                <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                    {(() => {
                        const subtotal = modifiedItems.reduce((acc: number, item: any) => acc + (item.price * item.qty), 0);
                        const tax = Math.round(subtotal * 0.05);
                        const total = subtotal + tax;
                        return (
                            <>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">未稅價</span>
                                    <span className="text-gray-900 font-medium text-base">${subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">營業稅 (5%)</span>
                                    <span className="text-gray-900 font-medium text-base">${tax.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                                    <span className="text-gray-900 font-bold">含稅總計</span>
                                    <span className="text-xl font-bold text-primary-800">
                                        ${total.toLocaleString()}
                                    </span>
                                </div>
                            </>
                        );
                    })()}
                </div>
            </Card>

            {/* Actions based on Status */}

            {/* 1. Review (Simulated Sales Action) */}
            {status === 'pending_review' && (
                <Card className="p-4 bg-gray-50 border-dashed">
                    <h3 className="text-sm font-bold text-gray-500 mb-2">[模擬] 業務/後台操作</h3>
                    <Button variant="secondary" className="w-full" onClick={handleSalesModify}>
                        模擬：庫存不足，修改數量
                    </Button>
                </Card>
            )}

            {/* 2. Shipping/Delivery (Driver) */}
            {status === 'shipping' && (
                <div className="space-y-4">
                    <Button className="w-full h-12 text-lg gap-2" onClick={() => setShowSignaturePad(true)}>
                        <Pen className="w-5 h-5" />
                        簽收確認 (貨物紀錄)
                    </Button>
                </div>
            )}

            {/* 3. Delivered - Payment (Merchant) */}
            {status === 'delivered' && (
                <Card className="p-4 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                            <Check className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">貨物已簽收</h3>
                            <p className="text-xs text-gray-500">
                                {currentUser.customerType === 'monthly' ? '此訂單將列入本月結帳單' : '請盡速完成付款以結案'}
                            </p>
                        </div>
                    </div>

                    {signature && (
                        <div className="bg-gray-50 p-2 rounded border border-gray-200">
                            <p className="text-xs text-gray-400 mb-1">簽收紀錄：</p>
                            <img src={signature} alt="Client Signature" className="h-16 object-contain mix-blend-multiply" />
                        </div>
                    )}

                    {/* Single Customer: Virtual Account Flow */}
                    {currentUser.customerType === 'single' && (
                        <div className="space-y-4">
                            {!virtualAccount ? (
                                <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-200">
                                    <h4 className="font-bold text-gray-900 mb-2">待支付款項</h4>
                                    <p className="text-sm text-gray-500 mb-4">請點擊下方按鈕取得專屬匯款帳號</p>
                                    <Button className="w-full max-w-xs mx-auto" onClick={handleGenerateVirtualAccount}>
                                        <DollarSign className="w-4 h-4 mr-2" />
                                        取得匯款帳號 (前往付款)
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 space-y-3 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-2 opacity-10">
                                            <DollarSign className="w-24 h-24 text-primary-900" />
                                        </div>

                                        <div>
                                            <p className="text-xs font-bold text-primary-800 uppercase tracking-wider mb-1">ATM 虛擬轉帳帳號</p>
                                            <p className="text-2xl font-mono font-bold text-primary-900 tracking-wider select-all">
                                                {virtualAccount}
                                            </p>
                                            <p className="text-[10px] text-primary-600 mt-1">銀行代碼: 808 (玉山銀行)</p>
                                        </div>

                                        <div className="pt-3 border-t border-primary-100 flex items-start gap-2">
                                            <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-xs font-bold text-orange-700">付款期限：{paymentDeadline}</p>
                                                <p className="text-[10px] text-orange-600/80">請務必於期限內完成轉帳，逾期帳號將失效。</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Simulation Button */}
                                    <div className="pt-2">
                                        <Button
                                            variant={isPaymentCompleted ? "secondary" : "primary"}
                                            className={cn("w-full transition-all", isPaymentCompleted ? "bg-green-100 text-green-700 border-green-200" : "")}
                                            onClick={handleSimulatePaymentReceived}
                                            disabled={isPaymentCompleted}
                                        >
                                            {isPaymentCompleted ? (
                                                <>
                                                    <Check className="w-4 h-4 mr-2" />
                                                    已模擬付款 (系統入帳中...)
                                                </>
                                            ) : (
                                                "模擬：消費者已匯款 (系統自動對帳)"
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Business/Admin: Approve Payment */}
                    {isBusinessConfig && currentUser?.customerType !== 'monthly' && (
                        <div className="border-t border-gray-100 pt-4 mt-2 px-4 pb-4">
                            <p className="text-xs font-bold text-gray-500 mb-2">[業務核帳]</p>
                            {isPaymentCompleted ? (
                                <div className="space-y-2">
                                    <div className="bg-gray-100 p-2 rounded flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-green-600" />
                                        <span className="text-xs text-gray-600">系統已收到款項</span>
                                    </div>
                                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={handleBusinessConfirmPayment}>
                                        <Check className="w-4 h-4 mr-2" />
                                        確認收款 (結案)
                                    </Button>
                                </div>
                            ) : (
                                <Button className="w-full" variant="secondary" disabled>
                                    等待商家上傳憑證
                                </Button>
                            )}
                        </div>
                    )}
                </Card>
            )}

            {status === 'completed' && (
                <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">訂單已結案</h2>
                    <p className="text-gray-500 mt-2">感謝您的訂購，期待再次為您服務</p>
                    {signature && (
                        <div className="mt-4 opacity-50">
                            <p className="text-xs text-gray-400">簽收存擋</p>
                            <img src={signature} alt="Stored Signature" className="h-12 mx-auto object-contain mix-blend-multiply" />
                        </div>
                    )}
                </div>
            )}

            {showSignaturePad && (
                <SignaturePad
                    onSave={handleSignatureSave}
                    onCancel={() => setShowSignaturePad(false)}
                />
            )}
        </div>
    );
}
