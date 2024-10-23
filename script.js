function calculateFees() {
    const baseFees = {
        'K2': 170, 'Primary 1': 180, 'Primary 2': 190, 'Primary 3': 200,
        'Primary 4': 210, 'Primary 5': 220, 'Primary 6': 230,
        'Secondary 1': 240, 'Secondary 2': 250, 'Secondary 3': 280, 'O/N Levels': 300
    };

    let level = document.getElementById('level').value;
    let numSubjects = parseInt(document.getElementById('subjects').value);
    let siblingCount = parseInt(document.getElementById('siblings').value);
    let paymentPlan = document.getElementById('paymentPlan').value;
    
    let baseFee = baseFees[level] * numSubjects;
    let discountRates = [0.05, 0.10, 0.15, 0.20];
    let bundleDiscount = numSubjects >= 2 ? baseFees[level] * discountRates[numSubjects - 2] * numSubjects : 0;
    
    let siblingDiscount = siblingCount >= 2 ? baseFees[level] * 0.15 * numSubjects : 0;

    let paymentPlanDiscount = paymentPlan === 'halfYearly' ? baseFees[level] * numSubjects * 0.02 : 
                              paymentPlan === 'annually' ? baseFees[level] * numSubjects * 0.05 : 0;

    let registrationFee = 30;
    let materialFee = 60;
    let deposit = 50;
    
    let gst = 0.09 * (baseFee - bundleDiscount - siblingDiscount - paymentPlanDiscount + registrationFee + materialFee + deposit);
    
    let totalFee = baseFee - bundleDiscount - siblingDiscount - paymentPlanDiscount + registrationFee + materialFee + deposit + gst;

    document.getElementById('baseFee').innerText = '$' + baseFee.toFixed(2);
    document.getElementById('bundleDiscount').innerText = '-$' + bundleDiscount.toFixed(2);
    document.getElementById('siblingDiscount').innerText = '-$' + siblingDiscount.toFixed(2);
    document.getElementById('paymentPlanDiscount').innerText = '-$' + paymentPlanDiscount.toFixed(2);
    document.getElementById('gstAmount').innerText = '$' + gst.toFixed(2);
    document.getElementById('totalFee').innerText = '$' + totalFee.toFixed(2);
}
