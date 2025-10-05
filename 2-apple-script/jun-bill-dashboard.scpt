on run
    -- Define the path for the CSV file to be exported
    set csvFilePath to "/Users/YOUR_USERNAME/Library/Mobile Documents/com~apple~ScriptEditor2/Documents/jun-bill-dashboard/jun-bill-dashboard.csv"
    
    -- Define the Numbers document to be exported
    set numbersDocumentPath to "/Users/YOUR_USERNAME/Documents/jun-bill-dashboard.numbers"
    
    -- Open the Numbers document
    tell application "Numbers"
        open numbersDocumentPath
        delay 2 -- Wait for the document to open
        
        -- Export the document as CSV
        tell document 1
            tell sheet 1
                tell table 1
                    export to csvFilePath as CSV
                end tell
            end tell
        end tell
        
        -- Close the Numbers document
        close document 1 saving no
    end tell
    
    -- Log the export action
    set logFilePath to "/Users/YOUR_USERNAME/Library/Mobile Documents/com~apple~ScriptEditor2/Documents/jun-bill-dashboard/jun-bill-dashboard.log"
    set logMessage to "CSV export SUCCEEDED at " & (current date) as string
    do shell script "echo " & quoted form of logMessage & " >> " & quoted form of logFilePath
end run