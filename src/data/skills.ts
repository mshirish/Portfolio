import type { IconType } from "react-icons"
import {
  SiReact,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiNodedotjs,
  SiFigma,
} from "react-icons/si"

export interface SkillItem {
  name: string
  icon: IconType
}

export const skills: SkillItem[] = [
  { name: "React", icon: SiReact },
  { name: "TypeScript", icon: SiTypescript },
  { name: "JavaScript", icon: SiJavascript },
  { name: "Tailwind CSS", icon: SiTailwindcss },
  { name: "Node.js", icon: SiNodedotjs },
  { name: "Figma", icon: SiFigma },
]
