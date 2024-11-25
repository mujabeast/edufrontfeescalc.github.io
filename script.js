function calculateFees() {
    const level = document.getElementById('level').value;
    const subjects = parseInt(document.getElementById('subjects').value);
    const paymentPlan = document.getElementById('paymentPlan').value;
    const siblingSubjects = parseInt(document.getElementById('siblingSubjects').value) || 0;
    const isNewStudent = document.getElementById('newStudent').value === "yes";
    const isLMSFeeChecked = document.getElementById('lmsFee').value === "yes";

    // Base Fee
    const baseFeePerSubject = feeData[level][1]; // Original fee per subject without discounts
    const totalBaseFee = baseFeePerSubject * subjects;

    // LMS Fee per subject
    const materialsFeePerSubject = 60;
    const totalMaterialsFee = isLMSFeeChecked ? materialsFeePerSubject * subjects : 0;

    // Refundable deposit per subject
    const depositPerSubject = 50;
    const totalDepositFee = depositPerSubject * subjects;

    // Sibling discount (based on total sibling subjects)
    const siblingDiscountRate = getDiscountRate(siblingSubjects); // Total sibling discount rate
    const siblingDiscount = siblingDiscountRate * (siblingSubjects * baseFeePerSubject);

    // Payment plan discount rate
    let paymentDiscountRate = 0;
    if (paymentPlan === "halfYearly") paymentDiscountRate = 0.02;
    if (paymentPlan === "annually") paymentDiscountRate = 0.05;

    const paymentDiscount = totalBaseFee * paymentDiscountRate;

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
    const adjustedFee = totalBaseFee + totalAdjustments;

    // Subtotal before GST
    const subtotalBeforeGST = adjustedFee - siblingDiscount - paymentDiscount + totalMaterialsFee;

    // Apply GST at the very end (exclude deposit from GST)
    const gstRate = 0.09;
    const gstAmount = subtotalBeforeGST * gstRate;
    const totalWithGST = subtotalBeforeGST + gstAmount;

    // Final total including refundable deposit
    const finalFee = totalWithGST + totalDepositFee;

    // Display breakdown
    document.getElementById('result').innerHTML = `
        <h3>Fee Breakdown</h3>
        <p>Base Fee (for ${subjects} subjects @ $${baseFeePerSubject}/subject): <strong>$${totalBaseFee.toFixed(2)}</strong></p>
        ${adjustmentDetails}
        <p>Adjusted Base Fee: <strong>$${adjustedFee.toFixed(2)}</strong></p>
        <p>- Sibling Discount (${(siblingDiscountRate * 100).toFixed(0)}% on ${siblingSubjects} subjects): <strong>-$${siblingDiscount.toFixed(2)}</strong></p>
        <p>- Payment Plan Discount (${(paymentDiscountRate * 100).toFixed(0)}%): <strong>-$${paymentDiscount.toFixed(2)}</strong></p>
        <p>Total Discount: <strong>-$${(siblingDiscount + paymentDiscount).toFixed(2)}</strong></p>
        <p>+ LMS & Materials Fee ($60 per subject for ${subjects} subjects): <strong>$${totalMaterialsFee.toFixed(2)}</strong></p>
        <p>Subtotal Before GST: <strong>$${subtotalBeforeGST.toFixed(2)}</strong></p>
        <p>+ GST (9%): <strong>$${gstAmount.toFixed(2)}</strong></p>
        <p>+ Refundable Deposit ($50 per subject for ${subjects} subjects): <strong>$${totalDepositFee.toFixed(2)}</strong></p>
        <h4>Final Fee (after GST and fees): <strong>$${finalFee.toFixed(2)}</strong></h4>
    `;
}
