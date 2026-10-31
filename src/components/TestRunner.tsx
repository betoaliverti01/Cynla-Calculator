import React, { useState } from 'react';
import { Play, CheckCircle, XCircle, RotateCcw, Sparkles, Terminal } from 'lucide-react';
import { TESTES_OFICIAIS, executarCalculoPython, formatarNumeroPython } from '../cynlaEngine';
import { TestCase } from '../types';

interface TestRunnerProps {
  onRunTestOnCalculator: (test: TestCase) => void;
  onClear: () => void;
}

export const TestRunner: React.FC<TestRunnerProps> = ({ onRunTestOnCalculator, onClear }) => {
  const [testResults, setTestResults] = useState<Record<string, { status: 'pass' | 'fail' | 'pending'; obtido?: string }>>({});
  const [isRunningAll, setIsRunningAll] = useState(false);

  // Executa os testes unitários da lógica matemática
  const handleRunAllQuickTests = () => {
    setIsRunningAll(true);
    const results: Record<string, { status: 'pass' | 'fail'; obtido: string }> = {};

    TESTES_OFICIAIS.forEach((t) => {
      const calc = executarCalculoPython(t.num1, t.op, t.num2);
      const obtido = typeof calc.resultado === 'string' ? calc.resultado : formatarNumeroPython(calc.resultado);
      const status = obtido === t.esperado ? 'pass' : 'fail';
      results[t.id] = { status, obtido };
    });

    setTestResults(results);
    setIsRunningAll(false);
  };

  const resetTests = () => {
    setTestResults({});
    onClear();
  };

  const todosPassaram =
    Object.keys(testResults).length === TESTES_OFICIAIS.length &&
    Object.values(testResults).every((r) => r.status === 'pass');

  return (
    <div className="bg-[#1E1A16] border border-[#3E352B] rounded-2xl p-5 text-neutral-200 shadow-xl">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#3E352B] gap-3">
        <div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-[#7A8260]" />
            <h2 className="text-base font-bold text-white tracking-tight">
              Bateria de Testes Oficiais (Seção 9)
            </h2>
          </div>
          <p className="text-xs text-[#9E9080] mt-0.5">
            Validação matemática e tratamento de exceções exigidos na especificação.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetTests}
            className="px-3 py-1.5 text-xs font-medium text-[#C4B5A0] hover:text-white bg-[#2A231C] hover:bg-[#382F26] rounded-lg border border-[#4A3D30] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Limpar
          </button>
          <button
            onClick={handleRunAllQuickTests}
            disabled={isRunningAll}
            className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#D87947] hover:bg-[#B85F31] rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Executar Todos os Testes
          </button>
        </div>
      </div>

      {/* Banner de status se todos passaram */}
      {todosPassaram && (
        <div className="mt-4 p-3 bg-emerald-950/60 border border-emerald-600/40 rounded-xl flex items-center gap-2 text-emerald-300 text-xs">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>100% de Aprovação:</strong> Todos os 7 testes oficiais passaram com os resultados esperados, incluindo divisão por zero e números negativos!
          </span>
        </div>
      )}

      {/* Tabela de testes */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#3E352B] text-[#9E9080] font-mono text-[11px] uppercase tracking-wider">
              <th className="py-2.5 px-3">Operação</th>
              <th className="py-2.5 px-3">Resultado Esperado</th>
              <th className="py-2.5 px-3">Resultado Obtido</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2C241D] font-mono">
            {TESTES_OFICIAIS.map((t) => {
              const res = testResults[t.id];
              return (
                <tr key={t.id} className="hover:bg-[#28221B]/60 transition-colors">
                  <td className="py-3 px-3 font-bold text-white">
                    {t.expressao}
                  </td>
                  <td className="py-3 px-3 text-[#E8C97D]">
                    {t.esperado}
                  </td>
                  <td className="py-3 px-3">
                    {res ? (
                      <span className={res.status === 'pass' ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                        {res.obtido}
                      </span>
                    ) : (
                      <span className="text-neutral-500">—</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    {res ? (
                      res.status === 'pass' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-sans font-semibold text-[11px] bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                          <CheckCircle className="w-3 h-3" /> Passou
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-400 font-sans font-semibold text-[11px] bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800">
                          <XCircle className="w-3 h-3" /> Falhou
                        </span>
                      )
                    ) : (
                      <span className="text-neutral-500 font-sans text-[11px]">Pendente</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onRunTestOnCalculator(t)}
                      className="px-2.5 py-1 text-[11px] font-sans font-medium text-[#D87947] hover:text-white bg-[#33271E] hover:bg-[#D87947] rounded transition-colors cursor-pointer"
                      title="Digitar e calcular no visor vintage da Cynla Calculator"
                    >
                      Testar no Visor
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Testes Adicionais da Especificação */}
      <div className="mt-5 pt-4 border-t border-[#3E352B] grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
        <div className="p-3 bg-[#241E18] rounded-xl border border-[#3A3026]">
          <span className="font-bold text-white block mb-0.5">Botão C (Limpar)</span>
          <span className="text-[#9E9080] text-[11px]">Restaura display = "0", zera operando e flags.</span>
        </div>
        <div className="p-3 bg-[#241E18] rounded-xl border border-[#3A3026]">
          <span className="font-bold text-white block mb-0.5">Botão ⌫ (Apagar)</span>
          <span className="text-[#9E9080] text-[11px]">Fatia a string apagando o último caractere digitado.</span>
        </div>
        <div className="p-3 bg-[#241E18] rounded-xl border border-[#3A3026]">
          <span className="font-bold text-white block mb-0.5">Cálculos Consecutivos</span>
          <span className="text-[#9E9080] text-[11px]">Suporte a contas encadeadas (ex: 2 + 3 + 4 = 9).</span>
        </div>
      </div>
    </div>
  );
};
