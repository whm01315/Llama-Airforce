import type { EpochOverview } from "@/Pages/Bribes/Models";

export type OverviewId = "bribes-overview-votium" | "bribes-overview-aura";

export type Overview = {
  id: OverviewId;
  rewardPerDollarBribe: number;
  epochs: EpochOverview[];
};
