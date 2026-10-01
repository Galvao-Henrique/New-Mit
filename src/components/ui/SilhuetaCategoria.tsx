import type { CategoriaSlug } from '@/types/catalogo';
import { contornos, linguica, VIEWBOX_SILHUETA } from './silhuetas';

type SilhuetaCategoriaProps = {
  categoria: CategoriaSlug;
  className?: string;
};

/** Desenho em linha do animal da categoria, em dourado. Só enfeite: fica escondido dos leitores de tela. */
export function SilhuetaCategoria({ categoria, className = '' }: SilhuetaCategoriaProps) {
  const comum = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    vectorEffect: 'non-scaling-stroke',
  } as const;

  return (
    <svg
      viewBox={VIEWBOX_SILHUETA}
      aria-hidden="true"
      focusable="false"
      data-silhueta={categoria}
      className={`text-dourado ${className}`}
    >
      {categoria === 'linguicas' ? (
        <>
          <g {...comum}>
            {linguica.gomos.map((gomo) => (
              <rect key={gomo.transform} x="-38" y="-15" width="76" height="30" rx="15" transform={gomo.transform} />
            ))}
          </g>
          <g {...comum} strokeOpacity={0.55}>
            {linguica.brilhos.map((d) => (
              <path key={d} d={d} />
            ))}
          </g>
          <g fill="currentColor">
            {linguica.amarras.map(({ cx, cy }) => (
              <circle key={cx} cx={cx} cy={cy} r="2.6" />
            ))}
          </g>
        </>
      ) : (
        <>
          {contornos[categoria].fundo && <path d={contornos[categoria].fundo} {...comum} strokeOpacity={0.45} />}
          <path d={contornos[categoria].corpo} {...comum} />
          {contornos[categoria].detalhes.map((detalhe, i) =>
            detalhe.tipo === 'olho' ? (
              <path key={i} d={detalhe.d} fill="currentColor" />
            ) : (
              <path key={i} d={detalhe.d} {...comum} strokeOpacity={0.75} />
            ),
          )}
        </>
      )}
    </svg>
  );
}
