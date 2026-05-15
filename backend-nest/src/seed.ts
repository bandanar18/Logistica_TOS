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
  const tables = ['reviews', 'inspections', 'inspection_results', 'trips', 'vehicles', 'drivers', 'inventory_items', 'storage_locations', 'warehouses', 'containers', 'yards', 'commissions', 'payments', 'documents', 'orders', 'quotations', 'services', 'stores'];
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

  // 1. Roles (Aligned with Antigravity Master Plan)
  const roleRepo = dataSource.getRepository(Role);
  const roles = [
    { name: 'PROF-CLI-001', description: 'Cliente Final' },
    { name: 'PROF-TIE-002', description: 'Tienda Logística' },
    { name: 'PROF-SUP-003', description: 'Superadmin' },
    { name: 'PROF-OPE-004', description: 'Operador Interno' },
    { name: 'PROF-INS-005', description: 'Inspector' },
    { name: 'PROF-TRP-006', description: 'Transportista' },
    { name: 'PROF-AGA-007', description: 'Agente Aduanal' },
    { name: 'PROF-AUD-008', description: 'Auditor' },
  ];
  const roleEntities: Record<string, Role> = {};
  
  for (const r of roles) {
    let role = await roleRepo.findOneBy({ name: r.name });
    if (!role) {
      role = await roleRepo.save(r as any);
    }
    roleEntities[r.name] = role!;
  }
  console.log('9 functional roles seeded');

  // 2. Users (Admin, Client, and 4 Stores)
  const userRepo = dataSource.getRepository(User);
  const passwordHash = await bcrypt.hash('password123', 10);
  
  const usersData = [
    { firstName: 'Super', lastName: 'Admin', email: 'admin@tos.com', role: roleEntities['PROF-SUP-003'] },
    { firstName: 'Carlos', lastName: 'Cliente', email: 'client@tos.com', role: roleEntities['PROF-CLI-001'] },
    { firstName: 'Aduanas', lastName: 'Globales', email: 'aduana@tos.com', role: roleEntities['PROF-TIE-002'] },
    { firstName: 'Transportes', lastName: 'Veloces', email: 'transporte@tos.com', role: roleEntities['PROF-TIE-002'] },
    { firstName: 'Almacenes', lastName: 'Seguros', email: 'almacen@tos.com', role: roleEntities['PROF-TIE-002'] },
    { firstName: 'Inspectores', lastName: 'Certificados', email: 'inspector_store@tos.com', role: roleEntities['PROF-TIE-002'] },
    { firstName: 'TOS', lastName: 'Global', email: 'store@tos.com', role: roleEntities['PROF-TIE-002'] },
    { firstName: 'Operador', lastName: 'Interno', email: 'operador@tos.com', role: roleEntities['PROF-OPE-004'] },
    { firstName: 'Inspector', lastName: 'Campo', email: 'inspector@tos.com', role: roleEntities['PROF-INS-005'] },
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

  // 4. Stores
  const storeRepo = dataSource.getRepository(Store);
  
  const storesData = [
    { ownerEmail: 'aduana@tos.com', legalName: 'Aduanas Globales S.A.', taxId: 'J-111111111', type: 'CUSTOMS_AGENT', basePort: 'PORT-HOUSTON', brandColor: '#1e40af' },
    { ownerEmail: 'transporte@tos.com', legalName: 'Transportes Veloces Express', taxId: 'J-222222222', type: 'CARRIER', basePort: 'PORT-HOUSTON', brandColor: '#b91c1c' },
    { ownerEmail: 'almacen@tos.com', legalName: 'Almacenes Seguros Fiscales', taxId: 'J-333333333', type: 'BONDED_WAREHOUSE', basePort: 'PORT-MIAMI', brandColor: '#047857' },
    { ownerEmail: 'inspector_store@tos.com', legalName: 'Inspectores Certificados C.A.', taxId: 'J-444444444', type: 'INSPECTION_COMPANY', basePort: 'PORT-LA', brandColor: '#4c1d95' },
    { ownerEmail: 'store@tos.com', legalName: 'TOS Global Solutions', taxId: 'J-555555555', type: 'TECH_PROVIDER', basePort: 'PORT-MIAMI', brandColor: '#0369a1' },
  ];

  const storeEntities: Record<string, Store> = {};
  for (const sData of storesData) {
    let store = await storeRepo.findOneBy({ owner: { id: userEntities[sData.ownerEmail].id } });
    if (!store) {
      store = await storeRepo.save({
        legalName: sData.legalName,
        taxId: sData.taxId,
        basePort: sData.basePort,
        description: `Especialistas en logística y ${sData.type.toLowerCase()}.`,
        brandColor: sData.brandColor,
        status: 'approved',
        owner: userEntities[sData.ownerEmail],
        averageRating: 4.5 + Math.random() * 0.5,
        reviewCount: Math.floor(Math.random() * 50) + 10
      } as any);
    }
    storeEntities[sData.ownerEmail] = store!;
  }
  console.log('Stores seeded');

  // 5. Services
  const serviceRepo = dataSource.getRepository(Service);
  const serviceEntities: Record<string, Service> = {};

  const serviceToStoreMapping: Record<string, string> = {
    'SER-ADU-001': 'aduana@tos.com',
    'SER-TRA-001': 'transporte@tos.com',
    'SER-ALM-001': 'almacen@tos.com',
    'SER-INS-001': 'inspector_store@tos.com',
    'SER-TECH-001': 'store@tos.com',
    'SER-INS-002': 'store@tos.com',
    'SER-ALM-002': 'store@tos.com',
    'SER-TRA-002': 'store@tos.com',
  };

  for (const s of MVP_SERVICES_DATA) {
    const ownerEmail = serviceToStoreMapping[s.code];
    const store = storeEntities[ownerEmail];
    
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

  // Extra services for store@tos.com (TOS Global Solutions)
  const extraServices = [
    {
      code: 'SER-TECH-001',
      name: 'Trazabilidad Avanzada y API',
      categoryCode: 'TECHNOLOGY',
      description: 'Acceso a la plataforma de monitoreo en tiempo real y API para integración de sistemas.',
      scope: 'Dashboards personalizados, alertas de hitos y documentación digital automatizada.',
      exclusions: 'No incluye hardware de tracking, solo acceso a la plataforma software.',
      basePrice: 120.00,
      billingUnit: 'SERVICE',
      slaHours: 12,
      requiredDocuments: [],
      status: 'published'
    },
    {
      code: 'SER-ALM-002',
      name: 'Almacenamiento Refrigerado / Congelado',
      categoryCode: 'STORAGE',
      description: 'Custodia de mercancía en cava con control de temperatura estricto.',
      scope: 'Monitoreo de temperatura 24/7, reporte de cadena de frío y manipulación especializada.',
      exclusions: 'No incluye transporte refrigerado ni seguros de carga perecedera.',
      basePrice: 550.00,
      billingUnit: 'TON',
      slaHours: 24,
      requiredDocuments: ['PACKING_LIST'],
      status: 'published'
    },
    {
      code: 'SER-TRA-002',
      name: 'Forwarding Internacional (Miami - Caracas)',
      categoryCode: 'TRANSPORT',
      description: 'Coordinación logística puerta a puerta desde USA hacia Venezuela.',
      scope: 'Consolidación, flete internacional, desaduanamiento y entrega final.',
      exclusions: 'Sujeto a inspecciones aduanales, no incluye aranceles variables.',
      basePrice: 850.00,
      billingUnit: 'SHIPMENT',
      slaHours: 168,
      requiredDocuments: ['COMMERCIAL_INVOICE', 'PACKING_LIST'],
      status: 'published'
    }
  ];

  for (const s of extraServices) {
    const store = storeEntities['store@tos.com'];
    const category = catalogItemEntities[s.categoryCode];
    
    let service = await serviceRepo.findOneBy({ code: s.code, store: { id: store!.id } });
    const serviceData = { ...s, category, store };
    delete (serviceData as any).categoryCode;

    if (!service) {
      await serviceRepo.save(serviceData as any);
    }
  }

  console.log('Services seeded');

  // 6. Marketplace Demo Cycle
  const quotationRepo = dataSource.getRepository(Quotation);
  const orderRepo = dataSource.getRepository(Order);
  const paymentRepo = dataSource.getRepository(Payment);
  const commissionRepo = dataSource.getRepository(Commission);
  const client = userEntities['client@tos.com'];

  const ensureQuotation = async (serviceCode: string, status: string, code: string, price?: number): Promise<Quotation> => {
    let quotation = await quotationRepo.findOne({
      where: { quotationCode: code },
      relations: ['client', 'store', 'service', 'currency', 'service.category'],
    });
    if (!quotation) {
      const service = serviceEntities[serviceCode];
      const subtotal = price || service.basePrice;
      const tax = subtotal * 0.16;
      const comm = subtotal * 0.10; // Simplified for seed
      
      quotation = quotationRepo.create({
        quotationCode: code,
        client,
        store: service.store,
        service,
        quantity: 1,
        unitMeasure: catalogItemEntities['SERVICE']!,
        subtotalAmount: subtotal,
        taxAmount: tax,
        commissionAmount: comm,
        totalAmount: subtotal + tax,
        currency: catalogItemEntities['USD']!,
        notes: `Demo ${code}: Requerimiento de servicio logístico para importación.`,
        status,
        respondedAt: price ? new Date() : undefined,
      });
      quotation = await quotationRepo.save(quotation);
    }
    return quotation!;
  };

  // Customs: Completed & Paid
  const quotCustoms = await ensureQuotation('SER-ADU-001', 'CONVERTED', 'COT-2026-0001', 450);
  // Transport: Executing & Unpaid
  const quotTransport = await ensureQuotation('SER-TRA-001', 'CONVERTED', 'COT-2026-0002', 380);
  // Storage: Created & Unpaid
  const quotStorage = await ensureQuotation('SER-ALM-001', 'CONVERTED', 'COT-2026-0003', 200);
  // Inspection: In Review
  const quotInspection = await ensureQuotation('SER-INS-001', 'IN_REVIEW', 'COT-2026-0004');

  const ensureOrder = async (quotation: Quotation, opStatus: string, code: string): Promise<Order> => {
    let order = await orderRepo.findOne({ where: { orderCode: code }, relations: ['client', 'store', 'service', 'service.category', 'quotation', 'currency'] });
    if (!order) {
      order = orderRepo.create({
        orderCode: code,
        quotation,
        client,
        store: quotation.store,
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

  const orderCustoms = await ensureOrder(quotCustoms, 'CLOSED', 'ORD-2026-0001');
  const orderTransport = await ensureOrder(quotTransport, 'EXECUTING', 'ORD-2026-0002');
  const orderStorage = await ensureOrder(quotStorage, 'CREATED', 'ORD-2026-0003');

  const ensurePaymentAndCommission = async (order: Order, status: string, reference: string, code: string): Promise<Payment> => {
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

      if (status === 'CONFIRMED') {
        const commRate = order.service.category.code === 'CUSTOMS' ? 12 : 10;
        const commAmount = (order.subtotalAmount || 0) * (commRate / 100);
        await commissionRepo.save(commissionRepo.create({
          order,
          store: order.store,
          baseAmount: order.subtotalAmount,
          commissionType: 'PERCENTAGE',
          rate: commRate,
          amount: commAmount,
          status: 'CONFIRMED',
          confirmedAt: new Date()
        }));
      }
    }
    return payment!;
  };

  // Paid Custom Order
  await ensurePaymentAndCommission(orderCustoms, 'CONFIRMED', 'REF-PAY-001', 'PAY-2026-00001');
  // Submitted Transport Payment
  await ensurePaymentAndCommission(orderTransport, 'SUBMITTED', 'REF-PAY-002', 'PAY-2026-00002');

  console.log('Marketplace network transactions seeded');

  // 7. Operational Modules (Docs 21-22)
  const warehouseRepo = dataSource.getRepository(Warehouse);
  const locationRepo = dataSource.getRepository(StorageLocation);
  const inventoryItemRepo = dataSource.getRepository(InventoryItem);
  const vehicleRepo = dataSource.getRepository(Vehicle);
  const driverRepo = dataSource.getRepository(Driver);
  const tripRepo = dataSource.getRepository(Trip);
  const reviewRepo = dataSource.getRepository(Review);

  // Storage Operational Data
  const storageStore = storeEntities['almacen@tos.com'];
  let warehouse = await warehouseRepo.save({ 
    warehouseName: 'Almacén Fiscal Puerto', 
    warehouseCode: 'WH-PC-01', 
    address: 'Zona portuaria', 
    status: 'ACTIVE',
    warehouseType: 'BONDED',
    store: storageStore
  } as any);

  let location = await locationRepo.save({ 
    warehouse, 
    locationCode: 'WH-PC-01-A-01-01', 
    zone: 'A', 
    aisle: '01', 
    rack: '01', 
    position: '01', 
    status: 'FULL' 
  } as any);

  await inventoryItemRepo.save({ 
    sku: 'DEMO-CARGO-001', 
    description: 'Carga demo asignada a orden de almacenaje', 
    quantity: 10, 
    unit: catalogItemEntities['TON'], 
    warehouse, 
    location, 
    order: orderStorage 
  } as any);

  // Transport Operational Data
  const transportStore = storeEntities['transporte@tos.com'];
  let vehicle = await vehicleRepo.save({ 
    vehicleCode: 'VEH-001', 
    vehicleType: 'TRUCK', 
    plateNumber: 'DEMO-999', 
    store: transportStore,
    status: 'ACTIVE' 
  } as any);

  let driver = await driverRepo.save({ 
    driverCode: 'DRV-001', 
    firstName: 'Miguel', 
    lastName: 'Torres', 
    phone: '+58 412-1112233', 
    store: transportStore,
    status: 'ACTIVE' 
  } as any);

  await tripRepo.save({ 
    tripCode: 'TRP-2026-0001',
    order: orderTransport,
    carrier: transportStore,
    vehicle,
    driver,
    tripType: 'STANDARD',
    originName: 'PORT-PC',
    originAddress: 'Puerto Terminal',
    destinationName: 'WH-PC-01',
    destinationAddress: 'Zona Industrial',
    status: 'IN_TRANSIT',
    departedAt: new Date()
  } as any);

  // 8. Reviews
  await reviewRepo.save({
    order: orderCustoms,
    client,
    store: orderCustoms.store,
    rating: 5,
    comment: 'Excelente servicio aduanal, rápido y sin problemas.',
    status: 'APPROVED'
  });

  console.log('Operational demo and reviews seeded');
  console.log('Seed completed successfully - Ecosistema Demo Realista Inyectado!');
  await dataSource.destroy();
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
