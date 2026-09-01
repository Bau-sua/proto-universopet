// ============================================================================
// Demo data — single source of truth for the mockup.
// Used by BOTH the Prisma seed (prisma/seed.ts) and the UI fallback when the
// database is not available, so the demo catalog always looks the same.
//
// All prices are in ARS (Argentina), warm pet-shop catalog in neutral Spanish.
// Images are placeholders: https://placehold.co (PNG, brand palette).
// ============================================================================

import type {
  DemoCategory,
  DemoCustomer,
  DemoCustomerAddress,
  DemoLocation,
  DemoOrder,
  DemoProduct,
  DemoStockEntry,
  ProductView,
  VariantView,
} from "../types/catalog";

// ---------------------------------------------------------------------------
// Location (one store today, multi-store ready)
// ---------------------------------------------------------------------------

export const demoLocation: DemoLocation = {
  id: "loc-centro",
  name: "Sucursal Centro",
  type: "BOTH",
  servesOnline: true,
  addressLine1: "Av. Corrientes 2310",
  city: "CABA",
  province: "CABA",
  postalCode: "1042",
  phone: "+54 11 5555-1234",
};

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export const demoCategories: DemoCategory[] = [
  {
    id: "cat-alimentos",
    parentSlug: null,
    name: "Alimentos",
    slug: "alimentos",
    description: "Balanceados y comidas para perros y gatos",
    sortOrder: 1,
    isActive: true,
  },
  {
    id: "cat-alimento-perros",
    parentSlug: "alimentos",
    name: "Alimento para Perros",
    slug: "alimento-perros",
    description: "Balanceados, snacks y comida húmeda para perros",
    sortOrder: 2,
    isActive: true,
  },
  {
    id: "cat-alimento-gatos",
    parentSlug: "alimentos",
    name: "Alimento para Gatos",
    slug: "alimento-gatos",
    description: "Balanceados y comida húmeda para gatos",
    sortOrder: 3,
    isActive: true,
  },
  {
    id: "cat-juguetes",
    parentSlug: null,
    name: "Juguetes",
    slug: "juguetes",
    description: "Juguetes resistentes para morder, correr y jugar",
    sortOrder: 4,
    isActive: true,
  },
  {
    id: "cat-accesorios",
    parentSlug: null,
    name: "Accesorios",
    slug: "accesorios",
    description: "Correas, collares, camas y comedores",
    sortOrder: 5,
    isActive: true,
  },
  {
    id: "cat-higiene",
    parentSlug: null,
    name: "Higiene y Cuidado",
    slug: "higiene",
    description: "Arena sanitaria, shampoo, antipulgas y más",
    sortOrder: 6,
    isActive: true,
  },
];

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

const img = (bg: string, dims: string, text: string): string =>
  `https://placehold.co/${dims}/${bg}/FFFFFF/png?text=${encodeURIComponent(text)}`;

const ORANGE = "EA580C";
const ORANGE_LIGHT = "FDBA74";
const TEAL = "0D9488";
const BROWN = "9A3412";
const AMBER = "F59E0B";

