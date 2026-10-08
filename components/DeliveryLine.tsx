"use client";

import Link from "next/link";
import Icon from "@/components/Icons";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import { useState } from "react";
import dynamic from "next/dynamic";
import "./DeliveryAtelier.css";

const Sculptures = dynamic(() => import("./DeliverySculptures"), { ssr: false });

const metrics = [
  { icon: "shield", value: "₹20,000", label: "Transparent starting price", copy: "Scope, price and milestones confirmed in writing.", kind: "price" },
  { icon: "clock", value: "24h", label: "Team review window", copy: "Requirement routed to the right specialist.", kind: "time" },
  { icon: "code", value: "100%", label: "Code & asset handover", copy: "Repository, hosting and accounts remain yours.", kind: "code" },
];

const steps = [
  { number: "01", title: "Requirements", copy: "One smart form for your project type.", kind: "brief" },
  { number: "02", title: "Written scope", copy: "Itemised, with a fixed quote and dates.", kind: "scope" },
  { number: "03", title: "Build", copy: "Preview, test and approve before delivery.", kind: "build" },
  { number: "04", title: "Handover", copy: "Code, hosting and accounts, all yours.", kind: "handover" },
];

const services = [
  { icon: "code", title: "Web Application Software", copy: "Custom web apps for your business", href: "/start-project?service=custom-software" },
  { icon: "clock", title: "Booking Systems", copy: "Appointments, rentals and meetings", href: "/start-project?service=website-development" },
  { icon: "globe", title: "Business Websites", copy: "Modern, fast and SEO ready", href: "/start-project?service=website-development" },
  { icon: "smartphone", title: "Mobile Apps", copy: "Android and iOS applications", href: "/start-project?service=mobile-app-development" },
  { icon: "bot", title: "AI Chatbots", copy: "Support, sales and automation", href: "/start-project?service=ai-automation" },
  { icon: "briefcase", title: "Ecommerce Stores", copy: "Sell products and grow online", href: "/start-project?service=website-development" },
  { icon: "whatsapp", title: "WhatsApp Automation", copy: "Automate enquiries and support", href: "/start-project?service=ai-automation" },
  { icon: "palette", title: "Logo & Branding", copy: "Logo, identity and brand design", href: "/start-project?service=logo-branding" },
];

const details = [
  ["Goals & features", "Your references", "Project timeline"],
  ["Clear deliverables", "Fixed price", "Delivery dates"],
  ["Development", "Quality testing", "Your feedback"],
  ["Source code", "Hosting access", "All assets", "Support guide"],
];

export default function DeliveryLine() {
  const [active, setActive] = useState(0);
  return (
    <section className="atelier" id="delivery-process" aria-label="From requirement to delivery">
      <div className="atelier-stage">
        <Sculptures />
        <p className="atelier-note atelier-note--left">Simple process.<br/>Real results.</p>
        <p className="atelier-note atelier-note--right">You own<br/>everything.</p>
        <div className="atelier-metrics">
          {metrics.map(metric => <article key={metric.kind}>
            <strong>{metric.value}</strong>
            <h2>{metric.label}</h2>
            <p>{metric.copy}</p>
          </article>)}
        </div>
        <ol className="atelier-steps">
          {steps.map((step, i) => <li key={step.kind} data-active={active === i}>
            <button onClick={() => setActive(i)} aria-pressed={active === i} aria-label={step.title + ": " + step.copy}>
              <span className="atelier-number">{i + 1}</span>
              <span><small>{step.number}</small><b>{step.title}</b><span className="atelier-description">{step.copy}</span></span>
            </button>
            <ul className="atelier-checklist">
              {details[i].map(detail => <li key={detail}><Icon name="check" className="size-3"/>{detail}</li>)}
            </ul>
          </li>)}
        </ol>
        <p className="atelier-belt-label">From idea <span>→</span> to launch <span>→</span> to growth <em>Your success. Our mission.</em></p>
      </div>
      <div className="atelier-mobile-detail" aria-live="polite">
        <strong>{steps[active].title}</strong><p>{steps[active].copy}</p>
        <p>{details[active].join(" · ")}</p>
      </div>
      <div className="atelier-shelf">
        <div className="atelier-services">
          {services.map(service => <Link href={service.href} className="atelier-service" key={service.title}>
            <span className={"atelier-service-icon atelier-service-icon--" + service.icon} aria-hidden>
              {service.icon === "whatsapp" ? <WhatsAppIcon className="size-8"/> : <Icon name={service.icon} className="size-8"/>}
            </span>
            <h3>{service.title}</h3><p>{service.copy}</p>
            <span className="atelier-service-arrow" aria-hidden><Icon name="arrow" className="size-4"/></span>
          </Link>)}
        </div>
      </div>
      <footer className="atelier-footer"><small>Digital solutions for real businesses</small><strong>Build <span>•</span> Automate <span>•</span> Grow</strong></footer>
    </section>
  );
}
