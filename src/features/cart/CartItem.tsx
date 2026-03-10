import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PRODUCTS } from "@/data/mockData";

interface CartItemProps {
    productId: string;
    qty: number;
    unit?: string;
    price?: number;
    onUpdateQty: (id: string, newQty: number) => void;
    onRemove: (id: string) => void;
}

export function CartItem({ productId, qty, unit, price, onUpdateQty, onRemove }: CartItemProps) {
    const product = PRODUCTS.find(p => p.id === productId);

    if (!product) return null;

    // Use passed price or fallback to product default (though logic should ensure price is passed)
    const effectivePrice = price || product.price;

    return (
        <Card className="flex gap-4 p-4 items-center">
            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover mix-blend-multiply"
                />
            </div>

            <div className="flex flex-1 flex-col justify-between self-stretch">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-medium text-gray-900 line-clamp-1">{product.name}</h3>
                        <p className="text-sm text-gray-500">
                            {product.region} {unit ? `• ${unit}` : ''}
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-red-500 -mr-2 -mt-2"
                        onClick={() => onRemove(productId)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-primary-800">
                        ${(effectivePrice * qty).toLocaleString()}
                    </span>

                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-md bg-white shadow-sm"
                            onClick={() => onUpdateQty(productId, qty - 1)}
                            disabled={qty <= 0}
                        >
                            <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-4 text-center text-sm font-medium">{qty}</span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-md bg-white shadow-sm"
                            onClick={() => onUpdateQty(productId, qty + 1)}
                            disabled={product.stock > 0 && qty >= product.stock}
                        >
                            <Plus className="h-3 w-3" />
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
}
