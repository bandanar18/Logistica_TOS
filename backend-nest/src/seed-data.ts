export const MASTER_CATALOGS_DATA = [
  {
    code: 'USER_PROFILES',
    name: 'Perfiles de Usuario',
    items: [
      { code: 'PROF-CLI-001', name: 'Cliente final', description: 'Usuario que busca, cotiza y contrata servicios', metadata: { dashboard: '/dashboard/client' } },
      { code: 'PROF-TIE-002', name: 'Tienda logística', description: 'Proveedor de servicios dentro del marketplace', metadata: { dashboard: '/dashboard/store' } },
      { code: 'PROF-SUP-003', name: 'Superadministrador', description: 'Administrador global del marketplace', metadata: { dashboard: '/admin' } },
      { code: 'PROF-OPE-004', name: 'Operador interno', description: 'Usuario operativo del ecosistema', metadata: { dashboard: '/operator' } },
      { code: 'PROF-INS-005', name: 'Inspector', description: 'Usuario que ejecuta inspecciones', metadata: { dashboard: '/inspector' } },
      { code: 'PROF-TRA-006', name: 'Transportista', description: 'Usuario o proveedor de transporte', metadata: { dashboard: '/carrier' } },
      { code: 'PROF-ADU-007', name: 'Agente aduanal', description: 'Usuario o proveedor de servicios aduanales', metadata: { dashboard: '/customs-agent' } },
      { code: 'PROF-AUD-008', name: 'Auditor', description: 'Usuario de consulta y control', metadata: { dashboard: '/auditor' } },
      { code: 'PROF-SOP-009', name: 'Soporte técnico', description: 'Usuario de atención y soporte', metadata: { dashboard: '/support' } },
    ]
  },
  {
    code: 'ACCESS_LEVELS',
    name: 'Niveles de Acceso',
    items: [
      { code: 'ACCESS-000', name: 'Sin acceso', description: 'El perfil no puede ver ni operar el módulo', metadata: { value: 0 } },
      { code: 'ACCESS-001', name: 'Consulta', description: 'Solo lectura', metadata: { value: 1 } },
      { code: 'ACCESS-002', name: 'Operativo básico', description: 'Crear o editar registros propios', metadata: { value: 2 } },
      { code: 'ACCESS-003', name: 'Operativo avanzado', description: 'Ejecutar, responder, aprobar o cerrar procesos', metadata: { value: 3 } },
      { code: 'ACCESS-004', name: 'Administración total', description: 'Administración global del módulo', metadata: { value: 4 } },
    ]
  },
  {
    code: 'SERVICE_CATEGORIES',
    name: 'Categorías de Servicios',
    items: [
      { code: 'CUSTOMS', name: 'Aduana', description: 'Servicios de gestión, trámites y documentación aduanal' },
      { code: 'TRANSPORT', name: 'Transporte', description: 'Servicios de traslado terrestre o multimodal' },
      { code: 'PORT', name: 'Puerto', description: 'Servicios relacionados con operación portuaria' },
      { code: 'TERMINAL', name: 'Terminal', description: 'Servicios de terminal portuaria' },
      { code: 'STORAGE', name: 'Almacenamiento', description: 'Servicios de almacén, depósito y custodia' },
      { code: 'INSPECTION', name: 'Inspección', description: 'Servicios de inspección física, documental o técnica' },
      { code: 'INSURANCE', name: 'Seguros', description: 'Servicios de cobertura y pólizas logísticas' },
      { code: 'PAYMENTS', name: 'Pagos', description: 'Servicios financieros o gestión de pagos' },
      { code: 'DOCUMENTATION', name: 'Documentación', description: 'Preparación, revisión y gestión documental' },
      { code: 'TECHNOLOGY', name: 'Tecnología', description: 'Servicios tecnológicos, trazabilidad, APIs, TOS o soporte digital' },
    ]
  },
  {
    code: 'STORE_TYPES',
    name: 'Tipos de Tiendas Logísticas',
    items: [
      { code: 'CUSTOMS_AGENT', name: 'Agente aduanal' },
      { code: 'CARRIER', name: 'Transportista' },
      { code: 'BONDED_WAREHOUSE', name: 'Almacén fiscal' },
      { code: 'PORT_TERMINAL', name: 'Terminal portuaria' },
      { code: 'SHIPPING_LINE', name: 'Naviera' },
      { code: 'INSPECTION_COMPANY', name: 'Empresa inspectora' },
      { code: 'INSURANCE_COMPANY', name: 'Aseguradora' },
      { code: 'PAYMENT_PROVIDER', name: 'Proveedor de pagos' },
      { code: 'TECH_PROVIDER', name: 'Proveedor tecnológico' },
    ]
  },
  {
    code: 'CARGO_TYPES',
    name: 'Tipos de Carga',
    items: [
      { code: 'GENERAL_CARGO', name: 'Carga general' },
      { code: 'CONTAINERIZED_CARGO', name: 'Carga contenerizada' },
      { code: 'BULK_CARGO', name: 'Carga a granel' },
      { code: 'BREAK_BULK', name: 'Carga fraccionada' },
      { code: 'REEFER_CARGO', name: 'Carga refrigerada' },
      { code: 'HAZMAT_CARGO', name: 'Carga peligrosa' },
      { code: 'OVERSIZED_CARGO', name: 'Carga sobredimensionada' },
    ]
  },
  {
    code: 'CONTAINER_TYPES',
    name: 'Tipos de Contenedores',
    items: [
      { code: '20GP', name: '20 ft General Purpose', metadata: { teu: 1 } },
      { code: '40GP', name: '40 ft General Purpose', metadata: { teu: 2 } },
      { code: '40HC', name: '40 ft High Cube', metadata: { teu: 2 } },
      { code: '45HC', name: '45 ft High Cube', metadata: { teu: 2.25 } },
      { code: '20RF', name: '20 ft Reefer', metadata: { teu: 1 } },
      { code: '40RF', name: '40 ft Reefer', metadata: { teu: 2 } },
    ]
  },
  {
    code: 'DOCUMENT_TYPES',
    name: 'Tipos de Documentos',
    items: [
      { code: 'COMMERCIAL_INVOICE', name: 'Commercial Invoice' },
      { code: 'PACKING_LIST', name: 'Packing List' },
      { code: 'BILL_OF_LADING', name: 'Bill of Lading' },
      { code: 'CUSTOMS_ENTRY', name: 'Customs Entry' },
      { code: 'POWER_OF_ATTORNEY', name: 'Power of Attorney' },
      { code: 'INSPECTION_REPORT', name: 'Inspection Report' },
      { code: 'PAYMENT_RECEIPT', name: 'Payment Receipt' },
    ]
  },
  {
    code: 'UNIT_MEASURES',
    name: 'Unidades de Medida',
    items: [
      { code: 'SERVICE', name: 'Servicio' },
      { code: 'CONTAINER', name: 'Contenedor' },
      { code: 'SHIPMENT', name: 'Embarque' },
      { code: 'DOCUMENT', name: 'Documento' },
      { code: 'HOUR', name: 'Hora' },
      { code: 'DAY', name: 'Día' },
      { code: 'TRIP', name: 'Viaje' },
      { code: 'TON', name: 'Tonelada' },
    ]
  },
  {
    code: 'CURRENCIES',
    name: 'Monedas',
    items: [
      { code: 'USD', name: 'United States Dollar', metadata: { symbol: '$' } },
      { code: 'EUR', name: 'Euro', metadata: { symbol: '€' }, status: 'inactive' },
    ]
  },
  {
    code: 'PORTS',
    name: 'Puertos',
    items: [
      { code: 'PORT-HOUSTON', name: 'Port Houston', metadata: { country: 'USA', region: 'Texas' } },
      { code: 'PORT-MIAMI', name: 'PortMiami', metadata: { country: 'USA', region: 'Florida' } },
      { code: 'PORT-LA', name: 'Port of Los Angeles', metadata: { country: 'USA', region: 'California' } },
    ]
  },
  {
    code: 'QUOTATION_STATUSES',
    name: 'Estados de Cotización',
    items: [
      { code: 'REQUESTED', name: 'Solicitada' },
      { code: 'IN_REVIEW', name: 'En revisión' },
      { code: 'RESPONDED', name: 'Respondida' },
      { code: 'APPROVED', name: 'Aprobada' },
      { code: 'REJECTED', name: 'Rechazada' },
      { code: 'CONVERTED', name: 'Convertida en orden' },
    ]
  },
  {
    code: 'ORDER_STATUSES',
    name: 'Estados de Orden',
    items: [
      { code: 'CREATED', name: 'Creada' },
      { code: 'IN_PROCESS', name: 'En proceso' },
      { code: 'PENDING_DOCUMENTS', name: 'Pendiente de documentos' },
      { code: 'EXECUTING', name: 'En ejecución' },
      { code: 'CLOSED', name: 'Cerrada' },
      { code: 'CANCELLED', name: 'Cancelada' },
    ]
  },
  {
    code: 'DOCUMENT_STATUSES',
    name: 'Estados Documentales',
    items: [
      { code: 'PENDING', name: 'Pendiente' },
      { code: 'UPLOADED', name: 'Cargado' },
      { code: 'VALIDATED', name: 'Validado' },
      { code: 'REJECTED', name: 'Rechazado' },
    ]
  },
  {
    code: 'FINANCIAL_STATUSES',
    name: 'Estados Financieros',
    items: [
      { code: 'UNPAID', name: 'No pagado' },
      { code: 'PENDING', name: 'Pendiente' },
      { code: 'CONFIRMED', name: 'Confirmado' },
      { code: 'REJECTED', name: 'Rechazado' },
    ]
  },
  {
    code: 'WAREHOUSE_TYPES',
    name: 'Tipos de Almacén',
    items: [
      { code: 'BONDED', name: 'Almacén Fiscal', description: 'Depósito bajo control aduanero' },
      { code: 'GENERAL', name: 'Almacén General', description: 'Depósito de mercancía nacionalizada' },
      { code: 'REFRIGERATED', name: 'Almacén Refrigerado', description: 'Control de temperatura' },
    ]
  },
  {
    code: 'TOS_CONTAINER_STATUSES',
    name: 'Estados de Contenedor (TOS)',
    items: [
      { code: 'AVAILABLE', name: 'Disponible' },
      { code: 'BLOCKED', name: 'Bloqueado/Retenido' },
      { code: 'DEPARTED', name: 'Despachado/Salida' },
      { code: 'UNDER_INSPECTION', name: 'En Inspección' },
    ]
  },
  {
    code: 'OPERATIONAL_STATUSES',
    name: 'Estados Operativos de Carga',
    items: [
      { code: 'EMPTY', name: 'Vacío' },
      { code: 'FULL', name: 'Lleno' },
      { code: 'PARTIAL', name: 'Parcial' },
    ]
  }
];

