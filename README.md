# ReadQR - Leitor de QR Codes para Chrome

![Ícone](qr-code.png)

## Descrição

**ReadQR** é uma extensão para Chrome que detecta QR codes visíveis em imagens na aba ativa do navegador, extrai os links contidos e exibe em uma tabela organizada para fácil acesso.

Além disso, permite abrir uma **janela fixa** com os resultados, para que você possa manter os links visíveis enquanto navega, facilitando abrir vários QR codes com rapidez — evitando que tenhamos que correr para localizar o celular quando estivermos naquela reunião importante.

---

## Funcionalidades

- Varre todas as imagens visíveis da aba ativa e identifica QR codes.
- Mostra os links encontrados em uma tabela, nomeando-os como QR 1, QR 2, etc.
- Permite abrir uma janela fixa popup com a lista de QR codes para consulta contínua (ideal quando há mais de um QR code ativo no momento).
- Exibe uma mensagem quando nenhum QR code é detectado ou está ilegível.
- Suporte para múltiplos QR codes em diferentes posições na página.
- Exportação simples via copiar e colar (caso precise salvar o link para enviar no chat de uma reunião, por exemplo).
- Interface estilizada com tema rosa, agradável e legível.

---

## Como usar

1. Instale a extensão no Chrome (carregue como extensão de desenvolvedor).
2. Clique no ícone da extensão para abrir a janela.
3. A extensão fará uma varredura automática e listará os QR codes encontrados na página atual.
4. Clique no botão **Abrir janela fixa** para abrir uma janela popup persistente com os QR codes — essa janela não será fechada ao mudar de página ou clicar em um link.
5. Abra os links clicando diretamente na tabela.

---

## Arquivos do projeto

- `manifest.json` — configurações da extensão.
- `index.html` — interface principal da extensão.
- `script.js` — lógica para captura e leitura dos QR codes, e comunicação entre janelas.
- `style.css` — estilos da interface.
- `jsQR.js` — biblioteca para leitura de QR codes.
- `qr-code-64_ico.png` — ícone da extensão.
- `qr-code-128_ico.png` — ícone da página da extensão.

---

## Desenvolvimento

- Utiliza a API `chrome.scripting` para injetar script na aba ativa.
- Processamento assíncrono dos QR codes para maior desempenho.
- Armazenamento temporário no `chrome.storage.local` para comunicação entre janelas.
- Ordenação dos QR codes com base na posição dos elementos (top-down, left-right).

---

## Requisitos

- Navegador Chrome ou Chromium compatível com Manifest V3.
- Permissões para `activeTab`, `scripting` e `storage` ativadas.

---

## Melhorias futuras

- Suporte para exportação direta em XLSX.
- Opção para copiar toda a tabela com um clique.
- Interface configurável (tema, tamanho da janela).
- Leitura de QR codes em vídeos ou via webcam (com permissões adicionais).

---

## Licença

Este projeto é open-source e gratuito para uso e modificação.

---

## Contato

Para dúvidas, sugestões ou contribuições, abra uma issue ou envie uma mensagem.

---

Obrigado por usar o **ReadQR**! 🚀
