import { Plus, Timer, Gift } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PRODUCTS, Promotion } from "@/data/mockData";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ProductListProps {
    onAddToCart: (id: string) => void;
    onProductClick?: (id: string) => void;
}

const CATEGORIES = [
    { id: 'all', label: '全部' },
    { id: 'Lager', label: '拉格啤酒' },
    { id: 'Premium', label: '精釀/頂級' },
    { id: 'Exotic', label: '進口特色' },
    { id: 'Fruit', label: '水果風味' },
];

export function ProductList({ onAddToCart, onProductClick }: ProductListProps) {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 1000); // Update every second for countdown
        return () => clearInterval(timer);
    }, []);

    const filteredProducts = selectedCategory === 'all'
        ? PRODUCTS
        : PRODUCTS.filter(p => p.category === selectedCategory);

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
            {/* Category Select (Mobile Friendly) */}
            <div className="relative">
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full appearance-none bg-white border border-gray-200 text-gray-900 font-medium py-3 px-4 pr-8 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                >
                    {CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.id}>
                            {cat.label}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product) => {
                    const promo = product.activePromotion as Promotion;
                    const countdown = promo?.type === 'limited_time' ? getCountdown(promo.endDate) : null;

                    return (
                        <Card
                            key={product.id}
                            className={cn(
                                "flex p-3 gap-3 active:scale-[0.98] transition-transform duration-200 cursor-pointer relative overflow-hidden",
                                product.stock === 0 && "opacity-80 grayscale-[0.5]"
                            )}
                            onClick={() => onProductClick?.(product.id)}
                        >
                            {/* Visual Badge for Promotion Type */}
                            {promo && (
                                <div className={cn(
                                    "absolute top-0 right-0 text-[10px] font-bold px-2 py-1 rounded-bl-lg z-10",
                                    promo.type === 'limited_time' ? "bg-red-100 text-red-600" : "bg-purple-100 text-purple-600"
                                )}>
                                    {promo.type === 'limited_time' ? '限時特價' : '滿額贈'}
                                </div>
                            )}

                            <div className="w-24 h-24 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden relative">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" />
                                {product.isSpecialSale && product.stock > 0 && !promo && (
                                    <div className="absolute top-0 left-0 bg-red-600 text-white text-[10px] px-1.5 py-0.5 font-bold rounded-br-md">
                                        特惠
                                    </div>
                                )}
                                {product.stock === 0 && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-bold">
                                        暫時缺貨
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <Badge variant="default" className="bg-gray-100 text-xs mb-1">{product.category}</Badge>
                                        <span className={cn("text-xs", product.stock === 0 ? "text-red-500 font-bold" : "text-gray-400")}>
                                            {product.stock > 0 ? `庫存: ${product.stock}` : '補貨中'}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-gray-900 leading-tight line-clamp-2">{product.name}</h3>

                                    {/* Promotion Details */}
                                    {promo?.type === 'limited_time' && countdown && (
                                        <div className="flex items-center gap-1 text-xs text-red-600 font-bold mt-1 bg-red-50 p-1 rounded w-fit">
                                            <Timer className="w-3 h-3" />
                                            <span>剩餘 {countdown}</span>
                                        </div>
                                    )}
                                    {promo?.type === 'buy_x_get_y' && (
                                        <div className="flex items-center gap-1 text-xs text-purple-600 font-bold mt-1 bg-purple-50 p-1 rounded w-fit">
                                            <Gift className="w-3 h-3" />
                                            <span>{promo.title}</span>
                                        </div>
                                    )}
                                    {!promo && product.promotion && (
                                        <span className="text-xs text-red-600 font-medium mt-1 block">
                                            🔥 {product.promotion}
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center justify-between mt-2">
                                    <div className="flex flex-col">
                                        {promo?.salePrice ? (
                                            <>
                                                <span className="text-xs text-gray-400 line-through decoration-gray-400">
                                                    ${product.price.toLocaleString()}
                                                </span>
                                                <span className="text-red-600 font-bold text-lg">
                                                    ${promo.salePrice.toLocaleString()}
                                                    <span className="text-xs font-normal text-gray-500 ml-1">/ 罐</span>
                                                </span>
                                            </>
                                        ) : (
                                            <span className={cn("text-primary-800 font-bold text-lg", product.stock === 0 && "text-gray-400")}>
                                                ${product.price.toLocaleString()} <span className="text-xs font-normal text-gray-500">/ 起</span>
                                            </span>
                                        )}
                                    </div>

                                    {product.stock > 0 ? (
                                        <Button
                                            size="sm"
                                            className="rounded-full w-8 h-8 p-0 z-10"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onAddToCart(product.id);
                                            }}
                                        >
                                            <Plus className="h-5 w-5" />
                                        </Button>
                                    ) : (
                                        <Badge variant="warning" className="text-[10px]">
                                            貨到通知
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
