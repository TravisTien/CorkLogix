import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { INITIAL_ORDERS } from "@/data/mockData";

export function OrderList({ onSelectOrder }: { onSelectOrder: (orderId: string) => void }) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending_review': return <Badge variant="warning">待確認</Badge>;
            case 'pending_confirm': return <Badge variant="error" className="animate-pulse">需確認</Badge>;
            case 'shipping': return <Badge variant="info">配送中</Badge>;
            case 'delivered': return <Badge variant="success">已送達</Badge>;
            case 'completed': return <Badge variant="default" className="bg-gray-100 text-gray-600">已完成</Badge>;
            case 'cancelled': return <Badge variant="destructive">已取消</Badge>;
            default: return <Badge variant="default">未知 ({status})</Badge>;
        }
    };

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">歷史訂單</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {INITIAL_ORDERS.map((order) => (
                    <Card
                        key={order.id}
                        className="flex flex-col gap-3 p-4 hover:bg-gray-50"
                        onClick={() => onSelectOrder(order.id)}
                    >
                        <div className="flex justify-between items-center">
                            <span className="font-mono text-sm text-gray-500">{order.id}</span>
                            {getStatusBadge(order.status)}
                        </div>
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-sm text-gray-500">{order.date}</p>
                                <p className="font-bold text-gray-900 mt-1">
                                    {order.items.length} 品項
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-primary-800">
                                    ${order.total.toLocaleString()}
                                </span>
                                <ChevronRight className="h-5 w-5 text-gray-400" />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
