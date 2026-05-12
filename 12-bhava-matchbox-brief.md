# 12 Bhava Matchbox — Build Brief

**For:** the next cowork chat (a new peer page in the Astrology 101 Companion App).
**Spirit:** Vikram asked the cohort to fill twelve physical matchboxes with everyday objects that symbolise each Bhava. Sree wants a digital version — a 12‑house South Indian grid, each Bhava clickable, expanding into that house's vocabulary, classical significations, karaka, and a place to slip in your own "matchbox items."

---

## 1 · Vikram's Brief — in his own words

> *"I want to give you all an activity. What I want you to do is to get 12 matchbooks. Probably the matches. Keep the boxes, label the boxes one to twelve. And as we go into the significations of each house, I want you to look around you and see if there's anything around you on your desk, in your kitchen, wherever, that can fit into a matchbox. That symbolises that house. So some match boxes will have many items, some will have less. You need to connect — all these houses are all around you wherever you go, right? So start looking at using the houses as a filter to view the world. And then when we meet, we will go through these matchboxes. You explore as we explore the house. You'll get, you'll improve your vocabulary a lot. Keep looking for items that you can slip into this matchbox."*
> — **Session 36 (Houses · Interpretation), ~1:42:00**

> *"In case you have not started, please start with this … just get ready to bring your matchboxes to the Ether retreat."*
> — **Session 37 (Sripathi Paddhathi & Houses), ~0:38**

> *"Yes, I hope you'll have started on the match boxes. We will need it for the end‑of‑year retreat."*
> — **Session 38, ~0:51**

### Vikram's stance on the source words

> *"There are some words here that I don't resonate with. It does not apply to my lifestyle. So I leave them. I work with what is applicable to my life. See what you connect with."* — Session 36

**Pedagogical principle to bake into the page:** the goal is not to memorise lists — it is to *recognise the houses around you*, in physical objects, daily routines, and your own life. Resonance beats completeness.

### Example items Vikram & class came up with

- **H1 — Tanu (body, self):** your photograph; a picture of the city you were born in.
- **H2 — Dhana (supports the self):** coins, family pictures.

These are the only two Vikram explicitly demonstrated in class — the rest were left as "you find what fits." That's the whole point of the exercise.

---

## 2 · Concept — what the page is

A **12‑cell South Indian chart** (identical grid pattern to the signature module — Pisces top‑left, going clockwise via Aries · Taurus · Gemini · Cancer · Leo · Virgo · Libra · Scorpio · Sagittarius · Capricorn · Aquarius). Each cell is a **Bhava** (numbered 1 to 12, not by sign — this is a *Bhava chart*, not a Rashi chart). Tapping a cell opens a drawer / overlay with that house's content.

### Why a Bhava grid (not a Rashi grid)
Vikram's matchbox is about the **houses themselves**, not the signs in them. The student is meant to understand "what does the 1st house *mean*" — independent of whose chart, independent of which sign is rising. So the 12 cells are labelled 1–12 (and named with Bhava names: Tanu, Dhana, Sahaja…), not Mesha through Meena.

### The grid (South Indian layout, Bhava order)

```
┌──────────┬──────────┬──────────┬──────────┐
│  H12     │  H1      │  H2      │  H3      │
│  Vyaya   │  Tanu    │  Dhana   │  Sahaja  │
├──────────┼──────────┴──────────┼──────────┤
│  H11     │                     │  H4      │
│  Labha   │   12 BHAVAS         │  Sukha   │
├──────────┤   (centre note)     ├──────────┤
│  H10     │                     │  H5      │
│  Karma   │                     │  Putra   │
├──────────┼──────────┬──────────┼──────────┤
│  H9      │  H8      │  H7      │  H6      │
│  Dharma  │  Randhra │  Yuvati  │  Ari     │
└──────────┴──────────┴──────────┴──────────┘
```

The visual logic mirrors the SI chart used everywhere else on the site, so it feels native.

---

## 3 · What appears when a Bhava is tapped

Each drawer should carry **five layers**, in this order:

1. **The headline** — Bhava number, Sanskrit name(s), one‑line English meaning.
2. **Brihat Parashara Hora Shastra (BPHS) line** — the oldest, most authoritative source. Use this as the trunk; everything else is a branch. Vikram's words: *"Harashara is the oldest, so subsequent works they build on it, they interpret it, they translate it differently."*
3. **The Karaka (minister)** — which planet "indicates" this house. Different from the *Lord* (which depends on the rising sign). Vikram: *"For houses we have karakas. Another word for karaka is minister."*
4. **Vocabulary cloud** — keyword chips drawn from Uttara Kalamrita, Sarvartha Chintamani, Hora Sara, and Brihat Jataka. Show the source as a small tag on each chip. Allow user to **mark some as resonant** and **strike out** ones that don't apply to their life. (This is the heart of Vikram's *"see what you connect with"* instruction.)
5. **Your matchbox** — a free‑text area + small "items I'd slip into this matchbox" list, saved in localStorage. Let the user add e.g. *"Father's pen — H10"*, *"my passport — H9 (travel)"*, *"running shoes — H1 (body)"*.

---

## 4 · Per‑Bhava Data Table (canonical — pulled from `houses-classical.json`, source = Deck #67 v2)

