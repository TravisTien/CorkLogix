import { SALES_PERFORMANCE } from '@/data/mockData';
import { Badge } from '@/components/ui/Badge';
import { TrendingUp, DollarSign, ShoppingBag, Target } from 'lucide-react';

export function PerformanceDashboard() {
    const performance = SALES_PERFORMANCE;

    const getPaymentStatusText = (status: 'paid' | 'pending' | 'overdue') => {
        const map = {
            paid: '已付款',
            pending: '待付款',
            overdue: '逾期',
        };
        return map[status];
    };

    const getPaymentStatusVariant = (status: 'paid' | 'pending' | 'overdue'): 'paid' | 'pending' | 'overdue' => {
        return status;
    };

    return (
        <div className="space-y-6">
            {/* 頁面標題 */}
            <div>
                <h1 className="text-xl font-bold text-gray-900 mb-1">業績看板</h1>
                <p className="text-sm text-gray-500">{performance.month} 業績概覽</p>
            </div>

            {/* 業績達成率 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                    <Target size={20} className="text-primary-800" />
                    <h2 className="font-bold text-gray-900">本月業績達成率</h2>
                </div>

                {/* 進度條 */}
                <div className="mb-4">
                    <div className="flex justify-between items-baseline mb-2">
                        <span className="text-sm text-gray-600">達成進度</span>
                        <span className="text-3xl font-bold text-primary-800">{performance.achievementRate.toFixed(1)}%</span>
                    </div>
                    <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-primary-800 to-primary-700 transition-all duration-500 ease-out"
                            style={{ width: `${Math.min(performance.achievementRate, 100)}%` }}
                        />
                    </div>
                </div>

                {/* 金額統計 */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">實際業績</p>
                        <p className="text-xl font-bold text-green-600">${performance.actualRevenue.toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 mb-1">目標業績</p>
                        <p className="text-xl font-bold text-gray-900">${performance.targetRevenue.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* 訂單統計 */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <ShoppingBag size={20} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">本月訂單數</p>
                            <p className="text-2xl font-bold text-gray-900">{performance.orderCount}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                            <TrendingUp size={20} className="text-green-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">平均訂單金額</p>
                            <p className="text-2xl font-bold text-gray-900">${Math.round(performance.actualRevenue / performance.orderCount).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 商家收款進度 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                    <DollarSign size={20} className="text-primary-800" />
                    <h2 className="font-bold text-gray-900">商家收款進度</h2>
                </div>

                <div className="space-y-3">
                    {performance.merchantStats.map((stat, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <div className="flex-1">
                                <p className="font-medium text-gray-900">{stat.merchantName}</p>
                                <p className="text-sm text-gray-500 mt-0.5">${stat.revenue.toLocaleString()}</p>
                            </div>
                            <Badge variant={getPaymentStatusVariant(stat.paymentStatus)}>
                                {getPaymentStatusText(stat.paymentStatus)}
                            </Badge>
                        </div>
                    ))}
                </div>
            </div>

            {/* 收款統計摘要 */}
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                    <p className="text-xs text-green-600 mb-1">已付款</p>
                    <p className="text-lg font-bold text-green-700">
                        {performance.merchantStats.filter(s => s.paymentStatus === 'paid').length}
                    </p>
                </div>
                <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
                    <p className="text-xs text-amber-600 mb-1">待付款</p>
                    <p className="text-lg font-bold text-amber-700">
                        {performance.merchantStats.filter(s => s.paymentStatus === 'pending').length}
                    </p>
                </div>
                <div className="bg-red-50 rounded-lg p-3 border border-red-100">
                    <p className="text-xs text-red-600 mb-1">逾期</p>
                    <p className="text-lg font-bold text-red-700">
                        {performance.merchantStats.filter(s => s.paymentStatus === 'overdue').length}
                    </p>
                </div>
            </div>
        </div>
    );
}
