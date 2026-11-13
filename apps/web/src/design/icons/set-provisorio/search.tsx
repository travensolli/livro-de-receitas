import type { SVGProps } from 'react';
import { ProvisionalIcon } from './ProvisionalIcon';

export function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <ProvisionalIcon {...props}>
      <circle cx="10.8" cy="10.8" r="6.2" />
      <path d="M15.4 15.4l5 5" />
    </ProvisionalIcon>
  );
}
