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
const document_entity_1 = require("./documents/entities/document.entity");
const review_entity_1 = require("./reviews/entities/review.entity");
const commission_entity_1 = require("./commissions/entities/commission.entity");
const yard_entity_1 = require("./tos/entities/yard.entity");
const container_entity_1 = require("./tos/entities/container.entity");
const warehouse_entity_1 = require("./storage/entities/warehouse.entity");
const storage_location_entity_1 = require("./storage/entities/storage-location.entity");
const inventory_item_entity_1 = require("./storage/entities/inventory-item.entity");
const vehicle_entity_1 = require("./transport/entities/vehicle.entity");
const driver_entity_1 = require("./transport/entities/driver.entity");
const trip_entity_1 = require("./transport/entities/trip.entity");
const inspection_entity_1 = require("./inspections/entities/inspection.entity");
const inspection_result_entity_1 = require("./inspections/entities/inspection-result.entity");
const bcrypt = __importStar(require("bcrypt"));
const path = __importStar(require("path"));
async function seed() {
    const dataSource = new typeorm_1.DataSource({
        type: 'mysql',
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 3306),
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'root',
        database: process.env.DB_NAME || 'logistica_tos',
        entities: [path.join(__dirname, '**/*.entity{.ts,.js}')],
        synchronize: true,
    });
    await dataSource.initialize();
    console.log('Database initialized');
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
    let serviceCat = await catalogRepo.findOneBy({ code: 'SERVICE_CATEGORIES' });
    if (!serviceCat) {
        serviceCat = await catalogRepo.save({ code: 'SERVICE_CATEGORIES', name: 'Categorías de Servicios' });
    }
    const categories = [
        { code: 'ADUANA', name: 'Aduana' },
        { code: 'TRANSPORTE', name: 'Transporte' },
        { code: 'ALMACENAMIENTO', name: 'Almacenamiento' },
        { code: 'INSPECCION', name: 'Inspección' },
    ];
    const categoryEntities = {};
    for (const c of categories) {
        let item = await catalogItemRepo.findOneBy({ code: c.code, catalog: { id: serviceCat.id } });
        if (!item) {
            item = await catalogItemRepo.save({ ...c, catalog: serviceCat });
        }
        categoryEntities[c.code] = item;
    }
    let portsCat = await catalogRepo.findOneBy({ code: 'PORTS' });
    if (!portsCat) {
        portsCat = await catalogRepo.save({ code: 'PORTS', name: 'Puertos' });
    }
    const ports = [
        { code: 'PUERTO_CABELLO', name: 'Puerto Cabello' },
        { code: 'LA_GUAIRA', name: 'La Guaira' },
        { code: 'MARACAIBO', name: 'Maracaibo' },
    ];
    for (const p of ports) {
        let item = await catalogItemRepo.findOneBy({ code: p.code, catalog: { id: portsCat.id } });
        if (!item) {
            await catalogItemRepo.save({ ...p, catalog: portsCat });
        }
    }
    console.log('Catalogs seeded');
    const storeRepo = dataSource.getRepository(store_entity_1.Store);
    let store = await storeRepo.findOneBy({ owner: { id: userEntities['store@tos.com'].id } });
    if (!store) {
        store = await storeRepo.save({
            legalName: 'Logística Total C.A.',
            taxId: 'J-123456789',
            basePort: 'Puerto Cabello',
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
    const servicesData = [
        { name: 'Despacho Aduanero Importación', code: 'SERV-ADU-001', basePrice: 450, billingUnit: 'Contenedor', category: categoryEntities['ADUANA'], store, status: 'published' },
        { name: 'Transporte Puerto a Almacén', code: 'SERV-TRA-001', basePrice: 600, billingUnit: 'Viaje', category: categoryEntities['TRANSPORTE'], store, status: 'published' },
        { name: 'Almacenamiento Fiscal por 7 días', code: 'SERV-ALM-001', basePrice: 320, billingUnit: 'Semana', category: categoryEntities['ALMACENAMIENTO'], store, status: 'published' },
        { name: 'Inspección física de contenedor', code: 'SERV-INS-001', basePrice: 180, billingUnit: 'Inspección', category: categoryEntities['INSPECCION'], store, status: 'published' },
    ];
    const serviceEntities = {};
    for (const s of servicesData) {
        let service = await serviceRepo.findOneBy({ code: s.code, store: { id: store.id } });
        if (!service) {
            service = await serviceRepo.save(s);
        }
        serviceEntities[s.code] = service;
    }
    console.log('Services seeded');
    const quotationRepo = dataSource.getRepository(quotation_entity_1.Quotation);
    const orderRepo = dataSource.getRepository(order_entity_1.Order);
    const paymentRepo = dataSource.getRepository(payment_entity_1.Payment);
    const documentRepo = dataSource.getRepository(document_entity_1.Document);
    const reviewRepo = dataSource.getRepository(review_entity_1.Review);
    const commissionRepo = dataSource.getRepository(commission_entity_1.Commission);
    const client = userEntities['client@tos.com'];
    const admin = userEntities['admin@tos.com'];
    const inspector = userEntities['inspector@tos.com'];
    const ensureQuotation = async (serviceCode, status, price, responseNotes) => {
        let quotation = await quotationRepo.findOne({
            where: { client: { id: client.id }, service: { id: serviceEntities[serviceCode].id } },
            relations: ['client', 'store', 'service'],
        });
        if (!quotation) {
            quotation = quotationRepo.create({
                client,
                store: store,
                service: serviceEntities[serviceCode],
                notes: `Demo ${serviceCode}: 2 contenedores 40HC, retiro estimado esta semana`,
                status,
                price,
                responseNotes,
                respondedAt: price ? new Date() : null,
            });
            quotation = await quotationRepo.save(quotation);
        }
        return quotation;
    };
    await ensureQuotation('SERV-INS-001', 'pending');
    await ensureQuotation('SERV-ALM-001', 'responded', 320, 'Incluye 7 días de almacenaje fiscal y control de inventario.');
    const approvedQuotation = await ensureQuotation('SERV-TRA-001', 'order_created', 600, 'Unidad disponible con chofer certificado.');
    const completedQuotation = await ensureQuotation('SERV-ADU-001', 'order_created', 450, 'Despacho aduanero integral con revisión documental.');
    const ensureOrder = async (quotation, status) => {
        let order = await orderRepo.findOne({ where: { quotation: { id: quotation.id } }, relations: ['client', 'store', 'service', 'quotation'] });
        if (!order) {
            order = await orderRepo.save(orderRepo.create({
                quotation,
                client,
                store: store,
                service: quotation.service,
                finalPrice: quotation.price,
                status,
                completedAt: status === 'completed' ? new Date() : null,
            }));
        }
        return order;
    };
    const activeOrder = await ensureOrder(approvedQuotation, 'pending');
    const completedOrder = await ensureOrder(completedQuotation, 'completed');
    const ensurePayment = async (order, status, reference) => {
        let payment = await paymentRepo.findOne({ where: { reference }, relations: ['order', 'client'] });
        if (!payment) {
            payment = await paymentRepo.save(paymentRepo.create({
                order,
                client,
                amount: order.finalPrice,
                currency: 'USD',
                paymentMethod: 'bank_transfer',
                reference,
                receiptUrl: `https://demo.local/receipts/${reference}.pdf`,
                status,
                confirmedAt: status === 'confirmed' ? new Date() : null,
            }));
        }
        return payment;
    };
    await ensurePayment(activeOrder, 'pending', 'DEMO-PAY-PENDING-001');
    await ensurePayment(completedOrder, 'confirmed', 'DEMO-PAY-CONFIRMED-001');
    const ensureDocument = async (order, type, name, status) => {
        let document = await documentRepo.findOne({ where: { order: { id: order.id }, type }, relations: ['order'] });
        if (!document) {
            document = await documentRepo.save(documentRepo.create({
                order,
                uploadedBy: client,
                type,
                name,
                url: `https://demo.local/documents/${order.id}-${type}.pdf`,
                status,
            }));
        }
        return document;
    };
    await ensureDocument(activeOrder, 'factura', 'Factura proforma transporte', 'pending');
    await ensureDocument(completedOrder, 'bl', 'BL validado despacho aduanero', 'approved');
    let review = await reviewRepo.findOne({ where: { order: { id: completedOrder.id }, user: { id: client.id } } });
    if (!review) {
        review = await reviewRepo.save(reviewRepo.create({
            rating: 5,
            comment: 'Servicio demo completado: despacho rápido y documentación clara.',
            user: client,
            store: store,
            order: completedOrder,
        }));
    }
    store.averageRating = 4.9;
    store.reviewCount = Math.max(Number(store.reviewCount || 0), 16);
    await storeRepo.save(store);
    for (const order of [activeOrder, completedOrder]) {
        let commission = await commissionRepo.findOne({ where: { order: { id: order.id } } });
        if (!commission) {
            commission = await commissionRepo.save(commissionRepo.create({
                order,
                store: store,
                rate: 10,
                amount: Number(order.finalPrice) * 0.1,
                status: order.status === 'completed' ? 'earned' : 'pending',
            }));
        }
    }
    console.log('Marketplace cycle demo seeded');
    const yardRepo = dataSource.getRepository(yard_entity_1.Yard);
    const containerRepo = dataSource.getRepository(container_entity_1.Container);
    const warehouseRepo = dataSource.getRepository(warehouse_entity_1.Warehouse);
    const locationRepo = dataSource.getRepository(storage_location_entity_1.StorageLocation);
    const inventoryItemRepo = dataSource.getRepository(inventory_item_entity_1.InventoryItem);
    const vehicleRepo = dataSource.getRepository(vehicle_entity_1.Vehicle);
    const driverRepo = dataSource.getRepository(driver_entity_1.Driver);
    const tripRepo = dataSource.getRepository(trip_entity_1.Trip);
    const inspectionRepo = dataSource.getRepository(inspection_entity_1.Inspection);
    const inspectionResultRepo = dataSource.getRepository(inspection_result_entity_1.InspectionResult);
    let yard = await yardRepo.findOneBy({ code: 'YARD-PC-A' });
    if (!yard)
        yard = await yardRepo.save({ name: 'Patio Puerto Cabello A', code: 'YARD-PC-A', capacity: 500, status: 'active' });
    let container = await containerRepo.findOneBy({ containerNumber: 'TOSU1234567' });
    if (!container) {
        container = await containerRepo.save({ containerNumber: 'TOSU1234567', type: '40HC', loadStatus: 'full', yard, locationInYard: 'A-01-03', status: 'available' });
    }
    let warehouse = await warehouseRepo.findOneBy({ code: 'WH-PC-01' });
    if (!warehouse)
        warehouse = await warehouseRepo.save({ name: 'Almacén Fiscal Puerto Cabello', code: 'WH-PC-01', address: 'Zona portuaria, Puerto Cabello', status: 'active' });
    let location = await locationRepo.findOne({ where: { warehouse: { id: warehouse.id }, aisle: 'A', shelf: '01', level: '02' } });
    if (!location)
        location = await locationRepo.save({ warehouse, aisle: 'A', shelf: '01', level: '02', status: 'partial' });
    let item = await inventoryItemRepo.findOneBy({ sku: 'DEMO-CARGO-001' });
    if (!item) {
        item = await inventoryItemRepo.save({ sku: 'DEMO-CARGO-001', description: 'Carga demo asociada a orden completada', quantity: 12, unit: 'pallets', warehouse, location, order: completedOrder });
    }
    let vehicle = await vehicleRepo.findOneBy({ plate: 'DEMO-01' });
    if (!vehicle)
        vehicle = await vehicleRepo.save({ plate: 'DEMO-01', model: 'Freightliner Cascadia', type: 'Truck', status: 'active' });
    let driver = await driverRepo.findOneBy({ licenseNumber: 'LIC-DEMO-001' });
    if (!driver)
        driver = await driverRepo.save({ fullName: 'Miguel Torres', licenseNumber: 'LIC-DEMO-001', phone: '+58 412-0000001', status: 'active' });
    let trip = await tripRepo.findOne({ where: { order: { id: activeOrder.id } } });
    if (!trip) {
        trip = await tripRepo.save({ origin: 'Puerto Cabello', destination: 'Valencia - Zona Industrial', vehicle, driver, order: activeOrder, status: 'scheduled' });
    }
    let inspection = await inspectionRepo.findOne({ where: { order: { id: completedOrder.id }, inspectionType: 'Documental' } });
    if (!inspection) {
        inspection = await inspectionRepo.save({ inspectionType: 'Documental', order: completedOrder, inspector, status: 'completed', scheduledAt: new Date() });
    }
    let inspectionResult = await inspectionResultRepo.findOne({ where: { inspection: { id: inspection.id } } });
    if (!inspectionResult) {
        inspectionResult = await inspectionResultRepo.save({
            inspection,
            findings: 'Documentos completos y consistentes para despacho demo.',
            verdict: 'approved',
            checklist: { bl: true, invoice: true, customsForm: true },
        });
    }
    console.log('Operational demo seeded');
    console.log('Demo users: admin@tos.com, client@tos.com, store@tos.com, inspector@tos.com / password123');
    console.log('Seed completed successfully');
    await dataSource.destroy();
}
seed().catch(err => {
    console.error('Seed failed:', err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map