export const demoProducts: DemoProduct[] = [
  {
    id: "prod-balanceado-perro",
    sku: "ALI-PER-15",
    name: "Balanceado Premium Perro Adulto 15 kg",
    slug: "balanceado-premium-perro-adulto-15kg",
    description:
      "Alimento completo y balanceado para perros adultos de razas medianas y grandes. Formulado con proteína de alta calidad, ácidos grasos Omega 3 y 6 para piel y pelo saludables, y prebióticos para una digestión sana. Presentación familiar de 15 kg.",
    price: 98500,
    compareAtPrice: 115000,
    categorySlug: "alimento-perros",
    weightGrams: 15000,
    isActive: true,
    isFeatured: true,
    tags: ["alimento", "perro", "premium", "balanceado"],
    images: [
      {
        id: "img-bal-perro-1",
        url: img(ORANGE, "600x600", "Balanceado Perro 15kg"),
        altText: "Bolsa de balanceado premium para perro adulto de 15 kg",
        sortOrder: 1,
        isPrimary: true,
      },
      {
        id: "img-bal-perro-2",
        url: img(ORANGE_LIGHT, "800x600", "Bolsa 15kg - Detalle"),
        altText: "Detalle de la bolsa de balanceado para perro adulto",
        sortOrder: 2,
        isPrimary: false,
      },
      {
        id: "img-bal-perro-3",
        url: img(BROWN, "800x600", "Ingredientes Premium"),
        altText: "Información nutricional del balanceado premium",
        sortOrder: 3,
        isPrimary: false,
      },
    ],
    variants: [
      {
        id: "var-bal-perro-3kg",
        sku: "ALI-PER-03",
        name: "3 kg",
        price: 28500,
        attributes: { peso: "3 kg", "tamaño": "Individual" },
        imageUrl: null,
        isActive: true,
        sortOrder: 1,
      },
      {
        id: "var-bal-perro-15kg",
        sku: "ALI-PER-15",
        name: "15 kg",
        price: 98500,
        attributes: { peso: "15 kg", "tamaño": "Familiar" },
        imageUrl: null,
        isActive: true,
        sortOrder: 2,
      },
      {
        id: "var-bal-perro-25kg",
        sku: "ALI-PER-25",
        name: "25 kg",
        price: 148000,
        attributes: { peso: "25 kg", "tamaño": "Rinde más" },
        imageUrl: null,
        isActive: true,
        sortOrder: 3,
      },
    ],
  },
  {
    id: "prod-balanceado-gato",
    sku: "ALI-GAT-75",
    name: "Balanceado Premium Gato Adulto 7.5 kg",
    slug: "balanceado-premium-gato-adulto-75kg",
    description:
      "Alimento completo para gatos adultos, con taurina para el cuidado del corazón y la visión, y una fórmula que ayuda a reducir las bolas de pelo. Textura crocante que favorece la salud dental.",
    price: 72500,
    compareAtPrice: 84000,
    categorySlug: "alimento-gatos",
    weightGrams: 7500,
    isActive: true,
    isFeatured: true,
    tags: ["alimento", "gato", "premium", "balanceado"],
    images: [
      {
        id: "img-bal-gato-1",
        url: img(TEAL, "600x600", "Balanceado Gato 7.5kg"),
        altText: "Bolsa de balanceado premium para gato adulto de 7.5 kg",
        sortOrder: 1,
        isPrimary: true,
      },
      {
        id: "img-bal-gato-2",
        url: img(ORANGE_LIGHT, "800x600", "Fórmula con Taurina"),
        altText: "Detalle de la fórmula con taurina del balanceado para gatos",
        sortOrder: 2,
        isPrimary: false,
      },
    ],
    variants: [
      {
        id: "var-bal-gato-15kg",
        sku: "ALI-GAT-15",
        name: "1.5 kg",
        price: 19500,
        attributes: { peso: "1.5 kg", "tamaño": "Prueba" },
        imageUrl: null,
        isActive: true,
        sortOrder: 1,
      },
      {
        id: "var-bal-gato-75kg",
        sku: "ALI-GAT-75",
        name: "7.5 kg",
        price: 72500,
        attributes: { peso: "7.5 kg", "tamaño": "Familiar" },
        imageUrl: null,
        isActive: true,
        sortOrder: 2,
      },
    ],
  },
  {
    id: "prod-snack-pollo",
    sku: "SNK-PER-50",
    name: "Snacks de Pollo 500 g",
    slug: "snacks-de-pollo-500g",
    description:
      "Premios suaves de pollo deshidratado, ideales para el adiestramiento. Sin colorantes ni conservantes artificiales. Ricos y saludables, a tu mascota le van a encantar.",
    price: 14500,
    compareAtPrice: null,
    categorySlug: "alimento-perros",
    weightGrams: 500,
    isActive: true,
    isFeatured: true,
    tags: ["snacks", "perro", "premios"],
    images: [
      {
        id: "img-snack-1",
        url: img(AMBER, "600x600", "Snacks de Pollo"),
        altText: "Bolsa de snacks de pollo de 500 gramos",
        sortOrder: 1,
        isPrimary: true,
      },
    ],
    variants: [
      {
        id: "var-snack-250g",
        sku: "SNK-PER-25",
        name: "250 g",
        price: 8500,
        attributes: { peso: "250 g" },
        imageUrl: null,
        isActive: true,
        sortOrder: 1,
      },
      {
        id: "var-snack-500g",
        sku: "SNK-PER-50",
        name: "500 g",
        price: 14500,
        attributes: { peso: "500 g" },
        imageUrl: null,
        isActive: true,
        sortOrder: 2,
      },
    ],
  },
  {
    id: "prod-comida-humeda",
    sku: "HUM-GAT-40",
    name: "Comida Húmeda en Lata 400 g",
    slug: "comida-humeda-en-lata-400g",
    description:
      "Comida húmeda premium en lata, sabor pollo. Alta palatabilidad, ideal para gatos exigentes o como complemento del balanceado. Sin subproductos.",
    price: 8900,
    compareAtPrice: null,
    categorySlug: "alimento-gatos",
    weightGrams: 400,
    isActive: true,
    isFeatured: false,
    tags: ["gato", "comida humeda", "lata"],
    images: [
      {
        id: "img-humeda-1",
        url: img(TEAL, "600x600", "Comida Humeda en Lata"),
        altText: "Lata de comida húmeda para gatos de 400 gramos",
        sortOrder: 1,
        isPrimary: true,
      },
    ],
    variants: [],
  },
  {
    id: "prod-arena-20kg",
    sku: "HIG-ARE-20",
    name: "Arena Sanitaria Aglomerante 20 kg",
    slug: "arena-sanitaria-aglomerante-20kg",
    description:
      "Arena sanitaria ultra aglomerante con control de olores, 99% libre de polvo. Forma grumos firmes que facilitan la limpieza diaria. Presentación de 20 kg para toda la familia felina.",
    price: 32000,
    compareAtPrice: 38900,
    categorySlug: "higiene",
    weightGrams: 20000,
    isActive: true,
    isFeatured: true,
    tags: ["gato", "arena", "higiene"],
    images: [
      {
        id: "img-arena-1",
        url: img(BROWN, "600x600", "Arena Sanitaria 20kg"),
        altText: "Bolsa de arena sanitaria aglomerante de 20 kilos",
        sortOrder: 1,
        isPrimary: true,
      },
      {
        id: "img-arena-2",
        url: img(ORANGE_LIGHT, "800x600", "Ultra Aglomerante"),
        altText: "Detalle del poder aglomerante de la arena sanitaria",
        sortOrder: 2,
        isPrimary: false,
      },
    ],
    variants: [],
  },
  {
    id: "prod-shampoo-perro",
    sku: "HIG-SHA-50",
    name: "Shampoo Hipoalergénico 500 ml",
    slug: "shampoo-hipoalergenico-500ml",
    description:
      "Shampoo apto para perros y gatos, pH balanceado y fórmula hipoalergénica con aloe vera. Limpia en profundidad, suaviza el pelo y respeta la piel sensible.",
    price: 16800,
    compareAtPrice: null,
    categorySlug: "higiene",
    weightGrams: 500,
    isActive: true,
    isFeatured: false,
    tags: ["higiene", "shampoo", "piel sensible"],
    images: [
      {
        id: "img-shampoo-1",
        url: img(TEAL, "600x600", "Shampoo Hipoalergenico"),
        altText: "Frasco de shampoo hipoalergénico de 500 mililitros",
        sortOrder: 1,
        isPrimary: true,
      },
    ],
    variants: [
      {
        id: "var-shampoo-250ml",
        sku: "HIG-SHA-25",
        name: "250 ml",
        price: 9800,
        attributes: { "volumen": "250 ml" },
        imageUrl: null,
        isActive: true,
        sortOrder: 1,
      },
      {
        id: "var-shampoo-500ml",
        sku: "HIG-SHA-50",
        name: "500 ml",
        price: 16800,
        attributes: { "volumen": "500 ml" },
        imageUrl: null,
        isActive: true,
        sortOrder: 2,
      },
    ],
  },
  {
    id: "prod-antipulgas",
    sku: "HIG-ANT-01",
    name: "Antipulgas y Garrapatas Spot-On",
    slug: "antipulgas-y-garrapatas-spot-on",
    description:
      "Pipeta spot-on de aplicación mensual para perros de 10 a 25 kg. Protege contra pulgas, garrapatas, piojos y mosquitos. Efecto repelente desde las primeras 24 horas.",
    price: 22400,
    compareAtPrice: null,
    categorySlug: "higiene",
    weightGrams: 5,
    isActive: true,
    isFeatured: false,
    tags: ["antipulgas", "parasitos", "perro"],
    images: [
      {
        id: "img-antipulgas-1",
        url: img(ORANGE, "600x600", "Antipulgas Spot-On"),
        altText: "Caja de pipetas antipulgas y garrapatas spot-on",
        sortOrder: 1,
        isPrimary: true,
      },
    ],
    variants: [],
  },
  {
    id: "prod-cepillo-dental",
    sku: "HIG-CEP-01",
    name: "Kit Cepillo Dental + Pasta",
    slug: "kit-cepillo-dental-pasta",
    description:
      "Kit completo de higiene dental para mascotas: cepillo con mango ergonómico y pasta sabor pollo, enzimática, que ayuda a prevenir sarro y mal aliento.",
    price: 11900,
    compareAtPrice: null,
    categorySlug: "higiene",
    weightGrams: 120,
    isActive: true,
    isFeatured: false,
    tags: ["higiene", "dental", "perro", "gato"],
    images: [
      {
        id: "img-cepillo-1",
        url: img(ORANGE_LIGHT, "600x600", "Kit Dental"),
        altText: "Kit de cepillo dental y pasta para mascotas",
        sortOrder: 1,
        isPrimary: true,
      },
    ],
    variants: [],
  },
  {
    id: "prod-hueso-goma",
    sku: "JUG-HUE-01",
    name: "Hueso de Goma Resistente",
    slug: "hueso-de-goma-resistente",
    description:
      "Hueso de goma natural ultra resistente para perros masticadores. Ayuda a limpiar dientes y entretener a tu mascota durante horas. Apto como juguete de uso diario.",
    price: 13500,
    compareAtPrice: null,
    categorySlug: "juguetes",
    weightGrams: 350,
    isActive: true,
    isFeatured: false,
    tags: ["juguete", "perro", "masticacion"],
    images: [
      {
        id: "img-hueso-1",
        url: img(AMBER, "600x600", "Hueso de Goma"),
        altText: "Hueso de goma resistente para perros",
        sortOrder: 1,
        isPrimary: true,
      },
    ],
    variants: [
      {
        id: "var-hueso-mediano",
        sku: "JUG-HUE-M",
        name: "Mediano",
        price: 13500,
        attributes: { "talle": "Mediano" },
        imageUrl: null,
        isActive: true,
        sortOrder: 1,
      },
      {
        id: "var-hueso-grande",
        sku: "JUG-HUE-G",
        name: "Grande",
        price: 16500,
        attributes: { "talle": "Grande" },
        imageUrl: null,
        isActive: true,
        sortOrder: 2,
      },
    ],
  },
  {
    id: "prod-pelota-sonido",
    sku: "JUG-PEL-01",
    name: "Pelota con Sonido",
    slug: "pelota-con-sonido",
    description:
      "Pelota con sonido interior que estimula el instinto de caza de perros y gatos. Material resistente y fácil de limpiar. Ideal para jugar en casa o al aire libre.",
    price: 8200,
    compareAtPrice: null,
    categorySlug: "juguetes",
    weightGrams: 90,
    isActive: true,
    isFeatured: false,
    tags: ["juguete", "pelota", "sonido"],
    images: [
      {
        id: "img-pelota-1",
        url: img(ORANGE, "600x600", "Pelota con Sonido"),
        altText: "Pelota con sonido para perros y gatos",
        sortOrder: 1,
        isPrimary: true,
      },
    ],
    variants: [],
  },
  {
    id: "prod-cuerda-trenzada",
    sku: "JUG-CUE-01",
    name: "Cuerda Trenzada para Jugar",
    slug: "cuerda-trenzada-para-jugar",
    description:
      "Cuerda trenzada de algodón con nudos, perfecta para juegos de tira y afloja. Ayuda a la higiene dental y fortalece el vínculo con tu perro. Resistente al agua.",
    price: 9900,
    compareAtPrice: null,
    categorySlug: "juguetes",
    weightGrams: 200,
    isActive: true,
    isFeatured: false,
    tags: ["juguete", "cuerda", "perro"],
    images: [
      {
        id: "img-cuerda-1",
        url: img(TEAL, "600x600", "Cuerda Trenzada"),
        altText: "Cuerda trenzada con nudos para perros",
        sortOrder: 1,
        isPrimary: true,
      },
    ],
    variants: [],
  },
  {
    id: "prod-cama-iglu",
    sku: "ACC-CAM-IG",
    name: "Cama Tipo Iglú para Gatos",
    slug: "cama-tipo-iglu-para-gatos",
    description:
      "Cama tipo iglú acolchada y desmontable, con interior de felpa suave que mantiene el calor. Crea un refugio seguro para que tu gato descanse tranquilo. Fácil de lavar.",
    price: 68900,
    compareAtPrice: 79000,
    categorySlug: "accesorios",
    weightGrams: 1800,
    isActive: true,
    isFeatured: true,
    tags: ["cama", "gato", "confort"],
    images: [
      {
        id: "img-cama-1",
        url: img(BROWN, "600x600", "Cama Tipo Igloo"),
        altText: "Cama tipo iglú acolchada para gatos",
        sortOrder: 1,
        isPrimary: true,
      },
      {
        id: "img-cama-2",
        url: img(ORANGE_LIGHT, "800x600", "Interior de Felpa"),
        altText: "Interior de felpa suave de la cama tipo iglú",
        sortOrder: 2,
        isPrimary: false,
      },
    ],
    variants: [],
  },
  {
    id: "prod-collar-piel",
    sku: "ACC-COL-01",
    name: "Collar Ajustable con Identificación",
    slug: "collar-ajustable-con-identificacion",
    description:
      "Collar de nylon resistente con hebilla de seguridad y argolla para chapita identificatoria. Incluye chapita grabable con el nombre y el teléfono de contacto.",
    price: 15800,
    compareAtPrice: null,
    categorySlug: "accesorios",
    weightGrams: 80,
    isActive: true,
    isFeatured: false,
    tags: ["collar", "perro", "identificacion"],
    images: [
      {
        id: "img-collar-1",
        url: img(ORANGE, "600x600", "Collar con Chapita"),
        altText: "Collar ajustable con chapita identificatoria",
        sortOrder: 1,
        isPrimary: true,
      },
    ],
    variants: [
      {
        id: "var-collar-s",
        sku: "ACC-COL-S",
        name: "Talle S",
        price: 13800,
        attributes: { "talle": "S (35-45 cm)" },
        imageUrl: null,
        isActive: true,
        sortOrder: 1,
      },
      {
        id: "var-collar-m",
        sku: "ACC-COL-M",
        name: "Talle M",
        price: 15800,
        attributes: { "talle": "M (45-60 cm)" },
        imageUrl: null,
        isActive: true,
        sortOrder: 2,
      },
      {
        id: "var-collar-l",
        sku: "ACC-COL-L",
        name: "Talle L",
        price: 17800,
        attributes: { "talle": "L (60-75 cm)" },
        imageUrl: null,
        isActive: true,
        sortOrder: 3,
      },
    ],
  },
  {
    id: "prod-correa-retractil",
    sku: "ACC-COR-05",
    name: "Correa Retráctil 5 m",
    slug: "correa-retractil-5m",
    description:
      "Correa retráctil de 5 metros con freno de una mano y cinta de nylon reforzada. Ideal para paseos cómodos y seguros, hasta 25 kg de mascota.",
    price: 24500,
    compareAtPrice: null,
    categorySlug: "accesorios",
    weightGrams: 420,
    isActive: true,
    isFeatured: true,
    tags: ["correa", "paseo", "perro"],
    images: [
      {
        id: "img-correa-1",
        url: img(TEAL, "600x600", "Correa Retractil 5m"),
        altText: "Correa retráctil de cinco metros para perros",
        sortOrder: 1,
        isPrimary: true,
      },
    ],
    variants: [],
  },
  {
    id: "prod-comedero-antivuelco",
    sku: "ACC-COM-01",
    name: "Comedero Antivuelco con Base de Goma",
    slug: "comedero-antivuelco-con-base-de-goma",
    description:
      "Comedero de acero inoxidable con base de goma antideslizante que evita vuelcos y ruidos. Higiénico, fácil de lavar y con capacidad de 1 litro.",
    price: 18900,
    compareAtPrice: null,
    categorySlug: "accesorios",
    weightGrams: 600,
    isActive: true,
    isFeatured: false,
    tags: ["comedero", "perro", "gato"],
    images: [
      {
        id: "img-comedero-1",
        url: img(AMBER, "600x600", "Comedero Antivuelco"),
        altText: "Comedero antivuelco con base de goma",
        sortOrder: 1,
        isPrimary: true,
      },
    ],
    variants: [],
  },
];

