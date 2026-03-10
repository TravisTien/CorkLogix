import { useState } from 'react';
import { ChevronRight, Search, Filter, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { INITIAL_ORDERS } from "@/data/mockData";

export function OrderList({ onSelectOrder }: {
    onSelectOrder: (orderId: string) => void;
}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const hasFilters = searchQuery !== '' || startDate !== '' || endDate !== '' || statusFilter !== 'all';
    const clearFilters = () => {
        setSearchQuery('');
        setStartDate('');
        setEndDate('');
        setStatusFilter('all');
    };
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending_review': return <Badge variant="warning">待確認</Badge>;
            case 'pending_confirm': return <Badge variant="error" className="animate-pulse">需確認</Badge>;
            case 'shipping': return <Badge variant="info">配送中</Badge>;
            case 'delivered': return <Badge variant="success">已送達</Badge>;
            case 'completed': return <Badge variant="default" className="bg-gray-100 text-gray-600">已完成</Badge>;
            case 'cancelled': return <Badge variant="error">已取消</Badge>;
            default: return <Badge variant="default">未知 ({status})</Badge>;
        }
    };

    const filteredOrders = INITIAL_ORDERS.filter(order => {
        // 訂單編號搜尋
        if (searchQuery && !order.id.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }
        // 日期篩選
        if (startDate && new Date(order.date) < new Date(startDate)) {
            return false;
        }
        if (endDate && new Date(order.date) > new Date(endDate)) {
            return false;
        }
        // 狀態篩選
        if (statusFilter !== 'all' && order.status !== statusFilter) {
            return false;
        }
        return true;
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">訂單管理</h2>
            </div>

            {/* 篩選區塊 */}
            <Card className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* 關鍵字搜尋 */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="搜尋訂單編號..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    {/* 日期區間：起 */}
                    <div className="relative">
                        <input
                            type="date"
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-sm"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    {/* 日期區間：迄 */}
                    <div className="relative">
                        <input
                            type="date"
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-sm"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    {/* 狀態篩選 */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Filter className="h-4 w-4 text-gray-400" />
                        </div>
                        <select
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-sm appearance-none bg-white"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">所有狀態</option>
                            <option value="pending_review">待確認</option>
                            <option value="pending_confirm">需確認</option>
                            <option value="shipping">配送中</option>
                            <option value="delivered">已送達</option>
                            <option value="completed">已完成</option>
                            <option value="cancelled">已取消</option>
                        </select>
                    </div>
                </div>
                {/* 清除過濾條件按鈕 */}
                {hasFilters && (
                    <div className="flex justify-end pt-2 border-t border-gray-100 mt-2">
                        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-gray-500 hover:text-gray-900 h-8 px-2">
                            <X className="w-4 h-4 mr-1" />
                            清除篩選條件
                        </Button>
                    </div>
                )}
            </Card>

            {filteredOrders.length > 0 ? (
                <Card className="overflow-hidden bg-white border border-gray-100 shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 border-b border-gray-100 uppercase text-xs font-semibold text-gray-500">
                                <tr>
                                    <th className="px-6 py-4 whitespace-nowrap">訂單編號</th>
                                    <th className="px-6 py-4 whitespace-nowrap">訂單日期</th>
                                    <th className="px-6 py-4 whitespace-nowrap text-center">品項數</th>
                                    <th className="px-6 py-4 whitespace-nowrap">狀態</th>
                                    <th className="px-6 py-4 whitespace-nowrap text-right">總金額</th>
                                    <th className="px-6 py-4 whitespace-nowrap"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredOrders.map((order) => (
                                    <tr
                                        key={order.id}
                                        className="hover:bg-gray-50 transition-colors cursor-pointer group whitespace-nowrap"
                                        onClick={() => onSelectOrder(order.id)}
                                    >
                                        <td className="px-6 py-4 font-mono font-bold text-gray-900">
                                            {order.id}
                                        </td>
                                        <td className="px-6 py-4">
                                            {order.date}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {order.items.length}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(order.status)}
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-primary-800">
                                            ${order.total.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-right align-middle">
                                            <div className="flex justify-end">
                                                <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-primary-500 transition-colors" />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            ) : (
                <div className="py-10 text-center text-gray-500 bg-gray-50 rounded-xl border border-gray-100">
                    找不到符合條件的訂單
                </div>
            )}
        </div>
    );
}
