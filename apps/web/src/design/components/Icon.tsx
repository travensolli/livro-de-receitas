import { createElement } from 'react';
import { getIcon, type IconName } from '../icons/registry';

export interface IconProps {
  name: IconName;
  /** Lado em pixels. */
  size?: number;
  /**
   * Texto para leitores de tela quando o ícone carrega sentido sozinho. Sem ele, o ícone é
   * decorativo e fica oculto; num botão só com ícone, prefira o aria-label no botão.
   */
  label?: string;
  className?: string;
}

export function Icon({ name, size = 24, label, className }: IconProps) {
  const a11y = label
    ? { role: 'img', 'aria-label': label }
    : { 'aria-hidden': true as const, focusable: false as const };

  // createElement: o componente vem do registro, que é fixo; não é criado durante o render.
  return createElement(getIcon(name), { width: size, height: size, className, ...a11y });
}
