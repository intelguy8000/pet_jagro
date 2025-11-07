'use client';

import { useState } from 'react';
import Image from 'next/image';

type DesignStyle = 'minimal' | 'bold' | 'elegant' | 'modern';

export default function DesignDemo() {
  const [selectedStyle, setSelectedStyle] = useState<DesignStyle>('minimal');

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Selector de estilos */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🎨 Elige tu Estilo de Diseño</h1>
          <p className="text-gray-600 mb-8">Selecciona el diseño que más te guste para el sistema J Agro</p>

          <div className="grid grid-cols-4 gap-4">
            <button
              onClick={() => setSelectedStyle('minimal')}
              className={`p-6 rounded-xl border-4 transition-all ${
                selectedStyle === 'minimal'
                  ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="font-bold text-lg mb-2">Minimal Clean</h3>
              <p className="text-sm text-gray-600">Limpio, espacioso, simple</p>
            </button>

            <button
              onClick={() => setSelectedStyle('bold')}
              className={`p-6 rounded-xl border-4 transition-all ${
                selectedStyle === 'bold'
                  ? 'border-orange-500 bg-orange-50 shadow-lg scale-105'
                  : 'border-gray-200 hover:border-orange-300'
              }`}
            >
              <div className="text-6xl mb-4">⚡</div>
              <h3 className="font-bold text-lg mb-2">Bold & Vibrant</h3>
              <p className="text-sm text-gray-600">Energético, colorido, dinámico</p>
            </button>

            <button
              onClick={() => setSelectedStyle('elegant')}
              className={`p-6 rounded-xl border-4 transition-all ${
                selectedStyle === 'elegant'
                  ? 'border-purple-500 bg-purple-50 shadow-lg scale-105'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              <div className="text-6xl mb-4">💎</div>
              <h3 className="font-bold text-lg mb-2">Elegant Pro</h3>
              <p className="text-sm text-gray-600">Sofisticado, premium, pulido</p>
            </button>

            <button
              onClick={() => setSelectedStyle('modern')}
              className={`p-6 rounded-xl border-4 transition-all ${
                selectedStyle === 'modern'
                  ? 'border-teal-500 bg-teal-50 shadow-lg scale-105'
                  : 'border-gray-200 hover:border-teal-300'
              }`}
            >
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="font-bold text-lg mb-2">Modern Tech</h3>
              <p className="text-sm text-gray-600">Futurista, tech, innovador</p>
            </button>
          </div>
        </div>

        {/* Preview del diseño seleccionado */}
        <div className="transition-all duration-500">
          {selectedStyle === 'minimal' && <MinimalDesign />}
          {selectedStyle === 'bold' && <BoldDesign />}
          {selectedStyle === 'elegant' && <ElegantDesign />}
          {selectedStyle === 'modern' && <ModernDesign />}
        </div>
      </div>
    </div>
  );
}

// Diseño 1: Minimal Clean
function MinimalDesign() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🏢</span>
            </div>
            <div>
              <h2 className="text-2xl font-light text-gray-900">J Agro</h2>
              <p className="text-sm text-gray-500">Sistema de Picking</p>
            </div>
          </div>
          <div className="flex items-center space-x-8">
            <div className="text-center">
              <div className="text-3xl font-light text-gray-900">15</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Pedidos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-light text-gray-900">3</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Activos</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Preview */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="w-full h-32 bg-gray-50 rounded-lg mb-4"></div>
          <h3 className="font-medium text-gray-900 mb-2">Producto 1</h3>
          <p className="text-sm text-gray-500">$45,000</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="w-full h-32 bg-gray-50 rounded-lg mb-4"></div>
          <h3 className="font-medium text-gray-900 mb-2">Producto 2</h3>
          <p className="text-sm text-gray-500">$32,000</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="w-full h-32 bg-gray-50 rounded-lg mb-4"></div>
          <h3 className="font-medium text-gray-900 mb-2">Producto 3</h3>
          <p className="text-sm text-gray-500">$28,000</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Características:</h3>
        <ul className="space-y-2 text-gray-600">
          <li>• Espacios blancos amplios</li>
          <li>• Tipografía ligera y clara</li>
          <li>• Bordes sutiles</li>
          <li>• Máxima legibilidad</li>
          <li>• Sin distracciones visuales</li>
        </ul>
      </div>
    </div>
  );
}

