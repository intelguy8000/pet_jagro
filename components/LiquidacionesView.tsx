'use client';

import { useState } from 'react';
import { Delivery, DeliveryZone, zoneNames, zoneColors, deliveryStatusNames, deliveryStatusColors, paymentMethodNames, CreditNote } from '@/types';
import { mockDeliveries, mockMessengers } from '@/lib/mockData';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function LiquidacionesView() {
  const [selectedMessenger, setSelectedMessenger] = useState<string>('all');
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | 'all'>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<string>('all');
  const [showCreditNotes, setShowCreditNotes] = useState(false);

  // Modal de nota de crédito
  const [showCreditNoteModal, setShowCreditNoteModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [creditNoteForm, setCreditNoteForm] = useState({
    reason: '',
    customReason: '',
    amount: '',
    description: ''
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Filtrar entregas
  const filteredDeliveries = mockDeliveries.filter(delivery => {
    if (selectedMessenger !== 'all' && delivery.messenger.id !== selectedMessenger) return false;
    if (selectedZone !== 'all' && delivery.order.customer.zone !== selectedZone) return false;
    if (selectedCustomer !== 'all' && delivery.order.customer.name !== selectedCustomer) return false;
    return true;
  });

  // Entregas con nota de crédito
  const deliveriesWithCreditNote = mockDeliveries.filter(d => d.creditNote);

  // Estadísticas
  const stats = {
    total: filteredDeliveries.length,
    dispatched: filteredDeliveries.filter(d => d.status === 'dispatched').length,
    in_route: filteredDeliveries.filter(d => d.status === 'in_route').length,
    delivered: filteredDeliveries.filter(d => d.status === 'delivered').length,
    returned: filteredDeliveries.filter(d => d.status === 'returned').length,
    pending_payment: filteredDeliveries.filter(d => d.status === 'pending_payment').length,
    totalCollected: filteredDeliveries.reduce((sum, d) => sum + (d.collectedAmount || 0), 0),
  };

  // Obtener clientes únicos
  const uniqueCustomers = Array.from(new Set(mockDeliveries.map(d => d.order.customer.name)));

  // Motivos predefinidos de nota de crédito
  const creditNoteReasons = [
    'Cliente no estaba en la dirección',
    'Producto no corresponde',
    'Producto dañado',
    'Cliente canceló',
    'Error en el pedido',
    'Otro'
  ];

  // Abrir modal de nota de crédito
  const handleOpenCreditNoteModal = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setCreditNoteForm({
      reason: '',
      customReason: '',
      amount: delivery.order.totalValue.toString(),
      description: ''
    });
    setShowCreditNoteModal(true);
  };

  // Cerrar modal
  const handleCloseCreditNoteModal = () => {
    setShowCreditNoteModal(false);
    setSelectedDelivery(null);
    setCreditNoteForm({
      reason: '',
      customReason: '',
      amount: '',
      description: ''
    });
  };

  // Guardar nota de crédito
  const handleSaveCreditNote = () => {
    if (!selectedDelivery) return;

    const finalReason = creditNoteForm.reason === 'Otro'
      ? creditNoteForm.customReason
      : creditNoteForm.reason;

    if (!finalReason || !creditNoteForm.amount) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    const newCreditNote: CreditNote = {
      id: `NC-${String(deliveriesWithCreditNote.length + 1).padStart(3, '0')}`,
      reason: finalReason,
      amount: parseFloat(creditNoteForm.amount),
      authorizedBy: 'Administrador', // En producción, usar usuario actual
      createdAt: new Date(),
      description: creditNoteForm.description
    };

    // En producción, esto se enviaría a la API
    console.log('Nueva nota de crédito:', newCreditNote);
    alert(`✅ Nota de crédito ${newCreditNote.id} creada exitosamente`);

    handleCloseCreditNoteModal();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: '#f5f5f5', letterSpacing: '-0.5px' }}>
          Liquidaciones
        </h1>
        <p className="text-sm" style={{ color: '#a0a0a0' }}>
          Gestión de entregas y pagos por mensajero
        </p>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Filtro Mensajero */}
        <div>
          <label className="block text-xs font-semibold mb-2" style={{ color: '#a0a0a0' }}>
            Mensajero
          </label>
          <select
            value={selectedMessenger}
            onChange={(e) => setSelectedMessenger(e.target.value)}
            className="w-full px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{ backgroundColor: '#252525', color: '#f5f5f5', border: '1px solid #3a3a3a' }}
          >
            <option value="all">Todos los mensajeros</option>
            {mockMessengers.map(messenger => (
              <option key={messenger.id} value={messenger.id}>
                {messenger.name} - {zoneNames[messenger.assignedZone || 'extramuros']}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro Zona */}
        <div>
          <label className="block text-xs font-semibold mb-2" style={{ color: '#a0a0a0' }}>
            Zona
          </label>
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value as DeliveryZone | 'all')}
            className="w-full px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{ backgroundColor: '#252525', color: '#f5f5f5', border: '1px solid #3a3a3a' }}
          >
            <option value="all">Todas las zonas</option>
            <option value="norte">Norte</option>
            <option value="sur">Sur</option>
            <option value="centro">Centro</option>
            <option value="oriente">Oriente</option>
            <option value="occidente">Occidente</option>
            <option value="extramuros">Extramuros</option>
          </select>
        </div>

        {/* Filtro Cliente */}
        <div>
          <label className="block text-xs font-semibold mb-2" style={{ color: '#a0a0a0' }}>
            Cliente
          </label>
          <select
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
            className="w-full px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{ backgroundColor: '#252525', color: '#f5f5f5', border: '1px solid #3a3a3a' }}
          >
            <option value="all">Todos los clientes</option>
            {uniqueCustomers.map(customer => (
              <option key={customer} value={customer}>
                {customer}
              </option>
            ))}
          </select>
        </div>

        {/* Toggle Notas de Crédito */}
        <div className="flex items-end">
          <button
            onClick={() => setShowCreditNotes(!showCreditNotes)}
            className="w-full px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{
              backgroundColor: showCreditNotes ? 'rgba(239, 68, 68, 0.2)' : '#252525',
              color: showCreditNotes ? '#ef4444' : '#f5f5f5',
              border: `1px solid ${showCreditNotes ? '#ef4444' : '#3a3a3a'}`
            }}
          >
            {showCreditNotes ? '✓ ' : ''}Notas de Crédito ({deliveriesWithCreditNote.length})
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="p-4 rounded-xl text-center" style={{ backgroundColor: '#252525' }}>
          <div className="text-2xl font-bold" style={{ color: '#f5f5f5' }}>{stats.total}</div>
          <div className="text-xs" style={{ color: '#a0a0a0' }}>Total</div>
        </div>
        <div className="p-4 rounded-xl text-center" style={{ backgroundColor: '#252525' }}>
          <div className="text-2xl font-bold" style={{ color: '#f59e0b' }}>{stats.dispatched}</div>
          <div className="text-xs" style={{ color: '#a0a0a0' }}>Despachados</div>
        </div>
        <div className="p-4 rounded-xl text-center" style={{ backgroundColor: '#252525' }}>
          <div className="text-2xl font-bold" style={{ color: '#3b82f6' }}>{stats.in_route}</div>
          <div className="text-xs" style={{ color: '#a0a0a0' }}>En Ruta</div>
        </div>
        <div className="p-4 rounded-xl text-center" style={{ backgroundColor: '#252525' }}>
          <div className="text-2xl font-bold" style={{ color: '#10b981' }}>{stats.delivered}</div>
          <div className="text-xs" style={{ color: '#a0a0a0' }}>Entregados</div>
        </div>
        <div className="p-4 rounded-xl text-center" style={{ backgroundColor: '#252525' }}>
          <div className="text-2xl font-bold" style={{ color: '#ef4444' }}>{stats.returned}</div>
          <div className="text-xs" style={{ color: '#a0a0a0' }}>Devueltos</div>
        </div>
        <div className="p-4 rounded-xl text-center" style={{ backgroundColor: '#252525' }}>
          <div className="text-2xl font-bold" style={{ color: '#f59e0b' }}>{stats.pending_payment}</div>
          <div className="text-xs" style={{ color: '#a0a0a0' }}>Pend. Pago</div>
        </div>
        <div className="p-4 rounded-xl text-center" style={{ backgroundColor: '#252525' }}>
          <div className="text-lg font-bold" style={{ color: '#10b981' }}>{formatPrice(stats.totalCollected)}</div>
          <div className="text-xs" style={{ color: '#a0a0a0' }}>Recaudado</div>
        </div>
      </div>

      {/* Tabla de Notas de Crédito */}
      {showCreditNotes && deliveriesWithCreditNote.length > 0 && (
        <div className="p-6 rounded-xl" style={{ backgroundColor: '#252525', border: '2px solid #ef4444' }}>
          <h2 className="text-lg font-bold mb-4" style={{ color: '#ef4444' }}>
            📋 Notas de Crédito
          </h2>
          <div className="space-y-3">
            {deliveriesWithCreditNote.map(delivery => (
              <div
                key={delivery.id}
                className="p-4 rounded-lg"
                style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-bold text-sm" style={{ color: '#f5f5f5' }}>
                      {delivery.creditNote?.id} - {delivery.order.orderNumber}
                    </div>
                    <div className="text-xs" style={{ color: '#a0a0a0' }}>
                      {delivery.order.customer.name}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold" style={{ color: '#ef4444' }}>
                      {formatPrice(delivery.creditNote?.amount || 0)}
                    </div>
                    <div className="text-xs" style={{ color: '#a0a0a0' }}>
                      {delivery.creditNote && format(delivery.creditNote.createdAt, "d MMM HH:mm", { locale: es })}
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs">
                    <span style={{ color: '#a0a0a0' }}>Motivo: </span>
                    <span style={{ color: '#f5f5f5' }}>{delivery.creditNote?.reason}</span>
                  </div>
                  {delivery.creditNote?.description && (
                    <div className="text-xs">
                      <span style={{ color: '#a0a0a0' }}>Descripción: </span>
                      <span style={{ color: '#f5f5f5' }}>{delivery.creditNote.description}</span>
                    </div>
                  )}
                  <div className="text-xs">
                    <span style={{ color: '#a0a0a0' }}>Autorizado por: </span>
                    <span style={{ color: '#f5f5f5' }}>{delivery.creditNote?.authorizedBy}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabla de Entregas */}
      <div className="p-6 rounded-xl" style={{ backgroundColor: '#252525' }}>
        <h2 className="text-lg font-bold mb-4" style={{ color: '#f5f5f5', letterSpacing: '-0.5px' }}>
          Entregas ({filteredDeliveries.length})
        </h2>

        {filteredDeliveries.length === 0 ? (
          <div className="text-center py-8" style={{ color: '#a0a0a0' }}>
            No hay entregas que coincidan con los filtros
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '2px solid #3a3a3a' }}>
                  <th className="text-left py-3 px-2" style={{ color: '#a0a0a0', fontWeight: 600 }}>Pedido</th>
                  <th className="text-left py-3 px-2" style={{ color: '#a0a0a0', fontWeight: 600 }}>Cliente</th>
                  <th className="text-left py-3 px-2" style={{ color: '#a0a0a0', fontWeight: 600 }}>Zona</th>
                  <th className="text-left py-3 px-2" style={{ color: '#a0a0a0', fontWeight: 600 }}>Mensajero</th>
                  <th className="text-left py-3 px-2" style={{ color: '#a0a0a0', fontWeight: 600 }}>Estado</th>
                  <th className="text-left py-3 px-2" style={{ color: '#a0a0a0', fontWeight: 600 }}>Pago</th>
                  <th className="text-right py-3 px-2" style={{ color: '#a0a0a0', fontWeight: 600 }}>Monto</th>
                  <th className="text-center py-3 px-2" style={{ color: '#a0a0a0', fontWeight: 600 }}>N/C</th>
                  <th className="text-center py-3 px-2" style={{ color: '#a0a0a0', fontWeight: 600 }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeliveries.map(delivery => (
                  <tr
                    key={delivery.id}
                    className="transition-all"
                    style={{ borderBottom: '1px solid #3a3a3a' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a2a2a'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td className="py-3 px-2">
                      <div className="font-semibold" style={{ color: '#C46849' }}>
                        {delivery.order.orderNumber}
                      </div>
                      <div className="text-xs" style={{ color: '#a0a0a0' }}>
                        {format(delivery.dispatchedAt, "d MMM HH:mm", { locale: es })}
                      </div>
                    </td>
                    <td className="py-3 px-2" style={{ color: '#f5f5f5' }}>
                      {delivery.order.customer.name}
                    </td>
                    <td className="py-3 px-2">
                      {delivery.order.customer.zone && (
                        <span
                          className="text-xs px-2 py-1 rounded-full font-semibold"
                          style={{
                            backgroundColor: `${zoneColors[delivery.order.customer.zone]}20`,
                            color: zoneColors[delivery.order.customer.zone],
                          }}
                        >
                          {zoneNames[delivery.order.customer.zone]}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-2" style={{ color: '#f5f5f5' }}>
                      {delivery.messenger.name}
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className="text-xs px-2 py-1 rounded-full font-semibold"
                        style={{
                          backgroundColor: `${deliveryStatusColors[delivery.status]}20`,
                          color: deliveryStatusColors[delivery.status],
                        }}
                      >
                        {deliveryStatusNames[delivery.status]}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      {delivery.paymentMethod && (
                        <span className="text-xs" style={{ color: '#d0d0d0' }}>
                          {paymentMethodNames[delivery.paymentMethod]}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-right">
                      <div className="font-bold" style={{ color: delivery.collectedAmount ? '#10b981' : '#a0a0a0' }}>
                        {delivery.collectedAmount ? formatPrice(delivery.collectedAmount) : '-'}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center">
                      {delivery.creditNote && (
                        <span className="text-lg" title="Nota de Crédito">⚠️</span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-center">
                      {!delivery.creditNote && (
                        <button
                          onClick={() => handleOpenCreditNoteModal(delivery)}
                          className="px-3 py-1 rounded-lg text-xs font-semibold transition-all"
                          style={{
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            color: '#ef4444',
                            border: '1px solid rgba(239, 68, 68, 0.3)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                          }}
                        >
                          + N/C
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Nota de Crédito */}
      {showCreditNoteModal && selectedDelivery && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
        >
          <div
            className="rounded-xl shadow-2xl max-w-md w-full p-6"
            style={{ backgroundColor: '#252525' }}
          >
            {/* Header */}
            <div className="mb-4">
              <h2 className="text-xl font-bold mb-2" style={{ color: '#ef4444' }}>
                Crear Nota de Crédito
              </h2>
              <div className="text-sm" style={{ color: '#a0a0a0' }}>
                {selectedDelivery.order.orderNumber} - {selectedDelivery.order.customer.name}
              </div>
            </div>

            {/* Formulario */}
            <div className="space-y-4">
              {/* Motivo */}
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: '#a0a0a0' }}>
                  Motivo <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  value={creditNoteForm.reason}
                  onChange={(e) => setCreditNoteForm({ ...creditNoteForm, reason: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg text-sm"
                  style={{ backgroundColor: '#2a2a2a', color: '#f5f5f5', border: '1px solid #3a3a3a' }}
                >
                  <option value="">Seleccionar motivo</option>
                  {creditNoteReasons.map(reason => (
                    <option key={reason} value={reason}>{reason}</option>
                  ))}
                </select>
              </div>

              {/* Motivo personalizado (si eligió "Otro") */}
              {creditNoteForm.reason === 'Otro' && (
                <div>
                  <label className="block text-xs font-semibold mb-2" style={{ color: '#a0a0a0' }}>
                    Especificar motivo <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={creditNoteForm.customReason}
                    onChange={(e) => setCreditNoteForm({ ...creditNoteForm, customReason: e.target.value })}
                    placeholder="Escribe el motivo..."
                    className="w-full px-4 py-2 rounded-lg text-sm"
                    style={{ backgroundColor: '#2a2a2a', color: '#f5f5f5', border: '1px solid #3a3a3a' }}
                  />
                </div>
              )}

              {/* Monto */}
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: '#a0a0a0' }}>
                  Monto <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="number"
                  value={creditNoteForm.amount}
                  onChange={(e) => setCreditNoteForm({ ...creditNoteForm, amount: e.target.value })}
                  placeholder="0"
                  className="w-full px-4 py-2 rounded-lg text-sm font-semibold"
                  style={{ backgroundColor: '#2a2a2a', color: '#f5f5f5', border: '1px solid #3a3a3a' }}
                />
                <div className="text-xs mt-1" style={{ color: '#a0a0a0' }}>
                  Valor del pedido: {formatPrice(selectedDelivery.order.totalValue)}
                </div>
              </div>

              {/* Descripción adicional */}
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: '#a0a0a0' }}>
                  Descripción adicional (opcional)
                </label>
                <textarea
                  value={creditNoteForm.description}
                  onChange={(e) => setCreditNoteForm({ ...creditNoteForm, description: e.target.value })}
                  placeholder="Detalles adicionales..."
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg text-sm resize-none"
                  style={{ backgroundColor: '#2a2a2a', color: '#f5f5f5', border: '1px solid #3a3a3a' }}
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCloseCreditNoteModal}
                className="flex-1 py-3 rounded-lg text-sm font-semibold transition-all"
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid #3a3a3a',
                  color: '#a0a0a0'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#ef4444';
                  e.currentTarget.style.color = '#ef4444';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#3a3a3a';
                  e.currentTarget.style.color = '#a0a0a0';
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveCreditNote}
                className="flex-1 py-3 rounded-lg text-sm font-semibold text-white transition-all"
                style={{ backgroundColor: '#ef4444' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
              >
                Crear Nota de Crédito
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
