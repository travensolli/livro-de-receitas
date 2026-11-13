import type { SVGProps } from 'react';
import { ProvisionalIcon } from './ProvisionalIcon';

export function CategoryBreadsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <ProvisionalIcon {...props}>
      <path d="M3.8 12.6C3.6 8.4 7.6 5.8 12 5.8s8.6 2.6 8.2 6.8v5.6c0 .7-.5 1.2-1.2 1.2H5c-.7 0-1.2-.5-1.2-1.2z" />
      <path d="M8.6 9.2l1.4 2.2M12.4 8.6l1.4 2.2M16 9.4l1.2 1.9" />
    </ProvisionalIcon>
  );
}
