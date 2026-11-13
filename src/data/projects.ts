import levantTable1 from "../assets/projects/levant-table/1.webp"
import levantTable2 from "../assets/projects/levant-table/2.webp"
import levantTable3 from "../assets/projects/levant-table/3.webp"
import levantEvidence1 from "../assets/projects/levant-table/evidence/01-terraform-apply.webp"
import levantEvidence2 from "../assets/projects/levant-table/evidence/02-target-healthy.webp"
import levantEvidence3 from "../assets/projects/levant-table/evidence/03-storefront-over-alb.webp"
import levantEvidence4 from "../assets/projects/levant-table/evidence/04-asg-self-heal.webp"

export interface DiagramNode {
  id: string
  label: string
  sublabel?: string
  /** 0-based grid column, max 3 columns */
  col: number
  row: number
}

export interface DiagramEdge {
  from: string
  to: string
  label?: string
  dashed?: boolean
  /** Arrowheads at both ends */
  twoWay?: boolean
}

export interface CloudView {
  id: string
  tabLabel: string
  title: string
  caption: string
  /** One-line footnote under the diagram */
  note?: string
  nodes: DiagramNode[]
  edges: DiagramEdge[]
}

export interface GalleryItem {
  src: string
  alt: string
  caption: string
  /** Intrinsic size, for width/height attributes */
  width: number
  height: number
}

export interface Project {
  slug: string
  name: string
  subtitle: string
  summary: string
  tech: string[]
  backdrop: string
  images: string[]
  repoUrl: string
  demoUrl?: string
  demoNote?: string
  /** Short cold-start note, shown on the card and beside the demo button */
  wakeNote?: string
  /** Fetched once per page view to wake a sleeping backend */
  warmupUrl?: string
  /** Ordered steps, rendered as a numbered list */
  howItWorks?: string[]
  /** Collaborators, named visibly in the modal */
  credits?: { text: string; name: string; href: string; detail?: string }
  extraLinks?: { label: string; href: string }[]
  gallery?: { title: string; items: GalleryItem[] }
  /** Copy not yet verified against the project's repo. CI refuses to merge drafts. */
  draft?: boolean
  video?: { src: string; poster: string; description: string }
  caseStudy?: {
    overview: string
    built: string[]
    cloud?: { views: CloudView[]; decisions: string[] }
    limitations?: string[]
  }
}

