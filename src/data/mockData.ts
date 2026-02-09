export type CustomerType = 'monthly' | 'single' | 'none';
export type UserRole = 'merchant' | 'sales' | 'admin';

export interface Promotion {
    type: 'limited_time' | 'buy_x_get_y';
    title: string;
    endDate?: string; // ISO Date String for countdown
    salePrice?: number; // Target price for limited time
    conditionQty?: number; // Threshold for Buy X Get Y
    giftName?: string; // Name of the gift item
    giftId?: string; // ID for the gift item if it exists in products
}

export interface User {
    id: string;
    name: string;
    role: UserRole;
    customerType: CustomerType;
    contact?: string;
    avatar?: string;
}

export const USERS: User[] = [
    {
        id: 'merchant_monthly',
        name: 'Le Bistro Parisien (月結)',
        role: 'merchant',
        customerType: 'monthly',
        contact: 'Pierre Chef',
    },
    {
        id: 'merchant_single',
        name: 'The Jazz Bar (單次)',
        role: 'merchant',
        customerType: 'single',
        contact: 'John Pianist',
    },
    {
        id: 'sales_001',
        name: 'Isabella Chen (業務)',
        role: 'sales',
        customerType: 'none',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    }
];

export const CURRENT_USER = USERS[0]; // Specific export for legacy support if needed, but context should be used.

export const SALES_REP = {
    id: 'sales_001',
    name: 'Isabella Chen',
    role: 'Senior Account Manager',
    phone: '0912-345-678',
    lineId: 'isa_wine_expert',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
};

// Unified Image for all products
const PRODUCT_IMAGE = 'https://placehold.co/800x800/722F37/FFFFFF/png?text=Budweiser';

export const PRODUCTS = [
    {
        id: 'bud-bottle-330',
        name: 'Budweiser 百威啤酒 330ml 玻璃瓶',
        category: 'Lager',
        region: '美國 / 拉格啤酒',
        price: 1200, // Default display price (Case)
        stock: 500,
        image: PRODUCT_IMAGE,
        description: '百威啤酒（Budweiser）是指1876年誕生於美國，以櫸木發酵工藝釀造而成的淡拉格啤酒（Pale Lager）。口感清爽，風味獨特，是全球最暢銷的啤酒品牌之一。適合聚會、佐餐。',
        promotion: '買十送一',
        isSpecialSale: true,
        activePromotion: {
            type: 'buy_x_get_y',
            title: '買 5 箱送百威露營椅',
            conditionQty: 5,
            giftName: '百威限量露營椅',
            giftId: 'gift-camp-chair'
        } as Promotion,
        units: [
            { name: '單瓶', price: 55, stock: 0 }, // Per-unit stock override test
            { name: '一手 (6瓶)', price: 310 },
            { name: '一箱 (24瓶)', price: 1200 }
        ]
    },
    {
        id: 'bud-can-330',
        name: 'Budweiser 百威啤酒 330ml 鋁罐',
        category: 'Lager',
        region: '美國 / 拉格啤酒',
        price: 960,
        stock: 1200,
        image: PRODUCT_IMAGE,
        description: '經典百威鋁罐裝，鎖住新鮮。櫸木發酵工藝帶來清爽順口的口感，是派對烤肉的最佳夥伴。',
        promotion: '',
        isSpecialSale: false,
        units: [
            { name: '單罐', price: 45 },
            { name: '一手 (6罐)', price: 250 },
            { name: '一箱 (24罐)', price: 960 }
        ]
    },
    {
        id: 'bud-can-500',
        name: 'Budweiser 百威啤酒 500ml 鋁罐',
        category: 'Lager',
        region: '美國 / 拉格啤酒',
        price: 1350,
        stock: 800,
        image: PRODUCT_IMAGE,
        description: '大容量500ml鋁罐裝，暢飲更過癮。百威獨特的釀造工藝，確保每一口都清爽甘冽。',
        promotion: '第二箱8折',
        isSpecialSale: true,
        activePromotion: {
            type: 'limited_time',
            title: '限時特價 (原價 $1350)',
            salePrice: 1150,
            endDate: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days later
        } as Promotion,
        units: [
            { name: '單罐', price: 60 },
            { name: '一手 (4罐)', price: 230 },
            { name: '一箱 (24罐)', price: 1350 }
        ]
    },
    {
        id: 'bud-supreme',
        name: 'Budweiser Supreme 百威金尊',
        category: 'Premium',
        region: '單一品種麥芽',
        price: 1500,
        stock: 0, // Out of Stock Test
        image: PRODUCT_IMAGE,
        description: '百威金尊，精選單一品種麥芽釀造，酒液金黃，麥香純正，口感順滑。為追求更高品質啤酒體驗的您打造。',
        promotion: '',
        isSpecialSale: false,
        units: [
            { name: '單瓶', price: 70 },
            { name: '一箱 (12瓶)', price: 1500 }
        ]
    },
    {
        id: 'corona-extra',
        name: 'Corona Extra 可樂娜啤酒',
        category: 'Exotic',
        region: '墨西哥 / 拉格啤酒',
        price: 1100,
        stock: 300,
        image: PRODUCT_IMAGE,
        description: '來自墨西哥的經典拉格啤酒，金黃色酒體，口感清爽，搭配檸檬片風味更佳。',
        promotion: '新品上架',
        isSpecialSale: false,
        units: [
            { name: '單瓶', price: 50 },
            { name: '一箱 (24瓶)', price: 1100 }
        ]
    },
    {
        id: 'hoegaarden-rosee',
        name: 'Hoegaarden Rosee 豪格登覆盆莓小麥啤酒',
        category: 'Fruit',
        region: '比利時 / 水果啤酒',
        price: 1680,
        stock: 150,
        image: PRODUCT_IMAGE,
        description: '比利時經典小麥啤酒加入覆盆莓果汁，呈現粉紅色澤，口感酸甜充滿果香，深受女性喜愛。',
        promotion: '',
        isSpecialSale: true,
        units: [
            { name: '單瓶', price: 80 },
            { name: '一箱 (24瓶)', price: 1680 }
        ]
    },
];

