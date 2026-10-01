import { pendente, site } from '@/config/site';

/** Endereço público do site, sem barra no final; `null` enquanto o domínio estiver pendente. */
export function urlDoSite(): string | null {
  if (pendente(site.dominio)) return null;
  const dominio = site.dominio.replace(/\/+$/, '');
  return /^https?:\/\//.test(dominio) ? dominio : `https://${dominio}`;
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
