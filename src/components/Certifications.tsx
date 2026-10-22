import { certifications } from "../data/certifications"
import { EyebrowLabel } from "./EyebrowLabel"
import { SectionReveal } from "./SectionReveal"

export function Certifications() {
  return (
    <section
      id="certifications"
      aria-labelledby="certifications-heading"
      className="py-28 md:py-40"
    >
      <SectionReveal>
        <EyebrowLabel as="h2" id="certifications-heading">
          Certifications
        </EyebrowLabel>

        <ul className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {certifications.map((cert) => (
            <li key={cert.credentialUrl}>
              <a
                href={cert.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col gap-5 rounded-2xl border border-border bg-surface p-6 transition-[border-color,box-shadow] duration-200 hover:border-accent hover:shadow-lg hover:shadow-black/40 focus-visible:border-accent focus-visible:shadow-lg focus-visible:shadow-black/40 motion-reduce:transition-none sm:flex-row sm:items-center"
              >
                {/* Badges are shown exactly as issued: no filters, cropping or pixelation. */}
                <img
                  src={cert.badge}
                  alt=""
                  width={96}
                  height={96}
                  loading="lazy"
                  decoding="async"
                  className="size-20 shrink-0 transition-transform duration-200 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-focus-visible:-translate-y-0.5 motion-reduce:transition-none md:size-24"
                />

                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                    {cert.issuer}
                  </p>
                  <h3 className="mt-2 font-display text-xl font-semibold tracking-[-0.03em] text-text md:text-2xl">
                    {cert.name}
                  </h3>
                  <p className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">
                    Verify on Credly <span aria-hidden="true">↗</span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </SectionReveal>
    </section>
  )
}
