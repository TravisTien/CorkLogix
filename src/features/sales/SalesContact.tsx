import { Phone, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SALES_REP } from "@/data/mockData";

export function SalesContact() {
    return (
        <Card className="flex items-center p-4 gap-4 bg-gradient-to-r from-primary-900 to-primary-800 text-white border-none">
            <img
                src={SALES_REP.avatar}
                alt={SALES_REP.name}
                className="w-14 h-14 rounded-full border-2 border-white/20 object-cover"
            />
            <div className="flex-1 min-w-0">
                <p className="text-primary-100 text-xs font-medium mb-0.5">您的專屬顧問</p>
                <h3 className="font-bold text-lg truncate">{SALES_REP.name}</h3>
                <p className="text-white/80 text-sm truncate">{SALES_REP.role}</p>
            </div>
            <div className="flex flex-col gap-2">
                <Button size="icon" className="bg-white/10 hover:bg-white/20 text-white rounded-full h-9 w-9">
                    <Phone className="h-4 w-4" />
                </Button>
                <Button size="icon" className="bg-[#06C755] hover:bg-[#06C755]/90 text-white rounded-full h-9 w-9 border-none">
                    <MessageCircle className="h-4 w-4 fill-current" />
                </Button>
            </div>
        </Card>
    );
}
