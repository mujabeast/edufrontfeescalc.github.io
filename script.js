function calculateFees() {
  const level = parseFloat(document.getElementById('level').value);
  const subjects = parseInt(document.getElementById('subjects').value);
  const siblings = parseInt(document.getElementById('siblings').value);
  const paymentPlan = parseFloat(document.getElementById('paymentPlan').value);

  const registrationFee = 30;
  const lmsFee = 60;
  const deposit = 50;

  let subjectDiscount = 0;
  if (subjects === 2) subjectDiscount = 5;
  if (subjects === 3) subjectDiscount = 10;
  if (subjects === 4) subjectDiscount = 15;
  if (subjects >= 5) subjectDiscount = 20;

  let siblingDiscount = 0;
  if (siblings === 1) siblingDiscount = 5;
  if (siblings >= 2) siblingDiscount = 10;

  const subjectCost = level * subjects;
  const discount = (subjectCost * (subjectDiscount + siblingDiscount + paymentPlan)) / 100;
  const totalCost = subjectCost - discount + registrationFee + lmsFee + deposit;

  document.getElementById('breakdown').innerHTML = `
    <h3>Breakdown:</h3>
    <p>Level Fee: $${level}/subject</p>
    <p>Number of Subjects: ${subjects}</p>
    <p>Subject Cost: $${subjectCost.toFixed(2)}</p>
    <p>Discount Applied: ${subjectDiscount + siblingDiscount + paymentPlan}%</p>
    <p>Registration Fee: $${registrationFee}</p>
    <p>LMS & Materials Fee: $${lmsFee}</p>
    <p>Deposit: $${deposit}</p>
  `;

  document.getElementById('total').innerHTML = `
    <h3>Total Cost: $${totalCost.toFixed(2)}</h3>
  `;
}
