# Google Looker Studio Calculated Fields & Parameters

This file documents the custom calculated fields and parameters I created for the expense tracking dashboard. The implementations include basic SQL logic for time-based filtering, category ordering, and data visualization enhancements. These solutions help create a more interactive and user-friendly dashboard experience.

> **Note**: The code shown below uses Google Looker Studio's calculated field syntax, which is SQL-like but has its own specifications. It uses SQL keywords like CASE and WHEN, but is not standard SQL.

## Parameters

### Time_Period
**Purpose**: Enables flexible time window analysis for expense tracking, supporting common financial reporting periods and comparative analysis between current vs. historical spending patterns.
**Data Type**: Text (List)
- Month to Date
- Last Month  
- Year to Date
- Last Year
- Grand Total

## Calculated Fields

### 1. Category_7_Order
**Purpose**: Creates a custom ordering field for dashboard category controls. Since Looker Studio's default list ordering isn't user-friendly, this field ensures categories appear in a logical sequence (food → shopping → rent → transport → medical → tuition → others) when used in dropdown filters and chart displays.
**Data Type**: Number
```
CASE
  WHEN LOWER(TRIM(Category_7)) = "food" THEN 1
  WHEN LOWER(TRIM(Category_7)) = "shopping" THEN 2
  WHEN LOWER(TRIM(Category_7)) = "rent_uti" THEN 3
  WHEN LOWER(TRIM(Category_7)) = "transport" THEN 4
  WHEN LOWER(TRIM(Category_7)) = "medical" THEN 5
  WHEN LOWER(TRIM(Category_7)) = "tuition" THEN 6 
  WHEN LOWER(TRIM(Category_7)) = "others" THEN 7
  ELSE 8
END
```

### 2. Filtered_Amount
**Purpose**: Filters amount based on selected time period parameter.
**Data Type**: Currency
```
CASE
  WHEN Time_Period = "Grand Total" THEN Amount

  WHEN Time_Period = "Year to Date" 
       AND YEAR(Date) = YEAR(TODAY()) THEN Amount

  WHEN Time_Period = "Month to Date" 
       AND MONTH(Date) = MONTH(TODAY()) 
       AND YEAR(Date) = YEAR(TODAY()) THEN Amount

  WHEN Time_Period = "Last Year"
       AND YEAR(Date) = YEAR(TODAY()) - 1 THEN Amount

  WHEN Time_Period = "Last Month" 
       AND MONTH(TODAY()) > 1 
       AND MONTH(Date) = MONTH(TODAY()) - 1 
       AND YEAR(Date) = YEAR(TODAY()) THEN Amount

  WHEN Time_Period = "Last Month" 
       AND MONTH(TODAY()) = 1 
       AND MONTH(Date) = 12 
       AND YEAR(Date) = YEAR(TODAY()) - 1 THEN Amount

  ELSE 0
END
```

### 3. Pos_Sum_Filtered_Amount
**Purpose**: Sums filtered amounts specifically for pie chart visualization. Since pie charts cannot display both positive and negative values together, this field ensures all amounts are positive while maintaining the filtered time period logic. If a category's value is negative in the selected time period (Time_Period), it will be excluded from the pie chart.
**Data Type**: Currency
```
CASE
  WHEN SUM(Filtered_Amount) > 0 THEN SUM(Filtered_Amount)
  ELSE 0
END
```