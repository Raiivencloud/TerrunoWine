export const CATEGORY_IMAGES: Record<string, string> = {
  'Vinos': 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=400&q=80',
  'Cervezas': 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=400&q=80',
  'Gaseosas': 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80',
  'Blancas y Aperitivos': 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=400&q=80',
  'Tienda': 'https://images.unsplash.com/photo-1520114056694-98d72e3fb3bb?auto=format&fit=crop&w=400&q=80'
};

export const CATALOGO_COMPLETO = [
  // VINOS
  { id: 'v1', nombre: 'Zuccardi Serie A Malbec', precio: 19500, categoria: 'Vinos', bodega: 'Zuccardi', puntaje: 4.8, maridaje: 'Carnes rojas asadas', esPesado: false },
  { id: 'v2', nombre: 'Nieto Senetiner Malbec', precio: 10400, categoria: 'Vinos', bodega: 'Nieto Senetiner', puntaje: 4.3, maridaje: 'Asado tradicional', esPesado: false },
  { id: 'v3', nombre: 'Las Perdices Reserva Malbec', precio: 13200, categoria: 'Vinos', bodega: 'Las Perdices', puntaje: 4.5, maridaje: 'Cordero y guisos', esPesado: false },
  { id: 'v4', nombre: 'Atamisque Malbec', precio: 30500, categoria: 'Vinos', bodega: 'Atamisque', puntaje: 4.9, maridaje: 'Ojo de bife premium', esPesado: false },
  { id: 'v5', nombre: 'Trapiche Medalla Malbec', precio: 16800, categoria: 'Vinos', bodega: 'Trapiche', puntaje: 4.6, maridaje: 'Pastas con salsas rojas', esPesado: false },
  { id: 'v6', nombre: 'Rutini Cabernet/Malbec', precio: 24500, categoria: 'Vinos', bodega: 'Rutini', puntaje: 4.7, maridaje: 'Carnes de caza', esPesado: false },
  { id: 'v7', nombre: 'Catena Zapata Angelica Malbec', precio: 48900, categoria: 'Vinos', bodega: 'Catena Zapata', puntaje: 5.0, maridaje: 'Bife de chorizo premium', esPesado: false },
  { id: 'v8', nombre: 'Trumpeter Malbec', precio: 12100, categoria: 'Vinos', bodega: 'La Rural', puntaje: 4.2, maridaje: 'Tablas de quesos', esPesado: false },
  { id: 'v9', nombre: 'DV Catena Cabernet/Malbec', precio: 18500, categoria: 'Vinos', bodega: 'Catena Zapata', puntaje: 4.8, maridaje: 'Carnes a la parrilla', esPesado: false },
  { id: 'v10', nombre: 'Luigi Bosca Malbec', precio: 19200, categoria: 'Vinos', bodega: 'Luigi Bosca', puntaje: 4.6, maridaje: 'Pastas rellenas', esPesado: false },
  { id: 'v11', nombre: 'El Enemigo Malbec', precio: 24000, categoria: 'Vinos', bodega: 'Aleanna', puntaje: 4.9, maridaje: 'Platos estructurados', esPesado: false },
  { id: 'v12', nombre: 'Chandon Extra Brut', precio: 16500, categoria: 'Vinos', bodega: 'Moët @ Chandon', puntaje: 4.7, maridaje: 'Sushi y mariscos', esPesado: false },

  // CERVEZAS
  { id: 'c1', nombre: 'Corona 330ml', precio: 2200, categoria: 'Cervezas', bodega: 'AB InBev', puntaje: 4.2, maridaje: 'Limón y playa', esPesado: false },
  { id: 'c2', nombre: 'Stella Artois 1L', precio: 3800, categoria: 'Cervezas', bodega: 'Stella Artois', puntaje: 4.4, maridaje: 'Pescados blancos', esPesado: false },
  { id: 'c3', nombre: 'Heineken 1L', precio: 4200, categoria: 'Cervezas', bodega: 'Heineken', puntaje: 4.5, maridaje: 'Hamburguesas', esPesado: false },
  { id: 'c4', nombre: 'Andes Origen Rubia 1L', precio: 3500, categoria: 'Cervezas', bodega: 'Quilmes', puntaje: 4.3, maridaje: 'Milanesas', esPesado: false },
  { id: 'c5', nombre: 'Imperial IPA 1L', precio: 3600, categoria: 'Cervezas', bodega: 'Imperial', puntaje: 4.6, maridaje: 'Picantes', esPesado: false },

  // GASEOSAS
  { id: 'g1', nombre: 'Coca-Cola 2.25L Original', precio: 4100, categoria: 'Gaseosas', bodega: 'Coca-Cola', puntaje: 4.9, maridaje: 'Universal', esPesado: false },
  { id: 'g2', nombre: 'Coca-Cola Zero 1.5L', precio: 3200, categoria: 'Gaseosas', bodega: 'Coca-Cola', puntaje: 4.7, maridaje: 'Universal', esPesado: false },
  { id: 'g3', nombre: 'Sprite 2.25L', precio: 3900, categoria: 'Gaseosas', bodega: 'The Coca-Cola Co.', puntaje: 4.5, maridaje: 'Almuerzos', esPesado: false },
  { id: 'g4', nombre: 'Schweppes Tonica 1.5L', precio: 3100, categoria: 'Gaseosas', bodega: 'Schweppes', puntaje: 4.8, maridaje: 'Gin Tonics', esPesado: false },

  // BLANCAS Y APERITIVOS
  { id: 'a1', nombre: 'Fernet Branca 750ml', precio: 17500, categoria: 'Blancas y Aperitivos', bodega: 'Branca', puntaje: 5.0, maridaje: 'Coca-Cola y hielo', esPesado: false },
  { id: 'a2', nombre: 'Aperol 750ml', precio: 12400, categoria: 'Blancas y Aperitivos', bodega: 'Campari Group', puntaje: 4.9, maridaje: 'Espumante y soda', esPesado: false },
  { id: 'a3', nombre: 'Gin Bombay Sapphire', precio: 22800, categoria: 'Blancas y Aperitivos', bodega: 'Bacardi', puntaje: 4.8, maridaje: 'Premium Tonic', esPesado: false },
  { id: 'a4', nombre: 'Vodka Smirnoff 700ml', precio: 9800, categoria: 'Blancas y Aperitivos', bodega: 'Diageo', puntaje: 4.4, maridaje: 'Jugos de fruta', esPesado: false },

  // TIENDA (PESADOS)
  { id: 'p1', nombre: 'Bolsa Hielo Cubitos 4kg', precio: 2800, categoria: 'Tienda', bodega: 'Terruño', puntaje: 5.0, maridaje: 'Cualquier trago', esPesado: true },
  { id: 'p2', nombre: 'Leña de Caldén 10kg', precio: 5500, categoria: 'Tienda', bodega: 'Terruño', puntaje: 4.8, maridaje: 'Asados largos', esPesado: true },
  { id: 'p3', nombre: 'Carbón Vegetal 4kg', precio: 3200, categoria: 'Tienda', bodega: 'Terruño', puntaje: 4.7, maridaje: 'Parrilla rápida', esPesado: true },
  { id: 'p4', nombre: 'Leña Quebracho Blanco 10kg', precio: 6200, categoria: 'Tienda', bodega: 'Terruño', puntaje: 4.9, maridaje: 'Brasas duraderas', esPesado: true },
];
