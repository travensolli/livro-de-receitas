import type { SVGProps } from 'react';
import { ProvisionalIcon } from './ProvisionalIcon';

export function CategoryPotIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <ProvisionalIcon {...props}>
      <path d="M4.2 10.2h15.6l-.4 6.3a2.8 2.8 0 0 1-2.8 2.6H7.4a2.8 2.8 0 0 1-2.8-2.6z" />
      <path d="M2 11.4h2.2M19.8 11.4H22" />
      <path d="M5.8 10c1.6-2.6 10.6-2.8 12.4 0" />
      <path d="M12 7.2V5.6" />
    </ProvisionalIcon>
  );
}
