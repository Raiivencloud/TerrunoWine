import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingCart, Store, Search, Menu, Star, Plus, Minus, X, Heart, User, Settings, 
  MessageCircle, Globe, Moon, Sun, Palette, Camera, Scan, RotateCw, ChevronRight, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createWorker } from 'tesseract.js';
import { CATALOGO_COMPLETO, CATEGORY_IMAGES } from './constants';

// --- Types ---
interface Product {
  id: string;
  nombre: string;
  precio: number;
  categoria: string;
  bodega?: string;
  puntaje?: number;
  maridaje?: string;
  esPesado?: boolean;
  imagen?: string;
}

interface UserProfile {
  name: string;
  avatar: string;
}

interface AppSettings {
  theme: 'dark' | 'light';
  language: 'es' | 'en';
  wallpaper: string;
}

// --- Constants ---
const AVATARS = [
  { id: 'glass', icon: '🍷', name: 'Copa' },
  { id: 'barrel', icon: '🛢️', name: 'Barril' },
  { id: 'grape', icon: '🍇', name: 'Uva' },
  { id: 'cigar', icon: '🍂', name: 'Habano' },
  { id: 'corkscrew', icon: '🔩', name: 'Sacacorchos' },
];

const WALLPAPERS = [
  { id: 'none', color: 'transparent', name: 'Limpio' },
  { id: 'texture', color: 'bg-[url("https://www.transparenttextures.com/patterns/wood-pattern.png")]', name: 'Madera' },
  { id: 'paper', color: 'bg-[url("https://www.transparenttextures.com/patterns/cream-paper.png")]', name: 'Papel' },
  { id: 'carbon', color: 'bg-[url("https://www.transparenttextures.com/patterns/carbon-fibre.png")]', name: 'Fibra' },
];

const TRANSLATIONS = {
  es: {
    inicio: 'Explorar',
    favoritos: 'Deseos',
    perfil: 'Mi Perfil',
    ajustes: 'Ajustes',
    carrito: 'Carrito',
    buscar: 'Buscar bodega o varietal...',
    scan: 'Escanear Etiqueta',
    heavy: 'Carga Pesada (+ $1.500)',
    total: 'Total Final',
    checkout: 'Finalizar por WhatsApp',
    food: 'Maridaje ideal',
    rating: 'Puntaje Vivino',
    save: 'Guardar Perfil',
    applied: 'Cambios aplicados'
  },
  en: {
    inicio: 'Explore',
    favoritos: 'Wishlist',
    perfil: 'Profile',
    ajustes: 'Settings',
    carrito: 'Cart',
    buscar: 'Search winery or varietal...',
    scan: 'Scan Label',
    heavy: 'Heavy Load (+ $1,500)',
    total: 'Final Total',
    checkout: 'Checkout via WhatsApp',
    food: 'Ideal pairing',
    rating: 'Vivino Score',
    save: 'Save Profile',
    applied: 'Changes applied'
  }
};

// --- Components ---

