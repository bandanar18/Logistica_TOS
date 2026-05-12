import { DataSource } from 'typeorm';
import { Role } from './roles/entities/role.entity';
import { User } from './users/entities/user.entity';
import { MasterCatalog } from './catalogs/entities/master-catalog.entity';
import { MasterCatalogItem } from './catalogs/entities/master-catalog-item.entity';
import { Store } from './stores/entities/store.entity';
import { Service } from './services/entities/service.entity';
import { Quotation } from './quotations/entities/quotation.entity';
import { Order } from './orders/entities/order.entity';
import { Payment } from './payments/entities/payment.entity';
import { Document } from './documents/entities/document.entity';
import { Review } from './reviews/entities/review.entity';
import { Commission } from './commissions/entities/commission.entity';
import { Yard } from './tos/entities/yard.entity';
import { Container } from './tos/entities/container.entity';
import { Warehouse } from './storage/entities/warehouse.entity';
import { StorageLocation } from './storage/entities/storage-location.entity';
import { InventoryItem } from './storage/entities/inventory-item.entity';
import { Vehicle } from './transport/entities/vehicle.entity';
import { Driver } from './transport/entities/driver.entity';
import { Trip } from './transport/entities/trip.entity';
import { Inspection } from './inspections/entities/inspection.entity';
import { InspectionResult } from './inspections/entities/inspection-result.entity';
import * as bcrypt from 'bcrypt';
import * as path from 'path';

