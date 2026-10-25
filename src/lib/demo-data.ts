/**
 * Demo dataset for the SupplierLoop owner dashboard.
 *
 * Mirrors the UX verification scenario from the implementation pack:
 * one active session with 5 suppliers — one slow, one opt-out (STOP),
 * one unknown currency, one qualified, one above the hard max.
 * All data is demo/simulated; every simulated channel is labeled as such
 * in the UI and must never be presented as a live WhatsApp conversation.
 */

export type Channel = "WHATSAPP_TEST" | "SIMULATED";

export type ThreadState =
  | "CREATED"
  | "AWAITING_SUPPLIER"
  | "PROCESSING"
  | "OWNER_REVIEW"
  | "PAUSED"
  | "DECLINED"
  | "TIMED_OUT"
  | "CANCELLED";

export type DeliveryState =
  | "DELIVERED"
  | "SENT_UNCERTAIN"
  | "QUEUED"
  | "FAILED"
  | "RECEIPT_PENDING";

export type OfferEligibility =
  | "ELIGIBLE"
  | "INELIGIBLE_ABOVE_MAX"
  | "NOT_COMPARABLE"
  | "EXPIRED"
  | "AMBIGUOUS";

export interface Supplier {
  id: string;
  name: string;
  city: string;
  channel: Channel;
  phoneMasked: string;
  consent: "OPTED_IN" | "OPTED_OUT" | "PENDING";
  consentDate: string;
  lastContactedAt: string;
  categories: string[];
  active: boolean;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  direction: "IN" | "OUT";
  at: string;
  text: string;
  /** For supplier messages: model interpretation of the message. */
  extraction?: {
    unitPrice?: string;
    currency?: string;
    quantity?: number | null;
    deliveryDays?: number | null;
    paymentTerms?: string | null;
    confidence: number;
    parseStatus: "PARSED" | "LOW_CONFIDENCE" | "NEEDS_CLARIFICATION" | "UNPARSEABLE";
    spans: { label: string; quote: string }[];
  };
  /** For outbound agent messages: the reason the policy chose this move. */
  policyReason?: string;
  delivery?: DeliveryState;
  providerId?: string;
  kind?: "RFQ" | "COUNTER" | "CLARIFICATION" | "REPLY" | "SYSTEM";
}

export interface Offer {
  id: string;
  offerVersion: number;
  threadId: string;
  supplierId: string;
  unitPrice: string | null;
  currency: string;
  unit: string;
  quantity: number | null;
  deliveryDays: number | null;
  paymentTerms: string | null;
  validUntil: string;
  confidence: number;
  eligibility: OfferEligibility;
  eligibilityNote?: string;
  sourceMessageId: string;
  sourceSnippet: string;
}

export interface Thread {
  id: string;
  sessionId: string;
  supplierId: string;
  state: ThreadState;
  channel: Channel;
  countersSent: number;
  maxRounds: number;
  lastInboundAt: string | null;
  lastOutboundAt: string | null;
  replyDueAt: string | null;
  lastDeliveryState: DeliveryState | null;
  messages: ChatMessage[];
}

export interface AuditEvent {
  id: string;
  sessionId: string;
  threadId?: string;
  at: string;
  actor: "OWNER" | "SYSTEM" | "POLICY" | "SUPPLIER";
  kind:
    | "SESSION_CREATED"
    | "MESSAGE_IN"
    | "MESSAGE_OUT"
    | "EXTRACTION"
    | "POLICY_BLOCK"
    | "POLICY_MOVE"
    | "STATE_CHANGE"
    | "OWNER_APPROVAL"
    | "CONSENT_STOP"
    | "TIMEOUT";
  detail: string;
  policyVersion?: string;
}

