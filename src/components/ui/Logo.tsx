import Image from 'next/image';
import { logos } from '@/assets/logos';

type LogoProps = {
  versao: 'azul' | 'creme';
  /** Logo acima da dobra (no topo): carrega já, sem loading="lazy". */
  prioritario?: boolean;
  className?: string;
};

export function Logo({ versao, prioritario = false, className }: LogoProps) {
  return (
    <Image
      src={logos[versao]}
      alt="Mitata Alimentos"
      className={className}
      sizes="(min-width: 768px) 240px, 160px"
      loading={prioritario ? 'eager' : undefined}
    />
  );
}
