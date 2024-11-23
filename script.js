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

// Sibling discount rates based on total programmes
const siblingDiscountRates = {
    1: 0.05, // 1-3 total programmes
    2: 0.10, // 4-6 total programmes
    3: 0.15  // 7+ total programmes
};

// Function to calculate sibling discount based on total programmes
function getSiblingDiscountRate(totalProgrammes) {
    if (totalProgrammes <= 3) return siblingDiscountRates[1];
    if (totalProgrammes <= 6) return siblingDiscountRates[2];
    return siblingDiscountRates[3];
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

function calculateFees() {
    const level = document.getElementById('level').value;
    const subjects = parseInt(document.getElementById('subjects').value);
    const paymentPlan = document.getElementById('paymentPlan').value;
    const siblingProgrammes = parseInt(document.getElementById('siblingProgrammes').value) || 0;
    const isNewStudent = document.getElementById('newStudent').value === "yes";
    const isLMSFeeChecked = document.getElementById('lmsFee').value === "yes";

    const baseFeePerSubject = feeData[level][subjects];
    const baseFee = baseFeePerSubject * subjects;

    // LMS Fee per subject
    const materialsFeePerSubject = 60;
    const totalMaterialsFee = isLMSFeeChecked ? materialsFeePerSubject * subjects : 0;

    // Refundable deposit per subject
    const depositPerSubject = 50;
    const totalDepositFee = depositPerSubject * subjects;

    // Sibling discount rate
    const siblingDiscountRate = getSiblingDiscountRate(siblingProgrammes);

    // Payment plan discount rate
    let paymentDiscountRate = 0;
    if (paymentPlan === "halfYearly") paymentDiscountRate = 0.02;
    if (paymentPlan === "annually") paymentDiscountRate = 0.05;

    // Discounts
    const siblingDiscount = siblingDiscountRate * baseFee;
    const paymentDiscount = paymentDiscountRate * baseFee;
    const totalDiscount = siblingDiscount + paymentDiscount;

    // Adjustments
    let totalAdjustments = 0;
    let adjustmentDetails = '';
    document.querySelectorAll('.adjustmentAmount').forEach((input, index) => {
        const adjustment = parseFloat(input.value) || 0;
        totalAdjustments += adjustment;

        const remarks = document.querySelectorAll('.adjustmentRemarks')[index].value || 'Adjustment';
        adjustmentDetails += `<p>${remarks}: $${adjustment.toFixed(2)}</p>`;
    });

    // Adjusted fee
    const adjustedFee = baseFee + totalAdjustments;

    // Subtotal before GST
    const subtotalBeforeGST = adjustedFee - totalDiscount + totalMaterialsFee;

    // Apply GST at the very end (exclude deposit from GST)
    const gstRate = 0.09;
    const gstAmount = subtotalBeforeGST * gstRate;
    const totalWithGST = subtotalBeforeGST + gstAmount;

    // Final total including refundable deposit
    const finalFee = totalWithGST + totalDepositFee;

    // Display breakdown
    document.getElementById('result').innerHTML = `
        <h3>Fee Breakdown</h3>
        <p>Base Fee (for ${subjects} subjects @ $${baseFeePerSubject}/subject): <strong>$${baseFee.toFixed(2)}</strong></p>
        ${adjustmentDetails}
        <p>Adjusted Base Fee: <strong>$${adjustedFee.toFixed(2)}</strong></p>
        <p>- Sibling Discount (${(siblingDiscountRate * 100).toFixed(0)}%): <strong>-$${siblingDiscount.toFixed(2)}</strong></p>
        <p>- Payment Plan Discount (${(paymentDiscountRate * 100).toFixed(0)}%): <strong>-$${paymentDiscount.toFixed(2)}</strong></p>
        <p>Total Discount: <strong>-$${totalDiscount.toFixed(2)}</strong></p>
        <p>+ LMS & Materials Fee ($60 per subject for ${subjects} subjects): <strong>$${totalMaterialsFee.toFixed(2)}</strong></p>
        <p>Subtotal Before GST: <strong>$${subtotalBeforeGST.toFixed(2)}</strong></p>
        <p>+ GST (9%): <strong>$${gstAmount.toFixed(2)}</strong></p>
        <p>+ Refundable Deposit ($50 per subject for ${subjects} subjects): <strong>$${totalDepositFee.toFixed(2)}</strong></p>
        <h4>Final Fee (after GST and fees): <strong>$${finalFee.toFixed(2)}</strong></h4>
    `;
}
