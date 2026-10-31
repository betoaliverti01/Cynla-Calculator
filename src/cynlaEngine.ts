/**
 * Motor em TypeScript com paridade estrita à classe CalculadoraEngine do Python (cynla_calculator.py).
 * Mantém rastreabilidade didática de qual função e condição está ativa em cada etapa.
 */

import { CalculatorState, TestCase } from './types';

export function formatarNumeroPython(valor: number | null | string): string {
  if (valor === null || valor === undefined) return '0';
  if (typeof valor === 'string') return valor;

  if (isNaN(valor)) return 'Erro de Cálculo';
  if (!isFinite(valor)) return 'Não é possível dividir por zero';

  // Notação científica para números extremos
  if (Math.abs(valor) >= 1e12 || (Math.abs(valor) < 1e-6 && valor !== 0)) {
    return valor.toExponential(6);
  }

  // Formatação sem casas decimais desnecessárias (ex: 4.0 -> "4", 4.25 -> "4.25")
  const str = parseFloat(valor.toFixed(10)).toString();
  return str === '-0' ? '0' : str;
}

export function executarCalculoPython(
  num1: number,
  op: string,
  num2: number
): { resultado: number | string; condicaoTexto: string } {
  if (op === '+') {
    return {
      resultado: num1 + num2,
      condicaoTexto: `if op == "+":  # ${num1} + ${num2} = ${num1 + num2}`,
    };
  } else if (op === '−' || op === '-') {
    return {
      resultado: num1 - num2,
      condicaoTexto: `elif op in ("−", "-"):  # ${num1} - ${num2} = ${num1 - num2}`,
    };
  } else if (op === '×' || op === '*' || op === 'x' || op === 'X') {
    return {
      resultado: num1 * num2,
      condicaoTexto: `elif op in ("×", "*"):  # ${num1} × ${num2} = ${num1 * num2}`,
    };
  } else if (op === '÷' || op === '/') {
    if (num2 === 0) {
      return {
        resultado: 'Não é possível dividir por zero',
        condicaoTexto: `elif op in ("÷", "/"): if num2 == 0: return "Não é possível dividir por zero"`,
      };
    }
    return {
      resultado: num1 / num2,
      condicaoTexto: `elif op in ("÷", "/"):  # ${num1} ÷ ${num2} = ${num1 / num2}`,
    };
  } else {
    return {
      resultado: num2,
      condicaoTexto: 'else: resultado = num2',
    };
  }
}

export class CynlaEngine {
  private state: CalculatorState;

  constructor() {
    this.state = {
      displayPrincipal: '0',
      displayFormula: '',
      primeiroNumero: null,
      operacao: null,
      novoNumero: true,
      erro: false,
      funcaoExecutada: '__init__()',
      condicaoAvaliada: 'Estado inicial: primeiro_numero = None, operacao = None',
      historicoPassos: ['Inicialização do sistema Cynla Calculator'],
    };
  }

  getState(): CalculatorState {
    return { ...this.state };
  }

  reiniciar(): CalculatorState {
    this.state = {
      displayPrincipal: '0',
      displayFormula: '',
      primeiroNumero: null,
      operacao: null,
      novoNumero: true,
      erro: false,
      funcaoExecutada: 'reiniciar()  # Botão C pressionado',
      condicaoAvaliada: 'Reset de todas as variáveis para os valores iniciais (0 e None)',
      historicoPassos: [
        `[${new Date().toLocaleTimeString()}] Botão C acionado: Visor zerado`,
      ],
    };
    return this.getState();
  }

  apagarUltimo(): CalculatorState {
    if (this.state.erro || this.state.novoNumero) {
      return this.getState();
    }

    const atual = this.state.displayPrincipal;
    let novoDisplay: string;
    let novoNumeroFlag: boolean = this.state.novoNumero;

    if (atual.length > 1) {
      if (atual.length === 2 && atual.startsWith('-')) {
        novoDisplay = '0';
        novoNumeroFlag = true;
      } else {
        novoDisplay = atual.slice(0, -1);
      }
    } else {
      novoDisplay = '0';
      novoNumeroFlag = true;
    }

    this.state.displayPrincipal = novoDisplay;
    this.state.novoNumero = novoNumeroFlag;
    this.state.funcaoExecutada = 'apagar_ultimo()  # Botão ⌫ pressionado';
    this.state.condicaoAvaliada = `Fatiamento de string em Python: display_principal[:-1] -> "${novoDisplay}"`;
    return this.getState();
  }

