# Sharp Elbows

**Get brutally honest (AI) feedback on your pitch deck before you embarrass yourself.**

Live → [nfx-sharp-elbows.yokyak.io](https://nfx-sharp-elbows.yokyak.io)

---

## What is this?

You're about to send your deck to NFX. You think it's ready.  
It's probably not.

Sharp Elbows lets you upload your pitch and get feedback written in the voice of NFX partners — James Currier, Pete Flint, Gigi Levy-Weiss, Morgan Beller, Omri Drory, Anna Piñol, and Sarai Bronfeld. Each one reacts to your deck independently, in their own style.

Upload → pick partners → get feedback → fix your deck → *then* hit send.

---

## Important disclaimer

> This is an unofficial AI simulator. The personas are built from publicly available materials — interviews, essays, podcasts, writing. These are **not** the real voices of real people. The real NFX partners have not seen or endorsed this tool.
>
> Think of it as a mirror, not a meeting.

---

## Stack

- React 18 + Vite
- Tailwind CSS
- Google Gemini 2.5 Flash (PDF understanding via `inlineData`)
- No backend — snapshots are gzip-compressed into the URL hash

---

## Run it locally

```bash
git clone git@github.com:teionarr/nfx-sharp-elbows.git
cd nfx-sharp-elbows
npm install
cp .env.example .env   # add your Gemini API key
npm run dev
```

You'll need a [Google Gemini API key](https://aistudio.google.com/app/apikey) (free tier works).

---

## Features

- Upload any PDF pitch deck (or image)
- Pick 1–7 partners to review it
- Feedback streams in parallel, in each partner's voice
- Green border = wants to go deeper · Red border = pass
- Save & share via a single URL (no backend, no login)
- Collapse/expand individual feedback cards

---

## Project structure

```
src/
  components/
    feedback/     # FeedbackCard, FeedbackPanel
    layout/       # Shell, TopBar
    setup/        # SetupPanel (upload + partner picker)
    shared/       # Button, FileDropZone, PersonaChip, SnapshotBanner
  hooks/          # useSimulation (state + streaming)
  machine/        # reducer + selectors
  pages/          # SnapshotPage (shared link view)
  services/       # gemini, snapshotService, personaLoader
public/
  personas/       # manifest.json + persona .txt system prompts
```

---

Made with [Claude Code](https://claude.ai/code).
