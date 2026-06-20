# Yearly Pay Stubs

Downloads all pay stub PDFs from Gmail, groups by year, outputs one ZIP per year with properly named files.

## Workflows

| File | Purpose |
|------|---------|
| `Yearly pay stubs - All years.json` | All years → one ZIP per year (e.g. `pay-stubs-2025.zip`) |
| `Yearly pay stubs.json` | Single year, filtered by `receivedAfter` date |

---

## How to launch n8n

```bash
n8n
```

Open http://localhost:5678 in browser.

> n8n is installed globally via npm. If the command isn't found, run `npm install -g n8n`.

---

## How to import a workflow

1. Open n8n → **Workflows** (left sidebar)
2. Top right → **Add workflow** → **Import from file**
3. Pick the `.json` file
4. Connect Gmail credential: click the Gmail nodes → select **Gmail account**
5. **Save** the workflow

---

## How to run

Click **Execute workflow** (top right) or hit the manual trigger node.

Outputs appear as binary items — download them from the execution result panel.

---

## How it works (`All years` workflow)

```
Manual trigger
  → Get all pay stub emails     (Gmail getAll, no date filter)
  → Download attachment         (Gmail get, simple: false, downloadAttachments: true)
  → Normalize PDF attachment    (Code node — finds first PDF among all attachments, drops inline images)
  → Extract PDF text            (Extract from File, typeVersion 1.1, continueOnFail: true)
  → Group by year               (Code node — reads text + pulls binaries from Normalize node)
  → Compression                 (one ZIP per year item)
```

### Key trick: accessing binaries after text extraction

`Extract PDF text` strips `item.binary` after running. To keep binaries, `Group by year` references the **Normalize** node's output directly:

```javascript
const textItems = $input.all();                          // text, no binary
const binaryItems = $('Normalize PDF attachment').all(); // binary, no text
```

n8n Code nodes can access any previous node's output via `$('Node name').all()`.

### Naming logic

Priority:
1. Parse `Salaire versé le : DD/MM/YY` from PDF text → `Janvier_2025.pdf`
2. Fallback: filename pattern `_MMYYYY.pdf` → `_052026.pdf` → `Mai_2026.pdf`
3. Last resort: `unknown_N.pdf`

### Extract PDF text config (important)

Must use `typeVersion: 1.1` with `options: {}`. Version 1 without options fails with `standardFontDataUrl` error.

---

## Gmail credential

- Credential name: **Gmail account**
- Filters emails from `@uncove.com` with subject `Bulletin de paie`

---

## Updating n8n

```bash
npm update -g n8n
```
