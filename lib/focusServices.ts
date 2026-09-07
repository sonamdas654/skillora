import type { ServiceCategory } from "./services";

/**
 * Focused service pages.
 *
 * These are things Skilloura already does, but which people search for by
 * their own name rather than under a broad category. Someone looking for
 * "website speed optimization" does not search "website development", and
 * landing them on a page about building a whole new site answers the wrong
 * question.
 *
 * They are deliberately NOT part of `serviceCategories`:
 *
 *   - the homepage, the footer, /pricing and the services tabs keep showing
 *     the nine real categories, so the positioning does not get diluted into
 *     seventeen things
 *   - /services/[slug] resolves both lists, so each of these still gets the
 *     full service-page template, sitemap entry and schema
 *   - each one names its parent category and links back to it
 *
 * Nothing here is invented. Every page is backed by something that already
 * exists in the repo — a priced package, a working demo, or a published
 * guide — and that backing is named in `evidence` so it can be checked.
 *
 * Deliberately NOT created: /services/iot-automation. There is no IoT
 * capability or content anywhere in this codebase, so a page for it would be
 * a doorway page.
 */
export interface FocusService extends ServiceCategory {
  /** The category in `serviceCategories` this belongs under. */
  parentSlug: string;
  /** What in this repo already backs the claim. Not rendered; for review. */
  evidence: string;
}

const yesNo = ["Yes", "No"];
const yesNoNotSure = ["Yes", "No", "Not sure"];