  adicionarDigito(digito: number): CalculatorState {
    if (this.state.erro) {
      this.reiniciar();
    }

    let novoDisplay: string;

    if (this.state.novoNumero) {
      novoDisplay = digito.toString();
      this.state.novoNumero = false;
      this.state.condicaoAvaliada = `if novo_numero: display_principal = "${digito}" (iniciando novo número)`;
    } else {
      if (this.state.displayPrincipal === '0') {
        novoDisplay = digito.toString();
        this.state.condicaoAvaliada = `if display == "0": substitui 0 por "${digito}"`;
      } else {
        if (this.state.displayPrincipal.length < 14) {
          novoDisplay = this.state.displayPrincipal + digito.toString();
          this.state.condicaoAvaliada = `else: concatenação de texto: "${this.state.displayPrincipal}" + "${digito}"`;
        } else {
          novoDisplay = this.state.displayPrincipal;
          this.state.condicaoAvaliada = 'Limite de 14 dígitos atingido no visor';
        }
      }
    }

    this.state.displayPrincipal = novoDisplay;
    this.state.funcaoExecutada = `adicionar_digito(${digito})`;
    return this.getState();
  }

  adicionarSeparador(): CalculatorState {
    if (this.state.erro) {
      this.reiniciar();
    }

    if (this.state.novoNumero) {
      this.state.displayPrincipal = '0.';
      this.state.novoNumero = false;
      this.state.condicaoAvaliada = 'if novo_numero: display_principal = "0."';
    } else if (!this.state.displayPrincipal.includes('.')) {
      this.state.displayPrincipal += '.';
      this.state.condicaoAvaliada = 'if "." not in display_principal: adiciona ponto decimal';
    } else {
      this.state.condicaoAvaliada = 'Separador decimal já presente no número';
    }

    this.state.funcaoExecutada = 'adicionar_separador()  # Botão .';
    return this.getState();
  }

  inverterSinal(): CalculatorState {
    if (this.state.erro || this.state.displayPrincipal === '0') {
      return this.getState();
    }

    if (this.state.displayPrincipal.startsWith('-')) {
      this.state.displayPrincipal = this.state.displayPrincipal.slice(1);
      this.state.condicaoAvaliada = 'if display.startswith("-"): remove sinal negativo';
    } else {
      this.state.displayPrincipal = '-' + this.state.displayPrincipal;
      this.state.condicaoAvaliada = 'else: prefixa sinal negativo "-"';
    }

    this.state.funcaoExecutada = 'inverter_sinal()  # Botão +/-';
    return this.getState();
  }

  definirOperacao(opSimbolo: string): CalculatorState {
    if (this.state.erro) return this.getState();

    const numAtual = parseFloat(this.state.displayPrincipal);
    if (isNaN(numAtual)) return this.getState();

    // Se já havia uma operação pendente e o usuário digitou outro número, realiza o cálculo encadeado
    if (
      this.state.primeiroNumero !== null &&
      !this.state.novoNumero &&
      this.state.operacao
    ) {
      const calc = executarCalculoPython(
        this.state.primeiroNumero,
        this.state.operacao,
        numAtual
      );

      if (typeof calc.resultado === 'string') {
        this.state.displayPrincipal = calc.resultado;
        this.state.displayFormula = '';
        this.state.erro = true;
        this.state.funcaoExecutada = 'definir_operacao() -> Erro intermediário';
        this.state.condicaoAvaliada = calc.condicaoTexto;
        return this.getState();
      } else {
        this.state.primeiroNumero = calc.resultado;
        this.state.displayPrincipal = formatarNumeroPython(calc.resultado);
      }
    } else {
      this.state.primeiroNumero = numAtual;
    }

    this.state.operacao = opSimbolo;
    this.state.novoNumero = true;
    this.state.displayFormula = `${formatarNumeroPython(this.state.primeiroNumero)} ${opSimbolo}`;
    this.state.funcaoExecutada = `definir_operacao("${opSimbolo}")`;
    this.state.condicaoAvaliada = `primeiro_numero = ${formatarNumeroPython(this.state.primeiroNumero)}; operacao = "${opSimbolo}"; novo_numero = True`;

    return this.getState();
  }