const ProductCard: React.FC<{ 
  product: Product, 
  isDark: boolean, 
  onAdd: (p: Product) => void,
  onToggleFav: (id: string) => void,
  isFav: boolean,
  t: any
}> = ({ product, isDark, onAdd, onToggleFav, isFav, t }) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`glass-card rounded-[32px] p-5 relative flex flex-col group transition-all duration-300 ${isDark ? 'hover:border-gold/30' : 'hover:border-gold-matte/30'}`}
    >
      <div className="absolute top-4 right-4 z-10">
        <button onClick={() => onToggleFav(product.id)} className="p-2 glass rounded-full active:scale-95 transition-all">
          <Heart className={`w-4 h-4 ${isFav ? 'fill-gold text-gold' : 'text-zinc-500'}`} />
        </button>
      </div>

      <div className="flex gap-4">
        {/* Bottle Image Holder */}
        <div className="w-20 h-40 relative flex items-center justify-center shrink-0">
          <div className={`absolute inset-0 rounded-2xl opacity-10 ${product.categoria === 'Vinos' ? 'bg-[#4A0404]' : 'bg-gold'}`}></div>
          <img 
            src={product.imagen || CATEGORY_IMAGES[product.categoria]} 
            className="w-16 h-44 object-contain bottle-shadow transform -rotate-3 group-hover:rotate-0 transition-transform duration-500" 
            alt={product.nombre} 
          />
        </div>

        <div className="flex-1 flex flex-col pt-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-gold opacity-80">{product.bodega}</span>
          <h3 className={`font-serif text-lg font-black leading-tight mt-1 ${isDark ? 'text-white' : 'text-zinc-900'}`}>{product.nombre}</h3>
          
          <div className="flex items-center gap-1.5 mt-2">
            <Star className="w-3.5 h-3.5 text-gold fill-gold" />
            <span className="text-xs font-bold">{product.puntaje || 4.5}</span>
            <span className="text-[9px] text-zinc-500 uppercase font-bold ml-1">{t.rating}</span>
          </div>

          <div className="mt-4 p-2 rounded-xl bg-white/5 border border-white/5">
             <p className="text-[10px] text-zinc-500 italic leading-tight">{t.food}: {product.maridaje}</p>
          </div>

          <div className="mt-auto pt-4 flex justify-between items-center">
            <div className="flex flex-col">
              <span className={`text-xl font-black ${isDark ? 'text-gold' : 'text-gold-matte'}`}>${product.precio.toLocaleString()}</span>
              {product.esPesado && <span className="text-[8px] text-zinc-500 font-bold uppercase">{t.heavy}</span>}
            </div>
            <button 
              onClick={() => onAdd(product)}
              className="w-10 h-10 bg-gold hover:bg-gold-light text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-all"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'favs' | 'scan' | 'profile' | 'settings'>('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<{ product: Product, quantity: number }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  
  // Persisted state
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('terr_favs');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('terr_profile');
    return saved ? JSON.parse(saved) : { name: 'Gourmet', avatar: 'grape' };
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('terr_settings');
    return saved ? JSON.parse(saved) : { theme: 'dark', language: 'es', wallpaper: 'carbon' };
  });

  // Scanner State
  const [isScanning, setIsScanning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanResult, setScanResult] = useState<Product | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const t = TRANSLATIONS[settings.language];
  const isDark = settings.theme === 'dark';

  useEffect(() => {
    localStorage.setItem('terr_favs', JSON.stringify(favorites));
    localStorage.setItem('terr_profile', JSON.stringify(profile));
    localStorage.setItem('terr_settings', JSON.stringify(settings));
  }, [favorites, profile, settings]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateCartQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === id) return { ...item, quantity: Math.max(1, item.quantity + delta) };
      return item;
    }).filter(item => item.quantity > 0));
  };

  const startScanner = async () => {
    setActiveTab('scan');
    setIsScanning(true);
    setScanResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Camera access error:", err);
      alert("No se pudo acceder a la cámara.");
    }
  };

  const stopScanner = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
    }
    setIsScanning(false);
    setActiveTab('home');
  };

  const processImage = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsProcessing(true);
    const canvas = canvasRef.current;
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
    const imageData = canvas.toDataURL('image/png');
    
    try {
      const worker = await createWorker(settings.language === 'es' ? 'spa' : 'eng');
      const { data: { text } } = await worker.recognize(imageData);
      await worker.terminate();
      
      const cleanText = text.toLowerCase().replace(/[^a-z0-9 ]/g, '');
      const match = CATALOGO_COMPLETO.find(p => {
        const keywords = p.nombre.toLowerCase().split(' ').filter(k => k.length > 3);
        return keywords.some(k => cleanText.includes(k));
      });
      
      if (match) setScanResult(match as Product);
      else alert("No se pudo identificar la etiqueta. Intenta de nuevo.");
    } catch (err) {
      console.error("OCR Error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckout = () => {
    const numbers = ['2615000872', '2614191682'];
    const number = numbers[Math.floor(Date.now() / 1000) % 2];
    const itemsText = cart.map(i => `• ${i.product.nombre} (x${i.quantity})`).join('%0A');
    const subtotal = cart.reduce((a, b) => a + (b.product.precio * b.quantity), 0);
    const heavyFee = cart.some(i => i.product.esPesado) ? 1500 : 0;
    const finalTotal = subtotal + heavyFee + 1500; // Base delivery
    
    const message = `Hola Terruño Wine! Mi nombre es ${profile.name}! Quiero realizar un pedido:%0A%0A${itemsText}%0A%0A*Subtotal:* $${subtotal}%0A*Carga y Envío:* $${heavyFee + 1500}%0A*Total Final:* $${finalTotal}`;
    window.open(`https://wa.me/549${number}?text=${message}`, '_blank');
  };

  const categories = ['Todos', 'Vinos', 'Cervezas', 'Gaseosas', 'Blancas y Aperitivos', 'Tienda'];
  const filteredProducts = CATALOGO_COMPLETO.filter(p => {
    const queryMatch = p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) || p.bodega?.toLowerCase().includes(searchQuery.toLowerCase());
    const categoryMatch = selectedCategory === 'Todos' || p.categoria === selectedCategory;
    return queryMatch && categoryMatch;
  });

  const cartTotal = cart.reduce((a, b) => a + (b.product.precio * b.quantity), 0);
  const cartHeavyFee = cart.some(i => i.product.esPesado) ? 1500 : 0;

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : 'light'} transition-colors duration-500 overflow-hidden flex flex-col font-sans`}>
      {/* Background Layer */}
      <div className={`fixed inset-0 pointer-events-none opacity-20 dark:opacity-10 ${WALLPAPERS.find(w => w.id === settings.wallpaper)?.color}`}></div>

      {/* Header */}
      <header className="fixed top-0 inset-x-0 h-20 flex items-center justify-between px-6 z-40 bg-zinc-950/50 backdrop-blur-md border-b border-white/5">
        <button onClick={() => setActiveTab('settings')} className="p-2 active:scale-95 transition-all">
          <Menu className="w-6 h-6 text-gold" />
        </button>
        <div className="flex flex-col items-center">
          <h1 className="font-serif text-2xl font-black italic text-gold tracking-tight lowercase">terruño</h1>
          <span className="text-[8px] uppercase tracking-[0.4em] font-black opacity-40 -mt-1">mendoza selection</span>
        </div>
        <button onClick={() => setIsCartOpen(true)} className="p-2 relative active:scale-95 transition-all">
          <ShoppingCart className="w-6 h-6 text-gold" />
          {cart.length > 0 && (
            <span className="absolute top-0 right-0 w-4 h-4 bg-gold text-white text-[9px] font-black rounded-full flex items-center justify-center animate-pulse">
              {cart.length}
            </span>
          )}
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 mt-20 pb-32 overflow-y-auto no-scrollbar relative z-10 px-6">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="py-10"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="font-serif text-3xl font-black italic">{profile.name}</h2>
                  <p className="text-[10px] uppercase font-black tracking-widest text-zinc-500">{t.inicio}</p>
                </div>
                <button onClick={() => setActiveTab('profile')} className="w-14 h-14 glass rounded-3xl flex items-center justify-center text-3xl shadow-xl">
                  {AVATARS.find(a => a.id === profile.avatar)?.icon}
                </button>
              </div>

              {/* Search Bar */}
              <div className={`flex items-center px-5 py-4 rounded-[24px] mb-8 border transition-all ${isDark ? 'bg-white/5 border-white/5' : 'bg-zinc-200/50 border-zinc-200'}`}>
                <Search className="w-5 h-5 text-gold mr-3" />
                <input 
                  type="text" 
                  placeholder={t.buscar}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm w-full font-serif italic text-anti-glare"
                />
              </div>

              {/* Categories */}
              <div className="flex gap-3 overflow-x-auto no-scrollbar mb-10 pb-2">
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`whitespace-nowrap px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedCategory === cat ? 'bg-gold text-white shadow-xl shadow-gold/20' : 'bg-white/5 text-zinc-500'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Product Grid */}
              <div className="grid gap-8">
                {filteredProducts.map((p) => (
                  <ProductCard 
                    key={p.id} 
                    product={p as Product} 
                    isDark={isDark} 
                    onAdd={addToCart} 
                    onToggleFav={toggleFavorite}
                    isFav={favorites.includes(p.id)}
                    t={t}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'favs' && (
            <motion.div key="favs" className="py-10">
               <h2 className="font-serif text-3xl font-black italic mb-8">{t.favoritos}</h2>
               <div className="grid gap-8">
                  {CATALOGO_COMPLETO.filter(p => favorites.includes(p.id)).map(p => (
                    <ProductCard 
                      key={p.id} 
                      product={p as Product} 
                      isDark={isDark} 
                      onAdd={addToCart} 
                      onToggleFav={toggleFavorite}
                      isFav={true}
                      t={t}
                    />
                  ))}
                  {favorites.length === 0 && <p className="text-center py-20 italic opacity-40">Aún no tienes deseos guardados...</p>}
               </div>
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div key="profile" className="py-10">
              <h2 className="font-serif text-3xl font-black italic mb-10">{t.perfil}</h2>
              <div className={`p-8 rounded-[40px] text-center ${isDark ? 'bg-white/5' : 'bg-zinc-200/50'}`}>
                <div className="w-24 h-24 glass rounded-[32px] flex items-center justify-center text-5xl shadow-2xl mx-auto mb-6">
                  {AVATARS.find(a => a.id === profile.avatar)?.icon}
                </div>
                <input 
                  type="text" 
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  className="bg-transparent text-center font-serif text-2xl font-black italic outline-none border-b border-gold/30 hover:border-gold transition-all w-full pb-2 mb-8"
                />
                
                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-6">Elige tu Avatar</h4>
                <div className="flex justify-between gap-2">
                  {AVATARS.map(av => (
                    <button 
                      key={av.id}
                      onClick={() => setProfile({...profile, avatar: av.id})}
                      className={`w-12 h-12 glass rounded-2xl flex items-center justify-center text-xl transition-all ${profile.avatar === av.id ? 'scale-110 border-gold border shadow-lg' : 'opacity-40'}`}
                    >
                      {av.icon}
                    </button>
                  ))}
                </div>

                <button className="w-full mt-12 bg-gold text-white py-4 rounded-3xl text-sm font-black uppercase tracking-widest hover:bg-gold-light transition-all shadow-xl shadow-gold/20 flex items-center justify-center gap-3">
                  <Check className="w-5 h-5" /> {t.save}
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div key="settings" className="py-10">
               <h2 className="font-serif text-3xl font-black italic mb-10">{t.ajustes}</h2>
               
               <div className="space-y-8">
                  <section>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4">{t.tema}</h4>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => setSettings({...settings, theme: 'dark'})}
                        className={`flex-1 flex flex-col items-center gap-2 p-5 rounded-3xl glass transition-all ${isDark ? 'border-gold text-gold border shadow-lg' : 'opacity-40'}`}
                      >
                        <Moon className="w-6 h-6" />
                        <span className="text-[10px] font-black">DARK</span>
                      </button>
                      <button 
                        onClick={() => setSettings({...settings, theme: 'light'})}
                        className={`flex-1 flex flex-col items-center gap-2 p-5 rounded-3xl glass transition-all ${!isDark ? 'border-gold text-gold-matte border shadow-lg' : 'opacity-40'}`}
                      >
                        <Sun className="w-6 h-6" />
                        <span className="text-[10px] font-black">SOFT LIGHT</span>
                      </button>
                    </div>
                  </section>

                  <section>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4">{t.idioma}</h4>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => setSettings({...settings, language: 'es'})}
                        className={`flex-1 p-4 rounded-3xl glass text-[11px] font-black flex items-center justify-center gap-2 ${settings.language === 'es' ? 'border-gold text-gold border' : 'opacity-40'}`}
                      >
                        <Globe className="w-4 h-4" /> CASTELLANO
                      </button>
                      <button 
                        onClick={() => setSettings({...settings, language: 'en'})}
                        className={`flex-1 p-4 rounded-3xl glass text-[11px] font-black flex items-center justify-center gap-2 ${settings.language === 'en' ? 'border-gold text-gold border' : 'opacity-40'}`}
                      >
                        <Globe className="w-4 h-4" /> ENGLISH
                      </button>
                    </div>
                  </section>

                  <section>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4">{t.fondo}</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {WALLPAPERS.map(wp => (
                        <button 
                          key={wp.id}
                          onClick={() => setSettings({...settings, wallpaper: wp.id})}
                          className={`h-20 rounded-2xl glass flex items-center justify-center relative overflow-hidden transition-all ${settings.wallpaper === wp.id ? 'border-gold border' : 'opacity-40'}`}
                        >
                           <div className={`absolute inset-0 opacity-20 ${wp.color}`}></div>
                           <span className="relative text-[10px] font-black uppercase">{wp.name}</span>
                        </button>
                      ))}
                    </div>
                  </section>
               </div>
            </motion.div>
          )}

          {activeTab === 'scan' && (
            <motion.div key="scan" className="fixed inset-0 z-[100] bg-black flex flex-col pt-10">
               <div className="relative flex-1">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <canvas ref={canvasRef} className="hidden" />
                  
                  {/* Scanner UI */}
                  <div className="absolute inset-0 border-[40px] border-black/80 pointer-events-none">
                     <div className="w-full h-full border border-gold/30 rounded-[40px] relative">
                         <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-gold rounded-tl-xl" />
                         <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-gold rounded-tr-xl" />
                         <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-gold rounded-bl-xl" />
                         <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-gold rounded-br-xl" />
                         <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gold/50 shadow-[0_0_15px_gold] animate-pulse" />
                     </div>
                  </div>

                  <button onClick={stopScanner} className="absolute top-8 right-8 glass p-3 rounded-full text-white">
                    <X className="w-6 h-6" />
                  </button>
               </div>

               <div className="bg-zinc-950 p-10 space-y-6 pt-6">
                  {scanResult ? (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="glass p-5 rounded-[32px] flex items-center gap-4 border-gold/30 border"
                    >
                       <img src={scanResult.imagen || CATEGORY_IMAGES[scanResult.categoria]} className="w-16 h-28 object-contain" />
                       <div className="flex-1">
                          <h4 className="font-serif text-xl font-black italic text-gold">{scanResult.nombre}</h4>
                          <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{scanResult.bodega}</span>
                          <div className="flex gap-3 mt-4">
                             <button 
                               onClick={() => { addToCart(scanResult); stopScanner(); }}
                               className="bg-white text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase active:scale-95 transition-all"
                             >
                               Lo quiero
                             </button>
                             <button onClick={() => setScanResult(null)} className="p-2 glass rounded-xl text-white">
                               <RotateCw className="w-4 h-4" />
                             </button>
                          </div>
                       </div>
                    </motion.div>
                  ) : (
                    <button 
                      onClick={processImage}
                      disabled={isProcessing}
                      className="w-full h-20 bg-gold text-white rounded-[32px] flex items-center justify-center font-serif text-xl italic font-black shadow-2xl active:scale-95 transition-all"
                    >
                      {isProcessing ? <RotateCw className="w-7 h-7 animate-spin" /> : <Scan className="w-8 h-8 mr-3" />}
                      {isProcessing ? 'IDENTIFICANDO...' : t.scan}
                    </button>
                  )}
                  <p className="text-center text-[9px] font-black uppercase text-white/30 tracking-[0.4em]">Enfoca el centro de la etiqueta</p>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Cart Modal */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] glass-dark flex items-end"
            onClick={() => setIsCartOpen(false)}
          >
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`w-full max-h-[85%] rounded-t-[50px] p-8 pb-12 flex flex-col shadow-2xl overflow-hidden ${isDark ? 'bg-zinc-950/90' : 'bg-white'}`}
              onClick={e => e.stopPropagation()}
            >
               <div className="flex justify-between items-center mb-8">
                  <h3 className="font-serif text-3xl font-black italic">{t.carrito}</h3>
                  <button onClick={() => setIsCartOpen(false)} className="p-2 glass rounded-full opacity-40"><X className="w-6 h-6" /></button>
               </div>

               <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar">
                  {cart.map(item => (
                    <div key={item.product.id} className="flex items-center gap-4 p-4 rounded-3xl glass-card">
                       <img src={item.product.imagen || CATEGORY_IMAGES[item.product.categoria]} className="w-12 h-20 object-contain" />
                       <div className="flex-1">
                          <h4 className="text-sm font-bold leading-tight">{item.product.nombre}</h4>
                          <p className="text-[10px] text-zinc-500 font-bold mt-1">${item.product.precio.toLocaleString()}</p>
                       </div>
                       <div className="flex items-center glass rounded-2xl p-1.5 gap-4">
                          <button onClick={() => updateCartQty(item.product.id, -1)} className="p-1"><Minus className="w-3.5 h-3.5" /></button>
                          <span className="text-sm font-black text-gold">{item.quantity}</span>
                          <button onClick={() => updateCartQty(item.product.id, 1)} className="p-1"><Plus className="w-3.5 h-3.5" /></button>
                       </div>
                    </div>
                  ))}
                  {cart.length === 0 && (
                    <div className="py-20 text-center opacity-20 italic">Tu copa está vacía...</div>
                  )}
               </div>

               {cart.length > 0 && (
                 <div className="mt-8 pt-8 border-t border-white/5 space-y-6">
                    <div className="flex justify-between items-end">
                       <div>
                          <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-1">{t.total}</span>
                          <span className="text-3xl font-black text-gold tracking-tighter">${(cartTotal + cartHeavyFee + 1500).toLocaleString()}</span>
                       </div>
                       <span className="text-[10px] font-bold text-zinc-500">+ ENVÍO BONIFICADO</span>
                    </div>
                    <button 
                      onClick={handleCheckout}
                      className="w-full py-6 bg-gold text-white rounded-[32px] font-serif text-xl italic font-black shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all"
                    >
                      {t.checkout} <ChevronRight className="w-6 h-6" />
                    </button>
                 </div>
               )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent Bottom Nav */}
      <footer className="fixed bottom-8 inset-x-8 h-20 glass-nav rounded-full flex justify-around items-center px-4 z-[50] shadow-2xl border-white/10 border">
        <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'home' ? 'text-gold scale-110' : 'text-white/20'}`}>
          <Store className="w-5 h-5" />
          <span className="text-[7px] font-black uppercase tracking-[0.2em]">{t.inicio}</span>
        </button>
        
        <button onClick={() => setActiveTab('favs')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'favs' ? 'text-gold scale-110' : 'text-white/20'}`}>
          <Heart className={`w-5 h-5 ${activeTab === 'favs' ? 'fill-gold' : ''}`} />
          <span className="text-[7px] font-black uppercase tracking-[0.2em]">{t.favoritos}</span>
        </button>

        <button 
          onClick={startScanner}
          className="w-20 h-20 bg-white rounded-full -mt-20 flex items-center justify-center shadow-2xl border-4 border-zinc-950/20 group active:scale-90 transition-all z-50"
        >
          <div className="w-14 h-14 bg-zinc-950 rounded-full flex items-center justify-center group-hover:scale-95 transition-all shadow-inner">
            <Scan className="w-6 h-6 text-gold" />
          </div>
        </button>

        <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'profile' ? 'text-gold scale-110' : 'text-white/20'}`}>
          <User className="w-5 h-5" />
          <span className="text-[7px] font-black uppercase tracking-[0.2em]">{t.perfil}</span>
        </button>

        <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'settings' ? 'text-gold scale-110' : 'text-white/20'}`}>
          <Settings className="w-5 h-5" />
          <span className="text-[7px] font-black uppercase tracking-[0.2em]">{t.ajustes}</span>
        </button>
      </footer>
    </div>
  );
}