// ---------------------------------------------------------------------------
// Stock (one location; multi-store ready model)
// ---------------------------------------------------------------------------

export const demoStock: DemoStockEntry[] = [
  { id: "stk-bal-perro-3kg", productSlug: "balanceado-premium-perro-adulto-15kg", variantSku: "ALI-PER-03", locationSlug: "loc-centro", quantityAvailable: 18, quantityReserved: 2, reorderThreshold: 6 },
  { id: "stk-bal-perro-15kg", productSlug: "balanceado-premium-perro-adulto-15kg", variantSku: "ALI-PER-15", locationSlug: "loc-centro", quantityAvailable: 12, quantityReserved: 1, reorderThreshold: 5 },
  { id: "stk-bal-perro-25kg", productSlug: "balanceado-premium-perro-adulto-15kg", variantSku: "ALI-PER-25", locationSlug: "loc-centro", quantityAvailable: 9, quantityReserved: 0, reorderThreshold: 4 },
  { id: "stk-bal-gato-15kg", productSlug: "balanceado-premium-gato-adulto-75kg", variantSku: "ALI-GAT-15", locationSlug: "loc-centro", quantityAvailable: 22, quantityReserved: 0, reorderThreshold: 6 },
  { id: "stk-bal-gato-75kg", productSlug: "balanceado-premium-gato-adulto-75kg", variantSku: "ALI-GAT-75", locationSlug: "loc-centro", quantityAvailable: 15, quantityReserved: 1, reorderThreshold: 5 },
  { id: "stk-snack-250g", productSlug: "snacks-de-pollo-500g", variantSku: "SNK-PER-25", locationSlug: "loc-centro", quantityAvailable: 30, quantityReserved: 0, reorderThreshold: 10 },
  { id: "stk-snack-500g", productSlug: "snacks-de-pollo-500g", variantSku: "SNK-PER-50", locationSlug: "loc-centro", quantityAvailable: 24, quantityReserved: 3, reorderThreshold: 8 },
  { id: "stk-humeda-400g", productSlug: "comida-humeda-en-lata-400g", variantSku: null, locationSlug: "loc-centro", quantityAvailable: 40, quantityReserved: 0, reorderThreshold: 12 },
  { id: "stk-arena-20kg", productSlug: "arena-sanitaria-aglomerante-20kg", variantSku: null, locationSlug: "loc-centro", quantityAvailable: 14, quantityReserved: 2, reorderThreshold: 6 },
  { id: "stk-shampoo-250ml", productSlug: "shampoo-hipoalergenico-500ml", variantSku: "HIG-SHA-25", locationSlug: "loc-centro", quantityAvailable: 16, quantityReserved: 0, reorderThreshold: 5 },
  { id: "stk-shampoo-500ml", productSlug: "shampoo-hipoalergenico-500ml", variantSku: "HIG-SHA-50", locationSlug: "loc-centro", quantityAvailable: 11, quantityReserved: 1, reorderThreshold: 5 },
  { id: "stk-antipulgas", productSlug: "antipulgas-y-garrapatas-spot-on", variantSku: null, locationSlug: "loc-centro", quantityAvailable: 20, quantityReserved: 0, reorderThreshold: 6 },
  { id: "stk-cepillo", productSlug: "kit-cepillo-dental-pasta", variantSku: null, locationSlug: "loc-centro", quantityAvailable: 4, quantityReserved: 0, reorderThreshold: 5 }, // stock alert!
  { id: "stk-hueso-mediano", productSlug: "hueso-de-goma-resistente", variantSku: "JUG-HUE-M", locationSlug: "loc-centro", quantityAvailable: 15, quantityReserved: 0, reorderThreshold: 5 },
  { id: "stk-hueso-grande", productSlug: "hueso-de-goma-resistente", variantSku: "JUG-HUE-G", locationSlug: "loc-centro", quantityAvailable: 8, quantityReserved: 0, reorderThreshold: 4 },
  { id: "stk-pelota", productSlug: "pelota-con-sonido", variantSku: null, locationSlug: "loc-centro", quantityAvailable: 26, quantityReserved: 0, reorderThreshold: 8 },
  { id: "stk-cuerda", productSlug: "cuerda-trenzada-para-jugar", variantSku: null, locationSlug: "loc-centro", quantityAvailable: 19, quantityReserved: 0, reorderThreshold: 6 },
  { id: "stk-cama-iglu", productSlug: "cama-tipo-iglu-para-gatos", variantSku: null, locationSlug: "loc-centro", quantityAvailable: 7, quantityReserved: 1, reorderThreshold: 3 },
  { id: "stk-collar-s", productSlug: "collar-ajustable-con-identificacion", variantSku: "ACC-COL-S", locationSlug: "loc-centro", quantityAvailable: 10, quantityReserved: 0, reorderThreshold: 4 },
  { id: "stk-collar-m", productSlug: "collar-ajustable-con-identificacion", variantSku: "ACC-COL-M", locationSlug: "loc-centro", quantityAvailable: 12, quantityReserved: 2, reorderThreshold: 4 },
  { id: "stk-collar-l", productSlug: "collar-ajustable-con-identificacion", variantSku: "ACC-COL-L", locationSlug: "loc-centro", quantityAvailable: 6, quantityReserved: 0, reorderThreshold: 4 },
  { id: "stk-correa", productSlug: "correa-retractil-5m", variantSku: null, locationSlug: "loc-centro", quantityAvailable: 13, quantityReserved: 0, reorderThreshold: 5 },
  { id: "stk-comedero", productSlug: "comedero-antivuelco-con-base-de-goma", variantSku: null, locationSlug: "loc-centro", quantityAvailable: 17, quantityReserved: 0, reorderThreshold: 5 },
];

