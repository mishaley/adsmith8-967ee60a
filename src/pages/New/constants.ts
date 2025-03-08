
// Campaign platform options from Supabase enum
export const PLATFORM_OPTIONS = ["Google", "Meta"] as const;
export type CampaignPlatform = typeof PLATFORM_OPTIONS[number];

// Campaign bid strategy options from Supabase enum
export const BID_STRATEGY_OPTIONS = ["Highest Volume", "Cost Per Result", "Return On Ad Spend"] as const;
export type CampaignBidStrategy = typeof BID_STRATEGY_OPTIONS[number];
