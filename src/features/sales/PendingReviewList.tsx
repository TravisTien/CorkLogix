import { useState, useMemo } from 'react';
import { PENDING_ORDERS, PendingOrder } from '@/data/mockData';
import { Badge } from '@/components/ui/Badge';
import { Calendar, FileText, Search } from 'lucide-react';
import { FilterBar } from '@/components/ui/FilterBar';

interface PendingReviewListProps {
    onSelectOrder: (orderId: string) => void;
}

type StatusFilter = '全部' | '待審核' | '待商家確認';
type SortOption = '最新' | '最舊' | '金額高至低' | '金額低至高';

export function PendingReviewList({ onSelectOrder }: PendingReviewListProps) {
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('全部');
    const [sortOption, setSortOption] = useState<SortOption>('最新');
    const [searchQuery, setSearchQuery] = useState('');

    const statusFilters: StatusFilter[] = ['全部', '待審核', '待商家確認'];
    const sortOptions: SortOption[] = ['最新', '最舊', '金額高至低', '金額低至高'];

    // 篩選與排序邏輯
    const filteredAndSortedOrders = useMemo(() => {
        let filtered = [...PENDING_ORDERS];

        // 狀態篩選
        if (statusFilter === '待審核') {
            filtered = filtered.filter(order => order.status === 'pending_review');
        } else if (statusFilter === '待商家確認') {
            filtered = filtered.filter(order => order.status === 'pending_confirm');
        }

        // 搜尋篩選
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(order =>
                order.merchantName.toLowerCase().includes(query) ||
                order.id.toLowerCase().includes(query)
            );
        }

        // 排序
        filtered.sort((a, b) => {
            switch (sortOption) {
                case '最新':
                    return new Date(b.date).getTime() - new Date(a.date).getTime();
                case '最舊':
                    return new Date(a.date).getTime() - new Date(b.date).getTime();
                case '金額高至低':
                    return b.total - a.total;
                case '金額低至高':
                    return a.total - b.total;
                default:
                    return 0;
            }
        });

        return filtered;
    }, [statusFilter, sortOption, searchQuery]);



    const getStatusBadge = (order: PendingOrder) => {
        if (order.status === 'pending_review') {
            return <Badge variant="warning">待審核</Badge>;
        } else if (order.status === 'pending_confirm') {
            return <Badge variant="info">待商家確認</Badge>;
        }
        return null;
    };

    return (
        <div className="space-y-4">
            {/* 頁面標題 */}
            <div>
                <h1 className="text-xl font-bold text-gray-900 mb-1">待審核訂單</h1>
                <p className="text-sm text-gray-500">檢視並確認商家訂單</p>
            </div>

            {/* 搜尋欄 */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="搜尋商家名稱或訂單編號..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
            </div>

            {/* 篩選與排序 */}
            <div className="space-y-3">
                <div>
                    <p className="text-xs font-medium text-gray-500 mb-2">狀態篩選</p>
                    <FilterBar
                        filters={statusFilters}
                        activeFilter={statusFilter}
                        onChange={(filter) => setStatusFilter(filter as StatusFilter)}
                    />
                </div>
                <div>
                    <p className="text-xs font-medium text-gray-500 mb-2">排序方式</p>
                    <FilterBar
                        filters={sortOptions}
                        activeFilter={sortOption}
                        onChange={(option) => setSortOption(option as SortOption)}
                    />
                </div>
            </div>

            {/* 訂單列表 */}
            <div className="space-y-4">
                {filteredAndSortedOrders.length > 0 ? (
                    filteredAndSortedOrders.map(order => (
                        <div
                            key={order.id}
                            onClick={() => onSelectOrder(order.id)}
                            className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary-200 transition-all cursor-pointer"
                        >
                            {/* 訂單標題與狀態 */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900 text-base mb-1">{order.merchantName}</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Calendar size={14} />
                                        <span>{order.date}</span>
                                        <span className="text-gray-400">·</span>
                                        <span className="text-xs text-gray-500">{order.id}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="text-lg font-bold text-primary-800">${order.total.toLocaleString()}</span>
                                    {getStatusBadge(order)}
                                </div>
                            </div>

                            {/* 修改/退回原因 */}
                            {order.modificationReason && (
                                <div className="mt-2 flex items-start gap-2 text-xs text-blue-600 bg-blue-50 p-2 rounded">
                                    <FileText size={12} className="mt-0.5 flex-shrink-0" />
                                    <span>修改原因：{order.modificationReason}</span>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                        <p className="text-gray-500">
                            {searchQuery ? '找不到符合的訂單' : '目前沒有待審核的訂單'}
                        </p>
                    </div>
                )}
            </div>

            {/* 統計資訊 */}
            {filteredAndSortedOrders.length > 0 && (
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">顯示訂單數</span>
                            <span className="font-bold text-amber-800">{filteredAndSortedOrders.length} 筆</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">總金額</span>
                            <span className="font-bold text-amber-800">
                                ${filteredAndSortedOrders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
