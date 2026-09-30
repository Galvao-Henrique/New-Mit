type DivisorProps = {
  tom: 'claro' | 'escuro';
  className?: string;
};

/** Linha, círculo e linha. "escuro" = sobre fundo escuro (dourado); "claro" = sobre fundo claro (dourado-escuro). */
export function Divisor({ tom, className = '' }: DivisorProps) {
  const cor = tom === 'escuro' ? 'text-dourado' : 'text-dourado-escuro';
  return (
    <div aria-hidden="true" className={`flex items-center justify-center gap-4 ${cor} ${className}`}>
      <span className="h-px w-16 bg-current" />
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" focusable="false">
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="10" cy="10" r="3" fill="currentColor" />
      </svg>
      <span className="h-px w-16 bg-current" />
    </div>
  );
}
