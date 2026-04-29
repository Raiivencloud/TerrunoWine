// script de carga inicial de productos
const admin = require('firebase-admin');

// INSTRUCCIONES DE USO:
// 1. Instalar dependencias: npm install firebase-admin
// 2. Descargar serviceAccountKey.json desde Firebase Console -> Setttings -> Service Accounts
// 3. Modificar la ruta aquí y correr: node seedDatabase.js

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const productosIniciales = [
  // 5 Vinos
  {
    id: "vino_rutini_1",
    nombre: "Rutini Malbec",
    precio: 21100,
    stock: 50,
    categoria: "vino",
    imagenUrl: "https://ejemplo.com/rutini.jpg",
    atributosVino: { bodega: "Rutini", uva: "Malbec", cosecha: 2021, notasCata: { cuerpo: "Medio", taninos: "Suaves" }, maridaje: ["Carnes Rojas", "Quesos Duros"] }
  },
  {
    id: "vino_catena_1",
    nombre: "Catena Zapata Malbec Argentino",
    precio: 45000,
    stock: 20,
    categoria: "vino",
    imagenUrl: "https://ejemplo.com/catena.jpg",
    atributosVino: { bodega: "Catena Zapata", uva: "Malbec", cosecha: 2019, notasCata: { cuerpo: "Lleno", taninos: "Firmes" }, maridaje: ["Asado", "Cordero"] }
  },
  {
    id: "vino_luigibosca_1",
    nombre: "Luigi Bosca De Sangre Cabernet Sauvignon",
    precio: 28500,
    stock: 35,
    categoria: "vino",
    imagenUrl: "https://ejemplo.com/luigi.jpg",
    atributosVino: { bodega: "Luigi Bosca", uva: "Cabernet Sauvignon", cosecha: 2020, notasCata: { cuerpo: "Completo", taninos: "Estructurados" }, maridaje: ["Pastas", "Cerdo"] }
  },
  {
    id: "vino_el_enemigo_1",
    nombre: "El Enemigo Chardonnay",
    precio: 18900,
    stock: 40,
    categoria: "vino",
    imagenUrl: "https://ejemplo.com/enemigo.jpg",
    atributosVino: { bodega: "Aleanna", uva: "Chardonnay", cosecha: 2022, notasCata: { cuerpo: "Medio", acidez: "Fresca" }, maridaje: ["Pescados", "Aves"] }
  },
  {
    id: "vino_trumpet_1",
    nombre: "Trumpeter Reserve Pinot Noir",
    precio: 14500,
    stock: 60,
    categoria: "vino",
    imagenUrl: "https://ejemplo.com/trumpeter.jpg",
    atributosVino: { bodega: "Rutini", uva: "Pinot Noir", cosecha: 2022, notasCata: { cuerpo: "Ligero", taninos: "Sedosos" }, maridaje: ["Sushi", "Risotto"] }
  },

  // 2 Tipos de Leña
  {
    id: "lena_quebracho_1",
    nombre: "Bolsa Leña de Quebracho 10kg",
    precio: 6000,
    stock: 100,
    categoria: "pesado",
    imagenUrl: "https://ejemplo.com/lena.jpg",
    atributosLogistica: { pesoKg: 10, requiereFleteEspecial: true }
  },
  {
    id: "lena_espinillo_1",
    nombre: "Bolsa Leña Espinillo/Mezcla 15kg",
    precio: 8500,
    stock: 80,
    categoria: "pesado",
    imagenUrl: "https://ejemplo.com/lena2.jpg",
    atributosLogistica: { pesoKg: 15, requiereFleteEspecial: true }
  },

  // Hielo
  {
    id: "hielo_rollo_1",
    nombre: "Bolsa de Hielo Rolito 4kg",
    precio: 3000,
    stock: 200,
    categoria: "pesado",
    imagenUrl: "https://ejemplo.com/hielo.jpg",
    atributosLogistica: { pesoKg: 4, requiereFleteEspecial: false } // Menor a 5kg
  },

  // 2 Habanos
  {
    id: "habano_cohiba_1",
    nombre: "Habano Cohiba Siglo II",
    precio: 35000,
    stock: 15,
    categoria: "tabaco",
    imagenUrl: "https://ejemplo.com/cohiba.jpg",
    atributosTabaco: { origen: "Cuba", tipo: "Habano" }
  },
  {
    id: "habano_montecristo_1",
    nombre: "Montecristo No. 4",
    precio: 28000,
    stock: 20,
    categoria: "tabaco",
    imagenUrl: "https://ejemplo.com/montecristo.jpg",
    atributosTabaco: { origen: "Cuba", tipo: "Habano" }
  }
];

async function seed() {
  console.log("🔄 Iniciando carga en la colección 'productos'...");
  const batch = db.batch();

  productosIniciales.forEach((prod) => {
    const docRef = db.collection('productos').doc(prod.id);
    batch.set(docRef, prod);
  });

  try {
    await batch.commit();
    console.log("✅ 10 productos cargados exitosamente!");
  } catch (error) {
    console.error("❌ Error cargando base de datos: ", error);
  }
}

seed();
