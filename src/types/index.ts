import { ActivityType } from "./ActivityType";
import { SportType } from "./SportType";

type DataSport = {
  cycling: number;
  running: number;
  swimming: number;
};

export type Stats = {
  name: string;
  distance: DataSport;
  time: DataSport;
  activity: DataSport;
  drop: DataSport;
};

export type DataType = "distance" | "time" | "activity" | "drop";
export type Sports = "cycling" | "running" | "swimming";
export type SortBy = Sports | "total" | "alphabetical";

export type StravaLogin = {
  name: string;
  id: number;
  email: string;
  password: string;
};

export type AppLogin = {
  email: string;
  password: string;
};

export type User = {
  name: string;
  /** Strava id */
  id: string;
  email: string;
  /** string - temporary */
  sessionId: string;
};

export type Response = {
  access_token: string;
  expires_at: number;
  expires_in: number;
  refresh_token: string;
  token_type: "Bearer";
};

export type Activity = {
  name: string;
  /** meters */
  distance: number;
  /** start_date_local: GMT+01 */
  start_date_local: string;
  /** start_date: GMT */
  start_date: string;
  /** @deprecated */
  type: ActivityType;
  sport_type: SportType;
  /** seconds */
  moving_time: number;
  /** seconds */
  elapsed_time: number;
  total_elevation_gain: number;
  id: number;
  resource_state: number;
  workout_type: number;
  timezone: string;
  utc_offset: number;
  location_city: null;
  location_state: null;
  location_country: string;
  suffer_score: number;
  // not complete
};

export type Athlete = {
  name: string;
  id: number;
};

type ZoneRange = {
  min: number;
  max: number;
};

type HeartRate = {
  custom_zones: boolean;
  zones: ZoneRange[];
};

export type Zones = {
  heart_rate: HeartRate;
};

export type ActivityTotal = {
  distance: number;
  achievement_count: number;
  count: number;
  elapsed_time: number;
  elevation_gain: number;
  moving_time: number;
};

export type ActivityStats = {
  recent_run_totals: ActivityTotal;
  all_run_totals: ActivityTotal;
  /** recent (last 4 weeks) swim stats */
  recent_swim_totals: ActivityTotal;
  biggest_ride_distance: number;
  /** year to date swim stats */
  ytd_swim_totals: ActivityTotal;
  /** all time swim stats */
  all_swim_totals: ActivityTotal;
  recent_ride_totals: ActivityTotal;
  biggest_climb_elevation_gain: number;
  ytd_ride_totals: ActivityTotal;
  all_ride_totals: ActivityTotal;
  ytd_run_totals: ActivityTotal;
};

type TimedZoneRange = {
  min: number;
  max: number;
  time: number;
};

export type ActivityZone = {
  score: number;
  distribution_buckets: TimedZoneRange[];
  type: "heartrate" | "power";
  sensor_based: boolean;
  points: number;
  custom_zones: boolean;
  max: number;
};
