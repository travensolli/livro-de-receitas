import type { SVGProps } from 'react';
import { ProvisionalIcon } from './ProvisionalIcon';

export function ServingsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <ProvisionalIcon {...props}>
      <circle cx="12.6" cy="12.5" r="6" />
      <circle cx="12.6" cy="12.5" r="3.2" />
      <path d="M2.8 4.5v4.2c0 1 .7 1.6 1.4 1.6M5.6 4.5v4.2c0 1-.7 1.6-1.4 1.6M4.2 10.3v9.2" />
      <path d="M21.4 4.4c-1.2 1.2-1.6 3.6-1.4 6.2h1.4v9" />
    </ProvisionalIcon>
  );
}
