export type DemoId =
  | "call-sheet-gate"
  | "metrc-recon"
  | "vendor-po-gate"
  | "crafty-runner";

export type GateDecision = "pending" | "approved" | "rejected" | "escalated";

export type AuditEvent = {
  id: string;
  demo: DemoId;
  action: string;
  at: string;
  actor: string;
  sent: false;
  summary: string;
  detail?: Record<string, unknown>;
};

export type CastRow = {
  number?: string;
  name: string;
  role?: string;
  call: string;
};

export type CallSheetFields = {
  title: string;
  production: string;
  date: string;
  location: string;
  generalCall: string;
  wrap: string;
  scenes: string;
  talent: CastRow[];
  vanA: string;
  vanB: string;
  notes: string;
  allergies: string;
};

export type ScheduleStub = {
  date: string;
  production: string;
  day_label: string;
  location: string;
  general_call: string;
  talent: { name: string; call: string }[];
  notes: string;
};

export type DiffSeverity = "HIGH" | "MED";

export type DiffRow = {
  id: string;
  field: string;
  before: string;
  after: string;
  changed: boolean;
  severity?: DiffSeverity;
};

export type MetrcRow = {
  plantId?: string;
  packageTag: string;
  item: string;
  quantity: number;
  hold?: boolean;
  uom?: string;
};

export type VarianceRow = {
  plantId: string;
  packageTag: string;
  item: string;
  metrcQty: number | null;
  physicalQty: number | null;
  variance: number | null;
  pct: number | null;
  metrcHold: boolean | null;
  physicalHold: boolean | null;
  holdDrift: boolean;
  status: "match" | "variance" | "metrc-only" | "physical-only";
  reviewOver5: boolean;
};

export type AuthUser = {
  id: string;
  name: string;
  role: string;
  status: "active" | "review-removal";
  note: string;
};

export type QuoteLine = {
  sku: string;
  description: string;
  qty: number;
  unit: string;
  rate: number;
  days: number;
  catalog_rate?: number;
};

export type VendorQuote = {
  vendor: string;
  quote_id: string;
  terms: string;
  currency?: string;
  contact: string;
  lines: QuoteLine[];
  notes?: string;
  coi_on_file?: boolean;
};

export type PoRecommendation = "approve" | "reject" | "escalate";

export type DraftPo = {
  poNumber: string;
  vendor: string;
  quoteId: string;
  terms: string;
  currency: string;
  contact: string;
  lines: (QuoteLine & { ext: number; catalogExt?: number; catalogDeltaPct?: number })[];
  subtotal: number;
  total: number;
  notes: string;
  sent: false;
  emailedVendor: false;
  coiOnFile: boolean;
  recommended: PoRecommendation;
  reason: string;
  flags: string[];
};

export type PoPolicy = {
  approve_under: number;
  dual_escalate_over: number;
  catalog_flag_pct: number;
};

export type CraftyFormInput = {
  headcount: number;
  extraItem: string;
  extraQty: number;
  runnerNote: string;
};

export type CraftyLine = {
  plant: string;
  dept: "Crafty" | "Unit";
  sku: string;
  item: string;
  qty: number;
  unit: string;
  note: string;
  severity: DiffSeverity;
};

export type CraftyStop = {
  plant: string;
  title: string;
  detail: string;
  severity: DiffSeverity;
};

export type CraftyDraft = {
  production: string;
  dayLabel: string;
  date: string;
  location: string;
  priorLocation: string;
  generalCall: string;
  craftyCall: string;
  wrap: string;
  headcount: number;
  priorHeadcount: number;
  unitVanB: string;
  runner: string;
  coordinator: string;
  notes: string;
  lines: CraftyLine[];
  stops: CraftyStop[];
  flags: string[];
  locked: false;
  sent: false;
  dispatched: false;
};

export type CraftyRunnerPreview = {
  sms: string;
  email: string;
  smsFrom: string;
  emailFrom: string;
  emailTo: string;
  emailSubject: string;
  emailBody: string;
  held: true;
  sent: false;
};
