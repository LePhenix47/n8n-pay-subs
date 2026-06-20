const frenchMonthNames = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

// text items from Extract PDF text (binary stripped)
const textItems = $input.all();

// binary items from before extraction (still have attachment_0)
const binaryItems = $("Normalize PDF attachment").all();

const yearGroups = {};

for (let i = 0; i < textItems.length; i++) {
  const text = textItems[i].json.text ?? "";
  const bin = binaryItems[i]?.binary?.attachment_0 ?? null;
  const attachmentFileName = bin?.fileName ?? "";

  let month = null;
  let year = null;

  // 1. PDF text: "Salaire versé le : DD/MM/YY"
  const salMatch = text.match(
    /Salaire vers[eé] le\s*:\s*(\d{2})\/(\d{2})\/(\d{2,4})/i,
  );
  if (salMatch) {
    const monthNum = parseInt(salMatch[2]);
    month = frenchMonthNames[monthNum - 1] ?? null;
    const yr = salMatch[3];
    year = yr.length === 2 ? "20" + yr : yr;
  }

  // 2. Filename fallback: _MMYYYY
  if (!month || !year) {
    const fnMatch = attachmentFileName.match(/_(\d{2})(\d{4})\.pdf$/i);
    if (fnMatch) {
      const monthNum = parseInt(fnMatch[1]);
      if (monthNum >= 1 && monthNum <= 12) {
        month = frenchMonthNames[monthNum - 1];
        year = fnMatch[2];
      }
    }
  }

  year = year || "unknown";
  const fileName = month ? `${month}_${year}.pdf` : `unknown_${i}.pdf`;

  if (!yearGroups[year]) yearGroups[year] = {};

  if (bin) {
    const idx = Object.keys(yearGroups[year]).length;
    yearGroups[year][`pdf_${idx}`] = { ...bin, fileName };
  }
}

return Object.entries(yearGroups).map(([year, binaryData]) => ({
  json: { year },
  binary: binaryData,
}));
