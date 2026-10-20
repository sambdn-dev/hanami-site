import type { ComponentPropsWithoutRef } from 'react';

type Props = Omit<ComponentPropsWithoutRef<'a'>, 'href'> & {
  href?: '/boutique' | '/boutique?panier=1';
};

/**
 * The boutique is an independently mounted HTML document on the same domain.
 * A document navigation avoids requesting its HTML as a Next.js RSC payload
 * and keeps its React runtime and global stylesheet isolated from the site.
 */
export default function BoutiqueLink({ href = '/boutique', ...props }: Props) {
  return <a {...props} href={href} />;
}
