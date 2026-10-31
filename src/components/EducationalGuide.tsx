import React, { useState } from 'react';
import { BookOpen, Code2, Download, Copy, Check, Terminal, HelpCircle, Layers, ArrowRight } from 'lucide-react';
import { CYNLA_PYTHON_CODE } from '../pythonCode';

export const EducationalGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'perguntas' | 'codigo' | 'execucao'>('perguntas');
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(CYNLA_PYTHON_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
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
    <div className="bg-[#1E1A16] border border-[#3E352B] rounded-2xl p-5 sm:p-6 text-neutral-200 shadow-xl">
      {/* Abas Superiores */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#3E352B]">
        <div className="flex items-center gap-1.5 p-1 bg-[#14110E] rounded-xl border border-[#3A3026]">
          <button
            onClick={() => setActiveTab('perguntas')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'perguntas'
                ? 'bg-[#D87947] text-white shadow-sm'
                : 'text-[#A89885] hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 inline mr-1.5" />
            Explicação Educativa (4 Perguntas)
          </button>

          <button
            onClick={() => setActiveTab('codigo')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'codigo'
                ? 'bg-[#D87947] text-white shadow-sm'
                : 'text-[#A89885] hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 inline mr-1.5" />
            Código Fonte Python (cynla_calculator.py)
          </button>

          <button
            onClick={() => setActiveTab('execucao')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'execucao'
                ? 'bg-[#D87947] text-white shadow-sm'
                : 'text-[#A89885] hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 inline mr-1.5" />
            Como Executar no seu Computador
          </button>
        </div>

        {/* Botão de download do .py */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCode}
            className="px-3 py-1.5 text-xs font-medium text-[#C4B5A0] hover:text-white bg-[#28211A] hover:bg-[#342B22] rounded-lg border border-[#44372B] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copiado!' : 'Copiar Código'}</span>
          </button>

          <button
            onClick={handleDownloadFile}
            className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#7A8260] hover:bg-[#656C4E] rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Baixar cynla_calculator.py
          </button>
        </div>
      </div>

      {/* Conteúdo Aba 1: As 4 Perguntas Educativas */}
      {activeTab === 'perguntas' && (
        <div className="mt-5 space-y-6 text-sm text-[#D6CAB8] leading-relaxed">
          
          {/* Pergunta 1 */}
          <div className="bg-[#241E18] p-5 rounded-xl border border-[#3A3026]">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#D87947] text-white text-xs font-bold flex items-center justify-center shrink-0">
                1
              </span>
              Quais são os principais componentes do código gerado?
            </h3>
            <p className="mb-3 text-xs sm:text-sm">
              O projeto foi dividido em camadas lógicas para garantir facilidade de leitura e boas práticas:
            </p>
            <ul className="space-y-2 text-xs sm:text-sm list-disc list-inside text-[#B8A894]">
              <li>
                <strong className="text-white">Biblioteca Gráfica:</strong> Utilizamos a biblioteca nativa <code className="text-[#E8C97D]">tkinter</code>, que já vem embutida no Python e dispensa instalações extras de pacotes externos.
              </li>
              <li>
                <strong className="text-white">Variáveis de Estado:</strong> Guardam os dados em memória enquanto a calculadora é usada (<code className="text-[#E8C97D]">primeiro_numero</code>, <code className="text-[#E8C97D]">operacao</code>, <code className="text-[#E8C97D]">display_principal</code>, <code className="text-[#E8C97D]">novo_numero</code>).
              </li>
              <li>
                <strong className="text-white">Funções de Ação:</strong> Pequenos blocos reutilizáveis que executam ações específicas quando um botão é clicado (ex: <code className="text-purple-300">adicionar_digito()</code>, <code className="text-purple-300">definir_operacao()</code>, <code className="text-purple-300">executar_calculo()</code>).
              </li>
              <li>
                <strong className="text-white">Estruturas Condicionais:</strong> Blocos <code className="text-purple-300">if / elif / else</code> que tomam decisões conforme a operação matemática ou o caractere pressionado.
              </li>
              <li>
                <strong className="text-white">Elementos da Interface (Widgets):</strong> Janela (<code className="text-[#7A8260]">Tk</code>), molduras retrô (<code className="text-[#7A8260]">Frame</code>), visor LCD (<code className="text-[#7A8260]">Label</code>) e teclas físicas (<code className="text-[#7A8260]">Button</code>).
              </li>
            </ul>
          </div>

          {/* Pergunta 2 */}
          <div className="bg-[#241E18] p-5 rounded-xl border border-[#3A3026]">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#D87947] text-white text-xs font-bold flex items-center justify-center shrink-0">
                2
              </span>
              Como a aplicação recebe os números e identifica a operação escolhida?
            </h3>
            <p className="mb-3 text-xs sm:text-sm">
              O fluxo de entrada e armazenamento acontece em três momentos bem definidos:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs text-[#E8C97D]">
              <div className="bg-[#1B1612] p-3 rounded-lg border border-[#33281E]">
                <strong className="text-white font-sans block mb-1">Passo A: Digitação</strong>
                Quando o usuário clica no botão <code className="text-[#D87947]">[7]</code>, o Tkinter aciona a função através do evento de clique (<code className="text-purple-300">command=lambda: clique_numero(7)</code>). O texto do visor concatena o número "7".
              </div>
              <div className="bg-[#1B1612] p-3 rounded-lg border border-[#33281E]">
                <strong className="text-white font-sans block mb-1">Passo B: Operação</strong>
                Ao pressionar <code className="text-[#D87947]">[+]</code>, a calculadora converte o texto atual em float, guarda na variável <code className="text-emerald-300">primeiro_numero = 10.0</code> e armazena <code className="text-amber-300">operacao = "+"</code>.
              </div>
              <div className="bg-[#1B1612] p-3 rounded-lg border border-[#33281E]">
                <strong className="text-white font-sans block mb-1">Passo C: Segundo Número</strong>
                A variável <code className="text-sky-300">novo_numero</code> vira <code className="text-sky-300">True</code>. Assim, o próximo clique (ex: "5") limpa o visor e começa a receber o segundo valor sem apagar o que já foi salvo.
              </div>
            </div>
          </div>

          {/* Pergunta 3 */}
          <div className="bg-[#241E18] p-5 rounded-xl border border-[#3A3026]">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#D87947] text-white text-xs font-bold flex items-center justify-center shrink-0">
                3
              </span>
              Como a lógica de programação realiza os cálculos e apresenta no visor?
            </h3>
            <p className="mb-3 text-xs sm:text-sm">
              Quando o botão de igual (<code className="text-[#D87947]">=</code>) é pressionado, a função <code className="text-purple-300">executar_calculo()</code> é invocada recebendo três argumentos: <code className="text-[#E8C97D]">(num1, operacao, num2)</code>:
            </p>
            <div className="bg-[#12100E] p-3.5 rounded-lg border border-[#3A3026] font-mono text-xs leading-relaxed mb-3">
              <span className="text-purple-400">if</span> op == <span className="text-amber-300">"+"</span>:<br />
              &nbsp;&nbsp;&nbsp;&nbsp;resultado = num1 + num2<br />
              <span className="text-purple-400">elif</span> op <span className="text-purple-400">in</span> (<span className="text-amber-300">"−"</span>, <span className="text-amber-300">"-"</span>):<br />
              &nbsp;&nbsp;&nbsp;&nbsp;resultado = num1 - num2<br />
              <span className="text-purple-400">elif</span> op <span className="text-purple-400">in</span> (<span className="text-amber-300">"×"</span>, <span className="text-amber-300">"*"</span>):<br />
              &nbsp;&nbsp;&nbsp;&nbsp;resultado = num1 * num2<br />
              <span className="text-purple-400">elif</span> op <span className="text-purple-400">in</span> (<span className="text-amber-300">"÷"</span>, <span className="text-amber-300">"/"</span>):<br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">if</span> num2 == <span className="text-amber-300">0</span>:<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">return</span> <span className="text-rose-300">"Não é possível dividir por zero"</span><br />
              &nbsp;&nbsp;&nbsp;&nbsp;resultado = num1 / num2
            </div>
            <p className="text-xs sm:text-sm text-[#B8A894]">
              Em seguida, a função <code className="text-purple-300">formatar_numero(resultado)</code> elimina zeros à direita redundantes (ex: <code className="text-white">4.0</code> é convertido de forma elegante para <code className="text-white">"4"</code>) e atualiza o visor LCD.
            </p>
          </div>

          {/* Pergunta 4 */}
          <div className="bg-[#241E18] p-5 rounded-xl border border-[#3A3026]">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#D87947] text-white text-xs font-bold flex items-center justify-center shrink-0">
                4
              </span>
              Quais variáveis, funções e condições foram utilizadas? (Exemplos reais)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-[#181410] p-3 rounded-lg border border-[#31261C]">
                <strong className="text-white font-semibold block mb-1.5 flex items-center gap-1">
                  <span className="text-[#E8C97D]">●</span> Variáveis Reais
                </strong>
                <ul className="space-y-1 font-mono text-[#D6CAB8] text-[11px]">
                  <li><code className="text-[#E8C97D]">primeiro_numero</code>: guarda o 1º número float.</li>
                  <li><code className="text-[#E8C97D]">operacao</code>: string ('+', '−', '×', '÷').</li>
                  <li><code className="text-[#E8C97D]">display_principal</code>: string exibida no LCD.</li>
                  <li><code className="text-[#E8C97D]">novo_numero</code>: boolean (True/False).</li>
                  <li><code className="text-[#E8C97D]">erro</code>: flag para bloquear novos cálculos.</li>
                </ul>
              </div>

              <div className="bg-[#181410] p-3 rounded-lg border border-[#31261C]">
                <strong className="text-white font-semibold block mb-1.5 flex items-center gap-1">
                  <span className="text-[#D87947]">●</span> Funções Reais
                </strong>
                <ul className="space-y-1 font-mono text-[#D6CAB8] text-[11px]">
                  <li><code className="text-purple-300">executar_calculo()</code>: realiza a matemática.</li>
                  <li><code className="text-purple-300">formatar_numero()</code>: remove decimais extras.</li>
                  <li><code className="text-purple-300">adicionar_digito()</code>: digita 0 a 9.</li>
                  <li><code className="text-purple-300">apagar_ultimo()</code>: botão de backspace ⌫.</li>
                  <li><code className="text-purple-300">reiniciar()</code>: botão C de limpar tudo.</li>
                </ul>
              </div>

              <div className="bg-[#181410] p-3 rounded-lg border border-[#31261C]">
                <strong className="text-white font-semibold block mb-1.5 flex items-center gap-1">
                  <span className="text-[#7A8260]">●</span> Condições Reais
                </strong>
                <ul className="space-y-1 font-mono text-[#D6CAB8] text-[11px]">
                  <li><code className="text-amber-300">if op == "+"</code>: soma os operandos.</li>
                  <li><code className="text-amber-300">elif op in ("÷", "/")</code>: divisão.</li>
                  <li><code className="text-rose-400">if num2 == 0</code>: intercepta divisão por zero.</li>
                  <li><code className="text-amber-300">if "." not in display</code>: evita duplo ponto.</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Conteúdo Aba 2: Código Fonte Python */}
      {activeTab === 'codigo' && (
        <div className="mt-5">
          <div className="flex items-center justify-between mb-3 text-xs text-[#9E9080]">
            <span className="font-mono">cynla_calculator.py (Código autêntico e completo para Python 3 + Tkinter)</span>
            <span>{CYNLA_PYTHON_CODE.split('\n').length} linhas</span>
          </div>
          <div className="relative bg-[#12100E] border border-[#3A3026] rounded-xl p-4 font-mono text-xs overflow-x-auto max-h-[500px]">
            <pre className="text-[#D6CAB8] leading-relaxed selection:bg-[#D87947] selection:text-white">
              {CYNLA_PYTHON_CODE}
            </pre>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 3: Como Executar no seu Computador */}
      {activeTab === 'execucao' && (
        <div className="mt-5 space-y-4 text-xs sm:text-sm text-[#D6CAB8]">
          <div className="bg-[#241E18] p-5 rounded-xl border border-[#3A3026]">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-[#E8C97D]" />
              Como rodar no Windows, macOS ou Linux
            </h3>
            <p className="mb-4 text-[#B8A894]">
              O arquivo <strong>cynla_calculator.py</strong> foi projetado para funcionar sem depender de bibliotecas externas pesadas. Ele utiliza apenas o <strong>Python 3</strong> padrão e o <strong>Tkinter</strong> nativo.
            </p>

            <div className="space-y-3 font-mono text-xs">
              
              {/* Passo 1 */}
              <div className="bg-[#181410] p-3 rounded-lg border border-[#33281E]">
                <strong className="text-white font-sans text-xs block mb-1">
                  1. Baixe o arquivo ou salve com o nome oficial:
                </strong>
                <span className="text-[#E8C97D]">cynla_calculator.py</span>
              </div>

              {/* Passo 2 */}
              <div className="bg-[#181410] p-3 rounded-lg border border-[#33281E]">
                <strong className="text-white font-sans text-xs block mb-1">
                  2. Abra o Terminal (Prompt de Comando ou PowerShell no Windows, Terminal no Mac/Linux):
                </strong>
                <span className="text-neutral-400"># Para abrir a interface gráfica retrô:</span><br />
                <span className="text-emerald-400">python cynla_calculator.py</span>
                <span className="text-neutral-500 ml-2">(ou python3 cynla_calculator.py)</span>
              </div>

              {/* Passo 3 */}
              <div className="bg-[#181410] p-3 rounded-lg border border-[#33281E]">
                <strong className="text-white font-sans text-xs block mb-1">
                  3. Para rodar a bateria de testes automatizados no terminal:
                </strong>
                <span className="text-emerald-400">python cynla_calculator.py --test</span>
              </div>

              {/* Passo 4 */}
              <div className="bg-[#181410] p-3 rounded-lg border border-[#33281E]">
                <strong className="text-white font-sans text-xs block mb-1">
                  4. Caso seu sistema Linux não tenha interface gráfica (servidor headless):
                </strong>
                <span className="text-emerald-400">python cynla_calculator.py --cli</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
