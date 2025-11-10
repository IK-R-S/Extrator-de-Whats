# WhatsApp Contact Extractor

Uma **extensão para Google Chrome** que permite **extrair contatos de grupos do WhatsApp Web** e gerar **tabelas (CSV ou Markdown)** com links diretos `wa.me`.

---

## 🧩 Visão Geral

O **WhatsApp Contact Extractor** varre a interface do **WhatsApp Web** para capturar números de telefone dos participantes de um grupo.  
Com um clique, ele gera automaticamente uma lista formatada contendo:

- 📱 **Número exibido**  
- 🔢 **Número limpo (DDD + dígitos)**  
- 🌐 **Link direto** para conversa no `https://wa.me`

Você pode:
- Copiar os dados em **CSV** ou **Markdown**
- Baixar os arquivos
- Filtrar por número ou DDD
- Extrair quantos grupos quiser

---

## ⚙️ Estrutura do Projeto

```bash
.
├── manifest.json      # Configuração da extensão (Manifest V3)
├── popup.html         # Interface principal (popup)
├── popup.js           # Lógica da extração e exportação
├── style.css          # Estilos da interface
└── content.js         # Script injetado no WhatsApp Web
````

---

## 🚀 Instalação (modo desenvolvedor)

1. Baixe ou clone este repositório:

   ```bash
   git clone https://github.com/seuusuario/whatsapp-contact-extractor.git
   ```
2. Abra o **Google Chrome** e acesse:

   ```
   chrome://extensions/
   ```
3. Ative o **Modo do desenvolvedor** (no canto superior direito).
4. Clique em **“Carregar sem compactação”** e selecione a pasta do projeto.
5. O ícone da extensão aparecerá na barra de ferramentas.

---

## 🧠 Como Usar

1. Abra o **[WhatsApp Web](https://web.whatsapp.com)**.
2. Entre em **um grupo com contatos visíveis**.
3. Clique no ícone da extensão → **“Extrair”**.
4. Aguarde a geração da tabela.
5. Copie ou baixe os contatos nos formatos disponíveis:

   * **Copiar CSV**
   * **Copiar Markdown**
   * **Baixar CSV**
   * **Baixar Markdown**

---

## 🖼️ Interface

A interface da extensão é compacta e responsiva:

* Botão principal: **Extrair**
* Campo de busca: filtra resultados por número ou DDD
* Contador de contatos com data/hora da última extração
* Notificações (“toast”) para feedback rápido das ações

---

## 📄 Permissões Utilizadas

```json
"permissions": ["scripting", "activeTab", "clipboardWrite"],
"host_permissions": ["https://web.whatsapp.com/*"]
```

Essas permissões permitem:

* Executar o script dentro da aba ativa do WhatsApp Web
* Copiar dados para a área de transferência
* Gerar e baixar arquivos locais

---

## 🧰 Tecnologias

* **HTML5 / CSS3 / JavaScript**
* **Chrome Extensions API (Manifest V3)**
* **XPath + DOM Parsing**
* **Blob + Clipboard API**

---

## 🔒 Aviso Legal

Este projeto é de uso pessoal e educacional.
Ele **não é afiliado, endossado ou mantido pelo WhatsApp Inc.**
O uso desta extensão é de responsabilidade do usuário — respeite a privacidade e as políticas da plataforma.

---

## 🧑‍💻 Autor

Desenvolvido por **Kauan Sena**

---

## 🏷️ Licença

Este projeto é distribuído sob a licença **MIT**.
Você pode usá-lo, modificá-lo e redistribuí-lo livremente, desde que mantenha os créditos originais.
