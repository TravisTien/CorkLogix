import { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { Wine, Lock, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/useToast';

interface LoginProps {
    onLoginSuccess?: () => void;
}

export function Login({ onLoginSuccess }: LoginProps) {
    const { login } = useUser();
    const { showToast, ToastContainer } = useToast();
    const [accountId, setAccountId] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!accountId || !password) {
            showToast('請輸入帳號與密碼', 'error');
            return;
        }

        setIsLoading(true);

        try {
            // 模擬網路延遲
            await new Promise(resolve => setTimeout(resolve, 800));

            const success = login(accountId, password);
            if (success) {
                showToast('登入成功', 'success');
                if (onLoginSuccess) {
                    onLoginSuccess();
                }
            } else {
                showToast('帳號或密碼錯誤', 'error');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                        <Wine className="w-8 h-8 text-primary-800" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">CorkLogix</h1>
                    <p className="text-gray-500 mt-2">B2B 酒商採購系統</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 block">帳號 ID</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <UserIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={accountId}
                                    onChange={(e) => setAccountId(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                                    placeholder="輸入帳號 ID"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 block">密碼</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                                    placeholder="輸入密碼"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 text-base font-semibold"
                            disabled={isLoading}
                        >
                            {isLoading ? '登入中...' : '登入'}
                        </Button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <p className="text-sm text-gray-500 font-medium mb-3 text-center">測試用帳密</p>
                        <div className="bg-gray-50 rounded-xl p-4 text-xs space-y-2 font-mono text-gray-600">
                            <div className="flex justify-between border-b border-gray-200 pb-2">
                                <span>merchant_monthly (顧客/月結)</span>
                                <span>密碼: 123</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-200 pb-2">
                                <span>merchant_single (顧客/單次)</span>
                                <span>密碼: 123</span>
                            </div>
                            <div className="flex justify-between">
                                <span>sales_001 (業務視角)</span>
                                <span>密碼: 123</span>
                            </div>
                        </div>
                        <p className="text-center text-xs text-gray-400 mt-3">真實環境不會顯示此區塊</p>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}