// ---------------------------------------------------------------------------
// Customer (demo)
// ---------------------------------------------------------------------------

export const demoCustomer: DemoCustomer = {
  id: "cust-001",
  email: "maria.gonzalez@example.com",
  name: "María González",
  phone: "+54 9 11 5555-9876",
  dni: "30123456",
};

export const demoCustomerAddress: DemoCustomerAddress = {
  id: "addr-001",
  customerId: "cust-001",
  label: "Casa",
  street: "Av. Rivadavia",
  streetNumber: "3320",
  city: "CABA",
  province: "CABA",
  postalCode: "1203",
  isDefault: true,
};

// ---------------------------------------------------------------------------
// Orders, subscription, coupons, notifications (admin demo)
// ---------------------------------------------------------------------------

export const demoOrders: DemoOrder[] = [
  {
    id: "order-1001",
    orderNumber: 1001,
    customerId: "cust-001",
    status: "DELIVERED",
    subtotal: 127500,
    shippingCost: 0,
    discountAmount: 0,
    taxAmount: 0,
    total: 127500,
    paymentMethod: "MERCADOPAGO",
    paymentStatus: "PAID",
    invoiceType: "B",
    invoiceNumber: "00001-00001001",
    invoiceCae: "72345678901234",
    daysAgo: 7,
    items: [
      {
        id: "item-1001-1",
        productSlug: "balanceado-premium-perro-adulto-15kg",
        variantSku: "ALI-PER-15",
        quantity: 1,
        unitPrice: 98500,
        totalPrice: 98500,
        productName: "Balanceado Premium Perro Adulto 15 kg",
        variantName: "15 kg",
      },
      {
        id: "item-1001-2",
        productSlug: "snacks-de-pollo-500g",
        variantSku: "SNK-PER-50",
        quantity: 2,
        unitPrice: 14500,
        totalPrice: 29000,
        productName: "Snacks de Pollo 500 g",
        variantName: "500 g",
      },
    ],
  },
  {
    id: "order-1002",
    orderNumber: 1002,
    customerId: "cust-001",
    status: "SHIPPED",
    subtotal: 84700,
    shippingCost: 0,
    discountAmount: 0,
    taxAmount: 0,
    total: 84700,
    paymentMethod: "MERCADOPAGO",
    paymentStatus: "PAID",
    invoiceType: null,
    invoiceNumber: null,
    invoiceCae: null,
    daysAgo: 2,
    items: [
      {
        id: "item-1002-1",
        productSlug: "cama-tipo-iglu-para-gatos",
        variantSku: null,
        quantity: 1,
        unitPrice: 68900,
        totalPrice: 68900,
        productName: "Cama Tipo Iglú para Gatos",
        variantName: null,
      },
      {
        id: "item-1002-2",
        productSlug: "collar-ajustable-con-identificacion",
        variantSku: "ACC-COL-M",
        quantity: 1,
        unitPrice: 15800,
        totalPrice: 15800,
        productName: "Collar Ajustable con Identificación",
        variantName: "Talle M",
      },
    ],
  },
  {
    id: "order-1003",
    orderNumber: 1003,
    customerId: "cust-001",
    status: "PENDING",
    subtotal: 48800,
    shippingCost: 6500,
    discountAmount: 0,
    taxAmount: 0,
    total: 55300,
    paymentMethod: "MERCADOPAGO",
    paymentStatus: "PENDING",
    invoiceType: null,
    invoiceNumber: null,
    invoiceCae: null,
    daysAgo: 0,
    items: [
      {
        id: "item-1003-1",
        productSlug: "arena-sanitaria-aglomerante-20kg",
        variantSku: null,
        quantity: 1,
        unitPrice: 32000,
        totalPrice: 32000,
        productName: "Arena Sanitaria Aglomerante 20 kg",
        variantName: null,
      },
      {
        id: "item-1003-2",
        productSlug: "shampoo-hipoalergenico-500ml",
        variantSku: "HIG-SHA-50",
        quantity: 1,
        unitPrice: 16800,
        totalPrice: 16800,
        productName: "Shampoo Hipoalergénico 500 ml",
        variantName: "500 ml",
      },
    ],
  },
];

