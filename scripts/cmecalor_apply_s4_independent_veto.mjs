import fs from 'node:fs';
import path from 'node:path';

const auditPath = 'work/cmecalor/mass_audit_s4.json';
const independentPath = 'work/cmecalor/mass_recovery_s4_independent.json';
const audit = JSON.parse(fs.readFileSync(auditPath, 'utf8').replace(/^\uFEFF/, ''));
const independent = JSON.parse(fs.readFileSync(independentPath, 'utf8').replace(/^\uFEFF/, ''));

// The independent pass list cannot promote anything rejected by the main audit.
// It only vetoes recovery variants that the main audit had approved.
const rejects = new Map(
  independent.items
    .filter((item) => item.status === 'reject')
    .map((item) => [item.name, item]),
);
const vetoed = [];

for (const item of audit.items ?? []) {
  const independentItem = rejects.get(item.name);
  if (!independentItem || item.verdict !== 'pass') continue;

  item.verdict = 'reject';
  item.status = 'rejected';
  item.issue = 'independent_literal_veto';
  item.reason = independentItem.reason;
  item.independent_audit = independentPath;
  if (item.recovery) {
    item.recovery.verdict = 'reject';
    item.recovery.status = 'rejected';
    item.recovery.issue = 'independent_literal_veto';
    item.recovery.reason = independentItem.reason;
    item.recovery.independent_audit = independentPath;
  }
  vetoed.push(item.name);
}

const approvedItems = (audit.items ?? []).filter((item) => item.verdict === 'pass');
audit.summary = {
  ...(audit.summary ?? {}),
  total: (audit.items ?? []).length,
  pass: approvedItems.length,
  reject: (audit.items ?? []).length - approvedItems.length,
};
audit.approved = approvedItems
  .map((item) => path.basename(item.path ?? '', path.extname(item.path ?? '')))
  .filter(Boolean);
audit.rejected = (audit.items ?? [])
  .filter((item) => item.verdict === 'reject')
  .map((item) => item.name)
  .filter(Boolean);
audit.independent_audit = {
  path: independentPath,
  policy: 'main_pass_intersection_independent_pass_for_recovery_variants',
  vetoed,
};

fs.writeFileSync(auditPath, `${JSON.stringify(audit, null, 2)}\n`);
console.log(JSON.stringify({vetoed, summary: audit.summary, approved: audit.approved}, null, 2));
