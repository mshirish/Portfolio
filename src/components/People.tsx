import { Fragment, type ReactNode } from "react"
import type { Person } from "../data/projects"
import { ExternalLink } from "./ExternalLink"

function joined(items: ReactNode[]) {
  return items.map((item, i) => (
    <Fragment key={i}>
      {i > 0 && (i === items.length - 1 ? " and " : ", ")}
      {item}
    </Fragment>
  ))
}

/** Names joined naturally; a name is a link only when it has an href. */
export function PeopleList({ people, linkClassName }: { people: Person[]; linkClassName: string }) {
  return (
    <>
      {joined(
        people.map((person) =>
          person.href ? (
            <ExternalLink key={person.name} href={person.href} className={linkClassName}>
              {person.name}
            </ExternalLink>
          ) : (
            person.name
          ),
        ),
      )}
    </>
  )
}

/** Links each person's name (full, or first name) at its first appearance in the text. */
export function TextWithPeopleLinked({
  text,
  people,
  linkClassName,
}: {
  text: string
  people: Person[]
  linkClassName: string
}) {
  const hits = people
    .filter((person): person is Person & { href: string } => Boolean(person.href))
    .map((person) => {
      const match = [person.name, person.name.split(" ")[0]].find((n) => text.includes(n))
      return match ? { at: text.indexOf(match), match, href: person.href } : null
    })
    .filter((hit) => hit !== null)
    .sort((a, b) => a.at - b.at)

  const parts: ReactNode[] = []
  let cursor = 0
  for (const hit of hits) {
    if (hit.at < cursor) continue // overlapping match: keep the earlier one
    parts.push(text.slice(cursor, hit.at))
    parts.push(
      <ExternalLink key={hit.at} href={hit.href} className={linkClassName}>
        {hit.match}
      </ExternalLink>,
    )
    cursor = hit.at + hit.match.length
  }
  parts.push(text.slice(cursor))
  return <>{parts}</>
}