export const demoSubscription: {
  id: string;
  customerId: string;
  productSlug: string;
  variantSku: string;
  quantity: number;
  frequency: "WEEKLY" | "BIWEEKLY" | "MONTHLY";
  pricePerDelivery: number;
  status: "ACTIVE" | "PAUSED" | "CANCELLED" | "COMPLETED";
  nextDeliveryDateOffsetDays: number;
  mercadopagoPreapprovalId: string | null;
} = {
  id: "sub-001",
  customerId: "cust-001",
  productSlug: "balanceado-premium-perro-adulto-15kg",
  variantSku: "ALI-PER-15",
  quantity: 1,
  frequency: "MONTHLY",
  pricePerDelivery: 94500,
  status: "ACTIVE",
  nextDeliveryDateOffsetDays: 22,
  mercadopagoPreapprovalId: null,
};

export const demoCoupons: Array<{
  id: string;
  code: string;
  type: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING";
  value: number;
  minimumOrderAmount: number | null;
  maximumUses: number;
  currentUses: number;
  isActive: boolean;
}> = [
  {
    id: "coup-001",
    code: "BIENVENIDA10",
    type: "PERCENTAGE",
    value: 10,
    minimumOrderAmount: 20000,
    maximumUses: 100,
    currentUses: 12,
    isActive: true,
  },
  {
    id: "coup-002",
    code: "ENVIOGRATIS3",
    type: "FREE_SHIPPING",
    value: 6500,
    minimumOrderAmount: 45000,
    maximumUses: 200,
    currentUses: 34,
    isActive: true,
  },
];

