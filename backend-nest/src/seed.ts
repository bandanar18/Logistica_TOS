import { DataSource } from 'typeorm';
import { Role } from './roles/entities/role.entity';
import { User } from './users/entities/user.entity';
import { MasterCatalog } from './catalogs/entities/master-catalog.entity';
import { MasterCatalogItem } from './catalogs/entities/master-catalog-item.entity';
import { Store } from './stores/entities/store.entity';
import { Service } from './services/entities/service.entity';
import * as bcrypt from 'bcrypt';
import * as path from 'path';

async function seed() {
  const dataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'logistica_tos',
    entities: [path.join(__dirname, '**/*.entity{.ts,.js}')],
    synchronize: true,
  });

  await dataSource.initialize();
  console.log('Database initialized');

  // 1. Roles
  const roleRepo = dataSource.getRepository(Role);
  const roles = ['admin', 'client', 'store'];
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
  const itemRepo = dataSource.getRepository(MasterCatalogItem);

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
    let item = await itemRepo.findOneBy({ code: c.code, catalog: { id: serviceCat!.id } });
    if (!item) {
      item = await itemRepo.save({ ...c, catalog: serviceCat } as any);
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
    let item = await itemRepo.findOneBy({ code: p.code, catalog: { id: portsCat!.id } });
    if (!item) {
      await itemRepo.save({ ...p, catalog: portsCat } as any);
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
  ];

  for (const s of servicesData) {
    let service = await serviceRepo.findOneBy({ code: s.code, store: { id: store!.id } });
    if (!service) {
      await serviceRepo.save(s as any);
    }
  }
  console.log('Services seeded');

  console.log('Seed completed successfully');
  await dataSource.destroy();
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
