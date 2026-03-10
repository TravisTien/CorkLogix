import { useState } from 'react';
import { SalesLayout } from '@/components/layout/SalesLayout';
import { QuickOrder } from '@/features/sales/QuickOrder';
import { PendingReviewList } from '@/features/sales/PendingReviewList';
import { OrderReviewDetail } from '@/features/sales/OrderReviewDetail';
import { PerformanceDashboard } from '@/features/sales/PerformanceDashboard';
import { CartItem, PENDING_ORDERS, MERCHANTS } from '@/data/mockData';

function SalesApp() {
    const [activeTab, setActiveTab] = useState('quick-order');
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        setSelectedOrderId(null);
    };

    // 代客下單處理函數
    const handleQuickOrder = (merchantId: string, items: CartItem[], salesNote: string) => {
        const merchant = MERCHANTS.find(m => m.id === merchantId);
        console.log('代客下單已建立:', { merchant: merchant?.name, items, salesNote });
        alert(`已為 ${merchant?.name} 建立訂單！\n總計 ${items.length} 項商品`);
        setActiveTab('pending');
    };

    // 審核功能處理函數
    const handleSelectOrder = (orderId: string) => {
        setSelectedOrderId(orderId);
    };

    const handleBackFromReview = () => {
        setSelectedOrderId(null);
    };

    const handleApproveOrder = (orderId: string) => {
        console.log('核准訂單:', orderId);
        alert(`✅ 訂單 ${orderId} 已核准！\n訂單將進入配送流程。`);
        setSelectedOrderId(null);
        // 實際應用中，這裡會呼叫 API 更新訂單狀態為 'approved'
    };

    const handleModifyOrder = (orderId: string, items: CartItem[], reason: string) => {
        console.log('修改訂單:', { orderId, items, reason });
        alert(`📝 訂單 ${orderId} 已修改！\n修改原因: ${reason}\n\n訂單狀態已更新為「待商家確認」。`);
        setSelectedOrderId(null);
        // 實際應用中，這裡會呼叫 API 更新訂單內容與狀態為 'pending_confirm'
    };

    const handleRejectOrder = (orderId: string, reason: string) => {
        console.log('退回訂單:', { orderId, reason });
        alert(`❌ 訂單 ${orderId} 已退回！\n退回原因: ${reason}\n\n商家將收到通知。`);
        setSelectedOrderId(null);
        // 實際應用中，這裡會呼叫 API 更新訂單狀態為 'rejected'
    };

    // 取得選中的訂單
    const selectedOrder = selectedOrderId
        ? PENDING_ORDERS.find(order => order.id === selectedOrderId)
        : null;

    return (
        <SalesLayout
            activeTab={activeTab}
            onTabChange={handleTabChange}
            hideHeader={!!selectedOrderId || activeTab === 'quick-order'}
        >
            {/* 代客下單 Tab */}
            {activeTab === 'quick-order' && (
                <QuickOrder
                    onSubmitOrder={handleQuickOrder}
                    onBack={() => setActiveTab('pending')}
                />
            )}

            {/* 待審核 Tab - 列表 */}
            {activeTab === 'pending' && !selectedOrderId && (
                <PendingReviewList onSelectOrder={handleSelectOrder} />
            )}

            {/* 待審核 Tab - 訂單審核詳情 */}
            {activeTab === 'pending' && selectedOrderId && selectedOrder && (
                <OrderReviewDetail
                    order={selectedOrder}
                    onBack={handleBackFromReview}
                    onApprove={handleApproveOrder}
                    onModify={handleModifyOrder}
                    onReject={handleRejectOrder}
                />
            )}

            {/* 業績看板 Tab */}
            {activeTab === 'performance' && (
                <PerformanceDashboard />
            )}
        </SalesLayout>
    );
}

export default SalesApp;
