const fees = {
    "K2": [170, 162, 153, 145, 136],
    "Primary 1": [180, 171, 162, 153, 144],
    "Primary 2": [190, 181, 171, 162, 152],
    "Primary 3": [200, 190, 180, 170, 160],
    "Primary 4": [210, 200, 189, 179, 168],
    "Primary 5": [220, 209, 198, 187, 176],
    "Primary 6": [230, 219, 207, 196, 184],
    "Secondary 1": [240, 228, 216, 204, 192],
    "Secondary 2": [250, 238, 225, 213, 200],
    "Secondary 3": [280, 266, 252, 238, 224],
    "O/N Levels": [300, 285, 270, 255, 240]
};

function calculateFees() {
    const level = document.getElementById('level').value;
    const subjects = parseInt(document.getElementById('subjects').value);

    if (subjects < 1 || subjects > 5) {
        document.getElementById('result').innerText = 'Please select between 1 and 5 subjects.';
        return;
    }

    const baseFee = fees[level][subjects - 1];
    const gst = 0.09;
    const registrationFee = 30;
    const materialsFee = 60;
    const deposit = 50;

    let total = baseFee * subjects;
    total += registrationFee + materialsFee + deposit;
    total += total * gst;

    document.getElementById('result').innerText = `Total Monthly Fee: $${total.toFixed(2)}`;
}