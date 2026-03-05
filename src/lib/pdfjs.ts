const PDFJS_VERSION = '4.4.168';
const PDFJS_CDN_BASE = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}`;

export interface PDFPageProxyLike {
  getViewport: (params: { scale: number }) => { width: number; height: number };
  render: (params: {
    canvasContext: CanvasRenderingContext2D;
    viewport: { width: number; height: number };
  }) => { promise: Promise<void> };
}

export interface PDFDocumentProxyLike {
  numPages: number;
  getPage: (pageNumber: number) => Promise<PDFPageProxyLike>;
}

interface PDFJSLibLike {
  getDocument: (src: string | { data: ArrayBuffer }) => { promise: Promise<PDFDocumentProxyLike> };
  GlobalWorkerOptions: { workerSrc: string };
}

let pdfJsPromise: Promise<PDFJSLibLike> | null = null;

export const loadPdfJs = async (): Promise<PDFJSLibLike> => {
  if (!pdfJsPromise) {
    pdfJsPromise = import(
      /* @vite-ignore */ `${PDFJS_CDN_BASE}/pdf.min.mjs`
    ) as Promise<PDFJSLibLike>;
  }

  const pdfjsLib = await pdfJsPromise;
  pdfjsLib.GlobalWorkerOptions.workerSrc = `${PDFJS_CDN_BASE}/pdf.worker.min.mjs`;

  return pdfjsLib;
};
