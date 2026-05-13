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

import { MASTER_CATALOGS_DATA, MVP_SERVICES_DATA } from './seed-data';

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

  const catalogItemEntities: Record<string, MasterCatalogItem> = {};

  for (const catData of MASTER_CATALOGS_DATA) {
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
        } as any);
      }
      catalogItemEntities[itemData.code] = item!;
    }
  }
  console.log('Master catalogs expanded and seeded');

  // 4. Store
  const storeRepo = dataSource.getRepository(Store);
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
    } as any);
  }
  console.log('Store seeded');

  // 5. Services
  const serviceRepo = dataSource.getRepository(Service);
  const serviceEntities: Record<string, Service> = {};

  for (const s of MVP_SERVICES_DATA) {
    let service = await serviceRepo.findOneBy({ code: s.code, store: { id: store!.id } });
    const category = catalogItemEntities[s.categoryCode];
    
    const serviceData = {
      ...s,
      category,
      store,
    };
    delete (serviceData as any).categoryCode;

    if (!service) {
      service = await serviceRepo.save(serviceData as any);
    } else {
      // Update existing service with new fields
      Object.assign(service, serviceData);
      service = await serviceRepo.save(service);
    }
    serviceEntities[s.code] = service!;
  }
  console.log('Services expanded and seeded');

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

  await ensureQuotation('SER-INS-001', 'pending');
  await ensureQuotation('SER-ALM-001', 'responded', 320, 'Incluye 7 días de almacenaje fiscal y control de inventario.');
  const approvedQuotation = await ensureQuotation('SER-TRA-001', 'order_created', 350, 'Unidad disponible con chofer certificado.');
  const completedQuotation = await ensureQuotation('SER-ADU-001', 'order_created', 450, 'Despacho aduanero integral con revisión documental.');

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

  let warehouse = await warehouseRepo.findOneBy({ code: 'WH-PC-01' });
  if (!warehouse) {
    warehouse = await warehouseRepo.save({ 
      name: 'Almacén Fiscal Puerto Cabello', 
      code: 'WH-PC-01', 
      address: 'Zona portuaria, Puerto Cabello', 
      status: 'active',
      type: catalogItemEntities['BONDED']
    } as any);
  }

  let yard = await yardRepo.findOneBy({ code: 'YARD-PC-A' });
  if (!yard) yard = await yardRepo.save({ name: 'Patio Puerto Cabello A', code: 'YARD-PC-A', capacity: 500, status: 'active' } as any);

  let container = await containerRepo.findOneBy({ containerNumber: 'TOSU1234567' });
  if (!container) {
    container = await containerRepo.save({ 
      containerNumber: 'TOSU1234567', 
      type: catalogItemEntities['40HC'], 
      loadStatus: catalogItemEntities['FULL'], 
      yard, 
      locationInYard: 'A-01-03', 
      status: catalogItemEntities['AVAILABLE'] 
    } as any);
  }

  let location = await locationRepo.findOne({ where: { warehouse: { id: warehouse!.id }, aisle: 'A', shelf: '01', level: '02' } });
  if (!location) location = await locationRepo.save({ warehouse, aisle: 'A', shelf: '01', level: '02', status: 'partial' } as any);

  let item = await inventoryItemRepo.findOneBy({ sku: 'DEMO-CARGO-001' });
  if (!item) {
    item = await inventoryItemRepo.save({ 
      sku: 'DEMO-CARGO-001', 
      description: 'Carga demo asociada a orden completada', 
      quantity: 12, 
      unit: catalogItemEntities['TON'], 
      warehouse, 
      location, 
      order: completedOrder 
    } as any);
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
