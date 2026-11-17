import React from 'react';
import { Anchor, ShieldAlert, MapPin, Shirt, Crosshair } from 'lucide-react';

export type AppTab =
  | 'paa'
  | 'uniformes'
  | 'armamento'
  | 'mapa'
  | 'auditoria'
  | 'mando'
  | 'mrp'
  | 'custodia'
  | 'mantenimiento'
  | 'navegaciones';

interface TopNavProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  onOpenNewDirective: () => void;
  pendingAlertsCount: number;
  onLogoClick?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewDirective,
  pendingAlertsCount,
  onLogoClick
}) => {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-50 shadow-xs">
      <div className="flex items-center justify-between gap-6 px-6 py-3">
        {/* Zone 1: Single text element wordmark (returns to Portada / Top) */}
        <a
          href="#portada"
          onClick={(e) => {
            e.preventDefault();
            if (onLogoClick) {
              onLogoClick();
            } else {
              setActiveTab('paa');
            }
          }}
          className="flex items-center gap-2.5 text-slate-900 font-bold tracking-tight text-base whitespace-nowrap shrink-0 group cursor-pointer"
          title="Volver a Portada Principal POSEIDÓN-LOG"
        >
          <span className="p-1.5 rounded bg-blue-950 text-white group-hover:bg-blue-900 transition-colors shadow-xs">
            <Anchor className="w-4 h-4" />
          </span>
          <span className="font-mono font-bold tracking-tight text-slate-900">POSEIDÓN-LOG</span>
        </a>

        {/* Zone 2: Navigation Links (Desktop & Wide Screens) */}
        <nav className="hidden md:flex items-center gap-3.5 text-xs font-semibold text-slate-600 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('paa')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-1 cursor-pointer ${
              activeTab === 'paa'
                ? 'text-blue-900 border-b-2 border-blue-900 font-bold'
                : 'hover:text-slate-900'
            }`}
          >
            Necesidades & PAA
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('uniformes')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-1 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'uniformes'
                ? 'text-blue-900 border-b-2 border-blue-900 font-bold'
                : 'hover:text-slate-900 text-blue-950 font-semibold'
            }`}
          >
            <Shirt className="w-3.5 h-3.5 text-blue-800" />
            <span>Uniformes</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('armamento')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-1 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'armamento'
                ? 'text-blue-900 border-b-2 border-blue-900 font-bold'
                : 'hover:text-slate-900 text-blue-950 font-semibold'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5 text-blue-800" />
            <span>Armamento</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('mapa')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-1 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'mapa'
                ? 'text-blue-900 border-b-2 border-blue-900 font-bold'
                : 'hover:text-slate-900 text-cyan-900 font-semibold'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-blue-800" />
            <span>Mapa Táctico ZEE</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('auditoria')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-1 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'auditoria'
                ? 'text-blue-900 border-b-2 border-blue-900 font-bold'
                : 'hover:text-slate-900 text-amber-900 font-semibold'
            }`}
          >
            <span>Auditoría & Discrepancias</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('mando')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-1 cursor-pointer ${
              activeTab === 'mando'
                ? 'text-blue-900 border-b-2 border-blue-900 font-bold'
                : 'hover:text-slate-900'
            }`}
          >
            Consola de Mando
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('mrp')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-1 cursor-pointer ${
              activeTab === 'mrp'
                ? 'text-blue-900 border-b-2 border-blue-900 font-bold'
                : 'hover:text-slate-900'
            }`}
          >
            MRP & Maestranza
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('custodia')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-1 cursor-pointer ${
              activeTab === 'custodia'
                ? 'text-blue-900 border-b-2 border-blue-900 font-bold'
                : 'hover:text-slate-900'
            }`}
          >
            Custodia & Dotación
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('mantenimiento')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-1 cursor-pointer ${
              activeTab === 'mantenimiento'
                ? 'text-blue-900 border-b-2 border-blue-900 font-bold'
                : 'hover:text-slate-900'
            }`}
          >
            Flota Naval & Dique
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('navegaciones')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-1 cursor-pointer ${
              activeTab === 'navegaciones'
                ? 'text-blue-900 border-b-2 border-blue-900 font-bold'
                : 'hover:text-slate-900'
            }`}
          >
            10 Navegaciones
          </button>
        </nav>

        {/* Zone 3: Primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {pendingAlertsCount > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab('auditoria')}
              className="hidden lg:flex items-center gap-1.5 text-xs text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2 py-0.5 rounded font-mono font-medium transition-colors cursor-pointer"
              title="Ir a Auditoría y Alertas Críticas"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              <span>{pendingAlertsCount} Alertas Críticas</span>
            </button>
          )}
          <button
            type="button"
            onClick={onOpenNewDirective}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded transition-colors whitespace-nowrap shrink-0 shadow-xs active:translate-y-0.5 cursor-pointer"
          >
            Nueva Directiva Táctica
          </button>
        </div>
      </div>

      {/* Mobile / Compact Viewport Horizontal Tab Bar */}
      <nav className="flex md:hidden items-center gap-3 px-4 py-2 border-t border-slate-100 bg-slate-50/90 overflow-x-auto text-xs font-semibold text-slate-600">
        <button
          type="button"
          onClick={() => setActiveTab('paa')}
          className={`whitespace-nowrap shrink-0 pb-0.5 cursor-pointer ${
            activeTab === 'paa' ? 'text-blue-900 border-b-2 border-blue-900 font-bold' : ''
          }`}
        >
          Necesidades & PAA
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('uniformes')}
          className={`whitespace-nowrap shrink-0 pb-0.5 flex items-center gap-1 cursor-pointer ${
            activeTab === 'uniformes' ? 'text-blue-900 border-b-2 border-blue-900 font-bold' : ''
          }`}
        >
          <Shirt className="w-3 h-3 text-blue-800" />
          <span>Uniformes</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('armamento')}
          className={`whitespace-nowrap shrink-0 pb-0.5 flex items-center gap-1 cursor-pointer ${
            activeTab === 'armamento' ? 'text-blue-900 border-b-2 border-blue-900 font-bold' : ''
          }`}
        >
          <Crosshair className="w-3 h-3 text-blue-800" />
          <span>Armamento</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('mapa')}
          className={`whitespace-nowrap shrink-0 pb-0.5 flex items-center gap-1 cursor-pointer ${
            activeTab === 'mapa' ? 'text-blue-900 border-b-2 border-blue-900 font-bold' : ''
          }`}
        >
          <MapPin className="w-3 h-3 text-blue-800" />
          <span>Mapa ZEE</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('auditoria')}
          className={`whitespace-nowrap shrink-0 pb-0.5 cursor-pointer ${
            activeTab === 'auditoria' ? 'text-blue-900 border-b-2 border-blue-900 font-bold' : ''
          }`}
        >
          Auditoría
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('mando')}
          className={`whitespace-nowrap shrink-0 pb-0.5 cursor-pointer ${
            activeTab === 'mando' ? 'text-blue-900 border-b-2 border-blue-900 font-bold' : ''
          }`}
        >
          Mando
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('mrp')}
          className={`whitespace-nowrap shrink-0 pb-0.5 cursor-pointer ${
            activeTab === 'mrp' ? 'text-blue-900 border-b-2 border-blue-900 font-bold' : ''
          }`}
        >
          MRP
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('custodia')}
          className={`whitespace-nowrap shrink-0 pb-0.5 cursor-pointer ${
            activeTab === 'custodia' ? 'text-blue-900 border-b-2 border-blue-900 font-bold' : ''
          }`}
        >
          Custodia
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('mantenimiento')}
          className={`whitespace-nowrap shrink-0 pb-0.5 cursor-pointer ${
            activeTab === 'mantenimiento' ? 'text-blue-900 border-b-2 border-blue-900 font-bold' : ''
          }`}
        >
          Flota & Dique
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('navegaciones')}
          className={`whitespace-nowrap shrink-0 pb-0.5 cursor-pointer ${
            activeTab === 'navegaciones' ? 'text-blue-900 border-b-2 border-blue-900 font-bold' : ''
          }`}
        >
          10 Navegaciones
        </button>
      </nav>
    </header>
  );
};
