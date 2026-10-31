import React from 'react';
import { History, Trash2, Clock } from 'lucide-react';
import { HistoryItem } from '../types';

interface HistoryPanelProps {
  items: HistoryItem[];
  onClearHistory: () => void;
  onSelectResult: (valor: string) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  items,
  onClearHistory,
  onSelectResult,
}) => {
  return (
    <div className="bg-[#1E1A16] border border-[#3E352B] rounded-2xl p-5 text-neutral-200 shadow-xl flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-[#3E352B] mb-3">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-[#E8C97D]" />
          <h2 className="text-base font-bold text-white tracking-tight">
            Fita de Papel / Histórico
          </h2>
        </div>
        {items.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-xs text-[#9E9080] hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
            title="Limpar histórico"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Limpar
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="my-auto py-8 text-center text-xs text-[#8A7C6B]">
          <Clock className="w-6 h-6 mx-auto mb-2 opacity-40" />
          <p>Nenhuma operação realizada ainda.</p>
          <p className="text-[11px] text-[#6E6254] mt-1">
            Os cálculos feitos na calculadora aparecerão aqui como uma fita retrô.
          </p>
        </div>
      ) : (
        <div className="space-y-2 overflow-y-auto max-h-[280px] pr-1">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectResult(item.resultado)}
              className="p-2.5 bg-[#251F19] hover:bg-[#2F2720] rounded-xl border border-[#382E24] cursor-pointer transition-colors group flex items-center justify-between text-xs font-mono"
            >
              <div className="truncate mr-2">
                <span className="text-[#9E9080] block text-[11px] truncate">
                  {item.expressao} =
                </span>
                <span className="text-sm font-bold text-[#E8C97D] group-hover:text-white transition-colors">
                  {item.resultado}
                </span>
              </div>
              <span className="text-[10px] text-[#6E6254] font-sans shrink-0">
                {item.data}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
