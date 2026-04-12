/**
 * MdxComponents.tsx — Mapping typographique pour le rendu MDX
 *
 * Fourni à `<MDXRemote components={mdxComponents} />`. Les clés
 * remplacent les éléments HTML standards produits par MDX (h2, ul, etc.)
 * par des versions stylées aux tokens Hanami.
 *
 * Les `id` sur h2/h3 sont injectés par `rehype-slug` dans la pipeline
 * MDX — on les laisse passer via `...props`.
 */
import Link from 'next/link'
import type { ComponentPropsWithoutRef } from 'react'

type ElementProps<T extends keyof React.JSX.IntrinsicElements> =
  ComponentPropsWithoutRef<T>

export const mdxComponents = {
  h2: (props: ElementProps<'h2'>) => (
    <h2
      className="font-[family-name:var(--font-fraunces)] text-2xl md:text-3xl font-semibold text-hanami-900 tracking-tight mt-14 mb-5 scroll-mt-28"
      {...props}
    />
  ),
  h3: (props: ElementProps<'h3'>) => (
    <h3
      className="font-[family-name:var(--font-fraunces)] text-xl md:text-2xl font-semibold text-hanami-900 tracking-tight mt-10 mb-3 scroll-mt-28"
      {...props}
    />
  ),
  p: (props: ElementProps<'p'>) => (
    <p className="text-[17px] leading-[1.8] text-stone-700 mb-5" {...props} />
  ),
  ul: (props: ElementProps<'ul'>) => (
    <ul
      className="mb-6 space-y-2 pl-6 list-disc marker:text-hanami-500 text-[17px] leading-[1.8] text-stone-700"
      {...props}
    />
  ),
  ol: (props: ElementProps<'ol'>) => (
    <ol
      className="mb-6 space-y-2 pl-6 list-decimal marker:text-hanami-600 marker:font-semibold text-[17px] leading-[1.8] text-stone-700"
      {...props}
    />
  ),
  li: (props: ElementProps<'li'>) => (
    <li className="pl-1" {...props} />
  ),
  blockquote: (props: ElementProps<'blockquote'>) => (
    <blockquote
      className="my-8 border-l-4 border-hanami-500 bg-hanami-100/40 pl-6 pr-5 py-4 rounded-r-lg italic text-stone-700"
      {...props}
    />
  ),
  strong: (props: ElementProps<'strong'>) => (
    <strong className="font-semibold text-hanami-900" {...props} />
  ),
  em: (props: ElementProps<'em'>) => (
    <em className="italic text-stone-800" {...props} />
  ),
  code: (props: ElementProps<'code'>) => (
    <code
      className="px-1.5 py-0.5 rounded-md bg-stone-100 text-hanami-900 text-[0.92em] font-[family-name:var(--font-space-mono)]"
      {...props}
    />
  ),
  pre: (props: ElementProps<'pre'>) => (
    <pre
      className="my-6 overflow-x-auto rounded-xl bg-stone-900 text-stone-100 p-5 text-sm leading-relaxed font-[family-name:var(--font-space-mono)]"
      {...props}
    />
  ),
  hr: () => <hr className="my-12 border-stone-200" />,
  table: (props: ElementProps<'table'>) => (
    <div className="my-8 overflow-x-auto rounded-xl border border-stone-200">
      <table className="w-full text-sm text-left" {...props} />
    </div>
  ),
  th: (props: ElementProps<'th'>) => (
    <th
      className="px-4 py-3 bg-stone-50 font-semibold text-hanami-900 border-b border-stone-200"
      {...props}
    />
  ),
  td: (props: ElementProps<'td'>) => (
    <td
      className="px-4 py-3 text-stone-700 border-b border-stone-100"
      {...props}
    />
  ),
  a: ({ href = '#', children, className, ...rest }: ElementProps<'a'>) => {
    // Les ancres de titre injectées par rehype-autolink-headings ont la classe
    // "anchor-heading". On les passe telles quelles (sans underline).
    const isAnchorHeading = typeof className === 'string' && className.includes('anchor-heading')
    if (isAnchorHeading) {
      return (
        <a href={href} className={className} {...rest}>
          {children}
        </a>
      )
    }

    const isExternal = /^https?:\/\//.test(href)
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-hanami-700 underline decoration-hanami-500/50 underline-offset-4 hover:decoration-hanami-600 transition-colors"
          {...rest}
        >
          {children}
        </a>
      )
    }
    return (
      <Link
        href={href}
        className="text-hanami-700 underline decoration-hanami-500/50 underline-offset-4 hover:decoration-hanami-600 transition-colors"
      >
        {children}
      </Link>
    )
  },
  img: (props: ElementProps<'img'>) => (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img
      className="my-8 rounded-xl border border-stone-200 w-full h-auto"
      loading="lazy"
      {...props}
    />
  ),
}
