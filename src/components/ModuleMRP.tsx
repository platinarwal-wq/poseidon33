import React, { useState } from 'react';
import { 
  BOMProduct, 
  ExplosionResult 
} from '../types/naval';
import { 
  Cog, 
  Calculator, 
  CheckCircle2, 
  DollarSign, 
  Boxes, 
  Hammer,
  FileCheck2
} from 'lucide-react';

interface ModuleMRPProps {
  products: BOMProduct[];
  onExecuteProductionOrder: (result: ExplosionResult) => void;
}

export const ModuleMRP: React.FC<ModuleMRPProps> = ({
  products,
  onExecuteProductionOrder
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0].id);
  const [quantity, setQuantity] = useState<number>(5000);
  const [mermaAdjustment, setMermaAdjustment] = useState<number>(0); // -2% to +5% offset
  const [laborHourlyRate, setLaborHourlyRate] = useState<number>(180);
  const [orderNotice, setOrderNotice] = useState<string | null>(null);

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];

  // Calculate Explosion in real-time
  const calculateExplosion = (): ExplosionResult => {
    const componentsExplosion = selectedProduct.components.map((comp) => {
      const netPerUnit = comp.netPerUnit;
      const effectiveWastePct = Math.max(0, comp.technicalWastePercent + mermaAdjustment);
      const netRequired = netPerUnit * quantity;
      const wasteAmount = netRequired * (effectiveWastePct / 100);
      const grossRequired = netRequired + wasteAmount;
      const totalCost = grossRequired * comp.unitCost;

      return {
        name: comp.name,
        unit: comp.unit,
        netRequired,
        wasteAmount,
        grossRequired,
        unitCost: comp.unitCost,
        totalCost,
        partida: comp.partidaPresupuestal
      };
    });

    const totalDirectMaterialCost = componentsExplosion.reduce((acc, c) => acc + c.totalCost, 0);
    const totalLaborHours = selectedProduct.laborHoursPerUnit * quantity;
    const totalLaborCost = totalLaborHours * laborHourlyRate;
    const directCost = totalDirectMaterialCost + totalLaborCost;
    const indirectCost = directCost * selectedProduct.indirectCostRate;
    const totalProductionCost = directCost + indirectCost;
    const costPerUnit = totalProductionCost / quantity;

    return {
      productId: selectedProduct.id,
      quantity,
      componentsExplosion,
      totalDirectMaterialCost,
      totalLaborHours,
      totalLaborCost,
      indirectCost,
      totalProductionCost,
      costPerUnit,
      partidaAfectada: selectedProduct.defaultPartida,
      executionDate: new Date().toISOString()
    };
  };

  const currentExplosion = calculateExplosion();

  const handleLaunchProduction = () => {
    onExecuteProductionOrder(currentExplosion);
    setOrderNotice(`¡Orden Técnica MRP de Manufactura registrada! Lote de ${quantity.toLocaleString('es-MX')} ${selectedProduct.name} comprometido en Partida ${selectedProduct.defaultPartida}.`);
    setTimeout(() => setOrderNotice(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-900 uppercase tracking-widest font-bold">
            <Cog className="w-3.5 h-3.5 text-blue-800" />
            <span>MÓDULO II // MRP & MAESTRANZA NAVAL</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
            Planeación de Producción, BOM & Presupuesto de Manufactura
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Administración de listas de materiales (BOM) navales, explosión automática de materias primas con mermas técnicas, horas-hombre y afectación a partidas de gasto público.
          </p>
        </div>
        <div className="text-xs font-mono text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded self-start font-medium shadow-2xs">
          Talleres: Fábrica de Vestuario SEMAR & Maestranza Naval
        </div>
      </div>

      {orderNotice && (
        <div className="p-3.5 rounded border border-emerald-300 bg-emerald-50 text-xs text-emerald-900 font-mono font-medium flex items-center gap-2.5 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{orderNotice}</span>
        </div>
      )}

      {/* Product BOM Selector Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {products.map((prod) => (
          <button
            key={prod.id}
            onClick={() => {
              setSelectedProductId(prod.id);
              if (prod.category === 'MOBILIARIO_TACTICO' && quantity > 500) {
                setQuantity(200);
              } else if (prod.category === 'UNIFORMES' && quantity < 1000) {
                setQuantity(5000);
              }
            }}
            className={`p-3.5 rounded-lg border text-left transition-all shadow-xs ${
              selectedProductId === prod.id
                ? 'border-blue-800 bg-blue-50/70'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1">
              <span className="font-semibold">{prod.code}</span>
              <span className="text-blue-900 font-bold">Partida {prod.defaultPartida}</span>
            </div>
            <div className="text-xs font-bold text-slate-900 line-clamp-1">{prod.name}</div>
            <div className="text-[11px] text-slate-600 mt-1">
              {prod.components.length} componentes · {prod.laborHoursPerUnit} HH/unidad
            </div>
          </button>
        ))}
      </div>

      {/* Simulator Parameters Control Bar */}
      <div className="p-4 rounded-lg border border-slate-200 bg-white space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-900 uppercase font-bold">
            <Calculator className="w-4 h-4 text-blue-800" />
            <span>Parámetros Operativos del Lote de Fabricación</span>
          </div>
          <span className="text-xs text-slate-600 font-mono font-medium">
            {selectedProduct.name}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-mono text-slate-600 block mb-1 font-medium">
              Volumen de Producción (Unidades)
            </label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded text-slate-900 font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-slate-600 block mb-1 font-medium">
              Ajuste de Merma Técnica (% Delta: {mermaAdjustment >= 0 ? `+${mermaAdjustment}%` : `${mermaAdjustment}%`})
            </label>
            <input
              type="range"
              min={-2}
              max={6}
              step={0.5}
              value={mermaAdjustment}
              onChange={(e) => setMermaAdjustment(parseFloat(e.target.value))}
              className="w-full accent-blue-900 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
              <span>-2% (Corte CNC)</span>
              <span>0% (Norma)</span>
              <span>+6% (Manual)</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-slate-600 block mb-1 font-medium">
              Tarifa Horas-Hombre Maestranza ($/HH)
            </label>
            <input
              type="number"
              min={50}
              value={laborHourlyRate}
              onChange={(e) => setLaborHourlyRate(Math.max(50, parseInt(e.target.value) || 50))}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded text-slate-900 font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
            />
          </div>
        </div>
      </div>

      {/* Explosion Results Table */}
      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-blue-900 font-bold uppercase">
            <Boxes className="w-4 h-4 text-blue-800" />
            <span>Explosión Automática de Materia Prima Neta vs Merma Técnica</span>
          </div>
          <span className="text-xs text-slate-600 font-mono">
            Total Lote: {quantity.toLocaleString('es-MX')} Unidades
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-mono text-[11px] border-b border-slate-200 uppercase font-semibold">
              <tr>
                <th className="py-2.5 px-3">Materia Prima / Insumo BOM</th>
                <th className="py-2.5 px-3 text-right">Requerimiento Neto</th>
                <th className="py-2.5 px-3 text-right">Merma Técnica</th>
                <th className="py-2.5 px-3 text-right">Volumen Bruto a Adquirir</th>
                <th className="py-2.5 px-3 text-right">Costo Unitario</th>
                <th className="py-2.5 px-3 text-right">Subtotal Insumo</th>
                <th className="py-2.5 px-3">Partida</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-900">
              {currentExplosion.componentsExplosion.map((cmp, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80">
                  <td className="py-2.5 px-3 font-semibold text-slate-900">
                    {cmp.name}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-700">
                    {cmp.netRequired.toLocaleString('es-MX', { maximumFractionDigits: 1 })} {cmp.unit}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums text-amber-800 font-medium">
                    +{cmp.wasteAmount.toLocaleString('es-MX', { maximumFractionDigits: 1 })} {cmp.unit}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums text-blue-900 font-bold">
                    {cmp.grossRequired.toLocaleString('es-MX', { maximumFractionDigits: 1 })} {cmp.unit}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-600">
                    ${cmp.unitCost.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-900 font-bold">
                    ${cmp.totalCost.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-600 font-medium">
                    {cmp.partida}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Financial Ledger & Budget Allocation Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Cost Breakdown */}
        <div className="p-4 rounded-lg border border-slate-200 bg-white space-y-2.5 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-900 font-bold uppercase pb-2 border-b border-slate-200">
            <DollarSign className="w-4 h-4 text-emerald-700" />
            <span>Estructura de Costeo Directo e Indirecto</span>
          </div>

          <div className="flex justify-between text-xs py-1 text-slate-700">
            <span>Materia Prima Bruta (con merma):</span>
            <span className="font-mono tabular-nums font-bold text-slate-900">
              ${currentExplosion.totalDirectMaterialCost.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex justify-between text-xs py-1 text-slate-700">
            <span>Mano de Obra Maestranza ({currentExplosion.totalLaborHours.toLocaleString('es-MX')} HH):</span>
            <span className="font-mono tabular-nums font-bold text-slate-900">
              ${currentExplosion.totalLaborCost.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex justify-between text-xs py-1 text-slate-700">
            <span>Costos Indirectos de Fabricación ({(selectedProduct.indirectCostRate * 100).toFixed(0)}%):</span>
            <span className="font-mono tabular-nums font-bold text-slate-900">
              ${currentExplosion.indirectCost.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex justify-between text-sm pt-2 border-t border-slate-200 font-bold text-emerald-800">
            <span>Costo Total del Lote:</span>
            <span className="font-mono tabular-nums">
              ${currentExplosion.totalProductionCost.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
            </span>
          </div>
        </div>

        {/* Budget Allocation */}
        <div className="p-4 rounded-lg border border-slate-200 bg-white space-y-2.5 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-900 font-bold uppercase pb-2 border-b border-slate-200">
            <FileCheck2 className="w-4 h-4 text-blue-800" />
            <span>Afectación Presupuestal Automática</span>
          </div>

          <div className="text-xs text-slate-500 font-mono font-semibold">
            PARTIDA FEDERAL DE GASTO PÚBLICO:
          </div>
          <div className="text-base font-bold text-blue-900 font-mono">
            {currentExplosion.partidaAfectada} — {selectedProduct.category === 'UNIFORMES' ? 'Vestuario y Uniformes' : 'Muebles de Oficina y Alojamiento'}
          </div>

          <div className="text-xs text-slate-700">
            Costo Unitario Resultante:
            <span className="font-mono font-bold text-slate-900 ml-1.5 tabular-nums">
              ${currentExplosion.costPerUnit.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN / unidad
            </span>
          </div>

          <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-200">
            * Se reserva automáticamente el techo presupuestal asignado al Programa de Fabricación 2026.
          </div>
        </div>

        {/* Action Button */}
        <div className="p-4 rounded-lg border border-blue-300 bg-blue-50/50 flex flex-col justify-between space-y-3 shadow-xs">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-blue-900 font-bold uppercase">
              <Hammer className="w-4 h-4 text-blue-800" />
              <span>Aprobación y Emisión de Orden de Taller</span>
            </div>
            <p className="text-xs text-slate-700 mt-2 leading-relaxed">
              Emite la orden de trabajo para Maestranza Central, genera las órdenes de compra automáticas de materia prima (OCMP) y afecta el libro mayor presupuestal.
            </p>
          </div>

          <button
            onClick={handleLaunchProduction}
            className="w-full py-2.5 px-4 rounded bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-xs flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Emitir Orden de Producción ({quantity.toLocaleString('es-MX')} u)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
