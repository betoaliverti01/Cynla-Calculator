/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { 
  Download, 
  Terminal, 
  CheckCircle, 
  BookOpen, 
  History as HistoryIcon,
  HelpCircle,
  Cpu,
  Layers,
  Code2
} from 'lucide-react';
import { CynlaCalculator } from './components/CynlaCalculator';
import { PythonInspector } from './components/PythonInspector';
import { TestRunner } from './components/TestRunner';
import { EducationalGuide } from './components/EducationalGuide';
import { HistoryPanel } from './components/HistoryPanel';
import { CynlaEngine } from './cynlaEngine';
import { CalculatorState, HistoryItem, TestCase } from './types';
import { CYNLA_PYTHON_CODE } from './pythonCode';

export default function App() {
  const engineRef = useRef(new CynlaEngine());
  const [calcState, setCalcState] = useState<CalculatorState>(() => engineRef.current.getState());
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeSideTab, setActiveSideTab] = useState<'inspector' | 'tests' | 'history'>('inspector');
  const [isAutoTesting, setIsAutoTesting] = useState(false);

  // Manipuladores de ação na calculadora
  const handleDigit = (d: number) => {
    const nextState = engineRef.current.adicionarDigito(d);
    setCalcState(nextState);
  };

  const handleOperator = (op: string) => {
    const nextState = engineRef.current.definirOperacao(op);
    setCalcState(nextState);
  };

  const handleEquals = () => {
    const res = engineRef.current.calcularResultado();
    setCalcState(res.state);

    if (res.historicoItem) {
      setHistory((prev) => [
        {
          id: Math.random().toString(36).substring(2, 9),
          expressao: res.historicoItem!.expressao,
          resultado: res.historicoItem!.resultado,
          data: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        },
        ...prev.slice(0, 19),
      ]);
    }
  };

  const handleClear = () => {
    const nextState = engineRef.current.reiniciar();
    setCalcState(nextState);
  };

  const handleBackspace = () => {
    const nextState = engineRef.current.apagarUltimo();
    setCalcState(nextState);
  };

  const handleDecimal = () => {
    const nextState = engineRef.current.adicionarSeparador();
    setCalcState(nextState);
  };

  const handleToggleSign = () => {
    const nextState = engineRef.current.inverterSinal();
    setCalcState(nextState);
  };

  // Executa teste interativo simulando digitação no visor físico
  const handleRunTestOnCalculator = (test: TestCase) => {
    setIsAutoTesting(true);
    handleClear();

    setTimeout(() => {
      // 1. Número 1
      const num1Str = test.num1.toString();
      if (test.num1 < 0) {
        // Trata negativo
        const pos = Math.abs(test.num1).toString();
        for (const ch of pos) {
          if (ch === '.') engineRef.current.adicionarSeparador();
          else engineRef.current.adicionarDigito(parseInt(ch, 10));
        }
        engineRef.current.inverterSinal();
      } else {
        for (const ch of num1Str) {
          if (ch === '.') engineRef.current.adicionarSeparador();
          else engineRef.current.adicionarDigito(parseInt(ch, 10));
        }
      }
      setCalcState(engineRef.current.getState());

      setTimeout(() => {
        // 2. Operador
        engineRef.current.definirOperacao(test.op);
        setCalcState(engineRef.current.getState());

        setTimeout(() => {
          // 3. Número 2
          const num2Str = test.num2.toString();
          for (const ch of num2Str) {
            if (ch === '.') engineRef.current.adicionarSeparador();
            else engineRef.current.adicionarDigito(parseInt(ch, 10));
          }
          setCalcState(engineRef.current.getState());

          setTimeout(() => {
            // 4. Igual
            handleEquals();
            setIsAutoTesting(false);
          }, 400);
        }, 400);
      }, 400);
    }, 200);
  };

  const handleDownloadCode = () => {
    const blob = new Blob([CYNLA_PYTHON_CODE], { type: 'text/x-python;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cynla_calculator.py';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#241F1A] text-neutral-100 flex flex-col font-sans">
      
      {/* Top Bar Contract: 3 zonas (Brand — Nav links — Primary CTA) */}
      <header className="sticky top-0 z-50 bg-[#1A1612]/95 backdrop-blur-md border-b border-[#382F24] px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
          
          {/* Zona 1: Brand title, single line */}
          <div className="flex items-center gap-3 shrink-0">
            <a href="/" className="flex items-center gap-2 group">
              <span className="w-8 h-8 rounded-lg bg-[#D87947] flex items-center justify-center font-bold text-white shadow-xs group-hover:scale-105 transition-transform text-sm font-mono">
                CN
              </span>
              <span className="text-lg font-black tracking-wider text-white uppercase whitespace-nowrap">
                CYNLA CALCULATOR
              </span>
            </a>
          </div>

          {/* Zona 2: Nav links, 1-2 words */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-[#BDB09E]">
            <a
              href="#calculadora"
              onClick={() => setActiveSideTab('inspector')}
              className="hover:text-white transition-colors whitespace-nowrap"
            >
              Calculadora
            </a>
            <a
              href="#testes"
              onClick={() => setActiveSideTab('tests')}
              className="hover:text-white transition-colors whitespace-nowrap"
            >
              Testes Oficiais
            </a>
            <a
              href="#guia"
              className="hover:text-white transition-colors whitespace-nowrap"
            >
              Guia Educativo
            </a>
            <a
              href="#codigo"
              className="hover:text-white transition-colors whitespace-nowrap"
            >
              Código Python
            </a>
          </nav>

          {/* Zona 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleDownloadCode}
              className="px-4 py-2 text-xs font-bold text-white bg-[#D87947] hover:bg-[#C26535] rounded-xl transition-all shadow-sm flex items-center gap-1.5 whitespace-nowrap cursor-pointer active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar cynla_calculator.py</span>
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        
        {/* Banner Informativo Didático */}
        <div className="bg-[#2D251E] border border-[#483B2E] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#7A8260]/30 border border-[#7A8260]/50 flex items-center justify-center shrink-0">
              <Terminal className="w-5 h-5 text-[#E8C97D]" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Calculadora Vintage em Python 3 com Tkinter
              </h2>
              <p className="text-xs text-[#B8A894] mt-0.5">
                Desenvolvida com a estética clássica dos anos 70/80 e estrutura didática com variáveis, funções, condições e tratamento de erros.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-mono text-[#D87947] bg-[#1E1914] px-3 py-1.5 rounded-lg border border-[#3E3225]">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Arquivo: cynla_calculator.py</span>
          </div>
        </div>

        {/* Grade Principal: Calculadora Física (Esquerda) + Painel Didático/Testes (Direita) */}
        <section id="calculadora" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Coluna Esquerda: O Equipamento Físico Vintage (5 colunas) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <CynlaCalculator
              state={calcState}
              onDigit={handleDigit}
              onOperator={handleOperator}
              onEquals={handleEquals}
              onClear={handleClear}
              onBackspace={handleBackspace}
              onDecimal={handleDecimal}
              onToggleSign={handleToggleSign}
              activeTestRunning={isAutoTesting}
            />

            {/* Dica de teclado */}
            <p className="text-[11px] text-[#8C7D6D] text-center mt-3 font-mono">
              Suporta teclado numérico físico (0-9, +, -, *, /, Enter, Backspace, Esc)
            </p>
          </div>

          {/* Coluna Direita: Painel Interativo com Abas (7 colunas) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            
            {/* Seletor de visualização lateral */}
            <div className="flex items-center gap-1 p-1 bg-[#1A1612] rounded-xl border border-[#3A3024] self-start">
              <button
                onClick={() => setActiveSideTab('inspector')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeSideTab === 'inspector'
                    ? 'bg-[#3A3024] text-white shadow-xs'
                    : 'text-[#A89885] hover:text-white'
                }`}
              >
                <Cpu className="w-3.5 h-3.5 text-[#E8C97D]" />
                Inspetor de Memória Python
              </button>

              <button
                onClick={() => setActiveSideTab('tests')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeSideTab === 'tests'
                    ? 'bg-[#3A3024] text-white shadow-xs'
                    : 'text-[#A89885] hover:text-white'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5 text-[#7A8260]" />
                Testes Oficiais (Seção 9)
              </button>

              <button
                onClick={() => setActiveSideTab('history')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeSideTab === 'history'
                    ? 'bg-[#3A3024] text-white shadow-xs'
                    : 'text-[#A89885] hover:text-white'
                }`}
              >
                <HistoryIcon className="w-3.5 h-3.5 text-[#D87947]" />
                Fita Retrô ({history.length})
              </button>
            </div>

            {/* Painéis */}
            <div className="min-h-[460px]">
              {activeSideTab === 'inspector' && (
                <PythonInspector state={calcState} />
              )}
              {activeSideTab === 'tests' && (
                <TestRunner
                  onRunTestOnCalculator={handleRunTestOnCalculator}
                  onClear={handleClear}
                />
              )}
              {activeSideTab === 'history' && (
                <HistoryPanel
                  items={history}
                  onClearHistory={() => setHistory([])}
                  onSelectResult={(val) => {
                    const num = parseFloat(val);
                    if (!isNaN(num)) {
                      handleClear();
                      const str = num.toString();
                      for (const c of str) {
                        if (c === '.') handleDecimal();
                        else handleDigit(parseInt(c, 10));
                      }
                    }
                  }}
                />
              )}
            </div>
          </div>
        </section>

        {/* Seção Didática: As 4 Perguntas, Código Fonte e Execução */}
        <section id="guia" className="pt-6">
          <EducationalGuide />
        </section>
      </main>

      {/* Rodapé institucional sutil */}
      <footer className="mt-12 border-t border-[#382F24] bg-[#16120E] py-6 text-xs text-[#8A7C6B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#E8C97D]">CYNLA CALCULATOR</span>
            <span>·</span>
            <span>Vintage Digital Calculator</span>
            <span>·</span>
            <span>Python 3 & Tkinter</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Paleta: Bege Creme, Marrom Escuro, Verde Oliva, Laranja Queimado, Amarelo Pastel e Verde LCD</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
