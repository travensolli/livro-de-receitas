import type { ReactNode } from 'react';
import type { IconName } from '../icons/registry';
import { Icon } from './Icon';
import styles from './Meta.module.css';

export interface MetaProps {
  icon: IconName;
  /** O que o valor significa, para leitores de tela ("Tempo de preparo"). */
  label: string;
  children: ReactNode;
}

/** Ícone mais texto, para tempo e rendimento. */
export function Meta({ icon, label, children }: MetaProps) {
  return (
    <span className={styles.meta}>
      <Icon name={icon} size={20} />
      <span className="visually-hidden">{label}: </span>
      <span>{children}</span>
    </span>
  );
}
