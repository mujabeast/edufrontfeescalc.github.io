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

    // Final Fee Before Refundable Deposit
    let finalFeeBeforeRD = subtotalBeforeGST + gstAmount + totalAdjustments;

    // Final Fee (including refundable deposit)
    let finalFee = finalFeeBeforeRD + totalDepositFee;

    // Display breakdown
    document.getElementById('result').innerHTML = 
        `<h3>Fee Breakdown</h3>
        <p>Base Fee (for ${subjects} subjects @ $${baseFeePerSubject}/subject): <strong>$${totalBaseFee.toFixed(2)}</strong></p>
        <p>- Bundle Discount (${(bundleDiscountRate * 100).toFixed(0)}%): <strong>-$${bundleDiscount.toFixed(2)}</strong></p>
        <p>- Payment Plan Discount (${(paymentDiscountRate * 100).toFixed(0)}%): <strong>-$${paymentDiscount.toFixed(2)}</strong></p>
        <p>Adjusted Monthly Fee: <strong>$${adjustedMonthlyFee.toFixed(2)}</strong></p>
        ${paymentPlan === "monthly" ? "" : `<p>Fee for ${paymentPlanDescription}: <strong>$${totalFeeForPlan.toFixed(2)}</strong></p>`}
        <p>+ LMS & Materials Fee: <strong>$${totalMaterialsFee.toFixed(2)}</strong></p>
        <p>+ Registration Fee: <strong>$${registrationFee.toFixed(2)}</strong></p>
        <p>Subtotal Before GST: <strong>$${subtotalBeforeGST.toFixed(2)}</strong></p>
        <p>+ GST (9%): <strong>$${gstAmount.toFixed(2)}</strong></p>
        ${adjustmentsHtml}
        <h4>Final Fee : <strong>$${finalFeeBeforeRD.toFixed(2)}</strong></h4>';
}
