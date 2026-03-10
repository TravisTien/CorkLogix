import { useState, useMemo } from 'react';
import { ArrowLeft, CreditCard, Copy, CheckCircle2, X, AlertCircle, Calendar, FileText, Download, Upload, Info } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useUser } from "@/context/UserContext";
import { INITIAL_ORDERS } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface DuePaymentsProps {
    onBack?: () => void;
    onViewOrder?: (orderId: string) => void;
}

export function DuePayments({ onBack }: DuePaymentsProps) {
    const { currentUser } = useUser();

    // 將訂單存於 local state，以模擬修改為「核款中」的狀態變更
    const [orders, setOrders] = useState(INITIAL_ORDERS);

    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState('2026-02');
    const [selectedStatus, setSelectedStatus] = useState('unpaid'); // unpaid, all

    // 選擇的訂單 ID
    const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);

    // 取得所有可用月份 (從訂單日期提取)
    const availableMonths = useMemo(() => {
        const months = new Set<string>();
        orders.forEach(order => {
            months.add(order.date.substring(0, 7));
        });
        return Array.from(months).sort().reverse();
    }, [orders]);

    // 信用額度資訊
    const creditInfo = {
        total: currentUser?.creditLimit || 0,
        available: currentUser?.availableCredit || 0,
        used: (currentUser?.creditLimit || 0) - (currentUser?.availableCredit || 0),
        usageRate: currentUser?.creditLimit ? (((currentUser.creditLimit - currentUser.availableCredit!) / currentUser.creditLimit) * 100) : 0
    };

    const isCreditLow = creditInfo.available < (creditInfo.total * 0.4);

    // 篩選訂單：delivered/completed 且符合月份與狀態
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const isDueStatus = ['delivered', 'completed'].includes(order.status);
            const matchesMonth = order.date.startsWith(selectedMonth);
            const status = (order as any).paymentStatus;
            const matchesStatus = selectedStatus === 'all' ? true : (status === 'unpaid' || status === 'reviewing' || !status);
            return isDueStatus && matchesMonth && matchesStatus;
        });
    }, [orders, selectedMonth, selectedStatus]);

    // 計算本月符合篩選結果的總額
    const totalAmount = filteredOrders.reduce((sum, order) => sum + order.total, 0);

    // 計算使用者勾選的訂單總額
    const selectedOrdersTotal = filteredOrders
        .filter(o => selectedOrderIds.includes(o.id))
        .reduce((sum, o) => sum + o.total, 0);

    // 判斷是否逾期 (模擬：1月份且未結清則為逾期)
    const isOverdue = (order: any) => {
        return order.date.startsWith('2026-01') && order.paymentStatus === 'unpaid';
    };

    // 全選/取消全選
    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            const selectableIds = filteredOrders
                .filter(o => (o as any).paymentStatus === 'unpaid')
                .map(o => o.id);
            setSelectedOrderIds(selectableIds);
        } else {
            setSelectedOrderIds([]);
        }
    };

    // 單筆勾選/取消
    const handleSelectOrder = (orderId: string, checked: boolean) => {
        if (checked) {
            setSelectedOrderIds(prev => [...prev, orderId]);
        } else {
            setSelectedOrderIds(prev => prev.filter(id => id !== orderId));
        }
    };

    // 當切換篩選條件時，清空選擇
    useMemo(() => { setSelectedOrderIds([]) }, [selectedMonth, selectedStatus]);

    // Report Payment Modal Component
    const PaymentReportModal = () => {
        const [step, setStep] = useState<1 | 2>(1); // 1: 填寫資訊與上傳, 2: 確認送出

        const [payDate, setPayDate] = useState(new Date().toISOString().substring(0, 10)); // 匯款日期 / 收款日期
        const [payAmount, setPayAmount] = useState(selectedOrdersTotal.toString());
        const [payMethod, setPayMethod] = useState('bank_transfer');
        const [note, setNote] = useState('');
        const [fileObj, setFileObj] = useState<File | null>(null);

        // 各種方式特定的設定
        const [accountLast5, setAccountLast5] = useState(''); // 銀行轉帳 / ATM
        const [checkNumber, setCheckNumber] = useState('');  // 支票
        const [dueDate, setDueDate] = useState('');          // 支票到期日
        const [bankName, setBankName] = useState('');        // 支票開票銀行
        const [recipientName, setRecipientName] = useState(''); // 現金收款人

        if (!isPaymentModalOpen) return null;

        const handleSubmit = () => {
            // 更新狀態：將勾選的訂單狀態改為 'reviewing'
            setOrders(prev => prev.map(o => {
                if (selectedOrderIds.includes(o.id)) {
                    return { ...o, paymentStatus: 'reviewing' };
                }
                return o;
            }));
            setSelectedOrderIds([]); // 清空勾選
            setIsPaymentModalOpen(false); // 關閉 Modal
        };

        const isNextDisabled = () => {
            if (!payAmount) return true;
            if (payMethod === 'bank_transfer' || payMethod === 'atm') {
                return !payDate || !accountLast5 || accountLast5.length < 5;
            }
            if (payMethod === 'check') {
                return !checkNumber || !dueDate || !bankName;
            }
            if (payMethod === 'cash') {
                return !recipientName;
            }
            return false;
        };

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center shrink-0">
                        <h3 className="text-xl font-bold text-gray-900">
                            {step === 1 ? '回報付款' : '確認送出'}
                        </h3>
                        <button onClick={() => setIsPaymentModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6 overflow-y-auto space-y-5">
                        {step === 1 ? (
                            <>
                                <div className="space-y-4">
                                    <div className="bg-primary-50 text-primary-900 p-4 rounded-lg flex flex-col gap-1">
                                        <div className="text-sm font-medium text-primary-800">本次結清訂單共 {selectedOrderIds.length} 筆</div>
                                        <div className="text-2xl font-bold">NT$ {selectedOrdersTotal.toLocaleString()}</div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2 sm:col-span-1">
                                            <label className="text-sm font-medium text-gray-700 block mb-1">付款方式 <span className="text-red-500">*</span></label>
                                            <select value={payMethod} onChange={e => setPayMethod(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none">
                                                <option value="bank_transfer">銀行轉帳</option>
                                                <option value="atm">ATM 轉帳</option>
                                                <option value="check">支票</option>
                                                <option value="cash">現金</option>
                                            </select>
                                        </div>

                                        <div className="col-span-2 sm:col-span-1">
                                            <label className="text-sm font-medium text-gray-700 block mb-1">本次支付金額 <span className="text-red-500">*</span></label>
                                            <input type="number" value={payAmount} onChange={e => setPayAmount(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none font-bold text-primary-700" />
                                        </div>
                                    </div>

                                    {/* 按付款方式動態欄位 */}
                                    {(payMethod === 'bank_transfer' || payMethod === 'atm') && (
                                        <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                            <div>
                                                <label className="text-sm font-medium text-gray-700 block mb-1">匯款日期 <span className="text-red-500">*</span></label>
                                                <input type="date" value={payDate} onChange={e => setPayDate(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none" />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-700 block mb-1">帳號後五碼 <span className="text-red-500">*</span></label>
                                                <input type="text" maxLength={5} placeholder="例如：12345" value={accountLast5} onChange={e => setAccountLast5(e.target.value.replace(/\D/g, ''))} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none" />
                                            </div>
                                        </div>
                                    )}

                                    {payMethod === 'check' && (
                                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700 block mb-1">支票號碼 <span className="text-red-500">*</span></label>
                                                    <input type="text" placeholder="輸入支票號碼" value={checkNumber} onChange={e => setCheckNumber(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none" />
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700 block mb-1">到期日 <span className="text-red-500">*</span></label>
                                                    <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-700 block mb-1">開票銀行 <span className="text-red-500">*</span></label>
                                                <input type="text" placeholder="例如：國泰世華 敦南分行" value={bankName} onChange={e => setBankName(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none" />
                                            </div>
                                        </div>
                                    )}

                                    {payMethod === 'cash' && (
                                        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                            <label className="text-sm font-medium text-gray-700 block mb-1">收款人姓名 <span className="text-red-500">*</span></label>
                                            <input type="text" placeholder="例如：業務 Isabella 或 司機大哥" value={recipientName} onChange={e => setRecipientName(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none" />
                                        </div>
                                    )}

                                    <div>
                                        <label className="text-sm font-medium text-gray-700 block mb-1">備註 (選填)</label>
                                        <textarea placeholder="例如：尾數 5 元折掉 或 包含上次欠款" value={note} onChange={e => setNote(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none resize-none h-16" />
                                    </div>

                                    <div className="pt-2">
                                        <label className="text-sm font-medium text-gray-700 block mb-2">上傳憑證 (水單 / 支票影本等)</label>
                                        <label className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors group">
                                            <input type="file" className="hidden" accept="image/*,.pdf" onChange={e => setFileObj(e.target.files?.[0] || null)} />
                                            {fileObj ? (
                                                <div className="flex flex-col items-center w-full">
                                                    <CheckCircle2 className="w-8 h-8 text-green-500 mb-2" />
                                                    <span className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{fileObj.name}</span>
                                                    <span className="text-xs text-primary-600 mt-1 hover:underline">點擊重新選擇</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center text-gray-400 group-hover:text-primary-500 transition-colors">
                                                    <Upload className="w-8 h-8 mb-2" />
                                                    <span className="text-sm font-medium">點擊選擇檔案上傳</span>
                                                    <span className="text-xs mt-1">支援 JPG, PNG 圖片格式</span>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="space-y-6 text-center py-4">
                                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-blue-600">
                                    <Info className="w-8 h-8" />
                                </div>
                                <div className="px-4">
                                    <p className="text-lg font-bold text-gray-900 mb-2">確認送出付款回報？</p>
                                    <div className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto space-y-1">
                                        <p>您即將回報付款 <strong className="text-primary-700">NT$ {parseInt(payAmount || '0').toLocaleString()}</strong> 元</p>
                                        <p>包含 <strong className="text-primary-700">{selectedOrderIds.length}</strong> 筆訂單</p>
                                        <p>付款方式：<span className="font-bold text-gray-900">{
                                            payMethod === 'bank_transfer' ? '銀行轉帳' :
                                                payMethod === 'atm' ? 'ATM 轉帳' :
                                                    payMethod === 'check' ? '支票' : '現金'
                                        }</span></p>
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl text-left text-sm space-y-3 mx-2">
                                    {(payMethod === 'bank_transfer' || payMethod === 'atm') && (
                                        <>
                                            <div className="flex justify-between border-b border-gray-200 pb-2"><span className="text-gray-500">匯款日期</span><span className="font-medium text-gray-900">{payDate}</span></div>
                                            <div className="flex justify-between"><span className="text-gray-500">帳號後五碼</span><span className="font-medium text-gray-900">{accountLast5}</span></div>
                                        </>
                                    )}
                                    {payMethod === 'check' && (
                                        <>
                                            <div className="flex justify-between border-b border-gray-200 pb-2"><span className="text-gray-500">支票號碼</span><span className="font-medium text-gray-900">{checkNumber}</span></div>
                                            <div className="flex justify-between border-b border-gray-200 pb-2"><span className="text-gray-500">到期日</span><span className="font-medium text-gray-900">{dueDate}</span></div>
                                            <div className="flex justify-between"><span className="text-gray-500">開票銀行</span><span className="font-medium text-gray-900">{bankName}</span></div>
                                        </>
                                    )}
                                    {payMethod === 'cash' && (
                                        <div className="flex justify-between"><span className="text-gray-500">收款人姓名</span><span className="font-medium text-gray-900">{recipientName}</span></div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-4 border-t border-gray-100 flex gap-3 shrink-0">
                        {step === 1 ? (
                            <>
                                <Button variant="secondary" className="flex-1" onClick={() => setIsPaymentModalOpen(false)}>取消</Button>
                                <Button
                                    className="flex-1 bg-primary-600 hover:bg-primary-700"
                                    onClick={() => setStep(2)}
                                    disabled={isNextDisabled()}
                                >
                                    下一步
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button variant="secondary" className="flex-1" onClick={() => setStep(1)}>上一步</Button>
                                <Button className="flex-1 bg-primary-600 hover:bg-primary-700" onClick={handleSubmit}>確認送出</Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6 animate-in slide-in-from-right duration-300 w-full max-w-6xl mx-auto pb-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {onBack && (
                        <Button variant="ghost" size="sm" onClick={onBack} className="-ml-2 text-gray-500">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    )}
                    <h1 className="text-2xl font-bold text-gray-900">應付款項</h1>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <select
                            className="pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium appearance-none cursor-pointer focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                        >
                            {availableMonths.map(m => (
                                <option key={m} value={m}>{m.replace('-', ' 年 ')} 月</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Credit Info Dashboard */}
            <Card className="p-6 border-none bg-white shadow-sm ring-1 ring-gray-100">
                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <div className="space-y-1">
                            <span className="text-sm text-gray-500 font-medium">可用信用額度</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-gray-900">${creditInfo.available.toLocaleString()}</span>
                                <span className="text-xs text-gray-400">/ 總額 ${creditInfo.total.toLocaleString()}</span>
                            </div>
                        </div>
                        <Badge variant={isCreditLow ? "error" : "success"} className="px-3 py-1">
                            {isCreditLow ? "額度警告" : "額度充足"}
                        </Badge>
                    </div>

                    <div className="space-y-2">
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className={cn(
                                    "h-full transition-all duration-500",
                                    isCreditLow ? "bg-red-500" : "bg-primary-600"
                                )}
                                style={{ width: `${Math.max(5, creditInfo.usageRate)}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                            <span>已使用 {Math.round(creditInfo.usageRate)}%</span>
                            <span>剩餘 {Math.round(100 - creditInfo.usageRate)}%</span>
                        </div>
                    </div>

                    {isCreditLow && (
                        <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100 mt-2">
                            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                            <div className="text-xs text-red-800 leading-relaxed font-medium">
                                <p className="font-bold mb-0.5">提醒：可用信用額度即將用盡</p>
                                <p className="opacity-80">您的可用額度低於 40%，請先完成還款以確保後續訂單能順利建立。</p>
                            </div>
                        </div>
                    )}
                </div>
            </Card>

            {/* Actions & Filters */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex flex-col sm:flex-row sm:items-end gap-6">
                    <div className="px-1">
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1 block">本月篩選總計</span>
                        <div className="text-2xl font-bold text-gray-400">${totalAmount.toLocaleString()}</div>
                    </div>

                    <div className="px-1 sm:border-l sm:border-gray-200 sm:pl-6 bg-primary-50/50 sm:bg-transparent p-3 sm:p-0 rounded-lg border border-primary-100 sm:border-0">
                        <span className="text-xs text-primary-600 font-bold uppercase tracking-widest mb-1 block">已選取金額 ({selectedOrderIds.length} 筆)</span>
                        <div className="flex items-baseline gap-3">
                            <span className="text-2xl font-bold text-primary-700">${selectedOrdersTotal.toLocaleString()}</span>
                            <Button
                                size="sm"
                                onClick={() => setIsPaymentModalOpen(true)}
                                disabled={selectedOrderIds.length === 0}
                                className={cn(
                                    "ml-2 transition-all",
                                    selectedOrderIds.length > 0 ? "bg-primary-600 hover:bg-primary-700 shadow-md shadow-primary-600/20" : ""
                                )}
                            >
                                <FileText className="w-4 h-4 mr-2" />
                                我要回報付款
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg self-start md:self-auto">
                    {[
                        { id: 'unpaid', label: '僅顯示未結清' },
                        { id: 'all', label: '顯示全部 (含已結清)' }
                    ].map(status => (
                        <button
                            key={status.id}
                            onClick={() => setSelectedStatus(status.id)}
                            className={cn(
                                "px-3 py-1.5 text-xs font-bold rounded-md transition-all whitespace-nowrap",
                                selectedStatus === status.id
                                    ? "bg-white text-primary-700 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            {status.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-medium">
                            <tr>
                                <th className="px-4 py-3 w-12 text-center">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 w-4 h-4 cursor-pointer"
                                        checked={filteredOrders.filter(o => (o as any).paymentStatus === 'unpaid').length > 0 && selectedOrderIds.length === filteredOrders.filter(o => (o as any).paymentStatus === 'unpaid').length}
                                        onChange={(e) => handleSelectAll(e.target.checked)}
                                        disabled={filteredOrders.filter(o => (o as any).paymentStatus === 'unpaid').length === 0}
                                        title={filteredOrders.filter(o => (o as any).paymentStatus === 'unpaid').length === 0 ? "目前沒有未結清的訂單可選" : "全選/取消全選未結清訂單"}
                                    />
                                </th>
                                <th className="px-4 py-3">訂單編號 / 日期</th>
                                <th className="px-4 py-3">內容</th>
                                <th className="px-4 py-3">狀態</th>
                                {selectedStatus === 'all' && (
                                    <>
                                        <th className="px-4 py-3">結清日期</th>
                                        <th className="px-4 py-3">沖銷憑證編號</th>
                                    </>
                                )}
                                <th className="px-4 py-3 text-right">金額</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y text-gray-900 divide-gray-100">
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map(order => {
                                    const overdue = isOverdue(order);
                                    const status = (order as any).paymentStatus;
                                    const isSelectable = status === 'unpaid';
                                    const isSelected = selectedOrderIds.includes(order.id);

                                    // 模擬結清日期與憑證
                                    const mockPayDate = new Date(new Date(order.date).getTime() + 86400000 * 3);
                                    const paymentDate = status === 'paid' ? mockPayDate.toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-') : '-';
                                    const numPart = order.id.replace(/\D/g, '');
                                    const mockReceipt = (parseInt(numPart || '0', 10) * 1234567 % 100000).toString().padStart(5, '0');
                                    const receiptRef = status === 'paid' ? '末五碼: ' + mockReceipt : '-';

                                    return (
                                        <tr key={order.id} className={cn(
                                            "hover:bg-gray-50 transition-colors",
                                            overdue ? "bg-red-50/50" : "",
                                            isSelected ? "bg-primary-50" : ""
                                        )}>
                                            <td className="px-4 py-3 text-center">
                                                <input
                                                    type="checkbox"
                                                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 w-4 h-4 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                                    checked={isSelected}
                                                    onChange={(e) => handleSelectOrder(order.id, e.target.checked)}
                                                    disabled={!isSelectable}
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="font-mono font-bold text-gray-900">{order.id}</div>
                                                <div className="text-gray-500 text-xs mt-0.5">{order.date}</div>
                                                {overdue && <Badge variant="error" className="mt-1 transform origin-left text-[10px] leading-tight px-1.5 py-0">逾期未付</Badge>}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-gray-600">{order.items.length} 個品項</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1.5">
                                                    <div className={cn(
                                                        "w-1.5 h-1.5 rounded-full shrink-0",
                                                        status === 'paid' ? "bg-green-500" : status === 'reviewing' ? "bg-yellow-500" : "bg-gray-400"
                                                    )} />
                                                    <span className={cn(
                                                        "font-medium text-xs",
                                                        status === 'paid' ? "text-green-700" : status === 'reviewing' ? "text-yellow-700" : "text-gray-700"
                                                    )}>
                                                        {status === 'paid' ? "已結清" : status === 'reviewing' ? "核款中" : "未結清"}
                                                    </span>
                                                </div>
                                            </td>
                                            {selectedStatus === 'all' && (
                                                <>
                                                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">{paymentDate}</td>
                                                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">{receiptRef}</td>
                                                </>
                                            )}
                                            <td className="px-4 py-3 text-right">
                                                <span className={cn(
                                                    "text-base font-bold",
                                                    overdue ? "text-red-600" : "text-gray-900"
                                                )}>
                                                    ${order.total.toLocaleString()}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={selectedStatus === 'all' ? 7 : 5} className="px-4 py-16 text-center text-gray-400">
                                        <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                        <p className="font-medium text-gray-500">此月份及狀態下沒有帳款明細</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <PaymentReportModal />
        </div>
    );
}

