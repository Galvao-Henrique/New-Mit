import Image from 'next/image';
import { logos } from '@/assets/logos';

type LogoProps = {
  versao: 'azul' | 'creme';
  formato: 'horizontal' | 'circular';
  className?: string;
};

export function Logo({ versao, formato, className }: LogoProps) {
  return (
    <Image
      src={logos[formato][versao]}
      alt="Mitata Alimentos"
      className={className}
      sizes="(min-width: 768px) 240px, 160px"
    />
  );
}
