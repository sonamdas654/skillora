"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { PricingService, PricingField, PricingFieldOption, PricingRule, PricingExternalCost } from "@/lib/pricingEngine";

export interface PricingConfig {
  service: PricingService;
  fields: PricingField[];
  optionsByField: Record<string, PricingFieldOption[]>;
  rules: PricingRule[];
  externalCosts: PricingExternalCost[];
}

// Loads one service's full pricing config (questions, options, rules,
// external costs) from the database — the same tables the admin panel
// edits, so a price/question change there shows up here with no code
// change. Returns null while loading or if the slug has no active config.
export function usePricingConfig(serviceSlug: string | null): { config: PricingConfig | null; loading: boolean } {
  const [config, setConfig] = useState<PricingConfig | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!serviceSlug) {
        if (active) setConfig(null);
        return;
      }
      if (active) setLoading(true);
      const supabase = createClient();
      const { data: service } = await supabase
        .from("pricing_services")
        .select("id, slug, name, description, base_market_price, base_skilloura_price, timeline")
        .eq("slug", serviceSlug)
        .eq("active", true)
        .maybeSingle();
      if (!service) {
        if (active) {
          setConfig(null);
          setLoading(false);
        }
        return;
      }

      const [{ data: fields }, { data: rules }, { data: externalCosts }] = await Promise.all([
        supabase
          .from("pricing_fields")
          .select("id, service_id, field_key, label, field_type, required, placeholder, display_order, conditional_rule")
          .eq("service_id", service.id)
          .eq("active", true)
          .order("display_order"),
        supabase
          .from("pricing_rules")
          .select("id, service_id, label, rule_type, condition, market_adjustment, skilloura_adjustment, multiplier, custom_quote_trigger")
          .eq("service_id", service.id)
          .eq("active", true),
        supabase
          .from("pricing_external_costs")
          .select("id, service_id, item_name, cost_type, estimated_cost, recurring, discount_allowed")
          .eq("service_id", service.id)
          .eq("active", true),
      ]);

      const fieldIds = (fields ?? []).map((f) => f.id);
      const { data: options } =
        fieldIds.length > 0
          ? await supabase
              .from("pricing_field_options")
              .select("id, field_id, option_label, option_value, market_price, skilloura_price, pricing_type, quantity_unit, minimum_quantity, maximum_quantity, display_order")
              .in("field_id", fieldIds)
              .eq("active", true)
              .order("display_order")
          : { data: [] };

      const optionsByField: Record<string, PricingFieldOption[]> = {};
      for (const o of options ?? []) {
        (optionsByField[o.field_id] ??= []).push(o as PricingFieldOption);
      }

      if (!active) return;
      setConfig({
        service: service as PricingService,
        fields: (fields ?? []) as PricingField[],
        optionsByField,
        rules: (rules ?? []) as PricingRule[],
        externalCosts: (externalCosts ?? []) as PricingExternalCost[],
      });
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [serviceSlug]);

  return { config, loading };
}
