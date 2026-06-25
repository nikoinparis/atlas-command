import type { AtlasDataSource } from "@/lib/data/types";

function getSupabaseConfig() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };
}

function notConnected(): never {
  const { url, anonKey } = getSupabaseConfig();
  const missing = [
    !url ? "NEXT_PUBLIC_SUPABASE_URL" : null,
    !anonKey ? "NEXT_PUBLIC_SUPABASE_ANON_KEY" : null,
  ].filter(Boolean);

  throw new Error(
    `Supabase data source is a placeholder in this build. Missing/configure ${missing.join(
      ", ",
    ) || "Supabase client"} and install a server-side client before enabling it.`,
  );
}

export const supabaseDataSource: AtlasDataSource = {
  mode: "supabase",
  async getSnapshot() {
    notConnected();
  },
  async getBuildings() {
    notConnected();
  },
  async getAgents() {
    notConnected();
  },
  async getTasks() {
    notConnected();
  },
  async getApprovals() {
    notConnected();
  },
  async getTreasuryRecord() {
    notConnected();
  },
};
