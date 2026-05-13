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
import { CommissionRule } from './commission_rules/entities/commission_rule.entity';
import * as bcrypt from 'bcrypt';
import * as path from 'path';

import { MASTER_CATALOGS_DATA, MVP_SERVICES_DATA, GLOBAL_SETTINGS_DATA, ECOSYSTEM_ACTORS_DATA, COMMISSION_RULES_DATA } from './seed-data';

async function seed() {
  const baseConfig: any = {
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'logistica_tos',
    entities: [path.join(__dirname, '**/*.entity{.ts,.js}')],
  };

  // Phase 1: Initialize without synchronization to clear data
  let dataSource = new DataSource({ ...baseConfig, synchronize: false });
  await dataSource.initialize();
  console.log('Database connected (Phase 1: Cleanup)');

  await dataSource.query('SET FOREIGN_KEY_CHECKS = 0');
  const tables = ['trips', 'vehicles', 'drivers', 'warehouses', 'storage_locations', 'payments', 'commissions', 'inventory_items'];
  for (const table of tables) {
    try {
      await dataSource.query(`TRUNCATE TABLE \`${table}\``);
    } catch (e) {}
  }
  await dataSource.query('SET FOREIGN_KEY_CHECKS = 1');
  await dataSource.destroy();

  // Phase 2: Initialize with synchronization to apply new schema
  dataSource = new DataSource({ ...baseConfig, synchronize: true });
  await dataSource.initialize();
  console.log('Database initialized (Phase 2: Sync & Seed)');

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

  // 3.1 Commission Rules (Doc 25)
  const ruleRepo = dataSource.getRepository(CommissionRule);
  for (const ruleData of COMMISSION_RULES_DATA) {
    let rule = await ruleRepo.findOneBy({ ruleCode: ruleData.ruleCode });
    if (!rule) {
      await ruleRepo.save(ruleData as any);
    }
  }
  console.log('Commission rules seeded');

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
      Object.assign(service, serviceData);
      service = await serviceRepo.save(service);
    }
    serviceEntities[s.code] = service!;
  }
  console.log('Services expanded and seeded');

  // 6. Marketplace Demo Cycle
  const quotationRepo = dataSource.getRepository(Quotation);
  const orderRepo = dataSource.getRepository(Order);
  const paymentRepo = dataSource.getRepository(Payment);
  const client = userEntities['client@tos.com'];

  const ensureQuotation = async (serviceCode: string, status: string, code: string, price?: number): Promise<Quotation> => {
    let quotation = await quotationRepo.findOne({
      where: { quotationCode: code },
      relations: ['client', 'store', 'service', 'currency', 'service.category'],
    });
    if (!quotation) {
      const subtotal = price || 0;
      const tax = subtotal * 0.16;
      const comm = subtotal * 0.10; // Simplified for seed
      
      quotation = quotationRepo.create({
        quotationCode: code,
        client,
        store: store!,
        service: serviceEntities[serviceCode],
        quantity: 1,
        unitMeasure: catalogItemEntities['SERVICE']!,
        subtotalAmount: subtotal,
        taxAmount: tax,
        commissionAmount: comm,
        totalAmount: subtotal + tax,
        currency: catalogItemEntities['USD']!,
        notes: `Demo ${code}: Requerimiento de servicio logístico.`,
        status,
        respondedAt: price ? new Date() : undefined,
      });
      quotation = await quotationRepo.save(quotation);
    }
    return quotation!;
  };

  const approvedQuotation = await ensureQuotation('SER-TRA-001', 'CONVERTED', 'COT-2026-0003', 350);
  const completedQuotation = await ensureQuotation('SER-ADU-001', 'CONVERTED', 'COT-2026-0004', 450);

  const ensureOrder = async (quotation: Quotation, opStatus: string, code: string): Promise<Order> => {
    let order = await orderRepo.findOne({ where: { orderCode: code }, relations: ['client', 'store', 'service', 'service.category', 'quotation', 'currency'] });
    if (!order) {
      order = orderRepo.create({
        orderCode: code,
        quotation,
        client,
        store: store!,
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
    return order!;
  };

  const activeOrder = await ensureOrder(approvedQuotation, 'EXECUTING', 'ORD-2026-0001');
  const completedOrder = await ensureOrder(completedQuotation, 'CLOSED', 'ORD-2026-0002');

  const ensurePayment = async (order: Order, status: string, reference: string, code: string): Promise<Payment> => {
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
      })) as any;
    }
    return payment!;
  };

  await ensurePayment(activeOrder, 'SUBMITTED', 'REF-PAY-001', 'PAY-2026-00001');
  await ensurePayment(completedOrder, 'CONFIRMED', 'REF-PAY-002', 'PAY-2026-00002');

  console.log('Marketplace cycle demo seeded');

  // 7. Operational Modules (Docs 21-22)
  const warehouseRepo = dataSource.getRepository(Warehouse);
  const locationRepo = dataSource.getRepository(StorageLocation);
  const inventoryItemRepo = dataSource.getRepository(InventoryItem);
  const vehicleRepo = dataSource.getRepository(Vehicle);
  const driverRepo = dataSource.getRepository(Driver);
  const tripRepo = dataSource.getRepository(Trip);

  let warehouse = await warehouseRepo.findOneBy({ warehouseCode: 'WH-PC-01' });
  if (!warehouse) {
    warehouse = await warehouseRepo.save({ 
      warehouseName: 'Almacén Fiscal Puerto Cabello', 
      warehouseCode: 'WH-PC-01', 
      address: 'Zona portuaria, Puerto Cabello', 
      status: 'ACTIVE',
      warehouseType: 'BONDED',
      store: store!
    } as any);
  }

  let location = await locationRepo.findOne({ where: { warehouse: { id: warehouse!.id }, locationCode: 'WH-PC-01-A-01-01' } });
  if (!location) {
    location = await locationRepo.save({ 
      warehouse, 
      locationCode: 'WH-PC-01-A-01-01', 
      zone: 'A', 
      aisle: '01', 
      rack: '01', 
      position: '01', 
      status: 'EMPTY' 
    } as any);
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
    } as any);
  }

  let vehicle = await vehicleRepo.findOneBy({ vehicleCode: 'VEH-001' });
  if (!vehicle) {
    vehicle = await vehicleRepo.save({ 
      vehicleCode: 'VEH-001', 
      vehicleType: 'TRUCK', 
      plateNumber: 'DEMO-999', 
      store: store!,
      status: 'ACTIVE' 
    } as any);
  }

  let driver = await driverRepo.findOneBy({ driverCode: 'DRV-001' });
  if (!driver) {
    driver = await driverRepo.save({ 
      driverCode: 'DRV-001', 
      firstName: 'Miguel', 
      lastName: 'Torres', 
      phone: '+58 412-1112233', 
      store: store!,
      status: 'ACTIVE' 
    } as any);
  }

  let trip = await tripRepo.findOne({ where: { order: { id: activeOrder.id } } });
  if (!trip) {
    trip = await tripRepo.save({ 
      tripCode: 'TRP-2026-0001',
      order: activeOrder,
      carrier: store!,
      vehicle,
      driver,
      tripType: 'STANDARD',
      originName: 'PORT-PC',
      originAddress: 'Puerto Cabello Terminal',
      destinationName: 'WH-PC-01',
      destinationAddress: 'Zona Industrial Valencia',
      status: 'ASSIGNED' 
    } as any);
  }

  console.log('Operational demo seeded (Trips, Warehouses, Vehicles)');
  console.log('Seed completed successfully');
  await dataSource.destroy();
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
