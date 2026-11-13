import type { SVGProps } from 'react';
import { ProvisionalIcon } from './ProvisionalIcon';

export function PhotoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <ProvisionalIcon {...props}>
      <path d="M4 8.2h3.2L8.8 6h6.4l1.6 2.2H20v10.6H4z" />
      <circle cx="12" cy="13.2" r="3.4" />
    </ProvisionalIcon>
  );
}
