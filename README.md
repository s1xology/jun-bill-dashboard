# Expense Tracking Automation Project

<div align="center">

**[View Live Dashboard](https://lookerstudio.google.com/reporting/6f470c98-84ab-4fd8-844c-f397e2b9bd34)**  |  **[Get iOS Shortcut](https://www.icloud.com/shortcuts/34e8b4e5021e4e28a244b4203a1d275a)**

</div>

This project automates expense tracking through a complete data pipeline using Apple Shortcuts, AppleScript, Google Apps Script, and Google Looker Studio. The system creates an end-to-end workflow from data collection to visualization, streamlining the entire process of exporting expense data, processing it, and presenting it in an interactive dashboard with minimal manual intervention.

## Why I Built This

This project began as a spontaneous idea while I was studying in the US. I've always had the habit of tracking my expenses, and my girlfriend and I often discuss financial planning and budgeting together. Since I'm majoring in Business Analytics, I thought: "Why not build a live dashboard to visualize exactly where my money goes?" It's a perfect opportunity to apply my technical skills to real-world financial management!

## Project Structure

```
jun-bill-dashboard
├── 1-apple-shortcuts/                   
│   └── README.md                          # iOS Shortcut workflows and share link
├── 2-apple-script/
│   ├── export.scpt                        # Numbers to CSV export automation
│   └── log-rotate.scpt                    # Log rotation automation
├── 3-launchd/
│   ├── com.jun.billdashboard.export.plist        # macOS LaunchAgent for CSV export
│   └── com.jun.billdashboard.log-rotate.plist    # macOS LaunchAgent for log rotation
├── 4-google-apps-script/
│   └── transform.gs                       # CSV to Google Sheets processing automation
├── 5-google-looker-studio/
│   └── README.md                          # Dashboard calculated fields documentation
├── 6-sample-logs/
│   ├── activity.log                       # Sample execution log - by AppleScript
│   └── last-export.txt                    # Sample last export date - by AppleScript
├── .gitignore                           
├── LICENSE                              
└── README.md                              # Project documentation
```

## Runtime File Structure (Not in Repository)

The actual runtime files are stored in macOS standard directories:

```
iCloud Drive/Script Editor/jun-bill-dashboard/
├── export.scpt
├── log-rotate.scpt
├── activity.log -> /Users/YOUR_USERNAME/Library/Logs/jun-bill-dashboard/activity.log
└── last-export.txt -> /Users/YOUR_USERNAME/Library/Application Support/jun-bill-dashboard/last-export.txt

/Users/YOUR_USERNAME/Library/LaunchAgents/
├── com.jun.billdashboard.export.plist
└── com.jun.billdashboard.log-rotate.plist

/Users/YOUR_USERNAME/Library/Logs/jun-bill-dashboard/
└── activity.log

/Users/YOUR_USERNAME/Library/Application Support/jun-bill-dashboard/
└── last-export.txt
```

> **Note**: "iCloud Drive/Script Editor/" refers to ~/Library/Mobile Documents/com~apple~ScriptEditor2/Documents/ in the file system. Log and status files are stored outside iCloud to avoid LaunchAgent sandbox permission issues. Symbolic links in the iCloud directory provide convenient access to these files.


## Components

1. **`Apple Shortcuts`**: Provides convenient expense tracking on iPhone, allowing quick data entry and automatic categorization through iOS automation workflows.

2. **`AppleScript`**: Automates the export of expense data from Numbers to CSV format and uploads to Google Drive. Includes error handling, logging functionality, and manages the complete export workflow from opening the document to saving the output file. Features duplicate prevention logic that tracks the last export date to avoid multiple executions on the same day. Also includes a log rotation script that maintains the log file at a manageable size by keeping only the last 150 entries (approximately 1 month of history).

3. **`LaunchAgent`**: Enables the AppleScript to run automatically on a daily schedule without manual intervention. Uses macOS LaunchAgent to trigger the export process at specific times (17:30, 21:00, 22:00) each day, ensuring consistent data synchronization. A separate LaunchAgent handles log rotation daily at 00:05 to prevent unlimited log file growth.

4. **`Google Apps Script`**: Automatically processes and transforms CSV data from Google Drive into structured Google Sheets. Implements category mapping logic to create aggregated expense categories, dynamically inserts calculated columns, and maintains dual sheet layouts with different header configurations for flexible data analysis.

5. **`Google Looker Studio`**: Visualizes the processed data in a dashboard format. Includes documentation of calculated fields creation process. The `dashboard link` is provided at the top and in the Live Dashboard section for your convenience.

6. **`Sample Logs`**: Contains sample output files that demonstrate the project's functionality and serve as examples of the automated system's output. Includes `activity.log` showing execution history with timestamps (successful exports and skipped runs based on scheduling logic), maintained at 150 lines through automated log rotation, and `last-export.txt` tracking the most recent export date to prevent duplicate processing.

## Data Pipeline & Usage Workflow

The system operates through a complete automated data pipeline with the following workflow and refresh frequencies:


```
                   iCloud           Google Drive          Google Drive           Google Drive

          Extract             Load              Transform             Visualization
Raw Data  ----->   Numbers   ----->   CSV File   ----->   Google Sheets  ----->  Looker Studio
          (Apple          (AppleScript+          (Google                          (Dashboard)
         Shortcuts)        LaunchAgent)        Apps Script)

         Real-time         17:30-22:00           2:00 AM               Every 15 min
                          (Once per day)          Daily                  Refresh
```

1. **Data Collection**: Use Apple Shortcuts to track expenses on your iOS device
    - *Real-time - Multiple entries per day as expenses occur*

2. **Data Export**: The plist configuration triggers AppleScript to automatically export data from Numbers to CSV and upload to Google Drive
    - *Triggered 3 times daily (17:30, 21:00, 22:00), but executes maximum once per day*

3. **Data Processing**: Google Apps Script automatically processes the CSV data into structured Google Sheets
    - *Scheduled at 02:00 AM (slightly delayed) daily via Google Apps Script trigger*

4. **Data Visualization**: Access the Google Looker Studio dashboard to visualize and analyze the expenses
    - *Dashboard refreshes every 15 minutes, new data appears once per day around 02:15 AM*

## **Live Dashboard**

**[View Live Dashboard](https://lookerstudio.google.com/reporting/6f470c98-84ab-4fd8-844c-f397e2b9bd34)** - Click to access the full interactive dashboard with live data filtering capabilities.

> **Limitation (Mobile Viewing)**: Due to certain limitations (mobile compatibility, browser restrictions, report sizing issues, etc.), bar charts and pie charts may not display properly on mobile devices. However, they work perfectly on desktop and tablet devices.

> **Limitation (Manual Timestamp)**: Manually added records only include the date (year-month-day), whereas Shortcut-automated entries capture the full timestamp (year-month-day hour:minute:second); as a result, records within the same day may not reflect their true chronological order in the dashboard. This is a trade-off between data collection convenience and analytical precision.

## Initial Setup

1. Install the iOS Shortcut on your iPhone.
2. Clone the repository to your local machine.
3. Configure each component according to your environment:
   - Replace `YOUR_USERNAME` with your actual macOS username in AppleScript files
   - Replace `YOUR_USERNAME` with your actual macOS username in LaunchAgent plist files
   - Replace `YOUR_EMAIL@gmail.com` with your Google account email in AppleScript files
   - Replace `YOUR_GOOGLE_DRIVE_FOLDER_ID` and `YOUR_GOOGLE_SHEET_ID` in Google Apps Script
4. Create required directories:
   ```bash
   mkdir -p ~/Library/Application\ Support/jun-bill-dashboard
   mkdir -p ~/Library/Logs/jun-bill-dashboard
   ```
5. Copy AppleScript files to iCloud Drive (or another local location like `~/Library/Application\ Scripts/` if you prefer):
   ```bash
   cp 2-apple-script/*.scpt ~/Library/Mobile\ Documents/com~apple~ScriptEditor2/Documents/jun-bill-dashboard/
   ```
6. Install and load LaunchAgents:
   ```bash
   cp 3-launchd/*.plist ~/Library/LaunchAgents/
   launchctl load ~/Library/LaunchAgents/com.jun.billdashboard.export.plist
   launchctl load ~/Library/LaunchAgents/com.jun.billdashboard.log-rotate.plist
   ```
7. Verify LaunchAgents are running:
   ```bash
   launchctl list | grep billdashboard
   ```

> **Note**: All code files use placeholders (e.g., `YOUR_USERNAME`, `YOUR_GOOGLE_DRIVE_FOLDER_ID`) for privacy.

> **Important**: Log and status files are stored in `~/Library/Application Support` and `~/Library/Logs` to avoid LaunchAgent sandbox permission issues with iCloud Drive. Symbolic links can optionally be created alongside the AppleScript files in iCloud for convenient access.

## FAQ

### ***Why not directly use Shortcuts to write to CSV?***

While Shortcuts can directly write data to CSV files in iCloud, I chose to first input data into Numbers for several practical reasons:

1. **User-Friendly Interface**: Numbers provides a visual interface for reviewing and batch editing raw data, which raw CSV files cannot offer
2. **Manual Editing Flexibility**: Essential for real-world scenarios:
      - **`Cash payments`**: Shortcuts can only capture on-screen numbers, making manual entry necessary for cash transactions
      - **`Tip adjustments`**: Credit card screenshots capture pre-tip amounts, requiring manual updates to reflect actual totals
      - **`Rebates or reimbursements (checks)`**: Any rebates or reimbursements received as checks require manual entry, since these transactions are not captured by automated workflows

Numbers provides the reliability and flexibility that pure CSV automation cannot match.

### ***Why choose Google Looker Studio for visualization?***

I selected Google Looker Studio for the dashboard component for several key reasons:

1. **Google Ecosystem Integration**: Perfect integration with Google Sheets and Google Drive, eliminating data transfer complexity while providing excellent cloud-based user experience accessible from anywhere
2. **Cost-Effective**: Completely free to use, making it ideal for personal expense tracking projects
3. **Near Real-Time Updates**: Automatic data refresh capabilities that sync with Google Sheets changes (refreshes every 15 minutes)

## License

This project is licensed under the MIT License. See the LICENSE file for more details.