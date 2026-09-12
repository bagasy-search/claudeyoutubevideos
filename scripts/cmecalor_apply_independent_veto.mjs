import fs from 'node:fs';
import path from 'node:path';

const auditPath = 'work/cmecalor/mass_audit_s1.json';
const independentPath = 'work/cmecalor/mass_recovery_s1_independent.json';
const audit = JSON.parse(fs.readFileSync(auditPath, 'utf8').replace(/^\uFEFF/, ''));
const independent = JSON.parse(fs.readFileSync(independentPath, 'utf8').replace(/^\uFEFF/, ''));

// Only independent rejects that the first recovery audit had promoted are vetoes.
const reasons = new Map(independent.items.filter((item) => item.verdict === 'reject').map((item) => [item.id, item.reason]));
const vetoed = [];
for (const item of audit.items || []) {
  const independentId = String(item.name || item.id || '').replace(/-/g, '_');
  const reason = reasons.get(independentId);
  if (!reason || item.verdict !== 'pass') continue;
  item.verdict = 'reject';
  item.status = 'rejected';
  item.issue = 'independent_literal_veto';
  item.reason = reason;
  item.independent_audit = independentPath;
  if (item.recovery) {
    item.recovery.status = 'reject';
    item.recovery.issue = 'independent_literal_veto';
    item.recovery.reason = reason;
    item.recovery.independent_audit = independentPath;
    if (item.recovery.checks) item.recovery.checks.literal = false;
  }
  vetoed.push(independentId);
}

const approvedItems = (audit.items || []).filter((item) => item.verdict === 'pass');
audit.summary = {
  ...(audit.summary || {}),
  total: (audit.items || []).length,
  pass: approvedItems.length,
  reject: (audit.items || []).length - approvedItems.length,
};
audit.approved = approvedItems.map((item) => path.basename(item.path || '', path.extname(item.path || ''))).filter(Boolean);
if (audit.recovery) {
  const selected = new Set(audit.recovery.selected_ids || []);
  const selectedItems = (audit.items || []).filter((item) => selected.has(item.name));
  audit.recovery.pass = selectedItems.filter((item) => item.verdict === 'pass').length;
  audit.recovery.reject = selectedItems.length - audit.recovery.pass;
  audit.recovery.independent_audit = independentPath;
  audit.recovery.independent_vetoed = vetoed;
}
fs.writeFileSync(auditPath, JSON.stringify(audit, null, 2) + '\n');
console.log(JSON.stringify({vetoed, summary: audit.summary, approved: audit.approved}, null, 2));
