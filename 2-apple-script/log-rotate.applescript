-- For reference only: This .applescript file is identical to the .scpt file with the same name.
-- Author: Zhengjun An
-- Created: 2026-01-30
-- Last Modified: 2026-01-31
-- Description:
--   Log rotation script to maintain only the last 150 log entries to prevent unlimited growth.

-- Configuration
set logFile to "/Users/YOUR_USERNAME/Library/Logs/jun-bill-dashboard/activity.log"
set maxLines to 150

try
	-- Get actual line count using shell command (more reliable)
	set totalLines to (do shell script "wc -l < " & quoted form of POSIX path of logFile) as integer
	
	-- Only rotate if exceeds maxLines
	if totalLines > maxLines then
		-- Keep only the last 150 lines using tail command
		do shell script "tail -n " & maxLines & " " & quoted form of POSIX path of logFile & " > " & quoted form of POSIX path of logFile & ".tmp && mv " & quoted form of POSIX path of logFile & ".tmp " & quoted form of POSIX path of logFile
		
		log "jun-bill-dashboard Log rotation COMPLETED: " & totalLines & " → " & maxLines & " lines at " & (current date)
	else
		log "jun-bill-dashboard Log rotation SKIPPED: Only " & totalLines & " lines (threshold: " & maxLines & ") at " & (current date)
	end if
	
on error errMsg number errNum
	log "jun-bill-dashboard Log rotation ERROR at " & (current date) & ": " & errMsg
end try