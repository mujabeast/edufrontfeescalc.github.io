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
    // Get values from the form (level, subjects, siblings, payment plan)
    const level = document.getElementById('level').value;
    const subjects = parseInt(document.getElementById('subjects').value);
    const siblings = document.getElementById('siblings').value;
    const paymentPlan = document.getElementById('paymentPlan').value;

    // Manual adjustments and remarks
    const manualAdjustments = parseFloat(document.getElementById('manualAdjustments').value) || 0;
    const remarks = document.getElementById('remarks').value;

    // Calculate base fee per subject
    const baseFeePerSubject = feeData[level][subjects];
    const baseFee = baseFeePerSubject * subjects;

    // Apply sibling and other discounts, same as before...
    let siblingDiscount = 0;
    let subjectDiscount = 0;

    if (siblings === "yes") siblingDiscount = 0.15;
    if (subjects === 2) subjectDiscount = 0.05;
    if (subjects === 3) subjectDiscount = 0.10;
    if (subjects === 4) subjectDiscount = 0.15;
    if (subjects >= 5) subjectDiscount = 0.20;

    let paymentDiscount = 0;
    if (paymentPlan === "halfYearly") paymentDiscount = 0.02;
    if (paymentPlan === "annually") paymentDiscount = 0.05;

    const totalDiscount = 1 - (siblingDiscount + subjectDiscount + paymentDiscount);
    const discountedFee = baseFee * totalDiscount;

    // Apply GST (9%)
    const gst = 0.09;
    const feeWithGST = discountedFee * (1 + gst);

    // Final total including additional fees (like LMS, registration, etc.)
    const finalFeeBeforeAdjustment = feeWithGST + 60 + 30 + 50;

    // Apply manual adjustments (additions or deductions)
    const finalFee = finalFeeBeforeAdjustment + manualAdjustments;

    // Display detailed breakdown
    document.getElementById('result').innerHTML = `
        <h3>Fee Breakdown</h3>
        <p>Base Fee (for ${subjects} subjects @ $${baseFeePerSubject}/subject): <strong>$${baseFee.toFixed(2)}</strong></p>
        <p>- Sibling Discount: ${(siblingDiscount * 100).toFixed(2)}% ${siblingDiscount > 0 ? '(-$' + (baseFee * siblingDiscount).toFixed(2) + ')' : '(No discount)'}</p>
        <p>- Subjects Discount: ${(subjectDiscount * 100).toFixed(2)}% ${subjectDiscount > 0 ? '(-$' + (baseFee * subjectDiscount).toFixed(2) + ')' : '(No discount)'}</p>
        <p>- Payment Plan Discount: ${(paymentDiscount * 100).toFixed(2)}% ${paymentDiscount > 0 ? '(-$' + (baseFee * paymentDiscount).toFixed(2) + ')' : '(No discount)'}</p>
        <p>Total Discounted Fee: <strong>$${discountedFee.toFixed(2)}</strong></p>
        <p>+ GST (9%): $${(discountedFee * gst).toFixed(2)}</p>
        <p>+ LMS & Materials Fee: $60.00</p>
        <p>+ Registration Fee: $30.00</p>
        <p>+ Refundable Deposit: $50.00</p>
        ${remarks ? `<p>${remarks}: $${manualAdjustments.toFixed(2)}</p>` : ''}
        <h4>Final Fee (after GST and fees): <strong>$${finalFee.toFixed(2)}</strong></h4>
    `;
}

function calculateFees() {
  // Get the value of whether the user is a new student
  const isNewStudent = document.getElementById('newStudent').value;

  // Assuming you have some base fee logic, like:
  let baseFee = 1000; // Example base fee

  // Check if the user is a new student and apply a discount or extra charge
  if (isNewStudent === 'yes') {
    // Example: Apply a discount or extra charge for new students
    let newStudentDiscount = 0.1; // 10% discount for new students
    baseFee -= baseFee * newStudentDiscount;
  }

  // Display the updated fee in the output paragraph
  document.getElementById('feeOutput').innerHTML = "The total fee is: $" + baseFee;
}
