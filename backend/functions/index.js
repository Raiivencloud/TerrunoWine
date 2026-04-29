const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { MercadoPagoConfig, Preference } = require("mercadopago");

admin.initializeApp();
const db = admin.firestore();

// Configurar SDK de Mercado Pago
const client = new MercadoPagoConfig({ accessToken: 'YOUR_ACCESS_TOKEN_HERE' });
const preference = new Preference(client);

/**
 * Tarea 2: Lógica de Cloud Functions para calcularTotalPedido
 * Recibe el carrito y el metodo de entrega, calcula recargos,
 * y devuelve el total.
 */
exports.calcularTotalPedido = functions.https.onCall(async (data, context) => {
  const { items, metodoEntrega } = data; // items = [{ productoId, cantidad }]
  
  if (!items || items.length === 0) {
    throw new functions.https.HttpsError("invalid-argument", "El carrito está vacío");
  }

  let subtotal = 0;
  let tieneProductoPesado = false;
  let detallesItems = [];

  // Obtenemos los datos de la DB para calcular con precios reales (evita manipulacion en cliente)
  for (const item of items) {
    const doc = await db.collection("productos").doc(item.productoId).get();
    if (!doc.exists) continue;
    
    const prod = doc.data();
    subtotal += prod.precio * item.cantidad;
    
    detallesItems.push({
      id: doc.id,
      title: prod.nombre,
      unit_price: prod.precio,
      quantity: item.cantidad,
      currency_id: "ARS"
    });

    // Verificamos propiedad de carga pesada
    if (prod.atributosLogistica && prod.atributosLogistica.pesoKg > 5) {
      tieneProductoPesado = true;
    }
  }

  let costoEnvio = 0;
  if (metodoEntrega === "envio") {
    costoEnvio = 500; // Base de envío
    if (tieneProductoPesado) {
      costoEnvio += 300; // Recargo logístico por volumen/peso
    }
  }

  const total = subtotal + costoEnvio;

  return {
    subtotal,
    costoEnvio,
    total,
    tieneProductoPesado,
    detallesItems
  };
});

/**
 * Tarea 3: Integración de Pagos (Mercado Pago SDK)
 * Crea la preferencia y devuelve el ID para Checkout Pro.
 */
exports.crearPreferenciaPago = functions.https.onCall(async (data, context) => {
  const { pedidoId, items, costoEnvio } = data; // Asume que el pedio ya fue creado en DB como 'pendiente'

  let mpItems = items.map(item => ({
    id: item.id,
    title: item.title,
    quantity: item.quantity,
    unit_price: item.unit_price,
    currency_id: 'ARS'
  }));

  // Agregamos el costo de envío como un item extra en la factura de Mercadopago
  if (costoEnvio > 0) {
    mpItems.push({
      id: "envio",
      title: "Costo de Envío",
      quantity: 1,
      unit_price: costoEnvio,
      currency_id: 'ARS'
    });
  }

  try {
    const prefResult = await preference.create({
      body: {
        items: mpItems,
        external_reference: pedidoId, // Referencia para cruzar datos en el webhook
        back_urls: {
          success: "terrunowine://payment/success", // Deep link Flutter
          pending: "terrunowine://payment/pending",
          failure: "terrunowine://payment/failure"
        },
        auto_return: "approved"
      }
    });

    // Actualizamos el pedido en Firestore con el ID de preferencia
    await db.collection("pedidos").doc(pedidoId).update({
      referenciaPagoExterior: prefResult.id
    });

    return {
      preferenceId: prefResult.id,
      initPoint: prefResult.init_point
    };
  } catch (error) {
    console.error("Error creando preferencia MP:", error);
    throw new functions.https.HttpsError("internal", "No se pudo generar el link de pago");
  }
});
