'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ShoppingCart, Plus, Minus, Trash2, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image_url: string;
  description: string;
  stock: boolean;
}

interface CartItem extends Product {
  quantity: number;
}

export default function TiendaPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  useEffect(() => {
    async function loadProducts() {
      const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
      setProducts(data || [])
      setLoading(false)
    }
    loadProducts()
  }, [])

  const categories = ['Todos', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))]
  const filteredProducts = selectedCategory === 'Todos' ? products : products.filter(p => p.category === selectedCategory)

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.id === product.id)
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  const updateQuantity = (id: number, change: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + change
        return newQty > 0 ? { ...item, quantity: newQty } : item
      }
      return item
    }).filter(item => item.quantity > 0))
  }

  const removeFromCart = (id: number) => setCart(cart.filter(item => item.id !== id))
  const getTotal = () => cart.reduce((total, item) => total + (item.price * item.quantity), 0)

  const sendToWhatsApp = () => {
    if (cart.length === 0) { alert('El carrito está vacío'); return }
    let message = '¡Hola! Me gustaría ordenar lo siguiente:%0A%0A'
    cart.forEach(item => {
      message += `• ${item.name}%0A  Cantidad: ${item.quantity}%0A  Subtotal: $${item.price * item.quantity}%0A%0A`
    })
    message += `*Total: $${getTotal()} MXN*%0A%0A¡Gracias!`
    window.open(`https://wa.me/525535147658?text=${message}`, '_blank')
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-600">Cargando tienda...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Tienda Real Fighters</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">Equípate con lo mejor para tu entrenamiento</p>
        </div>
      </section>

      {/* Carrito flotante */}
      <div className="fixed top-24 right-4 z-40">
        <button onClick={() => setShowCart(!showCart)} className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg transition relative">
          <ShoppingCart className="w-6 h-6" />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          )}
        </button>
      </div>

      {/* Panel carrito */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-2xl">
            <div className="p-6 border-b sticky top-0 bg-white z-10 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Mi Carrito</h2>
              <button onClick={() => setShowCart(false)}><X className="w-6 h-6 text-gray-600" /></button>
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
                        {item.image_url && <Image src={item.image_url} alt={item.name} fill className="object-cover rounded" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-red-600 font-bold mb-2">${item.price}</p>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQuantity(item.id, -1)} className="bg-gray-200 hover:bg-gray-300 p-1 rounded"><Minus className="w-4 h-4" /></button>
                          <span className="font-semibold px-3">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="bg-gray-200 hover:bg-gray-300 p-1 rounded"><Plus className="w-4 h-4" /></button>
                          <button onClick={() => removeFromCart(item.id)} className="ml-auto text-red-600 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-6 border-t bg-gray-50 sticky bottom-0">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-bold">Total:</span>
                    <span className="text-2xl font-bold text-red-600">${getTotal()} MXN</span>
                  </div>
                  <button onClick={sendToWhatsApp} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition">
                    Comprar por WhatsApp
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Filtros */}
      {products.length > 0 && (
        <section className="py-6 bg-white border-b sticky top-20 z-30">
          <div className="container mx-auto px-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map(category => (
                <button key={category} onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition ${selectedCategory === category ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Productos */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {products.length === 0 ? (
            <div className="text-center py-24">
              <ShoppingCart className="w-20 h-20 mx-auto text-gray-300 mb-6" />
              <h2 className="text-2xl font-bold text-gray-700 mb-2">Próximamente</h2>
              <p className="text-gray-500">Estamos preparando nuestro catálogo. ¡Vuelve pronto!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group">
                  <div className="h-64 bg-gray-200 relative overflow-hidden">
                    {product.image_url ? (
                      <Image src={product.image_url} alt={product.name} fill className="object-cover group-hover:scale-105 transition duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">Sin imagen</div>
                    )}
                    {!product.stock && (
                      <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                        <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold">AGOTADO</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    {product.category && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{product.category}</span>}
                    <h3 className="text-lg font-bold text-gray-900 mt-2 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-red-600">${product.price}</span>
                      <button onClick={() => addToCart(product)} disabled={!product.stock}
                        className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${product.stock ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
                        <Plus className="w-4 h-4" />Agregar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}