const dropList = document.querySelectorAll("form select");
const fromCurrency = document.querySelector(".from select");
const toCurrency = document.querySelector(".to select");
const getButton = document.querySelector("form button");
const exchangeIcon = document.querySelector("form .icon");

function loadSelect() {
  for (let i = 0; i < dropList.length; i++) {
    for (let currency_code in country_list) {
      let selected;

      if (i === 0) {
        if (currency_code === "USD") {
          selected = "selected";
        } else {
          selected = "";
        }
      } else {
        if (currency_code === "INR") {
          selected = "selected";
        } else {
          selected = "";
        }
      }

      let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
      dropList[i].insertAdjacentHTML("beforeend", optionTag);
    }
    dropList[i].addEventListener("change", (e) => {
      loadFlag(e.target);
    });
  }
}

function loadFlag(element) {
  for (let country in country_list) {
    if (country == element.value) {
      let imgTag = element.parentElement.querySelector("img");
      imgTag.src = `https://flagcdn.com/48x36/${country_list[
        country
      ].toLowerCase()}.png`;
    }
  }
}

async function getExchangeRate() {
  const amount = document.querySelector("form input");
  const exchangeTxt = document.querySelector("form .exchange-rate");
  let amountVal = amount.value;

  if (amountVal == "" || amountVal == "0") {
    amount.value = "1";
    amountVal = 1;
  }
  exchangeTxt.innerText = "Getting exchange rate...";

  try {
    let url = `https://v6.exchangerate-api.com/v6/b971d25f7628a40bd77a1ae5/pair/${fromCurrency.value}/${toCurrency.value}/${amountVal}`;
    data = await fetch(url);
    response = await data.json();

    let totalRate = response.conversion_result.toFixed(2); // round to 2 places
    exchangeTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalRate} ${toCurrency.value}`;
  } 
  catch (e) {
    exchangeTxt.innerText = "Something went wrong";
  }
}

loadSelect();

window.addEventListener("load", () => {
  getExchangeRate();
});

getButton.addEventListener("click", (e) => {
  e.preventDefault(); // so the form doesn't submit
  getExchangeRate();
});

exchangeIcon.addEventListener("click", () => {
  let tempCode = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = tempCode;
  loadFlag(fromCurrency);
  loadFlag(toCurrency);
  getExchangeRate();
});

// .
