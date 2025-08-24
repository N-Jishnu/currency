// ===== Select DOM elements =====
const dropList = document.querySelectorAll("form select"),
      fromCurrency = document.querySelector(".from select"),
      toCurrency = document.querySelector(".to select"),
      getButton = document.querySelector("form button"),
      exchangeIcon = document.querySelector("form .icon"),
      amountInput = document.querySelector("form input"),
      exchangeRateTxt = document.querySelector("form .exchange-rate");

// ===== Populate dropdowns with currency codes =====
dropList.forEach((select, i) => {
    for (let code in country_list) {
        const isDefaultFrom = i === 0 && code === "USD" ? "selected" : "";
        const isDefaultTo = i === 1 && code === "INR" ? "selected" : "";
        const optionTag = `<option value="${code}" ${isDefaultFrom} ${isDefaultTo}>${code}</option>`;
        select.insertAdjacentHTML("beforeend", optionTag);
    }
    select.addEventListener("change", e => loadFlag(e.target));
});

// ===== Update flag when currency changes =====
function loadFlag(selectElement) {
    const code = selectElement.value;
    if (country_list[code]) {
        const imgTag = selectElement.parentElement.querySelector("img");
        imgTag.src = `https://flagcdn.com/48x36/${country_list[code].toLowerCase()}.png`;
    }
}

// ===== Get Exchange Rate =====
async function getExchangeRate() {
    let amountVal = parseFloat(amountInput.value) || 1;

    // Prevent invalid input
    if (amountVal <= 0) {
        amountVal = 1;
        amountInput.value = 1;
    }

    exchangeRateTxt.innerText = "Getting exchange rate...";

    const apiKey = "b971d25f7628a40bd77a1ae5"; // You may want to keep this in env variables
    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency.value}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("API error");

        const result = await response.json();
        const rate = result?.conversion_rates?.[toCurrency.value];

        if (!rate) {
            exchangeRateTxt.innerText = "Conversion rate unavailable.";
            return;
        }

        const total = (amountVal * rate).toFixed(2);
        exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${total} ${toCurrency.value}`;

    } catch (error) {
        console.error(error);
        exchangeRateTxt.innerText = "Something went wrong. Try again.";
    }
}

// ===== Swap currencies =====
exchangeIcon.addEventListener("click", () => {
    [fromCurrency.value, toCurrency.value] = [toCurrency.value, fromCurrency.value];
    loadFlag(fromCurrency);
    loadFlag(toCurrency);
    getExchangeRate();
});

// ===== On Page Load =====
window.addEventListener("load", () => {
    loadFlag(fromCurrency);
    loadFlag(toCurrency);
    getExchangeRate();
});

// ===== Button Click =====
getButton.addEventListener("click", e => {
    e.preventDefault();
    getExchangeRate();
});

// ===== Input Validation =====
// Auto-update when user types a number
amountInput.addEventListener("input", () => {
    amountInput.value = amountInput.value.replace(/[^0-9.]/g, ""); // only numbers & decimal
});
