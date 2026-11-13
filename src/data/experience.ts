export interface Role {
  title: string
  start: string
  end: string
  summary: string
}

export interface ExperienceItem {
  company: string
  companyHref?: string
  location: string
  roles: Role[]
}

export const experience: ExperienceItem[] = [
  {
    company: "AMNIL Technologies",
    location: "Lalitpur, Nepal",
    roles: [
      {
        title: "Associate Software Engineer",
        start: "Apr 2024",
        end: "Dec 2024",
        summary:
          "Built ASP.NET Core APIs and AngularJS dashboards for a healthcare platform, and delivered a biometric verification system for a banking client in three weeks.",
      },
      {
        title: "Software Engineering Intern",
        start: "Jan 2024",
        end: "Mar 2024",
        summary:
          "Built REST APIs and shipped an employee mood check-in feature for an intranet app used by 200+ employees.",
      },
    ],
  },
  {
    company: "Clover Tech Nepal",
    location: "Kathmandu, Nepal",
    roles: [
      {
        title: "DevOps Intern",
        start: "Apr 2023",
        end: "Aug 2023",
        summary:
          "Helped containerize and deploy six .NET Core services to AWS, cutting deployment time from about an hour to 15 minutes.",
      },
    ],
  },
]
