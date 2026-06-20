const items = $input.all();
const result = [];

for (const item of items) {
  let pdfKey = null;
  for (const key of Object.keys(item.binary ?? {})) {
    if (item.binary[key].mimeType === "application/pdf") {
      pdfKey = key;
      break;
    }
  }
  if (!pdfKey) continue;
  result.push({
    json: item.json,
    binary: { attachment_0: item.binary[pdfKey] },
  });
}

return result;
