import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, Sparkles, HelpCircle } from 'lucide-react';
import { CalculatorState } from '../types';
import { playVintageClick, toggleAudio, isAudioEnabled } from '../audio';

interface CynlaCalculatorProps {
  state: CalculatorState;
  onDigit: (d: number) => void;
  onOperator: (op: string) => void;
  onEquals: () => void;
  onClear: () => void;
  onBackspace: () => void;
  onDecimal: () => void;
  onToggleSign: () => void;
  activeTestRunning?: boolean;
}

export const CynlaCalculator: React.FC<CynlaCalculatorProps> = ({
  state,
  onDigit,
  onOperator,
  onEquals,
  onClear,
  onBackspace,
  onDecimal,
  onToggleSign,
  activeTestRunning = false,
}) => {
  const [soundOn, setSoundOn] = useState(isAudioEnabled());
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const handleToggleSound = () => {
    const newState = toggleAudio();
    setSoundOn(newState);
  };

  const handlePress = (action: () => void, keyLabel: string, type: 'num' | 'op' | 'equals' | 'clear' = 'num') => {
    playVintageClick(type);
    setPressedKey(keyLabel);
    setTimeout(() => setPressedKey(null), 120);
    action();
  };

  // Suporte a teclado físico do computador
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignora se estiver digitando em campos de texto
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      const key = e.key;
      if (/[0-9]/.test(key)) {
        e.preventDefault();
        handlePress(() => onDigit(parseInt(key, 10)), key, 'num');
      } else if (key === '+') {
        e.preventDefault();
        handlePress(() => onOperator('+'), '+', 'op');
      } else if (key === '-') {
        e.preventDefault();
        handlePress(() => onOperator('−'), '−', 'op');
      } else if (key === '*' || key === 'x' || key === 'X') {
        e.preventDefault();
        handlePress(() => onOperator('×'), '×', 'op');
      } else if (key === '/') {
        e.preventDefault();
        handlePress(() => onOperator('÷'), '÷', 'op');
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        handlePress(onEquals, '=', 'equals');
      } else if (key === 'Backspace') {
        e.preventDefault();
        handlePress(onBackspace, '⌫', 'num');
      } else if (key === 'Escape' || key === 'c' || key === 'C') {
        e.preventDefault();
        handlePress(onClear, 'C', 'clear');
      } else if (key === '.' || key === ',') {
        e.preventDefault();
        handlePress(onDecimal, '.', 'num');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onDigit, onOperator, onEquals, onClear, onBackspace, onDecimal]);

  return (
    <div className="relative mx-auto w-full max-w-[390px] select-none">
      {/* Gabinete / Chassi Vintage Retrô dos anos 70/80 */}
      <div className="retro-chassis rounded-3xl p-6 sm:p-7 border-2 border-[#D9CEB2]">
        
        {/* Topo do Hardware: Marca, Subtítulo e Painel Solar */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-wider text-[#40372F] uppercase drop-shadow-xs">
                CYNLA CALCULATOR
              </h1>
            </div>
            <p className="text-[11px] font-semibold tracking-wide text-[#706254] uppercase">
              Vintage Digital Calculator
            </p>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            {/* Célula Solar Retrô (4 divisões fotovoltaicas escuras) */}
            <div className="flex items-center gap-1 bg-[#1E1914] p-1 rounded-sm border border-[#524436] shadow-inner">
              <div className="w-3.5 h-6 bg-[#342D24] border-r border-[#1E1914]"></div>
              <div className="w-3.5 h-6 bg-[#342D24] border-r border-[#1E1914]"></div>
              <div className="w-3.5 h-6 bg-[#342D24] border-r border-[#1E1914]"></div>
              <div className="w-3.5 h-6 bg-[#342D24]"></div>
            </div>

            {/* Controle de som tátil */}
            <button
              onClick={handleToggleSound}
              title={soundOn ? 'Desativar som de clique mecânico' : 'Ativar som de clique mecânico'}
              className="flex items-center gap-1 text-[10px] font-medium text-[#706254] hover:text-[#40372F] transition-colors py-0.5 px-1.5 rounded bg-[#E4D8BD]/60 hover:bg-[#E4D8BD]"
            >
              {soundOn ? <Volume2 className="w-3 h-3 text-[#D87947]" /> : <VolumeX className="w-3 h-3 text-[#9E9080]" />}
              <span>{soundOn ? 'Clique ON' : 'Mudo'}</span>
            </button>
          </div>
        </div>

        {/* Visor Digital LCD com bisel embutido */}
        <div className="mb-6 p-2 bg-[#2D261F] rounded-xl shadow-[inset_0_3px_5px_rgba(0,0,0,0.6)] border-b border-[#FAF6ED]/30">
          <div className="retro-lcd-screen rounded-lg p-3.5 sm:p-4 text-right overflow-hidden min-h-[92px] flex flex-col justify-between">
            
            {/* Linha superior: Expressão em andamento e indicador de operação ativa */}
            <div className="flex items-center justify-between text-xs sm:text-sm font-lcd text-[#4D5E3B] font-medium tracking-wide">
              <div className="flex items-center gap-1.5">
                {state.operacao && (
                  <span className="bg-[#4D5E3B]/20 px-1.5 py-0.5 rounded text-[11px] font-bold text-[#2A3420]">
                    OP: {state.operacao}
                  </span>
                )}
                {state.erro && (
                  <span className="bg-[#8B3A2B]/20 text-[#6B281B] px-1.5 py-0.5 rounded text-[10px] font-bold uppercase animate-pulse">
                    ERRO
                  </span>
                )}
              </div>
              <div className="truncate max-w-[200px] text-[#3D4C2D]">
                {state.displayFormula || ' '}
              </div>
            </div>

            {/* Linha Principal: Números em fonte LCD retrô com dígitos grandes */}
            <div className="font-lcd text-[#18210F] text-3xl sm:text-4xl tracking-wider font-bold drop-shadow-xs truncate overflow-x-auto select-all">
              {state.displayPrincipal}
            </div>
          </div>
        </div>

        {/* Teclado da Calculadora — Grid 4 colunas com relevo 3D físico */}
        <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
          
          {/* Linha 0: C, ⌫, +/-, ÷ */}
          <button
            onClick={() => handlePress(onClear, 'C', 'clear')}
            className={`h-13 sm:h-14 rounded-xl font-bold text-lg bg-[#7A8260] text-white vintage-key-shadow-olive flex items-center justify-center cursor-pointer active:brightness-95 ${
              pressedKey === 'C' ? 'translate-y-1 brightness-90 shadow-none' : ''
            }`}
            title="Limpar tudo (Reiniciar estado)"
          >
            C
          </button>

          <button
            onClick={() => handlePress(onBackspace, '⌫', 'num')}
            className={`h-13 sm:h-14 rounded-xl font-bold text-lg bg-[#E8C97D] text-[#40372F] vintage-key-shadow-yellow flex items-center justify-center cursor-pointer active:brightness-95 ${
              pressedKey === '⌫' ? 'translate-y-1 brightness-90 shadow-none' : ''
            }`}
            title="Apagar último caractere"
          >
            ⌫
          </button>

          <button
            onClick={() => handlePress(onToggleSign, '+/−', 'num')}
            className={`h-13 sm:h-14 rounded-xl font-bold text-base sm:text-lg bg-[#E8C97D] text-[#40372F] vintage-key-shadow-yellow flex items-center justify-center cursor-pointer active:brightness-95 ${
              pressedKey === '+/−' ? 'translate-y-1 brightness-90 shadow-none' : ''
            }`}
            title="Inverter sinal (+/-)"
          >
            +/−
          </button>

          <button
            onClick={() => handlePress(() => onOperator('÷'), '÷', 'op')}
            className={`h-13 sm:h-14 rounded-xl font-bold text-2xl bg-[#D87947] text-white vintage-key-shadow-accent flex items-center justify-center cursor-pointer active:brightness-95 ${
              pressedKey === '÷' || (state.operacao === '÷' && state.novoNumero)
                ? 'ring-2 ring-[#40372F] translate-y-0.5'
                : ''
            }`}
            title="Divisão"
          >
            ÷
          </button>

          {/* Linha 1: 7, 8, 9, × */}
          {[7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handlePress(() => onDigit(num), num.toString(), 'num')}
              className={`h-13 sm:h-14 rounded-xl font-bold text-xl sm:text-2xl bg-[#FAF6ED] text-[#2C251E] vintage-key-shadow flex items-center justify-center cursor-pointer hover:bg-white active:brightness-95 ${
                pressedKey === num.toString() ? 'translate-y-1 brightness-90 shadow-none' : ''
              }`}
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => handlePress(() => onOperator('×'), '×', 'op')}
            className={`h-13 sm:h-14 rounded-xl font-bold text-2xl bg-[#D87947] text-white vintage-key-shadow-accent flex items-center justify-center cursor-pointer active:brightness-95 ${
              pressedKey === '×' || (state.operacao === '×' && state.novoNumero)
                ? 'ring-2 ring-[#40372F] translate-y-0.5'
                : ''
            }`}
            title="Multiplicação"
          >
            ×
          </button>

          {/* Linha 2: 4, 5, 6, − */}
          {[4, 5, 6].map((num) => (
            <button
              key={num}
              onClick={() => handlePress(() => onDigit(num), num.toString(), 'num')}
              className={`h-13 sm:h-14 rounded-xl font-bold text-xl sm:text-2xl bg-[#FAF6ED] text-[#2C251E] vintage-key-shadow flex items-center justify-center cursor-pointer hover:bg-white active:brightness-95 ${
                pressedKey === num.toString() ? 'translate-y-1 brightness-90 shadow-none' : ''
              }`}
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => handlePress(() => onOperator('−'), '−', 'op')}
            className={`h-13 sm:h-14 rounded-xl font-bold text-2xl bg-[#D87947] text-white vintage-key-shadow-accent flex items-center justify-center cursor-pointer active:brightness-95 ${
              pressedKey === '−' || (state.operacao === '−' && state.novoNumero)
                ? 'ring-2 ring-[#40372F] translate-y-0.5'
                : ''
            }`}
            title="Subtração"
          >
            −
          </button>

          {/* Linha 3: 1, 2, 3, + */}
          {[1, 2, 3].map((num) => (
            <button
              key={num}
              onClick={() => handlePress(() => onDigit(num), num.toString(), 'num')}
              className={`h-13 sm:h-14 rounded-xl font-bold text-xl sm:text-2xl bg-[#FAF6ED] text-[#2C251E] vintage-key-shadow flex items-center justify-center cursor-pointer hover:bg-white active:brightness-95 ${
                pressedKey === num.toString() ? 'translate-y-1 brightness-90 shadow-none' : ''
              }`}
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => handlePress(() => onOperator('+'), '+', 'op')}
            className={`h-13 sm:h-14 rounded-xl font-bold text-2xl bg-[#D87947] text-white vintage-key-shadow-accent flex items-center justify-center cursor-pointer active:brightness-95 ${
              pressedKey === '+' || (state.operacao === '+' && state.novoNumero)
                ? 'ring-2 ring-[#40372F] translate-y-0.5'
                : ''
            }`}
            title="Adição"
          >
            +
          </button>

          {/* Linha 4: 0 (duplo), ., = */}
          <button
            onClick={() => handlePress(() => onDigit(0), '0', 'num')}
            className={`col-span-2 h-13 sm:h-14 rounded-xl font-bold text-xl sm:text-2xl bg-[#FAF6ED] text-[#2C251E] vintage-key-shadow flex items-center justify-center cursor-pointer hover:bg-white active:brightness-95 ${
              pressedKey === '0' ? 'translate-y-1 brightness-90 shadow-none' : ''
            }`}
          >
            0
          </button>

          <button
            onClick={() => handlePress(onDecimal, '.', 'num')}
            className={`h-13 sm:h-14 rounded-xl font-bold text-2xl bg-[#FAF6ED] text-[#2C251E] vintage-key-shadow flex items-center justify-center cursor-pointer hover:bg-white active:brightness-95 ${
              pressedKey === '.' ? 'translate-y-1 brightness-90 shadow-none' : ''
            }`}
            title="Ponto decimal"
          >
            .
          </button>

          <button
            onClick={() => handlePress(onEquals, '=', 'equals')}
            className={`h-13 sm:h-14 rounded-xl font-bold text-3xl bg-[#D87947] text-white vintage-key-shadow-accent flex items-center justify-center cursor-pointer active:brightness-95 ${
              pressedKey === '=' ? 'translate-y-1 brightness-90 shadow-none ring-2 ring-white' : ''
            }`}
            title="Calcular resultado (=)"
          >
            =
          </button>
        </div>

        {/* Rodapé do equipamento físico */}
        <div className="mt-5 pt-3 border-t border-[#D9CEB2] flex items-center justify-between text-[11px] text-[#706254]">
          <span className="font-mono">MODEL: CN-1982</span>
          <span className="font-medium">DUAL POWER · 8 DIGIT LCD</span>
        </div>
      </div>
    </div>
  );
};
