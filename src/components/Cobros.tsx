import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, Send, Ticket, CheckCircle2, Award, Printer, User } from 'lucide-react';
import { Table, Order, Sale, Customer } from '../types';

interface CobrosProps {
  tables: Table[];
  activeOrders: Order[];
  customers: Customer[];
  onProcessPayment: (orderId: string, paymentMethod: Sale['paymentMethod'], discount: number, earnedPoints: number) => void;
  selectedTableIdPreset?: string;
  setSelectedTableIdPreset: (id: string) => void;
}

export default function Cobros({
  tables,
  activeOrders,
  customers,
  onProcessPayment,
  selectedTableIdPreset,
  setSelectedTableIdPreset
}: CobrosProps) {
  const [selectedTableId, setSelectedTableId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Efectivo' | 'Tarjeta' | 'Transferencia'>('Efectivo');
  
  // Invoice state adjustments
  const [discountAmount, setDiscountAmount] = useState(0);
  const [montoRecibido, setMontoRecibido] = useState('');
  const [changeAmount, setChangeAmount] = useState<number | null>(null);
  
  // Receipt print view trigger
  const [printedReceipt, setPrintedReceipt] = useState<any | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Synchronize preset from tables view
  useEffect(() => {
    if (selectedTableIdPreset) {
      setSelectedTableId(selectedTableIdPreset);
      setSelectedTableIdPreset(''); // Clear
    }
  }, [selectedTableIdPreset]);

  // Find all active occupied tables
  const billingTables = tables.filter(t => t.status !== 'Libre');

  // Selected table comanda/order
  const currentTable = tables.find(t => t.id === selectedTableId);
  const currentOrder = currentTable?.currentOrderId
    ? activeOrders.find(o => o.id === currentTable.currentOrderId)
    : null;

  // Connected customer
  const currentCustomer = currentOrder?.customerId
    ? customers.find(c => c.id === currentOrder.customerId)
    : null;

  // Totals calculations
  const subtotal = currentOrder?.subtotal ?? 0;
  const tax = currentOrder?.tax ?? 0;
  const rawTotal = subtotal + tax;
  const finalTotal = Math.max(rawTotal - discountAmount, 0);

  // Calculate change due when "montoRecibido" changes
  useEffect(() => {
    const cash = parseFloat(montoRecibido);
    if (!isNaN(cash) && cash >= finalTotal && paymentMethod === 'Efectivo') {
      setChangeAmount(cash - finalTotal);
    } else {
      setChangeAmount(null);
    }
  }, [montoRecibido, finalTotal, paymentMethod]);

  const handleApplyPointsDiscount = () => {
    if (currentCustomer && currentCustomer.points >= 50) {
      // e.g. 50 points = $5.00 discount
      const ptsValue = 5;
      setDiscountAmount(prev => prev + ptsValue);
      alert('Se aplicó un descuento de $5.00 canjeando 50 puntos acumulados.');
    } else {
      alert('El cliente no cuenta con suficientes puntos (mínimo 50 puntos).');
    }
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOrder) return;

    if (paymentMethod === 'Efectivo') {
      const cash = parseFloat(montoRecibido);
      if (isNaN(cash) || cash < finalTotal) {
        alert('Por favor, ingresa un monto recibido válido e igual o mayor al total.');
        return;
      }
    }

    // Points earned by this sale (e.g. 1 point for every $10 spent)
    const earnedPoints = Math.floor(finalTotal / 10);

    // Save copy of order + calculations for printed receipt rendering before state closes
    const receiptData = {
      orderId: currentOrder.id,
      tableNumber: currentOrder.tableNumber,
      items: [...currentOrder.items],
      subtotal,
      tax,
      discount: (currentOrder.discount || 0) + discountAmount,
      total: finalTotal,
      paymentMethod,
      timestamp: new Date().toISOString(),
      customerName: currentCustomer?.name || 'Consumidor Final',
      waiterId: currentOrder.meseroId,
      montoRecibido: paymentMethod === 'Efectivo' ? parseFloat(montoRecibido) : finalTotal,
      change: paymentMethod === 'Efectivo' ? (parseFloat(montoRecibido) - finalTotal) : 0
    };

    // Execute central state handler
    onProcessPayment(
      currentOrder.id,
      paymentMethod,
      discountAmount,
      earnedPoints
    );

    // Render receipt and success state
    setPrintedReceipt(receiptData);
    setShowSuccessMessage(true);

    // Reset components checkout states
    setSelectedTableId('');
    setDiscountAmount(0);
    setMontoRecibido('');
    setChangeAmount(null);
  };

  return (
    <div className="space-y-6" id="cobros-main-container">
      {/* Header */}
      <div className="pb-4 border-b border-[#2A2A2A]">
        <h1 className="text-2xl font-display font-semibold text-[#C5A059] tracking-tight">Caja & Cobros de Cuentas</h1>
        <p className="text-sm text-gray-400 mt-1">Saca la cuenta de las mesas, aplica descuentos, calcula cambios y procesa facturas.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel Izquierdo: Formulario de Cobro */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#141414] p-6 rounded-xl border border-[#2A2A2A] shadow-xs">
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Cerrar Orden de Mesa</h3>
            
            <form onSubmit={handleProcessPayment} className="space-y-5">
              {/* Selector de Mesa */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 block">Paso 1: Selecciona la mesa para cobrar</label>
                <select
                  value={selectedTableId}
                  onChange={(e) => {
                    setSelectedTableId(e.target.value);
                    setDiscountAmount(0);
                    setMontoRecibido('');
                    setChangeAmount(null);
                  }}
                  required
                  className="w-full text-xs px-3 py-2.5 border border-[#2A2A2A] rounded-lg focus:ring-1 focus:ring-[#C5A059] bg-[#1F1F1F] text-white shadow-xs max-w-md"
                >
                  <option value="" className="bg-[#141414] text-gray-400">-- Selecciona una mesa con cuenta activa --</option>
                  {billingTables.map(t => (
                    <option key={t.id} value={t.id} className="bg-[#141414] text-white">
                      Mesa {t.number} ({t.status === 'Buscando Cuenta' ? '🧾 Pidiendo Cuenta' : 'Ocupada'})
                    </option>
                  ))}
                </select>
                {billingTables.length === 0 && (
                  <p className="text-xs text-rose-400 font-medium">No hay ninguna mesa ocupada para cobrar en este momento.</p>
                )}
              </div>

              {currentOrder ? (
                <div className="space-y-6 border-t border-[#2A2A2A] pt-5">
                  {/* Fila de Método de pago y Descuento */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Método de Pago */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-400 block">Paso 2: Canal de Pago</label>
                      <div className="grid grid-cols-3 gap-2" id="payment-methods-selector">
                        {(['Efectivo', 'Tarjeta', 'Transferencia'] as Sale['paymentMethod'][]).map(method => (
                          <button
                            key={method}
                            type="button"
                            onClick={() => {
                              setPaymentMethod(method);
                              setMontoRecibido('');
                            }}
                            className={`py-3 px-2 rounded-lg border text-xs font-semibold flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                              paymentMethod === method
                                ? 'bg-[#C5A059] text-black border-transparent shadow-xs shadow-[#C5A059]/10'
                                : 'bg-[#1F1F1F] text-gray-400 border-[#2A2A2A] hover:bg-[#2A2A2A] hover:text-white'
                            }`}
                          >
                            {method === 'Efectivo' && <DollarSign className="w-4 h-4" />}
                            {method === 'Tarjeta' && <CreditCard className="w-4 h-4" />}
                            {method === 'Transferencia' && <Send className="w-4 h-4" />}
                            <span>{method}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Descuentos & Programa de Fidelidad */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-400 block">Paso 3: Descuentos y Promociones</label>
                      <div className="space-y-2 bg-[#1F1F1F] p-3 rounded-lg border border-[#2A2A2A]">
                        {currentCustomer ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="flex items-center gap-1.5 text-gray-300"><User className="w-3.5 h-3.5 text-gray-500" />{currentCustomer.name}</span>
                              <span className="font-mono text-[#C5A059] font-bold">{currentCustomer.points} pts</span>
                            </div>
                            <button
                              type="button"
                              onClick={handleApplyPointsDiscount}
                              className="w-full text-center bg-[#141414] border border-[#C5A059]/30 hover:bg-[#1C1C1C] text-[#C5A059] text-[11px] font-bold py-1.5 rounded-md flex items-center justify-center gap-1 transition-all cursor-pointer"
                            >
                              <Award className="w-3.5 h-3.5" />
                              Redimir 50 puntos (-$5.00)
                            </button>
                          </div>
                        ) : (
                          <p className="text-[11px] text-gray-500 italic">No hay ningún cliente fidelizado registrado en esta comanda para canjear puntos.</p>
                        )}

                        <div className="pt-2 border-t border-[#2A2A2A]/60 flex items-center gap-2">
                          <span className="text-[11px] text-gray-400 font-semibold shrink-0">Desc. Manual ($):</span>
                          <input
                            type="number"
                            min="0"
                            step="0.5"
                            value={discountAmount || ''}
                            onChange={(e) => setDiscountAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                            placeholder="0.00"
                            className="w-24 text-xs px-2 py-1 bg-[#0D0D0D] border border-[#2A2A2A] rounded focus:outline-hidden font-mono text-[#C5A059] font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Detalle de Cambio para Pago con Efectivo */}
                  {paymentMethod === 'Efectivo' && (
                    <div className="bg-blue-955/20 p-4 rounded-xl border border-blue-900/40 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-blue-300 block">Monto Recibido ($)</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-3 flex items-center font-bold text-[#C5A059]">$</span>
                          <input
                            type="number"
                            required
                            min={finalTotal}
                            step="0.01"
                            value={montoRecibido}
                            onChange={(e) => setMontoRecibido(e.target.value)}
                            placeholder="Monto entregado por el cliente"
                            className="w-full text-sm pl-7 pr-3 py-2 border border-blue-900/45 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#C5A059] bg-[#0D0D0D] font-mono font-bold text-[#C5A059]"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col justify-center space-y-0.5">
                        <span className="text-[11px] text-blue-400 font-bold uppercase tracking-wider block">Cambio a entregar:</span>
                        {changeAmount !== null ? (
                          <span className="text-2xl font-black font-mono text-white">${changeAmount.toFixed(2)}</span>
                        ) : (
                          <span className="text-xs font-semibold text-rose-400 font-mono">Esperando monto suficiente...</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Caja de Checkout Fuerte */}
                  <div className="border-t border-[#2A2A2A] pt-4 flex flex-col md:flex-row items-center justify-between gap-4 bg-[#1F1F1F]/40 p-4 rounded-xl">
                    <div className="space-y-1 text-center md:text-left">
                      <p className="text-xs text-gray-400 font-semibold">Resumen de Cargo • Mesa {currentOrder.tableNumber}</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-white">${finalTotal.toFixed(2)}</span>
                        <span className="text-xs text-gray-500 font-mono line-through">${rawTotal.toFixed(2)}</span>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full md:w-auto px-6 py-3 bg-[#C5A059] hover:bg-[#D5B069] text-black text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm font-sans transition-colors cursor-pointer"
                    >
                      Procesar Venta y Ver Ticket 🧾
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-8 border border-dashed border-[#2A2A2A] rounded-xl text-center text-gray-550 text-xs">
                  Por favor, selecciona una mesa de comedor en el selector superior para desplegar su estado de deudas y detalle de cobros.
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Panel Derecho: Ticket de Control / Éxito */}
        <div className="space-y-4">
          {showSuccessMessage && (
            <div className="bg-emerald-955/20 border border-emerald-900/30 p-4 rounded-xl flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-emerald-400">¡Pago procesado con Éxito!</p>
                <p className="text-[11px] text-gray-300 mt-0.5">La mesa ha quedado libre, se cerró el ticket en el historial de ventas y se acreditaron los puntos del cliente.</p>
                <button 
                  onClick={() => setShowSuccessMessage(false)}
                  className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 hover:underline mt-2 inline-block cursor-pointer"
                >
                  Entendido
                </button>
              </div>
            </div>
          )}

          {printedReceipt ? (
            <div className="bg-[#1C1C1C]/95 p-6 rounded-xl border border-dashed border-[#2A2A2A] shadow-xs relative overflow-hidden font-mono text-xs text-gray-300 space-y-4" id="printed-thermal-ticket">
              <div className="absolute top-3 right-3 w-8 h-8 opacity-15 pointer-events-none">
                <Printer className="w-full h-full text-[#C5A059]" />
              </div>

              {/* Encabezado del restaurante */}
              <div className="text-center space-y-1 pb-4 border-b border-dashed border-[#2A2A2A]">
                <h4 className="font-extrabold text-sm text-white uppercase tracking-wider">SABOR & GESTIÓN</h4>
                <p className="text-[10px] text-gray-500">Av. Gastronómica #456</p>
                <p className="text-[10px] text-gray-500">RFC: SEG881023-RTA</p>
                <p className="text-[10px] text-gray-500">Tel: +52 55 1234 5678</p>
              </div>

              {/* Info de Transacción */}
              <div className="space-y-1 text-[10px] text-gray-400">
                <div className="flex justify-between">
                  <span>TICKET:</span>
                  <span className="text-white font-bold">#{printedReceipt.orderId.substring(4, 10).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span>MESA:</span>
                  <span className="text-white font-bold">{printedReceipt.tableNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>CLIENTE:</span>
                  <span className="text-white">{printedReceipt.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span>FECHA:</span>
                  <span>{new Date(printedReceipt.timestamp).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })}</span>
                </div>
              </div>

              {/* Detalles de Platillos */}
              <div className="border-t border-b border-dashed border-[#2A2A2A] py-3 space-y-2">
                <div className="flex text-[10px] font-extrabold text-[#C5A059]">
                  <span className="w-8">CANT</span>
                  <span className="flex-1">DESCRIPCIÓN</span>
                  <span className="w-16 text-right">TOTAL</span>
                </div>

                {printedReceipt.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex text-[10px] text-gray-300">
                    <span className="w-8 font-bold text-[#C5A059]">{item.quantity}x</span>
                    <span className="flex-1 truncate">{item.name}</span>
                    <span className="w-16 text-right font-semibold text-white">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Totales ticket */}
              <div className="space-y-1 text-xs text-right pl-12 pr-1 text-gray-400">
                <div className="flex justify-between">
                  <span>SUBTOTAL:</span>
                  <span className="text-gray-200">${printedReceipt.subtotal.toFixed(2)}</span>
                </div>
                {printedReceipt.discount > 0 && (
                  <div className="flex justify-between text-rose-400 font-semibold italic">
                    <span>DESC. APLICADO:</span>
                    <span>-${printedReceipt.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>IVA (10%):</span>
                  <span className="text-gray-200">${printedReceipt.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-white pt-1.5 border-t border-dashed border-[#2A2A2A]">
                  <span className="text-[#C5A059]">PAGO TOTAL:</span>
                  <span className="text-[#C5A059]">${printedReceipt.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Info cambio */}
              <div className="bg-[#141414] p-2.5 rounded border border-[#2A2A2A] space-y-1 text-[10px] text-gray-400">
                <div className="flex justify-between">
                  <span>MÉTODO PAGO:</span>
                  <span className="font-bold text-[#C5A059] uppercase">{printedReceipt.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>PAGÓ CON:</span>
                  <span className="text-gray-200">${printedReceipt.montoRecibido.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>CAMB. ENTREGADO:</span>
                  <span className="font-bold text-white">${printedReceipt.change.toFixed(2)}</span>
                </div>
              </div>

              {/* Pie del ticket */}
              <div className="text-center space-y-1 pt-2 text-[9px] text-gray-500">
                <p>¡MUCHAS GRACIAS POR SU VISITA!</p>
                <p className="font-bold text-gray-400">Sabor memorable, experiencia inigualable.</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="w-full text-center py-2 bg-[#2A2A2A] hover:bg-[#343434] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                Imprimir Copia Física
              </button>
            </div>
          ) : (
            <div className="bg-[#141414] p-6 rounded-xl border border-[#2A2A2A] shadow-xs text-center text-gray-500 py-24 flex flex-col items-center justify-center gap-2">
              <Ticket className="w-10 h-10 text-[#C5A059]/30" />
              <p className="text-xs font-semibold text-gray-300 uppercase tracking-widest">Ticket Térmico Virtual</p>
              <p className="text-[11px] max-w-[180px] leading-relaxed mt-1 text-gray-500">Una vez procesado el abono de la mesa, aquí se generará una factura o ticket térmico imprimible en tiempo real.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
