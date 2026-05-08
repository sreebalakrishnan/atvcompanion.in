# House & Planet Interpretation — Vikram's Detailed Guidance

**Source:** `House interpretation - guidance from vikram.pdf` — uploaded by Sree, originally captured a few weeks before May 2026 from Vikram's class material on chart interpretation.
**Type:** Step-by-step interpretation methodology · the explicit pedagogy Vikram teaches the cohort for reading a house or a planet.
**Status:** Canonical. This document supersedes any drafted interpretation steps elsewhere in the project.
**Use:** Reference for Read · beta walk-through, Reflect mode, future workbook integrations, and any surface that scaffolds chart reading.

---

## Before You Begin — The Question First

The four pre-steps before any analysis begins:

1. **Get the question from the client.**
2. **Ask yourself:** *which house, planet, or sign should I analyze to answer this question?*
3. **Always analyze the Ascendant (1st house) first**, then go to the specific house in question.
4. **Decide whether you're analyzing a house or a planet.** The two paths diverge from here.

---

## If You Are Analysing a HOUSE — eight steps

### Step 1 — Sign + House
Pick **one keyword** for the house. Combine **each building block of the sign separately** with that house keyword → one sentence per building block. **No planets** at this step.

> **Note:** Choose a keyword that is easy to mix and match with sign building blocks.

### Step 2 — Planet(s) in that House
Combine **planet keyword + house keyword only**. **No sign building blocks.** One planet at a time.

> **Note:** Keep planet-in-sign and planet-in-house separate. If you use the sign's building blocks here, you're no longer analyzing the house — you've shifted topic.

### Step 3 — Relationship between Planets in the House
**Only if** planets are closely conjunct, OR one is in the other's sign, OR they aspect each other. Use **compound relationship** (permanent + temporary). Apply the positive or difficult twist based on the relationship to your sentence from Step 2.

### Step 4 — Ruler of House in Sign
Find the ruler of that house. Note which sign it's placed in → **ruler keyword + building blocks of that sign**. **No house keyword here.**

### Step 5 — Karaka in Sign
Find the natural Karaka of that house. Note which sign it's placed in → **Karaka keyword + building blocks of that sign**.

> **Note:** Choose a Karaka keyword that **overlaps with the house keyword** — this keeps focus on the house you're analyzing. **Never combine Karaka keyword + house keyword directly** — the Karaka is the same for all 8 billion people, so that sentence is universal, not specific.

### Step 6 — Aspects on the House
Is any planet aspecting the house or the Karaka? If yes → analyze the relationship between the aspecting planet and the Karaka, and apply the positive or difficult twist. If no → skip.

### Step 7 — Exchanges (Parivartana Yoga)
Is there an exchange between the ruler and another planet? If yes → bring this in at the Karaka step. **Exchange is very powerful** and creates a deep link between the two houses involved.

### Step 8 — Emphasizing Repeated Patterns
After all steps, look across building blocks. If Yang, or Mutable, or Water (etc.) appears repeatedly across multiple steps → that quality is **emphasized for this house**. If no single quality dominates → nothing is emphasized.

> **Bonus:** Relationship between Karaka and Ruler — only analyze if they aspect or are conjunct. Skip otherwise.

---

## If You Are Analysing a PLANET — three steps

### Step 1 — Planet in Sign
Planet keyword + each building block of the sign → one sentence per building block.

### Step 2 — Relationship between Planet and Owner of that Sign
Compound friendship/enmity (permanent + temporary) → colors how the planet performs.

### Step 3 — Planets conjunct with that Planet
Only if closely conjunct, aspecting, or one is in the other's sign → analyze the relationship and apply the twist to your sentence.

---

## What Goes With What — Combination Rules

| Step | Combine | Never bring in |
|---|---|---|
| **Sign + House** | Sign building blocks + House keyword | Planets |
| **Planet in House** | Planet keyword + House keyword | Sign building blocks |
| **Ruler / Karaka in Sign** | Planet keyword + Sign building blocks | House keyword |
| **Karaka + House keyword** | ❌ Never — same for everyone | — |

> **Advanced (later):** Combine all three — planet + sign + house. Master two at a time first.

---

## Golden Rules

1. **One building block per sentence** — never combine two building blocks in one sentence.
2. **Write a sentence at every step** — don't just list, analyze.
3. **Show sources in brackets** after each word.
4. **Never chase rulerships in circles** — stop and write a sentence.
5. **Always ask:** *is this the same for all 8 billion people?* If yes, you're doing it wrong.
6. **Analyze your relationship with house significations** — not other people directly.
7. **Exaltation, debilitation, sign archetypes** — comes later, don't use yet.

---

## Cross-references

- **`interpretation-framework.md`** — the two craft anchors (Parts of Speech + The Intention) from deck 72. This document operationalises those anchors into a concrete step-by-step procedure.
- **`decks/72-sun.md` (Parts of Speech)** — the grammar map that underlies the "one building block per sentence" rule.
- **`houses-classical.json`** — Karaka per house, classical significations.
- **`planets-classical.json`** — planet keywords per Vikram's class.
- **`SIGNS_DATA` (in `quick-reference.html`)** — sign building blocks (duality, modality, element, ruler).
- **`AVATARS` (in `quick-reference.html`)** — keyword lists per planet via avatar mapping.

---

## How this lives in the project

- **Source of truth:** this file.
- **Read · beta walk-through** currently surfaces a simplified version of Steps 1, 2, 4 — sign keywords (drawer), planet placements (factual), Pati / ruler placement (Pati block). Steps 3 (planet-to-planet relationships), 5 (Karaka), 6 (aspects), 7 (Parivartana), 8 (repeated patterns) are not yet surfaced. Roadmap: layer them in over future Read · beta releases as the cohort progresses.
- **Pedagogical hierarchy** the project follows:
  1. The two craft anchors (Parts of Speech + Intention) — *how* to write a sentence.
  2. This 8-step procedure — *what order* to walk through factors.
  3. The Golden Rules — *constraints* that keep interpretation specific and personal.
- **What the system never does:** combine factors automatically, generate the sentence for the learner, or compute the "advanced" three-way (planet + sign + house) combinations.