export interface Session {
  id: string;
  title: string;
  item: string;
  unit: string;
  desiredQty: number;
  minQty: number;
  currency: string;
  targetUnitPrice: string;
  maxUnitPrice: string;
  deliveryDeadline: string;
  paymentTerms: string;
  maxCounters: number;
  source: "OWNER" | "LOW_STOCK" | "PRICE";
  state: "RUNNING" | "OWNER_REVIEW" | "APPROVED" | "CLOSED" | "DRAFT";
  createdAt: string;
  updatedAt: string;
  sessionDeadline: string;
  supplierIds: string[];
  approvedOfferId?: string;
  approvedOfferSnapshot?: {
    supplier: string;
    unitPrice: string;
    currency: string;
    unit: string;
    quantity: number;
    deliveryDays: number;
    paymentTerms: string;
    approvedAt: string;
    note: string;
  };
}

/* ---------------------------------- Suppliers --------------------------------- */

export const suppliers: Supplier[] = [
  {
    id: "sup-al-madina",
    name: "Al-Madina Paper & Board",
    city: "Lahore, Shad Bagh",
    channel: "WHATSAPP_TEST",
    phoneMasked: "+92 3•• ••• 4471",
    consent: "OPTED_IN",
    consentDate: "2026-09-30T10:12:00+05:00",
    lastContactedAt: "2026-10-24T09:05:00+05:00",
    categories: ["Kraft paper", "Board", "Packaging"],
    active: true,
    notes: "Real test participant on the approved WhatsApp template. Replies in Roman Urdu + English mix.",
  },
  {
    id: "sup-chenab",
    name: "Chenab Packaging Supplies",
    city: "Faisalabad",
    channel: "SIMULATED",
    phoneMasked: "sim-chenab-01",
    consent: "OPTED_IN",
    consentDate: "2026-09-30T10:30:00+05:00",
    lastContactedAt: "2026-10-22T16:40:00+05:00",
    categories: ["Packaging", "Cartons", "Kraft paper"],
    active: true,
    notes: "Simulator fixture with a stubborn-persona price floor.",
  },
  {
    id: "sup-fsk-mills",
    name: "Faisalabad Kraft Mills",
    city: "Faisalabad, Khaniwala",
    channel: "SIMULATED",
    phoneMasked: "sim-fsk-02",
    consent: "OPTED_IN",
    consentDate: "2026-10-01T09:00:00+05:00",
    lastContactedAt: "2026-10-23T11:20:00+05:00",
    categories: ["Kraft paper", "Reels"],
    active: true,
    notes: "Simulator fixture configured as the deliberately slow replier.",
  },
  {
    id: "sup-crescent",
    name: "Crescent Packaging Co.",
    city: "Lahore, Badami Bagh",
    channel: "SIMULATED",
    phoneMasked: "sim-crescent-03",
    consent: "OPTED_IN",
    consentDate: "2026-10-01T09:05:00+05:00",
    lastContactedAt: "2026-10-24T08:55:00+05:00",
    categories: ["Packaging", "Corrugated", "Kraft paper"],
    active: true,
    notes: "Simulator fixture that quotes in USD to exercise the not-comparable path.",
  },
  {
    id: "sup-indus",
    name: "Indus Traders",
    city: "Karachi, Jodia Bazaar",
    channel: "SIMULATED",
    phoneMasked: "sim-indus-04",
    consent: "OPTED_IN",
    consentDate: "2026-10-02T14:00:00+05:00",
    lastContactedAt: "2026-10-24T09:10:00+05:00",
    categories: ["General supplies", "Kraft paper"],
    active: true,
    notes: "Simulator fixture quoting above the hard ceiling in round 1.",
  },
  {
    id: "sup-galaxy",
    name: "Galaxy Paper Mart",
    city: "Rawalpindi, Raja Bazaar",
    channel: "WHATSAPP_TEST",
    phoneMasked: "+92 3•• ••• 9018",
    consent: "OPTED_OUT",
    consentDate: "2026-08-14T12:00:00+05:00",
    lastContactedAt: "2026-10-18T10:00:00+05:00",
    categories: ["Kraft paper", "Board"],
    active: true,
    notes: "Sent STOP on 18 Oct. Outreach permanently suppressed — shown here so the halt is auditable.",
  },
  {
    id: "sup-riphah",
    name: "Riphah Stationers",
    city: "Lahore, Urdu Bazaar",
    channel: "WHATSAPP_TEST",
    phoneMasked: "+92 3•• ••• 2255",
    consent: "PENDING",
    consentDate: "",
    lastContactedAt: "",
    categories: ["Stationery", "Packaging"],
    active: false,
    notes: "Invite sent, opt-in not yet recorded. Cannot be selected for live outreach.",
  },
];

