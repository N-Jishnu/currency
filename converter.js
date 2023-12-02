// Selecting all dropdown lists, 'from' and 'to' currency dropdowns, and the submit button
const dropList = document.querySelectorAll("form select"),
    fromCurrency = document.querySelector(".from select"),
    toCurrency = document.querySelector(".to select"),
    getButton = document.querySelector("form button");

// Loop through each dropdown list
for (let i=0;i<dropList.length;i++){
    // Loop through each currency code in the country_list object
    for (let currency_code in country_list){
        // Determine if the current option should be selected based on the currency code
        let selectedFrom=i==0 && currency_code=="USD"?"selected" : "";
        let selectedTo = i == 1 && currency_code == "INR" ? "selected" : ""; //condition ? expression_if_true : expression_if_false;

        // Create an option tag with the currency code and append it to the current dropdown list
        let optionTag = `<option value="${currency_code}" ${selectedFrom} ${selectedTo}>${currency_code}</option>`;
        dropList[i].insertAdjacentHTML("beforeend", optionTag);
    }

    // Add an event listener to each dropdown list to load the flag when the selection changes
    dropList[i].addEventListener("change", e => {
        loadFlag(e.target);
    });
}

// Function to load the flag image based on the selected currency code
function loadFlag(element) {
    for (let code in country_list) {
        if (code == element.value) {
            let imgTag = element.parentElement.querySelector("img");
            imgTag.src = `https://flagcdn.com/48x36/${country_list[code].toLowerCase()}.png`;
        }
    }
}

// Event listener for the window load event to get the exchange rate
window.addEventListener("load", () => {
    // Set the default values for "from" and "to" dropdowns
    fromCurrency.value = "USD";
    toCurrency.value = "INR";

    // Load flags and get exchange rate for the default values
    loadFlag(fromCurrency);
    loadFlag(toCurrency);
    getExchangeRate();
});

// Event listener for the form submission to get the exchange rate
getButton.addEventListener("click",e=>{
    e.preventDefault();
    getExchangeRate(); //clarity needed.
});

// Selecting the exchange icon and adding an event listener to swap 'from' and 'to' currencies
const exchangeIcon = document.querySelector("form .icon");
exchangeIcon.addEventListener("click", () => {
    let tempCode = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = tempCode;
    loadFlag(fromCurrency);
    loadFlag(toCurrency);
    getExchangeRate();
});

// Function to get the exchange rate using an API
function getExchangeRate() {
    // Selecting the amount input and exchange rate display elements
    const amount = document.querySelector("form input");
    const exchangeRateTxt = document.querySelector("form .exchange-rate");
    
    // Retrieving the amount value from the input
    let amountVal = amount.value;
    
    // Handling the case where the amount is empty or 0
    if (amountVal==""||amountVal=="0"){
        amount.value = "1";
        amountVal = 1;
    }
    
    // Displaying a message while fetching the exchange rate
    exchangeRateTxt.innerText = "Getting exchange rate...";
    
    // Constructing the API URL for fetching the exchange rate
    let url = `https://v6.exchangerate-api.com/v6/ba667f723705e61cd68bb00b/latest/${fromCurrency.value}`;
    
    // Fetching the exchange rate from the API
    fetch(url)
        .then(response=>response.json())
        .then(result => {
            // Extracting the exchange rate for the 'to' currency
            let exchangeRate=result.conversion_rates[toCurrency.value];
            
            // Calculating the total exchange rate and displaying it
            let totalExRate=(amountVal*exchangeRate).toFixed(2);
            exchangeRateTxt.innerText=`${amountVal}${fromCurrency.value}=${totalExRate}${toCurrency.value}`;
        })
        .catch(()=>{
            // Handling errors by displaying an error message
            exchangeRateTxt.innerText="Something went wrong";
        });
}