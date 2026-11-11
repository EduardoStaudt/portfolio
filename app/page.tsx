import { Cover } from '@/components/sections/Cover';
import { About } from '@/components/sections/About';
import { Skills } from '@/components/sections/Skills';
import { Projects } from '@/components/sections/Projects';
import { Research } from '@/components/sections/Research';
import { Contact } from '@/components/sections/Contact';
import { links, site } from '@/lib/data/site';

// dados estruturados para buscadores
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: site.name,
  url: site.url,
  description: site.description,
  sameAs: [links.linkedin, links.github],
  knowsAbout: ['Machine Learning', 'Redes neurais', 'Next.js', 'Pixel art', 'Economia'],
};

export default function Home() {
  return (
    <main id="conteudo">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Cover />
      <About />
      <Projects />
      <Skills />
      <Research />
      <Contact />
    </main>
  );
}
