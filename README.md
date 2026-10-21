# Checagem ao vivo

Um checador de fatos para transmissões ao vivo: ele escuta o que está sendo dito, checa cada afirmação **só em veículos de imprensa profissional** e pinta a tela de **verde** (verdade) ou **vermelho** (mentira), sempre mostrando o jornal e a matéria usados como fonte.

Funciona com lives do **YouTube** e com a **Globoplay**.

---

## Do que você precisa

1. **Google Chrome** no computador. O reconhecimento de voz só funciona nele.
2. **Uma chave da API da Anthropic** (a empresa que faz o Claude). **Não precisa ter conta no Claude.** Você só precisa da chave:
   - Entre em **console.anthropic.com** e crie uma conta.
   - Em **Billing**, coloque crédito. Uns US$ 5 já dão para muitos testes. Cada checagem custa alguns centavos.
   - Em **API Keys**, clique em **Create Key** e copie a chave. Ela começa com `sk-ant-` e só aparece uma vez.
3. Um computador com **caixa de som**. O microfone precisa ouvir o som do vídeo; com fone de ouvido, não funciona.

> **Nunca compartilhe a sua chave.** Quem tiver a chave gasta o seu crédito. Ela fica salva só no seu navegador e não vai para nenhum outro lugar além da própria Anthropic.

---

## Como usar

### 1. Abrir a página

Abra no Chrome: **https://mariaantoniaestudio.github.io/checagem-ao-vivo/**

### 2. Colocar a sua chave (só na primeira vez)

1. Na coluna da direita, clique em **▸ Configurações**.
2. Cole a chave no primeiro campo (**"Chave da API da Anthropic"**).
3. Clique em **Salvar**.

### 3. Testar sem microfone

No quadro **Simular fala**, clique numa das frases prontas. Em 10 a 30 segundos a tela fica verde ou vermelha, com a fonte embaixo.

### 4. Usar com uma live do YouTube

1. Cole o link da live no campo embaixo do vídeo e clique em **Carregar vídeo**.
2. Dê play com o som ligado.
3. Clique em **Começar a ouvir** e permita o microfone quando o Chrome pedir.
4. Confira o **medidor de volume**: a barra verde tem que se mexer.

### 5. Usar com a Globoplay

A Globoplay não deixa colocar o vídeo dela dentro de outra página. Por isso, ela fica na aba dela e uma **extensão do Chrome** pinta o vídeo de lá.

**Instalar a extensão (só uma vez):**

1. Nesta página do GitHub, clique no botão verde **Code** e depois em **Download ZIP**.
2. Abra o arquivo baixado para descompactar.
3. No Chrome, digite na barra de endereço: `chrome://extensions`
4. Ligue o **Modo do desenvolvedor** (canto superior direito).
5. Clique em **Carregar sem compactação** e escolha a pasta **`extensao-globoplay`** que veio no ZIP.

**Usar:**

1. Abra a Globoplay, dê play e confira se está com som (aparece um 🔊 na aba).
2. Em outra aba, abra a página de checagem. No topo deve aparecer **"Globoplay conectada"** em verde.
3. Clique em **Começar a ouvir**.
4. Os vereditos aparecem por cima do vídeo da Globoplay.

Se o vídeo da Globo ficar preto quando a cor aparecer, vá em **Configurações → Cor na Globoplay**, escolha **Película colorida** e clique em **Salvar**.

---

## O que cada resultado quer dizer

| Resultado | Na tela | Quando |
|---|---|---|
| **Verdadeiro** | verde | uma reportagem confirma o que foi dito |
| **Falso** | vermelho | uma reportagem contradiz o que foi dito |
| **Impreciso** | sem cor (só no painel) | tem base, mas número, data ou autoria estão errados ou exagerados |
| **Sem fonte** | sem cor (só no painel) | os veículos da lista não falaram sobre o assunto |

O sistema **nunca chama de mentira o que simplesmente não encontrou**. E só aceita a fonte se o link veio da própria busca e é de um veículo da lista.

**Importante:** a checagem é feita por inteligência artificial e pode errar. Use como apoio e confira a matéria citada.

---

## Quais veículos ele consulta

g1, O Globo, Valor Econômico, Folha de S.Paulo, Agência Brasil, CNN Brasil, UOL, Band, Poder360, Metrópoles, Correio Braziliense, Exame, InfoMoney, Veja, CartaCapital, GZH, Estado de Minas, Aos Fatos e Agência Lupa.

Dá para tirar ou incluir veículos em **Configurações**. Alguns sites (como Estadão, BBC, Reuters e AP) bloqueiam o robô de busca e por isso não entram. Se algum outro bloquear, a página tira ele da lista sozinha.

---

## Problemas comuns

- **A barra de volume não se mexe:** o microfone não está ouvindo. Tire o fone, aumente o volume ou confira o microfone em Ajustes do Sistema → Som → Entrada.
- **Transcreve, mas não colore:** olhe o painel **Checagens**. Se o resultado for "Impreciso" ou "Sem fonte", a tela não muda de cor de propósito.
- **"Chave da API inválida":** a chave foi copiada errada ou apagada no console.
- **"Limite de uso da API atingido":** acabou o crédito ou foram muitas checagens seguidas. Espere um pouco ou coloque mais crédito.
- **A transcrição usa o serviço de voz do Google** (é o que vem no Chrome). O áudio é enviado ao Google para virar texto.

---

## Rodar no próprio computador (opcional, Mac)

Se preferir não usar o link online, dá para rodar a página no seu Mac:

1. Baixe o ZIP (botão **Code → Download ZIP**) e descompacte.
2. Abra o **Terminal** e rode, trocando o caminho pela pasta descompactada:
   ```
   perl ~/Downloads/checagem-ao-vivo-main/servidor.pl
   ```
3. Abra no Chrome: **http://localhost:8787**

---

## Como funciona

A página (HTML, CSS e JavaScript) usa o reconhecimento de voz do Chrome para transcrever a fala. A API do Claude separa as afirmações checáveis das opiniões e depois verifica cada uma com uma busca na web restrita, pelo parâmetro `allowed_domains`, à lista de veículos de imprensa. O código confere se a fonte citada veio mesmo dessa busca. O resultado aparece sobre o vídeo com um duotone feito em CSS (`grayscale` + `mix-blend-mode`).

Arquivos:
- `index.html`: a página inteira.
- `extensao-globoplay/`: a extensão do Chrome para a Globoplay.
- `servidor.pl`: servidor local opcional.
