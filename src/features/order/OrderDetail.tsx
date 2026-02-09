import { useState } from "react";
import { ArrowLeft, Check, AlertCircle, Truck, Package, DollarSign, Pen, Camera, Eye } from "lucide-react";
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
    const [paymentProof, setPaymentProof] = useState<string | null>(null);

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

    const handlePaymentUpload = () => {
        // Simulate file upload
        const fakeProofUrl = 'https://placehold.co/400x600/e2e8f0/475569/png?text=Bank+Transfer+Receipt';
        setPaymentProof(fakeProofUrl);
        alert("憑證上傳成功！等待業務核帳。");
        // Status stays 'delivered' until business confirms, or we could have a 'verifying' status.
        // For simplicity, let's keep it 'delivered' but show "Pending Verification".
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

        return (
            <div className={cn("flex justify-between py-2 border-b border-gray-100 last:border-0", isOriginal && "opacity-50 line-through")}>
                <div className="flex gap-2">
                    <span className="text-gray-500 text-sm">x{item.qty}</span>
                    <span className="text-gray-900 text-sm font-medium">{product.name}</span>
                </div>
                <span className="text-gray-900 font-medium text-sm">${(item.price * item.qty).toLocaleString()}</span>
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

                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-gray-500 font-medium">總計金額</span>
                    <span className="text-xl font-bold text-primary-800">
                        ${modifiedItems.reduce((acc: number, item: any) => acc + (item.price * item.qty), 0).toLocaleString()}
                    </span>
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
                    <Card className="p-4">
                        <h3 className="font-bold mb-4">配送資訊</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-gray-500">收件人</span><span>Pierre Chef</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">電話</span><span>0912-345-678</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">地址</span><span>台北市信義區松仁路100號</span></div>
                        </div>
                    </Card>

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

                    {/* Single Customer: Payment Info & Upload */}
                    {currentUser.customerType === 'single' && (
                        <>
                            <div className="bg-gray-100 rounded-lg p-3 text-sm space-y-1">
                                <p className="font-bold text-gray-700">匯款帳號 (玉山 808)</p>
                                <p className="font-mono text-lg text-gray-900">1234-5678-9012-3456</p>
                            </div>

                            {paymentProof ? (
                                <div className="bg-green-50 p-3 rounded border border-green-200 text-center">
                                    <p className="text-sm font-bold text-green-800 flex items-center justify-center gap-2">
                                        <Check className="w-4 h-4" /> 憑證已上傳
                                    </p>
                                    <p className="text-xs text-green-600 mt-1">等待業務核對中</p>
                                    <Button size="sm" variant="ghost" className="mt-2 text-xs text-green-700 underline" onClick={() => window.open(paymentProof, '_blank')}>
                                        查看憑證
                                    </Button>
                                </div>
                            ) : (
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors" onClick={handlePaymentUpload}>
                                    <Camera className="w-8 h-8 text-gray-400" />
                                    <span className="text-sm text-gray-500">點擊上傳匯款憑證/收據</span>
                                </div>
                            )}
                        </>
                    )}

                    {/* Business/Admin: Approve Payment */}
                    {isBusinessConfig && currentUser.customerType !== 'monthly' && (
                        <div className="border-t border-gray-100 pt-4 mt-2">
                            <p className="text-xs font-bold text-gray-500 mb-2">[業務核帳]</p>
                            {paymentProof ? (
                                <div className="space-y-2">
                                    <div className="bg-gray-100 p-2 rounded flex items-center gap-2">
                                        <Eye className="w-4 h-4 text-gray-500" />
                                        <span className="text-xs text-gray-600">商家已上傳憑證</span>
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
