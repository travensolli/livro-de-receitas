import type { SVGProps } from 'react';
import { ProvisionalIcon } from './ProvisionalIcon';

export function MenusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <ProvisionalIcon {...props}>
      <path d="M3 17.5h18" />
      <path d="M4.8 17.2c.4-4.6 3.4-7.6 7.2-7.6s6.8 3 7.2 7.6" />
      <path d="M12 9.6V7.8M10.8 7.6h2.4" />
    </ProvisionalIcon>
  );
}
