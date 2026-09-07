import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import type { Briefing, Dossier } from "@/lib/types";

const dossierSchema = z.object({
  companyName: z.string(),
  legalName: z.string(),
  sector: z.string(),
  hq: z.string(),
  size: z.string(),
  geographies: z.array(z.string()),
  executives: z.array(z.object({ name: z.string(), role: z.string() })),
  assets: z.array(
    z.object({
      name: z.string(),
      type: z.string(),
      location: z.string(),
      note: z.string(),
    }),
  ),
  supplyChain: z.array(z.string()),
  competitors: z.array(z.string()),
  regulatory: z.string(),
  priorities: z.string(),
  knownExposures: z.string(),
  notes: z.string(),
});

export const loadCompanyMemory = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const userId = context.userId;
    const sql = await getSql();
    const workspaces = await sql<{
      company_name: string;
      dossier_json: string;
    }>`
      select company_name, dossier_json
      from company_workspace
      where user_id = ${userId}
      limit 1
    `;
    const briefRows = await sql<{
      briefing_date: string;
      briefing_json: string;
    }>`
      select briefing_date, briefing_json
      from company_briefing
      where user_id = ${userId}
      order by briefing_date desc
      limit 90
    `;

    let dossier: Dossier | null = null;
    if (workspaces[0]?.dossier_json) {
      try {
        dossier = JSON.parse(workspaces[0].dossier_json) as Dossier;
      } catch {
        dossier = null;
      }
    }

    const briefings: Record<string, Briefing> = {};
    for (const row of briefRows) {
      try {
        const b = JSON.parse(row.briefing_json) as Briefing;
        briefings[row.briefing_date] = b;
      } catch {
        /* skip corrupt row */
      }
    }

    return {
      ok: true as const,
      companyName: workspaces[0]?.company_name ?? "",
      dossier,
      briefings,
    };
  });

export const saveCompanyDossier = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) =>
    z.object({ dossier: dossierSchema }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const userId = context.userId;
    const sql = await getSql();
    const name = data.dossier.companyName.trim() || "Empresa";
    const payload = JSON.stringify(data.dossier);
    await sql`
      insert into company_workspace (user_id, company_name, dossier_json, updated_at)
      values (${userId}, ${name}, ${payload}, now())
      on conflict (user_id) do update set
        company_name = excluded.company_name,
        dossier_json = excluded.dossier_json,
        updated_at = now()
    `;
    return { ok: true as const };
  });

export const saveCompanyBriefing = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) =>
    z
      .object({
        briefing: z.record(z.string(), z.unknown()),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const userId = context.userId;
    const sql = await getSql();
    const briefing = data.briefing as unknown as Briefing;
    const id = briefing.id || `brief-${briefing.date}-${Date.now()}`;
    const date = String(briefing.date || "");
    if (!date) return { ok: false as const, error: "Fecha inválida" };
    const companyName = String(briefing.companyName || "");
    const payload = JSON.stringify(briefing);
    await sql`
      insert into company_briefing (id, user_id, briefing_date, company_name, briefing_json, created_at)
      values (${id}, ${userId}, ${date}, ${companyName}, ${payload}, now())
      on conflict (user_id, briefing_date) do update set
        id = excluded.id,
        company_name = excluded.company_name,
        briefing_json = excluded.briefing_json
    `;
    return { ok: true as const };
  });
