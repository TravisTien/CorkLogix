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
    password?: string;
    creditLimit?: number;      // 總信用額度
    availableCredit?: number; // 可用信用額度
}

export interface Order {
    id: string;
    date: string;
    status: string;
    total: number;
    paymentStatus?: string;
    modificationReason?: string;
    items: {
        productId: string;
        qty: number;
        price: number;
        unit?: string;
        unitType?: string;
        bottlesPerCase?: number;
        isGift?: boolean;
    }[];
}

export const USERS: User[] = [
    {
        id: 'merchant_monthly',
        name: 'Le Bistro Parisien (月結)',
        role: 'merchant',
        customerType: 'monthly',
        contact: 'Pierre Chef',
        password: '123',
        creditLimit: 500000,
        availableCredit: 125000, // 模擬額度快滿的情況
    },
    {
        id: 'merchant_single',
        name: 'The Jazz Bar (單次)',
        role: 'merchant',
        customerType: 'single',
        contact: 'John Pianist',
        password: '123',
    },
    {
        id: 'sales_001',
        name: 'Isabella Chen (業務)',
        role: 'sales',
        customerType: 'none',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        password: '123',
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
const GIFT_IMAGE = 'https://placehold.co/800x800/e2e8f0/475569/png?text=Gift+Item';

export const FREE_SHIPPING_THRESHOLD = 10000;
export const SHIPPING_FEE = 150;

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
    {
        id: 'gift-camp-chair',
        name: '百威限量露營椅',
        category: 'Gift',
        region: '贈品',
        price: 0,
        stock: 999,
        image: GIFT_IMAGE,
        description: '專為百威愛好者設計的限量款露營椅，輕便好收納。',
        promotion: '',
        isSpecialSale: false,
        units: [{ name: '件', price: 0 }]
    },
];

export const INITIAL_ORDERS = [
    {
        id: 'ORD-2026-001',
        date: '2026-02-05',
        status: 'delivered',
        total: 12600,
        paymentStatus: 'unpaid',
        items: [
            { productId: 'bud-bottle-330', qty: 10, price: 1200, unitType: 'case', bottlesPerCase: 24 },
            { productId: 'bud-can-330', qty: 1, price: 600, unitType: 'case', bottlesPerCase: 24 },
        ],
    },
    {
        id: 'ORD-2026-002',
        date: '2026-02-02',
        status: 'completed',
        total: 24000,
        paymentStatus: 'paid',
        items: [
            { productId: 'bud-supreme', qty: 16, price: 1500, unitType: 'case', bottlesPerCase: 12 },
        ],
    },
    {
        id: 'ORD-2026-010',
        date: '2026-02-15',
        status: 'delivered',
        total: 45000,
        paymentStatus: 'reviewing',
        items: [
            { productId: 'hoegaarden-rosee', qty: 20, price: 1680, unit: '一箱 (24瓶)' },
        ],
    },
    {
        id: 'ORD-2026-020',
        date: '2026-02-18',
        status: 'completed',
        total: 15600,
        paymentStatus: 'unpaid',
        items: [
            { productId: 'bud-bottle-330', qty: 13, price: 1200, unit: '一箱 (24瓶)' },
        ],
    },
    {
        id: 'ORD-2026-021',
        date: '2026-02-20',
        status: 'delivered',
        total: 9600,
        paymentStatus: 'paid',
        items: [
            { productId: 'bud-can-330', qty: 10, price: 960, unit: '一箱 (24罐)' },
        ],
    },
    {
        id: 'ORD-2026-022',
        date: '2026-02-22',
        status: 'delivered',
        total: 27000,
        paymentStatus: 'unpaid',
        items: [
            { productId: 'bud-can-500', qty: 20, price: 1350, unit: '一箱 (24罐)' },
        ],
    },
    {
        id: 'ORD-2026-023',
        date: '2026-02-25',
        status: 'completed',
        total: 5400,
        paymentStatus: 'paid',
        items: [
            { productId: 'bud-supreme', qty: 3, price: 1800, unit: '一箱 (12瓶)' },
        ],
    },
    {
        id: 'ORD-2026-024',
        date: '2026-02-26',
        status: 'delivered',
        total: 12000,
        paymentStatus: 'unpaid',
        items: [
            { productId: 'corona-extra', qty: 10, price: 1200, unit: '一箱 (24瓶)' },
        ],
    },
    {
        id: 'ORD-2026-011',
        date: '2026-01-20',
        status: 'completed',
        total: 35000,
        paymentStatus: 'unpaid', // 模擬一月份逾期帳款
        items: [
            { productId: 'bud-bottle-330', qty: 25, price: 1200 },
        ],
    },
    {
        id: 'ORD-2026-012',
        date: '2026-01-10',
        status: 'completed',
        total: 12000,
        paymentStatus: 'paid',
        items: [
            { productId: 'bud-can-330', qty: 12, price: 960 },
        ],
    },
    {
        id: 'ORD-2024-001',
        date: '2024-02-09',
        status: 'pending_review', // 等待業務確認
        total: 24000,
        items: [
            { productId: 'bud-bottle-330', qty: 20, price: 1200, unitType: 'case', bottlesPerCase: 24 },
            { productId: 'gift-camp-chair', qty: 2, price: 0, isGift: true, unitType: 'bottle', bottlesPerCase: 1 },
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
    unitType?: 'case' | 'bottle';
    bottlesPerCase?: number;
}

export const INITIAL_CART: CartItem[] = [
    { productId: 'bud-can-330', qty: 5, unit: '一箱 (24罐)', price: 960 },
];

// ============================================
// 業務端資料模型 (Sales Portal Data Models)
// ============================================

export interface Merchant {
    id: string;
    name: string;
    contactPerson: string;
    phone: string;
    customerType: CustomerType;
    currentMonthOrders: number;
    currentMonthRevenue: number;
    pendingOrdersCount: number;
    lastOrderDate: string;
    status: 'active' | 'inactive';
}

export interface OrderHistory {
    timestamp: string;
    action: 'created' | 'modified' | 'approved' | 'rejected' | 'confirmed';
    actor: string;                 // 操作人員名稱
    actorRole: 'merchant' | 'sales' | 'system';
    note?: string;                 // 操作備註
    changes?: {                    // 修改內容
        field: string;
        oldValue: any;
        newValue: any;
    }[];
}

export interface PendingOrder {
    id: string;
    merchantId: string;
    merchantName: string;
    date: string;
    items: CartItem[];
    total: number;
    salesNote?: string;
    status: 'pending_review' | 'pending_confirm' | 'approved' | 'rejected';

    // 審核相關欄位
    reviewedBy?: string;           // 審核人員 ID
    reviewedAt?: string;           // 審核時間 (ISO string)
    modificationReason?: string;   // 修改原因（當業務修改訂單時）
    rejectionReason?: string;      // 退回原因（當業務退回訂單時）
    history?: OrderHistory[];      // 訂單歷史記錄
    isUrgent?: boolean;            // 是否為緊急訂單
}

export interface SalesPerformance {
    salesRepId: string;
    month: string;
    targetRevenue: number;
    actualRevenue: number;
    achievementRate: number;
    orderCount: number;
    merchantStats: {
        merchantId: string;
        merchantName: string;
        revenue: number;
        paymentStatus: 'paid' | 'pending' | 'overdue';
    }[];
}

// Mock 商家資料
export const MERCHANTS: Merchant[] = [
    {
        id: 'merchant_001',
        name: 'Le Bistro Parisien',
        contactPerson: 'Pierre Chef',
        phone: '02-2345-6789',
        customerType: 'monthly',
        currentMonthOrders: 8,
        currentMonthRevenue: 125000,
        pendingOrdersCount: 2,
        lastOrderDate: '2026-02-08',
        status: 'active',
    },
    {
        id: 'merchant_002',
        name: 'The Jazz Bar',
        contactPerson: 'John Pianist',
        phone: '02-8765-4321',
        customerType: 'single',
        currentMonthOrders: 3,
        currentMonthRevenue: 45000,
        pendingOrdersCount: 0,
        lastOrderDate: '2026-02-05',
        status: 'active',
    },
    {
        id: 'merchant_003',
        name: '微醺餐酒館',
        contactPerson: '陳經理',
        phone: '02-1234-5678',
        customerType: 'monthly',
        currentMonthOrders: 12,
        currentMonthRevenue: 280000,
        pendingOrdersCount: 1,
        lastOrderDate: '2026-02-09',
        status: 'active',
    },
    {
        id: 'merchant_004',
        name: 'Skyline Lounge',
        contactPerson: 'David Wang',
        phone: '02-9876-5432',
        customerType: 'monthly',
        currentMonthOrders: 6,
        currentMonthRevenue: 98000,
        pendingOrdersCount: 0,
        lastOrderDate: '2026-02-07',
        status: 'active',
    },
    {
        id: 'merchant_005',
        name: '夜貓子酒吧',
        contactPerson: '林店長',
        phone: '02-5555-6666',
        customerType: 'single',
        currentMonthOrders: 2,
        currentMonthRevenue: 28000,
        pendingOrdersCount: 1,
        lastOrderDate: '2026-02-06',
        status: 'active',
    },
    {
        id: 'merchant_006',
        name: 'Craft Beer House',
        contactPerson: 'Mike Chen',
        phone: '02-7777-8888',
        customerType: 'monthly',
        currentMonthOrders: 10,
        currentMonthRevenue: 156000,
        pendingOrdersCount: 0,
        lastOrderDate: '2026-02-09',
        status: 'active',
    },
    {
        id: 'merchant_007',
        name: '老友記餐廳',
        contactPerson: '張大哥',
        phone: '02-3333-4444',
        customerType: 'single',
        currentMonthOrders: 1,
        currentMonthRevenue: 12000,
        pendingOrdersCount: 0,
        lastOrderDate: '2026-01-28',
        status: 'active',
    },
    {
        id: 'merchant_008',
        name: 'Urban Taproom',
        contactPerson: 'Sarah Liu',
        phone: '02-9999-0000',
        customerType: 'monthly',
        currentMonthOrders: 15,
        currentMonthRevenue: 320000,
        pendingOrdersCount: 2,
        lastOrderDate: '2026-02-09',
        status: 'active',
    },
];

// Mock 待審核訂單
export const PENDING_ORDERS: PendingOrder[] = [
    {
        id: 'ORD-2026-101',
        merchantId: 'merchant_001',
        merchantName: 'Le Bistro Parisien',
        date: '2026-02-09',
        status: 'pending_review',
        items: [
            { productId: 'bud-bottle-330', qty: 10, unit: '一箱 (24瓶)', price: 1200, unitType: 'case', bottlesPerCase: 24 },
            { productId: 'corona-extra', qty: 5, unit: '一箱 (24瓶)', price: 1100, unitType: 'case', bottlesPerCase: 24 },
            { productId: 'hoegaarden-rosee', qty: 3, unit: '一箱 (24瓶)', price: 0, isGift: true, unitType: 'case', bottlesPerCase: 24 },
        ],
        total: 17500,
        history: [
            {
                timestamp: '2026-02-09T10:30:00+08:00',
                action: 'created',
                actor: 'Pierre Chef',
                actorRole: 'merchant',
                note: '商家建立訂單',
            }
        ],
    },
    {
        id: 'ORD-2026-102',
        merchantId: 'merchant_003',
        merchantName: '微醺餐酒館',
        date: '2026-02-09',
        status: 'pending_review',
        items: [
            { productId: 'bud-can-500', qty: 20, unit: '一箱 (24罐)', price: 1350 },
            { productId: 'hoegaarden-rosee', qty: 8, unit: '一箱 (24瓶)', price: 1680 },
        ],
        total: 40440,
        salesNote: '客戶要求加急配送',
        history: [
            {
                timestamp: '2026-02-09T14:15:00+08:00',
                action: 'created',
                actor: '陳經理',
                actorRole: 'merchant',
                note: '商家建立訂單（加急配送）',
            }
        ],
    },
    {
        id: 'ORD-2026-103',
        merchantId: 'merchant_005',
        merchantName: '夜貓子酒吧',
        date: '2026-02-08',
        status: 'pending_confirm',
        items: [
            { productId: 'bud-can-330', qty: 8, unit: '一箱 (24罐)', price: 920 }, // 業務調整價格
            { productId: 'gift-camp-chair', qty: 1, unit: '件', price: 0, isGift: true },
        ],
        total: 7360,
        salesNote: '已提供特殊折扣並贈送露營椅',
        modificationReason: '已提供特殊折扣並贈送露營椅',
        reviewedBy: 'sales_001',
        reviewedAt: '2026-02-08T16:20:00+08:00',
        history: [
            {
                timestamp: '2026-02-08T15:00:00+08:00',
                action: 'created',
                actor: '林店長',
                actorRole: 'merchant',
                note: '商家建立訂單',
            },
            {
                timestamp: '2026-02-08T16:20:00+08:00',
                action: 'modified',
                actor: 'Isabella Chen',
                actorRole: 'sales',
                note: '已提供特殊折扣並贈送露營椅',
                changes: [
                    { field: '單價', oldValue: 960, newValue: 920 },
                    { field: '贈品', oldValue: '無', newValue: '百威限量露營椅 x1' },
                ],
            }
        ],
    },
    {
        id: 'ORD-2026-104',
        merchantId: 'merchant_008',
        merchantName: 'Urban Taproom',
        date: '2026-02-09',
        status: 'pending_review',
        items: [
            { productId: 'bud-bottle-330', qty: 30, unit: '一箱 (24瓶)', price: 1200 },
            { productId: 'bud-supreme', qty: 10, unit: '一箱 (12瓶)', price: 1500 },
        ],
        total: 51000,
        history: [
            {
                timestamp: '2026-02-09T09:45:00+08:00',
                action: 'created',
                actor: 'Sarah Liu',
                actorRole: 'merchant',
                note: '商家建立訂單',
            }
        ],
    },
];

// Mock 業績數據
export const SALES_PERFORMANCE: SalesPerformance = {
    salesRepId: 'sales_001',
    month: '2026-02',
    targetRevenue: 1200000,
    actualRevenue: 1064000,
    achievementRate: 88.67,
    orderCount: 57,
    merchantStats: [
        {
            merchantId: 'merchant_008',
            merchantName: 'Urban Taproom',
            revenue: 320000,
            paymentStatus: 'paid',
        },
        {
            merchantId: 'merchant_003',
            merchantName: '微醺餐酒館',
            revenue: 280000,
            paymentStatus: 'pending',
        },
        {
            merchantId: 'merchant_006',
            merchantName: 'Craft Beer House',
            revenue: 156000,
            paymentStatus: 'paid',
        },
        {
            merchantId: 'merchant_001',
            merchantName: 'Le Bistro Parisien',
            revenue: 125000,
            paymentStatus: 'pending',
        },
        {
            merchantId: 'merchant_004',
            merchantName: 'Skyline Lounge',
            revenue: 98000,
            paymentStatus: 'overdue',
        },
        {
            merchantId: 'merchant_002',
            merchantName: 'The Jazz Bar',
            revenue: 45000,
            paymentStatus: 'paid',
        },
        {
            merchantId: 'merchant_005',
            merchantName: '夜貓子酒吧',
            revenue: 28000,
            paymentStatus: 'paid',
        },
        {
            merchantId: 'merchant_007',
            merchantName: '老友記餐廳',
            revenue: 12000,
            paymentStatus: 'paid',
        },
    ],
};

