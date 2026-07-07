import type { IconType } from "react-icons"
import {
  SiReact,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiNodedotjs,
  SiFigma,
} from "react-icons/si"

export interface StackItem {
  name: string
  icon: IconType
}

export const stack: StackItem[] = [
  { name: "React", icon: SiReact },
  { name: "TypeScript", icon: SiTypescript },
  { name: "JavaScript", icon: SiJavascript },
  { name: "Tailwind CSS", icon: SiTailwindcss },
  { name: "Node.js", icon: SiNodedotjs },
  { name: "Figma", icon: SiFigma },
]
