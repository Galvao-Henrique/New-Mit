import { Clock, MapPin, WhatsappLogo } from '@phosphor-icons/react/dist/ssr';
import { Logo } from '@/components/ui/Logo';
import { site } from '@/config/site';
import { home } from '@/content/home';
import { whatsappUrl } from '@/lib/whatsapp';
import { AnoAtual } from './AnoAtual';

const foco = 'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-dourado';
const linkBase = `inline-flex min-h-11 items-center gap-3 font-texto text-creme transition-colors hover:text-dourado ${foco}`;
const link = `${linkBase} text-base`;
const linkPequeno = `${linkBase} text-sm`;
const titulo = 'font-texto text-[13px] font-semibold uppercase tracking-[0.3em] text-dourado';

export function Rodape({ base = '' }: { base?: string }) {
  const { rodape } = home;
  const novaAba = <span className="sr-only"> {rodape.abreNovaAba}</span>;
  return (
    <footer className="border-t border-dourado/20 bg-marinho text-creme">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1.6fr] lg:gap-16 lg:px-10">
        <div>
          <Logo versao="creme" formato="horizontal" className="h-12 w-auto" />
          <p className="mt-6 max-w-xs font-texto text-base leading-relaxed text-creme/85">{rodape.resumo}</p>
        </div>

        <nav aria-label={rodape.rotuloNav}>
          <p className={titulo}>{rodape.tituloMenu}</p>
          <ul className="mt-4 grid gap-1">
            {home.navegacao.map((item) => (
              <li key={item.href}>
                <a href={`${base}${item.href}`} className={link}>
                  {item.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className={titulo}>{home.comoComprar.rotulo}</p>
          <ul className="mt-4 grid gap-1">
            <li>
              <a href={site.endereco.mapsUrl} target="_blank" rel="noopener noreferrer" className={link}>
                <MapPin size={22} weight="light" aria-hidden="true" className="shrink-0 text-dourado" />
                <span>
                  {site.endereco.exibicao}
                  {novaAba}
                </span>
              </a>
            </li>
            <li>
              <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className={link}>
                <WhatsappLogo size={22} weight="light" aria-hidden="true" className="shrink-0 text-dourado" />
                <span>
                  {site.whatsapp.exibicao}
                  {novaAba}
                </span>
              </a>
            </li>
            <li className="flex min-h-11 items-center gap-3 font-texto text-base text-creme">
              <Clock size={22} weight="light" aria-hidden="true" className="shrink-0 text-dourado" />
              {site.horario.exibicao}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-creme/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-10">
          <p className="font-texto text-sm text-creme/80">
            © <AnoAtual /> {site.nome}
          </p>
          <ul className="flex flex-wrap gap-x-6">
            <li>
              <a href="/creditos" className={linkPequeno}>
                {rodape.creditos}
              </a>
            </li>
            <li>
              <a href="/privacidade" className={linkPequeno}>
                {rodape.privacidade}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
