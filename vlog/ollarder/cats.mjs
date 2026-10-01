const UA = { "User-Agent": "ollarder-research/1.0 (bautielcrack4@gmail.com)" };
const api = async (q) => (await (await fetch("https://commons.wikimedia.org/w/api.php?format=json&action=query&" + q, { headers: UA })).json());
const cats = process.argv.slice(2);
for (const c of cats) {
  let r = await api(`list=categorymembers&cmtitle=${encodeURIComponent("Category:" + c)}&cmtype=file&cmlimit=60`);
  const m = r.query?.categorymembers || [];
  console.log("##", c, m.length);
  for (const f of m.slice(0, 60)) console.log("  ", f.title.replace("File:", "").slice(0, 120));
  const sub = await api(`list=categorymembers&cmtitle=${encodeURIComponent("Category:" + c)}&cmtype=subcat&cmlimit=30`);
  console.log("  SUBCATS:", (sub.query?.categorymembers || []).map(x => x.title.replace("Category:", "")).join(" | "));
}
