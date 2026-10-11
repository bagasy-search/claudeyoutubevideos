import fs from "node:fs";
const env = Object.fromEntries(fs.readFileSync("D:/Proyectos/yt-scout-web/.env.local", "utf8").split(/\r?\n/).filter(l => l.includes("=") && !l.startsWith("#")).map(l => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim().replace(/^"|"$/g, "")]));
export const U = env.NEXT_PUBLIC_SUPABASE_URL, K = env.SUPABASE_SERVICE_ROLE_KEY, H = { apikey: K, Authorization: "Bearer " + K, "Content-Type": "application/json" };
export const get = async p => (await fetch(`${U}/rest/v1/${p}`, { headers: H })).json();
