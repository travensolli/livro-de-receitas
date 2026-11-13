import type { SVGProps } from 'react';
import { ProvisionalIcon } from './ProvisionalIcon';

export function RecipesIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <ProvisionalIcon {...props}>
      <path d="M3 6.2c3-1.4 6-1.2 9 .8 3-2 6-2.2 9-.8v12.2c-3-1.4-6-1.2-9 .8-3-2-6-2.2-9-.8z" />
      <path d="M12 7v12.2" />
    </ProvisionalIcon>
  );
}