export const supplierById = new Map(suppliers.map((s) => [s.id, s]));

/* ---------------------------------- Sessions ---------------------------------- */

const NOW = Date.parse("2026-10-25T14:20:00+05:00");
const hoursFromNow = (h: number) => new Date(NOW + h * 3600_000).toISOString();
const hoursAgo = (h: number) => new Date(NOW - h * 3600_000).toISOString();

export const sessions: Session[] = [
  {
    id: "SL-1042",
    title: "Kraft paper rolls · 120 GSM",
    item: "Kraft paper rolls, 120 GSM, 30-inch width",
    unit: "kg",
    desiredQty: 800,
    minQty: 500,
    currency: "PKR",
    targetUnitPrice: "318",
    maxUnitPrice: "345",
    deliveryDeadline: "2026-11-05",
    paymentTerms: "Advance 50% or 30-day LC",
    maxCounters: 5,
    source: "OWNER",
    state: "OWNER_REVIEW",
    createdAt: hoursAgo(29),
    updatedAt: hoursAgo(1.5),
    sessionDeadline: hoursFromNow(43),
    supplierIds: [
      "sup-al-madina",
      "sup-chenab",
      "sup-fsk-mills",
      "sup-crescent",
      "sup-indus",
    ],
  },
  {
    id: "SL-1039",
    title: "Corrugated boxes · 18×12×12\"",
    item: "Corrugated boxes, 5-ply, 18×12×12 inch",
    unit: "pc",
    desiredQty: 2000,
    minQty: 1500,
    currency: "PKR",
    targetUnitPrice: "86",
    maxUnitPrice: "94",
    deliveryDeadline: "2026-10-30",
    paymentTerms: "Advance 100%",
    maxCounters: 5,
    source: "OWNER",
    state: "APPROVED",
    createdAt: "2026-10-19T10:00:00+05:00",
    updatedAt: "2026-10-21T18:30:00+05:00",
    sessionDeadline: "2026-10-22T10:00:00+05:00",
    supplierIds: ["sup-al-madina", "sup-chenab", "sup-crescent"],
    approvedOfferId: "off-1039-crescent-v2",
    approvedOfferSnapshot: {
      supplier: "Crescent Packaging Co.",
      unitPrice: "88.50",
      currency: "PKR",
      unit: "pc",
      quantity: 2000,
      deliveryDays: 4,
      paymentTerms: "Advance 100%",
      approvedAt: "2026-10-21T18:28:00+05:00",
      note: "Approved for follow-up — no order placed. Below target by 2.9%.",
    },
  },
  {
    id: "SL-1036",
    title: "Stretch film rolls · 500 mm",
    item: "Stretch film roll, 500 mm × 2.5 kg",
    unit: "roll",
    desiredQty: 120,
    minQty: 80,
    currency: "PKR",
    targetUnitPrice: "1150",
    maxUnitPrice: "1290",
    deliveryDeadline: "2026-11-01",
    paymentTerms: "Advance 50%",
    maxCounters: 5,
    source: "LOW_STOCK",
    state: "CLOSED",
    createdAt: "2026-10-15T09:00:00+05:00",
    updatedAt: "2026-10-17T20:00:00+05:00",
    sessionDeadline: "2026-10-18T09:00:00+05:00",
    supplierIds: ["sup-chenab", "sup-fsk-mills", "sup-indus"],
  },
];

export const sessionById = new Map(sessions.map((s) => [s.id, s]));

/* ------------------------- Threads for the active session ------------------------ */

