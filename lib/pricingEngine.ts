// Reusable, service-agnostic pricing engine. Reads its config from the
// pricing_* Supabase tables (see supabase/phase22_pricing_engine.sql) —
// nothing here is specific to any one service. Selecting a different
// service just means calling this with a different config object.

export interface PricingService {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  base_market_price: number;
  base_skilloura_price: number;
  timeline: string | null;
}

export type FieldType = "text" | "textarea" | "select" | "multiselect" | "radio" | "checkbox" | "file" | "date" | "number";

export interface ConditionalRule {
  field: string;
  in: string[];
}

export interface PricingField {
  id: string;
  service_id: string;
  field_key: string;
  label: string;
  field_type: FieldType;
  required: boolean;
  placeholder: string | null;
  display_order: number;
  conditional_rule: ConditionalRule | null;
}

export type OptionPricingType = "fixed" | "per_item" | "per_range" | "percentage" | "multiplier" | "recurring" | "one_time";

export interface PricingFieldOption {
  id: string;
  field_id: string;
  option_label: string;
  option_value: string;
  market_price: number;
  skilloura_price: number;
  pricing_type: OptionPricingType;
  quantity_unit: string | null;
  minimum_quantity: number | null;
  maximum_quantity: number | null;
  display_order: number;
}

export interface PricingExternalCost {
  id: string;
  service_id: string;
  item_name: string;
  cost_type: string;
  estimated_cost: number;
  recurring: boolean;
  discount_allowed: boolean;
}

export type RuleCondition =
  | { field: string; in: string[] }
  | { field: string; equals: string }
  | { field: string; containsAny: string[] }
  | Record<string, never>; // {} = always matches

export interface PricingRule {
  id: string;
  service_id: string;
  label: string;
  rule_type: string;
  condition: RuleCondition;
  market_adjustment: number;
  skilloura_adjustment: number;
  multiplier: number;
  custom_quote_trigger: boolean;
}

export type Answers = Record<string, string | string[] | undefined>;

export interface LineItem {
  label: string;
  marketPrice: number;
  skillouraPrice: number;
  recurring: boolean;
}

export interface EstimateResult {
  marketOneTime: number;
  skillouraOneTime: number;
  savingsOneTime: number;
  marketRecurringMonthly: number;
  skillouraRecurringMonthly: number;
  externalCosts: { name: string; cost: number; recurring: boolean }[];
  externalCostsTotal: number;
  lineItems: LineItem[];
  customQuoteRequired: boolean;
  customQuoteReason: string | null;
  estimatedDelivery: string;
}

function answerValues(v: string | string[] | undefined): string[] {
  if (v === undefined) return [];
  return Array.isArray(v) ? v : [v];
}

function matchesCondition(rule: ConditionalRule | RuleCondition, answers: Answers): boolean {
  if (!("field" in rule) || !rule.field) return true; // {} => always visible/applies
  const values = answerValues(answers[rule.field]);
  if ("in" in rule) return rule.in.some((v) => values.includes(v));
  if ("equals" in rule) return values.includes(rule.equals);
  if ("containsAny" in rule) return rule.containsAny.some((v) => values.includes(v));
  return true;
}

// A field is visible if it has no conditional_rule, or its rule matches the
// current answers — e.g. "product_count" only shows once website_type is
// "Ecommerce website".
export function isFieldVisible(field: PricingField, answers: Answers): boolean {
  if (!field.conditional_rule) return true;
  return matchesCondition(field.conditional_rule, answers);
}

// Large/open-ended tiers ("10+ pages", "100+ products", "Full-time work" —
// anything the site itself labels as its top, unbounded tier) are a genuine
// signal the scope may need a human look rather than a confident fixed
// number. Restricted to select/radio/multiselect answers (not free text) so
// an unrelated "+" in a description never triggers this by accident.
function isOpenEndedSignal(field: PricingField, value: string): boolean {
  if (!["select", "radio", "multiselect"].includes(field.field_type)) return false;
  // Matches "10+ pages", "100+ products", "50,000+", "10+" — a number
  // immediately followed by "+", anywhere in the label — plus the site's
  // own "full-time" wording for maxed-out workload options.
  return /\d\+/.test(value) || /full[- ]time/i.test(value);
}

// --- Admin-only cost/profit engine ---------------------------------------
// Separate from the client-facing estimate above: this reads the OWNER'S
// real internal costs (pricing_cost_items — never public, RLS admin-only)
// and computes what a project actually costs to deliver vs. what it's
// priced at. Percentage-type costs (GST, payment gateway fee) are applied
// to the Skilloura price; everything else (labour, hosting, etc.) is a
// flat unit_cost × estimated_units.
export interface CostItem {
  id: string;
  service_id: string;
  cost_item: string;
  cost_type: "labor" | "overhead" | "tax" | "fee" | "one_time" | "recurring";
  unit_cost: number;
  estimated_units: number;
  notes: string | null;
}

export interface CostSummary {
  actualCost: number;
  grossProfit: number;
  profitMarginPct: number;
  discountGiven: number;
  breakEvenPrice: number;
  hasLaborCosts: boolean;
}

