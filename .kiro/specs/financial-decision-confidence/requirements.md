# Requirements Document

## Introduction

Financial Decision Confidence is an embedded experience within a digital banking application that helps consumers with variable or irregular income understand their near-term financial position. It replaces traditional "Safe to Spend" indicators with three confidence moments: Ambient Confidence (dashboard position overview), Active Confidence (consequence exploration for hypothetical spending), and Protective Confidence (proactive heads-up notifications for upcoming shortfalls). The system operates on transaction history from a provider abstraction layer (mock data for MVP) and uses pattern detection to identify recurring obligations and income.

## Glossary

- **Position_Engine**: The domain service that combines account balance, detected obligations, and predicted income to calculate a member's financial position including available capacity and daily projections
- **Obligation_Detector**: The domain service that analyzes transaction history to identify recurring payment patterns, predict future occurrences, and assign confidence levels
- **Income_Predictor**: The domain service that identifies recurring income patterns from deposit history, predicts next deposit timing and amounts, and handles irregular income sources
- **Consequence_Simulator**: The domain service that models the impact of a hypothetical spending amount on a member's near-term financial position
- **Financial_Position**: A computed snapshot containing current balance, committed obligations, available capacity, daily projections, and position status
- **Available_Capacity**: The amount remaining after subtracting committed obligations from the current balance within a configurable time window
- **Obligation**: A recurring payment detected from transaction history, characterized by merchant, frequency, expected amount, expected date, and confidence level
- **Income_Event**: A detected or predicted deposit, characterized by source, frequency, expected amount, expected date, and confidence level
- **Time_Window**: A configurable forward-looking period (default 14 days) over which obligations and income are projected
- **Position_Status**: A classification of financial comfort level: comfortable, watch, or tight
- **Mock_Data_Provider**: The in-memory data layer implementing the provider interface with deterministic test data for the MVP
- **Member**: The end user of the digital banking application
- **Confidence_Level**: A qualitative indicator (confirmed or estimated) distinguishing scheduled/fixed items from predicted/variable items
- **Daily_Projection**: A day-by-day forecast of account position accounting for expected obligations and income
- **Heads_Up_Alert**: A proactive notification generated when projected capacity drops below zero within a configurable lookahead window

## Requirements

### Requirement 1: Financial Position Calculation

**User Story:** As a member, I want to see my current financial position at a glance, so that I can understand how much money I actually have available after upcoming obligations.

#### Acceptance Criteria

1. WHEN a member requests their financial position, THE Position_Engine SHALL return the current account balance in integer cents
2. WHEN a member requests their financial position, THE Position_Engine SHALL calculate committed obligations as the sum of all detected obligation amounts within the configured Time_Window
3. WHEN a member requests their financial position, THE Position_Engine SHALL calculate Available_Capacity as current balance minus committed obligations within the Time_Window
4. WHEN a member requests their financial position, THE Position_Engine SHALL include a summary of each upcoming obligation contributing to the committed total, ordered chronologically
5. WHEN a member requests their financial position, THE Position_Engine SHALL distinguish between confirmed obligations (fixed amount, scheduled date) and estimated obligations (variable amount, inferred date) using Confidence_Level
6. WHEN a member requests their financial position, THE Position_Engine SHALL include expected income events within the Time_Window along with their Confidence_Level
7. WHEN the Time_Window is changed from the default 14 days to 7 or 30 days, THE Position_Engine SHALL recalculate all position values using the specified window
8. WHEN a member requests their financial position, THE Position_Engine SHALL assign a Position_Status of comfortable, watch, or tight based on the ratio of Available_Capacity to committed obligations

### Requirement 2: Obligation Detection and Prediction

**User Story:** As a member, I want the system to automatically detect my recurring bills and subscriptions, so that I do not have to manually enter each obligation.

#### Acceptance Criteria

