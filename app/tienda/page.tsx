'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ShoppingCart, Plus, Minus, Trash2, X } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  stock: boolean;
}

interface CartItem extends Product {
  quantity: number;
}

// Productos dummy
const products: Product[] = [
  {
    id: 1,
    name: "Guantes de Boxeo Real Fighters",
    category: "Equipo",
    price: 1200,
    image: "/tienda/guantes-box.jpg",
    description: "Guantes profesionales de alta calidad, ideal para entrenamientos intensos",
    stock: true
  },
  {
    id: 2,
    name: "Playera Real Fighters",
    category: "Ropa",
    price: 350,
    image: "/tienda/playera.jpg",
    description: "Playera oficial de algodón premium con logo bordado",
    stock: true
  },
  {
    id: 3,
    name: "Short de Muay Thai",
    category: "Ropa",
    price: 450,
    image: "/tienda/short-muay.jpg",
    description: "Short tradicional de Muay Thai con diseño exclusivo",
    stock: true
  },
  {
    id: 4,
    name: "Vendas para Manos",
    category: "Equipo",
    price: 150,
    image: "/tienda/vendas.jpg",
    description: "Vendas elásticas de 4 metros, protección profesional",
    stock: true
  },
  {
    id: 5,
    name: "Protector Bucal",
    category: "Protección",
    price: 200,
    image: "/tienda/bucal.jpg",
    description: "Protector bucal moldeable, máxima protección",
    stock: true
  },
  {
    id: 6,
    name: "Concha Protectora",
    category: "Protección",
    price: 300,
    image: "/tienda/concha.jpg",
    description: "Concha anatómica profesional para hombres",
    stock: true
  },
  {
    id: 7,
    name: "Espinilleras",
    category: "Protección",
    price: 800,
    image: "/tienda/espinilleras.jpg",
    description: "Espinilleras acolchadas para Muay Thai y Kickboxing",
    stock: true
  },
  {
    id: 8,
    name: "Gi de BJJ Real Fighters",
    category: "Uniformes",
    price: 1800,
    image: "/tienda/gi-bjj.jpg",
    description: "Kimono profesional de Brazilian Jiu-Jitsu, talla ajustable",
    stock: true
  },
  {
    id: 9,
    name: "Sudadera Real Fighters",
    category: "Ropa",
    price: 650,
    image: "/tienda/sudadera.jpg",
    description: "Sudadera con capucha, diseño exclusivo Real Fighters",
    stock: true
  },
  {
    id: 10,
    name: "Bolsa Deportiva",
    category: "Accesorios",
    price: 550,
    image: "/tienda/bolsa.jpg",
    description: "Bolsa espaciosa con compartimentos, ideal para tu equipo",
    stock: true
  }
];

export default function TiendaPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  const categories = ['Todos', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = selectedCategory === 'Todos' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: number, change: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const sendToWhatsApp = () => {
    if (cart.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    const whatsappNumber = '525588419852';
    let message = '¡Hola! Me gustaría ordenar lo siguiente:%0A%0A';

    cart.forEach(item => {
      message += `• ${item.name}%0A`;
      message += `  Cantidad: ${item.quantity}%0A`;
      message += `  Precio unitario: $${item.price}%0A`;
      message += `  Subtotal: $${item.price * item.quantity}%0A%0A`;
    });

    message += `*Total: $${getTotalPrice()} MXN*%0A%0A`;
    message += 'Por favor, confirma disponibilidad y método de pago. ¡Gracias!';

    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4 text-center">Tienda Real Fighters</h1>
          <p className="text-xl text-gray-300 text-center max-w-2xl mx-auto">
            Equípate con lo mejor para tu entrenamiento
          </p>
        </div>
      </section>

      {/* Carrito Flotante */}
      <div className="fixed top-24 right-4 z-40">
        <button
          onClick={() => setShowCart(!showCart)}
          className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg transition relative"
        >
          <ShoppingCart className="w-6 h-6" />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          )}
        </button>
      </div>

      {/* Panel del Carrito */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-2xl">
            <div className="p-6 border-b sticky top-0 bg-white z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Mi Carrito</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {cart.length === 0 ? (
              <div className="p-8 text-center">
                <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600">Tu carrito está vacío</p>
              </div>
            ) : (
              <>
                <div className="p-6 space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex gap-4 border-b pb-4">
                      <div className="w-20 h-20 bg-gray-200 rounded flex-shrink-0 relative">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-red-600 font-bold mb-2">${item.price}</p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="bg-gray-200 hover:bg-gray-300 p-1 rounded"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-semibold px-3">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="bg-gray-200 hover:bg-gray-300 p-1 rounded"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="ml-auto text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-6 border-t bg-gray-50 sticky bottom-0">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-bold">Total:</span>
                    <span className="text-2xl font-bold text-red-600">
                      ${getTotalPrice()} MXN
                    </span>
                  </div>
                  <button
                    onClick={sendToWhatsApp}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Comprar por WhatsApp
                  </button>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Te redirigiremos a WhatsApp para completar tu pedido
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Filtros por Categoría */}
      <section className="py-8 bg-white border-b sticky top-20 z-30">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition ${
                  selectedCategory === category
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Productos */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group"
              >
                <div className="h-64 bg-gray-200 relative overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-300"
                  />
                  {!product.stock && (
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                      <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold">
                        AGOTADO
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {product.category}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 mt-2 mb-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-red-600">
                      ${product.price}
                    </span>
                    <button
                      onClick={() => addToCart(product)}
                      disabled={!product.stock}
                      className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${
                        product.stock
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info de Pagos */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Métodos de Pago
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-4xl mb-3">💵</div>
                <h4 className="font-bold text-gray-900 mb-2">Efectivo</h4>
                <p className="text-sm text-gray-600">Pago en sucursal</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-4xl mb-3">💳</div>
                <h4 className="font-bold text-gray-900 mb-2">Transferencia</h4>
                <p className="text-sm text-gray-600">Depósito bancario</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-4xl mb-3">📱</div>
                <h4 className="font-bold text-gray-900 mb-2">WhatsApp</h4>
                <p className="text-sm text-gray-600">Coordina tu pago</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}