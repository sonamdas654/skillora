import type { Metadata } from "next";
import GetStartedFlow from "./GetStartedFlow";

/**
 * The requirement form route.
 *
 * This is the primary conversion URL on the site, and until now it had no
 * metadata whatsoever — no title, no description, no canonical. Not an
 * oversight in the copy: the whole file was "use client", and a client
 * component cannot export metadata. Splitting the server shell from the
 * client flow is the only fix.
 *
 * The flow itself moved to ./GetStartedFlow.tsx with its logic untouched.
 */
export const metadata: Metadata = {
  alternates: { canonical: "/get-started" },
  title: "Start Your Project — Get a Written Scope & Fixed Quote",
  description:
    "Tell us what you need in about three minutes. You get an itemised scope, a fixed quote and exact dates in writing before any payment — websites, apps, AI automation, dashboards and custom software.",
};

export default function GetStartedPage() {
  return <GetStartedFlow />;
}
