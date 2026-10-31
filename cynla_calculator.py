"""
=============================================================================
PROJETO: Cynla Calculator — Vintage Digital Calculator
LINGUAGEM: Python 3
INTERFACE: Tkinter (Interface Gráfica Nativa) + Modo Terminal / Testes
DESCRIÇÃO: Calculadora digital vintage inspirada nos equipamentos eletrônicos
           dos anos 1970 e 1980, com foco didático em lógica de programação.
=============================================================================
"""

import sys
from decimal import Decimal, InvalidOperation

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
# VARIÁVEIS GLOBAIS DE ESTADO DA CALCULADORA (Conceito didático de variáveis)
# =============================================================================
primeiro_numero = None      # Armazena o primeiro operando digitado
operacao = None             # Armazena a operação selecionada (+, -, *, /)
novo_numero = True          # Flag que indica se o próximo clique inicia novo número
ultimo_segundo_numero = None # Usado para repetição do igual (=)
historico_texto = ""        # Texto auxiliar de cálculo exibido no visor superior


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
    
    # Se já for mensagem de erro, retorna como está
    if isinstance(valor, str):
        return valor

    # Arredondamento para evitar imprecisões de ponto flutuante
    # ex: 0.1 + 0.2 = 0.30000000000000004
    try:
        # Limita a 10 casas decimais significativas
        if abs(valor) >= 1e12 or (abs(valor) < 1e-6 and valor != 0):
            # Notação científica para números gigantescos ou minúsculos
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
            # Caso não haja operação definida, mantém o número atual
            resultado = num2

        return resultado

    except ZeroDivisionError:
        return "Não é possível dividir por zero"
    except Exception as e:
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
            # Se for número negativo com 1 dígito (ex: "-5"), volta a "0"
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
                # Limite de tamanho no visor para manter legibilidade retrô
                if len(self.display_principal) < 14:
                    self.display_principal += str(digito)

        return self.display_principal

    def adicionar_separador(self):
        """Adiciona o ponto/vírgula decimal."""
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

        # Se já tínhamos um primeiro número e estávamos esperando um segundo,
        # realiza o cálculo intermediário (operações consecutivas)
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
            # Mensagem de erro (ex: "Não é possível dividir por zero")
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
    """
    Constrói a interface gráfica completa no estilo vintage usando Tkinter.
    """
    import tkinter as tk
    from tkinter import font as tkfont

    engine = CalculadoraEngine()

    janela = tk.Tk()
    janela.title("Cynla Calculator — Vintage Digital Calculator")
    janela.geometry("380x560")
    janela.resizable(False, False)
    janela.configure(bg=COR_FUNDO)

    # Cores e estilos
    fonte_marca = ("Helvetica", 14, "bold")
    fonte_subtitulo = ("Helvetica", 9, "italic")
    fonte_lcd = ("Courier New", 22, "bold")
    fonte_lcd_aux = ("Courier New", 10, "normal")
    fonte_teclas = ("Helvetica", 13, "bold")

    # Contêiner Principal com borda de gabinete retrô
    moldura_externa = tk.Frame(
        janela,
        bg=COR_FUNDO,
        highlightbackground=COR_TEXTO,
        highlightthickness=2,
        padx=14,
        pady=14
    )
    moldura_externa.pack(fill="both", expand=True, padx=12, pady=12)

    # --- CABEÇALHO / MARCA CYNLA CALCULATOR ---
    frame_topo = tk.Frame(moldura_externa, bg=COR_FUNDO)
    frame_topo.pack(fill="x", pady=(0, 10))

    label_marca = tk.Label(
        frame_topo,
        text="CYNLA CALCULATOR",
        font=fonte_marca,
        fg=COR_TEXTO,
        bg=COR_FUNDO,
        anchor="w"
    )
    label_marca.pack(anchor="w")

    label_sub = tk.Label(
        frame_topo,
        text="Vintage Digital Calculator",
        font=fonte_subtitulo,
        fg="#706254",
        bg=COR_FUNDO,
        anchor="w"
    )
    label_sub.pack(anchor="w")

    # Painel Solar Retrô decorativo (detalhe dos anos 80)
    frame_solar = tk.Frame(frame_topo, bg="#2A241E", height=14, width=80)
    frame_solar.place(relx=1.0, rely=0.1, anchor="ne")
    for i in range(4):
        tk.Frame(frame_solar, bg="#4A4036", width=16, height=10).pack(side="left", padx=1, pady=2)

    # --- VISOR DIGITAL LCD ---
    moldura_lcd = tk.Frame(
        moldura_externa,
        bg=COR_LCD,
        relief="sunken",
        bd=3,
        padx=10,
        pady=8
    )
    moldura_lcd.pack(fill="x", pady=(0, 16))

    var_formula = tk.StringVar(value="")
    label_formula = tk.Label(
        moldura_lcd,
        textvariable=var_formula,
        font=fonte_lcd_aux,
        fg="#4D5E3B",
        bg=COR_LCD,
        anchor="e"
    )
    label_formula.pack(fill="x")

    var_visor = tk.StringVar(value="0")
    label_visor = tk.Label(
        moldura_lcd,
        textvariable=var_visor,
        font=fonte_lcd,
        fg="#1C2414",
        bg=COR_LCD,
        anchor="e",
        height=1
    )
    label_visor.pack(fill="x")

    def atualizar_tela():
        var_visor.set(engine.display_principal)
        var_formula.set(engine.display_formula)

    # --- AÇÕES DOS BOTÕES (Eventos) ---
    def clique_numero(digito):
        engine.adicionar_digito(digito)
        atualizar_tela()

    def clique_operacao(op):
        engine.definir_operacao(op)
        atualizar_tela()

    def clique_igual():
        engine.calcular_resultado()
        atualizar_tela()

    def clique_limpar():
        engine.reiniciar()
        atualizar_tela()

    def clique_apagar():
        engine.apagar_ultimo()
        atualizar_tela()

    def clique_ponto():
        engine.adicionar_separador()
        atualizar_tela()

    def clique_sinal():
        engine.inverter_sinal()
        atualizar_tela()

    # --- TECLADO DA CALCULADORA (Grid Vintage) ---
    frame_teclado = tk.Frame(moldura_externa, bg=COR_FUNDO)
    frame_teclado.pack(fill="both", expand=True)

    # Configuração de expansão das linhas e colunas
    for r in range(5):
        frame_teclado.grid_rowconfigure(r, weight=1, pad=6)
    for c in range(4):
        frame_teclado.grid_columnconfigure(c, weight=1, pad=6)

    # Função auxiliar para criar botões estilizados
    def criar_botao(texto, comando, cor_fundo, cor_texto, linha, coluna, col_span=1):
        btn = tk.Button(
            frame_teclado,
            text=texto,
            command=comando,
            font=fonte_teclas,
            bg=cor_fundo,
            fg=cor_texto,
            activebackground=cor_texto,
            activeforeground=cor_fundo,
            relief="raised",
            bd=3,
            cursor="hand2"
        )
        btn.grid(row=linha, column=coluna, columnspan=col_span, sticky="nsew", padx=3, pady=3)
        return btn

    # Linha 0: C (Limpar), ⌫ (Apagar), +/- (Inverter sinal), ÷ (Divisão)
    criar_botao("C", clique_limpar, COR_FUNCOES, "#FFFFFF", 0, 0)
    criar_botao("⌫", clique_apagar, COR_SECUNDARIOS, COR_TEXTO, 0, 1)
    criar_botao("+/−", clique_sinal, COR_SECUNDARIOS, COR_TEXTO, 0, 2)
    criar_botao("÷", lambda: clique_operacao("÷"), COR_OPERACOES, "#FFFFFF", 0, 3)

    # Linha 1: 7, 8, 9, ×
    criar_botao("7", lambda: clique_numero(7), COR_NUMEROS, COR_NUMEROS_TEXTO, 1, 0)
    criar_botao("8", lambda: clique_numero(8), COR_NUMEROS, COR_NUMEROS_TEXTO, 1, 1)
    criar_botao("9", lambda: clique_numero(9), COR_NUMEROS, COR_NUMEROS_TEXTO, 1, 2)
    criar_botao("×", lambda: clique_operacao("×"), COR_OPERACOES, "#FFFFFF", 1, 3)

    # Linha 2: 4, 5, 6, −
    criar_botao("4", lambda: clique_numero(4), COR_NUMEROS, COR_NUMEROS_TEXTO, 2, 0)
    criar_botao("5", lambda: clique_numero(5), COR_NUMEROS, COR_NUMEROS_TEXTO, 2, 1)
    criar_botao("6", lambda: clique_numero(6), COR_NUMEROS, COR_NUMEROS_TEXTO, 2, 2)
    criar_botao("−", lambda: clique_operacao("−"), COR_OPERACOES, "#FFFFFF", 2, 3)

    # Linha 3: 1, 2, 3, +
    criar_botao("1", lambda: clique_numero(1), COR_NUMEROS, COR_NUMEROS_TEXTO, 3, 0)
    criar_botao("2", lambda: clique_numero(2), COR_NUMEROS, COR_NUMEROS_TEXTO, 3, 1)
    criar_botao("3", lambda: clique_numero(3), COR_NUMEROS, COR_NUMEROS_TEXTO, 3, 2)
    criar_botao("+", lambda: clique_operacao("+"), COR_OPERACOES, "#FFFFFF", 3, 3)

    # Linha 4: 0 (largo), . (decimal), = (resultado)
    criar_botao("0", lambda: clique_numero(0), COR_NUMEROS, COR_NUMEROS_TEXTO, 4, 0, col_span=2)
    criar_botao(".", clique_ponto, COR_NUMEROS, COR_NUMEROS_TEXTO, 4, 2)
    criar_botao("=", clique_igual, COR_OPERACOES, "#FFFFFF", 4, 3)

    # --- ATALHOS DE TECLADO FÍSICO ---
    def tecla_pressionada(event):
        c = event.char
        if c in "0123456789":
            clique_numero(int(c))
        elif c in "+":
            clique_operacao("+")
        elif c in "-":
            clique_operacao("−")
        elif c in "*":
            clique_operacao("×")
        elif c in "/":
            clique_operacao("÷")
        elif c in ".,":
            clique_ponto()
        elif event.keysym in ("Return", "equal"):
            clique_igual()
        elif event.keysym in ("BackSpace",):
            clique_apagar()
        elif event.keysym in ("Escape", "c", "C"):
            clique_limpar()

    janela.bind("<Key>", tecla_pressionada)

    # Inicia o loop principal da aplicação Tkinter
    janela.mainloop()


