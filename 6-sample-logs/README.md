# Sample Log Types

This log file records the status of each automated export attempt. There are four types of log entries:

---

**1. SUCCEEDED**
- Format: `jun-bill-dashboard CSV export SUCCEEDED at ...`
- Meaning: Data was successfully exported from Numbers to CSV and saved to Google Drive. Status file updated.

**2. SKIPPED**
- Format: `jun-bill-dashboard CSV export SKIPPED at ...`
- Meaning: The export was skipped because data for the day has already been exported. Prevents duplicate exports.

**3. FAILED**
- Format: `jun-bill-dashboard CSV export FAILED at ...`
- Meaning: The export failed during the data reading phase (e.g., Numbers file not found, cannot open, or data structure error). No data was exported. The process stopped before writing any files.

**4. ERROR**
- Format: `jun-bill-dashboard CSV export ERROR at ...: <error message>`
- Meaning: Data was read successfully, but an error occurred while writing the CSV or status file (e.g., disk write failure, permission issue). Data was not saved.

---

**Note:**
- `FAILED` means the process could not start or read data.
- `ERROR` means the process read data but could not save it.

Refer to this file to quickly diagnose which stage of the export process encountered a problem.