export const demoNotifications: Array<{
  id: string;
  type:
    | "ORDER_CONFIRMED"
    | "ORDER_SHIPPED"
    | "ORDER_DELIVERED"
    | "STOCK_ALERT"
    | "PAYMENT"
    | "PROMO"
    | "SYSTEM";
  title: string;
  message: string;
  referenceType: string | null;
  referenceId: string | null;
  isRead: boolean;
}> = [
  {
    id: "notif-001",
    type: "ORDER_CONFIRMED",
    title: "Pedido #1003 confirmado",
    message: "El pedido de María González fue confirmado y está en preparación.",
    referenceType: "order",
    referenceId: "order-1003",
    isRead: false,
  },
  {
    id: "notif-002",
    type: "STOCK_ALERT",
    title: "Stock bajo: Kit Cepillo Dental",
    message:
      "Quedan 4 unidades del producto HIG-CEP-01. Considerá reponer antes de que se agote.",
    referenceType: "product",
    referenceId: "prod-cepillo-dental",
    isRead: false,
  },
  {
    id: "notif-003",
    type: "PROMO",
    title: "Cupón BIENVENIDA10 activo",
    message: "10% de descuento en la primera compra con el cupón BIENVENIDA10.",
    referenceType: "coupon",
    referenceId: "coup-001",
    isRead: true,
  },
];

