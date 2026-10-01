import type { Metadata } from 'next';
import { pendente, site } from '@/config/site';

/** Endereço público do site, sem barra no final; `null` enquanto o domínio estiver pendente. */
export function urlDoSite(dominioConfigurado: string = site.dominio): string | null {
  if (pendente(dominioConfigurado)) return null;
  const dominio = dominioConfigurado.replace(/\/+$/, '');
  return /^https?:\/\//.test(dominio) ? dominio : `https://${dominio}`;
}

/**
 * Base para resolver as URLs dos metadados (og:image etc.): o domínio, quando definido;
 * senão o domínio de produção da Vercel, se existir; senão o endereço local de testes.
 */
export function baseDosMetadados(
  env: Record<string, string | undefined> = process.env,
  dominioConfigurado: string = site.dominio,
): URL {
  const url = urlDoSite(dominioConfigurado);
  if (url) return new URL(url);
  const vercel = env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return new URL(`https://${vercel}`);
  return new URL('http://localhost:3217');
}

/** Endereço canônico da página (`alternates` dos metadados); nenhum enquanto o domínio estiver pendente. */
export function canonico(
  caminho: string,
  dominioConfigurado: string = site.dominio,
): Metadata['alternates'] | undefined {
  const url = urlDoSite(dominioConfigurado);
  return url ? { canonical: `${url}${caminho}` } : undefined;
}

/** Dados estruturados (LocalBusiness). Campos pendentes ou desconhecidos ficam de fora. */
export function dadosEstruturados(): Record<string, unknown> {
  const { endereco, horario, entrega } = site;
  const url = urlDoSite();

  const address: Record<string, unknown> = {
    '@type': 'PostalAddress',
    streetAddress: endereco.logradouro,
    addressLocality: endereco.cidade,
    addressRegion: endereco.uf,
    addressCountry: endereco.pais,
  };
  if (!pendente(endereco.cep)) address.postalCode = endereco.cep;

  const dados: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: site.nome,
    description: 'Atacado de bovinos, suínos, aves e linguiças com entrega diária no Vale do Paraíba.',
    telephone: site.whatsapp.telefoneE164,
    address,
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: horario.dias,
      opens: horario.abre,
      closes: horario.fecha,
    },
    areaServed: { '@type': 'AdministrativeArea', name: entrega.area },
  };
  if (endereco.geo) {
    dados.geo = {
      '@type': 'GeoCoordinates',
      latitude: endereco.geo.latitude,
      longitude: endereco.geo.longitude,
    };
  }
  if (url) dados.url = url;
  return dados;
}