export const threads: Thread[] = [
  {
    id: "thr-1042-1",
    sessionId: "SL-1042",
    supplierId: "sup-al-madina",
    state: "OWNER_REVIEW",
    channel: "WHATSAPP_TEST",
    countersSent: 2,
    maxRounds: 5,
    lastInboundAt: hoursAgo(1.5),
    lastOutboundAt: hoursAgo(6),
    replyDueAt: null,
    lastDeliveryState: "DELIVERED",
    messages: [
      {
        id: "msg-1",
        direction: "OUT",
        at: hoursAgo(28),
        kind: "RFQ",
        delivery: "DELIVERED",
        providerId: "wamid.BgK...",
        text: "Assalam-o-Alaikum, this is SupplierLoop — an AI-assisted purchasing assistant used by our business. We are sourcing kraft paper rolls, 120 GSM, 30-inch width. Quantity: 800 kg (minimum 500 kg). Please quote your best rate per kg in PKR, delivery time to Lahore, and payment terms. You can reply STOP at any time to opt out.",
        policyReason: "Opening RFQ. Does not increment counter rounds (DEC-06).",
      },
      {
        id: "msg-2",
        direction: "IN",
        at: hoursAgo(26.5),
        kind: "REPLY",
        text: "Rate 355 per kg hai 800 kg pe. Delivery 4 din. Advance 50% chahiye.",
        extraction: {
          unitPrice: "355",
          currency: "PKR",
          quantity: 800,
          deliveryDays: 4,
          paymentTerms: "Advance 50%",
          confidence: 0.93,
          parseStatus: "PARSED",
          spans: [
            { label: "Unit price", quote: "Rate 355 per kg" },
            { label: "Quantity", quote: "800 kg pe" },
            { label: "Delivery", quote: "Delivery 4 din" },
            { label: "Terms", quote: "Advance 50% chahiye" },
          ],
        },
      },
      {
        id: "msg-3",
        direction: "OUT",
        at: hoursAgo(26),
        kind: "COUNTER",
        delivery: "DELIVERED",
        providerId: "wamid.BgL...",
        text: "Thank you. 355/kg is above our budget for this order. We can offer 320/kg for 800 kg, 50% advance, delivery within 5 days. Would that work?",
        policyReason: "Round 1 counter at 320/kg — supplier quote 355 exceeds ceiling 345, concession curve position 1.",
      },
      {
        id: "msg-4",
        direction: "IN",
        at: hoursAgo(22),
        kind: "REPLY",
        text: "Bhai 320 kaffi kam hai. 345 final karte hain, delivery 3 din, 50% advance.",
        extraction: {
          unitPrice: "345",
          currency: "PKR",
          quantity: 800,
          deliveryDays: 3,
          paymentTerms: "Advance 50%",
          confidence: 0.96,
          parseStatus: "PARSED",
          spans: [
            { label: "Unit price", quote: "345 final" },
            { label: "Delivery", quote: "delivery 3 din" },
          ],
        },
      },
      {
        id: "msg-5",
        direction: "OUT",
        at: hoursAgo(21.4),
        kind: "COUNTER",
        delivery: "DELIVERED",
        providerId: "wamid.BgM...",
        text: "345/kg is still above our ceiling for this purchase. Our final position: 328/kg for 800 kg, 50% advance, delivery in 3 days. If that works we will proceed to owner review today.",
        policyReason: "Round 2 counter at 328/kg — quote at ceiling boundary; 328 ≤ round-2 permitted counter 331 (curve), below hard max 345.",
      },
      {
        id: "msg-6",
        direction: "IN",
        at: hoursAgo(1.5),
        kind: "REPLY",
        text: "Theek hai, 328 agree. 800 kg, 3 din delivery, 50% advance. Rate valid kal sham tak.",
        extraction: {
          unitPrice: "328",
          currency: "PKR",
          quantity: 800,
          deliveryDays: 3,
          paymentTerms: "Advance 50%",
          confidence: 0.97,
          parseStatus: "PARSED",
          spans: [
            { label: "Unit price", quote: "328 agree" },
            { label: "Validity", quote: "valid kal sham tak" },
          ],
        },
      },
    ],
  },
  {
    id: "thr-1042-2",
    sessionId: "SL-1042",
    supplierId: "sup-chenab",
    state: "OWNER_REVIEW",
    channel: "SIMULATED",
    countersSent: 2,
    maxRounds: 5,
    lastInboundAt: hoursAgo(4),
    lastOutboundAt: hoursAgo(5),
    replyDueAt: null,
    lastDeliveryState: "DELIVERED",
    messages: [
      {
        id: "msg-7",
        direction: "OUT",
        at: hoursAgo(27),
        kind: "RFQ",
        delivery: "DELIVERED",
        text: "[Simulator] RFQ sent: kraft paper rolls 120 GSM, 800 kg, target window shared.",
        policyReason: "Opening RFQ (simulated channel).",
      },
      {
        id: "msg-8",
        direction: "IN",
        at: hoursAgo(25),
        kind: "REPLY",
        text: "Our rate is 362 per kg for 800 kg. Delivery 6 days, 100% advance.",
        extraction: {
          unitPrice: "362",
          currency: "PKR",
          quantity: 800,
          deliveryDays: 6,
          paymentTerms: "Advance 100%",
          confidence: 0.95,
          parseStatus: "PARSED",
          spans: [{ label: "Unit price", quote: "362 per kg" }],
        },
      },
      {
        id: "msg-9",
        direction: "OUT",
        at: hoursAgo(24),
        kind: "COUNTER",
        delivery: "DELIVERED",
        text: "[Simulator] Counter at 322/kg, 50% advance, delivery 5 days.",
        policyReason: "Round 1 counter — concession curve position 1 (322 ≤ permitted 331).",
      },
      {
        id: "msg-10",
        direction: "IN",
        at: hoursAgo(4),
        kind: "REPLY",
        text: "Best we can do is 333 per kg, delivery 5 days, 50% advance. Rate valid 48 hours.",
        extraction: {
          unitPrice: "333",
          currency: "PKR",
          quantity: 800,
          deliveryDays: 5,
          paymentTerms: "Advance 50%",
          confidence: 0.94,
          parseStatus: "PARSED",
          spans: [{ label: "Unit price", quote: "333 per kg" }],
        },
      },
    ],
  },
  {
    id: "thr-1042-3",
    sessionId: "SL-1042",
    supplierId: "sup-fsk-mills",
    state: "AWAITING_SUPPLIER",
    channel: "SIMULATED",
    countersSent: 2,
    maxRounds: 5,
    lastInboundAt: hoursAgo(20),
    lastOutboundAt: hoursAgo(20.5),
    replyDueAt: hoursFromNow(4),
    lastDeliveryState: "DELIVERED",
    messages: [
      {
        id: "msg-11",
        direction: "OUT",
        at: hoursAgo(27),
        kind: "RFQ",
        delivery: "DELIVERED",
        text: "[Simulator] RFQ sent: kraft paper rolls 120 GSM, 800 kg.",
        policyReason: "Opening RFQ (simulated channel).",
      },
      {
        id: "msg-12",
        direction: "IN",
        at: hoursAgo(24),
        kind: "REPLY",
        text: "350 per kg for 800. Delivery 5 days. Advance 50%.",
        extraction: {
          unitPrice: "350",
          currency: "PKR",
          quantity: 800,
          deliveryDays: 5,
          paymentTerms: "Advance 50%",
          confidence: 0.91,
          parseStatus: "PARSED",
          spans: [{ label: "Unit price", quote: "350 per kg" }],
        },
      },
      {
        id: "msg-13",
        direction: "OUT",
        at: hoursAgo(20.5),
        kind: "COUNTER",
        delivery: "DELIVERED",
        text: "[Simulator] Counter at 324/kg, 50% advance, delivery 5 days.",
        policyReason: "Round 1 counter — 350 above ceiling; concession curve position 1.",
      },
    ],
  },
  {
    id: "thr-1042-4",
    sessionId: "SL-1042",
    supplierId: "sup-crescent",
    state: "PROCESSING",
    channel: "SIMULATED",
    countersSent: 1,
    maxRounds: 5,
    lastInboundAt: hoursAgo(3),
    lastOutboundAt: hoursAgo(3.2),
    replyDueAt: null,
    lastDeliveryState: "DELIVERED",
    messages: [
      {
        id: "msg-14",
        direction: "OUT",
        at: hoursAgo(26.8),
        kind: "RFQ",
        delivery: "DELIVERED",
        text: "[Simulator] RFQ sent: kraft paper rolls 120 GSM, 800 kg.",
        policyReason: "Opening RFQ (simulated channel).",
      },
      {
        id: "msg-15",
        direction: "IN",
        at: hoursAgo(5),
        kind: "REPLY",
        text: "We can offer $1.85 per kg for 800 kg, delivery 4 days, LC 30 days.",
        extraction: {
          unitPrice: "1.85",
          currency: "USD",
          quantity: 800,
          deliveryDays: 4,
          paymentTerms: "LC 30 days",
          confidence: 0.89,
          parseStatus: "PARSED",
          spans: [{ label: "Unit price", quote: "$1.85 per kg" }],
        },
      },
      {
        id: "msg-16",
        direction: "OUT",
        at: hoursAgo(4.5),
        kind: "CLARIFICATION",
        delivery: "DELIVERED",
        text: "[Simulator] Clarification sent: please quote in PKR as the request specifies; USD quotes cannot be compared without a validated conversion.",
        policyReason: "POLICY_BLOCK: currency mismatch — no counter sent to a non-comparable quote.",
      },
      {
        id: "msg-17",
        direction: "IN",
        at: hoursAgo(3),
        kind: "REPLY",
        text: "Okay checking with our bank for PKR rate, will confirm.",
        extraction: {
          confidence: 0.42,
          parseStatus: "NEEDS_CLARIFICATION",
          spans: [],
        },
      },
    ],
  },
  {
    id: "thr-1042-5",
    sessionId: "SL-1042",
    supplierId: "sup-indus",
    state: "DECLINED",
    channel: "SIMULATED",
    countersSent: 1,
    maxRounds: 5,
    lastInboundAt: hoursAgo(18),
    lastOutboundAt: hoursAgo(18.5),
    replyDueAt: null,
    lastDeliveryState: "DELIVERED",
    messages: [
      {
        id: "msg-18",
        direction: "OUT",
        at: hoursAgo(26.5),
        kind: "RFQ",
        delivery: "DELIVERED",
        text: "[Simulator] RFQ sent: kraft paper rolls 120 GSM, 800 kg.",
        policyReason: "Opening RFQ (simulated channel).",
      },
      {
        id: "msg-19",
        direction: "IN",
        at: hoursAgo(18.5),
        kind: "REPLY",
        text: "385 per kg firm, no negotiation on this rate. Delivery 7 days, advance 100%.",
        extraction: {
          unitPrice: "385",
          currency: "PKR",
          quantity: 800,
          deliveryDays: 7,
          paymentTerms: "Advance 100%",
          confidence: 0.97,
          parseStatus: "PARSED",
          spans: [{ label: "Unit price", quote: "385 per kg" }, { label: "Firm", quote: "no negotiation" }],
        },
      },
      {
        id: "msg-20",
        direction: "OUT",
        at: hoursAgo(18),
        kind: "SYSTEM",
        delivery: "DELIVERED",
        text: "[Simulator] Thread closed without further negotiation.",
        policyReason: "Quote 385 exceeds hard max 345 and supplier signalled firm; closing rather than conceding upward.",
      },
    ],
  },
];

