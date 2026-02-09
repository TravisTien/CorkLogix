import { ArrowLeft, Minus, Plus, ShoppingCart, Tag, AlertCircle, Timer, Gift, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PRODUCTS, Promotion } from "@/data/mockData";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ProductDetailProps {
    productId: string;
    onBack: () => void;
    onAddToCart: (id: string, qty: number, unit?: string, price?: number) => void;
}

export function ProductDetail({ productId, onBack, onAddToCart }: ProductDetailProps) {
    const product = PRODUCTS.find(p => p.id === productId);

    // Default to first unit or fallback logic
    const defaultUnit = product?.units?.[0] || { name: '預設', price: product?.price || 0 };

    const [qty, setQty] = useState(1);
    const [selectedUnit, setSelectedUnit] = useState(defaultUnit);
    const [now, setNow] = useState(Date.now());
    const [showGiftModal, setShowGiftModal] = useState(false);
    const [isNotified, setIsNotified] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);

    if (!product) return null;

    const promo = product.activePromotion as Promotion;
    const getCountdown = (endDate?: string) => {
        if (!endDate) return null;
        const end = new Date(endDate).getTime();
        const diff = end - now;
        if (diff <= 0) return null;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}時${minutes}分`;
    };
    const countdown = promo?.type === 'limited_time' ? getCountdown(promo.endDate) : null;

    // Handle unit selection change
    const handleUnitChange = (unitName: string) => {
        const unit = product.units?.find(u => u.name === unitName);
        if (unit) {
            setSelectedUnit(unit);
            setQty(1);
        }
    };

    // Determine effective stock (support per-unit stock, fallback to product stock)
    // We cast selectedUnit to any because 'stock' might not be in the inferred type of all units, 
    // but we know it's in the data for some.
    const unitStock = (selectedUnit as any).stock;
    const currentStock = unitStock !== undefined ? unitStock : product.stock;

    const handleNotify = () => {
        setIsNotified(true);
        // Simulate API call
        setTimeout(() => alert("已設定貨到通知！商品到貨時我們會發送簡訊給您。"), 100);
    };

    return (
        <div className="flex flex-col h-full bg-white min-h-[calc(100vh-140px)] animate-in slide-in-from-right duration-300 relative">

            {/* Gift Image Modal */}
            {showGiftModal && (
                <div
                    className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4"
                    onClick={() => setShowGiftModal(false)}
                >
                    <div className="bg-white rounded-xl overflow-hidden max-w-sm w-full animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <div className="relative aspect-square bg-gray-100">
                            <img
                                src="https://images.unsplash.com/photo-1595183359653-659f4296b4a6?w=800&auto=format&fit=crop&q=60"
                                alt="Gift"
                                className="w-full h-full object-cover"
                            /> {/* Placeholder for Camp Chair */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 bg-white/50 hover:bg-white rounded-full"
                                onClick={() => setShowGiftModal(false)}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-lg mb-1">{promo.giftName || '贈品詳情'}</h3>
                            <p className="text-sm text-gray-500">數量有限，送完為止。</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Header Image Area */}
            <div className="relative w-full h-72 bg-gray-100">
                <img
                    src={product.image}
                    alt={product.name}
                    className={cn(
                        "w-full h-full object-cover mix-blend-multiply",
                        product.stock === 0 && "grayscale"
                    )}
                />

                {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="text-white text-2xl font-bold border-4 border-white px-6 py-2">SOLD OUT</span>
                    </div>
                )}

                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white z-10"
                    onClick={onBack}
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-5 space-y-6 pb-32">
                <div>
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex gap-2">
                            <Badge variant="default" className="bg-gray-100 text-gray-600">
                                {product.category}
                            </Badge>
                            <Badge variant="default" className="text-gray-500">
                                {product.region}
                            </Badge>
                        </div>
                        {product.isSpecialSale && (
                            <Badge variant={promo?.type === 'limited_time' ? 'red' : 'purple'} className="animate-pulse">
                                {promo?.type === 'limited_time' ? '限時特惠' : (promo?.title || '特惠活動')}
                            </Badge>
                        )}
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-2">
                        {product.name}
                    </h1>

                    {/* Active Promotion Info */}
                    {promo && (
                        <div className={cn(
                            "rounded-lg p-3 space-y-1 mb-2",
                            promo.type === 'limited_time' ? "bg-red-50 text-red-700" : "bg-purple-50 text-purple-700"
                        )}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 font-bold">
                                    {promo.type === 'limited_time' ? <Timer className="w-4 h-4" /> : <Gift className="w-4 h-4" />}
                                    <span>{promo.title}</span>
                                </div>
                                {promo.type === 'buy_x_get_y' && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 text-xs px-2 bg-white/50 hover:bg-white hover:text-purple-800"
                                        onClick={() => setShowGiftModal(true)}
                                    >
                                        查看贈品
                                    </Button>
                                )}
                            </div>
                            {countdown && <div className="text-sm">剩餘時間: {countdown}</div>}
                        </div>
                    )}

                    {!promo && product.promotion && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-sm font-medium">
                            <Tag className="h-3.5 w-3.5 fill-current" />
                            {product.promotion}
                        </div>
                    )}
                </div>

                {/* Unit Selector */}
                {product.units && product.units.length > 0 && (
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700">選擇規格</label>
                        <div className="grid grid-cols-1 gap-2">
                            {product.units.map((u) => {
                                // Check if this unit is the one on sale (matches product price)
                                const isSaleUnit = promo?.type === 'limited_time' && u.price === product.price;
                                const displayPrice = isSaleUnit ? promo.salePrice : u.price;

                                return (
                                    <div
                                        key={u.name}
                                        onClick={() => handleUnitChange(u.name)}
                                        className={cn(
                                            "flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all",
                                            selectedUnit.name === u.name
                                                ? "border-primary-800 bg-primary-50/50"
                                                : "border-gray-100 hover:border-gray-200"
                                        )}
                                    >
                                        <span className={cn("font-medium", selectedUnit.name === u.name ? "text-primary-900" : "text-gray-600")}>
                                            {u.name}
                                        </span>
                                        <div className="flex flex-col items-end">
                                            {isSaleUnit && (
                                                <span className="text-xs text-gray-400 line-through decoration-gray-400">
                                                    ${u.price.toLocaleString()}
                                                </span>
                                            )}
                                            <span className={cn("font-bold text-gray-900", isSaleUnit && "text-red-600")}>
                                                ${displayPrice?.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Inline Action Area - Moved here for visibility */}
                <div className="pt-4 border-t border-gray-100">
                    <div className="flex gap-4 items-center">
                        {currentStock > 0 ? (
                            <>
                                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1.5 border border-gray-200">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 bg-white shadow-sm border border-gray-100"
                                        onClick={() => setQty(Math.max(1, qty - 1))}
                                        disabled={qty <= 1}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className="w-6 text-center font-bold text-lg">{qty}</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 bg-white shadow-sm border border-gray-100"
                                        onClick={() => setQty(qty + 1)}
                                        disabled={qty >= currentStock}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>

                                <Button
                                    className="flex-1 h-14 text-lg shadow-lg shadow-primary-900/20 gap-2 flex-col leading-none py-1"
                                    onClick={() => {
                                        onAddToCart(product.id, qty, selectedUnit.name, selectedUnit.price);
                                        onBack();
                                    }}
                                >
                                    <div className="flex items-center gap-2">
                                        <ShoppingCart className="h-5 w-5" />
                                        <span>加入採購車</span>
                                    </div>
                                    <span className="text-[10px] opacity-80 font-normal">
                                        {(() => {
                                            const isSaleUnit = promo?.type === 'limited_time' && selectedUnit.price === product.price;
                                            const price = isSaleUnit ? (promo.salePrice || 0) : selectedUnit.price;
                                            return `$${(price * qty).toLocaleString()}`;
                                        })()}
                                    </span>
                                </Button>
                            </>
                        ) : (
                            <Button
                                className={cn(
                                    "flex-1 h-12 text-lg gap-2 transition-all",
                                    isNotified ? "bg-green-600 hover:bg-green-700" : "bg-gray-800 hover:bg-gray-700"
                                )}
                                onClick={handleNotify}
                                disabled={isNotified}
                            >
                                <div className="flex items-center gap-2">
                                    {isNotified ? <Tag className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                                    <span>{isNotified ? "已設定通知" : "貨到通知我"}</span>
                                </div>
                            </Button>
                        )}
                    </div>
                </div>

                <div className="prose prose-sm text-gray-500 pt-2 text-justify">
                    <p className="border-l-4 border-gray-200 pl-3 py-1 italic">商品描述</p>
                    <p>{product.description}</p>
                </div>
            </div>
        </div>
    );
}
