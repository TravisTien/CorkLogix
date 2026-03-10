import { Timer, Gift, Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PRODUCTS, Promotion } from "@/data/mockData";
import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";

interface ProductListProps {
    onProductClick?: (id: string) => void;
    selectedCategory?: string;
    onCategoryChange?: (category: string) => void;
    searchQuery?: string;
    onSearchChange?: (query: string) => void;
}

const CATEGORIES = [
    { id: 'all', label: '全部' },
    { id: 'Lager', label: '拉格啤酒' },
    { id: 'Premium', label: '精釀/頂級' },
    { id: 'Exotic', label: '進口特色' },
    { id: 'Fruit', label: '水果風味' },
];

type SortOrder = 'default' | 'price_asc' | 'price_desc';

export function ProductList({
    onProductClick,
    selectedCategory = 'all',
    onCategoryChange,
    searchQuery = '',
    onSearchChange
}: ProductListProps) {
    const [now, setNow] = useState(Date.now());
    const [sortOrder, setSortOrder] = useState<SortOrder>('default');

    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 1000); // Update every second for countdown
        return () => clearInterval(timer);
    }, []);

    const processedProducts = useMemo(() => {
        let result = [...PRODUCTS];

        // 1. Filter by category
        if (selectedCategory !== 'all') {
            result = result.filter(p => p.category === selectedCategory);
        }

        // 2. Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            result = result.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.category.toLowerCase().includes(query)
            );
        }

        // 3. Sort
        if (sortOrder === 'price_asc') {
            result.sort((a, b) => a.price - b.price);
        } else if (sortOrder === 'price_desc') {
            result.sort((a, b) => b.price - a.price);
        }

        return result;
    }, [selectedCategory, searchQuery, sortOrder]);

    const getCountdown = (endDate?: string) => {
        if (!endDate) return null;
        const end = new Date(endDate).getTime();
        const diff = end - now;
        if (diff <= 0) return null;

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}時${minutes}分`;
    };

    return (
        <div className="space-y-4">
            {/* Search, Filter and Sort Section */}
            <div className="flex flex-col gap-4">
                {/* Search Bar - Moved from Navbar */}
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="搜尋商品名稱或類別..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange?.(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Category Select */}
                    <div className="flex-1 min-w-[140px]">
                        <div className="flex items-center gap-2 mb-1">
                            <label className="text-xs font-bold text-gray-500 ml-1">類別篩選</label>
                        </div>
                        <div className="relative">
                            <select
                                value={selectedCategory}
                                onChange={(e) => onCategoryChange?.(e.target.value)}
                                className="w-full appearance-none bg-white border border-gray-200 text-gray-900 font-medium py-2 px-3 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm"
                            >
                                {CATEGORIES.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.label}
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>
                    </div>

                    {/* Sort Order */}
                    <div className="flex-1 min-w-[140px]">
                        <div className="flex items-center gap-2 mb-1">
                            <label className="text-xs font-bold text-gray-500 ml-1">排序方式</label>
                        </div>
                        <div className="relative">
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                                className="w-full appearance-none bg-white border border-gray-200 text-gray-900 font-medium py-2 px-3 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm"
                            >
                                <option value="default">預設排序</option>
                                <option value="price_asc">價格由低到高</option>
                                <option value="price_desc">價格由高到高</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                                {sortOrder === 'price_asc' ? <ArrowUp className="h-4 w-4" /> : sortOrder === 'price_desc' ? <ArrowDown className="h-4 w-4" /> : <ArrowUpDown className="h-4 w-4" />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {processedProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {processedProducts.map((product) => {
                        const promo = product.activePromotion as Promotion;
                        const countdown = promo?.type === 'limited_time' ? getCountdown(promo.endDate) : null;
                        const categoryLabel = CATEGORIES.find(c => c.id === product.category)?.label || product.category;

                        return (
                            <Card
                                key={product.id}
                                className={cn(
                                    "flex p-4 gap-4 active:scale-[0.98] transition-transform duration-200 cursor-pointer relative overflow-hidden",
                                    product.stock === 0 && "opacity-80 grayscale-[0.5]"
                                )}
                                onClick={() => onProductClick?.(product.id)}
                            >
                                <div className="w-28 h-28 md:w-32 md:h-32 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden relative">
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" />
                                    {product.stock === 0 && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm font-bold">
                                            暫時缺貨
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div>
                                        <div className="flex flex-wrap gap-2 items-center mb-2">
                                            <Badge variant="default" className="bg-gray-100 text-sm">{categoryLabel}</Badge>
                                            {promo ? (
                                                <Badge variant="default" className={cn(
                                                    "text-white text-xs shadow-sm",
                                                    promo.type === 'limited_time' ? "bg-red-500 hover:bg-red-600" : "bg-purple-500 hover:bg-purple-600"
                                                )}>
                                                    {promo.type === 'limited_time' ? '限時特價' : '滿額贈'}
                                                </Badge>
                                            ) : product.isSpecialSale && product.stock > 0 && (
                                                <Badge variant="default" className="bg-red-500 hover:bg-red-600 text-white text-xs shadow-sm">
                                                    店長推薦
                                                </Badge>
                                            )}
                                        </div>
                                        <h3 className="font-bold text-gray-900 text-base leading-tight line-clamp-2 md:text-lg">{product.name}</h3>

                                        {/* Promotion Details */}
                                        {promo?.type === 'limited_time' && countdown && (
                                            <div className="flex items-center gap-1.5 text-sm text-red-600 font-bold mt-2 bg-red-50 p-1.5 rounded-lg w-fit">
                                                <Timer className="w-4 h-4" />
                                                <span>剩餘 {countdown}</span>
                                            </div>
                                        )}
                                        {promo?.type === 'buy_x_get_y' && (
                                            <div className="flex items-center gap-1.5 text-sm text-purple-600 font-bold mt-2 bg-purple-50 p-1.5 rounded-lg w-fit">
                                                <Gift className="w-4 h-4" />
                                                <span>{promo.title}</span>
                                            </div>
                                        )}
                                        {!promo && product.promotion && (
                                            <span className="text-sm text-red-600 font-medium mt-2 block">
                                                🔥 {product.promotion}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-end justify-between mt-3">
                                        <div className="flex flex-col">
                                            {promo?.salePrice ? (
                                                <>
                                                    <span className="text-sm text-gray-400 line-through decoration-gray-400 mb-0.5">
                                                        ${product.price.toLocaleString()}
                                                    </span>
                                                    <span className="text-red-600 font-black text-xl md:text-2xl">
                                                        ${promo.salePrice.toLocaleString()}
                                                        <span className="text-sm font-normal text-gray-500 ml-1">/ 起</span>
                                                    </span>
                                                </>
                                            ) : (
                                                <span className={cn("text-primary-800 font-black text-xl md:text-2xl mt-4", product.stock === 0 && "text-gray-400")}>
                                                    ${product.price.toLocaleString()} <span className="text-sm font-normal text-gray-500">/ 起</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <div className="py-12 text-center bg-white rounded-2xl border border-dashed border-gray-200">
                    <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">找不到符合條件的商品</p>
                    <p className="text-sm text-gray-400 mt-1">試試其他的搜尋字詞或篩選條件</p>
                </div>
            )}
        </div>
    );
}
