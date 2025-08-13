
// Pricing data based on the fee chart
const feeData = {
    k2: { 1: 170, 2: 162, 3: 153, 4: 145, 5: 136 },
    primary1: { 1: 180, 2: 171, 3: 162, 4: 153, 5: 144 },
    primary2: { 1: 190, 2: 181, 3: 171, 4: 162, 5: 152 },
    primary3: { 1: 200, 2: 190, 3: 180, 4: 170, 5: 160 },
    primary4: { 1: 210, 2: 200, 3: 189, 4: 179, 5: 168 },
    primary5: { 1: 220, 2: 209, 3: 198, 4: 187, 5: 176 },
    primary6: { 1: 230, 2: 218, 3: 207, 4: 196, 5: 184 },
    secondary1: { 1: 240, 2: 228, 3: 216, 4: 204, 5: 192 },
    secondary2: { 1: 250, 2: 238, 3: 225, 4: 213, 5: 200 },
    secondary3: { 1: 280, 2: 266, 3: 252, 4: 238, 5: 224 },
    olevels: { 1: 300, 2: 285, 3: 270, 4: 255, 5: 240 }
};

// Discount rates based on total programmes
const discountRates = {
    2: 0.05,  // 2 subjects: 5%
    3: 0.10,  // 3 subjects: 10%
    4: 0.15,  // 4 subjects: 15%
    5: 0.20   // 5 or more subjects: 20%
};

// Function to calculate the discount rate based on total subjects
function getDiscountRate(totalSubjects) {
    if (totalSubjects >= 5) return discountRates[5];
    if (totalSubjects >= 4) return discountRates[4];
    if (totalSubjects >= 3) return discountRates[3];
    if (totalSubjects >= 2) return discountRates[2];
    return 0;
}

// Function to add a new adjustment field
document.addEventListener("DOMContentLoaded", function () {
    const adjustmentsContainer = document.getElementById('adjustmentsContainer');
    const addAdjustmentButton = document.getElementById('addAdjustment');

    addAdjustmentButton.addEventListener('click', function () {
        const adjustmentDiv = document.createElement('div');
        adjustmentDiv.classList.add('adjustment');

        const amountInput = document.createElement('input');
        amountInput.type = 'number';
        amountInput.placeholder = 'Amount';
        amountInput.classList.add('adjustmentAmount');

        const remarksInput = document.createElement('input');
        remarksInput.type = 'text';
        remarksInput.placeholder = 'Remarks';
        remarksInput.classList.add('adjustmentRemarks');

        adjustmentDiv.appendChild(amountInput);
        adjustmentDiv.appendChild(remarksInput);

        adjustmentsContainer.appendChild(adjustmentDiv);
    });
});

