/**
 * Case studies for the six concept builds.
 *
 * These are honest about what they are. Skilloura is a young studio and does
 * not yet have a shelf of client work it is allowed to publish, so inventing
 * one is not an option — the previous attempt at this site shipped fabricated
 * proof ("Lighthouse 100", "reduces cost by 40%") and that is exactly the kind
 * of claim a prospective client checks and a search engine penalises.
 *
 * What is real here is more useful than a fake client anyway: every one of
 * these six builds exists, runs at /portfolio/<conceptSlug>, and can be poked
 * at by the reader in the same tab. So the case study can do the thing most
 * agency case studies never do — show the reasoning, name the trade-off that
 * was accepted, and let you go and check the artefact.
 *
 * Rules this file follows, without exception:
 *  - No client names, no revenue figures, no "increased conversions by N%".
 *  - Every published number comes from tools/qa/measure.mjs on a production
 *    build, with the date and the conditions attached (DELIVERY_PROFILE).
 *  - Where the demo is a simplification of the real deliverable, the case
 *    study says so in `honestly` rather than letting the reader assume.
 *
 * When real client work lands, it becomes a seventh entry with the same shape
 * and a `client` field; nothing here needs restructuring for that.
 */

export interface CaseStudyDecision {
  /** The decision, phrased as the decision — not as a feature name. */
  title: string;
  body: string;
  /** What was given up. A decision with no cost is a feature list, not a decision. */
  tradeoff: string;
}

export interface CaseStudy {
  slug: string;
  /** The live, explorable build at /portfolio/<conceptSlug>. */
  conceptSlug: string;
  title: string;
  productName: string;
  subtitle: string;
  industry: string;
  /** The money page this study supports. */
  serviceSlug: string;
  summary: string;
  readMinutes: number;
  /** Why this kind of business struggles online. Not about a specific client. */
  situation: string[];
  decisions: CaseStudyDecision[];
  scope: string[];
  /**
   * Technologies only. Deliverables ("admin panel", "lead form") belong in
   * `scope` — the page renders this under a "Built with" heading, where a
   * deliverable reads as a product name and makes the list look padded.
   */
  stack: string[];
  clientProvides: string[];
  timeline: string;
  priceRange: string;
  /** The paragraph that stops a reader assuming more than was built. */
  honestly: string;
  relatedPosts: string[];
  relatedStudies: string[];
}

/**
 * The delivery profile shared by all six builds.
 *
 * It is deliberately one shared block rather than six per-study numbers. All
 * six render from the same app shell and the same JavaScript bundle, so the
 * measured spread between them (1.44s to 1.55s) is run-to-run noise, not a
 * difference between the builds. Publishing six separate figures would imply
 * a precision the measurement does not have.
 *
 * Produced by tools/qa/measure.mjs, median of three valid runs per route
 * against a production build. Re-run it before changing any number here.
 *
 * Server response time is deliberately absent: it was measured against a
 * local server, where it is about 4 ms and completely meaningless as a
 * description of what a visitor experiences.
 */
export const DELIVERY_PROFILE = {
  measuredOn: "2026-09-07",
  conditions:
    "Chromium at 412×915, 4× CPU throttling, 1.6 Mbps with 150 ms latency, cold cache — a mid-range Android phone on a typical Indian mobile network, not a developer's laptop.",
  metrics: [
    {
      label: "Largest contentful paint",
      value: "1.44–1.55s",
      note: "When the main content is actually on screen. Google treats anything under 2.5s as good.",
    },
    {
      label: "Cumulative layout shift",
      value: "0",
      note: "Nothing moves after it appears — no mis-taps caused by a button jumping.",
    },
    {
      label: "JavaScript over the wire",
      value: "259 kB",
      note: "Compressed, as actually sent. The same bundle serves every one of the six builds.",
    },
    {
      label: "Total page weight",
      value: "~441 kB",
      note: "Everything: markup, styles, fonts and scripts.",
    },
  ],
} as const;

