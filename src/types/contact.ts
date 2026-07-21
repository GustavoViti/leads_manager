/**
 * Formato EXATO dos itens dentro dos arquivos exportados do WhatsApp
 * (ex: fontenossa.json e WhatsApp_XXXXXXXXXXXXX.json).
 * Nao alterar os nomes dos campos: eles usam Title Case com espacos
 * porque e assim que a ferramenta de exportacao gera o JSON original.
 */
export interface WhatsAppContact {
  "Country Code": string;
  "Country Name": string;
  "Phone Number": string;
  "Formatted Phone": string;
  "Is My Contact": boolean;
  "Saved Name": string;
  "Public Name": string;
  "Group Name": string;
  "Is Business"?: boolean;
  "Is Blocked": boolean;
  "Labels": string;
  "Last Msg Text": string;
  "Last Msg Date": string;
  "Last Msg Type": string;
  "Last Msg Status": string;
}

/** Um arquivo de leads ou de membros e sempre um array de WhatsAppContact. */
export type WhatsAppContactList = WhatsAppContact[];
