import type { SVGProps } from 'react';
import { ProvisionalIcon } from './ProvisionalIcon';

export function CategorySweetsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <ProvisionalIcon {...props}>
      <path d="M12 21.5V15" />
      <path d="M12 15C7.6 12.8 7.2 6 12 2.8C16.9 6.1 16.3 12.9 12 15Z" />
      <path d="M12 15C10.2 12.2 10.1 6.4 12 2.8" />
      <path d="M12 15C13.9 12.3 13.8 6.3 12 2.8" />
    </ProvisionalIcon>
  );
}