/* ---------------------------------- Offers ---------------------------------- */

export const offers: Offer[] = [
  {
    id: "off-1042-madina-v3",
    offerVersion: 3,
    threadId: "thr-1042-1",
    supplierId: "sup-al-madina",
    unitPrice: "328",
    currency: "PKR",
    unit: "kg",
    quantity: 800,
    deliveryDays: 3,
    paymentTerms: "Advance 50%",
    validUntil: hoursFromNow(20),
    confidence: 0.97,
    eligibility: "ELIGIBLE",
    sourceMessageId: "msg-6",
    sourceSnippet: "Theek hai, 328 agree. 800 kg, 3 din delivery, 50% advance.",
  },
  {
    id: "off-1042-chenab-v3",
    offerVersion: 3,
    threadId: "thr-1042-2",
    supplierId: "sup-chenab",
    unitPrice: "333",
    currency: "PKR",
    unit: "kg",
    quantity: 800,
    deliveryDays: 5,
    paymentTerms: "Advance 50%",
    validUntil: hoursFromNow(44),
    confidence: 0.94,
    eligibility: "ELIGIBLE",
    sourceMessageId: "msg-10",
    sourceSnippet: "Best we can do is 333 per kg, delivery 5 days, 50% advance. Rate valid 48 hours.",
  },
  {
    id: "off-1042-crescent-v2",
    offerVersion: 2,
    threadId: "thr-1042-4",
    supplierId: "sup-crescent",
    unitPrice: "1.85",
    currency: "USD",
    unit: "kg",
    quantity: 800,
    deliveryDays: 4,
    paymentTerms: "LC 30 days",
    validUntil: hoursFromNow(30),
    confidence: 0.89,
    eligibility: "NOT_COMPARABLE",
    eligibilityNote: "Quoted in USD. No validated PKR conversion — cannot be ranked or approved.",
    sourceMessageId: "msg-15",
    sourceSnippet: "We can offer $1.85 per kg for 800 kg, delivery 4 days, LC 30 days.",
  },
  {
    id: "off-1042-indus-v1",
    offerVersion: 1,
    threadId: "thr-1042-5",
    supplierId: "sup-indus",
    unitPrice: "385",
    currency: "PKR",
    unit: "kg",
    quantity: 800,
    deliveryDays: 7,
    paymentTerms: "Advance 100%",
    validUntil: hoursFromNow(10),
    confidence: 0.97,
    eligibility: "INELIGIBLE_ABOVE_MAX",
    eligibilityNote: "385/kg exceeds the hard ceiling of 345/kg by 11.6%. Thread closed.",
    sourceMessageId: "msg-19",
    sourceSnippet: "385 per kg firm, no negotiation on this rate. Delivery 7 days, advance 100%.",
  },
];

