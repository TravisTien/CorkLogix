import { Minus, Plus, Tag, AlertCircle, Timer, Gift, X, Check, Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Navbar } from "@/components/layout/Navbar";
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

    const defaultUnit = product?.units?.[0] || { name: '預設', price: product?.price || 0 };

    const [qty, setQty] = useState(1);
    const [selectedUnit, setSelectedUnit] = useState(defaultUnit);
    const [now, setNow] = useState(Date.now());
    const [showGiftModal, setShowGiftModal] = useState(false);
    const [isNotified, setIsNotified] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);

    if (!product) return null;

    // Use multiple identical images to mock gallery if needed
    const images = [product.image, product.image, product.image, product.image];

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

    const handleUnitChange = (unitName: string) => {
        const unit = product.units?.find(u => u.name === unitName);
        if (unit) {
            setSelectedUnit(unit);
            setQty(1);
        }
    };

    const unitStock = (selectedUnit as any).stock;
    const currentStock = unitStock !== undefined ? unitStock : product.stock;

    const handleNotify = () => {
        setIsNotified(true);
        setTimeout(() => alert("已設定貨到通知！商品到貨時我們會發送簡訊給您。"), 100);
    };

    const isSaleUnit = promo?.type === 'limited_time' && selectedUnit.price === product.price;
    const displayPrice = isSaleUnit ? promo.salePrice : selectedUnit.price;

    return (
        <div className="flex flex-col h-full bg-white min-h-screen animate-in slide-in-from-right duration-300 relative overflow-y-auto hide-scrollbar">
            <Navbar
                showBack={true}
                onBack={onBack}
                title="商品詳情"
                isFullScreen={true}
            />

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
                            />
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

            <div className="md:max-w-6xl md:mx-auto md:w-full md:px-6 md:py-8 lg:py-12">
                <div className="flex flex-col md:flex-row md:gap-12 lg:gap-16 pb-32 md:pb-8">
                    {/* Left Column: Image Gallery */}
                    <div className="w-full md:w-1/2 flex flex-col md:flex-row-reverse gap-4 px-4 md:px-0">
                        {/* Main Image */}
                        <div className="relative w-full aspect-square md:aspect-auto md:flex-1 bg-gray-50 rounded-lg overflow-hidden md:h-[500px] lg:h-[600px] border border-gray-100 flex-shrink-0">
                            <img
                                src={images[activeImageIndex]}
                                alt={product.name}
                                className={cn("w-full h-full object-cover mix-blend-multiply", product.stock === 0 && "grayscale")}
                            />
                            {product.stock === 0 && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <span className="text-white text-2xl font-bold border-4 border-white px-6 py-2">SOLD OUT</span>
                                </div>
                            )}
                        </div>


                        {/* Thumbnails */}
                        <div className="flex md:flex-col gap-3 overflow-x-auto md:w-20 lg:w-24 snap-x hide-scrollbar">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImageIndex(idx)}
                                    className={cn(
                                        "flex-shrink-0 w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-lg overflow-hidden border-2 transition-all snap-start bg-gray-50 object-cover",
                                        activeImageIndex === idx ? "border-primary-600 ring-2 ring-primary-600/20 ring-offset-1" : "border-transparent opacity-60 hover:opacity-100 hover:border-gray-300"
                                    )}
                                >
                                    <img src={img} alt={`thumbnail ${idx}`} className="w-full h-full object-cover mix-blend-multiply" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Product Info */}
                    <div className="w-full md:w-1/2 px-5 md:px-0 flex flex-col pt-6 md:pt-0">

                        {/* Title, Category */}
                        <div className="mb-6">
                            <div className="text-gray-500 text-sm mb-2 font-bold tracking-wide uppercase">
                                {product.category} {product.region}
                            </div>
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-4 tracking-tight">
                                {product.name}
                            </h1>

                            {/* Description based on mockdata */}
                            <div className="text-sm md:text-base text-gray-500 mb-6 leading-relaxed whitespace-pre-wrap font-medium">
                                {product.description}
                            </div>

                            <div className="flex items-end gap-3 mb-2">
                                <div className={cn(
                                    "text-3xl lg:text-4xl font-black tracking-tight",
                                    isSaleUnit ? "text-primary-600" : "text-primary-700"
                                )}>
                                    $ {displayPrice?.toLocaleString()}
                                </div>
                                {isSaleUnit && selectedUnit.price && (
                                    <div className="text-lg text-gray-400 line-through mb-1 font-bold">
                                        $ {selectedUnit.price.toLocaleString()}
                                    </div>
                                )}
                            </div>

                            {/* Promotions */}
                            {promo && (
                                <div className={cn(
                                    "inline-flex flex-wrap items-center gap-2 rounded-md px-3 py-1.5 mt-2",
                                    promo.type === 'limited_time' ? "bg-red-50 text-red-700" : "bg-primary-50 text-primary-700"
                                )}>
                                    {promo.type === 'limited_time' ? <Timer className="w-4 h-4" /> : <Gift className="w-4 h-4" />}
                                    <span className="font-bold text-sm">{promo.title}</span>
                                    {promo.type === 'buy_x_get_y' && (
                                        <button
                                            className="ml-2 text-xs underline font-bold hover:text-primary-900 transition-colors"
                                            onClick={() => setShowGiftModal(true)}
                                        >
                                            贈品詳情
                                        </button>
                                    )}
                                    {countdown && <span className="text-xs ml-2 opacity-80 border-l border-current pl-2 font-bold">{countdown}</span>}
                                </div>
                            )}
                            {!promo && product.promotion && (
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-2 rounded-md bg-amber-50 text-amber-700 text-sm font-bold">
                                    <Tag className="h-3.5 w-3.5 fill-current" />
                                    {product.promotion}
                                </div>
                            )}
                        </div>

                        {/* Units Selection - Buttons like tags */}
                        {product.units && product.units.length > 0 && (
                            <div className="space-y-3 pt-4 mb-8">
                                <label className="text-sm font-bold text-gray-900 tracking-tight">產品規格</label>
                                <div className="flex flex-wrap gap-2.5">
                                    {product.units.map(u => {
                                        const isSelected = selectedUnit.name === u.name;
                                        return (
                                            <button
                                                key={u.name}
                                                onClick={() => handleUnitChange(u.name)}
                                                className={cn(
                                                    "px-5 py-2.5 rounded-md border-2 text-sm font-bold transition-all duration-200",
                                                    isSelected
                                                        ? "bg-gray-900 border-gray-900 text-white shadow-md shadow-gray-900/20"
                                                        : "bg-white border-gray-200 text-gray-600 hover:border-gray-900 hover:text-gray-900"
                                                )}
                                            >
                                                {u.name}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Action Area */}
                        <div className="space-y-5 pt-6 border-t border-gray-100 mt-auto">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                <span className="text-sm font-bold text-gray-900">數量</span>
                                <div className="flex items-center gap-0 bg-white border-2 border-gray-200 rounded-md h-12 w-36 overflow-hidden focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500 transition-all">
                                    <button
                                        className="w-12 h-full flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-30 transition-colors"
                                        onClick={() => setQty(Math.max(1, qty - 1))}
                                        disabled={qty <= 1}
                                    >
                                        <Minus className="w-5 h-5" />
                                    </button>
                                    <div className="w-12 h-full flex items-center justify-center text-base font-bold border-x-2 border-gray-200 bg-gray-50/50">
                                        {qty}
                                    </div>
                                    <button
                                        className="w-12 h-full flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-30 transition-colors"
                                        onClick={() => setQty(qty + 1)}
                                        disabled={qty >= currentStock}
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                                <span className="text-xs text-gray-400 font-bold">
                                    {currentStock > 0 ? `庫存: ${currentStock}` : "補貨中"}
                                </span>
                            </div>

                            <div className="flex gap-3 pt-4">
                                {currentStock > 0 ? (
                                    <>
                                        <Button
                                            className="h-14 flex-1 bg-white border-2 border-primary-900 text-primary-900 hover:bg-primary-50 font-bold text-base transition-all rounded-lg"
                                            onClick={() => {
                                                onAddToCart(product.id, qty, selectedUnit.name, selectedUnit.price);
                                                onBack();
                                            }}
                                        >
                                            加入購物車
                                        </Button>
                                        <Button
                                            className="h-14 flex-1 bg-primary-900 text-white hover:bg-primary-800 font-bold text-base transition-all rounded-lg shadow-lg shadow-primary-900/20"
                                            onClick={() => {
                                                onAddToCart(product.id, qty, selectedUnit.name, selectedUnit.price);
                                                onBack();
                                            }}
                                        >
                                            立即結帳
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        className={cn(
                                            "h-14 flex-1 font-bold text-base transition-all rounded-lg",
                                            isNotified ? "bg-green-600 hover:bg-green-700 text-white" : "bg-gray-800 hover:bg-gray-700 text-white"
                                        )}
                                        onClick={handleNotify}
                                        disabled={isNotified}
                                    >
                                        <div className="flex items-center gap-2 justify-center">
                                            {isNotified ? <Check className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                                            <span>{isNotified ? "已設定到貨通知" : "貨到通知我"}</span>
                                        </div>
                                    </Button>
                                )}
                                <Button variant="outline" size="icon" className="h-14 w-14 flex-shrink-0 border-2 border-gray-200 text-gray-400 hover:text-primary-600 hover:border-primary-200 transition-all rounded-lg">
                                    <Heart className="w-6 h-6" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