export const projects: Project[] = [
  {
    slug: "levant-table",
    name: "Levant Table",
    subtitle: "Online ordering for a grocery, bakery, butcher and caterer",
    summary:
      "Online ordering with Stripe deposits and pickup scheduling for a four-department food store.",
    tech: ["Python", "Django", "PostgreSQL", "HTMX", "Stripe", "Docker", "Terraform", "AWS"],
    backdrop: "#4E9A51",
    images: [levantTable1, levantTable2, levantTable3],
    repoUrl: "https://github.com/mshirish/Store-Website",
    demoUrl: "https://levant-table.onrender.com",
    demoNote:
      "Stripe test mode: card 4242 4242 4242 4242, any future date, any CVC. Free hosting, so the first load can take about a minute.",
    wakeNote: "Free hosting: the first load can take about a minute.",
    extraLinks: [
      {
        label: "Architecture write-up",
        href: "https://github.com/mshirish/Store-Website/blob/main/ARCHITECTURE.md",
      },
    ],
    gallery: {
      title: "Verification on AWS",
      items: [
        {
          src: levantEvidence1,
          alt: "terraform apply output with alb_dns_name and rds_endpoint",
          caption: "terraform apply: outputs include the load balancer's DNS name",
          width: 572,
          height: 142,
        },
        {
          src: levantEvidence2,
          alt: "store-app-tg target group showing 1 healthy target on HTTP 8000",
          caption: "Target group: the instance healthy on /healthz/",
          width: 1200,
          height: 494,
        },
        {
          src: levantEvidence3,
          alt: "Levant Table storefront loaded from the store-alb DNS name",
          caption: "The storefront served through the load balancer",
          width: 1200,
          height: 726,
        },
        {
          src: levantEvidence4,
          alt: "EC2 instances list: the original store-app instance terminated and a replacement running",
          caption:
            "Self-healing: after an instance was terminated, the Auto Scaling group launched a replacement",
          width: 1200,
          height: 245,
        },
      ],
    },
    caseStudy: {
      overview:
        "Levant Table is a fictional family store whose cake and catering orders ran on phone calls, so orders got missed and large ones no-showed. Customers now order online, pay a deposit that commits the order, and choose a pickup window; staff run every order from the admin back office.",
      built: [
        "Payment confirmation that never trusts the browser: the success redirect, a signed Stripe webhook and a reconcile command (run on demand or on a schedule) all go through one locked function, so each order is confirmed and emailed exactly once.",
        "Four product types that price differently (cakes by size, meat by the pound, groceries by unit, catering by tray or weight), modeled with Django multi-table inheritance.",
        "Orders snapshot prices, tax, the deposit split and the pickup window at checkout, so editing a product later never rewrites an order.",
        "Pickup windows derived from store hours and closures, with a next-open-day rule.",
        "31 tests with Stripe mocked, per-line tax math to the cent, and service logic kept separate from HTTP views.",
      ],
      cloud: {
        views: [
          {
            id: "live",
            tabLabel: "Live today",
            title: "Render + Neon",
            caption:
              "The running demo: one Docker web service on Render, serverless Postgres on Neon, and uploaded media on Cloudflare R2.",
            nodes: [
              { id: "visitor", label: "Visitor", col: 0, row: 0 },
              { id: "render", label: "Render web service", sublabel: "Docker · gunicorn · Django · WhiteNoise", col: 1, row: 0 },
              { id: "stripe", label: "Stripe Checkout", sublabel: "test mode", col: 2, row: 0 },
              { id: "neon", label: "Neon Postgres", sublabel: "serverless · pooled connection", col: 1, row: 1 },
              { id: "r2", label: "Cloudflare R2", sublabel: "uploaded media", col: 2, row: 1 },
            ],
            edges: [
              { from: "visitor", to: "render", label: "HTTPS" },
              { from: "render", to: "neon", label: "DATABASE_URL" },
              { from: "render", to: "r2", label: "S3 API" },
              { from: "render", to: "stripe", label: "checkout · webhook", twoWay: true },
            ],
          },
          {
            id: "aws",
            tabLabel: "AWS",
            title: "ALB + Auto Scaling + RDS",
            caption:
              "Provisioned with Terraform and verified end to end, then torn down to save cost. Recreated with one command.",
            note:
              "Security groups: ALB → app → database, each tier open only to the one before it. VPC across two availability zones.",
            nodes: [
              { id: "visitor", label: "Visitor", col: 0, row: 0 },
              { id: "alb", label: "Application Load Balancer", sublabel: "HTTP :80 · health check /healthz/", col: 1, row: 0 },
              { id: "r2", label: "Cloudflare R2", sublabel: "uploaded media", col: 0, row: 1 },
              { id: "asg", label: "Auto Scaling group", sublabel: "1–2 EC2 instances · Docker · gunicorn", col: 1, row: 1 },
              { id: "stripe", label: "Stripe Checkout", sublabel: "test mode", col: 2, row: 1 },
              { id: "rds", label: "RDS PostgreSQL 16", sublabel: "private subnets · single-AZ", col: 1, row: 2 },
            ],
            edges: [
              { from: "visitor", to: "alb", label: "HTTP :80" },
              { from: "alb", to: "asg", label: ":8000" },
              { from: "asg", to: "rds", label: ":5432" },
              { from: "asg", to: "r2", label: "S3 API" },
              { from: "asg", to: "stripe", label: "checkout", twoWay: true },
            ],
          },
        ],
        decisions: [
          "/healthz/ answers before host checks and never touches the database, so load-balancer probes reach it from a private IP and stay green during a database failover.",
          "Twelve-factor config: every setting comes from environment variables, SECRET_KEY and DATABASE_URL have no insecure fallback, and production security switches on by env var, so the same image runs over HTTP in a lab and HTTPS in production.",
          "Non-root python:3.12-slim container with gunicorn and WhiteNoise; migrations and collectstatic run at startup, so builds need no secrets.",
          "Self-healing recovery: a reconcile command checks every unconfirmed order against Stripe, confirming paid ones and clearing abandoned checkouts.",
        ],
      },
      limitations: [
        "Refunds are manual: cancelling emails the customer, and staff refund the deposit in the Stripe dashboard.",
        "Payments run in Stripe test mode only; it's a public demo and never processes real cards.",
      ],
    },
  },
]
