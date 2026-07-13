"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { track } from "@vercel/analytics";
import { serviceCategories, getService, type FormField } from "@/lib/services";
import { budgetRanges, projectStatusOptions, contactTimes } from "@/lib/site";
import { DEMO_CONCEPTS } from "@/lib/demoConcepts";
import { hasLiveDemo } from "@/lib/liveDemos";
import { WebPreview, DashboardPreview, ResumePreview, SoftwarePreview } from "@/components/ConceptPreviews";
import Icon from "./Icons";

const STEPS = [
  "Your details",
  "Service",
  "Reference Design",
  "Project questions",
  "Files",
  "Budget & timing",
  "Review & submit",
];

const inputCls =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-soft/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition";
const labelCls = "mb-1.5 block text-sm font-semibold text-ink";

interface CommonData {
  clientName: string;
  email: string;
  phone: string;
  businessName: string;
  cityCountry: string;
  serviceCategory: string;
  serviceType: string;
  projectDescription: string;
  budgetRange: string;
  deadline: string;
  projectStatus: string;
  referenceLinks: string;
  hasDomain: string;
  hasHosting: string;
  needsMaintenance: string;
  preferredContact: string;
  bestTimeToContact: string;
  readyToStart: string;
  advancePaymentComfort: string;
  additionalNotes: string;
  termsAccepted: boolean;
  selectedDemoConcept: string;
  designStyle: string;
  budgetIntent: string;
}

const STYLE_OPTIONS = [
  "Clean",
  "Premium",
  "Colorful",
  "Corporate",
  "Luxury",
  "Minimal",
  "3D / Modern",
  "I don't know — suggest me",
];

const BUDGET_INTENTS = [
  { value: "Basic & affordable", desc: "Get it done well, lowest sensible cost" },
  { value: "Balanced quality", desc: "Good quality at a fair price" },
  { value: "Premium", desc: "Best design & features, budget flexible" },
  { value: "Urgent delivery", desc: "Speed matters most — need it fast" },
  { value: "Just exploring", desc: "Comparing options, no rush yet" },
];

const initialData: CommonData = {
  clientName: "",
  email: "",
  phone: "",
  businessName: "",
  cityCountry: "",
  serviceCategory: "",
  serviceType: "",
  projectDescription: "",
  budgetRange: "",
  deadline: "",
  projectStatus: "",
  referenceLinks: "",
  hasDomain: "",
  hasHosting: "",
  needsMaintenance: "",
  preferredContact: "WhatsApp",
  bestTimeToContact: "",
  readyToStart: "",
  advancePaymentComfort: "",
  additionalNotes: "",
  termsAccepted: false,
  selectedDemoConcept: "",
  designStyle: "",
  budgetIntent: "",
};

interface EstimateLine {
  name: string;
  marketPrice: number;
  ourPrice: number;
  reason: string;
}

interface EstimateResult {
  label: string;
  items: EstimateLine[];
  marketTotal: number;
  ourTotal: number;
  savings: number;
  recommendedBudgetRange: string;
}

interface BudgetGuidance {
  status: "empty" | "custom" | "good" | "tight" | "low" | "room";
  title: string;
  message: string;
  recommendedRange: string;
  shortage?: number;
}

function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function roundToHundred(amount: number) {
  return Math.max(0, Math.round(amount / 100) * 100);
}

function skilloraPriceFromMarket(marketPrice: number, fallbackPrice: number) {
  const fairPrice = roundToHundred(marketPrice * 0.7);
  return fairPrice > 0 ? fairPrice : fallbackPrice;
}

function priceLine(
  name: string,
  fallbackPrice: number,
  marketPrice: number,
  reason: string
): EstimateLine {
  return {
    name,
    marketPrice,
    ourPrice: skilloraPriceFromMarket(marketPrice, fallbackPrice),
    reason,
  };
}

function isYes(value: string | string[] | undefined) {
  return value === "Yes";
}

function selectedList(value: string | string[] | undefined) {
  return Array.isArray(value) ? value : [];
}

interface EstimateContext {
  deadline?: string;
  hasDomain?: string;
  hasHosting?: string;
  needsMaintenance?: string;
  projectStatus?: string;
}

