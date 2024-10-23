function calculateFees() {
  const level = document.getElementById('level').value;
  const subjects = parseInt(document.getElementById('subjects').value);
  const siblings = parseInt(document.getElementById('siblings').value);
  const paymentPlan = document.getElementById('paymentPlan').value;

  let baseFees = getBaseFee(level, subjects);
  let bundleDiscount = calculateBundleDiscount(subjects, baseFees);
  let siblingDiscount = calculateSiblingDiscount(siblings, baseFees);
  let paymentPlanDiscount = calculatePaymentPlanDiscount(paymentPlan, baseFees);

  let total = baseFees - bundleDiscount - siblingDiscount - paymentPlanDiscount + 30 + 60 + 50;
  let gst = total * 0.09;
  let finalTotal = total + gst;

  document.getElementById('baseFee').innerText = `$${baseFees}`;
  document.getElementById('bundleDiscount').innerText = `$${bundleDiscount}`;
  document.getElementById('siblingDiscount').innerText = `$${siblingDiscount}`;
  document.getElementById('paymentPlanDiscount').innerText = `$${paymentPlanDiscount}`;
  document.getElementById('gstAmount').innerText = `$${gst.toFixed(2)}`;
  document.getElementById('totalFee').innerText = `$${finalTotal.toFixed(2)}`;

  document.getElementById('feeBreakdown').style.display = 'block';
}

function getBaseFee(level
