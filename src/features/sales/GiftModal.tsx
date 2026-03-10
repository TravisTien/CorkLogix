import { useState, useMemo } from 'react';
import { PRODUCTS } from '@/data/mockData';
import { X, Search, Package, Gift } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface GiftModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddGift: (giftId: string, qty: number) => void;
}

export function GiftModal({ isOpen, onClose, onAddGift }: GiftModalProps) {
    const [activeTab, setActiveTab] = useState<'official' | 'personal'>('official');
    const [searchQuery, setSearchQuery] = useState('');

    // 取得商品清單
    const filteredProducts = useMemo(() => {
        if (!isOpen) return []; // 若關閉則不計算，節省資源

        let list = [];
        if (activeTab === 'official') {
            // 活動贈品：原本 category 為 Gift 的商品
            list = PRODUCTS.filter(p => p.category === 'Gift' || p.id.startsWith('gift-'));
        } else {
            // 業務配量：所有非 Gift 類別的常規商品
            list = PRODUCTS.filter(p => p.category !== 'Gift' && !p.id.startsWith('gift-'));
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            list = list.filter(p => p.name.toLowerCase().includes(query));
        }
        return list;
    }, [activeTab, searchQuery, isOpen]);

    if (!isOpen) return null;

    const handleAddGift = (giftId: string) => {
        onAddGift(giftId, 1);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-t-2xl md:rounded-2xl w-full md:max-w-md max-h-[85vh] flex flex-col shadow-xl">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">選擇贈送品項</h2>
                        <p className="text-xs text-gray-500 mt-0.5">業務可自行決定贈送公司配量產品</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100">
                    <button
                        onClick={() => setActiveTab('official')}
                        className={`flex-1 py-4 text-base font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'official' ? 'text-primary-800 border-b-4 border-primary-800 bg-primary-50/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <Gift size={20} />
                        活動贈品
                    </button>
                    <button
                        onClick={() => setActiveTab('personal')}
                        className={`flex-1 py-4 text-base font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'personal' ? 'text-primary-800 border-b-4 border-primary-800 bg-primary-50/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <Package size={20} />
                        業務配量
                    </button>
                </div>

                {/* Search */}
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                    <div className="relative">
                        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="搜尋商品名稱..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-primary-800 shadow-sm"
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3 overflow-y-auto flex-1">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map(product => (
                            <div
                                key={product.id}
                                className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-primary-200 transition-all shadow-sm"
                            >
                                <div className="flex-1 min-w-0 pr-4">
                                    <h3 className="font-bold text-gray-900 text-base truncate mb-1">{product.name}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                                            {activeTab === 'official' ? '活動贈品' : '業務配量'}
                                        </span>
                                        {activeTab === 'personal' && (
                                            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full border border-gray-200">
                                                庫存: {product.stock}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => handleAddGift(product.id)}
                                    className="flex-shrink-0 h-10 px-6 border-primary-200 text-primary-800 hover:bg-primary-50 font-bold"
                                >
                                    添加
                                </Button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-400 text-sm">找不到符合條件的品項</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        className="w-full"
                    >
                        完成選擇
                    </Button>
                </div>
            </div>
        </div>
    );
}