// Function to calculate fees
function calculateFees() {
    const level = document.getElementById('level').value;
    const subjects = parseInt(document.getElementById('subjects').value);
    const siblingSubjects = parseInt(document.getElementById('siblingSubjects').value) || 0;
    const paymentPlan = document.getElementById('paymentPlan').value;
    const isNewStudent = document.getElementById('newStudent').value === "yes";
    const isLMSFeeChecked = document.getElementById('lmsFee').value === "yes";

    // Base Fee
    const baseFeePerSubject = feeData[level][1]; // Original fee per subject without discounts
    const totalBaseFee = baseFeePerSubject * subjects;

    // Total subjects including siblings
    const totalSubjects = subjects + siblingSubjects;

    // Bundle Discount
    const bundleDiscountRate = getDiscountRate(totalSubjects); // 20% for 5+ subjects
    const bundleDiscount = totalBaseFee * bundleDiscountRate;

    // Payment Plan Discount
    let paymentDiscountRate = 0;
    if (paymentPlan === "halfYearly") paymentDiscountRate = 0.02; // 2%
    if (paymentPlan === "annually") paymentDiscountRate = 0.05; // 5%
    const paymentDiscount = totalBaseFee * paymentDiscountRate;

    // Adjusted Monthly Fee
    const adjustedMonthlyFee = totalBaseFee - bundleDiscount - paymentDiscount;

    // Fee for 6 months or 12 months based on Payment Plan
    let totalFeeForPlan = adjustedMonthlyFee;
    let paymentPlanDescription = "Monthly";
    if (paymentPlan === "halfYearly") {
        totalFeeForPlan = adjustedMonthlyFee * 6;
        paymentPlanDescription = "6 months";
    } else if (paymentPlan === "annually") {
        totalFeeForPlan = adjustedMonthlyFee * 12;
        paymentPlanDescription = "12 months";
    }

    // LMS Fee (per semester)
    const materialsFeePerSubject = 60;
    let totalMaterialsFee = 0;
    if (isLMSFeeChecked) {
        totalMaterialsFee = materialsFeePerSubject * subjects;
        if (paymentPlan !== "monthly") {
            totalMaterialsFee *= (paymentPlan === "halfYearly" ? 1 : 2);
        }
    }

    // Registration Fee (one-time for new students)
    const registrationFee = isNewStudent ? 30 : 0;

    // Refundable Deposit
    const depositPerSubject = 50;
    const totalDepositFee = depositPerSubject * subjects;

    // Subtotal Before GST (adjusted monthly fee * months + additional fees)
    let subtotalBeforeGST = totalFeeForPlan + totalMaterialsFee + registrationFee;

    // For monthly plans, subtotal should only include 1 month's fee
    if (paymentPlan === "monthly") {
        subtotalBeforeGST = adjustedMonthlyFee + totalMaterialsFee + registrationFee;
    }

    // GST
    const gstRate = 0.09;
    const gstAmount = subtotalBeforeGST * gstRate;

    // Calculate total adjustments and add to final fee
    const adjustmentsContainer = document.getElementById('adjustmentsContainer');
    const adjustmentAmounts = adjustmentsContainer.getElementsByClassName('adjustmentAmount');
    const adjustmentRemarks = adjustmentsContainer.getElementsByClassName('adjustmentRemarks');
    let adjustmentsHtml = '';
    let totalAdjustments = 0;
    for (let i = 0; i < adjustmentAmounts.length; i++) {
        const amount = parseFloat(adjustmentAmounts[i].value) || 0;
        const remark = adjustmentRemarks[i].value || 'Adjustment';
        totalAdjustments += amount;
        adjustmentsHtml += `<p>+ ${remark}: <strong>$${amount.toFixed(2)}</strong></p>`;
    }

    // Final Fee (including refundable deposit)
    let finalFee = subtotalBeforeGST + gstAmount + totalDepositFee + totalAdjustments;

    // Final Fee Before Refundable Deposit
    let finalFeeBeforeRD = subtotalBeforeGST + gstAmount + totalAdjustments;

    // Display breakdown
    document.getElementById('result').innerHTML = 
        `<h3>Fee Breakdown</h3>
        <p>Base Fee (for ${subjects} subjects @ $${baseFeePerSubject}/subject): <strong>$${totalBaseFee.toFixed(2)}</strong></p>
        <p>- Multiple Subject Discount (${(bundleDiscountRate * 100).toFixed(0)}%): <strong>-$${bundleDiscount.toFixed(2)}</strong></p>
        <p>- Payment Plan Discount (${(paymentDiscountRate * 100).toFixed(0)}%): <strong>-$${paymentDiscount.toFixed(2)}</strong></p>
        <p>Adjusted Monthly Fee: <strong>$${adjustedMonthlyFee.toFixed(2)}</strong></p>
        ${paymentPlan === "monthly" ? "" : `<p>Fee for ${paymentPlanDescription}: <strong>$${totalFeeForPlan.toFixed(2)}</strong></p>`}
        <p>+ LMS & Materials Fee: <strong>$${totalMaterialsFee.toFixed(2)}</strong></p>
        <p>+ Registration Fee: <strong>$${registrationFee.toFixed(2)}</strong></p>
        <p>Subtotal Before GST: <strong>$${subtotalBeforeGST.toFixed(2)}</strong></p>
        <p>+ GST (9%): <strong>$${gstAmount.toFixed(2)}</strong></p>
        <h4> Refundable Deposit ($50 per subject for ${subjects} subjects): <strong>$${totalDepositFee.toFixed(2)}</strong></h4>
        ${adjustmentsHtml}
        <h4>Final Fee (after refundable deposit): <strong>$${finalFee.toFixed(2)}</strong></h4>`;
}