async function seed() {
  const dataSource = new DataSource({
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

  // 1. Roles
  const roleRepo = dataSource.getRepository(Role);
  const roles = ['admin', 'client', 'store', 'inspector'];
  const roleEntities: Record<string, Role> = {};
  
  for (const rName of roles) {
    let role = await roleRepo.findOneBy({ name: rName });
    if (!role) {
      role = await roleRepo.save({ name: rName, description: `Role for ${rName}` } as any);
    }
    roleEntities[rName] = role!;
  }
  console.log('Roles seeded');

  // 2. Users
  const userRepo = dataSource.getRepository(User);
  const passwordHash = await bcrypt.hash('password123', 10);
  
  const usersData = [
    { firstName: 'Super', lastName: 'Admin', email: 'admin@tos.com', role: roleEntities['admin'] },
    { firstName: 'Carlos', lastName: 'Cliente', email: 'client@tos.com', role: roleEntities['client'] },
    { firstName: 'Pedro', lastName: 'Tienda', email: 'store@tos.com', role: roleEntities['store'] },
    { firstName: 'Isabel', lastName: 'Inspectora', email: 'inspector@tos.com', role: roleEntities['inspector'] },
  ];

  const userEntities: Record<string, User> = {};
  for (const u of usersData) {
    let user = await userRepo.findOneBy({ email: u.email });
    if (!user) {
      user = await userRepo.save({ ...u, passwordHash } as any);
    }
    userEntities[u.email] = user!;
  }
  console.log('Users seeded');

  // 3. Catalogs
  const catalogRepo = dataSource.getRepository(MasterCatalog);
  const catalogItemRepo = dataSource.getRepository(MasterCatalogItem);

  // Service Categories
  let serviceCat = await catalogRepo.findOneBy({ code: 'SERVICE_CATEGORIES' });
  if (!serviceCat) {
    serviceCat = await catalogRepo.save({ code: 'SERVICE_CATEGORIES', name: 'Categorías de Servicios' } as any);
  }

  const categories = [
    { code: 'ADUANA', name: 'Aduana' },
    { code: 'TRANSPORTE', name: 'Transporte' },
    { code: 'ALMACENAMIENTO', name: 'Almacenamiento' },
    { code: 'INSPECCION', name: 'Inspección' },
  ];

  const categoryEntities: Record<string, MasterCatalogItem> = {};
  for (const c of categories) {
    let item = await catalogItemRepo.findOneBy({ code: c.code, catalog: { id: serviceCat!.id } });
    if (!item) {
      item = await catalogItemRepo.save({ ...c, catalog: serviceCat } as any);
    }
    categoryEntities[c.code] = item!;
  }

  // Ports
  let portsCat = await catalogRepo.findOneBy({ code: 'PORTS' });
  if (!portsCat) {
    portsCat = await catalogRepo.save({ code: 'PORTS', name: 'Puertos' } as any);
  }

  const ports = [
    { code: 'PUERTO_CABELLO', name: 'Puerto Cabello' },
    { code: 'LA_GUAIRA', name: 'La Guaira' },
    { code: 'MARACAIBO', name: 'Maracaibo' },
  ];

  for (const p of ports) {
    let item = await catalogItemRepo.findOneBy({ code: p.code, catalog: { id: portsCat!.id } });
    if (!item) {
      await catalogItemRepo.save({ ...p, catalog: portsCat } as any);
    }
  }
  console.log('Catalogs seeded');

  // 4. Store
  const storeRepo = dataSource.getRepository(Store);
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
    } as any);
  }
  console.log('Store seeded');

  // 5. Services
  const serviceRepo = dataSource.getRepository(Service);
  const servicesData = [
    { name: 'Despacho Aduanero Importación', code: 'SERV-ADU-001', basePrice: 450, billingUnit: 'Contenedor', category: categoryEntities['ADUANA'], store, status: 'published' },
    { name: 'Transporte Puerto a Almacén', code: 'SERV-TRA-001', basePrice: 600, billingUnit: 'Viaje', category: categoryEntities['TRANSPORTE'], store, status: 'published' },
    { name: 'Almacenamiento Fiscal por 7 días', code: 'SERV-ALM-001', basePrice: 320, billingUnit: 'Semana', category: categoryEntities['ALMACENAMIENTO'], store, status: 'published' },
    { name: 'Inspección física de contenedor', code: 'SERV-INS-001', basePrice: 180, billingUnit: 'Inspección', category: categoryEntities['INSPECCION'], store, status: 'published' },
  ];

  const serviceEntities: Record<string, Service> = {};

  for (const s of servicesData) {
    let service = await serviceRepo.findOneBy({ code: s.code, store: { id: store!.id } });
    if (!service) {
      service = await serviceRepo.save(s as any);
    }
    serviceEntities[s.code] = service!;
  }
  console.log('Services seeded');

  // 6. End-to-end marketplace demo data
  const quotationRepo = dataSource.getRepository(Quotation);
  const orderRepo = dataSource.getRepository(Order);
  const paymentRepo = dataSource.getRepository(Payment);
  const documentRepo = dataSource.getRepository(Document);
  const reviewRepo = dataSource.getRepository(Review);
  const commissionRepo = dataSource.getRepository(Commission);
  const client = userEntities['client@tos.com'];
  const admin = userEntities['admin@tos.com'];
  const inspector = userEntities['inspector@tos.com'];

  const ensureQuotation = async (serviceCode: string, status: string, price?: number, responseNotes?: string): Promise<Quotation> => {
    let quotation = await quotationRepo.findOne({
      where: { client: { id: client.id }, service: { id: serviceEntities[serviceCode].id } },
      relations: ['client', 'store', 'service'],
    });
    if (!quotation) {
      quotation = quotationRepo.create({
        client,
        store: store!,
        service: serviceEntities[serviceCode],
        notes: `Demo ${serviceCode}: 2 contenedores 40HC, retiro estimado esta semana`,
        status,
        price,
        responseNotes,
        respondedAt: price ? new Date() : null as any,
      });
      quotation = await quotationRepo.save(quotation) as any;
    }
    return quotation!;
  };

  await ensureQuotation('SERV-INS-001', 'pending');
  await ensureQuotation('SERV-ALM-001', 'responded', 320, 'Incluye 7 días de almacenaje fiscal y control de inventario.');
  const approvedQuotation = await ensureQuotation('SERV-TRA-001', 'order_created', 600, 'Unidad disponible con chofer certificado.');
  const completedQuotation = await ensureQuotation('SERV-ADU-001', 'order_created', 450, 'Despacho aduanero integral con revisión documental.');

  const ensureOrder = async (quotation: Quotation, status: string): Promise<Order> => {
    let order = await orderRepo.findOne({ where: { quotation: { id: quotation.id } }, relations: ['client', 'store', 'service', 'quotation'] });
    if (!order) {
      order = await orderRepo.save(orderRepo.create({
        quotation,
        client,
        store: store!,
        service: quotation.service,
        finalPrice: quotation.price,
        status,
        completedAt: status === 'completed' ? new Date() : null as any,
      })) as any;
    }
    return order!;
  };

  const activeOrder = await ensureOrder(approvedQuotation, 'pending');
  const completedOrder = await ensureOrder(completedQuotation, 'completed');

  const ensurePayment = async (order: Order, status: string, reference: string): Promise<Payment> => {
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
        confirmedAt: status === 'confirmed' ? new Date() : null as any,
      })) as any;
    }
    return payment!;
  };

  await ensurePayment(activeOrder, 'pending', 'DEMO-PAY-PENDING-001');
  await ensurePayment(completedOrder, 'confirmed', 'DEMO-PAY-CONFIRMED-001');

  const ensureDocument = async (order: Order, type: string, name: string, status: string): Promise<Document> => {
    let document = await documentRepo.findOne({ where: { order: { id: order.id }, type }, relations: ['order'] });
    if (!document) {
      document = await documentRepo.save(documentRepo.create({
        order,
        uploadedBy: client,
        type,
        name,
        url: `https://demo.local/documents/${order.id}-${type}.pdf`,
        status,
      })) as any;
    }
    return document!;
  };

  await ensureDocument(activeOrder, 'factura', 'Factura proforma transporte', 'pending');
  await ensureDocument(completedOrder, 'bl', 'BL validado despacho aduanero', 'approved');

  let review = await reviewRepo.findOne({ where: { order: { id: completedOrder.id }, user: { id: client.id } } });
  if (!review) {
    review = await reviewRepo.save(reviewRepo.create({
      rating: 5,
      comment: 'Servicio demo completado: despacho rápido y documentación clara.',
      user: client,
      store: store!,
      order: completedOrder,
    })) as any;
  }
  store!.averageRating = 4.9;
  store!.reviewCount = Math.max(Number(store!.reviewCount || 0), 16);
  await storeRepo.save(store!);

  for (const order of [activeOrder, completedOrder]) {
    let commission = await commissionRepo.findOne({ where: { order: { id: order.id } } });
    if (!commission) {
      commission = await commissionRepo.save(commissionRepo.create({
        order,
        store: store!,
        rate: 10,
        amount: Number(order.finalPrice) * 0.1,
        status: order.status === 'completed' ? 'earned' : 'pending',
      })) as any;
    }
  }
  console.log('Marketplace cycle demo seeded');

  // 7. Operational modules demo data
  const yardRepo = dataSource.getRepository(Yard);
  const containerRepo = dataSource.getRepository(Container);
  const warehouseRepo = dataSource.getRepository(Warehouse);
  const locationRepo = dataSource.getRepository(StorageLocation);
  const inventoryItemRepo = dataSource.getRepository(InventoryItem);
  const vehicleRepo = dataSource.getRepository(Vehicle);
  const driverRepo = dataSource.getRepository(Driver);
  const tripRepo = dataSource.getRepository(Trip);
  const inspectionRepo = dataSource.getRepository(Inspection);
  const inspectionResultRepo = dataSource.getRepository(InspectionResult);

  let yard = await yardRepo.findOneBy({ code: 'YARD-PC-A' });
  if (!yard) yard = await yardRepo.save({ name: 'Patio Puerto Cabello A', code: 'YARD-PC-A', capacity: 500, status: 'active' } as any);

  let container = await containerRepo.findOneBy({ containerNumber: 'TOSU1234567' });
  if (!container) {
    container = await containerRepo.save({ containerNumber: 'TOSU1234567', type: '40HC', loadStatus: 'full', yard, locationInYard: 'A-01-03', status: 'available' } as any);
  }

  let warehouse = await warehouseRepo.findOneBy({ code: 'WH-PC-01' });
  if (!warehouse) warehouse = await warehouseRepo.save({ name: 'Almacén Fiscal Puerto Cabello', code: 'WH-PC-01', address: 'Zona portuaria, Puerto Cabello', status: 'active' } as any);

  let location = await locationRepo.findOne({ where: { warehouse: { id: warehouse!.id }, aisle: 'A', shelf: '01', level: '02' } });
  if (!location) location = await locationRepo.save({ warehouse, aisle: 'A', shelf: '01', level: '02', status: 'partial' } as any);

  let item = await inventoryItemRepo.findOneBy({ sku: 'DEMO-CARGO-001' });
  if (!item) {
    item = await inventoryItemRepo.save({ sku: 'DEMO-CARGO-001', description: 'Carga demo asociada a orden completada', quantity: 12, unit: 'pallets', warehouse, location, order: completedOrder } as any);
  }

  let vehicle = await vehicleRepo.findOneBy({ plate: 'DEMO-01' });
  if (!vehicle) vehicle = await vehicleRepo.save({ plate: 'DEMO-01', model: 'Freightliner Cascadia', type: 'Truck', status: 'active' } as any);

  let driver = await driverRepo.findOneBy({ licenseNumber: 'LIC-DEMO-001' });
  if (!driver) driver = await driverRepo.save({ fullName: 'Miguel Torres', licenseNumber: 'LIC-DEMO-001', phone: '+58 412-0000001', status: 'active' } as any);

  let trip = await tripRepo.findOne({ where: { order: { id: activeOrder.id } } });
  if (!trip) {
    trip = await tripRepo.save({ origin: 'Puerto Cabello', destination: 'Valencia - Zona Industrial', vehicle, driver, order: activeOrder, status: 'scheduled' } as any);
  }

  let inspection = await inspectionRepo.findOne({ where: { order: { id: completedOrder.id }, inspectionType: 'Documental' } });
  if (!inspection) {
    inspection = await inspectionRepo.save({ inspectionType: 'Documental', order: completedOrder, inspector, status: 'completed', scheduledAt: new Date() } as any);
  }

  let inspectionResult = await inspectionResultRepo.findOne({ where: { inspection: { id: inspection!.id } } });
  if (!inspectionResult) {
    inspectionResult = await inspectionResultRepo.save({
      inspection,
      findings: 'Documentos completos y consistentes para despacho demo.',
      verdict: 'approved',
      checklist: { bl: true, invoice: true, customsForm: true },
    } as any);
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