1. WHEN analyzing transaction history, THE Obligation_Detector SHALL identify recurring payments by grouping transactions with matching normalized merchant descriptions
2. WHEN a merchant has at least 3 occurrences in transaction history, THE Obligation_Detector SHALL classify the payment as a recurring obligation
3. WHEN a recurring obligation is detected, THE Obligation_Detector SHALL predict the expected next date based on the detected frequency pattern (weekly, biweekly, or monthly)
4. WHEN a recurring obligation has consistent amounts (within 5% variance), THE Obligation_Detector SHALL predict the expected amount as the median of historical amounts
5. WHEN a recurring obligation has variable amounts (greater than 5% variance), THE Obligation_Detector SHALL display the expected range as the minimum and maximum of recent occurrences
6. WHEN a recurring obligation is detected, THE Obligation_Detector SHALL assign a Confidence_Level of confirmed for fixed-amount obligations and estimated for variable-amount obligations
7. WHEN a member confirms a detected obligation, THE Obligation_Detector SHALL mark the obligation as member-confirmed and increase its Confidence_Level to confirmed
8. WHEN a member dismisses a detected obligation, THE Obligation_Detector SHALL exclude the obligation from future position calculations
9. WHEN a member adjusts the expected amount or date of an obligation, THE Obligation_Detector SHALL use the member-provided values for future predictions
10. WHEN obligations are displayed, THE Obligation_Detector SHALL present them in chronological order by expected date with amounts formatted in the member's locale currency

### Requirement 3: Income Detection and Prediction

**User Story:** As a member, I want the system to recognize my income patterns, so that I can see when my next paycheck or deposit is expected.

#### Acceptance Criteria

1. WHEN analyzing transaction history, THE Income_Predictor SHALL identify recurring income by filtering inbound transactions and excluding internal transfers
2. WHEN a recurring income source has at least 3 occurrences, THE Income_Predictor SHALL classify the deposit as a recurring Income_Event
3. WHEN a recurring income source is detected, THE Income_Predictor SHALL predict the expected next deposit date based on the detected frequency pattern
4. WHEN a recurring income source has consistent amounts (within 5% variance), THE Income_Predictor SHALL predict the expected amount as the median of historical amounts
5. WHEN a recurring income source has inconsistent timing or amounts (gig income), THE Income_Predictor SHALL predict an expected range for both amount and timing
6. WHEN an income event is scheduled or confirmed by the member, THE Income_Predictor SHALL assign a Confidence_Level of confirmed
7. WHEN an income event is predicted from patterns, THE Income_Predictor SHALL assign a Confidence_Level of estimated
8. WHEN predicting income timing, THE Income_Predictor SHALL achieve accuracy within 2 calendar days for regular sources

### Requirement 4: Consequence Exploration

**User Story:** As a member, I want to see what happens to my financial position if I spend a certain amount, so that I can make informed spending decisions.

#### Acceptance Criteria

1. WHEN a member inputs a hypothetical spending amount, THE Consequence_Simulator SHALL calculate the resulting Financial_Position after subtracting the hypothetical amount from the current balance
2. WHEN a consequence simulation is performed, THE Consequence_Simulator SHALL generate a Daily_Projection showing the day-by-day position impact through the next Income_Event
3. WHEN a simulated spend causes Available_Capacity to drop below zero before the next Income_Event, THE Consequence_Simulator SHALL identify and list the at-risk obligations that would exceed remaining funds
4. WHEN a member inputs a hypothetical spend, THE Consequence_Simulator SHALL return results within 1 second
5. WHEN a member dismisses the consequence explorer, THE Consequence_Simulator SHALL discard the simulation without persisting any data
6. WHEN a member inputs an empty or zero amount, THE Consequence_Simulator SHALL display the current position without modification
7. WHEN the simulated spend does not cause Available_Capacity to drop below zero, THE Consequence_Simulator SHALL display a positive confirmation indicating the spend is within comfortable range

### Requirement 5: Proactive Heads-Up Notifications

**User Story:** As a member, I want to be warned ahead of time when my upcoming bills might exceed my available funds, so that I can take action before a shortfall occurs.

#### Acceptance Criteria

1. WHEN the Position_Engine projects that Available_Capacity will drop below zero within a 7-day lookahead window, THE Position_Engine SHALL generate a Heads_Up_Alert
2. WHEN generating a Heads_Up_Alert, THE Position_Engine SHALL provide a minimum of 48 hours lead time before the projected shortfall date
3. WHEN generating a Heads_Up_Alert, THE Position_Engine SHALL explain the cause by listing the specific obligations creating the shortfall, the timing gap, and the shortfall amount in cents
4. WHEN Available_Capacity is projected to remain above zero despite being low, THE Position_Engine SHALL assign a Position_Status of watch without generating a Heads_Up_Alert
5. WHEN a member dismisses a Heads_Up_Alert, THE Position_Engine SHALL suppress that specific alert until conditions change
6. WHEN a member configures notification preferences, THE Position_Engine SHALL respect the member's opt-in or opt-out settings for Heads_Up_Alerts

### Requirement 6: Data Foundation and Pattern Processing

**User Story:** As a member, I want the system to work immediately with my existing transaction history, so that I receive meaningful insights without manual setup.

