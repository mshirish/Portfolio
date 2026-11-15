import type { IconType } from "react-icons"
// Simple Icons removed the AWS and C# logos at the trademark owners' request, so those
// two come from Font Awesome (FaAws) and Tabler (TbBrandCSharp) instead.
import { FaAws } from "react-icons/fa"
import { TbBrandCSharp } from "react-icons/tb"
import { SiDocker, SiGithub, SiJavascript, SiPostgresql, SiPython, SiTerraform } from "react-icons/si"

export interface SkillItem {
  name: string
  icon: IconType
  /** Icon color on hover. At least 3:1 against the surface #18181C. */
  color: string
}

export interface SkillGroup {
  label: string
  items: SkillItem[]
}

// Adding a skill: one line in its group (plus its icon import). Contrast vs #18181C in comments.
export const skillGroups: SkillGroup[] = [
  {
    label: "Cloud & DevOps",
    items: [
      { name: "AWS", icon: FaAws, color: "#FF9900" }, // 8.27:1
      { name: "Terraform", icon: SiTerraform, color: "#8651C1" }, // brand #7B42BC is 2.82:1; lightened to 3.34:1
      { name: "Docker", icon: SiDocker, color: "#2496ED" }, // 5.61:1
    ],
  },
  {
    label: "Languages",
    items: [
      { name: "Python", icon: SiPython, color: "#3776AB" }, // 3.66:1
      { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" }, // 13.09:1
      { name: "C#", icon: TbBrandCSharp, color: "#9B4F96" }, // 3.33:1
    ],
  },
  {
    label: "Data & tools",
    items: [
      { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" }, // 3.65:1
      { name: "GitHub", icon: SiGithub, color: "#F2F2EF" }, // text color; brand black would vanish. 15.78:1
    ],
  },
]