// ---------------------------------------------------------------------------
// Helper selectors / filters used by the UI fallback
// ---------------------------------------------------------------------------

export function getProductBySlug(slug: string): DemoProduct | undefined {
  return demoProducts.find((p) => p.slug === slug && p.isActive);
}

export function getProductById(id: string): DemoProduct | undefined {
  return demoProducts.find((p) => p.id === id);
}

export function getVariant(product: DemoProduct, variantId: string | null) {
  if (!variantId) return null;
  return product.variants.find((v) => v.id === variantId) ?? null;
}

export function stockFor(
  product: DemoProduct,
  variant: DemoProduct["variants"][number] | null
): number {
  const entry = demoStock.find(
    (s) =>
      s.productSlug === product.slug &&
      s.variantSku === (variant ? variant.sku : null) &&
      s.locationSlug === "loc-centro"
  );
  return entry ? entry.quantityAvailable - entry.quantityReserved : 0;
}

export function categoryIdsIncludingChildren(slug: string): string[] {
  const match = demoCategories.find((c) => c.slug === slug);
  if (!match) return [];
  const children = demoCategories.filter((c) => c.parentSlug === slug);
  return [match.slug, ...children.map((c) => c.slug)];
}

export interface MockFilterParams {
  categoria?: string;
  q?: string;
  destacados?: boolean;
  limite?: number;
}

