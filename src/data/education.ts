export interface Education {
  degree: string
  school: string
  schoolHref: string
  location: string
  date: string
}

export const education: Education[] = [
  {
    degree: "Master of Science in Computer Science (STEM)",
    school: "Clark University",
    schoolHref: "https://www.clarku.edu",
    location: "Worcester, MA",
    date: "Expected Dec 2026",
  },
  {
    degree: "Bachelor of Information Technology (Computing)",
    school: "London Metropolitan University",
    schoolHref: "https://www.londonmet.ac.uk",
    location: "Kathmandu, Nepal",
    date: "Jun 2023",
  },
]
