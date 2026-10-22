import awsSolutionsArchitectAssociate from "../assets/certifications/aws-solutions-architect-associate.webp"

export interface Certification {
  name: string
  issuer: string
  credentialUrl: string
  badge: string
}

export const certifications: Certification[] = [
  {
    name: "AWS Certified Solutions Architect – Associate",
    issuer: "Amazon Web Services",
    credentialUrl:
      "https://www.credly.com/badges/a2e5555c-2f4a-4548-aa6a-e70eecef1511",
    badge: awsSolutionsArchitectAssociate,
  },
]
