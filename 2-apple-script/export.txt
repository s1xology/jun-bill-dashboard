-- For reference only: This .txt file is identical to the .scpt file with the same name.
-- Author: Zhengjun An
-- Created: 2025-10-04
-- Last Modified: 2026-01-31
-- Description:
--   A. Export data from Numbers to a CSV on Google Drive,
--      including:
--        - reading all sheets and tables,
--        - wrapping all cell values in quotes,
--        - combining rows into CSV format,
--        - preventing duplicate daily exports.
--   B. Maintain a status file to track the last export date.
--   C. Log success or error with timestamp.

-- Configuration
set numbersFile to "/Users/YOUR_USERNAME/Library/Mobile Documents/com~apple~Numbers/Documents/jun-bill-dashboard/jun-bill.numbers"
set exportCSV to "/Users/YOUR_USERNAME/Library/CloudStorage/GoogleDrive-YOUR_EMAIL@gmail.com/My Drive/jun-bill-dashboard/jun-bill-dashboard.csv"
set statusFile to "/Users/YOUR_USERNAME/Library/Application Support/jun-bill-dashboard/last-export.txt"
set appSupportDir to "/Users/YOUR_USERNAME/Library/Application Support/jun-bill-dashboard"

-- Ensure Application Support directory exists
do shell script "mkdir -p " & quoted form of appSupportDir

-- Get today's date as "YYYY-MM-DD"
set currentDate to (current date)
set todayStr to (year of currentDate as string) & "-" & (text -2 thru -1 of ("0" & (month of currentDate as integer))) & "-" & (text -2 thru -1 of ("0" & (day of currentDate)))

-- Check if already executed today
set alreadyExecuted to false
try
	set fileRef to open for access POSIX file statusFile
	set lastDate to (read fileRef)
	close access fileRef
	if lastDate = todayStr then set alreadyExecuted to true
on error
	try
		close access POSIX file statusFile
	end try
end try

if alreadyExecuted then
	log "jun-bill-dashboard CSV export SKIPPED at " & (current date)
	return -- Exit the script immediately if today's export has already been completed
end if

-- Open Numbers and read data
try
	tell application "Numbers"
		set targetDoc to open POSIX file numbersFile
		repeat until (targetDoc exists)
			delay 0.2
		end repeat
		set allRows to {}
		tell targetDoc
			repeat with sh in sheets
				repeat with tb in tables of sh
					set rowCount to count of rows of tb
					set colCount to count of columns of tb
					repeat with r from 1 to rowCount
						set rowDataList to {}
						repeat with c from 1 to colCount
							set cellValue to formatted value of cell c of row r of tb
							if cellValue is missing value then set cellValue to ""
							copy "\"" & cellValue & "\"" to end of rowDataList
						end repeat
						set AppleScript's text item delimiters to ","
						set rowText to rowDataList as string
						set AppleScript's text item delimiters to ""
						copy rowText to end of allRows
					end repeat
				end repeat
			end repeat
		end tell
		close targetDoc saving no
	end tell
on error
	log "jun-bill-dashboard CSV export FAILED at " & (current date)
	return
end try

-- Combine all rows into CSV text
set AppleScript's text item delimiters to return
set mergedData to allRows as string
set AppleScript's text item delimiters to ""

-- Write CSV and log success
try
	-- Write CSV file to Google Drive
	set fileRef to open for access POSIX file exportCSV with write permission
	set eof fileRef to 0
	write mergedData to fileRef
	close access fileRef
	-- Update last export date status
	set fileRef to open for access POSIX file statusFile with write permission
	set eof fileRef to 0
	write todayStr to fileRef
	close access fileRef
	-- Log successful export with timestamp
	log "jun-bill-dashboard CSV export SUCCEEDED at " & (current date)
on error errMsg number errNum
	try
		close access POSIX file exportCSV
	end try
	log "jun-bill-dashboard CSV export ERROR at " & (current date) & ": " & errMsg
end try