| # | Bhava (Sanskrit) | Aka | BPHS English | Karaka (Minister) |
|---|---|---|---|---|
| 1 | **Tanu** | Lagna | Physical body, form, complexion, appearance, character, strength, longevity | **Sun** |
| 2 | **Dhana** | — | Speech, wealth, family. Eyes, face, learning, teeth, gold and precious metals | **Jupiter** |
| 3 | **Sahaja** | — | Brothers, valour, courage. Boldness, hearing, arms, travels | **Mars** |
| 4 | **Sukha** | — | Happiness. Mother, land, house, vehicles, relations, the heart, things connected with water | **Moon** |
| 5 | **Putra** | — | Children. Intelligence, mantra, learning, past merit (poorva punya), scholarship | **Jupiter** |
| 6 | **Ari** | Rog | Enemies, disease, debt, daily work, service. Maternal uncle, ulcers, step‑mother | **Mars, Saturn** |
| 7 | **Yuvati** | Kalatra, Jaya | Spouse, partnerships, trade, travel, the descendant | **Venus** |
| 8 | **Randhra** | Aayur | Longevity, hidden things, transformation, occult, inheritance, sudden change | **Saturn** |
| 9 | **Dharma** | Bhagya | Fortune, religion, pilgrimage, the teacher, father's elders, wife's brother | **Jupiter, Sun** |
| 10 | **Karma** | — | Royalty / authority, profession, livelihood, honour, father, foreign living, debts | **Sun, Jupiter, Mercury, Saturn** |
| 11 | **Labha** | — | All articles / gains, income, prosperity, elder sibling, quadrupeds, son's wife | **Jupiter** |
| 12 | **Vyaya** | — | Expenses, foreign lands, isolation, liberation (moksha), bed pleasures, hidden enemies | **Saturn** |

> **Sources for each keyword chip** (cite on hover):
> - **BPHS** — Brihat Parashara Hora Shastra (the trunk, ~3500+ years old)
> - **UK** — Uttara Kalamrita (Kalidasa)
> - **SC** — Sarvartha Chintamani (Venkatesha)
> - **HS** — Hora Sara (Prithuyashas)
> - **BJ** — Brihat Jataka (Varahamihira)
>
> Full vocabulary chips per house are in `houses-classical.json` in the KB (`astrology-101-knowledge-base/houses-classical.json`). The signature module / LC already imports this — re‑use the same dataset.

---

## 5 · Interaction guidance (lifted from Vikram's class)

These should be visible on the page as small italic notes — they're the texture of the exercise:

- *"Use the houses as a filter to view the world."* — H‑drawer header
- *"Some matchboxes will have many items, some will have less."* — empty‑state copy when no items added yet
- *"See what you connect with. Work with what is applicable to your life."* — next to the strike‑out feature
- *"You will improve your vocabulary a lot."* — the promise of the exercise
- *"Bring these to the end‑of‑year retreat."* — a small banner at the top

---

## 6 · Build hints (for whoever picks this up next)

- **Reuse the SI chart CSS from `signature.html`** — the grid template, the cell styling, the Lagna‑style highlight when active. Pisces‑top‑left layout.
- **No real chart math.** This page is *not* about a person's chart. It is the abstract 12‑Bhava grid. So no astronomy‑engine, no birth time, no Lagna calculation. Pure pedagogy.
- **Drawer / overlay pattern** — same as the existing LC drawer or the signature output card. Tap a cell → drawer slides in / overlay opens. Mobile‑friendly: don't put it in a side panel.
- **localStorage for "your matchbox"** — key per‑house: `atv-bhava-{n}-items` (string array). Persist user's items + strike‑out state across visits.
- **Karaka chip** in each drawer → click it → opens that planet's drawer / page (linking out to LC's planet drawer if it exists).
- **Cite the source on every keyword chip** — small tag like `BPHS`, `UK`, `SC`, etc. This is the "you can trust where this comes from" signal Vikram emphasises.
- **Filter UI**: at the top of each drawer, a small `[ All sources · BPHS only · resonant only ]` toggle, so a learner can collapse the cloud down to what they marked as their own.
- **Page is gated** — passcode behind `gate.js` like the other peer pages.
- **Page version**: this will be a new peer page (e.g. `bhavas.html`). It joins the More menu → learning group. Add a release‑notes entry when shipped. Run `bin/stamp.py` to rotate version + build.

---

## 7 · Sources

- `astrology-101-knowledge-base/transcripts/36-houses-interpretation.md` — the original matchbox brief (Vikram, 1:41:33–1:53:00). Per‑house worked examples for H1 and H2.
- `astrology-101-knowledge-base/transcripts/37-sripathi-paddhathi-and-houses.md` — reminder about bringing matchboxes to Ether retreat.
- `astrology-101-knowledge-base/transcripts/38-sp-method-houses-starting-interpretations.md` — reminder for end‑of‑year retreat.
- `astrology-101-knowledge-base/transcripts/33-intro-to-houses.md` — the houses introduction (Bhava chart vs. Rashi chart distinction).
- `astrology-101-knowledge-base/houses-classical.json` — canonical per‑house data (Sanskrit names + BPHS + UK + SC + HS + BJ keyword lists). Extracted from Deck #67 v2.
- `astrology-101-knowledge-base/house-planet-interpretation-guidance.md` — Vikram's 8‑step interpretation framework; useful if you want to add an "interpret this house in your chart" v2 later.

---

## 8 · One‑line pitch (for the page's masthead lede)

> *"Twelve matchboxes. One for each Bhava. Use them as a filter to see your world — fill them with what is around you."* — Vikram Devatha, after Session 36

---

*Brief compiled 11 May 2026 · Astrology 101 Companion App · paste this into the next cowork chat to start the build.*
