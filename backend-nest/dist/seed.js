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
const bcrypt = __importStar(require("bcrypt"));
const path = __importStar(require("path"));
async function seed() {
    const dataSource = new typeorm_1.DataSource({
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
    const roleRepo = dataSource.getRepository(role_entity_1.Role);
    const roles = ['admin', 'client', 'store'];
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
    const itemRepo = dataSource.getRepository(master_catalog_item_entity_1.MasterCatalogItem);
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
        let item = await itemRepo.findOneBy({ code: c.code, catalog: { id: serviceCat.id } });
        if (!item) {
            item = await itemRepo.save({ ...c, catalog: serviceCat });
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
        let item = await itemRepo.findOneBy({ code: p.code, catalog: { id: portsCat.id } });
        if (!item) {
            await itemRepo.save({ ...p, catalog: portsCat });
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
    ];
    for (const s of servicesData) {
        let service = await serviceRepo.findOneBy({ code: s.code, store: { id: store.id } });
        if (!service) {
            await serviceRepo.save(s);
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
//# sourceMappingURL=seed.js.map