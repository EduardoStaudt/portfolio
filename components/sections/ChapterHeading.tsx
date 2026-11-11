import { cn } from '@/lib/cn';

type Props = {
  id: string;
  kicker: string;
  title: string;
  lead?: string;
  className?: string;
  align?: 'left' | 'center';
};

/** Cabeçalho de capítulo: selo "Capítulo N" + título em pincel. */
export function ChapterHeading({ id, kicker, title, lead, className, align = 'left' }: Props) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      <p
        className={cn(
          'font-bubble bg-ink text-paper inline-block px-2.5 py-1 text-[0.72rem]',
          align === 'center' ? 'self-center' : 'self-start',
        )}
      >
        {kicker}
      </p>
      <h2 id={id} className="text-(length:--fs-3xl)">
        {title}
      </h2>
      {lead && <p className="max-w-xl text-base opacity-80">{lead}</p>}
    </div>
  );
}
