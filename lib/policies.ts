export interface PolicySection {
  heading: string;
  points: string[];
}

export interface Policy {
  slug: string;
  title: string;
  description: string;
  intro: string;
  sections: PolicySection[];
}

export const policies: Policy[] = [
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    description: "How Skilloura collects, uses and protects your data and uploaded files.",
    intro:
      "Your trust matters more than your data. This policy explains in plain language what is collected when you use skilloura.com, why, and how it is protected.",
    sections: [
      {
        heading: "What data is collected",
        points: [
          "Contact details you submit: name, email, phone/WhatsApp number, business name and city/country.",
          "Project details: service selection, requirement answers, budget range, deadline and any notes you write.",
          "Files you upload: logos, images, videos, documents and reference material.",
          "Basic analytics: pages visited and general usage patterns (via Google Analytics), never sold or shared for advertising.",
        ],
      },
      {
        heading: "Why data is collected",
        points: [
          "To understand your project requirement and prepare an accurate quotation.",
          "To contact you on your preferred channel (WhatsApp, email or call).",
          "To deliver the project and provide support afterwards.",
          "To improve the website experience.",
        ],
      },
      {
        heading: "How uploaded files are used",
        points: [
          "Files are used only to understand and execute your project.",
          "Files are stored securely and are not publicly accessible.",
          "Files are never shared with third parties except tools strictly required to deliver your project (e.g. hosting your website).",
          "You can request deletion of your files at any time.",
        ],
      },
      {
        heading: "How email/phone is used",
        points: [
          "To respond to your project request or message.",
          "To send project updates, quotations and invoices.",
          "No spam, no cold marketing blasts, and your contact details are never sold.",
        ],
      },
      {
        heading: "Data security",
        points: [
          "The website uses HTTPS encryption.",
          "Admin access is protected by authentication and role-based permissions.",
          "Uploaded files are validated and stored in a private location.",
          "Regular backups protect against data loss.",
        ],
      },
      {
        heading: "Data deletion request",
        points: [
          "Email sonamdasdj00@gmail.com with the request and your submitted details.",
          "Your lead data and files will be permanently deleted within 7 working days, unless legally required for invoicing records.",
        ],
      },
    ],
  },
  {
    slug: "terms",
    title: "Terms & Conditions",
    description: "Terms for using skilloura.com and requesting services.",
    intro:
      "These terms keep the working relationship clear and fair for both sides. By submitting a project request, you agree to the process described here.",
    sections: [
      {
        heading: "Website usage",
        points: [
          "The website is for browsing services and submitting genuine project requests.",
          "Spam, false information or misuse of forms may result in requests being marked as spam and blocked.",
        ],
      },
      {
        heading: "Service request process",
        points: [
          "Submitting a requirement is free and creates no obligation on either side.",
          "A submitted request is a starting point for discussion, not a confirmed order.",
          "Projects are confirmed only after written quotation approval and advance payment.",
        ],
      },
      {
        heading: "Quotation process",
        points: [
          "Quotations are written and include scope, price, timeline, revision count and payment terms.",
          "Quotations are valid for the period mentioned on them (typically 15 days).",
          "Work outside the quoted scope is charged separately, always with prior discussion.",
        ],
      },
      {
        heading: "Payment terms",
        points: [
          "Projects start after 40–50% advance payment.",
          "Final delivery happens after full payment.",
          "Accepted methods: UPI, bank transfer, Razorpay, payment links and invoice-based payment.",
        ],
      },
      {
        heading: "Client responsibility",
        points: [
          "Provide accurate requirements, content and files on time.",
          "Delays in providing content extend the timeline accordingly.",
          "Ensure you have rights to all content and files you share.",
        ],
      },
      {
        heading: "Developer responsibility",
        points: [
          "Deliver work matching the agreed written scope.",
          "Communicate progress and delays honestly.",
          "Keep your files and data secure and confidential.",
        ],
      },
      {
        heading: "Delivery rule",
        points: [
          "A preview/review version is shared before final delivery.",
          "Final delivery (files, access, credentials) happens after final payment.",
          "Source code is included only when specified in the package or agreement.",
        ],
      },
    ],
  },
  {
    slug: "refund-policy",
    title: "Refund Policy",
    description: "When refunds apply and how they are calculated at Skilloura.",
    intro:
      "Digital work cannot be 'returned', so refunds follow milestone logic. This policy is deliberately simple and applied fairly.",
    sections: [
      {
        heading: "Before work starts",
        points: [
          "If you cancel before any work has started, a partial refund of the advance is possible (minus any payment gateway charges and time already spent on planning/research).",
        ],
      },
      {
        heading: "After work has started",
        points: [
          "The advance becomes non-refundable once work begins.",
          "If you cancel midway, the value of completed work is calculated and deducted; any remaining balance from payments made can be refunded.",
        ],
      },
      {
        heading: "Client delays",
        points: [
          "If content or feedback is delayed from your side, the timeline extends — this is not grounds for a refund.",
          "Projects inactive for 30+ days due to client non-response may be closed, with completed work billed.",
        ],
      },
      {
        heading: "After digital delivery",
        points: [
          "Once final files/access are delivered, refunds are not applicable.",
          "Genuine defects in delivered work are fixed free of charge — that's a quality commitment, not a refund matter.",
        ],
      },
      {
        heading: "Custom projects",
        points: [
          "Milestone-based custom projects are refunded based on milestone completion: completed milestones are billable, incomplete ones refundable.",
        ],
      },
    ],
  },
  {
    slug: "revision-policy",
    title: "Revision Policy",
    description: "How many revisions are included and what counts as a revision.",
    intro:
      "Revision means improvement within the agreed scope. A new feature or a complete design change is new work — this line keeps projects fair for both sides.",
    sections: [
      {
        heading: "Included revisions",
        points: [
          "Basic packages: 1 revision.",
          "Standard packages: 2 revisions.",
          "Premium packages: 3 revisions.",
          "Custom projects: as defined in the agreement.",
        ],
      },
      {
        heading: "What counts as one revision",
        points: [
          "A consolidated list of changes submitted together counts as one revision round.",
          "Sending changes one-by-one across days consumes revision rounds faster — collect your feedback, then send.",
        ],
      },
      {
        heading: "What is NOT a revision",
        points: [
          "Adding new features or pages not in the agreed scope.",
          "A complete design direction change after a design was approved.",
          "Changes requested after final approval and delivery.",
        ],
      },
      {
        heading: "Extra revisions",
        points: [
          "Extra revision rounds are available at a fair fixed cost, quoted before the work.",
          "Major scope changes are quoted as new work.",
        ],
      },
    ],
  },
  {
    slug: "payment-policy",
    title: "Payment Policy",
    description: "Advance, milestones, invoices and delivery rules at Skilloura.",
    intro:
      "Clear payment rules protect both sides. Everything here is standard professional practice — and everything is documented with proper invoices.",
    sections: [
      {
        heading: "Advance payment",
        points: [
          "Projects start after a 40–50% advance.",
          "The advance confirms your slot in the work schedule and covers initial work.",
          "Why advance? It filters serious projects and protects work time — the same reason doctors take appointment fees.",
        ],
      },
      {
        heading: "Final payment",
        points: [
          "Due after you approve the preview/review version.",
          "Final delivery — files, credentials, live deployment, source code (if included) — happens after full payment.",
        ],
      },
      {
        heading: "Payment methods",
        points: [
          "UPI, bank transfer, Razorpay, payment link, QR code and invoice-based payment.",
          "International clients: payment link options are available.",
        ],
      },
      {
        heading: "Invoices",
        points: [
          "Every payment gets a proper invoice with amount, project details and payment status.",
          "Invoices show advance paid and balance due — no confusion.",
        ],
      },
      {
        heading: "Late payment",
        points: [
          "Final payment pending 15+ days after preview approval may pause delivery and support.",
          "Urgent-delivery requests may carry an express charge, always agreed before work.",
        ],
      },
      {
        heading: "Delivery after full payment",
        points: [
          "This rule is absolute and protects both sides: you always see working output (preview) before final payment, and delivery always follows full payment.",
        ],
      },
    ],
  },
];

export function getPolicy(slug: string) {
  return policies.find((p) => p.slug === slug);
}
