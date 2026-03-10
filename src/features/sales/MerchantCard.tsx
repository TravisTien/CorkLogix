import { Merchant } from '@/data/mockData';
import { Badge } from '@/components/ui/Badge';
import { Phone, Calendar, ShoppingBag, DollarSign } from 'lucide-react';

interface MerchantCardProps {
    merchant: Merchant;
    onClick: () => void;
}

export function MerchantCard({ merchant, onClick }: MerchantCardProps) {
    const getCustomerTypeBadge = (type: string) => {
        return type === 'monthly' ? '月結' : '單次';
    };

    const getCustomerTypeVariant = (type: string): 'info' | 'warning' => {
        return type === 'monthly' ? 'info' : 'warning';
    };

    return (
        <div
            onClick={onClick}
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary-200 transition-all duration-200 cursor-pointer"
        >
            {/* 商家名稱與標籤 */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{merchant.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone size={14} />
                        <span>{merchant.contactPerson}</span>
                    </div>
                </div>
                <div className="flex flex-col gap-1 items-end">
                    <Badge variant={getCustomerTypeVariant(merchant.customerType)}>
                        {getCustomerTypeBadge(merchant.customerType)}
                    </Badge>
                    {merchant.pendingOrdersCount > 0 && (
                        <div className="flex items-center gap-1 bg-red-50 text-red-600 px-2 py-0.5 rounded-full text-xs font-medium">
                            <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></span>
                            {merchant.pendingOrdersCount} 筆待辦
                        </div>
                    )}
                </div>
            </div>

            {/* 統計資訊 */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
                        <ShoppingBag size={16} className="text-primary-800" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">本月訂單</p>
                        <p className="font-semibold text-gray-900">{merchant.currentMonthOrders} 筆</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                        <DollarSign size={16} className="text-green-600" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">本月金額</p>
                        <p className="font-semibold text-gray-900">${(merchant.currentMonthRevenue / 1000).toFixed(0)}K</p>
                    </div>
                </div>
            </div>

            {/* 最後下單日期 */}
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-3">
                <Calendar size={12} />
                <span>最後下單: {merchant.lastOrderDate}</span>
            </div>
        </div>
    );
}
