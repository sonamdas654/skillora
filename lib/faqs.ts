export interface Faq {
  q: string;
  a: string;
}

export const homeFaqs: Faq[] = [
  {
    q: "How do I submit a project?",
    a: "Click “Submit Project Requirement”, select your service, answer a few smart questions about your project, upload any files (logo, images, documents) and submit. You get a confirmation immediately and I review every request personally.",
  },
  {
    q: "Do I need to pay advance?",
    a: "Yes — after we finalize scope, price and timeline, projects start with a 40–50% advance. This is standard professional practice and protects both sides. The full payment terms are always shared in writing before you pay anything.",
  },
  {
    q: "How many revisions are included?",
    a: "Basic packages include 1 revision, standard 2 and premium 3. Revision means improvement within the agreed scope — new features or a complete redesign are quoted separately, and I always tell you before any extra cost.",
  },
  {
    q: "Can I upload files with my requirement?",
    a: "Yes. The project form supports logos, images, videos, PDFs and documents. Files are stored securely, linked only to your request and never shared publicly.",
  },
  {
    q: "Do you provide maintenance?",
    a: "Yes — monthly maintenance plans start at ₹5,600/month. Domain, hosting, paid APIs and ad spend are separate third-party costs unless they are written into the final quote.",
  },
];

export const allFaqs: Faq[] = [
  ...homeFaqs,
  {
    q: "What happens after I submit my requirement?",
    a: "I review your details and files, then contact you on WhatsApp or email (your choice) within 24 hours with questions or a clear proposal — scope, price and timeline. No obligation until you approve the quotation.",
  },
  {
    q: "How is the price decided?",
    a: "Pricing is based on scope: pages/screens, features, integrations, deadline, domain/hosting setup and maintenance needs. The form shows market benchmark and Skilloura estimate; Skilloura is kept about 30% below market, then the final written quote confirms the exact amount before any commitment.",
  },
  {
    q: "Will I see the work before final payment?",
    a: "Always. You get a demo/review version first, revisions happen, and only after your approval and final payment is the project delivered with all files and access.",
  },
  {
    q: "Who owns the website/app after delivery?",
    a: "You do. Domain, hosting and accounts are set up in your name. Source code handover is defined clearly in the agreement — included in most custom projects.",
  },
  {
    q: "Do you work with clients outside India?",
    a: "Yes. The process is fully online — requirement form, WhatsApp/email communication, and international payment options are available.",
  },
  {
    q: "What if I'm not sure which service I need?",
    a: "Just use the contact form or WhatsApp and describe your problem in plain words. I'll suggest the right solution and honest options — including cheaper ones if they fit better.",
  },
  {
    q: "Is my data and files safe?",
    a: "Uploaded files are stored securely, accessible only from the admin panel, and used only to understand your project. See the privacy policy for full details.",
  },
];
