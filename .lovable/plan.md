# SupplierLoop — Research-Driven Discovery Report

Your brief asks for an independent research and product-discovery analysis, and it says not to write application code. So the deliverable is a written report, not an app.

## What I will produce

One report, `SupplierLoop_Discovery_Report.md`, plus a matching PDF, saved to Files. It will include citations and a source register.

## Research phase (parallel investigations)

1. **Market and comparable systems**: Pactum, Keelvar, Fairmarkit, Zip, Arkestro, Levelpath, WhatsApp-commerce tools such as Jumbotail-style B2B ordering apps, and SMB procurement in WhatsApp-heavy markets (South Asia, LATAM, Africa). For each: what it does, who it serves, and what gaps it leaves.
2. **Academic literature**: automated negotiation (ANAC, GENIUS, Baarslag concession and opponent models), bargaining theory, concurrent and one-to-many negotiation, LLM negotiator reliability (NegotiationArena, "Large Language Models as negotiators", manipulation and sycophancy findings), and human–AI delegation. Each finding gets an evidence-strength rating.
3. **Standards and platform constraints**: WhatsApp Business Platform policies (24-hour window, template messages, opt-in, 2025–26 rules on general-purpose AI bots), NIST AI RMF, the EU AI Act, OWASP LLM Top 10 (prompt injection from supplier messages), Pakistan/India data-protection law, and the legal effect of agent-made offers on contract formation.

## Report structure

- Opportunity and target users (with alternative framings, e.g. "RFQ broadcaster plus comparison" versus a "full negotiator")
- Competitive landscape and the gaps that matter
- Research findings that changed the design, labeled as evidence, inference, or assumption
- Recommended product concept and the alternatives I rejected
- End-to-end workflow, with diagrams
- Negotiation method: deterministic policy engine for limits and concessions; LLM only for parsing and phrasing
- AI autonomy model, permissions, and human approval points
- UX direction: WhatsApp-native owner experience versus a web console
- Logical architecture, data model, and integrations
- Risks, failure modes, and safeguards
- Initial scope, validation experiments, and open decisions
- Recommended next documents
- Bibliography and source register

## Notes

- No changes to the app code. The placeholder page stays as it is.
- Claims I can't verify will be flagged, and no savings figures will be invented.
