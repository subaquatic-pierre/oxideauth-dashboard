/**
 * Detail pages are fully client-rendered (SWR against the live API), so ids
 * are unknown at build time. An empty param list satisfies the static-export
 * requirement; the page renders entirely at runtime.
 */
import MembershipDetail from "./membership-detail"

export function generateStaticParams() {
  // Client-rendered route; a placeholder param satisfies the static-export
  // requirement so at least one page is generated per dynamic route.
  return [{ id: "placeholder" }]
}

export default function Page() {
  return <MembershipDetail />
}
