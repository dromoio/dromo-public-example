export type AnalyticsEvent =
  | "shared_config_loaded"
  | "template_selected"
  | "hook_toggled"
  | "theme_selected"
  | "preview_launched"
  | "code_tab_viewed"
  | "sample_errors_loaded"
  | "share_link_copied";

// Lightweight interaction tracker for the Schema Builder demo. This tells a
// sales engineer which features a given prospect actually explored before a
// call. Swap the console.log below for a real provider (Segment, Amplitude,
// GA, etc.) — every call site in the Schema Builder already funnels through
// this one function.
export const trackEvent = (event: AnalyticsEvent, properties?: Record<string, unknown>) => {
  // eslint-disable-next-line no-console
  console.log("[dromo-demo-analytics]", event, properties || {});
};