/* ---------------------------------- Audit ---------------------------------- */

export const auditEvents: AuditEvent[] = [
  {
    id: "aud-01",
    sessionId: "SL-1042",
    at: hoursAgo(29),
    actor: "OWNER",
    kind: "SESSION_CREATED",
    detail: "Owner confirmed outreach to 5 suppliers. Max price 345 PKR/kg, deadline 2026-11-05.",
    policyVersion: "policy-v0.4",
  },
  {
    id: "aud-02",
    sessionId: "SL-1042",
    threadId: "thr-1042-1",
    at: hoursAgo(28),
    actor: "SYSTEM",
    kind: "MESSAGE_OUT",
    detail: "Opening RFQ delivered to Al-Madina Paper & Board (WhatsApp test). wamid.BgK…",
    policyVersion: "policy-v0.4",
  },
  {
    id: "aud-03",
    sessionId: "SL-1042",
    threadId: "thr-1042-1",
    at: hoursAgo(26.5),
    actor: "SUPPLIER",
    kind: "MESSAGE_IN",
    detail: "Inbound received, deduplicated (event id evt-9f31). Extracted 355 PKR/kg, conf 0.93.",
  },
  {
    id: "aud-04",
    sessionId: "SL-1042",
    threadId: "thr-1042-1",
    at: hoursAgo(26),
    actor: "POLICY",
    kind: "POLICY_MOVE",
    detail: "Round 1 counter 320 PKR/kg sent. Reason: quote 355 above ceiling; curve position 1.",
    policyVersion: "policy-v0.4",
  },
  {
    id: "aud-05",
    sessionId: "SL-1042",
    threadId: "thr-1042-4",
    at: hoursAgo(4.5),
    actor: "POLICY",
    kind: "POLICY_BLOCK",
    detail: "Blocked counter to Crescent Packaging Co.: USD quote not comparable to PKR request. Clarification sent instead.",
    policyVersion: "policy-v0.4",
  },
  {
    id: "aud-06",
    sessionId: "SL-1042",
    threadId: "thr-1042-5",
    at: hoursAgo(18),
    actor: "POLICY",
    kind: "STATE_CHANGE",
    detail: "Indus Traders thread → DECLINED. Firm quote 385/kg above hard max 345/kg.",
    policyVersion: "policy-v0.4",
  },
  {
    id: "aud-07",
    sessionId: "SL-1042",
    threadId: "thr-1042-1",
    at: hoursAgo(1.5),
    actor: "SUPPLIER",
    kind: "MESSAGE_IN",
    detail: "Inbound: 328 PKR/kg accepted, validity until tomorrow evening. Extraction conf 0.97.",
  },
  {
    id: "aud-08",
    sessionId: "SL-1039",
    at: "2026-10-21T18:28:00+05:00",
    actor: "OWNER",
    kind: "OWNER_APPROVAL",
    detail: "Owner approved off-1039-crescent-v2 at 88.50 PKR/pc × 2000. Snapshot stored. No order placed.",
    policyVersion: "policy-v0.4",
  },
  {
    id: "aud-09",
    sessionId: "SL-1042",
    threadId: "thr-1042-3",
    at: hoursAgo(20.5),
    actor: "SYSTEM",
    kind: "TIMEOUT",
    detail: "Reply window 24h armed for Faisalabad Kraft Mills after round-1 counter. Due in ~4h.",
  },
];