// Diseño 2: Bold & Vibrant
function BoldDesign() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl shadow-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-4xl">🎨</span>
            </div>
            <div>
              <h2 className="text-4xl font-black">J AGRO</h2>
              <p className="text-lg font-bold opacity-90">SISTEMA DE PICKING</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="bg-white bg-opacity-20 rounded-2xl p-6 backdrop-blur-sm">
              <div className="text-5xl font-black">15</div>
              <div className="text-sm font-bold uppercase">Pedidos</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-2xl p-6 backdrop-blur-sm">
              <div className="text-5xl font-black">3</div>
              <div className="text-sm font-bold uppercase">Activos</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Preview */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-6 text-white shadow-xl transform hover:scale-105 transition-transform">
          <div className="w-full h-32 bg-white bg-opacity-20 rounded-2xl mb-4"></div>
          <h3 className="font-black text-xl mb-2">PRODUCTO 1</h3>
          <p className="text-2xl font-bold">$45,000</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-6 text-white shadow-xl transform hover:scale-105 transition-transform">
          <div className="w-full h-32 bg-white bg-opacity-20 rounded-2xl mb-4"></div>
          <h3 className="font-black text-xl mb-2">PRODUCTO 2</h3>
          <p className="text-2xl font-bold">$32,000</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-6 text-white shadow-xl transform hover:scale-105 transition-transform">
          <div className="w-full h-32 bg-white bg-opacity-20 rounded-2xl mb-4"></div>
          <h3 className="font-black text-xl mb-2">PRODUCTO 3</h3>
          <p className="text-2xl font-bold">$28,000</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-3xl p-8 text-gray-900 shadow-xl">
        <h3 className="text-2xl font-black mb-4">CARACTERÍSTICAS:</h3>
        <ul className="space-y-3 text-lg font-bold">
          <li>⚡ Colores vibrantes y energéticos</li>
          <li>🎯 Gradientes llamativos</li>
          <li>💪 Tipografía en negrita</li>
          <li>🔥 Alto contraste</li>
          <li>✨ Efectos hover dinámicos</li>
        </ul>
      </div>
    </div>
  );
}

// Diseño 3: Elegant Pro
function ElegantDesign() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-2xl p-10 text-white border border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-xl">
              <span className="text-3xl">💎</span>
            </div>
            <div>
              <h2 className="text-3xl font-serif italic">J Agro</h2>
              <p className="text-sm text-slate-400 tracking-widest uppercase">Premium System</p>
            </div>
          </div>
          <div className="flex space-x-6">
            <div className="text-right">
              <div className="text-4xl font-serif italic text-purple-400">15</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider">Pedidos</div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-serif italic text-pink-400">3</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider">Activos</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Preview */}
      <div className="grid grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-2xl transition-shadow">
            <div className="w-full h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg mb-4 border border-slate-300"></div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-serif text-lg text-slate-900">Producto {i}</h3>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Premium</span>
            </div>
            <p className="text-2xl font-serif italic text-slate-700">${[45, 32, 28][i - 1]},000</p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 border-2 border-purple-200">
        <h3 className="text-2xl font-serif italic text-slate-900 mb-6">Características Distintivas</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white">✓</div>
            <div>
              <div className="font-semibold text-slate-900">Tipografía Serif</div>
              <div className="text-sm text-slate-600">Elegante y sofisticada</div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white">✓</div>
            <div>
              <div className="font-semibold text-slate-900">Paleta Premium</div>
              <div className="text-sm text-slate-600">Colores oscuros y ricos</div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white">✓</div>
            <div>
              <div className="font-semibold text-slate-900">Sombras Profundas</div>
              <div className="text-sm text-slate-600">Efectos de profundidad</div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white">✓</div>
            <div>
              <div className="font-semibold text-slate-900">Detalles Finos</div>
              <div className="text-sm text-slate-600">Bordes y acentos</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Diseño 4: Modern Tech
function ModernDesign() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative bg-slate-900 rounded-2xl shadow-2xl p-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-5">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🚀</span>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white tracking-tight">J AGRO</h2>
                <p className="text-cyan-400 text-sm font-mono">v2.0.0 | PICKING SYSTEM</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-cyan-500/20">
                <div className="text-3xl font-bold text-cyan-400 font-mono">15</div>
                <div className="text-xs text-slate-400 font-mono">ORDERS</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-blue-500/20">
                <div className="text-3xl font-bold text-blue-400 font-mono">3</div>
                <div className="text-xs text-slate-400 font-mono">ACTIVE</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Preview */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { color: 'from-cyan-500 to-blue-500', label: 'PROD-001' },
          { color: 'from-blue-500 to-purple-500', label: 'PROD-002' },
          { color: 'from-purple-500 to-pink-500', label: 'PROD-003' },
        ].map((item, i) => (
          <div key={i} className="bg-slate-900 rounded-xl p-5 border border-slate-700 hover:border-cyan-500/50 transition-all group">
            <div className={`w-full h-28 bg-gradient-to-br ${item.color} rounded-lg mb-4 opacity-80 group-hover:opacity-100 transition-opacity`}></div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500 font-mono">{item.label}</span>
              <span className="text-xs bg-cyan-500/10 text-cyan-400 px-2 py-1 rounded font-mono">STOCK</span>
            </div>
            <h3 className="font-bold text-white mb-1">Producto {i + 1}</h3>
            <p className="text-2xl font-mono text-cyan-400">${[45, 32, 28][i]}K</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-xl p-6 border border-cyan-500/30">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <span className="text-cyan-400 mr-2">▸</span> TECH FEATURES
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: '⚡', title: 'Alto Rendimiento', desc: 'Optimizado para velocidad' },
            { icon: '🎯', title: 'Precisión', desc: 'Datos en tiempo real' },
            { icon: '🔒', title: 'Seguridad', desc: 'Protección avanzada' },
          ].map((feat, i) => (
            <div key={i} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <div className="text-3xl mb-2">{feat.icon}</div>
              <div className="font-bold text-white text-sm mb-1">{feat.title}</div>
              <div className="text-xs text-slate-400">{feat.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