export const INITIAL_ORDERS = [
    {
        id: 'ORD-2024-001',
        date: '2024-02-09',
        status: 'pending_review', // 等待業務確認
        total: 24000,
        items: [
            { productId: 'bud-bottle-330', qty: 20, price: 1200 },
        ],
    },
    {
        id: 'ORD-2024-002',
        date: '2024-02-08',
        status: 'pending_confirm', // 業務修改價格/內容，等待商家確認
        total: 10560,
        modificationReason: '因鋁罐 500ml 目前庫存不足，協助調整為 330ml 鋁罐組合，並提供優惠價格。',
        items: [
            { productId: 'bud-can-330', qty: 10, price: 960 },
            { productId: 'bud-can-500', qty: 1, price: 960 }, // Sample/Promotion price maybe?
        ],
    },
    {
        id: 'ORD-2024-003',
        date: '2024-02-07',
        status: 'shipping', // 配送中
        total: 5400,
        items: [
            { productId: 'bud-supreme', qty: 2, price: 1500 },
            { productId: 'bud-bottle-330', qty: 2, price: 1200 },
        ],
    },
    {
        id: 'ORD-2024-004',
        date: '2024-02-05',
        status: 'delivered', // 已送達，等待簽收/驗收
        total: 48000,
        items: [
            { productId: 'bud-can-330', qty: 50, price: 960 },
        ],
    },
    {
        id: 'ORD-2023-125',
        date: '2023-12-20',
        status: 'completed', // 歷史完成訂單
        total: 15000,
        items: [
            { productId: 'bud-supreme', qty: 10, price: 1500 },
        ],
    },
    {
        id: 'ORD-2023-100',
        date: '2023-11-11',
        status: 'completed', // 雙11訂單
        total: 82500,
        items: [
            { productId: 'bud-bottle-330', qty: 50, price: 1200 },
            { productId: 'bud-can-500', qty: 10, price: 1350 },
            { productId: 'bud-supreme', qty: 6, price: 1500 },
        ],
    },
];

export interface CartItem {
    productId: string;
    qty: number;
    unit: string;
    price: number; // Snapshot price per unit
    isGift?: boolean;
    giftSourceId?: string;
}

export const INITIAL_CART: CartItem[] = [
    { productId: 'bud-can-330', qty: 5, unit: '一箱 (24罐)', price: 960 },
];
