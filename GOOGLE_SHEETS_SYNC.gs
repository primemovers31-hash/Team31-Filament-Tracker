function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents || "{}");
    var secret = PropertiesService.getScriptProperties().getProperty("SHARED_SECRET") || "";
    if (secret && data.secret !== secret) {
      return jsonResponse({ ok: false, error: "Unauthorized" });
    }

    var sheetName = data.sheetName || "Sheet1";
    var action = data.action || "upsert";
    var item = data.item || {};
    var tag = String(item.tag || "").trim();
    if (!tag) return jsonResponse({ ok: false, error: "Missing tag" });

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) return jsonResponse({ ok: false, error: "Sheet not found" });

    var lastRow = Math.max(sheet.getLastRow(), 1);
    var lastCol = Math.max(sheet.getLastColumn(), 1);
    var values = sheet.getRange(1, 1, lastRow, lastCol).getDisplayValues();
    var headers = values[0];

    var columnMap = buildColumnMap(headers);
    var rowIndex = findRowIndex(values, columnMap.tag, tag);

    if (rowIndex === -1 && action !== "upsert") {
      return jsonResponse({ ok: false, error: "Tag not found" });
    }

    if (rowIndex === -1) {
      rowIndex = sheet.getLastRow() + 1;
      sheet.getRange(rowIndex, 1, 1, lastCol).setValues([new Array(lastCol).fill("")]);
    }

    setIfPresent(sheet, rowIndex, columnMap.tag, tag);
    setIfPresent(sheet, rowIndex, columnMap.filamentType, item.filamentType);
    setIfPresent(sheet, rowIndex, columnMap.specifics, item.specifics);
    setIfPresent(sheet, rowIndex, columnMap.brand, item.brand);
    setIfPresent(sheet, rowIndex, columnMap.sealed, item.sealed);
    setIfPresent(sheet, rowIndex, columnMap.location, item.location);
    setIfPresent(sheet, rowIndex, columnMap.amountRemaining, item.amountRemaining);
    setIfPresent(sheet, rowIndex, columnMap.orderAgain, item.orderAgain);
    setIfPresent(sheet, rowIndex, columnMap.comments, item.comments);
    setIfPresent(sheet, rowIndex, columnMap.color, item.color);

    return jsonResponse({ ok: true, row: rowIndex });
  } catch (error) {
    return jsonResponse({ ok: false, error: String(error) });
  }
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function normalizeHeader(value) {
  return String(value || "").trim().toLowerCase();
}

function findHeaderIndex(headers, options) {
  for (var i = 0; i < headers.length; i++) {
    var header = normalizeHeader(headers[i]);
    for (var j = 0; j < options.length; j++) {
      if (header === normalizeHeader(options[j])) return i + 1;
    }
  }
  return 0;
}

function buildColumnMap(headers) {
  return {
    tag: findHeaderIndex(headers, ["Asset tag", "Tag"]),
    filamentType: findHeaderIndex(headers, ["Filament type"]),
    specifics: findHeaderIndex(headers, ["Specifics (if nec", "Specifics (if neccessary)", "Specifics"]),
    brand: findHeaderIndex(headers, ["Brand"]),
    sealed: findHeaderIndex(headers, ["Sealed"]),
    location: findHeaderIndex(headers, ["Location"]),
    amountRemaining: findHeaderIndex(headers, ["Amount remaining (ag", "Amount remaining (approximate)", "Amount remaining"]),
    orderAgain: findHeaderIndex(headers, ["Order again"]),
    comments: findHeaderIndex(headers, ["Comments"]),
    color: findHeaderIndex(headers, ["Color"])
  };
}

function findRowIndex(values, tagColumn, tag) {
  if (!tagColumn) return -1;
  var wanted = String(tag).trim();
  for (var row = 1; row < values.length; row++) {
    if (String(values[row][tagColumn - 1] || "").trim() === wanted) return row + 1;
  }
  return -1;
}

function setIfPresent(sheet, rowIndex, columnIndex, value) {
  if (!columnIndex) return;
  if (typeof value === "undefined") return;
  sheet.getRange(rowIndex, columnIndex).setValue(value);
}
