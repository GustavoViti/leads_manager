# WhatsApp Leads Manager

Aplicação desktop (Electron + React + TypeScript + TailwindCSS) para gerenciar leads
extraídos de grupos de WhatsApp e controlar convites enviados/confirmados.

## Como rodar

```bash
npm install
npm run electron:dev
```

Isso sobe o Vite em modo dev e abre a janela do Electron carregando a interface com
hot-reload.

## Como gerar um build de produção

```bash
npm run build   # compila renderer (Vite) + processo main/preload (tsc)
npm start       # roda a versão buildada com Electron
```

Para gerar um instalador (Windows/Mac/Linux) com electron-builder:

```bash
npm run dist
```

## Primeira execução

Na primeira vez que abrir o app, ele vai pedir para você selecionar:

1. **Arquivo de leads** — o JSON com os contatos extraídos de outros grupos
   (ex: `fontenossa.json`).
2. **Arquivo de membros atuais do grupo** — o JSON exportado com os membros do
   seu grupo (ex: `WhatsApp_XXXXXXXXXXXXX.json`).

`enviados.json` e `convertidos.json` **não são escolhidos por você** — eles
sempre vivem numa pasta `state/`, criada automaticamente:

- Em desenvolvimento (`npm run electron:dev`): `state/` na raiz do projeto.
- Em produção (app instalado/empacotado): `state/` ao lado do executável.

Se os arquivos não existirem ainda, o app cria os dois automaticamente com o
formato correto (`{}`). Assim, quem já está em `enviados.json` nunca mais
aparece na lista de leads a enviar, e `convertidos.json` é regravado por
completo toda vez que você roda o comparativo (Tela 2) — não só quando surge
gente nova confirmada.

Os caminhos de leads/membros ficam salvos entre sessões (config interna do
Electron, em `userData`), então você não precisa selecionar de novo toda vez
que abrir o app.

## Estrutura do projeto

```
electron/              processo main do Electron (Node.js)
  main.ts               cria a janela e liga os handlers IPC
  preload.ts             expõe window.api de forma segura (contextBridge)
  fileService.ts          leitura/gravação de JSON, diálogos de arquivo,
                              resolução automática da pasta state/
  ipcHandlers.ts           registra os handlers IPC chamados pelo renderer

src/                    processo renderer (React)
  types/                  tipos TypeScript espelhando EXATAMENTE os JSONs
    contact.ts              formato dos itens de leads/membros
    enviado.ts              formato de enviados.json
    convertido.ts           formato de convertidos.json
    config.ts               tipos internos da UI (linhas de tabela, stats)
  utils/
    phone.ts                normalização e formatação de telefone
    format.ts                formatação de data e percentual
  services/
    dataService.ts           ponte com window.api (leitura/gravação/diálogos)
    compareService.ts        toda a lógica de comparação (leads x membros x
                              enviados x convertidos)
    csvService.ts            geração do CSV de follow-up
  context/
    PathsContext.tsx         caminhos dos arquivos configurados, persistidos
    LeadsDataContext.tsx     estado compartilhado da Tela de Leads
  hooks/
    useLeadsData.ts           dados + ações da Tela 1
    useComparativoData.ts     dados + ações da Tela 2
  components/               peças de UI reutilizáveis (tabelas, cards, busca)
  pages/
    LeadsPage.tsx            Tela 1
    ComparativoPage.tsx      Tela 2
```

## Sobre o parser de telefone

Toda comparação de telefone passa por `normalizePhone()` (em
`src/utils/phone.ts`), que remove qualquer caractere que não seja dígito
(espaços, parênteses, traços, `+`, pontos etc.) antes de comparar. Isso
garante que `+55 (11) 91417-4518`, `5511914174518` e `55 11 9 1417 4518`
sejam tratados como o mesmo contato.

## Persistência

Não há banco de dados. Toda a persistência acontece em arquivos JSON dentro
da pasta `state/` (criada automaticamente ao lado do app):

- **state/enviados.json** — `{ "telefone": { status, em, mensagem?, nome? } }`
- **state/convertidos.json** — `{ "telefone": { nome, dataEnvio, confirmadoEm } }`

Os arquivos de leads e de membros (escolhidos por você) são apenas lidos,
nunca escritos.
