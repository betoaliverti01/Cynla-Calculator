/**
 * Tipos e interfaces para a Cynla Calculator e o inspetor didático de Python.
 */

export interface CalculatorState {
  displayPrincipal: string;
  displayFormula: string;
  primeiroNumero: number | null;
  operacao: string | null;
  novoNumero: boolean;
  erro: boolean;
  funcaoExecutada: string;
  condicaoAvaliada: string;
  historicoPassos: string[];
}

export interface TestCase {
  id: string;
  nome: string;
  expressao: string;
  num1: number;
  op: string;
  num2: number;
  esperado: string;
  categoria: 'basica' | 'excecao' | 'decimal' | 'negativo' | 'especial';
}

export interface HistoryItem {
  id: string;
  expressao: string;
  resultado: string;
  data: string;
}