#### Acceptance Criteria

1. WHEN the application initializes, THE Mock_Data_Provider SHALL supply account balance, a minimum of 90 days of transaction history, and the member profile
2. WHEN processing transactions, THE Obligation_Detector SHALL categorize each transaction as income, recurring obligation, or discretionary
3. WHEN new transactions are processed, THE Obligation_Detector SHALL refine existing obligation predictions by incorporating the new data point
4. WHEN new transactions are processed, THE Income_Predictor SHALL refine existing income predictions by incorporating the new data point
5. WHEN the application starts with a single checking account, THE Position_Engine SHALL provide a complete Financial_Position using only that account's data
6. WHEN transaction history contains fewer than 3 occurrences of a pattern, THE Obligation_Detector SHALL not classify the pattern as a recurring obligation

### Requirement 7: Dashboard Position Display

**User Story:** As a member, I want to see a summary card on my dashboard showing my financial position, so that I can quickly assess my situation without navigating to a detail page.

#### Acceptance Criteria

1. WHEN the dashboard loads, THE Position_Card SHALL display the current balance, committed obligations total, and Available_Capacity within 2 seconds
2. WHEN displaying Available_Capacity, THE Position_Card SHALL visually emphasize the available amount as the primary figure
3. WHEN the dashboard loads, THE Position_Card SHALL display the next upcoming obligation with its name, amount, and expected date
4. WHEN the dashboard loads, THE Position_Card SHALL display the next expected income event with its source, amount, and expected date
5. WHEN displaying obligations and income, THE Position_Card SHALL show a Confidence_Level badge distinguishing confirmed from estimated items
6. WHEN the Position_Card is loading, THE Position_Card SHALL display an animated skeleton placeholder matching the card layout
7. WHEN a Heads_Up_Alert is active, THE Dashboard SHALL display a HeadsUpBanner above the Position_Card with informational styling and calm language

### Requirement 8: Consequence Explorer Interface

**User Story:** As a member, I want an intuitive interface to explore spending scenarios, so that I can quickly understand the impact without complex interactions.

#### Acceptance Criteria

1. WHEN a member enters a spending amount in the input field, THE Consequence_Explorer SHALL debounce input for 300 milliseconds before requesting a simulation
2. WHEN a simulation result is returned, THE Consequence_Explorer SHALL display a before-and-after comparison of Available_Capacity
3. WHEN a simulation indicates at-risk obligations, THE Consequence_Explorer SHALL display a risk indicator and list the specific at-risk obligations
4. WHEN a simulation indicates the spend is within comfortable range, THE Consequence_Explorer SHALL display a positive confirmation message
5. WHEN the input field is empty, THE Consequence_Explorer SHALL display the current position without a simulation result
6. WHEN displaying financial amounts, THE Consequence_Explorer SHALL format all values in the member's locale currency using integer cents converted to display format

### Requirement 9: Accessibility and Language

**User Story:** As a member, I want the application to be accessible and use plain language, so that I can understand my financial position regardless of ability or financial literacy.

#### Acceptance Criteria

1. THE Application SHALL comply with WCAG 2.1 Level AA for all interactive elements including color contrast, keyboard navigation, and screen reader support
2. THE Application SHALL use plain language descriptions without financial jargon for all position-related text
3. WHEN displaying position status, THE Application SHALL use non-alarming visual indicators (neutral and amber for watch states, green for comfortable) and SHALL NOT use red for financial position displays
4. WHEN displaying position status, THE Application SHALL provide text labels alongside any color indicators so that meaning is not conveyed by color alone
5. WHEN interactive elements receive focus, THE Application SHALL provide visible focus indicators meeting WCAG 2.1 AA contrast requirements

### Requirement 10: Graceful Degradation

**User Story:** As a member, I want the application to provide useful information even when data is incomplete, so that I receive value from the first moment of use.

#### Acceptance Criteria

1. WHEN transaction history is insufficient for obligation detection (fewer than 90 days), THE Application SHALL display the current balance and a message indicating the system is learning patterns
2. WHEN income prediction confidence is below estimated threshold, THE Position_Engine SHALL exclude low-confidence income from Available_Capacity calculations and display balance-only position
3. WHEN an API request fails, THE Application SHALL display the most recent cached position data with a stale-data indicator
4. IF the Position_Engine encounters an error during calculation, THEN THE Application SHALL fall back to displaying the current balance without projections
5. WHEN the application first loads for a new member, THE Application SHALL provide meaningful value by displaying at minimum the current balance and any detectable patterns from available history