export const MVP_SERVICES_DATA = [
  {
    code: 'SER-ADU-001',
    name: 'Despacho aduanal básico de importación',
    categoryCode: 'CUSTOMS',
    description: 'Servicio de gestión básica para el despacho aduanal de una operación de importación.',
    scope: 'Revisión inicial, preparación de datos, coordinación documental y seguimiento básico del trámite.',
    exclusions: 'No incluye impuestos, aranceles, multas, costos oficiales, almacenaje, demoras ni transporte.',
    basePrice: 450.00,
    billingUnit: 'SERVICE',
    slaHours: 48,
    requiredDocuments: ['COMMERCIAL_INVOICE', 'PACKING_LIST', 'BILL_OF_LADING', 'POWER_OF_ATTORNEY'],
    status: 'published'
  },
  {
    code: 'SER-TRA-001',
    name: 'Transporte drayage local por contenedor',
    categoryCode: 'TRANSPORT',
    description: 'Servicio de transporte local de contenedor desde terminal o puerto hacia destino cercano.',
    scope: 'Coordinación de unidad, conductor, retiro, traslado y evidencia de entrega.',
    exclusions: 'No incluye demoras, almacenaje, citas especiales, peajes especiales, multas ni costos de terminal.',
    basePrice: 350.00,
    billingUnit: 'TRIP',
    slaHours: 24,
    requiredDocuments: ['BILL_OF_LADING'],
    status: 'published'
  },
  {
    code: 'SER-ALM-001',
    name: 'Recepcion de mercancía en almacen',
    categoryCode: 'STORAGE',
    description: 'Recepción operativa de mercancía o contenedor en almacén autorizado.',
    scope: 'Registro de ingreso, asignación de ubicación, evidencia de recepción y estado inicial.',
    exclusions: 'No incluye almacenamiento prolongado, inspecciones adicionales, manipulación especial o despacho.',
    basePrice: 180.00,
    billingUnit: 'SHIPMENT',
    slaHours: 24,
    requiredDocuments: ['PACKING_LIST', 'BILL_OF_LADING'],
    status: 'published'
  },
  {
    code: 'SER-INS-001',
    name: 'Inspeccion fisica de carga',
    categoryCode: 'INSPECTION',
    description: 'Inspección física básica de carga, contenedor o mercancía.',
    scope: 'Programación, revisión visual, checklist, fotografías y resultado básico.',
    exclusions: 'No incluye certificaciones oficiales, análisis de laboratorio ni servicios especializados.',
    basePrice: 220.00,
    billingUnit: 'SERVICE',
    slaHours: 48,
    requiredDocuments: ['PACKING_LIST'],
    status: 'published'
  }
];