  calcularResultado(): { state: CalculatorState; historicoItem?: { expressao: string; resultado: string } } {
    if (
      this.state.erro ||
      this.state.operacao === null ||
      this.state.primeiroNumero === null
    ) {
      return { state: this.getState() };
    }

    const num2 = parseFloat(this.state.displayPrincipal);
    if (isNaN(num2)) return { state: this.getState() };

    const calc = executarCalculoPython(
      this.state.primeiroNumero,
      this.state.operacao,
      num2
    );

    const expressao = `${formatarNumeroPython(this.state.primeiroNumero)} ${this.state.operacao} ${formatarNumeroPython(num2)}`;
    let historicoItem;

    if (typeof calc.resultado === 'string') {
      this.state.displayPrincipal = calc.resultado;
      this.state.displayFormula = `${expressao} =`;
      this.state.erro = true;
      this.state.primeiroNumero = null;
      this.state.operacao = null;
      this.state.funcaoExecutada = 'calcular_resultado() -> Divisão por Zero';
      this.state.condicaoAvaliada = calc.condicaoTexto;
      historicoItem = { expressao, resultado: calc.resultado };
    } else {
      const resFormatado = formatarNumeroPython(calc.resultado);
      this.state.displayFormula = `${expressao} =`;
      this.state.displayPrincipal = resFormatado;
      this.state.primeiroNumero = null;
      this.state.operacao = null;
      this.state.novoNumero = true;
      this.state.funcaoExecutada = `calcular_resultado() -> ${resFormatado}`;
      this.state.condicaoAvaliada = calc.condicaoTexto;
      historicoItem = { expressao, resultado: resFormatado };
    }

    return { state: this.getState(), historicoItem };
  }
}

export const TESTES_OFICIAIS: TestCase[] = [
  {
    id: 'test-1',
    nome: 'Adição simples',
    expressao: '10 + 5',
    num1: 10,
    op: '+',
    num2: 5,
    esperado: '15',
    categoria: 'basica',
  },
  {
    id: 'test-2',
    nome: 'Subtração simples',
    expressao: '20 − 8',
    num1: 20,
    op: '−',
    num2: 8,
    esperado: '12',
    categoria: 'basica',
  },
  {
    id: 'test-3',
    nome: 'Multiplicação',
    expressao: '6 × 7',
    num1: 6,
    op: '×',
    num2: 7,
    esperado: '42',
    categoria: 'basica',
  },
  {
    id: 'test-4',
    nome: 'Divisão exata',
    expressao: '100 ÷ 4',
    num1: 100,
    op: '÷',
    num2: 4,
    esperado: '25',
    categoria: 'basica',
  },
  {
    id: 'test-5',
    nome: 'Divisão por zero',
    expressao: '10 ÷ 0',
    num1: 10,
    op: '÷',
    num2: 0,
    esperado: 'Não é possível dividir por zero',
    categoria: 'excecao',
  },
  {
    id: 'test-6',
    nome: 'Números decimais',
    expressao: '2,5 + 1,5',
    num1: 2.5,
    op: '+',
    num2: 1.5,
    esperado: '4',
    categoria: 'decimal',
  },
  {
    id: 'test-7',
    nome: 'Número negativo',
    expressao: '-5 + 10',
    num1: -5,
    op: '+',
    num2: 10,
    esperado: '5',
    categoria: 'negativo',
  },
];
