const items = $input.all();
const result = [];

for (const item of items) {
  const pdfKeys = Object.keys(item.binary ?? {}).filter(
    (key) => item.binary[key].mimeType === "application/pdf"
  );
  for (const pdfKey of pdfKeys) {
    result.push({ json: item.json, binary: { attachment_0: item.binary[pdfKey] } });
  }
}

return result;
