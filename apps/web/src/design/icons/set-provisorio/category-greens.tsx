import type { SVGProps } from 'react';
import { ProvisionalIcon } from './ProvisionalIcon';

export function CategoryGreensIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <ProvisionalIcon {...props}>
      <path d="M5 19.2C4.6 10.6 10.4 4.8 19.4 4.6c.3 8.8-5.6 14.8-14.4 14.6z" />
      <path d="M5 19.2 14.8 9.4" />
    </ProvisionalIcon>
  );
}
