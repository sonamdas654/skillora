export type FieldType =
  | "text"
  | "textarea"
  | "select"
  | "multiselect"
  | "radio"
  | "checkbox"
  | "file"
  | "date"
  | "number";

export interface FormField {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
  required?: boolean;
  placeholder?: string;
}

export interface ServicePackage {
  name: string;
  price: string;
  period?: string;
  features: string[];
  delivery?: string;
  revisions?: string;
  highlighted?: boolean;
}

export interface ServiceCategory {
  slug: string;
  name: string;
  shortName: string;
  tab: string;
  icon: string;
  description: string;
  startingPrice: string;
  timeline: string;
  bestFor: string;
  outcome: string;
  exampleProject: string;
  services: string[];
  whoFor: string[];
  whatYouGet: string[];
  needFromYou: string[];
  packages: ServicePackage[];
  formFields: FormField[];
  faqs: { q: string; a: string }[];
  // Industry showcase blocks with a live "sample layout" demo (optional).
  industries?: {
    name: string;
    icon: string;
    features: string[];
    demoHref: string;
  }[];
}

const yesNo = ["Yes", "No"];
const yesNoNotSure = ["Yes", "No", "Not sure"];
const languageOptions = ["English", "Hindi", "Bengali", "Hinglish", "Multiple languages", "Not sure"];
const dataSensitivityOptions = ["Low", "Medium", "High", "Not sure"];

