function calculateFees() {
    const programmes = document.getElementById('programmes').value;
    const siblings = document.getElementById('siblings').value;
    const monthlyFee = document.getElementById('monthlyFee').value;

    let totalFee = programmes * monthlyFee;

    if (programmes >= 2) {
        totalFee *= 0.95;  // 5% discount
    }

    if (siblings > 0) {
        totalFee *= (1 - siblings * 0.1);  // 10% discount per sibling
    }

    document.getElementById('totalFee').textContent = totalFee.toFixed(2);
}
