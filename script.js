// 1. Grab all the HTML items by their name tags (IDs)
const weeklyTotalInput = document.getElementById('weekly-total');
const startBtn = document.getElementById('start-btn');
const remainingTotalDisplay = document.getElementById('remaining-total');
const suggestedDailyDisplay = document.getElementById('suggested-daily');
const daysContainer = document.getElementById('days-container');

// 2. Setup the names of the days and an array to hold user spending numbers
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
let dailySpendings = []; // Holds the numbers typed by the user

// 3. This function handles the dynamic weekly math adjustments perfectly
function recalculateBudget() {
    let totalWeeklyBudget = parseFloat(weeklyTotalInput.value) || 0;
    let totalSpentSoFar = 0;
    
    // First Pass: Tally up exactly how much money has been spent across all inputs
    daysOfWeek.forEach((day, index) => {
        const inputField = document.getElementById(`input-${index}`);
        if (inputField) {
            let spentToday = parseFloat(inputField.value) || 0;
            dailySpendings[index] = spentToday;
            totalSpentSoFar += spentToday;
        }
    });

    // Update the main top dashboard numbers immediately
    let finalRemaining = totalWeeklyBudget - totalSpentSoFar;
    if (finalRemaining < 0) finalRemaining = 0;
    remainingTotalDisplay.innerText = `Ksh ${finalRemaining.toFixed(2)}`;
    
    let initialDaily = totalWeeklyBudget / 7;
    suggestedDailyDisplay.innerText = `Ksh ${initialDaily.toFixed(2)}`;

    // Calculate the uniform target budget pool for any remaining unspent days
    let spentCount = 0;
    let spentAmount = 0;
    
    daysOfWeek.forEach((day, index) => {
        const inputField = document.getElementById(`input-${index}`);
        if (inputField && parseFloat(inputField.value) > 0) {
            spentCount++;
            spentAmount += parseFloat(inputField.value);
        }
    });

    let activeDaysRemaining = 7 - spentCount;
    let remainingBudgetPool = totalWeeklyBudget - spentAmount;
    let unifiedNextDaysLimit = activeDaysRemaining > 0 ? (remainingBudgetPool / activeDaysRemaining) : 0;
    if (unifiedNextDaysLimit < 0) unifiedNextDaysLimit = 0;

    // Second Pass: Apply that unified target balance down the page
    daysOfWeek.forEach((day, index) => {
        const statusText = document.getElementById('status-' + index);
        const inputField = document.getElementById('input-' + index);
        if (!statusText || !inputField) return;

        let daysRemaining = 7 - (index + 1);

        if (daysRemaining > 0) {
            if (parseFloat(inputField.value) > 0) {
                statusText.innerText = `Logged spend for today.`;
            } else {
                statusText.innerText = `Next days adjust to: Ksh ${unifiedNextDaysLimit.toFixed(2)}/day`;
            }
        } else {
            statusText.innerText = `Week Completed!`;
        }
    });
}

// 4. This function builds the visual rows for Monday-Sunday on the screen
function buildDaysGrid() {
    daysContainer.innerHTML = ''; // Clear out any old rows
    
    daysOfWeek.forEach((day, index) => {
        const row = document.createElement('div');
        row.className = 'day-row';
        
        row.innerHTML = `
            <span class="day-name">${day}</span>
            <input type="number" id="input-${index}" class="day-input" placeholder="Spent Ksh 0" min="0">
            <span id="status-${index}" class="day-status">Calculating...</span>
        `;
        
        daysContainer.appendChild(row);
        
        // Listen closely: every time the user types a new number, rerun the math!
        document.getElementById('input-' + index).addEventListener('input', recalculateBudget);
    });
    
    recalculateBudget();
}

// Connect the "Set Budget" button to fire up this row grid builder
startBtn.addEventListener('click', buildDaysGrid);

// Run it once automatically right when the web page finishes loading up
buildDaysGrid();