export const serviceCategories: ServiceCategory[] = [
  {
    slug: "website-development",
    name: "Website Development",
    shortName: "Websites",
    tab: "Website",
    icon: "globe",
    description:
      "Business, restaurant, portfolio, ecommerce, booking and custom websites — mobile responsive, SEO-ready, with WhatsApp and contact integration.",
    startingPrice: "₹7,000",
    timeline: "3–20 days",
    bestFor: "Businesses, shops, restaurants, professionals and startups",
    outcome:
      "Get a professional website that builds trust, collects leads and connects customers to WhatsApp.",
    exampleProject: "Restaurant site with menu, WhatsApp ordering and Google Maps.",
    industries: [
      {
        name: "Restaurant Website",
        icon: "spark",
        features: ["Digital menu", "Photo gallery", "WhatsApp ordering", "Google Maps", "Table booking"],
        demoHref: "/portfolio/restaurant-website-concept",
      },
      {
        name: "Coaching Website",
        icon: "file",
        features: ["Course catalog", "Batch timings", "Faculty profiles", "Admission enquiry", "WhatsApp lead form"],
        demoHref: "/demo/web-education",
      },
      {
        name: "Clinic Website",
        icon: "shield",
        features: ["Doctor profiles", "Services", "Appointment form", "Google Maps", "Patient enquiry"],
        demoHref: "/demo/web-clinic",
      },
      {
        name: "Real Estate Website",
        icon: "globe",
        features: ["Property listings", "Enquiry form", "WhatsApp call button", "Location map", "Lead capture"],
        demoHref: "/demo/web-realestate",
      },
      {
        name: "Gym Website",
        icon: "chart",
        features: ["Membership plans", "Trainer profiles", "Class schedule", "Free-trial lead form", "BMI calculator"],
        demoHref: "/portfolio/gym-website-concept",
      },
      {
        name: "Salon Website",
        icon: "palette",
        features: ["Service menu", "Price list", "Online booking", "Instagram gallery", "WhatsApp confirm"],
        demoHref: "/portfolio/salon-website-concept",
      },
    ],
    services: [
      "Business website",
      "Restaurant website",
      "Portfolio website",
      "Ecommerce website",
      "Landing page",
      "Blog website",
      "Coaching website",
      "Doctor/clinic website",
      "Gym website",
      "Salon website",
      "Real estate website",
      "Custom web application",
      "Booking website",
      "Lead generation website",
      "Resume/portfolio website",
    ],
    whoFor: [
      "Small business owners",
      "Restaurants, gyms, salons and clinics",
      "Coaching institutes",
      "Real estate agents",
      "Ecommerce sellers",
      "Startups and professionals",
    ],
    whatYouGet: [
      "Mobile responsive modern design",
      "Contact form + WhatsApp button",
      "Google Maps integration",
      "Basic SEO setup",
      "Fast loading and secure setup",
      "Admin panel (package based)",
      "Training video and documentation",
    ],
    needFromYou: [
      "Business name and logo (if available)",
      "Content, images and service details",
      "Reference websites you like",
      "Domain/hosting details (if you have)",
      "Budget and deadline",
    ],
    packages: [
      {
        name: "Basic Website",
        price: "₹7,000+",
        features: [
          "1–3 pages",
          "Mobile responsive",
          "Contact form",
          "WhatsApp button",
          "Basic SEO",
        ],
        delivery: "3–5 days",
        revisions: "1 revision",
      },
      {
        name: "Business Website",
        price: "₹12,600+",
        features: [
          "5–8 pages",
          "Professional design",
          "Gallery",
          "Contact form",
          "Google Maps",
          "WhatsApp integration",
          "Basic SEO",
        ],
        delivery: "5–10 days",
        revisions: "2 revisions",
        highlighted: true,
      },
      {
        name: "Premium Website",
        price: "₹24,500+",
        features: [
          "Custom design",
          "Admin panel",
          "Blog",
          "Payment gateway option",
          "Booking/order option",
          "SEO setup",
          "Speed optimization",
        ],
        delivery: "10–20 days",
        revisions: "3 revisions",
      },
      {
        name: "Custom Web App",
        price: "Custom",
        features: [
          "Advanced features",
          "Dashboard",
          "User login",
          "Database",
          "Automation",
          "API integration",
          "Admin panel",
        ],
        delivery: "Timeline based on scope",
        revisions: "As per agreement",
      },
    ],
    formFields: [
      { key: "business_name", label: "Business name", type: "text", required: true },
      {
        key: "website_type",
        label: "Website type",
        type: "select",
        required: true,
        options: [
          "Business website",
          "Restaurant website",
          "Portfolio website",
          "Ecommerce website",
          "Landing page",
          "Blog website",
          "Coaching website",
          "Doctor/clinic website",
          "Gym website",
          "Salon website",
          "Real estate website",
          "Booking website",
          "Lead generation website",
          "Resume/portfolio website",
          "Custom web application",
        ],
      },
      {
        key: "page_count",
        label: "Number of pages",
        type: "select",
        options: ["1–3 pages", "4–6 pages", "7–10 pages", "10+ pages", "Not sure"],
      },
      {
        key: "required_pages",
        label: "Required pages",
        type: "multiselect",
        options: [
          "Home",
          "About",
          "Services/Menu",
          "Gallery",
          "Pricing",
          "Blog",
          "Contact",
          "Booking/Order",
          "Shop/Products",
          "Let Skilloura decide the pages",
          "Other",
        ],
      },
      {
        key: "pages_content_plan",
        label: "What should each selected page show?",
        type: "textarea",
        placeholder: "For each page, tell us what it should contain. E.g. Home: hero + services + reviews. About: our story + team. — Or just write 'You decide' and we'll plan it for you.",
      },
      { key: "target_audience", label: "Target customers/audience", type: "textarea", placeholder: "Who will use or buy from this website?" },
      { key: "content_language", label: "Content language", type: "select", options: languageOptions },
      { key: "competitor_sites", label: "Competitor website links", type: "textarea", placeholder: "Paste competitor or similar business websites" },
      { key: "has_domain", label: "Do you already own a domain? (e.g. yourbusiness.com)", type: "radio", options: yesNoNotSure },
      { key: "has_hosting", label: "Do you already have hosting? (where the site lives online)", type: "radio", options: yesNoNotSure },
      { key: "has_logo", label: "Do you have a logo? (if No, we can design one for you)", type: "radio", options: yesNo },
      { key: "content_ready", label: "Is your website text/content ready? (if No, we can write it for you)", type: "radio", options: yesNoNotSure },
      { key: "images_ready", label: "Do you have photos/images to use? (if No, we can source them for you)", type: "radio", options: yesNoNotSure },
      {
        key: "reference_sites",
        label: "Reference website links",
        type: "textarea",
        placeholder: "Paste links of websites you like (one per line)",
      },
      { key: "need_contact_form", label: "Need contact form?", type: "radio", options: yesNo },
      { key: "need_whatsapp", label: "Need WhatsApp button?", type: "radio", options: yesNo },
      { key: "need_payment_gateway", label: "Need payment gateway?", type: "radio", options: yesNoNotSure },
      { key: "product_count", label: "Product count (for ecommerce)", type: "select", options: ["No products", "1-20 products", "21-100 products", "100+ products", "Not sure"] },
      { key: "shipping_needed", label: "Need shipping/delivery setup?", type: "radio", options: yesNoNotSure },
      { key: "need_booking", label: "Need booking system?", type: "radio", options: yesNoNotSure },
      { key: "need_admin_panel", label: "Need admin panel?", type: "radio", options: yesNoNotSure },
      { key: "needs_login", label: "Need customer login/members area?", type: "radio", options: yesNoNotSure },
      { key: "website_user_roles", label: "User roles if login is needed", type: "textarea", placeholder: "e.g. Admin, staff, customer, vendor" },
      { key: "need_blog", label: "Need blog?", type: "radio", options: yesNo },
      { key: "need_seo", label: "Need SEO?", type: "radio", options: yesNoNotSure },
      { key: "legal_pages_needed", label: "Legal/policy pages needed", type: "multiselect", options: ["Privacy Policy", "Terms & Conditions", "Refund Policy", "Shipping Policy", "Not sure"] },
      { key: "need_multilingual", label: "Need multilingual website?", type: "radio", options: yesNo },
      { key: "need_future_app", label: "Need future mobile app?", type: "radio", options: yesNoNotSure },
    ],
    faqs: [
      {
        q: "How long does a website take?",
        a: "Basic websites take 3–5 days, business websites 5–10 days and premium/custom projects 10–20 days depending on scope and how quickly content is shared.",
      },
      {
        q: "Do I need to buy domain and hosting?",
        a: "If you already have them, we will use yours. If not, we will guide you to buy the right domain and hosting at the best price — you always keep ownership.",
      },
      {
        q: "Will my website work on mobile?",
        a: "Yes. Every website is built mobile-first and tested on phones, tablets and desktops before delivery.",
      },
    ],
  },
  {
    slug: "mobile-app-development",
    name: "Mobile App Development",
    shortName: "Mobile Apps",
    tab: "Mobile App",
    icon: "smartphone",
    description:
      "Android and iOS apps for business, booking, delivery, learning and customer management — with backend, admin panel and payment options.",
    startingPrice: "₹35,000",
    timeline: "2–8 weeks",
    bestFor: "Businesses that need booking, ordering or customer apps",
    outcome:
      "Give customers a fast branded app to book, order and reorder — with notifications that bring them back.",
    exampleProject: "Salon booking app with time slots, reminders and repeat-customer offers.",
    services: [
      "Android app",
      "iOS app",
      "Business app",
      "Restaurant app",
      "Booking app",
      "Delivery app",
      "Learning app",
      "Customer management app",
      "Custom mobile app",
    ],
    whoFor: [
      "Restaurants and delivery businesses",
      "Salons, gyms and clinics needing bookings",
      "Coaching institutes and educators",
      "Startups with an app idea",
      "Businesses that want customer apps",
    ],
    whatYouGet: [
      "Android/iOS app as per requirement",
      "Clean modern UI",
      "Backend and database (if required)",
      "Admin panel (if required)",
      "Push notifications and payments (package based)",
      "Play Store / App Store publishing support",
    ],
    needFromYou: [
      "App idea and main features list",
      "Reference apps you like",
      "Logo and brand colors (if available)",
      "Budget and deadline",
    ],
    packages: [
      {
        name: "Starter App",
        price: "₹35,000+",
        features: ["Single platform (Android)", "Up to 6 screens", "Basic backend", "1 revision"],
        delivery: "2–3 weeks",
        revisions: "1 revision",
      },
      {
        name: "Business App",
        price: "₹70,000+",
        features: [
          "Android + iOS",
          "User login",
          "Admin panel",
          "Push notifications",
          "Payment gateway option",
        ],
        delivery: "4–6 weeks",
        revisions: "2 revisions",
        highlighted: true,
      },
      {
        name: "Custom App",
        price: "Custom",
        features: [
          "Complex features",
          "Booking/order/delivery flows",
          "Location tracking",
          "Custom integrations",
        ],
        delivery: "Based on scope",
        revisions: "As per agreement",
      },
    ],
    formFields: [
      {
        key: "app_type",
        label: "App type",
        type: "select",
        required: true,
        options: [
          "Business app",
          "Restaurant app",
          "Booking app",
          "Delivery app",
          "Learning app",
          "Customer management app",
          "Custom mobile app",
        ],
      },
      {
        key: "platform",
        label: "Platform",
        type: "multiselect",
        required: true,
        options: ["Android", "iOS", "Both"],
      },
      { key: "user_login", label: "User login required?", type: "radio", options: yesNo },
      { key: "admin_panel", label: "Admin panel required?", type: "radio", options: yesNoNotSure },
      { key: "payment_gateway", label: "Payment gateway required?", type: "radio", options: yesNoNotSure },
      { key: "push_notifications", label: "Push notification required?", type: "radio", options: yesNo },
      { key: "location_tracking", label: "Location tracking required?", type: "radio", options: yesNo },
      { key: "booking_order", label: "Booking/order feature required?", type: "radio", options: yesNo },
      { key: "reference_apps", label: "Reference app links", type: "textarea" },
      {
        key: "screens_required",
        label: "Screens/pages required",
        type: "textarea",
        placeholder: "e.g. Home, Login, Product list, Cart, Profile...",
      },
      { key: "backend_required", label: "Backend required?", type: "radio", options: yesNoNotSure },
      { key: "app_user_roles", label: "User roles needed", type: "textarea", placeholder: "e.g. Customer, seller, delivery partner, admin" },
      { key: "api_integrations", label: "Third-party/API integrations", type: "textarea", placeholder: "Payment, maps, CRM, ERP, WhatsApp, SMS, etc." },
      { key: "app_store_accounts", label: "Play Store/App Store accounts available?", type: "radio", options: yesNoNotSure },
      { key: "analytics_needed", label: "Need analytics/crash reporting?", type: "radio", options: yesNoNotSure },
      { key: "offline_mode", label: "Need offline mode?", type: "radio", options: yesNoNotSure },
      { key: "post_launch_support", label: "Need post-launch support?", type: "radio", options: yesNoNotSure },
      { key: "source_code_handover", label: "Need source code handover?", type: "radio", options: ["Yes", "No", "Need discussion"] },
    ],
    faqs: [
      {
        q: "Do you publish the app on Play Store?",
        a: "Yes, publishing support is included. Store account fees (Google ₹2,000 approx one-time, Apple $99/year) are paid by the client.",
      },
      {
        q: "Can you build both Android and iOS?",
        a: "Yes, cross-platform builds cover both from a single codebase, which saves cost and time.",
      },
    ],
  },
  {
    slug: "ai-automation",
    name: "AI & Automation",
    shortName: "AI Automation",
    tab: "AI and Automation",
    icon: "bot",
    description:
      "AI chatbots, AI agents, WhatsApp/email/Excel automation and business workflow systems that save hours of manual work every day.",
    startingPrice: "₹7,000",
    timeline: "3–15 days",
    bestFor: "Businesses drowning in repetitive manual work",
    outcome:
      "Save hours every week by automating replies, reports, follow-ups and repetitive workflows.",
    exampleProject: "WhatsApp bot that answers FAQs 24/7 and forwards hot leads to you.",
    services: [
      "AI chatbot",
      "AI agent",
      "WhatsApp automation",
      "Email automation",
      "Excel automation",
      "Google Sheet automation",
      "Business workflow automation",
      "Lead management automation",
      "AI content automation",
      "AI customer support bot",
      "AI resume/job automation",
      "AI data processing system",
      "AI proposal generator",
      "AI quotation generator",
    ],
    whoFor: [
      "Businesses handling repetitive tasks manually",
      "Teams managing leads on WhatsApp/Excel",
      "Customer support teams",
      "Agencies sending proposals and quotations",
      "Anyone processing data by hand",
    ],
    whatYouGet: [
      "Working automation/AI system",
      "Workflow document",
      "Walkthrough video",
      "API key setup guide",
      "Maintenance guide",
    ],
    needFromYou: [
      "Clear description of the task to automate",
      "Current manual process details",
      "Access to tools you currently use",
      "Budget and deadline",
    ],
    packages: [
      {
        name: "Basic Automation",
        price: "₹7,000+",
        features: ["Single workflow automation", "Email/Excel/WhatsApp basic support"],
        delivery: "3–5 days",
      },
      {
        name: "Business Automation",
        price: "₹14,000+",
        features: ["Multi-step workflow", "AI support", "Google Sheet/Email/CRM integration"],
        delivery: "7–12 days",
        highlighted: true,
      },
      {
        name: "Advanced AI Agent",
        price: "Custom",
        features: [
          "AI chatbot",
          "AI workflow",
          "Multi-tool integration",
          "Admin control",
          "Custom logic",
        ],
        delivery: "Based on scope",
      },
    ],
    formFields: [
      {
        key: "automation_task",
        label: "What task do you want to automate?",
        type: "textarea",
        required: true,
      },
      { key: "current_process", label: "Current manual process", type: "textarea", required: true },
      { key: "tools_used", label: "Tools currently used", type: "textarea" },
      {
        key: "input_source",
        label: "Input data source",
        type: "multiselect",
        options: ["WhatsApp", "Email", "Excel/Google Sheet", "Website form", "CRM", "PDF/documents", "Other"],
      },
      { key: "expected_output", label: "Expected output", type: "textarea" },
      {
        key: "workload",
        label: "Daily/weekly workload",
        type: "select",
        options: ["Less than 1 hour/day", "1–3 hours/day", "3–6 hours/day", "Full-time work", "Not sure"],
      },
      { key: "whatsapp_integration", label: "WhatsApp integration needed?", type: "radio", options: yesNoNotSure },
      { key: "email_integration", label: "Email integration needed?", type: "radio", options: yesNoNotSure },
      { key: "sheet_integration", label: "Excel/Google Sheet integration needed?", type: "radio", options: yesNoNotSure },
      { key: "crm_integration", label: "CRM integration needed?", type: "radio", options: yesNoNotSure },
      { key: "ai_chatbot", label: "AI chatbot needed?", type: "radio", options: yesNoNotSure },
      { key: "human_approval", label: "Human approval needed in the flow?", type: "radio", options: yesNoNotSure },
      { key: "access_ready", label: "Tool/API access ready?", type: "radio", options: yesNoNotSure },
      { key: "monthly_tool_budget", label: "Monthly tool/API budget comfort", type: "select", options: ["Below Rs 1,000", "Rs 1,000-Rs 5,000", "Rs 5,000-Rs 15,000", "Rs 15,000+", "Need suggestion"] },
      { key: "data_sensitivity", label: "Data sensitivity", type: "select", options: dataSensitivityOptions },
      { key: "failure_handling", label: "If automation fails, what should happen?", type: "select", options: ["Notify human", "Retry automatically", "Stop and ask approval", "Not sure"] },
      { key: "notification_channel", label: "Notification channel", type: "multiselect", options: ["WhatsApp", "Email", "SMS", "Dashboard", "Slack/Teams", "Not sure"] },
      { key: "success_metric", label: "How will you measure success?", type: "textarea", placeholder: "e.g. save 3 hours/day, reply faster, reduce manual errors" },
      { key: "monthly_volume", label: "Approx monthly volume", type: "select", options: ["Below 1,000 records/messages", "1,000-10,000", "10,000-50,000", "50,000+", "Not sure"] },
    ],
    faqs: [
      {
        q: "Which tools do you use for automation?",
        a: "Depending on the task: custom code, Make/n8n/Zapier, Google Apps Script, WhatsApp APIs and AI models like Claude/GPT. You get the most cost-effective option for your workload.",
      },
      {
        q: "Are there monthly costs?",
        a: "Some automations need paid API/tool subscriptions. We always tell you the exact monthly running cost before starting, so there are no surprises.",
      },
    ],
  },
  {
    slug: "logo-branding",
    name: "Logo & Branding",
    shortName: "Branding",
    tab: "Design",
    icon: "palette",
    description:
      "Logo design, brand kits, business cards, banners, brochures and social media creatives that make your business look professional.",
    startingPrice: "₹1,800",
    timeline: "1–5 days",
    bestFor: "New businesses and rebrands",
    outcome:
      "Look established from day one with a memorable logo and a consistent brand customers trust.",
    exampleProject: "Full brand kit — logo, colours, fonts and social templates for a new cafe.",
    services: [
      "Logo design",
      "Business card",
      "Banner design",
      "Poster design",
      "Social media post design",
      "Brand kit",
      "Brochure design",
      "Flyer design",
      "YouTube thumbnail",
      "Instagram creatives",
      "Product ad creative",
    ],
    whoFor: [
      "New businesses and startups",
      "Businesses that want a rebrand",
      "Content creators",
      "Shops, restaurants and local businesses",
    ],
    whatYouGet: [
      "Logo concepts to choose from",
      "PNG, JPG, PDF, SVG files",
      "Source file (package based)",
      "Brand color and font guide (brand kit)",
    ],
    needFromYou: [
      "Brand name and tagline",
      "Business type",
      "Preferred colors and style",
      "Reference logos you like",
    ],
    packages: [
      {
        name: "Logo Only",
        price: "₹1,800+",
        features: ["2 concepts", "PNG + JPG files", "1 revision"],
        delivery: "1–2 days",
        revisions: "1 revision",
      },
      {
        name: "Logo + Essentials",
        price: "₹4,200+",
        features: ["3 concepts", "All file formats + SVG", "Business card", "2 revisions"],
        delivery: "2–4 days",
        revisions: "2 revisions",
        highlighted: true,
      },
      {
        name: "Full Brand Kit",
        price: "₹10,500+",
        features: [
          "Logo + variations",
          "Brand colors and fonts guide",
          "Business card + letterhead",
          "Social media kit",
          "Source files",
        ],
        delivery: "4–6 days",
        revisions: "3 revisions",
      },
    ],
    formFields: [
      { key: "brand_name", label: "Brand name", type: "text", required: true },
      { key: "business_type", label: "Business type", type: "text", required: true },
      { key: "brand_tagline", label: "Tagline (optional)", type: "text" },
      { key: "preferred_colors", label: "Preferred colors", type: "text" },
      {
        key: "logo_style",
        label: "Logo style",
        type: "select",
        options: ["Minimal/modern", "Classic/premium", "Playful/colorful", "Bold/strong", "Not sure — suggest me"],
      },
      { key: "reference_logos", label: "Reference logos (links)", type: "textarea" },
      { key: "logo_format", label: "Icon, text or both?", type: "radio", options: ["Icon only", "Text only", "Icon + text"] },
      {
        key: "file_formats",
        label: "Required file formats",
        type: "multiselect",
        options: ["PNG", "JPG", "PDF", "SVG", "Source file"],
      },
      {
        key: "logo_usage",
        label: "Where will the logo be used?",
        type: "multiselect",
        options: ["Website", "Social media", "Print (cards/banners)", "Product packaging", "App icon", "Signboard"],
      },
      { key: "brand_personality", label: "Brand personality", type: "multiselect", options: ["Premium", "Friendly", "Bold", "Minimal", "Traditional", "Playful"] },
      { key: "competitor_brands", label: "Competitor brand/logo links", type: "textarea" },
      { key: "avoid_styles", label: "Any colors/styles to avoid?", type: "textarea" },
      { key: "deliverables_needed", label: "Deliverables needed", type: "multiselect", options: ["Logo", "Business card", "Social media kit", "Packaging", "Signage", "Brand guide", "Letterhead"] },
      { key: "print_sizes", label: "Print sizes or usage details", type: "textarea", placeholder: "e.g. banner size, visiting card, packaging label" },
      { key: "trademark_check", label: "Need basic trademark/name conflict guidance?", type: "radio", options: yesNoNotSure },
    ],
    faqs: [
      {
        q: "Will I get the source file?",
        a: "Source files are included in the Logo + Essentials and Full Brand Kit packages, or can be added to any package for a small extra cost.",
      },
    ],
  },
  {
    slug: "video-editing",
    name: "Video & Content",
    shortName: "Video Editing",
    tab: "Video",
    icon: "video",
    description:
      "Reels/Shorts editing, YouTube videos, product ads, promo videos, UGC-style ads and explainer videos that stop the scroll.",
    startingPrice: "₹700",
    timeline: "1–7 days",
    bestFor: "Creators, brands and businesses running ads",
    outcome:
      "Stop the scroll and win attention with sharp reels, ads and videos made to convert.",
    exampleProject: "10 ad-ready reels a month for a clothing brand's Instagram.",
    services: [
      "Video editing",
      "Shorts/Reels editing",
      "Product ad video",
      "Promo video",
      "YouTube video editing",
      "UGC-style ad",
      "Voiceover script",
      "Social media content plan",
      "Explainer video",
      "Business promo video",
    ],
    whoFor: [
      "YouTubers and content creators",
      "Brands running Instagram/Facebook ads",
      "Local businesses that need promo videos",
      "Coaches and educators",
    ],
    whatYouGet: [
      "MP4 export in 1080p/4K",
      "Platform-optimized versions",
      "Thumbnail (package based)",
      "Source file (if included)",
    ],
    needFromYou: [
      "Raw footage or product images",
      "Style reference links",
      "Brand logo/colors",
      "Platform and deadline",
    ],
    packages: [
      {
        name: "Reels/Shorts",
        price: "₹700+",
        period: "per video",
        features: ["Up to 60 sec", "Captions + music", "Trend-style editing"],
        delivery: "1–2 days",
      },
      {
        name: "YouTube Video",
        price: "₹2,500+",
        period: "per video",
        features: ["Up to 15 min", "Cuts, b-roll, sound design", "Thumbnail included"],
        delivery: "2–4 days",
        highlighted: true,
      },
      {
        name: "Ad/Promo Video",
        price: "₹5,600+",
        period: "per video",
        features: ["Script support", "Motion graphics", "Multiple platform exports"],
        delivery: "3–7 days",
      },
    ],
    formFields: [
      {
        key: "video_type",
        label: "Video type",
        type: "select",
        required: true,
        options: [
          "Shorts/Reels",
          "YouTube video",
          "Product ad video",
          "Promo video",
          "UGC-style ad",
          "Explainer video",
          "Business promo video",
        ],
      },
      { key: "raw_footage", label: "Raw footage available?", type: "radio", options: yesNo },
      {
        key: "duration",
        label: "Duration",
        type: "select",
        options: ["Under 60 sec", "1–5 min", "5–15 min", "15+ min"],
      },
      { key: "style_reference", label: "Style reference (links)", type: "textarea" },
      { key: "music_required", label: "Music required?", type: "radio", options: yesNo },
      { key: "subtitles_required", label: "Subtitles required?", type: "radio", options: yesNo },
      { key: "voiceover_required", label: "Voiceover required?", type: "radio", options: yesNo },
      {
        key: "platform",
        label: "Platform",
        type: "multiselect",
        options: ["YouTube", "Instagram", "Facebook", "Ads"],
      },
      { key: "video_count", label: "Number of videos", type: "number" },
      { key: "aspect_ratio", label: "Aspect ratio/output sizes", type: "multiselect", options: ["9:16 Reels/Shorts", "16:9 YouTube", "1:1 Square", "4:5 Feed", "Not sure"] },
      { key: "script_ready", label: "Script/hook ready?", type: "radio", options: yesNoNotSure },
      { key: "video_language", label: "Video language", type: "select", options: languageOptions },
      { key: "brand_assets_ready", label: "Brand logo/colors/assets ready?", type: "radio", options: yesNoNotSure },
      { key: "thumbnail_needed", label: "Need thumbnail/cover?", type: "radio", options: yesNo },
      { key: "delivery_format", label: "Delivery format", type: "multiselect", options: ["MP4 1080p", "4K", "Source file", "Captions file", "Multiple exports"] },
    ],
    faqs: [
      {
        q: "Do you offer monthly packages for creators?",
        a: "Yes — if you need regular videos (e.g. 10 reels/month), we create a custom monthly package at a better per-video rate.",
      },
    ],
  },
  {
    slug: "digital-marketing",
    name: "Digital Marketing",
    shortName: "Marketing",
    tab: "Marketing",
    icon: "megaphone",
    description:
      "SEO, Google Business Profile, social media setup, Google/Meta ads and lead generation campaigns for local and online businesses.",
    startingPrice: "₹5,600",
    timeline: "Ongoing / campaign based",
    bestFor: "Businesses that want more customers online",
    outcome:
      "Bring more local customers through Google, social media and conversion-focused pages.",
    exampleProject: "Google Business + local SEO that ranks a clinic in nearby searches.",
    services: [
      "SEO setup",
      "Google Business Profile setup",
      "Instagram setup",
      "Facebook page setup",
      "Social media marketing",
      "Google Ads setup",
      "Meta Ads setup",
      "Local business marketing",
      "Lead generation campaign",
      "Content strategy",
      "Landing page optimization",
    ],
    whoFor: [
      "Local businesses that want nearby customers",
      "Businesses starting online presence",
      "Brands that want leads from ads",
      "Websites that need Google ranking",
    ],
    whatYouGet: [
      "Complete setup with best practices",
      "Clear reporting on what was done",
      "Ad campaign structure and targeting",
      "Content plan (package based)",
    ],
    needFromYou: [
      "Business details and target location",
      "Current social media links",
      "Marketing goal and monthly budget",
      "Access to accounts (guided setup)",
    ],
    packages: [
      {
        name: "Local Presence Setup",
        price: "₹5,600+",
        features: ["Google Business Profile", "Instagram + Facebook setup", "Profile optimization"],
        delivery: "3–5 days",
      },
      {
        name: "SEO Starter",
        price: "₹10,500+",
        features: ["On-page SEO", "Search Console setup", "Sitemap + keywords", "Local SEO basics"],
        delivery: "5–10 days",
        highlighted: true,
      },
      {
        name: "Ads Campaign Setup",
        price: "₹12,600+",
        period: "+ ad budget",
        features: ["Google or Meta ads", "Audience targeting", "Ad creatives", "Conversion tracking"],
        delivery: "5–7 days",
      },
    ],
    formFields: [
      { key: "business_type", label: "Business type", type: "text", required: true },
      { key: "target_location", label: "Target location", type: "text", required: true },
      { key: "social_links", label: "Current social media links", type: "textarea" },
      { key: "website_url", label: "Website/landing page URL", type: "text" },
      { key: "gbp_url", label: "Google Business Profile URL", type: "text" },
      {
        key: "marketing_goal",
        label: "Marketing goal",
        type: "select",
        options: [
          "More local customers",
          "More website leads",
          "More followers/branding",
          "More sales (ecommerce)",
          "All of the above",
        ],
      },
      {
        key: "monthly_budget",
        label: "Monthly marketing budget",
        type: "select",
        options: ["Below ₹5,000", "₹5,000–₹15,000", "₹15,000–₹50,000", "₹50,000+", "Need suggestion"],
      },
      { key: "need_seo", label: "Need SEO?", type: "radio", options: yesNoNotSure },
      { key: "need_ads", label: "Need ads?", type: "radio", options: yesNoNotSure },
      { key: "need_content", label: "Need content?", type: "radio", options: yesNoNotSure },
      { key: "need_gbp", label: "Need Google Business Profile?", type: "radio", options: yesNoNotSure },
      { key: "target_audience", label: "Target audience", type: "textarea" },
      { key: "expected_result", label: "Expected result", type: "textarea" },
      { key: "ad_account_access", label: "Ad account access available?", type: "radio", options: yesNoNotSure },
      { key: "pixel_tracking_ready", label: "Pixel/conversion tracking ready?", type: "radio", options: yesNoNotSure },
      { key: "competitors", label: "Competitors to compare", type: "textarea" },
      { key: "kpi_priority", label: "Most important KPI", type: "select", options: ["Leads", "Calls", "WhatsApp messages", "Sales", "Website traffic", "Followers", "Local visits", "Not sure"] },
      { key: "offer_details", label: "Main offer/product/service to promote", type: "textarea" },
      { key: "monthly_management_needed", label: "Need monthly campaign management?", type: "radio", options: yesNoNotSure },
    ],
    faqs: [
      {
        q: "Is ad budget included in your price?",
        a: "No — my price covers strategy, setup and management. Ad budget goes directly to Google/Meta from your account, so you have full control and transparency.",
      },
    ],
  },
  {
    slug: "data-dashboard",
    name: "Data & Dashboards",
    shortName: "Dashboards",
    tab: "Data",
    icon: "chart",
    description:
      "Excel/Power BI/Google Sheet dashboards, report automation, data entry and business analytics that turn raw data into decisions.",
    startingPrice: "₹3,500",
    timeline: "2–10 days",
    bestFor: "Businesses tracking sales, inventory or operations",
    outcome:
      "Turn messy Excel data into clear dashboards for sales, inventory and decisions.",
    exampleProject: "Live sales & inventory dashboard built from daily Excel sheets.",
    services: [
      "Excel dashboard",
      "Power BI dashboard",
      "Data entry",
      "PDF to Excel",
      "Report automation",
      "Business analytics dashboard",
      "Sales dashboard",
      "Inventory dashboard",
      "Custom reporting system",
      "Google Sheet dashboard",
    ],
    whoFor: [
      "Business owners tracking sales/inventory manually",
      "Managers preparing reports by hand",
      "Teams working with messy Excel data",
      "Companies needing live analytics",
    ],
    whatYouGet: [
      "Interactive dashboard with your KPIs",
      "Automated data refresh (package based)",
      "Clean, documented structure",
      "Training on how to use it",
    ],
    needFromYou: [
      "Sample data files (Excel/CSV/PDF)",
      "KPIs and reports you need",
      "Update frequency requirement",
    ],
    packages: [
      {
        name: "Excel/Sheet Dashboard",
        price: "₹4,900+",
        features: ["Interactive charts", "KPI cards", "Filters and slicers"],
        delivery: "2–4 days",
      },
      {
        name: "Power BI Dashboard",
        price: "₹10,500+",
        features: ["Professional BI dashboard", "Multiple data sources", "Drill-down reports"],
        delivery: "4–7 days",
        highlighted: true,
      },
      {
        name: "Automated Reporting System",
        price: "Custom",
        features: ["Auto data refresh", "Scheduled reports", "Web dashboard option"],
        delivery: "Based on scope",
      },
    ],
    formFields: [
      {
        key: "data_source",
        label: "Data source",
        type: "select",
        required: true,
        options: ["Excel files", "Google Sheets", "CSV exports", "PDF reports", "Software/database", "Multiple sources"],
      },
      { key: "sample_file_ready", label: "Sample file/data ready?", type: "radio", options: yesNoNotSure },
      { key: "data_volume", label: "Data volume", type: "select", options: ["Small (under 5,000 rows)", "Medium (5,000-50,000 rows)", "Large (50,000+ rows)", "Not sure"] },
      { key: "source_access", label: "Source access/details", type: "textarea", placeholder: "Where will data come from and how can it be accessed?" },
      { key: "data_sensitivity", label: "Data sensitivity", type: "select", options: dataSensitivityOptions },
      { key: "export_format", label: "Export/share format", type: "multiselect", options: ["Excel", "PDF", "Web link", "Power BI file", "Google Sheet", "Email report"] },
      { key: "permission_levels", label: "Permission/user access details", type: "textarea" },
      {
        key: "dashboard_tool",
        label: "Dashboard tool required",
        type: "select",
        options: ["Excel", "Power BI", "Google Sheet", "Web dashboard", "Suggest best option"],
      },
      { key: "reports_needed", label: "Reports needed", type: "textarea" },
      { key: "kpis", label: "KPIs you want to track", type: "textarea" },
      {
        key: "update_frequency",
        label: "Update frequency",
        type: "select",
        options: ["Real-time", "Daily", "Weekly", "Monthly", "One-time"],
      },
      { key: "user_access", label: "Multiple user access needed?", type: "radio", options: yesNoNotSure },
      { key: "automation_needed", label: "Automation needed?", type: "radio", options: yesNoNotSure },
    ],
    faqs: [
      {
        q: "My data is messy — can you still build a dashboard?",
        a: "Yes. Data cleaning is part of the process. Share your files as they are and we will structure them properly before building.",
      },
    ],
  },
  {
    slug: "resume-career",
    name: "Resume & Career",
    shortName: "Career",
    tab: "Career",
    icon: "briefcase",
    description:
      "ATS-friendly resumes, LinkedIn optimization, portfolio websites and personal branding that get you shortlisted.",
    startingPrice: "₹800",
    timeline: "1–5 days",
    bestFor: "Job seekers and professionals",
    outcome:
      "Present your profile professionally with ATS resume, LinkedIn and portfolio website.",
    exampleProject: "ATS resume + optimised LinkedIn that lands more interview calls.",
    services: [
      "Resume creation",
      "ATS resume",
      "LinkedIn profile optimization",
      "Portfolio website",
      "Job application tracking sheet",
      "Interview preparation material",
      "Personal branding website",
    ],
    whoFor: [
      "Job seekers and freshers",
      "Professionals switching careers",
      "Freelancers who need a portfolio",
      "Anyone building a personal brand",
    ],
    whatYouGet: [
      "ATS-optimized resume (PDF + editable)",
      "Keyword-matched for your target role",
      "LinkedIn profile improvements",
      "Portfolio website (package based)",
    ],
    needFromYou: [
      "Current resume or career details",
      "Target role/industry",
      "Skills, projects and achievements",
    ],
    packages: [
      {
        name: "ATS Resume",
        price: "₹800+",
        features: ["ATS-friendly format", "Keyword optimization", "PDF + editable file"],
        delivery: "1–2 days",
      },
      {
        name: "Resume + LinkedIn",
        price: "₹2,500+",
        features: ["ATS resume", "LinkedIn profile optimization", "Headline + about rewrite"],
        delivery: "2–3 days",
        highlighted: true,
      },
      {
        name: "Personal Brand Kit",
        price: "₹8,400+",
        features: ["Resume + LinkedIn", "Portfolio website", "Job tracking sheet"],
        delivery: "4–6 days",
      },
    ],
    formFields: [
      { key: "target_role", label: "Target role/position", type: "text", required: true },
      { key: "experience_level", label: "Experience level", type: "select", options: ["Fresher", "1–3 years", "3–7 years", "7+ years"] },
      { key: "current_resume", label: "Do you have a current resume?", type: "radio", options: yesNo },
      { key: "job_description_link", label: "Job description/link", type: "textarea", placeholder: "Paste JD links or target job details" },
      { key: "target_country", label: "Target country/location", type: "text" },
      { key: "need_linkedin", label: "Need LinkedIn optimization?", type: "radio", options: yesNo },
      { key: "need_portfolio_site", label: "Need portfolio website?", type: "radio", options: yesNoNotSure },
      { key: "target_industry", label: "Target industry", type: "text" },
      { key: "key_skills", label: "Key skills", type: "textarea" },
      { key: "achievements", label: "Achievements/projects to highlight", type: "textarea" },
      { key: "education_certifications", label: "Education/certifications", type: "textarea" },
      { key: "portfolio_links", label: "Portfolio/GitHub/LinkedIn links", type: "textarea" },
      { key: "preferred_format", label: "Preferred delivery format", type: "multiselect", options: ["PDF", "Word", "Google Docs", "Canva editable", "ATS plain format"] },
    ],
    faqs: [
      {
        q: "What is an ATS resume?",
        a: "Most companies use software (ATS) to filter resumes before a human sees them. An ATS resume is formatted and keyword-optimized so it passes these filters and reaches the recruiter.",
      },
    ],
  },
  {
    slug: "custom-software",
    name: "Custom Software & Tools",
    shortName: "Software",
    tab: "Custom Software",
    icon: "code",
    description:
      "Admin panels, inventory/billing systems, booking systems, CRMs, school management and internal business tools built for your exact workflow.",
    startingPrice: "₹28,000",
    timeline: "2–8 weeks",
    bestFor: "Businesses that outgrew Excel and manual processes",
    outcome:
      "Replace messy Excel and manual work with one custom system your whole team can run on.",
    exampleProject: "Billing + inventory system replacing five scattered spreadsheets.",
    services: [
      "Admin panel",
      "Inventory management system",
      "Billing system",
      "Customer management system",
      "Booking system",
      "School/coaching management system",
      "Restaurant order system",
      "Lead management system",
      "Internal business tools",
      "Workflow management system",
    ],
    whoFor: [
      "Businesses managing operations on paper/Excel",
      "Schools and coaching institutes",
      "Restaurants needing order systems",
      "Shops needing billing/inventory",
      "Teams needing internal tools",
    ],
    whatYouGet: [
      "Custom system built for your workflow",
      "User roles and permissions",
      "Reports and dashboards",
      "Training and documentation",
      "Maintenance support option",
    ],
    needFromYou: [
      "Current process description",
      "Features and user roles needed",
      "Sample data/formats you use",
      "Budget and timeline",
    ],
    packages: [
      {
        name: "Starter Tool",
        price: "₹28,000+",
        features: ["Single-purpose tool", "1–2 user roles", "Basic reports"],
        delivery: "2–3 weeks",
      },
      {
        name: "Business System",
        price: "₹49,000+",
        features: ["Multi-module system", "Role-based access", "Dashboard + reports", "Data import"],
        delivery: "4–6 weeks",
        highlighted: true,
      },
      {
        name: "Enterprise Custom",
        price: "Custom",
        features: ["Complex workflows", "Integrations", "Automation", "Priority support"],
        delivery: "Based on scope",
      },
    ],
    formFields: [
      {
        key: "system_type",
        label: "System type",
        type: "select",
        required: true,
        options: [
          "Admin panel",
          "Inventory management",
          "Billing system",
          "Customer management (CRM)",
          "Booking system",
          "School/coaching management",
          "Restaurant order system",
          "Lead management",
          "Internal business tool",
          "Workflow management",
          "Other",
        ],
      },
      { key: "current_process", label: "How do you manage this currently?", type: "textarea", required: true },
      { key: "user_count", label: "How many users will use it?", type: "select", options: ["1–5", "6–20", "21–50", "50+"] },
      { key: "user_roles", label: "User roles needed", type: "textarea", placeholder: "e.g. Admin, Manager, Staff" },
      { key: "must_have_features", label: "Must-have features", type: "textarea", required: true },
      { key: "modules_needed", label: "Modules needed", type: "multiselect", options: ["Inventory", "Billing", "CRM", "Reports", "User management", "Booking", "Payments", "Notifications", "Other"] },
      { key: "reports_required", label: "Reports required", type: "textarea" },
      { key: "data_import_needed", label: "Need data import/migration?", type: "radio", options: yesNoNotSure },
      { key: "permission_detail", label: "Permission/access rules", type: "textarea", placeholder: "Who can view, edit, approve, export, delete?" },
      { key: "deployment_preference", label: "Deployment preference", type: "select", options: ["Client hosting", "Skilloura managed setup", "Local/offline", "Not sure"] },
      { key: "source_code_handover", label: "Source code handover needed?", type: "radio", options: ["Yes", "No", "Need discussion"] },
      { key: "support_sla", label: "Support level after launch", type: "select", options: ["Basic support", "Priority support", "Monthly maintenance", "Not sure"] },
      { key: "compliance_needs", label: "Security/compliance needs", type: "textarea", placeholder: "e.g. GST invoice, audit log, data privacy, role approvals" },
      { key: "existing_software", label: "Any existing software to integrate?", type: "textarea" },
      { key: "web_or_app", label: "Web, mobile or both?", type: "radio", options: ["Web only", "Mobile only", "Both"] },
    ],
    faqs: [
      {
        q: "Do I own the source code?",
        a: "Source code ownership is defined clearly in the agreement before starting. Full source handover is available and included in most custom projects.",
      },
    ],
  },
];

export function getService(slug: string) {
  return serviceCategories.find((s) => s.slug === slug);
}

// Homepage positioning: these are real, offered services but kept SECONDARY
// (shown under "Additional Services") so the core websites / AI / custom-systems
// positioning stays front and centre. They still get full service pages.
export const SECONDARY_SERVICE_SLUGS = ["video-editing", "resume-career"];

export const serviceTabs = [
  "Website",
  "Mobile App",
  "AI and Automation",
  "Design",
  "Marketing",
  "Video",
  "Data",
  "Career",
  "Custom Software",
];
