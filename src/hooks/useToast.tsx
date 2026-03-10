import { useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Toast {
    id: string;
    message: string;
    type?: 'success' | 'info' | 'error';
}

export function useToast() {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    const ToastContainer = () => (
        <div className="fixed top-4 right-4 z-[100] flex flex-col items-end gap-3 pointer-events-none">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={cn(
                        "min-w-[240px] bg-white/95 backdrop-blur-md text-gray-900 px-5 py-4 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] flex items-center gap-3 animate-in fade-in slide-in-from-right-8 duration-500 border-l-4",
                        toast.type === 'success' && "border-l-green-500",
                        toast.type === 'info' && "border-l-blue-500",
                        toast.type === 'error' && "border-l-red-500"
                    )}
                >
                    {toast.type === 'success' && <CheckCircle2 size={20} className="text-green-500 shrink-0" />}
                    {toast.type === 'info' && <Info size={20} className="text-blue-500 shrink-0" />}
                    {toast.type === 'error' && <AlertCircle size={20} className="text-red-500 shrink-0" />}

                    <div className="flex flex-col">
                        <span className="text-xs font-bold uppercase tracking-wider opacity-50">
                            {toast.type === 'success' ? '成功' : toast.type === 'error' ? '錯誤' : '資訊'}
                        </span>
                        <span className="text-sm font-semibold leading-tight">{toast.message}</span>
                    </div>
                </div>
            ))}
        </div>
    );

    return { showToast, ToastContainer };
}
