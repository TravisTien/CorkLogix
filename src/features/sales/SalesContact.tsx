import { Phone, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SALES_REP } from "@/data/mockData";

export function SalesContact() {
    return (
        <Card className="flex items-center p-6 gap-6 bg-gradient-to-br from-primary-900 via-primary-850 to-primary-800 text-white border-none shadow-xl rounded-2xl">
            <img
                src={SALES_REP.avatar}
                alt={SALES_REP.name}
                className="w-20 h-20 rounded-full border-4 border-white/10 object-cover shadow-lg"
            />
            <div className="flex-1 min-w-0">
                <p className="text-primary-100/80 text-sm font-medium mb-1">您的專屬顧問</p>
                <h3 className="font-bold text-2xl truncate mb-1">{SALES_REP.name}</h3>
                <p className="text-white/70 text-base truncate">{SALES_REP.role}</p>
            </div>
            <div className="flex flex-col gap-3">
                <Button size="icon" className="bg-white/10 hover:bg-white/20 text-white rounded-full h-12 w-12 transition-all hover:scale-105 active:scale-95">
                    <Phone className="h-5 w-5" />
                </Button>
                <Button size="icon" className="bg-[#06C755] hover:bg-[#06C755]/90 text-white rounded-full h-12 w-12 border-none transition-all hover:scale-105 active:scale-95 shadow-lg shadow-green-900/20">
                    <MessageCircle className="h-5 w-5 fill-current" />
                </Button>
            </div>
        </Card>
    );
}