# =============================================================================
# MODO DE TESTES AUTOMATIZADOS (Validação das 4 operações e requisitos)
# =============================================================================

def executar_testes_didaticos():
    """
    Executa a bateria de testes oficial exigida na seção 9 do projeto:
    10 + 5 = 15
    20 − 8 = 12
    6 × 7 = 42
    100 ÷ 4 = 25
    10 ÷ 0 = Não é possível dividir por zero
    2,5 + 1,5 = 4
    -5 + 10 = 5
    """
    print("=" * 65)
    print("CYNLA CALCULATOR — BATERIA DE TESTES OFICIAIS (SEÇÃO 9)")
    print("=" * 65)

    testes = [
        {"desc": "Adição simples", "num1": 10, "op": "+", "num2": 5, "esperado": "15"},
        {"desc": "Subtração simples", "num1": 20, "op": "−", "num2": 8, "esperado": "12"},
        {"desc": "Multiplicação", "num1": 6, "op": "×", "num2": 7, "esperado": "42"},
        {"desc": "Divisão exata", "num1": 100, "op": "÷", "num2": 4, "esperado": "25"},
        {"desc": "Divisão por zero", "num1": 10, "op": "÷", "num2": 0, "esperado": "Não é possível dividir por zero"},
        {"desc": "Números decimais", "num1": 2.5, "op": "+", "num2": 1.5, "esperado": "4"},
        {"desc": "Número negativo", "num1": -5, "op": "+", "num2": 10, "esperado": "5"},
    ]

    todos_passaram = True

    for i, t in enumerate(testes, 1):
        res = executar_calculo(t["num1"], t["op"], t["num2"])
        str_res = formatar_numero(res) if not isinstance(res, str) else res

        passou = (str_res == t["esperado"])
        if not passou:
            todos_passaram = False

        status = "✔ PASSOU" if passou else "✖ FALHOU"
        print(f"[{i}] {t['desc']:<20} | {t['num1']} {t['op']} {t['num2']} => {str_res:<32} [{status}]")

    # Teste de botão C e apagar usando a Engine
    print("-" * 65)
    print("Testando Botão ⌫ (Apagar) e Botão C (Limpar)...")
    eng = CalculadoraEngine()
    eng.adicionar_digito(1)
    eng.adicionar_digito(2)
    eng.adicionar_digito(3)
    assert eng.display_principal == "123", "Erro ao digitar"
    eng.apagar_ultimo()
    assert eng.display_principal == "12", "Erro no botão apagar"
    eng.reiniciar()
    assert eng.display_principal == "0", "Erro no botão C"
    print("✔ Botão ⌫ e Botão C testados com sucesso!")

    # Teste de operações consecutivas
    print("Testando Operações Consecutivas (ex: 2 + 3 + 4 = 9)...")
    eng.adicionar_digito(2)
    eng.definir_operacao("+")
    eng.adicionar_digito(3)
    eng.definir_operacao("+")
    assert eng.display_principal == "5", "Erro na operação intermediária"
    eng.adicionar_digito(4)
    eng.calcular_resultado()
    assert eng.display_principal == "9", "Erro no cálculo consecutivo final"
    print("✔ Operações consecutivas testadas com sucesso!")

    print("=" * 65)
    if todos_passaram:
        print("RESULTADO FINAL: TODOS OS 7 TESTES OFICIAIS PASSARAM COM SUCESSO!")
    else:
        print("RESULTADO FINAL: Alguns testes falharam.")
    print("=" * 65)
    return todos_passaram


