document.getElementById('calculateFees').addEventListener('click', function() {
    // Fee structure data
    const feeStructure = {
        k2: { 1: 170, 2: 162, 3: 153, 4: 145, 5: 136 },
        p1: { 1: 180, 2: 171, 3: 162, 4: 153, 5: 144 },
        p2: { 1: 190, 2: 181, 3: 171, 4: 162, 5: 152 },
        p3: { 1: 200, 2: 190, 3: 180, 4: 170, 5: 160 },
        p4: { 1: 210, 2: 200, 3: 189, 4: 179, 5: 168 },
        p5: { 1: 220, 2: 209, 3: 198, 4: 187, 5: 176 },
        p6: { 1: 230, 2: 219, 3: 207, 4: 196, 5: 184 },
        s1: { 1: 240, 2: 228, 3: 216, 4: 204, 5: 192 },
        s2: { 1: 250, 2: 238, 3: 225, 4: 213, 5: 200 },
        s3: { 1: 280, 2: 266, 3: 252, 4: 238, 5: 224 },
        oLevels: { 1: 300, 2: 285, 3: 270, 4: 255, 5: 240 }
    };

    let level = document.getElementById('level').value;
    let subjects = parseInt(document.getElementById('subjects').value);
    let paymentPlan = document.getElementById('paymentPlan').value;

    // Get the base fee
    let baseFee = feeStructure[level][subjects];

    // Apply additional discount for payment plan
    let discount = 0;
    if (paymentPlan === 'half-yearly') {
        discount = 0.02; // 2% discount
    } else if (paymentPlan === 'annually') {
        discount = 0.05; // 5% discount
    }

    let totalFee = baseFee - (baseFee * discount);
    let gst = 0.09 * totalFee;
    let finalAmount = totalFee + gst;

    document.getElementById('totalFees').innerText = `$${finalAmount.toFixed(2)}`;
});
