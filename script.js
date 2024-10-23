const feesData = {
    K2: { 1: 170, 2: 162, 3: 153, 4: 145, 5: 136 },
    Primary1: { 1: 180, 2: 171, 3: 162, 4: 153, 5: 144 },
    Primary2: { 1: 190, 2: 181, 3: 171, 4: 162, 5: 152 },
    Primary3: { 1: 200, 2: 190, 3: 180, 4: 170, 5: 160 },
    Primary4: { 1: 210, 2: 200, 3: 189, 4: 179, 5: 168 },
    Primary5: { 1: 220, 2: 209, 3: 198, 4: 187, 5: 176 },
    Primary6: { 1: 230, 2: 219, 3: 207, 4: 196, 5: 184 },
    Secondary1: { 1: 240, 2: 228, 3: 216, 4: 204, 5: 192 },
    Secondary2: { 1: 250, 2: 238, 3: 225, 4: 213, 5: 200 },
    Secondary3: { 1: 280, 2: 266, 3: 252, 4: 238, 5: 224 },
    ON: { 1: 300, 2: 285, 3: 270, 4: 255, 5: 240 }
};

function calculateFee() {
    const level = document.getElementById("level").value;
    const subjects = parseInt(document.getElementById("subjects").value);
    const siblings = parseInt(document.getElementById("siblings").value);
    const paymentPlan = document.getElementById("paymentPlan").value;

    if (level && subjects) {
        let feePerSubject = feesData[level][subjects];
        let totalFee = feePerSubject * subjects;

        // Apply sibling discount
        if (siblings >= 2) {
            totalFee *= 0.85; // 15% discount for 2 or more siblings
        }

        // Apply payment plan discount
        if (paymentPlan === "half") {
            totalFee *= 0.98; // 2% off
        } else if (paymentPlan === "annual") {
            totalFee *= 0.95; // 5% off
        }

        // Add 9% GST
        totalFee *= 1.09;

        document.getElementById("totalFee").innerText = `Total Fee (with GST): $${totalFee.toFixed(2)}`;
    } else {
        document.getElementById("totalFee").innerText = "Please fill in all fields.";
    }
}
