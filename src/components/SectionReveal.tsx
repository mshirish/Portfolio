import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion"

/** Single gentle fade + 12px slide-up reveal, once per section, per CLAUDE.md motion rules. */
export function SectionReveal({
  children,
  ...props
}: HTMLMotionProps<"div">) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