export function computeCostSummary(
  service: { base_skilloura_price: number; base_market_price: number },
  costItems: CostItem[]
): CostSummary {
  let actualCost = 0;
  for (const item of costItems) {
    if (item.cost_type === "tax" || item.cost_type === "fee") {
      actualCost += service.base_skilloura_price * (item.unit_cost / 100) * (item.estimated_units || 1);
    } else {
      actualCost += item.unit_cost * item.estimated_units;
    }
  }
  const grossProfit = service.base_skilloura_price - actualCost;
  return {
    actualCost: Math.round(actualCost),
    grossProfit: Math.round(grossProfit),
    profitMarginPct: service.base_skilloura_price > 0 ? Math.round((grossProfit / service.base_skilloura_price) * 1000) / 10 : 0,
    discountGiven: Math.round(service.base_market_price - service.base_skilloura_price),
    breakEvenPrice: Math.round(actualCost),
    hasLaborCosts: costItems.some((c) => c.cost_type === "labor"),
  };
}

export function computeEstimate(input: {
  service: PricingService;
  fields: PricingField[];
  optionsByField: Record<string, PricingFieldOption[]>;
  rules: PricingRule[];
  externalCosts: PricingExternalCost[];
  answers: Answers;
  projectType?: string; // the separate "Project type" selector (not DB-driven)
}): EstimateResult {
  const { service, fields, optionsByField, rules, externalCosts, answers, projectType } = input;

  let marketOneTime = service.base_market_price;
  let skillouraOneTime = service.base_skilloura_price;
  let marketRecurringMonthly = 0;
  let skillouraRecurringMonthly = 0;
  const lineItems: LineItem[] = [
    { label: `${service.name} — base`, marketPrice: service.base_market_price, skillouraPrice: service.base_skilloura_price, recurring: false },
  ];

  let customQuoteRequired = false;
  let customQuoteReason: string | null = null;

  const visibleFields = fields.filter((f) => isFieldVisible(f, answers));

  for (const field of visibleFields) {
    const selected = answerValues(answers[field.field_key]);
    if (selected.length === 0) continue;

    const options = optionsByField[field.id] ?? [];
    const quantity = field.field_type === "number" ? Number(selected[0]) || 0 : selected.length;

    for (const value of selected) {
      if (!customQuoteRequired && isOpenEndedSignal(field, value)) {
        customQuoteRequired = true;
        customQuoteReason = `"${value}" for ${field.label.toLowerCase()} is a large/open-ended option — we'll confirm the exact scope and price with you directly.`;
      }

      const opt = options.find((o) => o.option_value === value);
      if (!opt) continue;

      let m = 0;
      let s = 0;
      let recurring = false;
      switch (opt.pricing_type) {
        case "fixed":
        case "one_time":
          m = opt.market_price;
          s = opt.skilloura_price;
          break;
        case "per_item":
        case "per_range": {
          const qty = quantity > 0 ? quantity : 1;
          m = opt.market_price * qty;
          s = opt.skilloura_price * qty;
          break;
        }
        case "percentage":
          m = marketOneTime * (opt.market_price / 100);
          s = skillouraOneTime * (opt.skilloura_price / 100);
          break;
        case "multiplier":
          if (opt.market_price > 0) marketOneTime *= opt.market_price;
          if (opt.skilloura_price > 0) skillouraOneTime *= opt.skilloura_price;
          continue; // already applied directly, skip the line-item add below
        case "recurring":
          m = opt.market_price;
          s = opt.skilloura_price;
          recurring = true;
          break;
      }

      if (m === 0 && s === 0) continue; // no price impact yet (not configured) — skip noisy zero rows

      if (recurring) {
        marketRecurringMonthly += m;
        skillouraRecurringMonthly += s;
      } else {
        marketOneTime += m;
        skillouraOneTime += s;
      }
      lineItems.push({ label: `${field.label}: ${opt.option_label}`, marketPrice: m, skillouraPrice: s, recurring });
    }
  }

  // Project type itself ("Custom web application", "Custom mobile app"...) —
  // the site's own naming for its most-bespoke tier is a real, existing
  // signal for "this needs a proper scoping conversation," not a guess.
  if (!customQuoteRequired && projectType && /custom|enterprise/i.test(projectType)) {
    customQuoteRequired = true;
    customQuoteReason = `"${projectType}" is a fully custom build — we'll scope it properly and confirm the price in writing rather than guess a range.`;
  }

  for (const rule of rules) {
    if (!matchesCondition(rule.condition, answers)) continue;
    marketOneTime += rule.market_adjustment;
    skillouraOneTime += rule.skilloura_adjustment;
    if (rule.multiplier && rule.multiplier !== 1) {
      marketOneTime *= rule.multiplier;
      skillouraOneTime *= rule.multiplier;
    }
    if (rule.custom_quote_trigger) {
      customQuoteRequired = true;
      customQuoteReason = customQuoteReason ?? rule.label;
    }
  }

  const activeExternal = externalCosts.map((c) => ({ name: c.item_name, cost: c.estimated_cost, recurring: c.recurring }));
  const externalCostsTotal = activeExternal.filter((c) => !c.recurring).reduce((sum, c) => sum + c.cost, 0);

  return {
    marketOneTime: Math.round(marketOneTime),
    skillouraOneTime: Math.round(skillouraOneTime),
    savingsOneTime: Math.round(marketOneTime - skillouraOneTime),
    marketRecurringMonthly: Math.round(marketRecurringMonthly),
    skillouraRecurringMonthly: Math.round(skillouraRecurringMonthly),
    externalCosts: activeExternal,
    externalCostsTotal,
    lineItems,
    customQuoteRequired,
    customQuoteReason,
    estimatedDelivery: customQuoteRequired
      ? "To be confirmed after scope review"
      : service.timeline ?? "Confirmed after requirement review",
  };
}
