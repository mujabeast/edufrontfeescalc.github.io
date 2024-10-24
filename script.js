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

    // Calculate base fee
    const baseFee = feeData[level][subjects] * subjects;

    // Apply sibling discount if applicable
    let siblingDiscount = 0;
    if (siblings === "yes") {
        siblingDiscount = 0.15; // 15% sibling discount
    }

    // Apply payment plan discount
    let paymentDiscount = 0;
    if (paymentPlan === "halfYearly") {
        paymentDiscount = 0.02;
    } else if (paymentPlan === "annually") {
        paymentDiscount = 0.05;
    }

    // Total discount
    const totalDiscount = siblingDiscount + paymentDiscount;

    // Calculate discounted fee
    const discountedFee = baseFee * (1 - totalDiscount);

    // Apply GST (9%)
    const gst = 0.09;
    const finalFee = discountedFee * (1 + gst);

    // Display result
    document.getElementById('result').innerHTML = `
        <h3>Fee Breakdown</h3>
        <p>Base Fee (for ${subjects} subjects): $${baseFee.toFixed(2)}</p>
        <p>Total Discount: ${(totalDiscount * 100).toFixed(2)}%</p>
        <p>Discounted Fee: $${discountedFee.toFixed(2)}</p>
        <p>GST (9%): $${(discountedFee * gst).toFixed(2)}</p>
        <h4>Final Fee: $${finalFee.toFixed(2)}</h4>
    `;
}
