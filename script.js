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

// Function to add a new adjustment field
document.addEventListener("DOMContentLoaded", function() {
    const adjustmentsContainer = document.getElementById('adjustmentsContainer');
    const addAdjustmentButton = document.getElementById('addAdjustment');

    addAdjustmentButton.addEventListener('click', function() {
        // Create a new div for the adjustment inputs
        const adjustmentDiv = document.createElement('div');
        adjustmentDiv.classList.add('adjustment');

        // Create input for amount
        const amountInput = document.createElement('input');
        amountInput.type = 'number';
        amountInput.placeholder = 'Amount';
        amountInput.classList.add('adjustmentAmount');

        // Create input for remarks
        const remarksInput = document.createElement('input');
        remarksInput.type = 'text';
        remarksInput.placeholder = 'Remarks';
        remarksInput.classList.add('adjustmentRemarks');

        // Append inputs to the adjustment div
        adjustmentDiv.appendChild(amountInput);
        adjustmentDiv.appendChild(remarksInput);

        // Append the adjustment div to the container
        adjustmentsContainer.appendChild(adjustmentDiv);
    });
});

function calculateFees() {
    // Get values from the form
    const level = document.getElementById('level').value;
    const subjects = parseInt(document.getElementById('subjects').value);
    const siblings = document.getElementById('siblings').value;
    const paymentPlan = document.getElementById('paymentPlan').value;
    const isNewStudent = document.getElementById('newStudent').value === "yes";
    const isLMSFeeChecked = document.getElementById('lmsFee').value === "yes";

    // Calculate base fee per subject
    const baseFeePerSubject = feeData[level][subjects];
    const baseFee = baseFeePerSubject * subjects;

    // Fees for new students and LMS (only if dropdowns are set to "yes")
    const registrationFee = isNewStudent ? 30 : 0;
    const materialsFeePerSubject = 60;
    const totalMaterialsFee = isLMSFeeChecked ? materialsFeePerSubject * subjects : 0;

    // Refundable deposit per subject (not subject to GST)
    const depositPerSubject = 50;
    const totalDepositFee = depositPerSubject * subjects;

    // Discounts
    let siblingDiscount = 0;
    let subjectDiscount = 0;

    // Apply sibling discount if applicable
    if (siblings === "yes") {
        siblingDiscount = 0.15; // 15% sibling discount
    }

    // Apply subject-based discount
    if (subjects === 2) {
        subjectDiscount = 0.05; // 5% for 2 subjects
    } else if (subjects === 3) {
        subjectDiscount = 0.10; // 10% for 3 subjects
    } else if (subjects === 4) {
        subjectDiscount = 0.15; // 15% for 4 subjects
    } else if (subjects >= 5) {
        subjectDiscount = 0.20; // 20% for 5 or more subjects
    }

    // Apply payment plan discount
    let paymentDiscount = 0;
    if (paymentPlan === "halfYearly") {
        paymentDiscount = 0.02;
    } else if (paymentPlan === "annually") {
        paymentDiscount = 0.05;
    }

    // Total discount based on siblings, subjects, and payment plan
    const totalDiscount = 1 - (siblingDiscount + subjectDiscount + paymentDiscount);

    // Calculate discounted fee
    const discountedFee = baseFee * totalDiscount;

    // Apply GST (9%) to fees that are subject to it
    const gst = 0.09;
    const feeWithGST = (discountedFee + totalMaterialsFee + registrationFee) * (1 + gst);

    // Final total including additional fees but excluding deposit from GST
    const finalFeeBeforeAdjustment = feeWithGST;

    // Calculate total manual adjustments
    let totalAdjustments = 0;
    let adjustmentDetails = '';
    const adjustmentAmounts = document.querySelectorAll('.adjustmentAmount');
    const adjustmentRemarks = document.querySelectorAll('.adjustmentRemarks');

    adjustmentAmounts.forEach((amountInput, index) => {
        const amount = parseFloat(amountInput.value) || 0;
        totalAdjustments += amount;
        const remark = adjustmentRemarks[index].value || 'Adjustment';
        adjustmentDetails += `<p>${remark}: $${amount.toFixed(2)}</p>`;
    });

    // Calculate final fee after adjustments, adding the deposit separately (not subject to GST)
    const finalFee = finalFeeBeforeAdjustment + totalAdjustments + totalDepositFee;

    // Display detailed breakdown
    document.getElementById('result').innerHTML = `
        <h3>Fee Breakdown</h3>
        <p>Base Fee (for ${subjects} subjects @ $${baseFeePerSubject}/subject): <strong>$${baseFee.toFixed(2)}</strong></p>
        <p>- Sibling Discount: ${(siblingDiscount * 100).toFixed(2)}% ${siblingDiscount > 0 ? '(-$' + (baseFee * siblingDiscount).toFixed(2) + ')' : '(No discount)'}</p>
        <p>- Subjects Discount: ${(subjectDiscount * 100).toFixed(2)}% ${subjectDiscount > 0 ? '(-$' + (baseFee * subjectDiscount).toFixed(2) + ')' : '(No discount)'}</p>
        <p>- Payment Plan Discount: ${(paymentDiscount * 100).toFixed(2)}% ${paymentDiscount > 0 ? '(-$' + (baseFee * paymentDiscount).toFixed(2) + ')' : '(No discount)'}</p>
        <p>Total Discounted Fee: <strong>$${discountedFee.toFixed(2)}</strong></p>
        <p>+ LMS & Materials Fee ($60 per subject for ${subjects} subjects): $${totalMaterialsFee.toFixed(2)}</p>
        <p>+ Registration Fee: $${registrationFee.toFixed(2)}</p>
        <p>+ GST (9% on total): $${((discountedFee + totalMaterialsFee + registrationFee) * gst).toFixed(2)}</p>
        <p>+ Refundable Deposit ($50 per subject for ${subjects} subjects): $${totalDepositFee.toFixed(2)}</p>
        ${adjustmentDetails}
        <h4>Final Fee (after GST and fees): <strong>$${finalFee.toFixed(2)}</strong></h4>
    `;
}
