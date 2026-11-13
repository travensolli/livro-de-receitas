/** Tamanhos públicos de cada foto: `card` (720 px, na lista) e `page` (1600 px, na receita). */
export type PhotoSize = 'card' | 'page';

/** Monta a URL pública de uma foto a partir da chave dela na camada de armazenamento. */
export type PhotoUrlBuilder = (storageKey: string, size: PhotoSize) => string;

/**
 * Implementação provisória, até a H06 criar o `PhotoStorage`: as versões públicas ficam sob
 * `/fotos/`, servidas pelo Caddy, uma pasta por foto com um WebP por tamanho. A H06 troca esta
 * função pela do `PhotoStorage`, sem mudar as rotas que a recebem.
 */
export const diskPhotoUrl: PhotoUrlBuilder = (storageKey, size) =>
  `/fotos/${storageKey}/${size}.webp`;
