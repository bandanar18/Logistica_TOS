export declare const MASTER_CATALOGS_DATA: ({
    code: string;
    name: string;
    items: {
        code: string;
        name: string;
        description: string;
        metadata: {
            dashboard: string;
        };
    }[];
} | {
    code: string;
    name: string;
    items: {
        code: string;
        name: string;
        description: string;
        metadata: {
            value: number;
        };
    }[];
} | {
    code: string;
    name: string;
    items: {
        code: string;
        name: string;
        description: string;
    }[];
} | {
    code: string;
    name: string;
    items: {
        code: string;
        name: string;
    }[];
} | {
    code: string;
    name: string;
    items: {
        code: string;
        name: string;
        metadata: {
            teu: number;
        };
    }[];
} | {
    code: string;
    name: string;
    items: ({
        code: string;
        name: string;
        metadata: {
            symbol: string;
        };
        status?: undefined;
    } | {
        code: string;
        name: string;
        metadata: {
            symbol: string;
        };
        status: string;
    })[];
} | {
    code: string;
    name: string;
    items: {
        code: string;
        name: string;
        metadata: {
            country: string;
            region: string;
        };
    }[];
})[];
export declare const MVP_SERVICES_DATA: {
    code: string;
    name: string;
    categoryCode: string;
    description: string;
    scope: string;
    exclusions: string;
    basePrice: number;
    billingUnit: string;
    slaHours: number;
    requiredDocuments: string[];
    status: string;
}[];
