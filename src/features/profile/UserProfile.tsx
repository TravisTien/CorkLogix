import { useUser } from "@/context/UserContext";
import { USERS } from "@/data/mockData";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { UserCircle, RefreshCcw } from "lucide-react";

export function UserProfile() {
    const { currentUser, switchUser } = useUser();

    return (
        <div className="p-4 space-y-6">
            <h2 className="text-xl font-bold text-gray-900">帳戶設定</h2>

            <Card className="p-6 flex items-center gap-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                    {currentUser.avatar ? (
                        <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                        <UserCircle className="w-10 h-10" />
                    )}
                </div>
                <div>
                    <h3 className="font-bold text-lg">{currentUser.name}</h3>
                    <p className="text-gray-500 text-sm">{currentUser.role === 'sales' ? currentUser.role : currentUser.contact}</p>
                    <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {currentUser.role === 'merchant' ? (
                            currentUser.customerType === 'monthly' ? '月結客戶' : '單次匯款客戶'
                        ) : '內部人員'}
                    </div>
                </div>
            </Card>

            <div className="space-y-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <RefreshCcw className="w-4 h-4" />
                    切換身份 (模擬測試用)
                </h3>
                <div className="grid gap-3">
                    {USERS.map(user => (
                        <Button
                            key={user.id}
                            variant={currentUser.id === user.id ? "primary" : "secondary"}
                            className="justify-start h-auto py-3 px-4"
                            onClick={() => switchUser(user.id)}
                        >
                            <div className="text-left">
                                <div className="font-bold">{user.name}</div>
                                <div className="text-xs opacity-70">
                                    {user.role === 'merchant'
                                        ? (user.customerType === 'monthly' ? '月結模式' : '單次匯款模式')
                                        : '業務/管理員模式'}
                                </div>
                            </div>
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
}
