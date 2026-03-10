import { useState } from 'react';
import { PendingReviewList } from './PendingReviewList';
import { OrderReviewDetail } from './OrderReviewDetail';
import { PENDING_ORDERS, CartItem } from '@/data/mockData';

/**
 * 業務端審核功能整合示例
 * 此元件展示如何整合待審核列表與訂單審核詳情頁面
 */
export function SalesReviewDemo() {
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

    const selectedOrder = selectedOrderId
        ? PENDING_ORDERS.find(order => order.id === selectedOrderId)
        : null;

    const handleApprove = (orderId: string) => {
        console.log('核准訂單:', orderId);
        alert(`訂單 ${orderId} 已核准！`);
        setSelectedOrderId(null);
        // 實際應用中，這裡會呼叫 API 更新訂單狀態
    };

    const handleModify = (orderId: string, items: CartItem[], reason: string) => {
        console.log('修改訂單:', orderId, items, reason);
        alert(`訂單 ${orderId} 已修改！\n修改原因: ${reason}`);
        setSelectedOrderId(null);
        // 實際應用中，這裡會呼叫 API 更新訂單內容與狀態
    };

    const handleReject = (orderId: string, reason: string) => {
        console.log('退回訂單:', orderId, reason);
        alert(`訂單 ${orderId} 已退回！\n退回原因: ${reason}`);
        setSelectedOrderId(null);
        // 實際應用中，這裡會呼叫 API 更新訂單狀態
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {selectedOrder ? (
                <OrderReviewDetail
                    order={selectedOrder}
                    onBack={() => setSelectedOrderId(null)}
                    onApprove={handleApprove}
                    onModify={handleModify}
                    onReject={handleReject}
                />
            ) : (
                <div className="max-w-4xl mx-auto p-4">
                    <PendingReviewList
                        onSelectOrder={(orderId) => setSelectedOrderId(orderId)}
                    />
                </div>
            )}
        </div>
    );
}
