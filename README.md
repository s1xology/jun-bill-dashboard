# Expense Tracking Automation Project

<div align="center">

**[View Live Dashboard](https://lookerstudio.google.com/s/lpO4OOx_7ao)** | **[Get iOS Shortcut](https://www.icloud.com/shortcuts/066481bace81480294682ddc6d2867f2)**

</div>

This project automates expense tracking through a complete data pipeline using Apple Shortcuts, AppleScript, Google Apps Script, and Google Looker Studio. The system creates an end-to-end workflow from data collection to visualization, streamlining the entire process of exporting expense data, processing it, and presenting it in an interactive dashboard with minimal manual intervention.

## Why I Built This

This project began as a spontaneous idea while I was studying in the US. I’ve always had the habit of tracking my expenses, but my girlfriend often pointed out that I spend money too freely. Since I’m majoring in Business Analytics, I thought: “Why not build a dashboard to show exactly where my money goes?” Sometimes, the best motivation comes from personal challenges!

## Project Structure

```
jun-bill-dashboard
├── 1-apple-shortcuts/                   
│   └── README.md                        # iOS Shortcut workflows and share link
├── 2-apple-script/
│   └── jun-bill-dashboard.scpt          # Numbers to CSV export automation
├── 3-launchd/
│   └── com.jun.jun-bill-dashboard.plist # macOS LaunchAgent configuration
├── 4-google-apps-script/
│   └── jun-bill-dashboard.gs            # CSV to Google Sheets processing automation
├── 5-google-looker-studio/
│   └── README.md                        # Dashboard calculated fields documentation
├── 6-sample-logs/
│   ├── jun-bill-dashboard.log           # Sample execution log
│   └── jun-bill-last-export-date.txt    # Sample export date tracking
├── .gitignore                           
├── LICENSE                              
└── README.md                            # Project documentation
```

## Components

1. **`Apple Shortcut`s**: Provides convenient expense tracking on iPhone, allowing quick data entry and automatic categorization through iOS automation workflows.

2. **`AppleScript`**: Automates the export of expense data from Numbers to CSV format and uploads to Google Drive. Includes error handling, logging functionality, and manages the complete export workflow from opening the document to saving the output file. Features duplicate prevention logic that tracks the last export date to avoid multiple executions on the same day.

3. **`LaunchAgent`**: Enables the AppleScript to run automatically on a daily schedule without manual intervention. Uses macOS LaunchAgent to trigger the export process at specific times (17:30, 21:00, 22:00) each day, ensuring consistent data synchronization.

4. **`Google Apps Script`**: Automatically processes and transforms CSV data from Google Drive into structured Google Sheets. Implements category mapping logic to create aggregated expense categories, dynamically inserts calculated columns, and maintains dual sheet layouts with different header configurations for flexible data analysis.

5. **`Google Looker Studio`**: Visualizes the processed data in a dashboard format. Includes documentation of calculated fields creation process. Chosen for its seamless integration with Google Sheets ecosystem, excellent cloud-based user experience through Google Drive, and most importantly, being completely free to use.

6. **`Sample Logs`**: Contains sample output files that demonstrate the project's functionality and serve as examples of the automated system's output. Includes `jun-bill-dashboard.log` showing execution history with timestamps (successful exports and skipped runs based on scheduling logic), and `jun-bill-last-export-date.txt` tracking the most recent export date to prevent duplicate processing.

## Initial Setup

> **Note**: All code files have been privacy-processed, replacing personal information with placeholders (e.g., `YOUR_USERNAME`, `YOUR_GOOGLE_DRIVE_FOLDER_ID`).

1. Clone the repository to your local machine.
2. Configure each component according to your environment (file paths, Google Drive folders, etc.).
3. Set up the automation schedule using the provided plist file.
4. Adjust the code based on your personal data recording habits and visualization requirements (expense categories, data fields, dashboard layout, etc.).
5. Test each component to ensure proper functionality.

## Daily Usage Workflow

- Use the Apple Shortcuts to track expenses on your iOS device.
- The plist configuration triggers AppleScript to automatically export data to Google Drive every day.
- Google Apps Script processes the CSV data into Google Sheets automatically.
- Access the Google Looker Studio dashboard to visualize and analyze your expenses.

## **Live Dashboard**

**[View Interactive Dashboard](https://lookerstudio.google.com/s/lpO4OOx_7ao)** - Click to access the full interactive dashboard with live data filtering capabilities.

> **Note**: Due to certain limitations (mobile compatibility, browser restrictions, report sizing issues, etc.), bar charts and pie charts may not display properly on mobile devices. However, they work perfectly on desktop and tablet devices.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.