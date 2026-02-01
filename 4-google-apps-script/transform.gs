/*
Author: Zhengjun An
Date: 2025-10-04
Description: 
  A. Create a mapping rule to aggregate `Category` column.
  B. Import combined CSV from Google Drive to Google Sheet, 
    (1) cleaning empty rows and duplicate headers,
    (2) adding `Category_Agg` column based on created category mapping rule,
    (3) converting the last column `Description` to string,
    (4) copying data to both Sheet1 and Sheet2 for different future use,
    (5) modifying both Sheet1 and Sheet2 column names.
  C. Create a daily trigger at 02:00 AM.
*/

// A. Category Mapping for aggregate analysis
function mapCategoryToAgg(category) {
  if (!category || category.toString().trim() === "") {
    return "Uncategorized";
  }
  
  var cat = category.toString().trim();
  
  // Rent and Utilities
  if (cat === "Rent" || cat === "Water" || cat === "Electricity" || cat === "Internet") {
    return "Rent_Uti";
  }
  
  // Transportation
  if (cat === "Fuel" || cat === "Transportation") {
    return "Transport";
  }
  
  // Others
  if (cat === "Entertainment" || cat === "Other" || cat === "Car") {
    return "Others";
  }
  
  // Default: return original category if no mapping rule matches
  return cat;
}



// B. Import combined CSV from Google Drive to Google Sheet
function importCombinedCSV() {
  // 1. Initial Configuration
  var folderId = "YOUR_GOOGLE_DRIVE_FOLDER_ID";                   // The folder where the CSV is stored
  var fileName = "jun-bill-dashboard.csv";                        // The CSV file
  var sheetId = "YOUR_GOOGLE_SHEET_ID";                           // The target Google Sheet

  // 2. Get CSV raw data from Google Drive
  var folder = DriveApp.getFolderById(folderId);
  var files = folder.getFilesByName(fileName);
  if (!files.hasNext()) {
    throw new Error("No file named " + fileName + " found in the folder");
  }
  var file = files.next();
  var csvData = file.getBlob().getDataAsString("UTF-8");
  var data = Utilities.parseCsv(csvData);

  // 3. Clean CSV raw data
  var cleanedData = [];
  var headerSeen = false;
  var categoryColumnIndex = -1; // Track Category column position
  
  for (var i = 0; i < data.length; i++) {
    var row = data[i];
    
    // Skip completely empty rows
    if (row.join("").trim() === "") continue;
    
    // Skip duplicate header
    if (row[0] === "Date") {
      if (headerSeen) continue;
      headerSeen = true;
      
      // Find Category column index
      for (var j = 0; j < row.length; j++) {
        if (row[j] === "Category") {
          categoryColumnIndex = j;
          break;
        }
      }
      
      // Add `Category_Agg` column after Category column
      if (categoryColumnIndex !== -1) {
        row.splice(categoryColumnIndex + 1, 0, "Category_Agg");
      }

    } else {
      
      // Add Category_Agg value for data rows
      if (categoryColumnIndex !== -1 && row.length > categoryColumnIndex) {
        var categoryValue = row[categoryColumnIndex];
        var categoryAgg = mapCategoryToAgg(categoryValue);
        row.splice(categoryColumnIndex + 1, 0, categoryAgg);
      }
    }
    
    cleanedData.push(row);
  }

  // Convert only the last column (Description) to string
  var safeData = cleanedData.map(row => {
    if (row.length > 0) {
      row[row.length - 1] = row[row.length - 1].toString();
    }
    return row;
  });

  // 4. Write to both Sheet1 and Sheet2, duplicate sheets for different analysis purposes
  var spreadsheet = SpreadsheetApp.openById(sheetId);
  var sheet1 = spreadsheet.getSheetByName("Sheet1");
  var sheet2 = spreadsheet.getSheetByName("Sheet2");
  if (!sheet1) {
    throw new Error("Sheet1 not found. Please create Sheet1 in your Google Sheet.");
  }
  if (!sheet2) {
    throw new Error("Sheet2 not found. Please create Sheet2 in your Google Sheet.");
  }

  if (safeData.length > 0) {
    // Clear old data before writing
    sheet1.clearContents();
    sheet2.clearContents();
    // Write data
    sheet1.getRange(1, 1, safeData.length, safeData[0].length).setValues(safeData);
    sheet2.getRange(1, 1, safeData.length, safeData[0].length).setValues(safeData);
    // Update headers in both Sheet1 and Sheet2
    var customHeaders1 = ["Date", "Category", "Category_7", "Amount", "Description"];
    var customHeaders2 = ["Date", "Category_13", "Category_Agg", "Amount", "Description"];
    sheet1.getRange(1, 1, 1, customHeaders1.length).setValues([customHeaders1]);
    sheet2.getRange(1, 1, 1, customHeaders2.length).setValues([customHeaders2]);
  } else {
    Logger.log("No valid CSV data to import today.");
    return;
  }

  // 5. Log with formatted date and time
  var now = new Date();
  var formattedTime = now.getFullYear() + "-" 
    + (now.getMonth() + 1).toString().padStart(2, "0") + "-"
    + now.getDate().toString().padStart(2, "0") + " "
    + now.getHours().toString().padStart(2, "0") + ":"
    + now.getMinutes().toString().padStart(2, "0") + ":"
    + now.getSeconds().toString().padStart(2, "0");
  Logger.log("Combined CSV data imported successfully to both Sheet1 and Sheet2. Rows written: " + cleanedData.length + " | Time: " + formattedTime);
}



// C. Daily Trigger
function createDailyTrigger() {
  ScriptApp.newTrigger("importCombinedCSV")
    .timeBased()
    .everyDays(1)    // Run every day
    .atHour(2)       // Run at 02:00 AM, using 24-hour format (0 = midnight)
    .create();
}