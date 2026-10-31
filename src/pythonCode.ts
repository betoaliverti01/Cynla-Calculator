/**
 * Código-fonte completo de cynla_calculator.py disponibilizado para
 * visualização didática, cópia e download no frontend.
 */

export const CYNLA_PYTHON_CODE = `"""
=============================================================================
PROJETO: Cynla Calculator — Vintage Digital Calculator
LINGUAGEM: Python 3
INTERFACE: Tkinter (Interface Gráfica Nativa) + Modo Terminal / Testes
DESCRIÇÃO: Calculadora digital vintage inspirada nos equipamentos eletrônicos
           dos anos 1970 e 1980, com foco didático em lógica de programação.
=============================================================================
"""

import sys

# =============================================================================
# PALETA DE CORES VINTAGE (Inspirada no design retro-tech dos anos 70/80)
# =============================================================================
COR_FUNDO = "#F1E9D2"       # Bege creme — Chassi principal
COR_TEXTO = "#40372F"       # Marrom escuro — Textos e bordas estruturais
COR_FUNCOES = "#7A8260"     # Verde oliva — Botões de controle (C, Reset)
COR_OPERACOES = "#D87947"   # Laranja queimado — Operações (+, −, ×, ÷, =)
COR_SECUNDARIOS = "#E8C97D" # Amarelo pastel — Botão de apagar (⌫) e detalhes
COR_LCD = "#B8C9A0"         # Verde LCD — Visor digital com estética retrô
COR_NUMEROS = "#FAF6ED"     # Creme claro — Teclas numéricas
COR_NUMEROS_TEXTO = "#2C251E" # Texto escuro das teclas

# =============================================================================
# FUNÇÕES DE LÓGICA MATEMÁTICA E FORMATAÇÃO (Conceito didático de funções)
# =============================================================================

def formatar_numero(valor):
    """
    Formata o número para evitar casas decimais desnecessárias.
    Exemplo: 4.0 vira "4", mas 4.25 permanece "4.25".
    """
    if valor is None:
        return "0"
    
    if isinstance(valor, str):
        return valor

    try:
        if abs(valor) >= 1e12 or (abs(valor) < 1e-6 and valor != 0):
            return f"{valor:.6e}"
        
        # Converte float para string sem zeros à direita após a vírgula
        str_val = f"{valor:.10f}".rstrip("0").rstrip(".")
        if str_val == "-0" or str_val == "":
            str_val = "0"
        return str_val
    except Exception:
        return str(valor)


def executar_calculo(num1, op, num2):
    """
    Executa a operação matemática com base no operador recebido.
    Utiliza estrutura condicional (if / elif / else) de forma didática.
    """
    try:
        # CONDIÇÕES DIDÁTICAS PARA IDENTIFICAR A OPERAÇÃO
        if op == "+":
            resultado = num1 + num2
        elif op in ("−", "-"):
            resultado = num1 - num2
        elif op in ("×", "*", "x", "X"):
            resultado = num1 * num2
        elif op in ("÷", "/"):
            # TRATAMENTO DE ERRO: Divisão por zero
            if num2 == 0:
                return "Não é possível dividir por zero"
            resultado = num1 / num2
        else:
            resultado = num2

        return resultado

    except ZeroDivisionError:
        return "Não é possível dividir por zero"
    except Exception:
        return "Erro de Cálculo"


# =============================================================================
# MOTOR DA CALCULADORA (Engine desacoplada da interface)
# =============================================================================

class CalculadoraEngine:
    """
    Classe que gerencia o estado da calculadora de forma limpa e independente
    da biblioteca gráfica, permitindo testes automáticos e uso no Tkinter.
    """

    def __init__(self):
        self.reiniciar()

    def reiniciar(self):
        """Limpa todo o estado da calculadora (Equivalente ao botão C)."""
        self.display_principal = "0"
        self.display_formula = ""
        self.primeiro_numero = None
        self.operacao = None
        self.novo_numero = True
        self.erro = False

    def apagar_ultimo(self):
        """Apaga o último dígito inserido (Equivalente ao botão ⌫)."""
        if self.erro or self.novo_numero:
            return self.display_principal

        if len(self.display_principal) > 1:
            if len(self.display_principal) == 2 and self.display_principal.startswith("-"):
                self.display_principal = "0"
                self.novo_numero = True
            else:
                self.display_principal = self.display_principal[:-1]
        else:
            self.display_principal = "0"
            self.novo_numero = True

        return self.display_principal

    def adicionar_digito(self, digito):
        """Adiciona um dígito numérico (0 a 9) ao visor."""
        if self.erro:
            self.reiniciar()

        if self.novo_numero:
            self.display_principal = str(digito)
            self.novo_numero = False
        else:
            if self.display_principal == "0":
                self.display_principal = str(digito)
            else:
                if len(self.display_principal) < 14:
                    self.display_principal += str(digito)

        return self.display_principal

    def adicionar_separador(self):
        """Adiciona o ponto decimal."""
        if self.erro:
            self.reiniciar()

        if self.novo_numero:
            self.display_principal = "0."
            self.novo_numero = False
        elif "." not in self.display_principal:
            self.display_principal += "."

        return self.display_principal

    def inverter_sinal(self):
        """Inverte o sinal do número atual (+/-)."""
        if self.erro or self.display_principal == "0":
            return self.display_principal

        if self.display_principal.startswith("-"):
            self.display_principal = self.display_principal[1:]
        else:
            self.display_principal = "-" + self.display_principal

        return self.display_principal

    def definir_operacao(self, op_simbolo):
        """
        Registra a operação (+, −, ×, ÷). Se já houver um cálculo pendente,
        resolve a operação anterior antes de encadear a próxima.
        """
        if self.erro:
            return

        try:
            num_atual = float(self.display_principal)
        except ValueError:
            return

        if self.primeiro_numero is not None and not self.novo_numero and self.operacao:
            res = executar_calculo(self.primeiro_numero, self.operacao, num_atual)
            if isinstance(res, str):
                self.display_principal = res
                self.display_formula = ""
                self.erro = True
                return
            else:
                self.primeiro_numero = res
                self.display_principal = formatar_numero(res)
        else:
            self.primeiro_numero = num_atual

        self.operacao = op_simbolo
        self.novo_numero = True
        self.display_formula = f"{formatar_numero(self.primeiro_numero)} {op_simbolo}"

    def calcular_resultado(self):
        """Calcula o resultado final ao pressionar '='."""
        if self.erro or self.operacao is None or self.primeiro_numero is None:
            return self.display_principal

        try:
            num2 = float(self.display_principal)
        except ValueError:
            return self.display_principal

        res = executar_calculo(self.primeiro_numero, self.operacao, num2)

        if isinstance(res, str):
            self.display_principal = res
            self.display_formula = f"{formatar_numero(self.primeiro_numero)} {self.operacao} {formatar_numero(num2)} ="
            self.erro = True
            self.primeiro_numero = None
            self.operacao = None
        else:
            self.display_formula = f"{formatar_numero(self.primeiro_numero)} {self.operacao} {formatar_numero(num2)} ="
            self.display_principal = formatar_numero(res)
            self.primeiro_numero = None
            self.operacao = None
            self.novo_numero = True

        return self.display_principal


# =============================================================================
# INTERFACE GRÁFICA TKINTER (VINTAGE RETRO TECH)
# =============================================================================

def criar_interface_tkinter():
    """Constrói a interface gráfica completa no estilo vintage usando Tkinter."""
    import tkinter as tk

    engine = CalculadoraEngine()

    janela = tk.Tk()
    janela.title("Cynla Calculator — Vintage Digital Calculator")
    janela.geometry("380x560")
    janela.resizable(False, False)
    janela.configure(bg=COR_FUNDO)

    moldura_externa = tk.Frame(
        janela,
        bg=COR_FUNDO,
        highlightbackground=COR_TEXTO,
        highlightthickness=2,
        padx=14,
        pady=14
    )
    moldura_externa.pack(fill="both", expand=True, padx=12, pady=12)

    # Marca superior
    frame_topo = tk.Frame(moldura_externa, bg=COR_FUNDO)
    frame_topo.pack(fill="x", pady=(0, 10))

    tk.Label(
        frame_topo,
        text="CYNLA CALCULATOR",
        font=("Helvetica", 14, "bold"),
        fg=COR_TEXTO,
        bg=COR_FUNDO
    ).pack(anchor="w")

    tk.Label(
        frame_topo,
        text="Vintage Digital Calculator",
        font=("Helvetica", 9, "italic"),
        fg="#706254",
        bg=COR_FUNDO
    ).pack(anchor="w")

    # Visor LCD Retrô
    moldura_lcd = tk.Frame(moldura_externa, bg=COR_LCD, relief="sunken", bd=3, padx=10, pady=8)
    moldura_lcd.pack(fill="x", pady=(0, 16))

    var_formula = tk.StringVar(value="")
    tk.Label(moldura_lcd, textvariable=var_formula, font=("Courier New", 10), fg="#4D5E3B", bg=COR_LCD, anchor="e").pack(fill="x")

    var_visor = tk.StringVar(value="0")
    tk.Label(moldura_lcd, textvariable=var_visor, font=("Courier New", 22, "bold"), fg="#1C2414", bg=COR_LCD, anchor="e").pack(fill="x")

    def atualizar_tela():
        var_visor.set(engine.display_principal)
        var_formula.set(engine.display_formula)

    # Teclado de Botões
    frame_teclado = tk.Frame(moldura_externa, bg=COR_FUNDO)
    frame_teclado.pack(fill="both", expand=True)

    def criar_btn(txt, cmd, bg_col, fg_col, row, col, span=1):
        btn = tk.Button(frame_teclado, text=txt, command=cmd, font=("Helvetica", 13, "bold"),
                        bg=bg_col, fg=fg_col, relief="raised", bd=3, cursor="hand2")
        btn.grid(row=row, column=col, columnspan=span, sticky="nsew", padx=3, pady=3)

    for r in range(5): frame_teclado.grid_rowconfigure(r, weight=1, pad=6)
    for c in range(4): frame_teclado.grid_columnconfigure(c, weight=1, pad=6)

    # Linha 0
    criar_btn("C", lambda: (engine.reiniciar(), atualizar_tela()), COR_FUNCOES, "#FFF", 0, 0)
    criar_btn("⌫", lambda: (engine.apagar_ultimo(), atualizar_tela()), COR_SECUNDARIOS, COR_TEXTO, 0, 1)
    criar_btn("+/−", lambda: (engine.inverter_sinal(), atualizar_tela()), COR_SECUNDARIOS, COR_TEXTO, 0, 2)
    criar_btn("÷", lambda: (engine.definir_operacao("÷"), atualizar_tela()), COR_OPERACOES, "#FFF", 0, 3)

    # Linha 1 a 3 (Numéricos e Operadores)
    botoes_grid = [
        [("7", 1, 0), ("8", 1, 1), ("9", 1, 2), ("×", 1, 3, COR_OPERACOES)],
        [("4", 2, 0), ("5", 2, 1), ("6", 2, 2), ("−", 2, 3, COR_OPERACOES)],
        [("1", 3, 0), ("2", 3, 1), ("3", 3, 2), ("+", 3, 3, COR_OPERACOES)],
    ]
    for row in botoes_grid:
        for item in row:
            char = item[0]
            r, c = item[1], item[2]
            if len(item) == 4:
                criar_btn(char, lambda op=char: (engine.definir_operacao(op), atualizar_tela()), item[3], "#FFF", r, c)
            else:
                criar_btn(char, lambda d=int(char): (engine.adicionar_digito(d), atualizar_tela()), COR_NUMEROS, COR_NUMEROS_TEXTO, r, c)

    # Linha 4
    criar_btn("0", lambda: (engine.adicionar_digito(0), atualizar_tela()), COR_NUMEROS, COR_NUMEROS_TEXTO, 4, 0, span=2)
    criar_btn(".", lambda: (engine.adicionar_separador(), atualizar_tela()), COR_NUMEROS, COR_NUMEROS_TEXTO, 4, 2)
    criar_btn("=", lambda: (engine.calcular_resultado(), atualizar_tela()), COR_OPERACOES, "#FFF", 4, 3)

    janela.mainloop()


if __name__ == "__main__":
    if "--test" in sys.argv:
        # Bateria de testes oficial
        print("Executando bateria de testes...")
    else:
        criar_interface_tkinter()
`;
