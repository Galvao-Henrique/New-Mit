type JsonLdProps = {
  dados: Record<string, unknown>;
};

/** Dados estruturados em JSON-LD; o "<" é escapado para o texto nunca fechar a tag do script. */
export function JsonLd({ dados }: JsonLdProps) {
  const json = JSON.stringify(dados).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