function daysUntilDeadline(deadline?: string) {
  if (!deadline) return null;
  const target = new Date(deadline + "T00:00:00");
  if (Number.isNaN(target.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / 86_400_000);
}

function needsSetupHelp(value?: string) {
  return value === "No" || value === "Not sure";
}

function includesAny(value: string, terms: string[]) {
  return terms.some((term) => value.toLowerCase().includes(term.toLowerCase()));
}

function recommendBudgetRange(amount: number) {
  if (amount <= 4999) return budgetRanges[0];
  if (amount <= 10000) return budgetRanges[1];
  if (amount <= 25000) return budgetRanges[2];
  if (amount <= 50000) return budgetRanges[3];
  return budgetRanges[4];
}

function parseBudgetRange(label: string): { min: number; max: number | null } | null {
  if (!label || label.toLowerCase().includes("custom")) return null;
  const numbers = label
    .replace(/,/g, "")
    .match(/\d+/g)
    ?.map((n) => Number(n));

  if (!numbers?.length) return null;
  if (label.toLowerCase().includes("below")) return { min: 0, max: numbers[0] - 1 };
  if (label.includes("+")) return { min: numbers[0], max: null };
  if (numbers.length >= 2) return { min: numbers[0], max: numbers[1] };
  return null;
}

function getBudgetGuidance(
  estimate: EstimateResult | null,
  budgetRange: string
): BudgetGuidance | null {
  if (!estimate) return null;

  const recommendedRange = estimate.recommendedBudgetRange;
  if (!budgetRange) {
    return {
      status: "empty",
      title: "Recommended budget: " + recommendedRange,
      message:
        "This recommendation is based on the services and options selected above.",
      recommendedRange,
    };
  }

  if (budgetRange.toLowerCase().includes("custom")) {
    return {
      status: "custom",
      title: "Custom budget selected",
      message:
        "Mention the exact amount in notes. The written quote will show what can fit in that amount.",
      recommendedRange,
    };
  }

  const band = parseBudgetRange(budgetRange);
  if (!band) return null;

  if (band.max !== null && band.max < estimate.ourTotal) {
    const shortage = estimate.ourTotal - band.max;
    return {
      status: "low",
      title: "Selected budget is short by " + formatMoney(shortage),
      message:
        "You can still submit, but this scope will need a reduced feature list, phased delivery, or a higher budget range.",
      recommendedRange,
      shortage,
    };
  }

  if (band.max !== null && estimate.ourTotal > band.max * 0.85) {
    return {
      status: "tight",
      title: "Budget fits, but it is tight",
      message:
        "The selected range can work, but there may be less room for extra pages, integrations, revisions, or urgent delivery.",
      recommendedRange,
    };
  }

  if (estimate.ourTotal < band.min) {
    return {
      status: "room",
      title: "Selected budget has extra room",
      message:
        "Your range is higher than the current estimate, so we can discuss premium scope, faster delivery, or maintenance.",
      recommendedRange,
    };
  }

  return {
    status: "good",
    title: "Budget matches the selected scope",
    message:
      "This range is aligned with the estimated Skilloura quote for the services selected.",
    recommendedRange,
  };
}

function calculateEstimate(
  category: string,
  type: string,
  answers: Record<string, string | string[]>,
  context: EstimateContext = {}
): EstimateResult | null {
  if (!category) return null;

  let label = "";
  const items: EstimateLine[] = [];
  const add = (item: EstimateLine) => items.push(item);

  if (category === "website-development") {
    if (type === "Landing page") {
      label = "Landing page base";
      add(priceLine(label, 3999, 10000, "Single focused page, responsive design, lead form basics."));
    } else if (type === "Ecommerce website") {
      label = "E-commerce base";
      add(priceLine(label, 14999, 35000, "Product pages, cart/order flow, payment-ready setup."));
    } else if (type === "Custom web application") {
      label = "Custom web app base";
      add(priceLine(label, 24999, 60000, "Custom logic, database-ready structure, dashboard planning."));
    } else if (type && type.includes("Portfolio")) {
      label = "Portfolio base";
      add(priceLine(label, 4999, 12000, "Personal/business portfolio layout with contact flow."));
    } else {
      label = "Business website base";
      add(priceLine(label, 6999, 18000, "Core business pages, mobile layout, contact and WhatsApp flow."));
    }

    const pages = answers["page_count"] as string;
    if (pages?.includes("4") && pages.includes("6")) {
      add(priceLine("4-6 pages setup", 2999, 7000, "Extra layout, content placement, and navigation work."));
    } else if (pages?.includes("7") && pages.includes("10")) {
      add(priceLine("7-10 pages setup", 5999, 14000, "More pages, content sections, testing, and menu structure."));
    } else if (pages === "10+ pages") {
      add(priceLine("10+ pages setup", 9999, 25000, "Larger site structure with more design and content effort."));
    }

    if (isYes(answers["need_payment_gateway"])) {
      add(priceLine("Payment gateway integration", 2999, 8000, "Gateway setup, checkout testing, and payment handoff."));
    }
    if (isYes(answers["need_booking"])) {
      add(priceLine("Booking system setup", 3999, 10000, "Booking form, calendar/process flow, and notifications."));
    }
    if (isYes(answers["need_admin_panel"])) {
      add(priceLine("Admin panel dashboard", 4999, 15000, "Private dashboard, basic data management, and access flow."));
    }
    if (isYes(answers["need_seo"])) {
      add(priceLine("SEO setup", 1999, 6000, "Metadata, search-friendly page structure, and basic indexing setup."));
    }
    if (isYes(answers["need_multilingual"])) {
      add(priceLine("Multilingual capability", 2999, 8000, "Language structure and translated-content placement support."));
    }
    if (isYes(answers["needs_login"])) {
      add(priceLine("Customer login/members area", 4999, 15000, "Login, account pages, access states, and testing."));
    }
    const productCount = answers["product_count"] as string;
    if (productCount === "21-100 products") {
      add(priceLine("Medium product catalog setup", 4999, 14000, "More product structure, categories, and catalog testing."));
    } else if (productCount === "100+ products") {
      add(priceLine("Large product catalog setup", 9999, 30000, "Bulk product planning, category structure, and stronger catalog workflow."));
    }
    if (isYes(answers["shipping_needed"])) {
      add(priceLine("Shipping/delivery setup", 2999, 9000, "Shipping methods, delivery notes, and order handoff setup."));
    }
    const legalPages = selectedList(answers["legal_pages_needed"]).filter((item) => item !== "Not sure");
    if (legalPages.length > 0) {
      add(priceLine("Legal/policy page setup", legalPages.length * 799, legalPages.length * 2000, "Policy page structure and placement for customer trust."));
    }
    if (answers["has_logo"] === "No") {
      add(priceLine("Logo design", 2799, 4000, "You don't have a logo yet, so we'll design one for the site."));
    }
    if (needsSetupHelp(answers["content_ready"] as string)) {
      add(priceLine("Content writing", 3499, 5000, "We'll write the page text/content since yours isn't ready."));
    }
    if (needsSetupHelp(answers["images_ready"] as string)) {
      add(priceLine("Image sourcing & editing", 2099, 3000, "We'll source and prepare suitable images since you don't have them ready."));
    }
  } else if (category === "mobile-app-development") {
    const platforms = selectedList(answers["platform"]);
    if (platforms.includes("Both")) {
      label = "Android + iOS cross-platform base";
      add(priceLine(label, 39999, 100000, "Shared codebase app for both Android and iOS."));
    } else if (platforms.includes("iOS")) {
      label = "iOS native app base";
      add(priceLine(label, 24999, 65000, "iOS screens, navigation, and release-ready structure."));
    } else {
      label = "Android native app base";
      add(priceLine(label, 19999, 50000, "Android screens, navigation, and release-ready structure."));
    }

    if (isYes(answers["user_login"])) {
      add(priceLine("Secure user login and profile", 4999, 12000, "Auth screens, profile data, and access flow."));
    }
    if (isYes(answers["admin_panel"])) {
      add(priceLine("Admin control dashboard", 6999, 18000, "Admin-side controls and basic data management."));
    }
    if (isYes(answers["payment_gateway"])) {
      add(priceLine("In-app payment gateway", 5999, 15000, "Payment SDK/API setup and transaction testing."));
    }
    if (isYes(answers["push_notifications"])) {
      add(priceLine("Push notifications system", 2999, 8000, "Notification setup, permission flow, and testing."));
    }
    if (isYes(answers["location_tracking"])) {
      add(priceLine("GPS/location tracking", 7999, 20000, "Location permissions, map flow, and tracking logic."));
    }
    if (isYes(answers["booking_order"])) {
      add(priceLine("Ordering/booking engine", 8999, 25000, "Order or booking flow, statuses, and admin visibility."));
    }
    if (isYes(answers["backend_required"])) {
      add(priceLine("Backend and database setup", 6999, 20000, "API/database foundation for storing app data."));
    }
    if (needsSetupHelp(answers["app_store_accounts"] as string)) {
      add(priceLine("Store publishing/account guidance", 0, 6000, "Publishing support and checklist; store fees are paid by the client directly."));
    }
    if (isYes(answers["analytics_needed"])) {
      add(priceLine("Analytics/crash reporting setup", 2999, 9000, "Events, crash reporting, and launch monitoring setup."));
    }
    if (isYes(answers["offline_mode"])) {
      add(priceLine("Offline mode", 8999, 25000, "Local storage, sync planning, and offline-state testing."));
    }
    if (isYes(answers["source_code_handover"])) {
      add(priceLine("Source code handover package", 2999, 8000, "Repository cleanup, setup notes, and ownership handover support."));
    }
  } else if (category === "ai-automation") {
    if (type === "AI chatbot" || type === "AI customer support bot") {
      label = "AI chatbot base";
      add(priceLine(label, 7999, 18000, "Bot flow, response logic, testing, and handover guide."));
    } else if (type === "AI agent") {
      label = "AI agent base";
      add(priceLine(label, 14999, 40000, "Multi-step AI workflow with tool/action planning."));
    } else if (type && type.includes("WhatsApp")) {
      label = "WhatsApp automation base";
      add(priceLine(label, 5999, 16000, "WhatsApp flow mapping, automation logic, and testing."));
    } else if (type && (type.includes("Excel") || type.includes("Google Sheet"))) {
      label = "Data/sheet automation base";
      add(priceLine(label, 3999, 10000, "Sheet logic, data cleanup flow, and repeatable automation."));
    } else {
      label = "Workflow automation base";
      add(priceLine(label, 6999, 20000, "Workflow mapping, automation build, and guided handover."));
    }

    const inputSources = selectedList(answers["input_source"]);
    if (inputSources.length > 1) {
      const extraSources = inputSources.length - 1;
      add(
        priceLine(
          String(inputSources.length) + " input channels",
          extraSources * 999,
          extraSources * 2500,
          "More input sources need mapping, validation, and testing."
        )
      );
    }

    const workload = answers["workload"] as string;
    if (workload?.includes("1") && workload.includes("3")) {
      add(priceLine("Medium workload automation", 1999, 5000, "More cases, checks, and usage-volume testing."));
    } else if (workload?.includes("3") && workload.includes("6")) {
      add(priceLine("Heavy workload automation", 3999, 10000, "Higher-volume process with more reliability checks."));
    } else if (workload === "Full-time work") {
      add(priceLine("Full-time workload automation", 6999, 18000, "Larger workflow coverage and stronger error handling."));
    }

    if (isYes(answers["whatsapp_integration"])) {
      add(priceLine("WhatsApp Business API setup", 2999, 8000, "WhatsApp routing, templates/API handoff, and testing."));
    }
    if (isYes(answers["email_integration"])) {
      add(priceLine("Email integration", 1999, 5000, "Email trigger, parsing/sending flow, and test cases."));
    }
    if (isYes(answers["sheet_integration"])) {
      add(priceLine("Google Sheets/Excel sync", 1999, 5000, "Read/write sync and basic error handling."));
    }
    if (isYes(answers["crm_integration"])) {
      add(priceLine("CRM API integration", 4999, 15000, "CRM field mapping, API setup, and test records."));
    }
    if (isYes(answers["ai_chatbot"])) {
      const botName = label.includes("chatbot") ? "Knowledge base and training setup" : "AI chatbot layer";
      add(priceLine(botName, 3999, 12000, "Conversation rules, fallback handling, and response testing."));
    }
    if (isYes(answers["human_approval"])) {
      add(priceLine("Human approval step", 2999, 8000, "Approval queue/checkpoint before final action is taken."));
    }
    if (needsSetupHelp(answers["access_ready"] as string)) {
      add(priceLine("Tool/API access setup support", 0, 4000, "Guided setup for API keys, tool access, and test credentials."));
    }
    if ((answers["data_sensitivity"] as string) === "High") {
      add(priceLine("Sensitive data handling", 3999, 12000, "Extra privacy checks, safer access flow, and controlled test data handling."));
    }
    const failureHandling = answers["failure_handling"] as string;
    if (failureHandling && failureHandling !== "Not sure") {
      add(priceLine("Fallback/error handling", 2999, 9000, "Failure path, alerts, retries/approval behavior, and testing."));
    }
    const monthlyVolume = answers["monthly_volume"] as string;
    if (monthlyVolume === "10,000-50,000") {
      add(priceLine("Higher volume testing", 3999, 12000, "More test cases for larger message or record volume."));
    } else if (monthlyVolume === "50,000+") {
      add(priceLine("High-volume reliability setup", 7999, 25000, "Scale planning, stronger error handling, and reliability testing."));
    }
  } else if (category === "logo-branding") {
    if (type === "Brand kit") {
      label = "Full brand kit base";
      add(priceLine(label, 5999, 15000, "Logo system, brand colors, fonts, and usage-ready exports."));
    } else if (includesAny(type, ["Business card", "Brochure", "Flyer"])) {
      label = "Print design base";
      add(priceLine(label, 1499, 4000, "Print-ready layout and export setup."));
    } else if (includesAny(type, ["Banner", "Poster", "Social media", "thumbnail", "creative"])) {
      label = "Creative design base";
      add(priceLine(label, 999, 2500, "Single creative layout with platform-ready export."));
    } else {
      label = "Logo design base";
      add(priceLine(label, 999, 2500, "Logo concept, cleanup, and basic export files."));
    }

    const usage = selectedList(answers["logo_usage"]);
    if (usage.length > 2) {
      add(priceLine("Multi-platform export optimizations", 499, 1500, "Extra sizing/export care for more usage contexts."));
    }
    const formats = selectedList(answers["file_formats"]);
    if (formats.includes("Source file")) {
      add(priceLine("Source files", 999, 2500, "Editable files for future designer/developer handover."));
    }
    const deliverables = selectedList(answers["deliverables_needed"]);
    if (deliverables.length > 2) {
      add(priceLine("Extra brand deliverables", (deliverables.length - 2) * 999, (deliverables.length - 2) * 2500, "More files and usage formats need extra design/export time."));
    }
    if (isYes(answers["trademark_check"])) {
      add(priceLine("Basic trademark/name conflict guidance", 999, 3000, "Basic naming-risk guidance; official legal filing is separate."));
    }
  } else if (category === "video-editing") {
    let unitOur = 2999;
    let unitMarket = 8000;
    if (type.includes("Shorts") || type.includes("Reels")) {
      label = "Shorts/Reels (per video)";
      unitOur = 499;
      unitMarket = 1000;
    } else if (type.includes("YouTube")) {
      label = "YouTube video (per video)";
      unitOur = 1499;
      unitMarket = 3500;
    } else {
      label = "Ad/promo video base";
      unitOur = 2999;
      unitMarket = 8000;
    }
    add(priceLine(label, unitOur, unitMarket, "Editing, pacing, export, and platform-ready delivery."));

    const count = Number(answers["video_count"] || 1);
    if (Number.isFinite(count) && count > 1) {
      add(
        priceLine(
          "Additional videos x " + (count - 1),
          unitOur * (count - 1),
          unitMarket * (count - 1),
          "Each additional video adds edit, review, and export time."
        )
      );
    }

    const duration = answers["duration"] as string;
    if (duration?.includes("15+")) {
      add(priceLine("Long-form edit duration", 3999, 9000, "Long-form structure, cleanup, and export checks."));
    } else if (duration?.includes("5") && duration.includes("15")) {
      add(priceLine("Extended edit duration", 1999, 5000, "Longer timeline, b-roll, sound, and pacing work."));
    } else if (duration?.includes("1") && duration.includes("5")) {
      add(priceLine("Longer edit duration", 999, 2500, "More footage review, cuts, and timeline polish."));
    }

    if (isYes(answers["subtitles_required"])) {
      add(priceLine("Synced captions", 199, 700, "Caption sync and readable on-screen formatting."));
    }
    if (isYes(answers["voiceover_required"])) {
      add(priceLine("Voiceover sync", 499, 1500, "Voiceover placement and timing with the edit."));
    }
    const aspectRatios = selectedList(answers["aspect_ratio"]).filter((item) => item !== "Not sure");
    if (aspectRatios.length > 1) {
      add(priceLine("Multiple aspect-ratio exports", (aspectRatios.length - 1) * 499, (aspectRatios.length - 1) * 1500, "Extra exports need layout checks for each platform size."));
    }
    if (isYes(answers["thumbnail_needed"])) {
      add(priceLine("Thumbnail/cover design", 499, 1500, "Cover frame, text placement, and platform-ready export."));
    }
    const deliveryFormats = selectedList(answers["delivery_format"]);
    if (deliveryFormats.includes("4K")) {
      add(priceLine("4K export", 499, 1500, "Higher-resolution export and quality checks."));
    }
    if (deliveryFormats.includes("Source file")) {
      add(priceLine("Editable source file", 999, 3000, "Project/source packaging for future editing."));
    }
  } else if (category === "digital-marketing") {
    if (type === "Local business marketing" || type === "Google Business Profile setup") {
      label = "Local business marketing setup";
      add(priceLine(label, 2999, 8000, "GBP/profile setup, local visibility basics, and optimization."));
    } else if (type === "SEO setup") {
      label = "SEO audit and setup";
      add(priceLine(label, 4999, 15000, "Audit, metadata, indexing basics, and on-page fixes."));
    } else {
      label = "Ads campaign setup";
      add(priceLine(label, 5999, 18000, "Campaign structure, audience setup, copy/creative direction."));
    }

    if (isYes(answers["need_seo"]) && !label.includes("SEO")) {
      add(priceLine("On-page SEO setup", 2999, 9000, "Search-friendly page fixes and basic keyword alignment."));
    }
    if (isYes(answers["need_ads"]) && !label.includes("Ads")) {
      add(priceLine("Ad creative and copy bundle", 3999, 12000, "Ad copy, creative direction, and campaign-ready assets."));
    }
    if (isYes(answers["need_content"])) {
      add(priceLine("Content support", 2999, 8000, "Post/campaign content planning and basic copy support."));
    }
    if (isYes(answers["need_gbp"]) && !label.includes("Local")) {
      add(priceLine("Google Business Profile setup", 1999, 6000, "GBP setup/optimization for local discovery."));
    }
    if (needsSetupHelp(answers["ad_account_access"] as string)) {
      add(priceLine("Ad account setup/access guidance", 0, 5000, "Guided account access and setup checklist; ad spend is separate."));
    }
    if (needsSetupHelp(answers["pixel_tracking_ready"] as string)) {
      add(priceLine("Pixel/conversion tracking setup", 2999, 9000, "Pixel, conversion events, and basic tracking test."));
    }
    if (isYes(answers["monthly_management_needed"])) {
      add(priceLine("Monthly campaign management estimate", 5999, 18000, "Ongoing optimization, reporting, and campaign checks after setup."));
    }
  } else if (category === "data-dashboard") {
    if (includesAny(type, ["Power BI", "analytics"])) {
      label = "Power BI dashboard base";
      add(priceLine(label, 4999, 15000, "BI dashboard layout, model setup, and visual reporting."));
    } else if (includesAny(type, ["Data entry", "PDF to Excel"])) {
      label = "Data cleanup/conversion base";
      add(priceLine(label, 1999, 5000, "File cleanup, conversion, and structured output."));
    } else if (includesAny(type, ["automation", "reporting", "Custom"])) {
      label = "Automated reporting base";
      add(priceLine(label, 6999, 20000, "Repeatable report flow with automation-ready structure."));
    } else {
      label = "Excel/Sheet dashboard base";
      add(priceLine(label, 1999, 7000, "Dashboard sheet, charts, filters, and handover."));
    }

    const source = answers["data_source"] as string;
    if (source === "Multiple sources") {
      add(priceLine("Multiple data sources", 2999, 8000, "Data mapping and cleanup across more than one source."));
    }
    const tool = answers["dashboard_tool"] as string;
    if (tool === "Web dashboard") {
      add(priceLine("Web dashboard view", 4999, 15000, "Browser-based dashboard UI and deployment-ready structure."));
    }
    const frequency = answers["update_frequency"] as string;
    if (frequency === "Real-time") {
      add(priceLine("Real-time update flow", 4999, 14000, "Live/near-live refresh logic and reliability checks."));
    } else if (frequency === "Daily") {
      add(priceLine("Daily refresh automation", 1999, 6000, "Scheduled refresh planning and test run."));
    }
    if (isYes(answers["user_access"])) {
      add(priceLine("Multiple user access", 1999, 7000, "User access planning and shared dashboard setup."));
    }
    if (isYes(answers["automation_needed"])) {
      add(priceLine("Report automation", 2999, 9000, "Automated refresh/export or notification workflow."));
    }
    const dataVolume = answers["data_volume"] as string;
    if (dataVolume?.includes("Medium")) {
      add(priceLine("Medium data preparation", 1999, 6000, "More cleanup, validation, and dashboard testing."));
    } else if (dataVolume?.includes("Large")) {
      add(priceLine("Large data preparation", 4999, 15000, "Higher row volume needs stronger cleanup and performance checks."));
    }
    if ((answers["data_sensitivity"] as string) === "High") {
      add(priceLine("Sensitive dashboard access handling", 2999, 9000, "Permission planning and careful handling of private business data."));
    }
    const exportFormats = selectedList(answers["export_format"]);
    if (exportFormats.length > 2) {
      add(priceLine("Multiple export/share formats", (exportFormats.length - 2) * 999, (exportFormats.length - 2) * 3000, "Extra output formats need separate export and testing work."));
    }
  } else if (category === "resume-career") {
    if (includesAny(type, ["LinkedIn"])) {
      label = "Resume + LinkedIn base";
      add(priceLine(label, 1499, 3500, "Resume cleanup plus LinkedIn headline/about optimization."));
    } else if (includesAny(type, ["Portfolio", "Personal branding website"])) {
      label = "Portfolio website base";
      add(priceLine(label, 4999, 12000, "Personal brand page, project sections, and contact flow."));
    } else if (includesAny(type, ["Interview"])) {
      label = "Interview material base";
      add(priceLine(label, 999, 2500, "Role-focused preparation material and answer structure."));
    } else if (includesAny(type, ["tracking"])) {
      label = "Job tracking sheet base";
      add(priceLine(label, 799, 2000, "Application tracker with practical status flow."));
    } else {
      label = "ATS resume base";
      add(priceLine(label, 499, 1200, "ATS-friendly rewrite and editable/PDF delivery."));
    }

    if (isYes(answers["need_linkedin"]) && !label.includes("LinkedIn")) {
      add(priceLine("LinkedIn optimization", 999, 2500, "Headline, about, skills, and profile positioning."));
    }
    if (isYes(answers["need_portfolio_site"]) && !label.includes("Portfolio")) {
      add(priceLine("Portfolio website add-on", 4999, 12000, "Simple portfolio website for profile support."));
    }
    const resumeFormats = selectedList(answers["preferred_format"]);
    if (resumeFormats.length > 2) {
      add(priceLine("Extra resume delivery formats", (resumeFormats.length - 2) * 199, (resumeFormats.length - 2) * 700, "Additional editable/export formats need formatting checks."));
    }
  } else if (category === "custom-software") {
    if (includesAny(type, ["CRM", "Billing", "Inventory", "Booking"])) {
      label = "Business system base";
      add(priceLine(label, 19999, 50000, "Core module, database, admin flow, and reporting basics."));
    } else if (includesAny(type, ["School", "Restaurant", "Workflow", "Lead management"])) {
      label = "Multi-module software base";
      add(priceLine(label, 24999, 70000, "Multiple workflows, roles, and operational screens."));
    } else {
      label = "Admin/internal tool base";
      add(priceLine(label, 14999, 40000, "Custom internal tool with basic roles and data screens."));
    }

    const users = answers["user_count"] as string;
    if (users?.includes("6") && users.includes("20")) {
      add(priceLine("6-20 user setup", 4999, 15000, "More roles, permissions, and usage testing."));
    } else if (users?.includes("21") && users.includes("50")) {
      add(priceLine("21-50 user setup", 9999, 25000, "Heavier permission planning and reliability checks."));
    } else if (users === "50+") {
      add(priceLine("50+ user setup", 19999, 50000, "Higher scale planning, roles, and stronger admin controls."));
    }

    const platform = answers["web_or_app"] as string;
    if (platform === "Both") {
      add(priceLine("Web + mobile delivery", 14999, 40000, "Two delivery surfaces with shared workflow planning."));
    } else if (platform === "Mobile only") {
      add(priceLine("Mobile delivery", 9999, 30000, "Mobile interface and device-specific testing."));
    }
    const modules = selectedList(answers["modules_needed"]);
    if (modules.length > 3) {
      add(priceLine("Additional software modules", (modules.length - 3) * 6999, (modules.length - 3) * 20000, "More modules add screens, permissions, reports, and testing."));
    }
    if (isYes(answers["data_import_needed"])) {
      add(priceLine("Data import/migration", 4999, 15000, "Existing data cleanup, import mapping, and verification."));
    }
    if (isYes(answers["source_code_handover"])) {
      add(priceLine("Source code handover package", 4999, 15000, "Repository cleanup, setup guide, and technical handover."));
    }
    const supportLevel = answers["support_sla"] as string;
    if (supportLevel === "Priority support") {
      add(priceLine("Priority support setup", 2999, 9000, "Priority response process and post-launch support planning."));
    } else if (supportLevel === "Monthly maintenance") {
      add(priceLine("Monthly maintenance planning", 5999, 18000, "Ongoing update, monitoring, backup, and small-change support estimate."));
    }
  } else {
    label = "Standard consultation base";
    add(priceLine(label, 4999, 12000, "Requirement review, scope planning, and starter implementation."));
  }

  const projectMarketSubtotal = items.reduce((sum, item) => sum + item.marketPrice, 0);
  const deadlineDays = daysUntilDeadline(context.deadline);
  if (deadlineDays !== null) {
    if (deadlineDays <= 1 || context.projectStatus === "Urgent project") {
      add(
        priceLine(
          "1-day urgent delivery priority",
          0,
          roundToHundred(Math.max(projectMarketSubtotal * 0.4, 8000)),
          "Same-day/next-day work needs priority slot, overtime, and compressed testing."
        )
      );
    } else if (deadlineDays <= 3) {
      add(
        priceLine(
          "Fast delivery priority",
          0,
          roundToHundred(Math.max(projectMarketSubtotal * 0.25, 5000)),
          "Short deadline needs extra scheduling focus and faster review cycles."
        )
      );
    } else if (deadlineDays <= 7) {
      add(
        priceLine(
          "7-day priority delivery",
          0,
          roundToHundred(Math.max(projectMarketSubtotal * 0.15, 3000)),
          "One-week delivery needs tighter planning and priority testing."
        )
      );
    }
  } else if (context.projectStatus === "Urgent project") {
    add(
      priceLine(
        "Urgent project priority",
        0,
        roundToHundred(Math.max(projectMarketSubtotal * 0.2, 4000)),
        "Urgent status may need priority scheduling before the final date is confirmed."
      )
    );
  }

  if (needsSetupHelp(context.hasDomain)) {
    add(
      priceLine(
        "Domain buying/setup guidance",
        0,
        2000,
        "Includes guidance and DNS setup support; domain purchase fee is paid by the client directly."
      )
    );
  }
  if (needsSetupHelp(context.hasHosting)) {
    add(
      priceLine(
        "Hosting/server setup support",
        0,
        6000,
        "Includes deployment and hosting setup support; hosting subscription/server bill is separate."
      )
    );
  }
  if (context.needsMaintenance === "Yes") {
    add(
      priceLine(
        "Maintenance support estimate",
        0,
        8000,
        "Optional first-month/monthly support after delivery for updates, monitoring, and small fixes."
      )
    );
  }

  const marketTotal = items.reduce((sum, item) => sum + item.marketPrice, 0);
  const ourTotal = items.reduce((sum, item) => sum + item.ourPrice, 0);

  return {
    label,
    items,
    marketTotal,
    ourTotal,
    savings: Math.max(marketTotal - ourTotal, 0),
    recommendedBudgetRange: recommendBudgetRange(ourTotal),
  };
}

function RadioGroup({
  options,
  value,
  onChange,
  name,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  name: string;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={name}>
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            value === opt
              ? "bg-accent text-white"
              : "border border-line bg-white text-ink-soft hover:border-accent hover:text-accent"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function MultiSelect({
  options,
  values,
  onChange,
}: {
  options: string[];
  values: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = values.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() =>
              onChange(active ? values.filter((v) => v !== opt) : [...values, opt])
            }
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              active
                ? "bg-ink text-white"
                : "border border-line bg-white text-ink-soft hover:border-accent hover:text-accent"
            }`}
          >
            {active ? "✓ " : ""}
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function DynamicField({
  field,
  value,
  onChange,
}: {
  field: FormField;
  value: string | string[];
  onChange: (v: string | string[]) => void;
}) {
  switch (field.type) {
    case "text":
    case "number":
      return (
        <input
          type={field.type}
          className={inputCls}
          placeholder={field.placeholder}
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "textarea":
      return (
        <textarea
          rows={3}
          className={inputCls}
          placeholder={field.placeholder}
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "select":
      return (
        <select
          className={inputCls}
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Select...</option>
          {field.options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      );
    case "radio":
      return (
        <RadioGroup
          name={field.label}
          options={field.options ?? []}
          value={value as string}
          onChange={onChange}
        />
      );
    case "multiselect":
      return (
        <MultiSelect
          options={field.options ?? []}
          values={(value as string[]) ?? []}
          onChange={onChange}
        />
      );
    case "date":
      return (
        <input
          type="date"
          className={inputCls}
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    default:
      return null;
  }
}

function EstimatePanel({ estimate }: { estimate: EstimateResult }) {
  return (
    <div className="rounded-2xl border border-mint/25 bg-mint/5 p-4.5 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-1.5 text-sm font-bold text-ink">
            <Icon name="spark" className="size-4.5 text-mint" />
            Live price guide
          </h3>
          <p className="mt-1 text-[11px] leading-4 text-ink-soft">
            A transparent guide estimate based on your selections. Your final written quote is
            confirmed after review, before any payment.
          </p>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-[11px] font-bold text-mint ring-1 ring-mint/20">
          Recommended: {estimate.recommendedBudgetRange}
        </span>
      </div>

      <div className="rounded-xl border border-accent/10 bg-white px-3 py-2.5 text-xs leading-5 text-ink-soft">
        This is the delivery/service charge for planning, building/setup, testing, and handover. Domain, hosting, paid APIs, ad spend, store fees, and other third-party bills are separate unless written in the final quote.
      </div>

      <div className="rounded-xl border border-accent/20 bg-accent-soft px-4 py-3.5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">
          Guide estimate
        </p>
        <p className="mt-1 text-2xl font-black text-ink">{formatMoney(estimate.ourTotal)}</p>
      </div>

      <div className="space-y-2">
        <p className="text-[11px] font-bold uppercase text-ink-soft">What&apos;s included</p>
        {estimate.items.map((item) => (
          <div key={item.name} className="grid gap-2 rounded-xl bg-white px-3 py-2.5 text-xs sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <p className="font-bold text-ink">{item.name}</p>
              <p className="mt-0.5 leading-4 text-ink-soft">{item.reason}</p>
            </div>
            <div className="text-accent sm:text-right">
              <span className="font-extrabold">{formatMoney(item.ourPrice)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BudgetFitPanel({
  estimate,
  guidance,
  onChooseRecommended,
}: {
  estimate: EstimateResult;
  guidance: BudgetGuidance;
  onChooseRecommended: () => void;
}) {
  const tone =
    guidance.status === "low"
      ? "border-red-200 bg-red-50 text-red-700"
      : guidance.status === "tight"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : guidance.status === "room"
          ? "border-sky-200 bg-sky-50 text-sky-700"
          : "border-mint/25 bg-mint/5 text-mint";

  return (
    <div className="rounded-2xl border border-line bg-white p-4.5 space-y-4">
      <div className="grid gap-2 sm:grid-cols-2">
        <div>
          <p className="text-[11px] font-semibold text-ink-soft">Skilloura guide estimate</p>
          <p className="mt-1 text-xl font-black text-ink">{formatMoney(estimate.ourTotal)}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-ink-soft">Best budget range</p>
          <p className="mt-1 text-sm font-extrabold text-accent">{guidance.recommendedRange}</p>
        </div>
      </div>

      <div className={"rounded-xl border px-3 py-3 " + tone}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-extrabold">{guidance.title}</p>
            <p className="mt-1 text-xs leading-5 text-ink-soft">{guidance.message}</p>
          </div>
          {guidance.status === "low" && (
            <button
              type="button"
              onClick={onChooseRecommended}
              className="rounded-full bg-accent px-4 py-2 text-xs font-bold text-white hover:bg-accent-deep transition-colors"
            >
              Use recommended range
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function DemoPreviewModal({
  concept,
  onClose,
  onSelect,
  selected,
}: {
  // Concepts come from DEMO_CONCEPTS with per-service shapes; the modal
  // reads dynamic fields per id, so a strict type adds no safety here.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  concept: any;
  onClose: () => void;
  onSelect: (title: string) => void;
  selected: boolean;
}) {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [cartCount, setCartCount] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<{ name: string; price: number; qty: number }[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  
  const [messages, setMessages] = useState<{ sender: 'user' | 'bot'; text: string; time: string }[]>([
    { sender: 'bot', text: "Hello! I'm Skilloura's AI assistant. How can I help you today?", time: 'Just now' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [brandBg, setBrandBg] = useState<'light' | 'dark'>('dark');
  const [likes, setLikes] = useState(142);
  const [liked, setLiked] = useState(false);
  const [subtitleIndex, setSubtitleIndex] = useState(0);

  useEffect(() => {
    if (concept.id.startsWith("vid-")) {
      const interval = setInterval(() => {
        setSubtitleIndex((i) => (i + 1) % 4);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [concept.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0b0f19] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* macOS window header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-[#070b13] px-4 py-3 shrink-0">
          <div className="flex items-center gap-1.5">
            <button type="button" onClick={onClose} className="size-3 rounded-full bg-[#ff5f56] hover:opacity-85 transition-opacity" title="Close" />
            <span className="size-3 rounded-full bg-[#ffbd2e]" />
            <span className="size-3 rounded-full bg-[#27c93f]" />
          </div>
          <div className="rounded-lg bg-slate-900 border border-slate-800 px-4 py-1 text-[11px] font-mono text-slate-400 w-1/2 text-center select-none truncate">
            preview.skilloura.com/{concept.id}
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white text-xs font-semibold">
            Close ✕
          </button>
        </div>

        {/* Content Viewport */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 text-slate-100 bg-[#070b13]/20 grid md:grid-cols-3 gap-6">
          {/* Left panel: Info & Actions */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4 flex flex-col justify-between text-left">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-slate-800 border border-slate-700/60 px-2.5 py-0.5 text-[10px] font-semibold text-slate-300">
                  {concept.tag}
                </span>
                <span className="text-xs font-mono text-slate-500 font-bold">Interactive Preview</span>
              </div>
              <div>
                <h3 className="text-lg font-black text-white">{concept.title}</h3>
                <p className="text-xs text-slate-400 mt-2 leading-5">{concept.description}</p>
              </div>

              <div className="space-y-2 border-t border-slate-800 pt-3 text-xs">
                <p className="leading-5 text-slate-350">
                  <strong className="text-white">Problem:</strong> {concept.problem}
                </p>
                <p className="leading-5 text-slate-355">
                  <strong className="text-white">Solution:</strong> {concept.solution}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 border-t border-slate-800 pt-3">
                {concept.features.map((f: string) => (
                  <span key={f} className="rounded-full bg-slate-800 border border-slate-700/40 px-2 py-0.5 text-[9px] font-semibold text-slate-400">
                    {f}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2.5 pt-4">
              <button
                type="button"
                onClick={() => onSelect(concept.title)}
                className={`w-full py-3 rounded-xl text-xs font-bold transition-all ${
                  selected
                    ? "bg-mint text-white shadow-[0_0_15px_rgba(16,185,129,0.25)]"
                    : "bg-accent text-white hover:bg-accent-deep"
                }`}
              >
                {selected ? "✓ Reference Style Selected" : "Select this Reference Concept"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700/60 transition-colors"
              >
                Back to Explorer
              </button>
            </div>
          </div>

          {/* Right panel: Simulation window */}
          <div className="md:col-span-2 bg-[#0b0f19] border border-slate-800 rounded-xl overflow-hidden min-h-[420px] flex flex-col">
            {/* SaaS Landing Page */}
            {concept.id === "web-saas" && (
              <div className="p-6 flex-1 flex flex-col justify-center space-y-6">
                <div className="text-center space-y-2">
                  <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    CloudScale AI
                  </span>
                  <h4 className="text-lg font-black text-white">Scale your app performance</h4>
                  <p className="text-xs text-slate-450 max-w-sm mx-auto">
                    Deploy globally with instant API checks and serverless analytics dashboard.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <span className={`text-xs ${billing === 'monthly' ? 'text-white font-bold' : 'text-slate-500'}`}>Monthly</span>
                  <button
                    type="button"
                    onClick={() => setBilling(billing === 'monthly' ? 'yearly' : 'monthly')}
                    className="w-9 h-5 bg-indigo-600 rounded-full p-0.5 transition-colors relative flex items-center"
                  >
                    <span className={`size-4 bg-white rounded-full transition-transform shadow ${
                      billing === 'yearly' ? 'translate-x-4' : 'translate-x-0'
                    }`} />
                  </button>
                  <span className={`text-xs ${billing === 'yearly' ? 'text-white font-bold' : 'text-slate-500'}`}>
                    Yearly <span className="text-[9px] text-mint font-bold bg-mint/10 border border-mint/20 px-1.5 py-0.5 rounded ml-1">Save 20%</span>
                  </span>
                </div>

                <div className="max-w-xs mx-auto w-full bg-slate-900 border border-slate-850 rounded-xl p-5 text-center space-y-4 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[8px] font-bold px-3 py-1 rounded-bl-lg uppercase">Popular</div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pro Plan</p>
                  <p className="text-2xl font-black text-white">
                    {billing === 'monthly' ? '₹999' : '₹799'}
                    <span className="text-[10px] font-normal text-slate-500"> / month</span>
                  </p>
                  <ul className="text-left text-[10px] text-slate-350 space-y-2 py-1 border-t border-b border-slate-800/80 my-2">
                    <li>✓ Unlimited serverless calls</li>
                    <li>✓ 10 Team members seat</li>
                    <li>✓ Advanced custom domains</li>
                    <li>✓ 24/7 dedicated support</li>
                  </ul>
                  <button type="button" className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white rounded-lg transition-colors shadow">
                    Get Started
                  </button>
                </div>
              </div>
            )}

            {/* E-Commerce store */}
            {concept.id === "web-ecommerce" && (
              <div className="flex-1 flex flex-col h-full">
                <div className="border-b border-slate-800 bg-slate-900/40 px-4 py-3 flex items-center justify-between shrink-0">
                  <span className="text-xs font-black text-white flex items-center gap-1.5">
                    <span className="text-pink-500 text-sm">🛒</span>
                    Minimalist Goods
                  </span>
                  <button
                    type="button"
                    onClick={() => setCartOpen(!cartOpen)}
                    className="rounded-lg bg-slate-800 border border-slate-700/60 px-2.5 py-1 text-[10px] font-bold text-slate-200 hover:bg-slate-750 transition-colors flex items-center gap-1"
                  >
                    Cart ({cartCount})
                  </button>
                </div>

                <div className="p-4 flex-1 relative overflow-hidden text-left">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { name: "Coffee Mug", price: 499, color: "from-amber-600 to-amber-800" },
                      { name: "Leather Case", price: 1299, color: "from-yellow-800 to-yellow-950" },
                      { name: "Mech Keyboard", price: 4999, color: "from-blue-700 to-indigo-900" },
                    ].map((prod) => (
                      <div key={prod.name} className="bg-slate-900 border border-slate-850 rounded-xl p-3 flex flex-col justify-between shadow">
                        <div className={`h-14 rounded-lg bg-gradient-to-br ${prod.color} mb-2.5 flex items-center justify-center text-[9px] font-mono text-white/40`}>
                          Preview
                        </div>
                        <div>
                          <h5 className="text-[10px] font-bold text-white truncate">{prod.name}</h5>
                          <p className="text-xs text-pink-400 font-extrabold mt-0.5">₹{prod.price}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setCartCount(cartCount + 1);
                            setCartItems((prev) => {
                              const exist = prev.find(i => i.name === prod.name);
                              if (exist) return prev.map(i => i.name === prod.name ? { ...i, qty: i.qty + 1 } : i);
                              return [...prev, { name: prod.name, price: prod.price, qty: 1 }];
                            });
                          }}
                          className="mt-3.5 w-full py-1 bg-pink-600 hover:bg-pink-700 text-[9px] font-bold text-white rounded transition-colors shadow"
                        >
                          Add to Cart
                        </button>
                      </div>
                    ))}
                  </div>

                  {cartOpen && (
                    <div className="absolute inset-y-0 right-0 w-56 bg-slate-900 border-l border-slate-800 p-4 flex flex-col justify-between shadow-2xl">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                          <h6 className="text-[10px] font-bold text-white uppercase tracking-wider">Your Cart</h6>
                          <button type="button" onClick={() => setCartOpen(false)} className="text-[9px] text-slate-500 hover:text-white">Close</button>
                        </div>
                        {cartItems.length === 0 ? (
                          <p className="text-[9px] text-slate-500 text-center py-8">Cart is empty.</p>
                        ) : (
                          <div className="space-y-2 pr-1 max-h-[220px] overflow-y-auto">
                            {cartItems.map((item) => (
                              <div key={item.name} className="flex justify-between text-[9px] text-slate-300">
                                <span className="truncate max-w-[120px]">{item.name} x{item.qty}</span>
                                <span>₹{item.price * item.qty}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      {cartItems.length > 0 && (
                        <div className="border-t border-slate-850 pt-2 space-y-2">
                          <div className="flex justify-between text-[10px] font-bold text-white">
                            <span>Total</span>
                            <span>₹{cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0)}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              alert("Simulated Checkout Complete!");
                              setCartOpen(false);
                            }}
                            className="w-full py-1.5 bg-pink-600 hover:bg-pink-700 text-[10px] font-bold text-white rounded transition-colors shadow"
                          >
                            Checkout
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Local Business Hub */}
            {concept.id === "web-local" && (
              <div className="p-4 flex-1 flex flex-col space-y-4">
                <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
                  {["all", "starters", "mains", "drinks"].map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-1 text-[9px] font-bold rounded-lg uppercase tracking-wider transition-colors ${
                        activeTab === tab ? "bg-emerald-600 text-white shadow" : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 text-left">
                  {[
                    { name: "Pesto Garlic Bread", cat: "starters", price: 199, desc: "Garlic spread, fresh basil pesto." },
                    { name: "Truffle Fries", cat: "starters", price: 249, desc: "Crispy skin tossed in truffle oil." },
                    { name: "Neapolitan Pizza", cat: "mains", price: 449, desc: "Woodfired buffalo mozzarella." },
                    { name: "Blueberry Mojito", cat: "drinks", price: 180, desc: "Wild berries, carbonated soda." },
                  ]
                    .filter((i) => activeTab === "all" || i.cat === activeTab)
                    .map((item) => (
                      <div key={item.name} className="bg-slate-900 border border-slate-855 rounded-xl p-2.5 flex flex-col justify-between shadow">
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-bold text-white leading-tight">{item.name}</span>
                          <span className="text-[9px] text-emerald-400 font-extrabold ml-2">₹{item.price}</span>
                        </div>
                        <p className="text-[8px] text-slate-455 mt-1 leading-3">{item.desc}</p>
                      </div>
                    ))}
                </div>

                <div className="border-t border-slate-800 pt-3 space-y-2 text-left">
                  <h6 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Table Booking Mock</h6>
                  <div className="flex gap-1.5">
                    {[14, 15, 16, 17, 18, 19].map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => setSelectedDate(day)}
                        className={`flex-1 py-1.5 text-xs font-bold border rounded-lg transition-all ${
                          selectedDate === day
                            ? "bg-emerald-600 border-emerald-500 text-white shadow-[0_0_8px_rgba(16,185,129,0.25)]"
                            : "bg-slate-900 border-slate-850 text-slate-500 hover:border-slate-700"
                        }`}
                      >
                        {day}
                        <span className="block text-[7px] font-normal text-slate-500">July</span>
                      </button>
                    ))}
                  </div>
                  {selectedDate && (
                    <p className="text-[9px] text-emerald-400 text-center font-bold">
                      ✓ Table requested for July {selectedDate}, 2026.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Mobile App Viewport */}
            {concept.id.startsWith("app-") && (
              <div className="p-4 flex-1 flex justify-center items-center">
                <div className="w-[210px] h-[350px] bg-[#070b13] border-4 border-slate-800 rounded-[28px] p-3 flex flex-col justify-between shadow-2xl relative overflow-hidden select-none">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-3.5 bg-slate-800 rounded-b-lg z-20" />
                  <div className="flex justify-between items-center text-[7px] font-bold text-slate-550 pt-0.5">
                    <span>09:41</span>
                    <span className="text-blue-400">5G • 🔋 88%</span>
                  </div>

                  {concept.id === "app-delivery" ? (
                    <div className="flex-1 flex flex-col justify-between pt-3 text-left">
                      <div className="bg-slate-900 border border-slate-850 rounded-xl p-2.5 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-bold text-white">Active Order</span>
                          <span className="text-[7px] text-blue-400 font-extrabold bg-blue-500/10 px-1 rounded border border-blue-500/10">On Way</span>
                        </div>
                        <div className="h-16 bg-slate-950 border border-slate-850 rounded-lg relative overflow-hidden">
                          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:10px_10px]" />
                          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 size-1.5 bg-blue-500 rounded-full animate-ping" />
                          <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 text-xs">🚗</div>
                          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 text-xs">🏠</div>
                        </div>
                        <p className="text-[8px] font-bold text-slate-300">Rahul K. is delivering...</p>
                      </div>
                      <button type="button" className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-[9px] font-bold text-white rounded-lg transition-colors">
                        Call Rider
                      </button>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col justify-between pt-3 text-left space-y-2">
                      <div className="bg-slate-900 border border-slate-850 rounded-xl p-2.5 space-y-2">
                        <h5 className="text-[9px] font-black text-white">Luxe Appointment</h5>
                        <div className="space-y-1 text-[8px] text-slate-350">
                          <p><span className="text-slate-500">Service:</span> Spa Therapy</p>
                          <p><span className="text-slate-500">Therapist:</span> Elena Rose</p>
                          <p><span className="text-slate-500">Slot:</span> July 15, 10 AM</p>
                        </div>
                      </div>
                      <div className="rounded-lg bg-slate-900 border border-slate-850 p-1.5 flex justify-between items-center text-[7px] text-slate-455">
                        <span>SMS Reminders</span>
                        <div className="w-5 h-3 bg-emerald-600 rounded-full p-0.5 relative flex items-center">
                          <div className="size-2 bg-white rounded-full translate-x-1.5" />
                        </div>
                      </div>
                      <button type="button" className="w-full py-1.5 bg-purple-600 hover:bg-purple-700 text-[9px] font-bold text-white rounded-lg transition-colors">
                        Complete Booking
                      </button>
                    </div>
                  )}
                  <div className="w-16 h-0.5 bg-slate-800 rounded-full mx-auto" />
                </div>
              </div>
            )}

            {/* AI Agent Chatbot */}
            {concept.id.startsWith("ai-") && (
              <div className="flex-1 flex flex-col h-full text-left">
                <div className="border-b border-slate-800 bg-[#075e54] px-4 py-2 flex items-center gap-2 shrink-0">
                  <span className="text-base">🤖</span>
                  <div>
                    <p className="text-[10px] font-bold text-white">Skilloura AI Assistant</p>
                    <p className="text-[7px] text-emerald-200">Online • Live Chatbot Mock</p>
                  </div>
                </div>

                <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-slate-950/40 text-[9px] leading-relaxed flex flex-col max-h-[220px]">
                  {messages.map((m, i) => (
                    <div
                      key={i}
                      className={`max-w-[80%] p-2 rounded-xl ${
                        m.sender === "user"
                          ? "bg-[#128c7e] text-white self-end rounded-tr-none"
                          : "bg-slate-900 border border-slate-855 text-slate-300 self-start rounded-tl-none"
                      }`}
                    >
                      <p>{m.text}</p>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="bg-slate-900 border border-slate-855 text-slate-400 p-2 rounded-xl rounded-tl-none self-start flex gap-1 items-center px-3">
                      <span className="size-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="size-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-800 bg-[#070b13]/60 p-3 space-y-2 shrink-0">
                  <p className="text-[8px] font-bold text-slate-550 uppercase">Tap to query AI bot:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "What services do you offer?",
                      "How does the timeline work?",
                      "Can I see your portfolio?",
                    ].map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => {
                          if (isTyping) return;
                          setMessages((prev) => [...prev, { sender: 'user', text: q, time: 'Just now' }]);
                          setIsTyping(true);
                          setTimeout(() => {
                            let reply = "";
                            if (q.includes("services")) {
                              reply = "We design and develop premium websites, mobile apps, custom AI agents, and corporate branding assets.";
                            } else if (q.includes("timeline")) {
                              reply = "Usually, branding is completed in 1-2 weeks, website development in 2-3 weeks, and apps or custom AI in 4-6 weeks.";
                            } else {
                              reply = "Absolutely! Check out the details page or click any of the reference design cards here.";
                            }
                            setMessages((prev) => [...prev, { sender: 'bot', text: reply, time: 'Just now' }]);
                            setIsTyping(false);
                          }, 800);
                        }}
                        className="rounded bg-slate-855 hover:bg-slate-800 border border-slate-750 px-2 py-1 text-[8px] font-bold text-slate-200"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Branding Style Canvas */}
            {concept.id.startsWith("brand-") && (
              <div className="p-4 flex-1 flex flex-col space-y-4 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Brand Board</span>
                  <button
                    type="button"
                    onClick={() => setBrandBg(brandBg === 'light' ? 'dark' : 'light')}
                    className="rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700/60 px-2.5 py-1 text-[9px] font-bold text-slate-200"
                  >
                    Bg Toggle: {brandBg === 'light' ? 'Light' : 'Dark'}
                  </button>
                </div>

                <div className={`flex-1 rounded-xl p-4.5 border transition-colors flex flex-col justify-between ${
                  brandBg === 'light' ? "bg-slate-100 border-slate-200 text-slate-900" : "bg-slate-950 border-slate-850 text-slate-100"
                }`}>
                  <div className="space-y-2 text-center py-2">
                    <p className="text-[7px] font-mono tracking-widest text-slate-450 uppercase">Vector SVGs Typography</p>
                    <div className="flex justify-center items-center gap-1.5 text-xl font-black">
                      <span className="text-indigo-600">✦</span>
                      <span>{concept.id === 'brand-minimal' ? 'NEXUS' : 'LIVELY'}</span>
                    </div>
                    <p className="text-[8px] italic text-slate-455 font-serif">&ldquo;Empowering modern connectivity solutions&rdquo;</p>
                  </div>

                  <div className="grid grid-cols-4 gap-2 pt-3 border-t border-slate-500/10">
                    {[
                      { name: "Primary", hex: "#6366f1", bg: "bg-indigo-500" },
                      { name: "Secondary", hex: "#10b981", bg: "bg-emerald-500" },
                      { name: "Accent", hex: "#ec4899", bg: "bg-pink-500" },
                      { name: "Neutral", hex: brandBg === 'light' ? '#0f172a' : '#f8fafc', bg: brandBg === 'light' ? 'bg-slate-900' : 'bg-slate-100' },
                    ].map((col) => (
                      <div key={col.name} className="space-y-1 text-center">
                        <div className={`h-6 rounded shadow-sm ${col.bg}`} />
                        <p className="text-[7px] font-bold truncate leading-none">{col.name}</p>
                        <p className="text-[6px] font-mono text-slate-455 leading-none">{col.hex}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Video Subtitles & Marketing Ads */}
            {(concept.id.startsWith("vid-") || concept.id.startsWith("mkt-")) && (
              <div className="p-4 flex-1 flex flex-col justify-center items-center">
                {concept.id.startsWith("vid-") ? (
                  <div className="w-full max-w-xs space-y-3">
                    <div className="aspect-video w-full bg-slate-950 border border-slate-855 rounded-xl relative overflow-hidden flex flex-col justify-between p-3.5 shadow-lg">
                      <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 to-indigo-950/40 flex items-center justify-center">
                        <div className="size-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-base animate-pulse">▶</div>
                      </div>
                      <span className="text-[7px] font-bold text-slate-400 bg-black/40 px-1.5 py-0.5 rounded w-fit">00:0{subtitleIndex} / 00:04</span>

                      <div className="w-full text-center pb-1.5 z-10">
                        <p className="inline-block bg-black/80 text-amber-400 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded shadow border border-amber-400/20 animate-bounce">
                          {[
                            "🔥 THIS TOOL IS AMAZING!",
                            "💡 AUTOMATE YOUR SOCIAL CONTENT",
                            "📈 10X YOUR ORGANIC LEADS",
                            "🚀 TAP GET FREE QUOTE NOW!"
                          ][subtitleIndex]}
                        </p>
                      </div>
                    </div>
                    <p className="text-[8px] text-slate-500 text-center leading-3">
                      * caption tracks simulate editing workflows.
                    </p>
                  </div>
                ) : (
                  <div className="w-full max-w-xs text-left">
                    <div className="bg-slate-900 border border-slate-855 rounded-xl p-3.5 space-y-3 shadow">
                      <div className="flex items-center gap-2">
                        <span className="size-7 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">S</span>
                        <div>
                          <p className="text-[9px] font-black text-white leading-none">Skilloura Marketing</p>
                          <p className="text-[7px] text-slate-550 leading-none mt-1">Sponsored Campaign</p>
                        </div>
                      </div>
                      <p className="text-[9px] leading-relaxed text-slate-350">
                        Are you losing business calls due to poor SEO listings? Let&apos;s optimize maps keywords and citations!
                      </p>
                      <div className="flex justify-between items-center text-[8px] text-slate-400 border-t border-slate-855 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setLiked(!liked);
                            setLikes(liked ? likes - 1 : likes + 1);
                          }}
                          className={`font-bold ${liked ? 'text-blue-500' : 'hover:text-white'}`}
                        >
                          👍 {liked ? 'Liked' : 'Like'}
                        </button>
                        <span>{likes} Likes</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Output-style mockups for concepts without bespoke simulations */}
            {concept.id.startsWith("web-") &&
              !["web-saas", "web-ecommerce", "web-local"].includes(concept.id) && (
                <WebPreview id={concept.id} accent={concept.accent} />
              )}
            {concept.id.startsWith("dash-") && (
              <DashboardPreview id={concept.id} accent={concept.accent} />
            )}
            {concept.id.startsWith("cv-") && (
              <ResumePreview id={concept.id} accent={concept.accent} />
            )}
            {concept.id.startsWith("soft-") && (
              <SoftwarePreview id={concept.id} accent={concept.accent} />
            )}
          </div>
        </div>

        {/* Modal footer selector */}
        <div className="border-t border-slate-800 bg-[#070b13] px-6 py-4 shrink-0 flex items-center justify-between text-xs">
          <p className="text-slate-400 font-medium">
            Currently exploring: <strong className="text-white">{concept.title}</strong>
          </p>
          <button
            type="button"
            onClick={() => onSelect(concept.title)}
            className="rounded-lg bg-mint text-white px-5 py-2.5 font-bold hover:opacity-90 shadow-md shadow-mint/10 transition-all flex items-center gap-1.5"
          >
            ✓ Select as Reference Style
          </button>
        </div>
      </div>
    </div>
  );
}

const DRAFT_KEY = "skilloura_form_draft";

export default function ProjectRequestForm({ initialService }: { initialService?: string }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<CommonData>({
    ...initialData,
    serviceCategory: initialService && getService(initialService) ? initialService : "",
  });
  const [dynamicAnswers, setDynamicAnswers] = useState<Record<string, string | string[]>>({});
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  // Concept shapes vary per service (see DemoPreviewModal note)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [previewConcept, setPreviewConcept] = useState<any | null>(null);
  const [draftRestored, setDraftRestored] = useState(false);
  const draftLoaded = useRef(false);
  const submittedRef = useRef(false);
  const partialSentRef = useRef(false);

  // Autosave draft: files can't be persisted (File objects), terms must be
  // re-accepted, so both are excluded. Draft expires after 7 days.
  // Restore runs in a rAF so state updates aren't synchronous in the effect.
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      try {
        const raw = localStorage.getItem(DRAFT_KEY);
        if (raw) {
          const draft = JSON.parse(raw);
          const fresh =
            draft?.v === 1 &&
            typeof draft.savedAt === "number" &&
            Date.now() - draft.savedAt < 7 * 24 * 60 * 60 * 1000;
          const hasContent =
            draft?.data &&
            (draft.data.clientName || draft.data.email || draft.data.phone ||
              draft.data.serviceCategory || draft.data.projectDescription ||
              Object.keys(draft.dynamicAnswers ?? {}).length > 0);
          if (fresh && hasContent) {
            const sameService =
              !initialService || !draft.data?.serviceCategory || draft.data.serviceCategory === initialService;
            if (sameService) {
              setData({ ...initialData, ...draft.data, termsAccepted: false });
              setDynamicAnswers(draft.dynamicAnswers ?? {});
              setStep(Math.min(Math.max(draft.step ?? 0, 0), STEPS.length - 1));
            } else {
              // Arrived via a different service link — keep personal details only.
              const { clientName, email, phone, businessName, cityCountry } = draft.data ?? {};
              setData((d) => ({
                ...d,
                clientName: clientName ?? "",
                email: email ?? "",
                phone: phone ?? "",
                businessName: businessName ?? "",
                cityCountry: cityCountry ?? "",
              }));
            }
            setDraftRestored(true);
          } else {
            localStorage.removeItem(DRAFT_KEY);
          }
        }
      } catch {
        // corrupted draft — start clean
        try { localStorage.removeItem(DRAFT_KEY); } catch {}
      }
      draftLoaded.current = true;
    });
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!draftLoaded.current) return;
    const t = setTimeout(() => {
      try {
        const hasContent =
          data.clientName || data.email || data.phone || data.serviceCategory ||
          data.projectDescription || Object.keys(dynamicAnswers).length > 0;
        if (!hasContent) {
          localStorage.removeItem(DRAFT_KEY);
          return;
        }
        localStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({ v: 1, step, data, dynamicAnswers, savedAt: Date.now() })
        );
      } catch {}
    }, 400);
    return () => clearTimeout(t);
  }, [step, data, dynamicAnswers]);

  // Progressive lead capture: if someone gives their contact details (step 1)
  // and then leaves before submitting, send a partial lead so we can still
  // follow up. Fires at most once; the server de-dupes and clears it if the
  // person later completes the full submission.
  useEffect(() => {
    const maybeSendPartial = () => {
      if (submittedRef.current || partialSentRef.current) return;
      if (step < 1) return;
      const emailOk = /^\S+@\S+\.\S+$/.test(data.email);
      const phoneOk = data.phone.replace(/\D/g, "").length >= 7;
      if (!emailOk || !phoneOk) return;
      partialSentRef.current = true;
      try {
        const blob = new Blob(
          [
            JSON.stringify({
              clientName: data.clientName,
              email: data.email,
              phone: data.phone,
              serviceCategory:
                (data.serviceCategory ? getService(data.serviceCategory)?.name : "") ||
                data.serviceCategory ||
                "",
              projectDescription: data.projectDescription || "",
            }),
          ],
          { type: "application/json" }
        );
        navigator.sendBeacon("/api/leads/partial", blob);
      } catch {}
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") maybeSendPartial();
    };
    window.addEventListener("pagehide", maybeSendPartial);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("pagehide", maybeSendPartial);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [step, data.email, data.phone, data.clientName, data.serviceCategory, data.projectDescription]);

  const estimate = useMemo(() => {
    return calculateEstimate(data.serviceCategory, data.serviceType, dynamicAnswers, {
      deadline: data.deadline,
      hasDomain: data.hasDomain,
      hasHosting: data.hasHosting,
      needsMaintenance: data.needsMaintenance,
      projectStatus: data.projectStatus,
    });
  }, [
    data.serviceCategory,
    data.serviceType,
    dynamicAnswers,
    data.deadline,
    data.hasDomain,
    data.hasHosting,
    data.needsMaintenance,
    data.projectStatus,
  ]);

  const budgetGuidance = useMemo(() => {
    return getBudgetGuidance(estimate, data.budgetRange);
  }, [estimate, data.budgetRange]);

  const service = useMemo(
    () => (data.serviceCategory ? getService(data.serviceCategory) : undefined),
    [data.serviceCategory]
  );

  const set = <K extends keyof CommonData>(key: K, val: CommonData[K]) =>
    setData((d) => ({ ...d, [key]: val }));

  function validateStep(): string {
    switch (step) {
      case 0:
        if (data.clientName.trim().length < 2) return "Please enter your full name.";
        if (!/^\S+@\S+\.\S+$/.test(data.email)) return "Please enter a valid email.";
        if (data.phone.replace(/\D/g, "").length < 7) return "Please enter a valid WhatsApp number.";
        return "";
      case 1:
        if (!data.serviceCategory) return "Please select a service category.";
        if (!data.serviceType) return "Please select a project type.";
        if (data.projectDescription.trim().length < 10)
          return "Please describe your project (at least a sentence).";
        return "";
      case 2:
        // Demo concept showcase selection is optional
        return "";
      case 3: {
        const missing = (service?.formFields ?? []).find((f) => {
          if (!f.required) return false;
          const v = dynamicAnswers[f.key];
          return !v || (Array.isArray(v) ? v.length === 0 : v.trim() === "");
        });
        return missing ? `Please answer: ${missing.label}` : "";
      }
      case 5:
        if (!data.budgetRange) return "Please select a budget range.";
        if (!data.deadline) return "Please select an expected deadline.";
        return "";
      case 6:
        if (!data.termsAccepted) return "Please accept the terms to submit.";
        return "";
      default:
        return "";
    }
  }

  function next() {
    const err = validateStep();
    if (err) {
      setError(err);
      return;
    }
    setError("");
    try { track("form_step_completed", { step: STEPS[step], service: data.serviceCategory || "none" }); } catch {}
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function back() {
    setError("");
    setStep((s) => Math.max(s - 1, 0));
  }

  function onFilesSelected(list: FileList | null) {
    if (!list) return;
    const merged = [...files, ...Array.from(list)].slice(0, 10);
    setFiles(merged);
  }

  async function submit() {
    const err = validateStep();
    if (err) {
      setError(err);
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const formAnswers = (service?.formFields ?? [])
        .map((f) => {
          const v = dynamicAnswers[f.key];
          const answer = Array.isArray(v) ? v.join(", ") : (v ?? "");
          return { fieldKey: f.key, question: f.label, answer };
        })
        .filter((a) => a.answer.trim() !== "");

      if (data.selectedDemoConcept) {
        formAnswers.push({
          fieldKey: "selected_demo_concept",
          question: "Selected Reference Concept",
          answer: data.selectedDemoConcept,
        });
      }

      if (data.designStyle) {
        formAnswers.push({
          fieldKey: "design_style",
          question: "Preferred design style",
          answer: data.designStyle,
        });
      }

      if (data.budgetIntent) {
        formAnswers.push({
          fieldKey: "budget_intent",
          question: "Budget priority (what matters most)",
          answer: data.budgetIntent,
        });
      }

      if (estimate) {
        const pricingLines = estimate.items
          .map((item) => item.name + ": " + formatMoney(item.ourPrice) + " - " + item.reason)
          .join("\n");
        const guidance = getBudgetGuidance(estimate, data.budgetRange);

        formAnswers.push({
          fieldKey: "estimated_quote",
          question: "Skilloura guide estimate (internal)",
          answer:
            "Guide estimate shown to client: " +
            formatMoney(estimate.ourTotal) +
            "\nRecommended budget range: " +
            estimate.recommendedBudgetRange +
            "\n(Internal reference only — confirm the exact amount in the written quotation.)",
        });
        formAnswers.push({
          fieldKey: "pricing_inclusion_note",
          question: "What this estimate includes",
          answer:
            "This is Skilloura's delivery/service charge for planning, building/setup, testing, and handover. Domain, hosting, paid APIs, ad spend, store fees, and other third-party bills are separate unless written in the final quote.",
        });
        formAnswers.push({
          fieldKey: "price_breakdown",
          question: "Price breakdown and reason",
          answer: pricingLines,
        });
        if (guidance) {
          formAnswers.push({
            fieldKey: "budget_fit",
            question: "Selected budget fit",
            answer:
              "Selected budget: " +
              data.budgetRange +
              "\n" +
              guidance.title +
              "\n" +
              guidance.message,
          });
        }
      }

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: data.clientName,
          email: data.email,
          phone: data.phone,
          businessName: data.businessName,
          cityCountry: data.cityCountry,
          serviceCategory: service?.name ?? data.serviceCategory,
          serviceType: data.serviceType,
          projectDescription: data.projectDescription,
          budgetRange: data.budgetRange,
          deadline: data.deadline,
          projectStatus: data.projectStatus,
          preferredContact: data.preferredContact,
          bestTimeToContact: data.bestTimeToContact,
          readyToStart: data.readyToStart,
          advancePaymentComfort: data.advancePaymentComfort,
          additionalNotes: data.additionalNotes,
          hasDomain: data.hasDomain,
          hasHosting: data.hasHosting,
          needsMaintenance: data.needsMaintenance,
          referenceLinks: data.referenceLinks,
          termsAccepted: data.termsAccepted,
          selectedDemoConcept: data.selectedDemoConcept,
          formAnswers,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Submission failed");
      submittedRef.current = true; // completed — don't fire a partial-lead beacon on the redirect

      if (files.length > 0) {
        const fd = new FormData();
        fd.append("leadId", json.leadId);
        files.forEach((f) => fd.append("files", f));
        // file failure shouldn't lose the lead — surface softly
        await fetch("/api/upload", { method: "POST", body: fd }).catch(() => {});
      }

      try { track("lead_submitted", { service: data.serviceCategory || "unknown" }); } catch {}
      try { localStorage.removeItem(DRAFT_KEY); } catch {}
      router.push("/thank-you");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Progress stepper */}
      <ol className="flex items-center gap-1.5 sm:gap-2" aria-label="Form progress">
        {STEPS.map((label, i) => (
          <li key={label} className="flex-1">
            <div
              className={`h-1.5 rounded-full transition-colors ${
                i <= step ? "bg-accent" : "bg-line"
              }`}
            />
            <p
              className={`mt-2 hidden sm:block text-[11px] font-semibold ${
                i === step ? "text-accent" : "text-ink-soft"
              }`}
            >
              {label}
            </p>
          </li>
        ))}
      </ol>
      <p className="mt-3 sm:hidden text-sm font-semibold text-accent">
        Step {step + 1} of {STEPS.length}: {STEPS[step]}
      </p>

      {draftRestored && (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-mint/25 bg-mint/10 px-4 py-2.5">
          <p className="text-sm font-medium text-ink">
            Welcome back — your earlier answers were restored so you can continue where you left off.
          </p>
          <button
            type="button"
            onClick={() => {
              try { localStorage.removeItem(DRAFT_KEY); } catch {}
              window.location.href = "/start-project";
            }}
            className="shrink-0 text-xs font-semibold text-ink-soft underline-offset-2 hover:text-accent hover:underline"
          >
            Start fresh
          </button>
        </div>
      )}

      <div className="mt-8 rounded-3xl border border-line bg-white p-6 sm:p-8">
        {/* Step 1: Personal details */}
        {step === 0 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-ink">Tell me about yourself</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelCls}>
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  className={inputCls}
                  placeholder="Your name"
                  value={data.clientName}
                  onChange={(e) => set("clientName", e.target.value)}
                />
              </div>
              <div>
                <label className={labelCls}>
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  className={inputCls}
                  placeholder="you@example.com"
                  value={data.email}
                  onChange={(e) => set("email", e.target.value)}
                />
              </div>
              <div>
                <label className={labelCls}>
                  WhatsApp Number <span className="text-red-500">*</span>
                </label>
                <input
                  className={inputCls}
                  placeholder="+91 98765 43210"
                  value={data.phone}
                  onChange={(e) => set("phone", e.target.value)}
                />
              </div>
              <div>
                <label className={labelCls}>Business Name (optional)</label>
                <input
                  className={inputCls}
                  placeholder="Your business"
                  value={data.businessName}
                  onChange={(e) => set("businessName", e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>City / Country (optional)</label>
                <input
                  className={inputCls}
                  placeholder="e.g. Mumbai, India"
                  value={data.cityCountry}
                  onChange={(e) => set("cityCountry", e.target.value)}
                />
              </div>
            </div>
            {/* Micro-trust — reduce hesitation right where people give details */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 rounded-xl border border-line bg-background px-4 py-3">
              {[
                ["shield", "Your details stay private"],
                ["check", "Free — no obligation"],
                ["clock", "Personal reply within 24 hours"],
                ["spark", "No spam, ever"],
              ].map(([icon, text]) => (
                <span key={text} className="flex items-center gap-1.5 text-xs font-medium text-ink-soft">
                  <Icon name={icon} className="size-3.5 text-mint" /> {text}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Service selection */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-ink">What do you need?</h2>
            <div>
              <label className={labelCls}>
                Service Category <span className="text-red-500">*</span>
              </label>
              <div className="grid gap-2.5 sm:grid-cols-3">
                {serviceCategories.map((s) => (
                  <button
                    key={s.slug}
                    type="button"
                    onClick={() => {
                      set("serviceCategory", s.slug);
                      set("serviceType", "");
                      setDynamicAnswers({});
                    }}
                    className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-3 text-left text-sm font-semibold transition-colors ${
                      data.serviceCategory === s.slug
                        ? "border-accent bg-accent-soft text-accent"
                        : "border-line bg-white text-ink hover:border-accent/50"
                    }`}
                  >
                    <Icon name={s.icon} className="size-5 shrink-0" />
                    {s.shortName}
                  </button>
                ))}
              </div>
            </div>
            {service && (
              <div>
                <label className={labelCls}>
                  Project Type <span className="text-red-500">*</span>
                </label>
                <select
                  className={inputCls}
                  value={data.serviceType}
                  onChange={(e) => set("serviceType", e.target.value)}
                >
                  <option value="">Select project type...</option>
                  {service.services.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className={labelCls}>
                Project Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                className={inputCls}
                placeholder="Describe your project in your own words — what you need, for whom, and anything important..."
                value={data.projectDescription}
                onChange={(e) => set("projectDescription", e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Step 3: Concept Showcase (motionsites.ai style) */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-ink">Choose a Reference Design</h2>
              <p className="text-sm text-ink-soft mt-1">
                {`${(data.serviceCategory ? DEMO_CONCEPTS[data.serviceCategory] ?? [] : []).length} concepts related to your selected service — pick one as a design reference, or click Continue to skip.`}
              </p>
            </div>

            {/* Preferred style */}
            <div>
              <label className={labelCls}>What style do you like?</label>
              <div className="flex flex-wrap gap-2">
                {STYLE_OPTIONS.map((s) => {
                  const active = data.designStyle === s;
                  const suggest = s.startsWith("I don't know");
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => set("designStyle", active ? "" : s)}
                      className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                        active
                          ? "border-accent bg-accent text-white"
                          : suggest
                            ? "border-dashed border-accent/50 bg-accent-soft text-accent hover:bg-accent-soft/70"
                            : "border-line bg-white text-ink hover:border-accent/50"
                      }`}
                    >
                      {suggest ? "🤔 " : ""}{s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reference links + screenshots */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Paste reference website links (optional)</label>
                <textarea
                  rows={3}
                  className={inputCls}
                  placeholder="Websites / apps / designs you like — one per line"
                  value={data.referenceLinks}
                  onChange={(e) => set("referenceLinks", e.target.value)}
                />
              </div>
              <div>
                <label className={labelCls}>Upload reference screenshots (optional)</label>
                <label className="flex h-[104px] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-line bg-background text-center transition-colors hover:border-accent/50">
                  <Icon name="spark" className="size-5 text-accent" />
                  <span className="text-xs font-semibold text-ink">Click to add screenshots</span>
                  <span className="text-[11px] text-ink-soft">
                    {files.length > 0 ? `${files.length} file(s) added` : "PNG, JPG — added to your files"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => onFilesSelected(e.target.files)}
                  />
                </label>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {(data.serviceCategory ? DEMO_CONCEPTS[data.serviceCategory] ?? [] : []).map((concept) => {
                const active = data.selectedDemoConcept === concept.title;
                return (
                  <div
                    key={concept.id}
                    onClick={() => set("selectedDemoConcept", active ? "" : concept.title)}
                    className={`group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer ${
                      active
                        ? "bg-[#0b0f19] border-2 shadow-[0_0_25px_-5px_rgba(99,102,241,0.25)] text-slate-100"
                        : "bg-[#0b0f19] border-slate-800 text-slate-100 hover:border-slate-700/80 hover:shadow-lg hover:scale-[1.01]"
                    }`}
                    style={{
                      borderTopColor: active ? concept.accent : "transparent",
                      borderTopWidth: active ? "4px" : "1px",
                    }}
                  >
                    <div className="p-5 space-y-4 flex-1 flex flex-col">
                      <div className="flex items-start justify-between">
                        <span 
                          className="grid size-10 place-items-center rounded-xl text-white transition-transform group-hover:scale-105"
                          style={{ background: `linear-gradient(135deg, ${concept.accent}, ${concept.accent}dd)` }}
                        >
                          <Icon name={concept.icon} className="size-5" />
                        </span>
                        <span className="rounded-full bg-slate-800 border border-slate-700/60 px-2.5 py-0.5 text-[10px] font-semibold text-slate-300">
                          {concept.tag}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-white group-hover:text-accent-soft transition-colors">{concept.title}</h3>
                        <p className="text-xs text-slate-400 mt-1.5 leading-5">{concept.description}</p>
                      </div>

                      <div className="rounded-xl bg-slate-900/80 border border-slate-800/60 p-3.5 space-y-2 text-xs">
                        <p className="leading-5 text-slate-300">
                          <span className="font-bold text-slate-200">Problem: </span>
                          {concept.problem}
                        </p>
                        <p className="leading-5 text-slate-300">
                          <span className="font-bold text-slate-200">Solution: </span>
                          {concept.solution}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {concept.features.map((feat) => (
                          <span key={feat} className="rounded-full bg-slate-800/60 border border-slate-700/40 px-2 py-0.5 text-[10px] font-medium text-slate-400">
                            {feat}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-slate-800/80 bg-slate-900/40 px-5 py-3.5 flex items-center justify-between gap-3 text-xs font-semibold">
                      {hasLiveDemo(concept.id) ? (
                        <a
                          href={`/demo/${concept.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="rounded-lg bg-slate-850 hover:bg-slate-800 px-3.5 py-2 text-[10px] font-bold text-slate-200 border border-slate-700/60 transition-colors flex items-center gap-1.5"
                        >
                          Explore Live Demo
                          <span className="text-[8px] bg-mint/25 text-mint px-1.5 py-0.5 rounded font-mono uppercase tracking-wider animate-pulse">Live</span>
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewConcept(concept);
                          }}
                          className="rounded-lg bg-slate-850 hover:bg-slate-800 px-3.5 py-2 text-[10px] font-bold text-slate-200 border border-slate-700/60 transition-colors flex items-center gap-1.5"
                        >
                          Explore Design
                          <span className="text-[8px] bg-accent/25 text-accent-soft px-1.5 py-0.5 rounded font-mono uppercase tracking-wider">Preview</span>
                        </button>
                      )}

                      <div className="flex items-center gap-2">
                        <span className={active ? "text-mint" : "text-slate-400 group-hover:text-slate-355"}>
                          {active ? "Selected" : "Select"}
                        </span>
                        <div className={`size-4.5 rounded-full border flex items-center justify-center transition-all ${
                          active ? "border-mint bg-mint text-white font-bold" : "border-slate-700 group-hover:border-slate-500"
                        }`}>
                          {active && <span className="text-[10px]">✓</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {data.selectedDemoConcept && (
              <div className="rounded-2xl border border-line bg-background p-4.5 text-center text-sm font-semibold text-ink flex items-center justify-center gap-2">
                <span>Selected style: </span>
                <span className="text-accent font-extrabold">{data.selectedDemoConcept}</span>
                <button
                  type="button"
                  onClick={() => set("selectedDemoConcept", "")}
                  className="text-xs text-red-500 hover:text-red-600 font-bold ml-2 underline"
                >
                  Clear selection
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Dynamic service questions */}
        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-ink">
              {service ? `${service.name} — details` : "Project details"}
            </h2>
            <p className="text-sm text-ink-soft">
              These questions are specific to your service so you get an accurate quote. Skip
              any you&apos;re unsure about (except required ones).
            </p>

            {/* Live Pricing Estimator Widget */}
            {estimate && <EstimatePanel estimate={estimate} />}

            {(service?.formFields ?? []).map((field) => (
              <div key={field.key}>
                <label className={labelCls}>
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                <DynamicField
                  field={field}
                  value={dynamicAnswers[field.key] ?? (field.type === "multiselect" ? [] : "")}
                  onChange={(v) => setDynamicAnswers((a) => ({ ...a, [field.key]: v }))}
                />
              </div>
            ))}
          </div>
        )}

        {/* Step 5: Files */}
        {step === 4 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-ink">Upload files (optional)</h2>
            <p className="text-sm text-ink-soft">
              Logo, images, videos, menu PDFs, documents, reference material — anything that
              helps me understand your project. Allowed: JPG, PNG, PDF, DOCX, XLSX, ZIP, MP4,
              TXT · max 25 MB each · up to 10 files.
            </p>
            <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-line bg-background px-6 py-10 text-center hover:border-accent transition-colors">
              <Icon name="file" className="size-8 text-accent" />
              <span className="text-sm font-semibold text-ink">
                Click to choose files
              </span>
              <span className="text-xs text-ink-soft">or drag and drop here</span>
              <input
                type="file"
                multiple
                className="hidden"
                accept=".jpg,.jpeg,.png,.pdf,.docx,.xlsx,.zip,.mp4,.txt"
                onChange={(e) => onFilesSelected(e.target.files)}
              />
            </label>
            {files.length > 0 && (
              <ul className="space-y-2">
                {files.map((f, i) => (
                  <li
                    key={`${f.name}-${i}`}
                    className="flex items-center justify-between gap-3 rounded-xl border border-line bg-white px-4 py-2.5 text-sm"
                  >
                    <span className="truncate text-ink">{f.name}</span>
                    <span className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-ink-soft">
                        {(f.size / 1024 / 1024).toFixed(1)} MB
                      </span>
                      <button
                        type="button"
                        onClick={() => setFiles(files.filter((_, j) => j !== i))}
                        className="text-red-500 hover:text-red-600 text-xs font-semibold"
                      >
                        Remove
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Step 6: Budget, deadline, qualification */}
        {step === 5 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-ink">Budget & timing</h2>
            {/* Budget intent — what matters most, in the client's own words */}
            <div>
              <label className={labelCls}>What matters most to you?</label>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {BUDGET_INTENTS.map((b) => {
                  const active = data.budgetIntent === b.value;
                  return (
                    <button
                      key={b.value}
                      type="button"
                      onClick={() => set("budgetIntent", active ? "" : b.value)}
                      className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                        active ? "border-accent bg-accent-soft" : "border-line bg-white hover:border-accent/50"
                      }`}
                    >
                      <span
                        className={`mt-0.5 grid size-4.5 shrink-0 place-items-center rounded-full border ${
                          active ? "border-accent bg-accent text-white" : "border-line"
                        }`}
                      >
                        {active && <span className="text-[10px]">✓</span>}
                      </span>
                      <span>
                        <span className="block text-sm font-bold text-ink">{b.value}</span>
                        <span className="block text-xs text-ink-soft">{b.desc}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className={labelCls}>
                Budget Range <span className="text-red-500">*</span>
              </label>
              <RadioGroup
                name="Budget"
                options={budgetRanges}
                value={data.budgetRange}
                onChange={(v) => set("budgetRange", v)}
              />
              {estimate && budgetGuidance && (
                <div className="mt-4">
                  <BudgetFitPanel
                    estimate={estimate}
                    guidance={budgetGuidance}
                    onChooseRecommended={() => set("budgetRange", budgetGuidance.recommendedRange)}
                  />
                </div>
              )}
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelCls}>
                  Expected Deadline <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className={inputCls}
                  min={new Date().toISOString().split("T")[0]}
                  value={data.deadline}
                  onChange={(e) => set("deadline", e.target.value)}
                />
              </div>
              <div>
                <label className={labelCls}>Project Status</label>
                <select
                  className={inputCls}
                  value={data.projectStatus}
                  onChange={(e) => set("projectStatus", e.target.value)}
                >
                  <option value="">Select...</option>
                  {projectStatusOptions.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              <div>
                <label className={labelCls}>Do you have a domain?</label>
                <RadioGroup
                  name="Domain"
                  options={["Yes", "No", "Not sure"]}
                  value={data.hasDomain}
                  onChange={(v) => set("hasDomain", v)}
                />
              </div>
              <div>
                <label className={labelCls}>Do you have hosting?</label>
                <RadioGroup
                  name="Hosting"
                  options={["Yes", "No", "Not sure"]}
                  value={data.hasHosting}
                  onChange={(v) => set("hasHosting", v)}
                />
              </div>
              <div>
                <label className={labelCls}>Need maintenance?</label>
                <RadioGroup
                  name="Maintenance"
                  options={["Yes", "No", "Not sure"]}
                  value={data.needsMaintenance}
                  onChange={(v) => set("needsMaintenance", v)}
                />
              </div>
            </div>
            {estimate && (
              <div className="space-y-2">
                <p className="text-sm font-bold text-ink">Updated price after deadline, domain, hosting and maintenance choices</p>
                <EstimatePanel estimate={estimate} />
              </div>
            )}
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Preferred contact method (pick one or more)</label>
                <MultiSelect
                  options={["WhatsApp", "Email", "Call"]}
                  values={data.preferredContact ? data.preferredContact.split(", ").filter(Boolean) : []}
                  onChange={(v) => set("preferredContact", (v as string[]).join(", "))}
                />
                <p className="mt-2 text-xs leading-4 text-ink-soft">
                  We already have your email (<span className="font-semibold text-ink">{data.email || "step 1"}</span>) and
                  WhatsApp number (<span className="font-semibold text-ink">{data.phone || "step 1"}</span>) from step 1 —
                  just tell us how you&apos;d prefer to be reached.
                </p>
              </div>
              <div>
                <label className={labelCls}>Best time to contact</label>
                <select
                  className={inputCls}
                  value={data.bestTimeToContact}
                  onChange={(e) => set("bestTimeToContact", e.target.value)}
                >
                  <option value="">Select...</option>
                  {contactTimes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Ready to start within 7 days?</label>
                <RadioGroup
                  name="Ready"
                  options={["Yes", "No", "Maybe"]}
                  value={data.readyToStart}
                  onChange={(v) => set("readyToStart", v)}
                />
              </div>
              <div>
                <label className={labelCls}>Comfortable with advance payment?</label>
                <RadioGroup
                  name="Advance"
                  options={["Yes", "No", "Need discussion"]}
                  value={data.advancePaymentComfort}
                  onChange={(v) => set("advancePaymentComfort", v)}
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>Additional Notes (optional)</label>
              <textarea
                rows={3}
                className={inputCls}
                placeholder="Anything else I should know..."
                value={data.additionalNotes}
                onChange={(e) => set("additionalNotes", e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Step 7: Review */}
        {step === 6 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-ink">Review & submit</h2>
            <div className="rounded-2xl bg-background p-5 space-y-2.5 text-sm">
              {[
                ["Name", data.clientName],
                ["Email", data.email],
                ["WhatsApp", data.phone],
                ["Service", service?.name ?? ""],
                ["Project type", data.serviceType],
                ["Reference Concept", data.selectedDemoConcept],
                ["Budget", data.budgetRange],
                ["Deadline", data.deadline],
                ["Files", files.length ? `${files.length} file(s)` : "None"],
              ]
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <p key={k} className="flex justify-between gap-4">
                    <span className="font-semibold text-ink-soft">{k}</span>
                    <span className="text-right font-medium text-ink">{v}</span>
                  </p>
                ))}
              <p className="pt-2 border-t border-line">
                <span className="font-semibold text-ink-soft">Description: </span>
                <span className="text-ink">{data.projectDescription}</span>
              </p>
            </div>

            {estimate && (
              <div className="space-y-4">
                <EstimatePanel estimate={estimate} />
                {budgetGuidance && (
                  <BudgetFitPanel
                    estimate={estimate}
                    guidance={budgetGuidance}
                    onChooseRecommended={() => set("budgetRange", budgetGuidance.recommendedRange)}
                  />
                )}
              </div>
            )}

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={data.termsAccepted}
                onChange={(e) => set("termsAccepted", e.target.checked)}
                className="mt-1 size-4 accent-[var(--accent)]"
              />
              <span className="text-sm text-ink-soft">
                I agree to the{" "}
                <a href="/terms" target="_blank" className="font-semibold text-accent hover:underline">
                  terms
                </a>
                , project scope process,{" "}
                <a href="/payment-policy" target="_blank" className="font-semibold text-accent hover:underline">
                  payment terms
                </a>
                ,{" "}
                <a href="/revision-policy" target="_blank" className="font-semibold text-accent hover:underline">
                  revision policy
                </a>{" "}
                and delivery rules. <span className="text-red-500">*</span>
              </span>
            </label>
          </div>
        )}

        {error && (
          <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </p>
        )}

        {/* Nav buttons */}
        <div className="mt-8 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={back}
            disabled={step === 0 || submitting}
            className="rounded-full border border-line px-6 py-3 text-sm font-semibold text-ink hover:border-accent hover:text-accent transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            ← Back
          </button>
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={next}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-semibold text-white hover:bg-accent-deep transition-colors"
            >
              Continue <Icon name="arrow" className="size-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-semibold text-white hover:bg-accent-deep transition-colors disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit Project Requirement"}
            </button>
          )}
        </div>
      </div>

      {previewConcept && (
        <DemoPreviewModal
          concept={previewConcept}
          onClose={() => setPreviewConcept(null)}
          onSelect={(title) => {
            set("selectedDemoConcept", title);
            setPreviewConcept(null);
          }}
          selected={data.selectedDemoConcept === previewConcept.title}
        />
      )}
    </div>
  );
}
