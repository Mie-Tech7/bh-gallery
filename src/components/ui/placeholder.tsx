import { cn } from '@/lib/utils';

/**
 * Marks content that is still waiting on a confirmed fact.
 * Search the code for <Placeholder to find every gap before launch.
 */
export function Placeholder({
  children,
  block = false,
  className,
}: {
  children: React.ReactNode;
  block?: boolean;
  className?: string;
}) {
  const Tag = block ? 'div' : 'span';
  return (
    <Tag
      data-placeholder
      className={cn(
        'border border-dashed border-amber-500 bg-amber-50 text-amber-800 rounded px-1.5 py-0.5 font-sans text-[0.85em]',
        block && 'block px-4 py-3',
        className
      )}
    >
      [ADD: {children}]
    </Tag>
  );
}
