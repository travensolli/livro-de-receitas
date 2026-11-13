import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

export type ButtonVariant = 'action' | 'brand' | 'outline';

interface CommonProps {
  /** `action`: laranja com texto escuro; `brand`: verde com texto branco; `outline`: borda ferro. */
  variant?: ButtonVariant;
}

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

/** Botão com altura mínima de 44 px. Com `href`, vira um link com a mesma aparência. */
export function Button(props: ButtonProps) {
  if (props.href !== undefined) {
    const { variant = 'action', className, ...rest } = props;
    return <a className={classes(variant, className)} {...rest} />;
  }
  const { variant = 'action', className, type = 'button', ...rest } = props;
  return <button type={type} className={classes(variant, className)} {...rest} />;
}

function classes(variant: ButtonVariant, extra?: string) {
  return [styles.button, styles[variant], extra].filter(Boolean).join(' ');
}
