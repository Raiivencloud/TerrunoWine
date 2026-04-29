# Arquitectura Terruño Wine - Backend & Firebase

## Tarea 1: Estructura de la Base de Datos (Firestore NoSQL)

Para manejar un inventario híbrido de forma eficiente y no SQL, estructuraremos la colección `productos` utilizando campos comunes en la raíz del documento y objetos (Maps) para las propiedades específicas de cada vertical.

### Colección `productos`

```json
{
  // Campos Comunes
  "id": "prod_12345",
  "nombre": "Rutini Malbec",
  "precio": 21100,
  "stock": 45,
  "categoria": "vino", // "vino" | "pesado" | "tabaco" | "cerveza" | "combo"
  "imagenUrl": "https://...",
  "activo": true,

  // Campos Específicos (Opcionales, dependen de la 'categoria')
  
  // Si categoria == "vino"
  "atributosVino": {
    "bodega": "Rutini Wines",
    "uva": "Malbec",
    "cosecha": 2021,
    "notasCata": {
      "cuerpo": "Medio",
      "taninos": "Suaves",
      "acidez": "Media"
    },
    "maridaje": ["Carnes Rojas", "Quesos Duros"]
  },

  // Si categoria == "pesado" (Hielo/Leña)
  "atributosLogistica": {
    "pesoKg": 7.5,
    "requiereFleteEspecial": true
  },

  // Si categoria == "tabaco"
  "atributosTabaco": {
    "origen": "Cuba",
    "tipo": "Habano"
  },

  // Si categoria == "combo"
  "itemsCombo": [
    { "productoId": "prod_vino_1", "cantidad": 2 },
    { "productoId": "prod_lena_1", "cantidad": 1 },
    { "productoId": "prod_hielo_1", "cantidad": 1 }
  ]
}
```

### Colección `pedidos`

```json
{
  "id": "order_001",
  "clienteId": "user_789",
  "items": [
    {
      "productoId": "prod_12345",
      "nombre": "Rutini Malbec",
      "cantidad": 2,
      "precioUnitario": 21100
    },
    {
      "productoId": "prod_lena_1",
      "nombre": "Bolsa de Leña 10kg",
      "cantidad": 1,
      "precioUnitario": 6000
    }
  ],
  "subtotal": 48200,
  "costoEnvio": 800, // Calculado (500 base + 300 recargo)
  "total": 49000,
  "estado": "pendiente", // "pendiente" | "pagado" | "en_preparacion" | "en_camino" | "entregado"
  "metodoEntrega": "envio", // "retiro" | "envio"
  "metodoPago": "mercado_pago", // "mercado_pago" | "efectivo_local"
  "fechaCreacion": "Timestamp",
  "referenciaPagoExterior": "pref_abc123" // ID Preference Mercado Pago
}
```

---

## Tarea 4: Gestión de Stock Híbrido (Transacciones)

Para manejar "Combos", no mantenemos un stock del combo en sí, sino que procesamos dinámicamente el stock de los productos. 
Cuando un usuario compra un "Combo Asado", el backend itera sobre los `itemsCombo` y resta el stock de los productos individuales.

**Regla de Oro en Firestore:** Si varias escrituras/lecturas deben ser atómicas y consistentes (ej. restar stock de 3 productos a la vez), **DEBEMOS** usar una `Transaction`. Si el stock de la leña no alcanza, la transacción falla por completo y no se resta el stock del vino.

### Código de Transacción Firestore (Node.js)

```javascript
const admin = require('firebase-admin');
const db = admin.firestore();

async function descontarStockCombo(itemsCarrito) {
  try {
    await db.runTransaction(async (t) => {
      let productosAActualizar = [];

      for (const item of itemsCarrito) {
        const prodRef = db.collection('productos').doc(item.productoId);
        const prodDoc = await t.get(prodRef);

        if (!prodDoc.exists) throw new Error(`Producto ${item.productoId} no existe`);
        const prodData = prodDoc.data();

        // 1. Si es producto simple
        if (prodData.categoria !== 'combo') {
          if (prodData.stock < item.cantidad) throw new Error(`Sin stock para ${prodData.nombre}`);
          productosAActualizar.push({
            ref: prodRef,
            nuevoStock: prodData.stock - item.cantidad
          });
        } 
        
        // 2. Si es combo, desglosamos sus items
        if (prodData.categoria === 'combo') {
          for (const subItem of prodData.itemsCombo) {
            const subProdRef = db.collection('productos').doc(subItem.productoId);
            const subProdDoc = await t.get(subProdRef);
            if (!subProdDoc.exists) throw new Error(`Ítem de combo faltante`);
            const subProdData = subProdDoc.data();
            
            const cantidadRequerida = subItem.cantidad * item.cantidad;
            if (subProdData.stock < cantidadRequerida) throw new Error(`Sin stock para ${subProdData.nombre} (Combo)`);
            
            productosAActualizar.push({
              ref: subProdRef,
              nuevoStock: subProdData.stock - cantidadRequerida
            });
          }
        }
      }

      // Aplicar todas las mutaciones juntas al final de la lectura
      productosAActualizar.forEach((modificacion) => {
        t.update(modificacion.ref, { stock: modificacion.nuevoStock });
      });
    });
    console.log("Stock descontado exitosamente.");
  } catch (error) {
    console.error("Transacción fallida:", error);
    throw error;
  }
}
```
