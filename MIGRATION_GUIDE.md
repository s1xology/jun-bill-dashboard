# Migration Guide: iCloud to Standard macOS Directories

## Why This Change?

Previously, log and status files were stored in iCloud Drive (`~/Library/Mobile Documents`), which caused LaunchAgent sandbox permission issues. This migration moves these files to standard macOS directories to ensure reliable automated execution.

## What Changed?

### Old Structure (Before)
```
~/Library/Mobile Documents/com~apple~ScriptEditor2/Documents/jun-bill-dashboard/
├── jun-bill-dashboard.scpt
├── jun-bill-dashboard-log-rotation.scpt
├── jun-bill-dashboard.log                    ← Moved
└── jun-bill-last-export-date.txt             ← Moved & Renamed
```

### New Structure (After)
```
~/Library/Mobile Documents/com~apple~ScriptEditor2/Documents/jun-bill-dashboard/
├── jun-bill-dashboard.scpt                   ← Updated paths
└── jun-bill-dashboard-log-rotation.scpt      ← Updated paths

~/Library/Application Support/jun-bill-dashboard/
└── last-export-date.txt                      ← New location (renamed)

~/Library/Logs/jun-bill-dashboard/
└── jun-bill-dashboard.log                    ← New location
```

## Migration Steps

### 1. Stop Running LaunchAgents

```bash
launchctl unload ~/Library/LaunchAgents/com.jun.jun-bill-dashboard.plist
launchctl unload ~/Library/LaunchAgents/com.jun.jun-bill-dashboard-log-rotation.plist
```

### 2. Create New Directories

```bash
mkdir -p ~/Library/Application\ Support/jun-bill-dashboard
mkdir -p ~/Library/Logs/jun-bill-dashboard
```

### 3. Migrate Existing Files (Optional)

If you want to preserve your existing log history and status:

```bash
# Migrate log file
cp ~/Library/Mobile\ Documents/com~apple~ScriptEditor2/Documents/jun-bill-dashboard/jun-bill-dashboard.log \
   ~/Library/Logs/jun-bill-dashboard/jun-bill-dashboard.log

# Migrate status file (note the rename)
cp ~/Library/Mobile\ Documents/com~apple~ScriptEditor2/Documents/jun-bill-dashboard/jun-bill-last-export-date.txt \
   ~/Library/Application\ Support/jun-bill-dashboard/last-export-date.txt
```

### 4. Update AppleScript Files in iCloud

Replace your existing `.scpt` files in iCloud with the updated versions from this repository:

- `2-apple-script/jun-bill-dashboard.scpt`
- `2-apple-script/jun-bill-dashboard-log-rotation.scpt`

**Important**: Don't forget to replace placeholders:
- `YOUR_USERNAME` → Your actual macOS username

### 5. Update LaunchAgent plist Files

Replace your existing plist files in `~/Library/LaunchAgents/` with updated versions:

```bash
cp 3-launchd/com.jun.jun-bill-dashboard.plist ~/Library/LaunchAgents/
cp 3-launchd/com.jun.jun-bill-dashboard-log-rotation.plist ~/Library/LaunchAgents/
```

**Important**: Replace `YOUR_USERNAME` with your actual username in both files.

### 6. Reload LaunchAgents

```bash
launchctl load ~/Library/LaunchAgents/com.jun.jun-bill-dashboard.plist
launchctl load ~/Library/LaunchAgents/com.jun.jun-bill-dashboard-log-rotation.plist
```

### 7. Test the Setup

```bash
# Check if agents are loaded
launchctl list | grep jun-bill-dashboard

# Monitor logs in real-time
tail -f ~/Library/Logs/jun-bill-dashboard/jun-bill-dashboard.log

# Check for errors in system log
log show --predicate 'eventMessage contains "jun-bill-dashboard"' --last 10m
```

## Cleanup (Optional)

After confirming everything works, you can remove old files from iCloud:

```bash
# Remove old log and status files from iCloud
rm ~/Library/Mobile\ Documents/com~apple~ScriptEditor2/Documents/jun-bill-dashboard/jun-bill-dashboard.log
rm ~/Library/Mobile\ Documents/com~apple~ScriptEditor2/Documents/jun-bill-dashboard/jun-bill-last-export-date.txt
```

## Troubleshooting

### Issue: "No such file or directory"

**Solution**: Ensure directories exist:
```bash
ls -la ~/Library/Application\ Support/jun-bill-dashboard/
ls -la ~/Library/Logs/jun-bill-dashboard/
```

### Issue: LaunchAgent still fails with sandbox error

**Solution**: Check that you've updated ALL files:
1. Both `.scpt` files in iCloud
2. Both `.plist` files in `~/Library/LaunchAgents/`
3. All `YOUR_USERNAME` placeholders replaced

### Issue: Export still writes to old location

**Solution**: Verify the paths in your actual iCloud `.scpt` file match the repository version.

## Benefits of New Structure

✅ **No Sandbox Issues**: Files in `~/Library/` are not subject to iCloud Drive sandbox restrictions  
✅ **Follows Apple Guidelines**: Standard directories for logs and application data  
✅ **Better Performance**: No iCloud sync overhead for frequently-written files  
✅ **Easier Debugging**: Logs in standard location accessible by all diagnostic tools  

## Questions?

If you encounter issues during migration, check:
1. File permissions: `ls -la ~/Library/Application\ Support/jun-bill-dashboard/`
2. System logs: `log show --predicate 'eventMessage contains "jun-bill-dashboard"' --last 1h`
3. LaunchAgent status: `launchctl list | grep jun`
