
import { DocumentHandler } from "./document-handler-factory"
import { textDocumentHandler } from "./text-handler"
import { codeDocumentHandler } from "./code-handler"
import { imageDocumentHandler } from "./image-handler"
import { sheetDocumentHandler } from "./sheet-handler"

/*
 * Use this array to define the document handlers for each artifact kind.
 */
export const documentHandlersByArtifactKind: Array<DocumentHandler> = [
  textDocumentHandler,
  codeDocumentHandler,
  imageDocumentHandler,
  sheetDocumentHandler,
];
