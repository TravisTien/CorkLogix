import { useState, useMemo } from 'react';
import { MERCHANTS, Merchant } from '@/data/mockData';
import { MerchantCard } from './MerchantCard';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterBar } from '@/components/ui/FilterBar';

interface MerchantListProps {
    onSelectMerchant: (merchant: Merchant) => void;
}

export function MerchantList({ onSelectMerchant }: MerchantListProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('全部');

    const filters = ['全部', '月結', '單次', '有待辦'];

    // 篩選與搜尋邏輯
    const filteredMerchants = useMemo(() => {
        let result = [...MERCHANTS];

        // 套用篩選
        if (activeFilter === '月結') {
            result = result.filter(m => m.customerType === 'monthly');
        } else if (activeFilter === '單次') {
            result = result.filter(m => m.customerType === 'single');
        } else if (activeFilter === '有待辦') {
            result = result.filter(m => m.pendingOrdersCount > 0);
        }

        // 套用搜尋
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(m =>
                m.name.toLowerCase().includes(query) ||
                m.contactPerson.toLowerCase().includes(query)
            );
        }

        return result;
    }, [searchQuery, activeFilter]);

    return (
        <div className="space-y-4">
            {/* 頁面標題 */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">商家管理</h1>
                <p className="text-sm text-gray-500">選擇商家進行代下單或查看訂單狀態</p>
            </div>

            {/* 搜尋列 */}
            <SearchBar
                placeholder="搜尋商家名稱或聯絡人..."
                onSearch={setSearchQuery}
            />

            {/* 篩選列 */}
            <FilterBar
                filters={filters}
                activeFilter={activeFilter}
                onChange={setActiveFilter}
            />

            {/* 商家列表 */}
            <div className="space-y-3">
                {filteredMerchants.length > 0 ? (
                    filteredMerchants.map(merchant => (
                        <MerchantCard
                            key={merchant.id}
                            merchant={merchant}
                            onClick={() => onSelectMerchant(merchant)}
                        />
                    ))
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500">找不到符合條件的商家</p>
                    </div>
                )}
            </div>

            {/* 統計資訊 */}
            <div className="bg-primary-50 rounded-lg p-4 border border-primary-100">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">顯示商家數</span>
                    <span className="font-bold text-primary-800">{filteredMerchants.length} / {MERCHANTS.length}</span>
                </div>
            </div>
        </div>
    );
}
