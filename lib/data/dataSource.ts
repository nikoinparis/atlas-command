import { mockDataSource } from "@/lib/data/mockDataSource";
import { supabaseDataSource } from "@/lib/data/supabaseDataSource";
import type { AtlasDataSource, DataSourceMode } from "@/lib/data/types";

export function getDataSourceMode(): DataSourceMode {
  return process.env.NEXT_PUBLIC_DATA_SOURCE === "supabase" ? "supabase" : "mock";
}

export function getDataSource(): AtlasDataSource {
  return getDataSourceMode() === "supabase" ? supabaseDataSource : mockDataSource;
}

export const dataSource = getDataSource();
