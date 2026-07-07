export interface Project {
  name: string
  description: string
  meta: string
  href: string
  backdrop: string
  image: string
}

export const projects: Project[] = [
  {
    name: "Nightshift",
    description: "A dark-mode habit tracker with streaks and reminders.",
    meta: "REACT · SUPABASE · 2025",
    href: "https://github.com/",
    backdrop: "#E14C8A",
    image: "/projects/nightshift.png",
  },
  {
    name: "Aster",
    description: "Booking flow redesign for a boutique fitness studio.",
    meta: "NEXT.JS · STRIPE · 2025",
    href: "https://github.com/",
    backdrop: "#4C7CE1",
    image: "/projects/aster.png",
  },
  {
    name: "Fieldwork",
    description: "Home repair and handyman marketplace app.",
    meta: "REACT NATIVE · 2024",
    href: "https://github.com/",
    backdrop: "#26262C",
    image: "/projects/fieldwork.png",
  },
  {
    name: "Mojito",
    description: "Generative cocktail recipes from ingredients on hand.",
    meta: "THREE.JS · GSAP · 2024",
    href: "https://github.com/",
    backdrop: "#3D9970",
    image: "/projects/mojito.png",
  },
  {
    name: "Signalwave",
    description: "Realtime audio visualizer built for live sets.",
    meta: "CANVAS API · 2024",
    href: "https://github.com/",
    backdrop: "#D2691E",
    image: "/projects/signalwave.png",
  },
  {
    name: "design.md",
    description: "Open-source design token linter for Markdown specs.",
    meta: "OPEN SOURCE · 2023",
    href: "https://github.com/",
    backdrop: "#E6B800",
    image: "/projects/design-md.png",
  },
]
