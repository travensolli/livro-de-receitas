import type { SVGProps } from 'react';
import { ProvisionalIcon } from './ProvisionalIcon';

export function FavoriteIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <ProvisionalIcon filled {...props}>
      <path d="M12 20s-7.6-4.6-8.4-9.6C3 7.2 5 5 7.6 5c1.9 0 3.4 1.2 4.4 2.8C13 6.2 14.5 5 16.4 5 19 5 21 7.2 20.4 10.4 19.6 15.4 12 20 12 20z" />
    </ProvisionalIcon>
  );
}
