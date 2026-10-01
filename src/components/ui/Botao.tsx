import type { ReactNode } from 'react';

type BotaoProps = {
  variante: 'primario' | 'contorno';
  /** "escuro" = sobre fundo escuro (dourado); "claro" = sobre o creme (dourado-escuro, que tem contraste). */
  tom?: 'escuro' | 'claro';
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  externo?: boolean;
  /** Nome acessível completo; deve começar pelo texto visível (ex.: "Adicionar à cotação: Pá de Boi"). */
  rotuloAcessivel?: string;
  /** Botão de alternar: expõe o estado em aria-pressed. */
  pressionado?: boolean;
  className?: string;
};

const base =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-sm px-6 py-3 font-texto text-base font-semibold transition-colors lg:min-h-14 lg:px-8 lg:text-[17px] ' +
  'focus-visible:outline-2 focus-visible:outline-offset-4';

const estilos = {
  escuro: {
    foco: 'focus-visible:outline-dourado',
    primario: 'bg-dourado text-marinho hover:bg-creme',
    contorno: 'border-2 border-dourado text-creme hover:bg-dourado hover:text-marinho',
  },
  claro: {
    foco: 'focus-visible:outline-dourado-escuro',
    primario: 'bg-dourado-escuro text-creme hover:bg-tinta',
    contorno: 'border-2 border-dourado-escuro text-tinta hover:bg-dourado-escuro hover:text-creme',
  },
} as const;

export function Botao({
  variante,
  tom = 'escuro',
  children,
  href,
  onClick,
  externo = false,
  rotuloAcessivel,
  pressionado,
  className = '',
}: BotaoProps) {
  const classes = `${base} ${estilos[tom].foco} ${estilos[tom][variante]} ${className}`;

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        onClick={onClick}
        aria-label={rotuloAcessivel}
        {...(externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={classes} onClick={onClick} aria-label={rotuloAcessivel} aria-pressed={pressionado}>
      {children}
    </button>
  );
}
