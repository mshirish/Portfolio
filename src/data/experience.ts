export interface ExperienceItem {
  role: string
  company: string
  companyHref: string
  dateRange: string
  description: string
}

export const experience: ExperienceItem[] = [
  {
    role: "Frontend Developer",
    company: "Northlane",
    companyHref: "https://example.com/",
    dateRange: "2024 — PRESENT",
    description:
      "Building the core product UI and design system used across web and mobile.",
  },
  {
    role: "Software Engineer",
    company: "Fernway Labs",
    companyHref: "https://example.com/",
    dateRange: "2022 — 2024",
    description:
      "Shipped client-facing dashboards and internal tooling for a data analytics team.",
  },
  {
    role: "Freelance Developer",
    company: "Self-employed",
    companyHref: "https://example.com/",
    dateRange: "2020 — 2022",
    description:
      "Designed and built websites for small businesses and independent creators.",
  },
]
