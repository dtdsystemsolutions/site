function validateMobileNumber(number) {
  const regex = /^09\d{9}$/;
  return regex.test(number);
}

function sanitizeInput(input) {
  return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById('subscribe-form');
  const confirmBtn = document.getElementById('confirm-button');
  const mobileNumberInput = document.getElementById('mobileNumber');

  // Load plan summary
  const plans = {
    starter: {
      name: "💼 Starter Plan",
      price: 500,
      billing: "Weekly",
      features: ["✔ Basic feature access",
        "✔ Small custom modifications",
        "✖ Email support",
        "✖ Access to regular updates",
        "✖ Custom external tool integration"]
    },
    pro: {
      name: "🚀 Pro Plan",
      price: 1500,
      billing: "Monthly",
      features: ["✔ Basic feature access",
        "✔ Monthly billing",
        "✔ Basic custom modifications",
        "✔ Basic email support",
        "✔ Access to regular updates",
        "✖ Custom external tool integration"]
    },
    elite: {
      name: "⚙️ Elite Plan",
      price: 2500,
      billing: "Monthly",
      features: ["✔ Advance feature access",
        "✔ Monthly billing",
        "✔ Monthly custom modifications",
        "✔ Priority support",
        "✔ Access to regular updates",
        "✔ Custom external tool integration"]
    },
    lifetime: {
      name: "🏆 Lifetime Plan",
      price: 5,
      billing: "One-time",
      features: ["✔ Full feature access",
        "✔ Lifetime access",
        "✔ 1 advance modifications",
        "✔ VIP support",
        "✔ Access to regular updates",
        "✔ Any external tool integration",
        "✔ Custom branding support"]
    }
  };

  const params = new URLSearchParams(window.location.search);
  const selectedPlanKey = params.get("plan");
  const summaryDiv = document.getElementById("plan-summary");
  const amountInput = document.getElementById("amount");

  if (selectedPlanKey && plans[selectedPlanKey]) {
    const plan = plans[selectedPlanKey];
    summaryDiv.innerHTML = `
      <strong>Plan:</strong> ${plan.name}<br/>
      <strong>Billing:</strong> ${plan.billing}<br/>
      <strong>Amount to Pay:</strong> ₱${plan.price.toLocaleString()}<br/><br/>
      <strong>Included Features:</strong>
      <ul>${plan.features.map(f => `<li>${f}</li>`).join("")}</ul>
    `;
    amountInput.value = plan.price;
  } else {
    summaryDiv.innerHTML = `<p style="color: red;">Invalid plan selected. Please go back and choose a valid plan.</p>`;
  }

  // Handle confirm button
  confirmBtn.addEventListener('click', () => {
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const mobileNumber = sanitizeInput(mobileNumberInput.value.trim());

    if (!validateMobileNumber(mobileNumber)) {
      mobileNumberInput.classList.add('is-invalid');
      alert("Invalid mobile number format. It should start with 09 and be 11 digits.");
      return;
    }

    mobileNumberInput.classList.remove('is-invalid');

    // Prepare form data for submission
    const formData = new FormData(form);
    formData.append('_subject', `Potential Subscription for ${plans[selectedPlanKey].name}`);

    // Submit form data via fetch
    fetch("https://formsubmit.co/ajax/dtdsystemsolutions@gmail.com", {
      method: "POST",
      body: formData
    })
      .then(response => {
        if (!response.ok) throw new Error("Form submission failed.");
        return response.json();
      })
      .then(data => {
        console.log("Form submitted:", data);

        // Now redirect to payment URL
        const amount = amountInput.value;
        const token = document.getElementById('token-value').value;
        const url = `https://s2.klinternetservices.com/xendit/payment?number=${encodeURIComponent(mobileNumber)}&amount=${encodeURIComponent(amount)}&token=${encodeURIComponent(token)}`;

        window.location.href = url;
      })
      .catch(error => {
        console.error("Error submitting form:", error);
        alert("There was a problem submitting your details. Please try again.");
      });
  });
});