import { ShoppingBag, ArrowRight, Calendar, Gift } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CartItem as CartItemComponent } from "./CartItem";
import { CartItem } from "@/data/mockData";
import { useUser } from "@/context/UserContext";

interface CartListProps {
    items: CartItem[];
    onUpdateQty: (id: string, newQty: number, unit?: string) => void;
    onRemove: (id: string, unit?: string) => void;
    onCheckout: () => void;
}

export function CartList({ items, onUpdateQty, onRemove, onCheckout }: CartListProps) {
    const { currentUser } = useUser();

    const total = items.reduce((sum, item) => {
        return sum + (item.price * item.qty);
    }, 0);

    const getEstimatedSettlementDate = () => {
        const today = new Date();
        const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 5);
        return nextMonth.toLocaleDateString('zh-TW');
    };

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-gray-400 space-y-4">
                <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center">
                    <ShoppingBag className="h-10 w-10 text-gray-300" />
                </div>
                <p className="text-lg font-medium">您的採購車是空的</p>
                <p className="text-sm text-gray-400">去逛逛精選商品吧！</p>
            </div>
        );
    }

    // Checkout Summary Component (reused in both mobile and desktop views)
    const CheckoutSummary = ({ className }: { className?: string }) => (
        <div className={className}>
            <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">小計</span>
                    <span className="font-bold text-gray-900">${total.toLocaleString()}</span>
                </div>

                {currentUser.customerType === 'monthly' && (
                    <div className="bg-primary-50 p-3 rounded-lg border border-primary-100 space-y-2">
                        <div className="flex items-center gap-2 text-primary-800 font-bold text-sm">
                            <Calendar className="w-4 h-4" />
                            <span>月結模式適用</span>
                        </div>
                        <div className="flex justify-between text-xs text-primary-700">
                            <span>預計結帳日</span>
                            <span>{getEstimatedSettlementDate()}</span>
                        </div>
                        <div className="flex justify-between text-xs text-primary-700">
                            <span>本月累計 (含此單)</span>
                            <span>${(total + 150000).toLocaleString()} (模擬)</span>
                        </div>
                    </div>
                )}

                <div className="flex justify-between items-center text-lg font-bold">
                    <span className="text-gray-900">總金額</span>
                    <span className="text-primary-800">${total.toLocaleString()}</span>
                </div>
                <Button
                    className="w-full h-12 text-lg shadow-lg shadow-primary-900/20"
                    onClick={onCheckout}
                >
                    {currentUser.customerType === 'monthly' ? '確認下單 (月結)' : '前往結帳'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col md:flex-row md:gap-8 relative">
            {/* Cart Items - Main Column */}
            <div className="flex-1 space-y-4 pb-48 md:pb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">採購清單 ({items.length})</h2>
                {items.map((item, index) => (
                    <div key={`${item.productId}-${item.unit}-${index}`} className={item.isGift ? "bg-purple-50 rounded-lg p-2 border border-purple-100" : ""}>
                        {item.isGift && (
                            <div className="flex items-center gap-2 text-xs text-purple-700 font-bold mb-2 ml-2">
                                <Gift className="w-3 h-3" />
                                <span>滿額贈品</span>
                            </div>
                        )}
                        <CartItemComponent
                            productId={item.productId}
                            qty={item.qty}
                            unit={item.unit}
                            price={item.price}
                            onUpdateQty={(id, qty) => !item.isGift && onUpdateQty(id, qty, item.unit)}
                            onRemove={(id) => !item.isGift && onRemove(id, item.unit)}
                        />
                    </div>
                ))}
            </div>

            {/* Desktop: Sticky Sidebar Summary */}
            <CheckoutSummary className="hidden md:block w-80 lg:w-96 sticky top-24 self-start bg-white rounded-xl border border-gray-200 p-6 shadow-sm" />

            {/* Mobile: Fixed Bottom Summary */}
            <div className="fixed bottom-16 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40 md:hidden">
                <div className="max-w-md mx-auto">
                    <CheckoutSummary />
                </div>
            </div>
        </div>
    );
}