export const caseStudies: CaseStudy[] = [
  {
    slug: "restaurant-website-that-takes-orders-on-whatsapp",
    conceptSlug: "restaurant-website-concept",
    title: "A restaurant site where the menu is the homepage",
    productName: "Spice Route",
    subtitle:
      "Building for the three questions every hungry visitor actually arrives with — and refusing to build a checkout nobody asked for.",
    industry: "Restaurant / Food",
    serviceSlug: "website-development",
    summary:
      "A concept restaurant website built around menu-first architecture and WhatsApp ordering, and the reasoning for skipping a cart entirely. Explore the live build and see what it costs.",
    readMinutes: 7,
    situation: [
      "Somebody looking up a restaurant on their phone has three questions, and only three: what do you serve, are you open, and how do I get it. Almost every restaurant website answers a fourth question first — our story, since 1998 — and buries the menu behind a nav link or, worse, behind a PDF that opens in a separate viewer and pinches to nothing on a phone.",
      "The PDF menu is the single most expensive mistake in this category. It cannot be read comfortably on the device most people use, it cannot be indexed as page content, and it can only be updated by whoever owns the design file — so prices go stale and the owner stops trusting the site.",
      "The second mistake is more subtle: building a full ordering system. A restaurant doing twenty orders a day is quoted a cart, a payment gateway and an order-status backend, and ends up paying for infrastructure whose running costs outweigh the margin on the orders it processes.",
    ],
    decisions: [
      {
        title: "The menu is page content, not an attachment",
        body: "The whole menu lives in one structured object in the build — dish, description, price, and a veg/non-veg flag — and the page renders from it. That makes it real text: readable at any size, selectable, and indexable, so a search for a dish name can actually land on the restaurant. It also means changing a price is editing one line, not reopening a design file.",
        tradeoff:
          "Menu changes go through whoever maintains the site rather than being self-service. For a menu that changes seasonally that is fine; a restaurant changing prices weekly should be quoted a small admin panel instead, and told so before the project starts.",
      },
      {
        title: "The veg marker is part of the data model, not a decoration",
        body: "In India this is not a visual flourish — it is the first thing a large share of diners filter on, and getting it wrong is a serious error, not a cosmetic one. So it is a required field on every dish rather than an icon someone remembers to place, which means a dish physically cannot be added without answering the question.",
        tradeoff:
          "Slightly more rigid content entry. Worth it: the alternative failure mode is a mislabelled dish, which is the kind of mistake that ends a customer relationship permanently.",
      },
      {
        title: "Ordering goes to WhatsApp instead of a cart",
        body: "The order button opens a WhatsApp conversation with the restaurant. No account, no card entry, no abandoned-cart funnel — and the customer is already in the app they use all day. For the restaurant there is no gateway fee on each order, no payment data to secure, and no separate dashboard to learn: orders arrive where staff already look.",
        tradeoff:
          "No automated order tracking, no online payment capture, and no sales reporting — those need the ecommerce build, which starts at roughly twice the price. This is the right call at twenty orders a day and the wrong one at two hundred, and the honest version of this conversation happens before the quote, not after.",
      },
      {
        title: "Table booking is a structured request, not a live calendar",
        body: "The booking form collects date, time and party size and sends it as a message a human confirms. A real-time reservation system needs live table state, which needs someone maintaining that state all evening — a job restaurants of this size do not have staff for, and an unmaintained calendar is worse than no calendar.",
        tradeoff:
          "The diner does not get instant confirmation. In exchange the restaurant never double-books, never shows availability it cannot honour, and never has to keep a system in sync during a dinner rush.",
      },
    ],
    scope: [
      "Menu with category filtering, rendered from structured data",
      "Photo gallery",
      "Table booking request form",
      "WhatsApp order button",
      "Google Maps embed and directions",
      "Opening hours and contact",
      "Mobile-first throughout — this category is overwhelmingly phone traffic",
    ],
    stack: ["Next.js", "Tailwind CSS", "WhatsApp deep links", "Google Maps Embed API"],
    clientProvides: [
      "Menu items, descriptions and prices",
      "Food and interior photos",
      "Logo, if one exists",
      "Address, contact number and opening hours",
    ],
    timeline: "5–8 days",
    priceRange: "₹12,000–₹25,000",
    honestly:
      "This is a concept build, not client work — the restaurant, its reviews and its photographs are invented so the build could be shown publicly without needing anyone's permission. What is not invented is the build itself: it runs, you can use it, and it is the same architecture a real project of this type would ship on.",
    relatedPosts: ["why-every-restaurant-needs-a-website", "restaurant-website-cost-india"],
    relatedStudies: ["a-gym-site-that-shows-the-price", "booking-without-a-booking-system"],
  },

  {
    slug: "a-gym-site-that-shows-the-price",
    conceptSlug: "gym-website-concept",
    title: "A gym site that shows the price",
    productName: "IronCore",
    subtitle:
      "The category standard is to hide membership fees behind an enquiry form. That form is the reason the enquiries are bad.",
    industry: "Fitness",
    serviceSlug: "website-development",
    summary:
      "A concept gym website built on the argument that publishing membership prices produces fewer, better leads — plus a calculator that earns the visitor's attention before asking for their number.",
    readMinutes: 6,
    situation: [
      "Gyms almost universally hide pricing. The reasoning is that a conversation converts better than a number, so make them call. What actually happens is that the visitor comparing four gyms at eleven at night closes the tab, because three of the others published a figure and one did not.",
      "The enquiries that do come through a price-less form are the worst kind: people who have no idea what the gym costs, a large share of whom disqualify themselves the moment they hear. Staff time goes into calls that were never going to convert, and the owner concludes the website does not work.",
      "The third problem is that a gym decision is not really about equipment. People commit to a gym because of who trains there and who teaches — and that is the thing most gym sites show least of.",
    ],
    decisions: [
      {
        title: "Membership prices are published, on the page, without a form",
        body: "Every plan shows its price, its length and what it includes. The visitor who is out of budget leaves — which is the correct outcome, since they were never a customer, and they leave without consuming a phone call. The visitor who stays has already accepted the price, so the conversation starts at 'when can I come in' instead of 'so how much is it'.",
        tradeoff:
          "Competitors can see the pricing. They can also see it by walking in or making one phone call, so the secrecy was never real — it only ever cost the business the customers who would not do either.",
      },
      {
        title: "The BMI calculator comes before the lead form, not after",
        body: "It gives the visitor something useful in exchange for engagement, and it does so without asking for anything first. Someone who has just calculated their BMI is measurably closer to acting than someone who has just scrolled past a hero image, and asking for a phone number at that moment is a reasonable trade rather than a toll gate.",
        tradeoff:
          "It is a small piece of interactive code to build and maintain rather than another static section. Cheap, and it is the only element on the page that gives before it takes.",
      },
      {
        title: "Trainers get names, photographs and specialities",
        body: "Membership is a decision about people. Real trainer profiles do work that no amount of equipment photography does, and they give the gym something no competitor can copy — the actual staff.",
        tradeoff:
          "It creates an ongoing content obligation: when a trainer leaves, the page has to be updated or it starts lying. That maintenance is real and belongs in the conversation up front.",
      },
      {
        title: "Class timetable as a table, not a downloadable image",
        body: "A timetable posted as a JPEG is unreadable on a phone and invisible to search. As page content it is legible, zoomable and indexable — and it answers the second most common question after price.",
        tradeoff:
          "Someone has to update it when the schedule changes. Same obligation as the trainer profiles, and the same answer: it belongs in the maintenance plan.",
      },
    ],
    scope: [
      "Membership plans with published prices",
      "Class timetable as real page content",
      "Trainer profiles with photos and specialities",
      "BMI calculator",
      "Lead capture form",
      "WhatsApp button",
    ],
    stack: ["Next.js", "Tailwind CSS", "WhatsApp deep links"],
    clientProvides: [
      "Membership plans and prices",
      "Trainer photos and short bios",
      "Class timings",
      "Logo, if one exists",
    ],
    timeline: "5–8 days",
    priceRange: "₹12,000–₹22,000",
    honestly:
      "A concept build. The gym, the trainers and the class schedule are invented. The argument about publishing prices is not a stylistic preference — it is the reason this build is shaped the way it is, and a gym owner who disagrees should say so before the design stage, because it changes the whole page.",
    relatedPosts: ["gym-website-cost-india", "how-small-businesses-get-more-leads-online"],
    relatedStudies: [
      "restaurant-website-that-takes-orders-on-whatsapp",
      "booking-without-a-booking-system",
    ],
  },

  {
    slug: "booking-without-a-booking-system",
    conceptSlug: "salon-website-concept",
    title: "Booking without a booking system",
    productName: "Luxe Salon",
    subtitle:
      "A structured request that lands on WhatsApp converts about as well as a live calendar, and costs nothing to run.",
    industry: "Beauty / Salon",
    serviceSlug: "website-development",
    summary:
      "A concept salon website that treats booking as a well-structured request rather than real-time scheduling, and lets Instagram remain the gallery instead of duplicating it.",
    readMinutes: 6,
    situation: [
      "Salons are sold scheduling software constantly. For a chain with twelve chairs and a receptionist, it is the right tool. For a two-chair salon where the owner is also the stylist, it is a subscription plus a system that has to be kept accurate all day by someone whose hands are busy — and a calendar showing slots that are not really free is worse than no calendar at all.",
      "Meanwhile the two things a client actually wants before booking are the service list with prices and evidence of the work. Salons tend to have the second in abundance, on Instagram, and almost never have the first anywhere public.",
    ],
    decisions: [
      {
        title: "Booking is a structured request, not live availability",
        body: "The form asks for service, preferred date, preferred time and stylist, then sends a complete message the salon confirms. The client gets a reply within the hour; the salon never shows a slot it cannot honour. Structure is what makes this work — a request carrying all four fields is answerable in one message, unlike 'hi, appointment?'",
        tradeoff:
          "No instant confirmation, and no automatic reminders. If the salon grows past the point where someone can reply within the hour, this should be replaced with real scheduling — and that is a good problem, not a design flaw.",
      },
      {
        title: "Instagram stays the gallery",
        body: "The salon already posts its work there daily and will keep doing so. Copying those photos into the website creates a second gallery that goes stale within a month and quietly makes the business look less active than it is. Embedding the live feed means the website is always as current as the Instagram.",
        tradeoff:
          "The gallery depends on a third party: if the embed changes or the account goes private, the section degrades. That is a real risk, and it is accepted knowingly rather than discovered later — the alternative is a stale gallery, which fails silently and permanently.",
      },
      {
        title: "Every service carries a price",
        body: "Same argument as the gym, and it matters more here because salon pricing varies enormously by service. A visitor who cannot tell whether a cut is ₹300 or ₹3,000 does not call to find out; they go to the salon whose page told them.",
        tradeoff:
          "Prices have to be kept current, which is one more maintenance obligation.",
      },
    ],
    scope: [
      "Service menu with prices",
      "Appointment request form with stylist and time preference",
      "Instagram gallery embed",
      "Working hours and location",
      "WhatsApp button",
    ],
    stack: ["Next.js", "Tailwind CSS", "Instagram oEmbed"],
    clientProvides: [
      "Service list and prices",
      "Salon photographs",
      "Working hours",
      "Instagram handle",
    ],
    timeline: "4–7 days",
    priceRange: "₹10,000–₹20,000",
    honestly:
      "A concept build; the salon and its stylists are invented. The Instagram section in the demo is a visual stand-in rather than a live feed, since there is no real account behind it — on a real project it embeds the client's actual account.",
    relatedPosts: ["salon-booking-website-india", "what-to-prepare-before-building-a-website"],
    relatedStudies: ["a-gym-site-that-shows-the-price", "the-half-that-costs-the-money"],
  },

  {
    slug: "the-half-that-costs-the-money",
    conceptSlug: "ecommerce-concept",
    title: "The half of an online store that costs the money",
    productName: "CraftKart",
    subtitle:
      "The storefront is the easy part. What makes ecommerce cost three times a brochure site is everything the customer never sees.",
    industry: "Ecommerce / Retail",
    serviceSlug: "ecommerce-development",
    summary:
      "A concept online store, and an honest breakdown of why ecommerce starts around ₹28,000 when a business website starts around ₹12,000 — with the answer being the admin panel, not the design.",
    readMinutes: 8,
    situation: [
      "Small sellers on marketplaces lose a meaningful slice of every sale to commission, and — more importantly — never learn who bought from them. The customer belongs to the marketplace. Building an own-brand store is the obvious response, and it is a genuinely bigger project than most sellers are told.",
      "The gap between expectation and quote is almost always about the same misunderstanding: the seller is picturing the shop, and the quote is mostly for the machinery behind it. A brochure website ends when the visitor clicks 'contact'. A store has to keep going — take money reliably, know what is in stock, record what was ordered, and let the owner run all of that without calling a developer.",
    ],
    decisions: [
      {
        title: "The admin panel is the actual product",
        body: "The storefront is a few days of work. The system that lets an owner add a product, change a price, mark something out of stock, see what was ordered and mark it dispatched — that is the majority of the build, and it is what determines whether the store is still running in a year. A store the owner cannot update is a store that dies at its first price change.",
        tradeoff:
          "It is most of the cost and the customer never sees it, which makes it the hardest part of the quote to justify and the worst possible place to cut. Cutting it is how a seller ends up paying a developer for every price change.",
      },
      {
        title: "Payments go through Razorpay rather than anything custom",
        body: "Razorpay handles UPI, cards, netbanking and wallets, and — critically — means card details never touch the store's own servers. Building anything custom here would mean inheriting a compliance burden and a fraud surface for no benefit whatsoever.",
        tradeoff:
          "A per-transaction fee and a dependency on a third party. Both are correct trades: the fee is far smaller than marketplace commission, and the dependency is on the part nobody should be building themselves.",
      },
      {
        title: "A real database, because a store has state",
        body: "Stock levels, orders and their status are facts that change and have to survive. This is the point where a project genuinely needs PostgreSQL rather than data in the codebase, and it is the clearest technical line between a website and a web application.",
        tradeoff:
          "Hosting is no longer free, and there is a database to back up and maintain. This is where a maintenance plan stops being optional and starts being the difference between a store and a liability.",
      },
      {
        title: "Order tracking, because the alternative is a phone call per order",
        body: "Without it every dispatched order generates at least one 'where is my parcel' message. At thirty orders a week that is the owner's evening. A status the customer can check themselves pays for itself almost immediately.",
        tradeoff:
          "More surface to build and to keep accurate — statuses have to actually be updated, or the tracking page becomes a liar and generates the calls it was meant to prevent.",
      },
    ],
    scope: [
      "Product catalogue with categories",
      "Cart and checkout",
      "Payment gateway integration",
      "Order tracking for customers",
      "Admin panel for products, stock and orders",
    ],
    stack: ["Next.js", "PostgreSQL", "Razorpay"],
    clientProvides: [
      "Product photographs and details",
      "Pricing and stock counts",
      "Payment and UPI details for gateway setup",
      "Logo and brand colours",
    ],
    timeline: "12–20 days",
    priceRange: "₹28,000–₹60,000",
    honestly:
      "The public demo is the storefront half only — catalogue, cart and checkout flow, with invented products. It does not process real payments and its admin panel is not exposed publicly, for obvious reasons. The point of this study is the part you cannot see in the demo, which is also the part that determines the price.",
    relatedPosts: [
      "ecommerce-website-for-small-sellers-india",
      "website-vs-web-app",
      "why-cheap-and-expensive-websites-differ",
    ],
    relatedStudies: ["the-honest-limits-of-a-support-bot", "booking-without-a-booking-system"],
  },

  {
    slug: "the-honest-limits-of-a-support-bot",
    conceptSlug: "ai-chatbot-concept",
    title: "The honest limits of a support bot",
    productName: "SupportGenie",
    subtitle:
      "A support bot earns its place by answering the same four questions perfectly and knowing exactly when to stop.",
    industry: "Customer Support",
    serviceSlug: "ai-automation",
    summary:
      "A concept support chatbot, and the case for a narrow scope and a mandatory human handover — including a frank account of what the public demo does and does not do.",
    readMinutes: 7,
    situation: [
      "Most customer messages a small business receives are the same handful of questions: what does it cost, are you open, where are you, can I book. Answering them by hand consumes hours a week and, worse, happens slowly — the message that arrives at eleven at night is answered at ten the next morning, by which point the customer has asked someone else.",
      "The failure mode of the obvious fix is well documented. A bot given free rein over an open-ended model will, sooner or later, state a price that does not exist or promise something the business does not offer. For a small business that is not an amusing screenshot; it is a commitment a customer will hold them to.",
    ],
    decisions: [
      {
        title: "Scope it to the business's own answers, not to open conversation",
        body: "The bot answers from the business's real FAQ content. It is not there to be charming about topics outside that set, because every sentence it improvises is a sentence the owner did not approve and may have to honour.",
        tradeoff:
          "It will decline questions a more open system would have attempted. That is the feature: a bot that says 'let me get someone' costs nothing, and a bot that invents a discount costs a customer.",
      },
      {
        title: "Human handover is mandatory and always one tap away",
        body: "'Talk to a person' is a permanent option, not a fallback the bot offers after failing twice. Anyone who wants a human gets one immediately, and the conversation history goes with them so nothing has to be repeated.",
        tradeoff:
          "Some conversations a bot could have closed get escalated. Cheaper than the alternative, every time.",
      },
      {
        title: "Capture the lead inside the conversation",
        body: "When the bot cannot answer, it takes a name and number before ending. Otherwise the most valuable interaction — the one with a question specific enough to need a human — is the one that leaves no trace.",
        tradeoff:
          "One more thing asked of the visitor at a slightly awkward moment, which has to be phrased as a way to get them an answer rather than as a form.",
      },
      {
        title: "Decide what is logged before launch, not after",
        body: "A support bot receives phone numbers, order details and occasionally things people should not have typed. What is stored, for how long, and who can read it is a decision made at the start — it is far harder to unwind once a year of transcripts exists.",
        tradeoff:
          "A conversation the client would rather skip during an exciting project. It is the one that prevents a genuinely bad day later.",
      },
    ],
    scope: [
      "Answers drawn from the business's own FAQ content",
      "Website and WhatsApp channels",
      "One-tap human handover with conversation history",
      "Lead capture on unanswered questions",
      "Conversation analytics",
    ],
    stack: ["Claude API", "Node.js", "WhatsApp Business API"],
    clientProvides: [
      "Common questions with the answers you want given",
      "Business information and policies",
      "WhatsApp number",
      "Who handovers should reach",
    ],
    timeline: "7–14 days",
    priceRange: "₹15,000–₹40,000",
    honestly:
      "The public demo is deliberately not an AI. It matches keywords against a small set of prepared replies, because a demo left open to the internet with a live model attached is a demo someone will make say something regrettable, and the running cost of an unmetered public model is not sensible for a portfolio piece. What the demo genuinely shows is the interaction design — the scope, the quick replies, the handover, the lead capture — which is the part that decides whether the bot works. A delivered project connects real language understanding behind exactly that structure.",
    relatedPosts: [
      "ai-chatbot-for-small-business-india",
      "ai-chatbot-data-privacy-checklist",
      "whatsapp-automation-for-small-business",
    ],
    relatedStudies: ["decide-first-then-chart", "the-half-that-costs-the-money"],
  },

  {
    slug: "decide-first-then-chart",
    conceptSlug: "sales-dashboard-concept",
    title: "Decide first, then chart",
    productName: "PulseBoard",
    subtitle:
      "Most dashboards fail because they were built from the data that happened to exist rather than from the decision they were meant to support.",
    industry: "Business Analytics",
    serviceSlug: "data-dashboard",
    summary:
      "A concept sales dashboard, and the working method behind it: start from the decision the owner keeps making badly, then find the smallest set of numbers that settles it.",
    readMinutes: 6,
    situation: [
      "The spreadsheet is not usually the problem. The problem is that answering 'is this month actually good' takes forty minutes of filtering and a pivot table, so it gets done once a quarter instead of once a week — and decisions get made on the feeling of being busy.",
      "The standard response is a dashboard with thirty charts, which fails differently: it is impressive on delivery day, opened twice, and abandoned. Thirty charts is not an answer, it is a second dataset to interpret.",
    ],
    decisions: [
      {
        title: "Start from the decision, not the data",
        body: "The first question is not 'what data do you have' but 'what do you keep having to decide without knowing'. For a seller that is usually: what should I stock more of, which region deserves attention, and is this month genuinely better than last. Four KPIs and three breakdowns settle all three. Everything that did not survive that question was left out.",
        tradeoff:
          "Someone always wants the chart that got cut. Adding it later takes an hour; recovering a dashboard nobody opens takes a rebuild.",
      },
      {
        title: "Comparison is built into every number",
        body: "Revenue of ₹8.4 lakh means nothing on its own. Against last month, it means something. Every KPI carries its change, so the dashboard answers 'is this good' rather than 'what is this' — which is the actual question.",
        tradeoff:
          "It needs at least one prior period of clean history before the dashboard is useful, which occasionally means a data-tidying step nobody budgeted for.",
      },
      {
        title: "One time-range control, applied to everything",
        body: "Month, quarter and year switch the entire view at once. Per-chart filters are how a viewer ends up comparing this month's revenue against last year's regions without noticing.",
        tradeoff:
          "Less flexibility for a power user, who can go to the underlying data. The dashboard is for the owner, and it should be impossible to misread.",
      },
    ],
    scope: [
      "Four headline KPIs, each with period-on-period change",
      "Monthly revenue trend",
      "Top products by volume",
      "Regional split",
      "One time-range control for the whole view",
      "Scheduled refresh from the source export",
    ],
    stack: ["Power BI", "Excel", "SQL"],
    clientProvides: [
      "A sales or accounting export",
      "The decisions you keep having to make without good numbers",
      "Access to the data source for scheduled refresh",
    ],
    timeline: "5–10 days",
    priceRange: "₹8,000–₹25,000",
    honestly:
      "The interactive demo on this site is a web rebuild of the dashboard layout with invented figures, so it can be explored in a browser without a Power BI licence or a login. Delivered work in this category is normally built in Power BI against the client's real export. The layout, the KPI choices and the single-control interaction are exactly what gets delivered; the technology behind the demo is not.",
    relatedPosts: ["signs-your-business-needs-a-dashboard", "how-ai-automation-saves-business-time"],
    relatedStudies: ["the-half-that-costs-the-money", "the-honest-limits-of-a-support-bot"],
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}
