import React from 'react';
import { Terminal, Cpu, Brackets, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { CalculatorState } from '../types';

interface PythonInspectorProps {
  state: CalculatorState;
}

export const PythonInspector: React.FC<PythonInspectorProps> = ({ state }) => {
  return (
    <div className="bg-[#1E1A16] border border-[#3E352B] rounded-2xl p-5 text-neutral-200 shadow-xl flex flex-col h-full">
      {/* Cabeçalho do Inspetor */}
      <div className="flex items-center justify-between pb-3 border-b border-[#3E352B] mb-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-[#E8C97D]" />
          <h2 className="text-base font-bold tracking-tight text-white">
            Inspetor Didático de Memória (Python)
          </h2>
        </div>
        <span className="text-xs font-mono text-[#D87947] bg-[#2E241B] px-2 py-0.5 rounded border border-[#543C28]">
          Python 3.10
        </span>
      </div>

      {/* Variáveis em tempo real */}
      <div className="mb-5">
        <p className="text-xs uppercase tracking-wider font-semibold text-[#B8A690] mb-2 flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-[#7A8260]" />
          Estado das Variáveis no Código
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          
          {/* primeiro_numero */}
          <div className="bg-[#28221D] p-2.5 rounded-lg border border-[#3D3329]">
            <span className="text-[#9E9080] block text-[11px]">primeiro_numero</span>
            <span className="text-base font-bold text-[#E8C97D]">
              {state.primeiroNumero !== null ? state.primeiroNumero : <span className="text-neutral-500 font-normal">None</span>}
            </span>
          </div>

          {/* operacao */}
          <div className="bg-[#28221D] p-2.5 rounded-lg border border-[#3D3329]">
            <span className="text-[#9E9080] block text-[11px]">operacao</span>
            <span className="text-base font-bold text-[#D87947]">
              {state.operacao ? `"${state.operacao}"` : <span className="text-neutral-500 font-normal">None</span>}
            </span>
          </div>

          {/* display_principal */}
          <div className="bg-[#28221D] p-2.5 rounded-lg border border-[#3D3329]">
            <span className="text-[#9E9080] block text-[11px]">display_principal (visor)</span>
            <span className="text-base font-bold text-[#B8C9A0] truncate block">
              "{state.displayPrincipal}"
            </span>
          </div>

          {/* novo_numero */}
          <div className="bg-[#28221D] p-2.5 rounded-lg border border-[#3D3329]">
            <span className="text-[#9E9080] block text-[11px]">novo_numero (flag)</span>
            <span className={`text-base font-bold ${state.novoNumero ? 'text-emerald-400' : 'text-sky-400'}`}>
              {state.novoNumero ? 'True' : 'False'}
            </span>
          </div>
        </div>
      </div>

      {/* Última Função Executada */}
      <div className="mb-4">
        <p className="text-xs uppercase tracking-wider font-semibold text-[#B8A690] mb-2 flex items-center gap-1.5">
          <Brackets className="w-3.5 h-3.5 text-[#E8C97D]" />
          Função Python Invocada no Evento
        </p>
        <div className="bg-[#12100E] p-3 rounded-lg border border-[#3A3026] font-mono text-xs">
          <div className="text-purple-300 font-semibold flex items-center gap-2">
            <span className="text-neutral-500">&gt;&gt;&gt;</span>
            <span>def {state.funcaoExecutada}</span>
          </div>
        </div>
      </div>

      {/* Avaliação de Condição if / elif / else */}
      <div className="mb-4">
        <p className="text-xs uppercase tracking-wider font-semibold text-[#B8A690] mb-2 flex items-center gap-1.5">
          {state.erro ? (
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5 text-[#7A8260]" />
          )}
          Avaliação da Condição (if / elif / else)
        </p>
        <div className="bg-[#12100E] p-3 rounded-lg border border-[#3A3026] font-mono text-xs text-[#E8C97D] leading-relaxed break-words">
          {state.condicaoAvaliada}
        </div>
      </div>

      {/* Explicador Didático para Iniciantes */}
      <div className="mt-auto bg-[#262019] border border-[#483B2D] rounded-xl p-3 text-xs leading-relaxed text-[#D6CAB8]">
        <span className="font-semibold text-white block mb-1 flex items-center gap-1">
          <ArrowRight className="w-3.5 h-3.5 text-[#D87947]" />
          Como o Python processa esta etapa:
        </span>
        {state.primeiroNumero === null && state.operacao === null && (
          <p>
            A calculadora está pronta recebendo o <strong>primeiro número</strong>. Os dígitos são concatenados como string em <code className="text-[#E8C97D]">display_principal</code>.
          </p>
        )}
        {state.primeiroNumero !== null && state.novoNumero && (
          <p>
            O operador <code className="text-[#D87947]">{state.operacao}</code> foi guardado! O primeiro número (<code className="text-[#E8C97D]">{state.primeiroNumero}</code>) está salvo na memória. Agora comece a digitar o <strong>segundo número</strong>.
          </p>
        )}
        {state.primeiroNumero !== null && !state.novoNumero && (
          <p>
            Você está digitando o <strong>segundo número</strong> (<code className="text-[#B8C9A0]">{state.displayPrincipal}</code>). Ao apertar <code className="text-[#D87947]">=</code> ou outro operador, a função <code className="text-purple-300">executar_calculo()</code> resolverá a conta!
          </p>
        )}
        {state.erro && (
          <p className="text-amber-300">
            Tratamento de exceção acionado! A regra impediu divisão por zero com a mensagem <strong>"Não é possível dividir por zero"</strong> sem travar o aplicativo. Pressione <strong>C</strong> para reiniciar.
          </p>
        )}
      </div>
    </div>
  );
};
