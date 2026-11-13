import type { SVGProps } from 'react';
import { ProvisionalIcon } from './ProvisionalIcon';

export function TimeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <ProvisionalIcon {...props}>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M12 7.6v4.8l3.2 2" />
    </ProvisionalIcon>
  );
}