export function filterMockProducts(params: MockFilterParams): ProductView[] {
  const categorySlugs = params.categoria
    ? categoryIdsIncludingChildren(params.categoria)
    : null;
  const search = params.q?.toLowerCase().trim();

  const filtered = demoProducts.filter((p) => {
    if (!p.isActive) return false;
    if (params.destacados && !p.isFeatured) return false;
    if (categorySlugs && !categorySlugs.includes(p.categorySlug)) return false;
    if (search) {
      const haystack = `${p.name} ${p.description} ${p.tags.join(" ")} ${p.sku}`.toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    return true;
  });

  const limit = params.limite ?? 24;
  return filtered.slice(0, limit).map((p) => toProductView(p, "mock"));
}

export function toProductView(
  p: DemoProduct,
  source: "db" | "mock"
): ProductView {
  const category = demoCategories.find((c) => c.slug === p.categorySlug);
  const variants: VariantView[] = p.variants.map((v) => ({
    id: v.id,
    sku: v.sku,
    name: v.name,
    price: v.price,
    attributes: v.attributes,
    imageUrl: v.imageUrl,
    stockAvailable: stockFor(p, v),
  }));

  // Product-level stock = sum of variant stock; for the mock, use the
  // product-level entry when the product has no variants.
  const baseStock = p.variants.length > 0 ? Math.max(...variants.map((v) => v.stockAvailable)) : stockFor(p, null);

  return {
    id: p.id,
    sku: p.sku,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    categorySlug: p.categorySlug,
    categoryName: category?.name ?? "",
    weightGrams: p.weightGrams,
    isFeatured: p.isFeatured,
    tags: p.tags,
    images: p.images.map((i) => ({
      id: i.id,
      url: i.url,
      altText: i.altText,
      isPrimary: i.isPrimary,
    })),
    variants,
    stockAvailable: baseStock,
    source,
  };
}