/* ------------------------------ Triggers (test) ------------------------------ */

export const triggers = [
  {
    id: "trg-stock",
    kind: "LOW_STOCK" as const,
    label: "Kraft paper stock fallback",
    status: "ARMED" as const,
    detail: "Synthetic inventory level 210 kg fell below threshold 250 kg on 24 Oct 09:00 PKT.",
    plannedRecipients: ["sup-chenab", "sup-fsk-mills", "sup-indus"],
    lastFired: "2026-10-15T09:00:00+05:00",
    firedSessionId: "SL-1036",
  },
  {
    id: "trg-price",
    kind: "PRICE" as const,
    label: "Synthetic marketplace price signal",
    status: "DISARMED" as const,
    detail: "Synthetic listing 309 PKR/kg at/below target 318. Disarmed pending owner authorization.",
    plannedRecipients: ["sup-al-madina", "sup-chenab"],
    lastFired: null,
    firedSessionId: null,
  },
];

export const demoInventory = {
  item: "Kraft paper rolls, 120 GSM",
  levelKg: 210,
  thresholdKg: 250,
  updatedAt: hoursAgo(5),
  synthetic: true,
};

/* ---------------------------------- Helpers ---------------------------------- */

export function threadsForSession(sessionId: string) {
  return threads.filter((t) => t.sessionId === sessionId);
}

export function offersForSession(sessionId: string) {
  const threadIds = new Set(threadsForSession(sessionId).map((t) => t.id));
  return offers.filter((o) => threadIds.has(o.threadId));
}

export function auditForSession(sessionId: string) {
  return auditEvents.filter((a) => a.sessionId === sessionId);
}

export function sessionCounts(session: Session) {
  const ts = threadsForSession(session.id);
  const done = ts.filter((t) =>
    ["OWNER_REVIEW", "DECLINED", "TIMED_OUT", "CANCELLED"].includes(t.state),
  ).length;
  return { done, total: ts.length };
}

/** Numeric concession curve used by the demo policy (position 1..maxRounds). */
export function curvePosition(round: number, max: number, target: number) {
  const t = round / max;
  return target + (max - target) * (1 - Math.pow(1 - t, 1.6));
}
