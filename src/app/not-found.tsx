import type { Metadata } from 'next';
import { PaginaSecundaria } from '@/components/layout/PaginaSecundaria';
import { Botao } from '@/components/ui/Botao';
import { institucional } from '@/content/institucional';

export const metadata: Metadata = {
  title: `${institucional.naoEncontrada.titulo} | Mitata Alimentos`,
};

export default function NaoEncontrada() {
  return (
    <PaginaSecundaria
      titulo={institucional.naoEncontrada.titulo}
      apoio={institucional.naoEncontrada.texto}
      faixa={
        <Botao variante="primario" href="/">
          {institucional.voltar}
        </Botao>
      }
    />
  );
}
