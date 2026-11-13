import type { ReactNode, SVGProps } from 'react';

interface ProvisionalIconProps extends SVGProps<SVGSVGElement> {
  /** Ícones preenchidos (o coração das favoritas) em vez de traço. */
  filled?: boolean;
  children: ReactNode;
}

/** Moldura comum do conjunto provisório: 24 x 24, traço de 1.8 arredondado em currentColor. */
export function ProvisionalIcon({ filled = false, children, ...props }: ProvisionalIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
}