# =============================================================================
# MODO TERMINAL INTERATIVO (Para quando Tkinter não puder abrir display X11)
# =============================================================================

def executar_modo_terminal():
    """
    Executa uma interface interativa no terminal para garantir funcionamento
    em qualquer ambiente (incluindo servidores Linux sem monitor).
    """
    print("\n" + "=" * 50)
    print("       CYNLA CALCULATOR — MODO TERMINAL")
    print("           Vintage Digital Calculator")
    print("=" * 50)
    print("Comandos: digite 'c' para limpar, 't' para testes, 's' para sair.")
    print("-" * 50)

    engine = CalculadoraEngine()

    while True:
        print(f"\n[ VISOR RETRÔ LCD:  {engine.display_principal}  ]")
        if engine.display_formula:
            print(f"  Fórmula: {engine.display_formula}")

        entrada = input("Digite um comando (+, -, *, /, =, número, C, S): ").strip()

        if not entrada:
            continue

        if entrada.lower() == "s":
            print("Encerrando Cynla Calculator. Até logo!")
            break
        elif entrada.lower() == "c":
            engine.reiniciar()
        elif entrada.lower() == "t":
            executar_testes_didaticos()
        elif entrada == "=":
            engine.calcular_resultado()
        elif entrada in ("+", "-", "*", "/"):
            simbolos = {"+": "+", "-": "−", "*": "×", "/": "÷"}
            engine.definir_operacao(simbolos[entrada])
        else:
            try:
                # Tenta processar número digitado
                val = float(entrada.replace(",", "."))
                engine.display_principal = formatar_numero(val)
                engine.novo_numero = False
            except ValueError:
                print("Entrada não reconhecida. Use números ou os operadores +, -, *, /")


# =============================================================================
# PONTO DE ENTRADA PRINCIPAL
# =============================================================================

if __name__ == "__main__":
    # Verifica argumentos de linha de comando
    if "--test" in sys.argv:
        sucesso = executar_testes_didaticos()
        sys.exit(0 if sucesso else 1)
    elif "--cli" in sys.argv:
        executar_modo_terminal()
    else:
        # Tenta abrir a interface Tkinter
        try:
            criar_interface_tkinter()
        except Exception as e:
            # Em ambientes sem display gráfico X11 (como contêineres e servidores),
            # executa o modo de teste ou terminal com aviso explicativo amigável.
            print("\n[AVISO DIDÁTICO]")
            print("O Tkinter requer um monitor/display gráfico (X11/Wayland/Windows/macOS).")
            print("Como este terminal está em um servidor headless, executando a bateria de testes:")
            print()
            executar_testes_didaticos()
