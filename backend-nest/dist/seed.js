"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const role_entity_1 = require("./roles/entities/role.entity");
const user_entity_1 = require("./users/entities/user.entity");
const master_catalog_entity_1 = require("./catalogs/entities/master-catalog.entity");
const master_catalog_item_entity_1 = require("./catalogs/entities/master-catalog-item.entity");
const store_entity_1 = require("./stores/entities/store.entity");
const service_entity_1 = require("./services/entities/service.entity");
const quotation_entity_1 = require("./quotations/entities/quotation.entity");
const order_entity_1 = require("./orders/entities/order.entity");
const payment_entity_1 = require("./payments/entities/payment.entity");
const warehouse_entity_1 = require("./storage/entities/warehouse.entity");
const storage_location_entity_1 = require("./storage/entities/storage-location.entity");
const inventory_item_entity_1 = require("./storage/entities/inventory-item.entity");
const vehicle_entity_1 = require("./transport/entities/vehicle.entity");
const driver_entity_1 = require("./transport/entities/driver.entity");
const trip_entity_1 = require("./transport/entities/trip.entity");
const commission_rule_entity_1 = require("./commission_rules/entities/commission_rule.entity");
const bcrypt = __importStar(require("bcrypt"));
const path = __importStar(require("path"));
const seed_data_1 = require("./seed-data");
async function seed() {
    const baseConfig = {
        type: 'mysql',
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 3306),
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'root',
        database: process.env.DB_NAME || 'logistica_tos',
        entities: [path.join(__dirname, '**/*.entity{.ts,.js}')],
    };
    let dataSource = new typeorm_1.DataSource({ ...baseConfig, synchronize: false });
    await dataSource.initialize();
    console.log('Database connected (Phase 1: Cleanup)');
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 0');
    const tables = ['trips', 'vehicles', 'drivers', 'warehouses', 'storage_locations', 'payments', 'commissions', 'inventory_items'];
    for (const table of tables) {
        try {
            await dataSource.query(`TRUNCATE TABLE \`${table}\``);
        }
        catch (e) { }
    }
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 1');
    await dataSource.destroy();
    dataSource = new typeorm_1.DataSource({ ...baseConfig, synchronize: true });
    await dataSource.initialize();
    console.log('Database initialized (Phase 2: Sync & Seed)');
    const roleRepo = dataSource.getRepository(role_entity_1.Role);
    const roles = ['admin', 'client', 'store', 'inspector'];
    const roleEntities = {};
    for (const rName of roles) {
        let role = await roleRepo.findOneBy({ name: rName });
        if (!role) {
            role = await roleRepo.save({ name: rName, description: `Role for ${rName}` });
        }
        roleEntities[rName] = role;
    }
    console.log('Roles seeded');
    const userRepo = dataSource.getRepository(user_entity_1.User);
    const passwordHash = await bcrypt.hash('password123', 10);
    const usersData = [
        { firstName: 'Super', lastName: 'Admin', email: 'admin@tos.com', role: roleEntities['admin'] },
        { firstName: 'Carlos', lastName: 'Cliente', email: 'client@tos.com', role: roleEntities['client'] },
        { firstName: 'Pedro', lastName: 'Tienda', email: 'store@tos.com', role: roleEntities['store'] },
        { firstName: 'Isabel', lastName: 'Inspectora', email: 'inspector@tos.com', role: roleEntities['inspector'] },
    ];
    const userEntities = {};
    for (const u of usersData) {
        let user = await userRepo.findOneBy({ email: u.email });
        if (!user) {
            user = await userRepo.save({ ...u, passwordHash });
        }
        userEntities[u.email] = user;
    }
    console.log('Users seeded');
    const catalogRepo = dataSource.getRepository(master_catalog_entity_1.MasterCatalog);
    const catalogItemRepo = dataSource.getRepository(master_catalog_item_entity_1.MasterCatalogItem);
    const catalogItemEntities = {};
    for (const catData of seed_data_1.MASTER_CATALOGS_DATA) {
        let catalog = await catalogRepo.findOneBy({ code: catData.code });
        if (!catalog) {
            catalog = await catalogRepo.save({ code: catData.code, name: catData.name });
        }
        for (const itemData of catData.items) {
            let item = await catalogItemRepo.findOneBy({ code: itemData.code, catalog: { id: catalog.id } });
            if (!item) {
                item = await catalogItemRepo.save({
                    ...itemData,
                    catalog,
                });
            }
            catalogItemEntities[itemData.code] = item;
        }
    }
    console.log('Master catalogs expanded and seeded');
    const ruleRepo = dataSource.getRepository(commission_rule_entity_1.CommissionRule);
    for (const ruleData of seed_data_1.COMMISSION_RULES_DATA) {
        let rule = await ruleRepo.findOneBy({ ruleCode: ruleData.ruleCode });
        if (!rule) {
            await ruleRepo.save(ruleData);
        }
    }
    console.log('Commission rules seeded');
    const storeRepo = dataSource.getRepository(store_entity_1.Store);
    let store = await storeRepo.findOneBy({ owner: { id: userEntities['store@tos.com'].id } });
    if (!store) {
        store = await storeRepo.save({
            legalName: 'Logistica Total C.A.',
            taxId: 'J-123456789',
            basePort: 'PORT-HOUSTON',
            description: 'Expertos en logística portuaria y aduanas.',
            brandColor: '#0055ff',
            status: 'approved',
            owner: userEntities['store@tos.com'],
            averageRating: 4.8,
            reviewCount: 15
        });
    }
    console.log('Store seeded');
    const serviceRepo = dataSource.getRepository(service_entity_1.Service);
    const serviceEntities = {};
    for (const s of seed_data_1.MVP_SERVICES_DATA) {
        let service = await serviceRepo.findOneBy({ code: s.code, store: { id: store.id } });
        const category = catalogItemEntities[s.categoryCode];
        const serviceData = {
            ...s,
            category,
            store,
        };
        delete serviceData.categoryCode;
        if (!service) {
            service = await serviceRepo.save(serviceData);
        }
        else {
            Object.assign(service, serviceData);
            service = await serviceRepo.save(service);
        }
        serviceEntities[s.code] = service;
    }
    console.log('Services expanded and seeded');
    const quotationRepo = dataSource.getRepository(quotation_entity_1.Quotation);
    const orderRepo = dataSource.getRepository(order_entity_1.Order);
    const paymentRepo = dataSource.getRepository(payment_entity_1.Payment);
    const client = userEntities['client@tos.com'];
    const ensureQuotation = async (serviceCode, status, code, price) => {
        let quotation = await quotationRepo.findOne({
            where: { quotationCode: code },
            relations: ['client', 'store', 'service', 'currency', 'service.category'],
        });
        if (!quotation) {
            const subtotal = price || 0;
            const tax = subtotal * 0.16;
            const comm = subtotal * 0.10;
            quotation = quotationRepo.create({
                quotationCode: code,
                client,
                store: store,
                service: serviceEntities[serviceCode],
                quantity: 1,
                unitMeasure: catalogItemEntities['SERVICE'],
                subtotalAmount: subtotal,
                taxAmount: tax,
                commissionAmount: comm,
                totalAmount: subtotal + tax,
                currency: catalogItemEntities['USD'],
                notes: `Demo ${code}: Requerimiento de servicio logístico.`,
                status,
                respondedAt: price ? new Date() : undefined,
            });
            quotation = await quotationRepo.save(quotation);
        }
        return quotation;
    };
    const approvedQuotation = await ensureQuotation('SER-TRA-001', 'CONVERTED', 'COT-2026-0003', 350);
    const completedQuotation = await ensureQuotation('SER-ADU-001', 'CONVERTED', 'COT-2026-0004', 450);
    const ensureOrder = async (quotation, opStatus, code) => {
        let order = await orderRepo.findOne({ where: { orderCode: code }, relations: ['client', 'store', 'service', 'service.category', 'quotation', 'currency'] });
        if (!order) {
            order = orderRepo.create({
                orderCode: code,
                quotation,
                client,
                store: store,
                service: quotation.service,
                subtotalAmount: quotation.subtotalAmount,
                taxAmount: quotation.taxAmount,
                commissionAmount: quotation.commissionAmount,
                totalAmount: quotation.totalAmount,
                providerNetAmount: (quotation.subtotalAmount || 0) - (quotation.commissionAmount || 0),
                currency: quotation.currency,
                operationalStatus: opStatus,
                financialStatus: opStatus === 'CLOSED' ? 'CONFIRMED' : 'UNPAID',
                documentStatus: opStatus === 'CLOSED' ? 'VALIDATED' : 'PENDING',
                startedAt: new Date(),
                closedAt: opStatus === 'CLOSED' ? new Date() : undefined,
            });
            order = await orderRepo.save(order);
        }
        return order;
    };
    const activeOrder = await ensureOrder(approvedQuotation, 'EXECUTING', 'ORD-2026-0001');
    const completedOrder = await ensureOrder(completedQuotation, 'CLOSED', 'ORD-2026-0002');
    const ensurePayment = async (order, status, reference, code) => {
        let payment = await paymentRepo.findOne({ where: { paymentCode: code }, relations: ['order', 'client'] });
        if (!payment) {
            payment = await paymentRepo.save(paymentRepo.create({
                paymentCode: code,
                order,
                client,
                amount: order.totalAmount,
                currency: 'USD',
                paymentMethod: 'BANK_TRANSFER',
                paymentReference: reference,
                receiptUrl: `https://demo.local/receipts/${reference}.pdf`,
                status,
                confirmedAt: status === 'CONFIRMED' ? new Date() : undefined,
            }));
        }
        return payment;
    };
    await ensurePayment(activeOrder, 'SUBMITTED', 'REF-PAY-001', 'PAY-2026-00001');
    await ensurePayment(completedOrder, 'CONFIRMED', 'REF-PAY-002', 'PAY-2026-00002');
    console.log('Marketplace cycle demo seeded');
    const warehouseRepo = dataSource.getRepository(warehouse_entity_1.Warehouse);
    const locationRepo = dataSource.getRepository(storage_location_entity_1.StorageLocation);
    const inventoryItemRepo = dataSource.getRepository(inventory_item_entity_1.InventoryItem);
    const vehicleRepo = dataSource.getRepository(vehicle_entity_1.Vehicle);
    const driverRepo = dataSource.getRepository(driver_entity_1.Driver);
    const tripRepo = dataSource.getRepository(trip_entity_1.Trip);
    let warehouse = await warehouseRepo.findOneBy({ warehouseCode: 'WH-PC-01' });
    if (!warehouse) {
        warehouse = await warehouseRepo.save({
            warehouseName: 'Almacén Fiscal Puerto Cabello',
            warehouseCode: 'WH-PC-01',
            address: 'Zona portuaria, Puerto Cabello',
            status: 'ACTIVE',
            warehouseType: 'BONDED',
            store: store
        });
    }
    let location = await locationRepo.findOne({ where: { warehouse: { id: warehouse.id }, locationCode: 'WH-PC-01-A-01-01' } });
    if (!location) {
        location = await locationRepo.save({
            warehouse,
            locationCode: 'WH-PC-01-A-01-01',
            zone: 'A',
            aisle: '01',
            rack: '01',
            position: '01',
            status: 'EMPTY'
        });
    }
    let item = await inventoryItemRepo.findOneBy({ sku: 'DEMO-CARGO-001' });
    if (!item) {
        item = await inventoryItemRepo.save({
            sku: 'DEMO-CARGO-001',
            description: 'Carga demo de prueba',
            quantity: 12,
            unit: catalogItemEntities['TON'],
            warehouse,
            location,
            order: completedOrder
        });
    }
    let vehicle = await vehicleRepo.findOneBy({ vehicleCode: 'VEH-001' });
    if (!vehicle) {
        vehicle = await vehicleRepo.save({
            vehicleCode: 'VEH-001',
            vehicleType: 'TRUCK',
            plateNumber: 'DEMO-999',
            store: store,
            status: 'ACTIVE'
        });
    }
    let driver = await driverRepo.findOneBy({ driverCode: 'DRV-001' });
    if (!driver) {
        driver = await driverRepo.save({
            driverCode: 'DRV-001',
            firstName: 'Miguel',
            lastName: 'Torres',
            phone: '+58 412-1112233',
            store: store,
            status: 'ACTIVE'
        });
    }
    let trip = await tripRepo.findOne({ where: { order: { id: activeOrder.id } } });
    if (!trip) {
        trip = await tripRepo.save({
            tripCode: 'TRP-2026-0001',
            order: activeOrder,
            carrier: store,
            vehicle,
            driver,
            tripType: 'STANDARD',
            originName: 'PORT-PC',
            originAddress: 'Puerto Cabello Terminal',
            destinationName: 'WH-PC-01',
            destinationAddress: 'Zona Industrial Valencia',
            status: 'ASSIGNED'
        });
    }
    console.log('Operational demo seeded (Trips, Warehouses, Vehicles)');
    console.log('Seed completed successfully');
    await dataSource.destroy();
}
seed().catch(err => {
    console.error('Seed failed:', err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map