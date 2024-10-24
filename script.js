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

function calculateFees() {
    // Get values from the form
    const level = document.getElementById('level').value;
    const subjects = parseInt(document.getElementById('subjects').value);
    const siblings = document.getElementById('siblings').value;
    const paymentPlan = document.getElementById('paymentPlan').value;

    // Calculate base fee per subject
    const baseFeePerSubject = feeData[level][subjects];
    const baseFee = baseFeePerSubject * subjects;

    // LMS & Materials fee (per semester)
    const materialsFee = 60;

    // Registration fee (new students only)
    const registrationFee = 30;

    // Refundable deposit
    const depositFee = 50;

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

    // Apply GST (9%)
    const gst = 0.09;
    const feeWithGST = discountedFee * (1 + gst);

    // Final total including additional fees
    const finalFee = feeWithGST + materialsFee + registrationFee + depositFee;

    // Display detailed breakdown
    document.getElementById('result').innerHTML = `
        <h3>Fee Breakdown</h3>
        <p>Base Fee (for ${subjects} subjects @ $${baseFeePerSubject}/subject): $${baseFee.toFixed(2)}</p>
        <p>Siblings Discount: ${(siblingDiscount * 100).toFixed(2)}% (${siblings === "yes" ? 'Applied' : 'Not Applied'})</p>
        <p>Subjects Discount: ${(subjectDiscount * 100).toFixed(2)}% (${subjectDiscount > 0 ? 'Applied' : 'Not Applied'})</p>
        <p>Payment Plan Discount: ${(paymentDiscount * 100).toFixed(2)}% (${paymentPlan === 'monthly' ? 'None' : paymentPlan === 'halfYearly' ? '2% for Half-Yearly' : '5% for Annually'})</p>
        <p>Total Discounted Fee: $${discountedFee.toFixed(2)}</p>
        <p>GST (9%): $${(discountedFee * gst).toFixed(2)}</p>
        <p>LMS & Materials Fee: $${materialsFee.toFixed(2)}</p>
        <p>Registration Fee: $${registrationFee.toFixed(2)}</p>
        <p>Refundable Deposit: $${depositFee.toFixed(2)}</p>
        <h4>Final Fee (after GST and fees): $${finalFee.toFixed(2)}</h4>
    `;
}