export const focusServices: FocusService[] = [
  // ─────────────────────────────────────────────────────────────
  {
    slug: "ecommerce-development",
    parentSlug: "website-development",
    evidence:
      "web-ecommerce demo, ecommerce-concept portfolio build, ecommerce-website-for-small-sellers-india guide, Ecommerce Website package at ₹24,500",
    name: "Ecommerce Website Development",
    shortName: "Ecommerce",
    tab: "Website",
    icon: "briefcase",
    description:
      "Online stores with a real product catalogue, cart, checkout and payment gateway — plus the admin panel to run it yourself once it is live.",
    startingPrice: "₹24,500",
    timeline: "10–20 days",
    bestFor: "Sellers who are losing margin to marketplace commission",
    outcome:
      "Sell directly to your own customers, keep the full margin, and own the customer relationship instead of renting it from a marketplace.",
    exampleProject:
      "A handmade goods store with 60 products, UPI and card checkout, and an admin panel the owner updates herself.",
    services: [
      "Product catalogue with categories and variants",
      "Cart and checkout flow",
      "Payment gateway integration (Razorpay / UPI / cards)",
      "Order management admin panel",
      "Shipping and delivery charge rules",
      "Coupon and discount codes",
      "Customer accounts and order history",
      "Inventory and stock tracking",
      "WhatsApp order notifications",
      "Product search and filters",
      "Abandoned-cart follow-up",
      "Ecommerce SEO setup",
    ],
    whoFor: [
      "Sellers currently paying 15–30% commission on every marketplace order",
      "Brands with their own products who only sell through Instagram DMs",
      "Shops that want repeat customers to order directly",
      "Businesses ready to handle their own packing and shipping",
      "Anyone who needs stock and orders in one place instead of a notebook",
    ],
    whatYouGet: [
      "A store built around your actual catalogue, not a template demo",
      "Payment gateway connected and tested with real test transactions",
      "An admin panel you can add products and change prices in",
      "Order, customer and stock views that make sense without training",
      "Mobile-first checkout, because that is where most orders come from",
      "Shipping rules set up for the areas you actually deliver to",
      "Full source code and hosting handover",
    ],
    needFromYou: [
      "Product list with names, prices and at least one photo each",
      "Your business PAN/GST details for the payment gateway",
      "Shipping areas and charges, or a courier partner if you have one",
      "Any existing brand assets — logo, colours, packaging photos",
      "A decision on whether you want customer accounts or guest checkout",
    ],
    packages: [
      {
        name: "Starter Store",
        price: "₹24,500+",
        features: [
          "Up to 50 products",
          "Cart and checkout",
          "One payment gateway",
          "Admin panel",
          "Basic ecommerce SEO",
        ],
        delivery: "10–14 days",
        revisions: "2 revisions",
      },
      {
        name: "Growth Store",
        price: "₹42,000+",
        features: [
          "Unlimited products with variants",
          "Coupons and discount rules",
          "Customer accounts and order history",
          "Stock tracking",
          "WhatsApp order alerts",
          "Shipping rules by area",
        ],
        delivery: "18–25 days",
        revisions: "3 revisions",
        highlighted: true,
      },
      {
        name: "Custom Commerce",
        price: "Custom",
        features: [
          "Multi-vendor or subscription models",
          "ERP or accounting integration",
          "Custom checkout logic",
          "Milestone payments",
        ],
        delivery: "Based on scope",
      },
    ],
    formFields: [
      { key: "business_name", label: "Business / brand name", type: "text", required: true },
      { key: "product_count", label: "Roughly how many products?", type: "select", required: true, options: ["Under 20", "20–50", "50–200", "200+", "Not sure yet"] },
      { key: "selling_now", label: "Where do you sell today?", type: "multiselect", options: ["Marketplace (Amazon/Flipkart/Meesho)", "Instagram or WhatsApp", "Physical shop only", "Own website already", "Not selling yet"] },
      { key: "payment_gateway", label: "Do you have a payment gateway account?", type: "select", options: [...yesNoNotSure] },
      { key: "product_photos_ready", label: "Are product photos ready?", type: "select", options: [...yesNoNotSure] },
      { key: "need_variants", label: "Do products have sizes/colours (variants)?", type: "select", options: [...yesNo] },
      { key: "shipping_area", label: "Where do you deliver?", type: "text", placeholder: "e.g. all India, or Odisha only" },
      { key: "reference_stores", label: "Any stores whose experience you like?", type: "textarea", placeholder: "Paste links" },
    ],
    faqs: [
      {
        q: "Do I still need Amazon or Instagram if I have my own store?",
        a: "Usually yes, and that is fine. Marketplaces are good at discovery — people who have never heard of you find you there. Your own store is where repeat customers should buy, because there you keep the full margin and the customer's contact details. Most sellers run both: marketplaces for reach, own store for regulars.",
      },
      {
        q: "Which payment gateway do you set up?",
        a: "Razorpay by default, because it supports UPI, cards, netbanking and wallets in one integration and settles to an Indian current account. If you already use another provider we integrate that instead. Gateway fees are charged by the provider, not by us.",
      },
      {
        q: "Can I add products myself afterwards?",
        a: "Yes. Every store ships with an admin panel for adding products, changing prices and viewing orders, plus a short recorded walkthrough. You should not need us to change a price.",
      },
      {
        q: "What does it cost to run after launch?",
        a: "Hosting and domain are the only fixed costs on our side of the line, and both are billed by the provider directly to you. The payment gateway charges a percentage per transaction. Maintenance is optional and quoted separately.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "web-app-development",
    parentSlug: "website-development",
    evidence: "Custom Web App package inside website-development, web-saas demo, soft-portal demo",
    name: "Web Application Development",
    shortName: "Web apps",
    tab: "Website",
    icon: "code",
    description:
      "Browser-based applications with logins, roles, dashboards and real business logic — the kind of tool a team uses every day, not a brochure site.",
    startingPrice: "₹45,000",
    timeline: "3–10 weeks",
    bestFor: "Teams outgrowing spreadsheets and shared folders",
    outcome:
      "Replace the spreadsheet-and-WhatsApp workflow with one tool your team actually logs into, with permissions and a real audit trail.",
    exampleProject:
      "A client portal where customers log in to see project status, approve quotes and download invoices.",
    services: [
      "User accounts, login and password reset",
      "Role-based permissions",
      "Admin panel and internal dashboards",
      "Data entry forms with validation",
      "File upload and document storage",
      "Reporting and CSV export",
      "Email and WhatsApp notifications",
      "Third-party API integration",
      "Audit logs and activity history",
      "Multi-user collaboration",
    ],
    whoFor: [
      "Teams running the business on shared spreadsheets",
      "Businesses that need customers or staff to log in and do something",
      "Founders validating an idea who need a real, working first version",
      "Operations that have outgrown off-the-shelf software",
      "Anyone re-keying the same data into three different places",
    ],
    whatYouGet: [
      "A working application, not a clickable prototype",
      "Login, roles and permissions built in from the start",
      "A staging URL to test on before anything goes live",
      "Database design documented, so a future developer can pick it up",
      "Deployment set up on your own hosting account",
      "Source code in a repository transferred to you",
      "A recorded walkthrough of the admin side",
    ],
    needFromYou: [
      "A description of the workflow as it happens today, even if it is messy",
      "Who the different types of user are and what each should be allowed to do",
      "Any existing spreadsheets or data to migrate",
      "Decisions on the handful of rules only you can decide",
      "One person available to review the staging build",
    ],
    packages: [
      {
        name: "MVP Build",
        price: "₹45,000+",
        features: [
          "One core workflow, done properly",
          "Login and two user roles",
          "Admin panel",
          "Deployed and handed over",
        ],
        delivery: "3–5 weeks",
        revisions: "2 revisions",
      },
      {
        name: "Business Application",
        price: "₹95,000+",
        features: [
          "Multiple workflows and roles",
          "Reporting and exports",
          "Notifications",
          "One external API integration",
          "Audit logging",
        ],
        delivery: "6–10 weeks",
        revisions: "3 revisions",
        highlighted: true,
      },
      {
        name: "Platform",
        price: "Custom",
        features: [
          "Multi-tenant or complex permissions",
          "Several integrations",
          "Milestone payments",
          "Full architecture documentation",
        ],
        delivery: "Based on scope",
      },
    ],
    formFields: [
      { key: "business_name", label: "Business name", type: "text", required: true },
      { key: "problem_today", label: "How is this handled today?", type: "textarea", required: true, placeholder: "e.g. three Excel sheets and a WhatsApp group" },
      { key: "user_types", label: "Who will use it?", type: "multiselect", options: ["Internal staff", "Customers", "Vendors or partners", "Admin only"] },
      { key: "user_count", label: "Roughly how many users?", type: "select", options: ["Under 10", "10–50", "50–200", "200+", "Not sure"] },
      { key: "needs_login", label: "Do users need to log in?", type: "select", options: [...yesNo] },
      { key: "has_data", label: "Is there existing data to migrate?", type: "select", options: [...yesNoNotSure] },
      { key: "integrations", label: "Anything it must connect to?", type: "textarea", placeholder: "e.g. Tally, Razorpay, Google Sheets" },
    ],
    faqs: [
      {
        q: "How is this different from a website?",
        a: "A website presents information to visitors. A web application does work: people log in, enter and change data, and the system enforces rules about who can do what. That difference is most of the cost — the interface is the small part, the logic and permissions are the real build.",
      },
      {
        q: "Can we start small and add to it?",
        a: "That is the recommended way. The MVP package deliberately covers one workflow end to end rather than half of five. Once it is in real use you find out which of your original ideas actually mattered, and the next phase is scoped from evidence instead of guesses.",
      },
      {
        q: "Who owns the code?",
        a: "You do. The repository is transferred to your account at handover, along with hosting and database access. There is no arrangement where the application stops working if you stop working with us.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "website-redesign",
    parentSlug: "website-development",
    evidence: "brand-refresh concept, website-vs-instagram-page and what-to-prepare guides, Business Website package",
    name: "Website Redesign",
    shortName: "Redesign",
    tab: "Website",
    icon: "palette",
    description:
      "Rebuilding an existing site that looks dated, loads slowly or does not bring enquiries — keeping what works and the search rankings you already have.",
    startingPrice: "₹18,000",
    timeline: "7–15 days",
    bestFor: "Businesses with a site that no longer matches how good they are",
    outcome:
      "A site that looks current, loads fast on a phone and actually asks visitors to get in touch — without losing the Google rankings you already earned.",
    exampleProject:
      "A ten-year-old consultancy site rebuilt mobile-first, with every old URL redirected so nothing dropped out of search.",
    services: [
      "Full visual redesign",
      "Mobile-first rebuild",
      "Content migration from the old site",
      "301 redirect mapping for every old URL",
      "Speed and Core Web Vitals work",
      "Enquiry and WhatsApp capture",
      "SEO structure carried over and improved",
      "Analytics and Search Console setup",
      "Accessibility fixes",
    ],
    whoFor: [
      "Sites that look older than the business actually is",
      "Anyone whose site is unusable on a phone",
      "Businesses getting traffic but almost no enquiries",
      "Sites nobody can update without calling a developer",
      "Anyone stuck on a platform they cannot get their content out of",
    ],
    whatYouGet: [
      "A redesign based on what your current site does and does not do",
      "Every existing page mapped to a new one, or redirected properly",
      "Content moved across — you do not rewrite everything from scratch",
      "A measurable before-and-after on speed",
      "Search Console checked after launch so nothing quietly disappears",
      "Full ownership of the new site",
    ],
    needFromYou: [
      "Access to the current site, or at least its URL",
      "Whatever analytics you have, even if you have never opened it",
      "What you believe is wrong with the current site",
      "Any pages or content that must not change",
      "Access to the domain and hosting when it is time to go live",
    ],
    packages: [
      {
        name: "Refresh",
        price: "₹18,000+",
        features: [
          "Same structure, new design",
          "Mobile-first rebuild",
          "Content migrated",
          "Redirects handled",
        ],
        delivery: "7–10 days",
        revisions: "2 revisions",
      },
      {
        name: "Rebuild",
        price: "₹32,000+",
        features: [
          "New structure and page plan",
          "Speed and Core Web Vitals work",
          "SEO structure improved",
          "Analytics and Search Console setup",
          "Enquiry capture built in",
        ],
        delivery: "12–18 days",
        revisions: "3 revisions",
        highlighted: true,
      },
      {
        name: "Replatform",
        price: "Custom",
        features: [
          "Moving off a platform you are locked into",
          "Large content migration",
          "Custom functionality rebuilt",
          "Milestone payments",
        ],
        delivery: "Based on scope",
      },
    ],
    formFields: [
      { key: "current_url", label: "Your current website address", type: "text", required: true, placeholder: "https://" },
      { key: "main_problem", label: "What bothers you most about it?", type: "textarea", required: true },
      { key: "page_count", label: "Roughly how many pages?", type: "select", options: ["1–5", "6–15", "16–40", "40+", "Not sure"] },
      { key: "current_platform", label: "What is it built on, if you know?", type: "text", placeholder: "e.g. WordPress, Wix, custom" },
      { key: "keep_content", label: "Should the existing content be kept?", type: "select", options: ["Keep it as-is", "Keep most, improve some", "Rewrite everything", "Not sure"] },
      { key: "has_analytics", label: "Do you have Google Analytics or Search Console?", type: "select", options: [...yesNoNotSure] },
      { key: "has_rankings", label: "Does the site currently rank for anything you care about?", type: "select", options: [...yesNoNotSure] },
    ],
    faqs: [
      {
        q: "Will a redesign hurt my Google rankings?",
        a: "It can, and that is exactly what the redirect mapping is for. Every URL on the old site is mapped to its equivalent on the new one before launch, so links and rankings carry across. Where a page genuinely no longer exists, it redirects to the closest relevant page rather than the homepage. We check Search Console after launch rather than assuming it went fine.",
      },
      {
        q: "Do I have to rewrite all my content?",
        a: "No. Content migration is included, and most redesigns keep the substance and change the presentation. We will point out anything that reads badly or is clearly out of date, but rewriting is your call, not a requirement.",
      },
      {
        q: "My site is on Wix/GoDaddy and I want to move off it.",
        a: "That is the Replatform scope. The complication is never the design, it is getting content and URLs out cleanly — some platforms make that harder than others. We check what is actually exportable before quoting, so the price reflects the real work.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "website-maintenance",
    parentSlug: "website-development",
    evidence: "lib/maintenancePlans.ts — three priced tiers already offered on /pricing",
    name: "Website Maintenance & Support",
    shortName: "Maintenance",
    tab: "Website",
    icon: "shield",
    description:
      "Ongoing updates, backups, security patches and small changes, so a site that was built well stays that way after launch.",
    startingPrice: "₹1,999",
    timeline: "Monthly",
    bestFor: "Anyone whose site is running but nobody is looking after it",
    outcome:
      "Someone is responsible for your site staying up, staying patched and staying current — including sites we did not originally build.",
    exampleProject:
      "A clinic site on a monthly plan: content updates, plugin patching, backups and a quarterly speed check.",
    services: [
      "Security updates and patching",
      "Regular backups with tested restores",
      "Uptime monitoring",
      "Content and image updates",
      "Small design and layout changes",
      "Broken link and form checks",
      "Speed monitoring",
      "SSL and domain renewal reminders",
      "Monthly summary of what was done",
    ],
    whoFor: [
      "Businesses with no one internally responsible for the site",
      "Anyone whose developer has become unreachable",
      "Sites that need regular content or price updates",
      "Owners who want backups that have actually been tested",
      "Anyone who found out their SSL expired from a customer",
    ],
    whatYouGet: [
      "A named person responsible, not a ticket queue",
      "Backups taken on a schedule and verified, not assumed",
      "Updates applied on a staging copy first where the platform allows",
      "A monthly note of what changed — no invisible work",
      "Included change hours, with anything larger quoted before it starts",
      "Plans available for sites we did not build, after a health check",
    ],
    needFromYou: [
      "Hosting, domain and CMS access",
      "One point of contact for approving changes",
      "Content or images when you want something updated",
      "Notice before anything time-critical, like a campaign launch",
    ],
    packages: [
      {
        name: "Basic Care",
        price: "₹1,999",
        period: "/month",
        features: ["Security updates", "Monthly backup", "Uptime monitoring"],
        delivery: "Monthly",
      },
      {
        name: "Business Care",
        price: "₹4,999",
        period: "/month",
        features: [
          "Everything in Basic",
          "Weekly backups",
          "Content updates (2 hours)",
          "Broken link and form checks",
          "Monthly report",
        ],
        delivery: "Monthly",
        highlighted: true,
      },
      {
        name: "Growth Care",
        price: "₹9,999",
        period: "/month",
        features: [
          "Everything in Business",
          "Content updates (6 hours)",
          "Speed monitoring",
          "Quarterly SEO check",
          "Priority response",
        ],
        delivery: "Monthly",
      },
    ],
    formFields: [
      { key: "site_url", label: "Website address", type: "text", required: true, placeholder: "https://" },
      { key: "built_by_us", label: "Did Skilloura build this site?", type: "select", options: [...yesNo] },
      { key: "platform", label: "What is it built on?", type: "text", placeholder: "e.g. WordPress, Next.js, Shopify" },
      { key: "update_frequency", label: "How often do you need changes?", type: "select", options: ["Rarely", "A few times a month", "Weekly", "Not sure yet"] },
      { key: "current_problems", label: "Anything wrong with it right now?", type: "textarea" },
      { key: "has_backups", label: "Are backups being taken today?", type: "select", options: [...yesNoNotSure] },
    ],
    faqs: [
      {
        q: "Can you maintain a site you did not build?",
        a: "Usually yes. It starts with a health check — we look at the platform, how it was built and what state it is in, then quote. Occasionally we find a site built in a way that cannot be maintained safely, and we will tell you that instead of taking a monthly fee for something we cannot actually keep stable.",
      },
      {
        q: "What counts as an included change?",
        a: "Content edits, image swaps, price and text updates, adding a page in an existing layout, small styling changes. New features, new page types and redesigns are project work and are quoted separately before anything starts.",
      },
      {
        q: "Is hosting included?",
        a: "No. Hosting and domain stay in your own accounts and are billed to you directly by the provider. That is deliberate: it means you can end a maintenance plan without losing access to your own site.",
      },
      {
        q: "Can I cancel?",
        a: "Monthly, with no lock-in. Backups and access are yours; nothing is held back.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "website-speed-optimization",
    parentSlug: "website-development",
    evidence: "Speed optimization is a Premium Website package feature; Core Web Vitals work is part of every build",
    name: "Website Speed Optimization",
    shortName: "Speed",
    tab: "Website",
    icon: "spark",
    description:
      "Making an existing site load fast on a real phone on a real connection — measured before and after, against Google's Core Web Vitals.",
    startingPrice: "₹12,000",
    timeline: "3–7 days",
    bestFor: "Sites that lose visitors before the page even appears",
    outcome:
      "Pages that appear quickly and respond immediately, measured with the same numbers Google uses to rank you.",
    exampleProject:
      "A restaurant site cut from 6.8s to 1.4s largest-contentful-paint on 4G, mostly by fixing images and fonts.",
    services: [
      "Core Web Vitals audit (LCP, INP, CLS)",
      "Image compression and modern formats",
      "Responsive image sizing",
      "Font loading strategy",
      "Unused JavaScript and CSS removal",
      "Caching and CDN configuration",
      "Third-party script audit",
      "Layout shift fixes",
      "Server response time review",
      "Before-and-after measurement report",
    ],
    whoFor: [
      "Sites that take several seconds to show anything on mobile",
      "Anyone whose Search Console flags Core Web Vitals",
      "Stores losing customers at the checkout because it feels slow",
      "Sites that got slower every time a plugin or tracker was added",
      "Anyone running ads to a page that is slow to load",
    ],
    whatYouGet: [
      "A measured starting point, not an opinion",
      "The actual causes ranked by how much each one costs you",
      "Fixes applied, not just a list of recommendations",
      "A before-and-after report with the same test conditions both times",
      "Notes on what will make it slow again, so it does not regress",
      "Everything applied to your own site and hosting",
    ],
    needFromYou: [
      "Access to the site's code or CMS",
      "Hosting and CDN access if changes are needed there",
      "A list of tracking and marketing scripts you must keep",
      "Permission to remove anything that turns out to be unused",
    ],
    packages: [
      {
        name: "Speed Audit",
        price: "₹12,000+",
        features: [
          "Core Web Vitals measurement",
          "Ranked list of causes",
          "Written fix plan",
          "No code changes",
        ],
        delivery: "3 days",
      },
      {
        name: "Audit + Fix",
        price: "₹24,000+",
        features: [
          "Everything in the audit",
          "Fixes applied",
          "Images, fonts and scripts optimised",
          "Caching configured",
          "Before-and-after report",
        ],
        delivery: "5–7 days",
        revisions: "1 review round",
        highlighted: true,
      },
      {
        name: "Deep Performance",
        price: "Custom",
        features: [
          "Large or complex sites",
          "Server and database work",
          "Rendering strategy changes",
          "Ongoing monitoring",
        ],
        delivery: "Based on scope",
      },
    ],
    formFields: [
      { key: "site_url", label: "Which page is slow?", type: "text", required: true, placeholder: "https://" },
      { key: "platform", label: "What is the site built on?", type: "text", placeholder: "e.g. WordPress, Shopify, custom" },
      { key: "where_slow", label: "Where do you notice it most?", type: "multiselect", options: ["On mobile", "On desktop", "First load only", "Checkout or forms", "Everywhere"] },
      { key: "has_search_console", label: "Do you have Google Search Console access?", type: "select", options: [...yesNoNotSure] },
      { key: "can_change_code", label: "Can we change the site's code?", type: "select", options: ["Yes, full access", "CMS only", "Not sure"] },
      { key: "required_scripts", label: "Any tracking or marketing scripts that must stay?", type: "textarea", placeholder: "e.g. Meta Pixel, Google Ads, chat widget" },
    ],
    faqs: [
      {
        q: "What score will I get?",
        a: "We do not promise a number, and you should be sceptical of anyone who does — lab scores move around depending on the test device and connection. What we commit to is measuring the same way before and after and showing you the real difference, with Core Web Vitals thresholds as the target: LCP under 2.5s, INP under 200ms, CLS under 0.1.",
      },
      {
        q: "Is a fast site actually better for rankings?",
        a: "Core Web Vitals are a real ranking signal, but a small one — relevance and content matter far more. The stronger argument is conversion: people leave slow pages, and that shows up in enquiries long before it shows up in rankings.",
      },
      {
        q: "Why did my site get slower over time?",
        a: "Almost always added weight: uncompressed images, extra tracking scripts, a chat widget, a few plugins. Each one seems small. The audit ranks them by actual cost so you can decide what is worth keeping.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "api-integration",
    parentSlug: "custom-software",
    evidence: "soft-api demo concept; API integration is listed under custom-software and website-development",
    name: "API & System Integration",
    shortName: "Integrations",
    tab: "Software",
    icon: "code",
    description:
      "Connecting the tools you already pay for so data moves between them automatically, instead of someone copying it across by hand.",
    startingPrice: "₹15,000",
    timeline: "3–15 days",
    bestFor: "Businesses re-entering the same data in two or more systems",
    outcome:
      "Your systems talk to each other, so the same information is entered once and appears everywhere it is needed.",
    exampleProject:
      "Website enquiries flowing straight into a CRM and a WhatsApp alert, with no one copying names into a sheet.",
    services: [
      "Payment gateway integration",
      "CRM and lead-tool connections",
      "WhatsApp Business API",
      "Google Sheets and Drive automation",
      "Accounting and invoicing sync",
      "Email and SMS providers",
      "Calendar and booking systems",
      "Custom middleware between two systems",
      "Webhook handling and retries",
      "Error alerting when a sync fails",
    ],
    whoFor: [
      "Anyone exporting from one system to import into another",
      "Teams where a lead can sit unseen because it arrived in the wrong place",
      "Businesses paying for good tools that do not talk to each other",
      "Anyone whose automation breaks silently and nobody notices",
      "Operations that need one number both systems agree on",
    ],
    whatYouGet: [
      "A working connection, tested with real data",
      "Failure handling — retries, and an alert when something does not go through",
      "A written note of what syncs, in which direction, and how often",
      "Credentials stored properly, not pasted into a script",
      "A way to see what synced and what did not",
      "Documentation another developer can maintain",
    ],
    needFromYou: [
      "Accounts and API access for both systems",
      "A clear description of which direction data should flow",
      "Which system is the source of truth when the two disagree",
      "Someone available to test with real records",
    ],
    packages: [
      {
        name: "Single Integration",
        price: "₹15,000+",
        features: [
          "One connection, one direction",
          "Error handling and alerts",
          "Tested with live data",
          "Documented",
        ],
        delivery: "3–6 days",
      },
      {
        name: "Workflow Integration",
        price: "₹35,000+",
        features: [
          "Multiple systems connected",
          "Two-way sync where needed",
          "Custom transformation rules",
          "Monitoring dashboard",
        ],
        delivery: "8–15 days",
        highlighted: true,
      },
      {
        name: "Custom Middleware",
        price: "Custom",
        features: [
          "Purpose-built service between systems",
          "Queue and retry handling",
          "Scheduled and event-driven syncs",
          "Milestone payments",
        ],
        delivery: "Based on scope",
      },
    ],
    formFields: [
      { key: "system_a", label: "Which system holds the data now?", type: "text", required: true, placeholder: "e.g. website form, Tally, Google Sheet" },
      { key: "system_b", label: "Where should it end up?", type: "text", required: true, placeholder: "e.g. CRM, WhatsApp, accounting" },
      { key: "direction", label: "Which way should data flow?", type: "select", options: ["One direction", "Both directions", "Not sure"] },
      { key: "frequency", label: "How current does it need to be?", type: "select", options: ["Instantly", "Every few minutes", "Hourly", "Daily is fine"] },
      { key: "has_api_access", label: "Do you have API access or admin rights on both?", type: "select", options: [...yesNoNotSure] },
      { key: "volume", label: "Roughly how many records a day?", type: "select", options: ["Under 50", "50–500", "500–5000", "5000+", "Not sure"] },
    ],
    faqs: [
      {
        q: "What if one of my tools has no API?",
        a: "It happens, especially with older Indian accounting and billing software. There are usually workarounds — scheduled file exports, database access, or in the worst case a small bridge tool. We check what is genuinely possible before quoting, rather than promising a connection that cannot exist.",
      },
      {
        q: "What happens when a sync fails?",
        a: "It is designed to fail visibly. Failed records are retried, and if they still do not go through you get an alert rather than silence. Silent failure is the worst outcome in an integration, because you keep trusting data that stopped updating weeks ago.",
      },
      {
        q: "Do I pay for the tools themselves?",
        a: "Yes — API access, WhatsApp Business messaging and similar are billed by the provider directly to you. We tell you those running costs before you commit, not after.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "seo",
    parentSlug: "digital-marketing",
    evidence: "SEO Starter package in digital-marketing, mkt-seo demo, google-business-profile-setup-guide",
    name: "SEO Services",
    shortName: "SEO",
    tab: "Marketing",
    icon: "megaphone",
    description:
      "Making a site findable for what customers actually search — technical fixes, page structure and content, measured in Search Console rather than promises.",
    startingPrice: "₹8,000",
    timeline: "Setup 5–10 days, then ongoing",
    bestFor: "Businesses invisible for the things they are good at",
    outcome:
      "People searching for what you do find you, and you can see exactly which searches brought them.",
    exampleProject:
      "A clinic site restructured around the treatments people actually search, with Search Console set up so the owner can see it working.",
    services: [
      "Technical SEO audit and fixes",
      "Keyword and search-intent research",
      "Page structure and internal linking",
      "Title and meta description writing",
      "Structured data (schema) implementation",
      "Sitemap and robots configuration",
      "Core Web Vitals fixes",
      "Content plan built from real searches",
      "Google Search Console setup and monitoring",
      "Monthly reporting on impressions, clicks and position",
    ],
    whoFor: [
      "Sites that rank for their own brand name and nothing else",
      "Businesses whose competitors appear for searches they should own",
      "Anyone who has been sold SEO before and shown no evidence",
      "New sites that need the foundations set up correctly",
      "Businesses with good content nobody can find",
    ],
    whatYouGet: [
      "An audit that names specific pages and specific problems",
      "Fixes implemented, not handed over as a to-do list",
      "A keyword map showing which page targets which search, so pages stop competing with each other",
      "Search Console configured and explained, so you can check the work yourself",
      "Monthly reporting on impressions, clicks and average position",
      "Plain answers about what SEO cannot do",
    ],
    needFromYou: [
      "Access to the website and its CMS or code",
      "Google Search Console and Analytics access, or permission to set them up",
      "A list of services or products you most want to be found for",
      "Any locations you serve",
      "Patience — search results move over months, not days",
    ],
    packages: [
      {
        name: "SEO Foundation",
        price: "₹8,000+",
        features: [
          "Technical audit and fixes",
          "Title and meta optimisation",
          "Sitemap, robots and schema",
          "Search Console setup",
        ],
        delivery: "5–10 days",
      },
      {
        name: "SEO Growth",
        price: "₹15,000",
        period: "/month",
        features: [
          "Everything in Foundation",
          "Keyword and intent research",
          "Content plan and briefs",
          "Internal linking work",
          "Monthly reporting",
        ],
        delivery: "Ongoing",
        highlighted: true,
      },
      {
        name: "Competitive SEO",
        price: "Custom",
        features: [
          "Large or multi-location sites",
          "Content production",
          "Digital PR and earned links",
          "Migration support",
        ],
        delivery: "Based on scope",
      },
    ],
    formFields: [
      { key: "site_url", label: "Website address", type: "text", required: true, placeholder: "https://" },
      { key: "target_searches", label: "What should people find you for?", type: "textarea", required: true, placeholder: "The words a customer would actually type" },
      { key: "target_area", label: "Where are your customers?", type: "text", placeholder: "e.g. Bhubaneswar, all India, worldwide" },
      { key: "has_search_console", label: "Do you have Search Console set up?", type: "select", options: [...yesNoNotSure] },
      { key: "previous_seo", label: "Has anyone done SEO on this site before?", type: "select", options: [...yesNoNotSure] },
      { key: "competitors", label: "Who shows up instead of you?", type: "textarea", placeholder: "Paste links if you know them" },
    ],
    faqs: [
      {
        q: "Can you guarantee first place on Google?",
        a: "No, and nobody can. Anyone who guarantees a ranking is either guessing or planning to rank you for something nobody searches. What is committable is the work: the technical foundation, the structure, the content plan, and measurement in Search Console so you can see impressions and clicks moving.",
      },
      {
        q: "How long before I see anything?",
        a: "Technical fixes can show up in weeks. Ranking for competitive terms takes months, and for a brand-new site longer still. The first honest signal is impressions in Search Console rising — that means Google is showing you more often, which comes before clicks.",
      },
      {
        q: "Do I need to write blog posts?",
        a: "Only if the searches you want require them. Some businesses win on service pages and a Google Business Profile alone. Content is a means, not the goal — we suggest it where the search results actually reward it.",
      },
      {
        q: "Is this different from local SEO?",
        a: "Related but not the same. Local SEO is about appearing in map results and 'near me' searches, and depends heavily on your Google Business Profile. If most of your customers are nearby, start there — see the local SEO page.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "local-seo",
    parentSlug: "digital-marketing",
    evidence: "mkt-maps demo, google-business-profile-setup-guide, Google Business Profile setup in digital-marketing",
    name: "Local SEO & Google Business Profile",
    shortName: "Local SEO",
    tab: "Marketing",
    icon: "globe",
    description:
      "Getting a business into map results and 'near me' searches — profile, categories, photos, reviews and the local signals that decide who appears.",
    startingPrice: "₹6,000",
    timeline: "3–7 days, then ongoing",
    bestFor: "Businesses whose customers are nearby",
    outcome:
      "You appear when someone nearby searches for what you do, with the right hours, the right phone number and photos that make them choose you.",
    exampleProject:
      "A salon set up on Google Maps with correct categories, service list and a review flow — found by people searching a kilometre away.",
    services: [
      "Google Business Profile setup or claim",
      "Category and service selection",
      "Business description and attributes",
      "Photo and cover strategy",
      "Service area configuration",
      "Hours, including holiday hours",
      "Review request flow",
      "Review response templates",
      "Local citation consistency (NAP)",
      "Location-relevant page content",
      "Insights reporting",
    ],
    whoFor: [
      "Shops, clinics, salons, gyms, restaurants and studios",
      "Service businesses that travel to customers",
      "Anyone whose competitor appears on Maps and they do not",
      "Businesses with an old profile showing wrong hours or a dead number",
      "Anyone who has never asked a happy customer for a review",
    ],
    whatYouGet: [
      "A profile set up properly — the primary category alone decides a lot",
      "Consistent name, address and phone wherever you are listed",
      "A photo set that shows the actual place, not stock images",
      "A repeatable way to ask for reviews that does not feel awkward",
      "Response templates for good and bad reviews",
      "Insights explained: what people searched, and whether they called",
    ],
    needFromYou: [
      "Access to your Google Business Profile, or the ability to verify it",
      "Correct address, phone number and hours",
      "Photos of the place, the team and the work",
      "The list of services you want to appear for",
      "A willingness to ask real customers for reviews",
    ],
    packages: [
      {
        name: "Profile Setup",
        price: "₹6,000+",
        features: [
          "Profile created or claimed",
          "Categories and services",
            "Description and attributes",
          "Photo upload and ordering",
        ],
        delivery: "3–5 days",
      },
      {
        name: "Local Growth",
        price: "₹10,000",
        period: "/month",
        features: [
          "Everything in Setup",
          "Citation consistency",
          "Review request flow",
          "Weekly posts",
          "Monthly Insights report",
        ],
        delivery: "Ongoing",
        highlighted: true,
      },
      {
        name: "Multi-location",
        price: "Custom",
        features: [
          "Several branches",
          "Location pages on the website",
          "Bulk profile management",
          "Consolidated reporting",
        ],
        delivery: "Based on scope",
      },
    ],
    formFields: [
      { key: "business_name", label: "Business name as customers know it", type: "text", required: true },
      { key: "business_type", label: "What kind of business?", type: "text", required: true, placeholder: "e.g. dental clinic, gym, bakery" },
      { key: "city", label: "City or area you serve", type: "text", required: true },
      { key: "has_profile", label: "Do you already have a Google Business Profile?", type: "select", options: ["Yes, I manage it", "Yes, but I can't access it", "No", "Not sure"] },
      { key: "has_storefront", label: "Do customers visit you, or do you go to them?", type: "select", options: ["They visit us", "We go to them", "Both"] },
      { key: "branches", label: "How many locations?", type: "select", options: ["One", "2–5", "6+"] },
      { key: "has_photos", label: "Do you have photos of the place?", type: "select", options: [...yesNoNotSure] },
    ],
    faqs: [
      {
        q: "Why does my competitor show on Maps and I don't?",
        a: "Most often one of three things: their primary category matches the search better, they have more and more recent reviews, or their profile is simply more complete. Proximity matters too and you cannot change that — but category, reviews and completeness are all fixable.",
      },
      {
        q: "Can you get me reviews?",
        a: "We can build the flow that asks for them — the right moment, the right message, a direct link — and write templates for responding. We will not write fake reviews or buy them. Beyond the ethics, Google removes them and it puts your profile at risk.",
      },
      {
        q: "I don't have a shop customers visit. Can I still appear?",
        a: "Yes. Service-area businesses can list without showing a street address, defining the areas you cover instead. The setup is different, so tell us which applies before we start.",
      },
      {
        q: "Someone else controls my listing. Can that be fixed?",
        a: "Usually. Google has a reclaim process for profiles created by a former agency or an ex-employee. It takes time and needs proof the business is yours, and we will tell you honestly if it looks unlikely.",
      },
    ],
  },
];

export function getFocusService(slug: string) {
  return focusServices.find((s) => s.slug === slug);
}

export const focusServiceSlugs = focusServices.map((s) => s.slug);
