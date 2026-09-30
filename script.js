/**
 * Currency Converter JavaScript Module
 *
 * Handles API communication with open.er-api.com (free live exchange rates),
 * dynamic currency dropdown population, flag icon updates, conversion calculations,
 * input validation, currency swapping, and responsive user feedback.
 */

// Supported currencies with country codes for flags and currency symbols
const CURRENCIES = [
    { code: "USD", name: "US Dollar", country: "US", symbol: "$" },
    { code: "INR", name: "Indian Rupee", country: "IN", symbol: "₹" },
    { code: "EUR", name: "Euro", country: "EU", symbol: "€" },
    { code: "GBP", name: "British Pound", country: "GB", symbol: "£" },
    { code: "JPY", name: "Japanese Yen", country: "JP", symbol: "¥" },
    { code: "AUD", name: "Australian Dollar", country: "AU", symbol: "A$" },
    { code: "CAD", name: "Canadian Dollar", country: "CA", symbol: "C$" },
    { code: "CHF", name: "Swiss Franc", country: "CH", symbol: "CHF" },
    { code: "CNY", name: "Chinese Yuan", country: "CN", symbol: "¥" },
    { code: "NZD", name: "New Zealand Dollar", country: "NZ", symbol: "NZ$" },
    { code: "SGD", name: "Singapore Dollar", country: "SG", symbol: "S$" },
    { code: "AED", name: "UAE Dirham", country: "AE", symbol: "AED" },
    { code: "BRL", name: "Brazilian Real", country: "BR", symbol: "R$" },
    { code: "ZAR", name: "South African Rand", country: "ZA", symbol: "R" }
];

// Free open API endpoint for live exchange rates
// Note: If you want to use an API key from ExchangeRate-API or Fixer, replace this URL format.
const API_BASE_URL = "https://open.er-api.com/v6/latest/";

// DOM Element References
const amountInput = document.getElementById("amount");
const fromCurrencySelect = document.getElementById("from-currency");
const toCurrencySelect = document.getElementById("to-currency");
const fromFlagImg = document.getElementById("from-flag");
const toFlagImg = document.getElementById("to-flag");
const inputSymbolSpan = document.getElementById("input-symbol");
const swapBtn = document.getElementById("swap-btn");
const convertBtn = document.getElementById("convert-btn");
const btnSpinner = document.getElementById("btn-spinner");
const errorMessage = document.getElementById("error-message");
const errorText = document.getElementById("error-text");

// Result DOM Elements
const convertedResult = document.getElementById("converted-result");
const unitRateText = document.getElementById("unit-rate");
const lastUpdatedText = document.getElementById("last-updated");

// Cache for exchange rate data to minimize network requests
const ratesCache = {};

/**
 * Initialize the application on DOM Content Loaded
 */
document.addEventListener("DOMContentLoaded", () => {
    populateCurrencyDropdowns();
    setupEventListeners();
    // Default initial conversion
    fetchAndConvert();
});

/**
 * Populate From and To currency dropdown options dynamically
 */
function populateCurrencyDropdowns() {
    fromCurrencySelect.innerHTML = "";
    toCurrencySelect.innerHTML = "";

    CURRENCIES.forEach((currency) => {
        const optionFrom = new Option(`${currency.code} - ${currency.name}`, currency.code);
        const optionTo = new Option(`${currency.code} - ${currency.name}`, currency.code);

        fromCurrencySelect.add(optionFrom);
        toCurrencySelect.add(optionTo);
    });

    // Default selections
    fromCurrencySelect.value = "USD";
    toCurrencySelect.value = "INR";

    updateUIElements();
}

/**
 * Setup Event Listeners for form elements, buttons, and inputs
 */
function setupEventListeners() {
    // Currency change handlers
    fromCurrencySelect.addEventListener("change", () => {
        updateUIElements();
        fetchAndConvert();
    });

    toCurrencySelect.addEventListener("change", () => {
        updateUIElements();
        fetchAndConvert();
    });

    // Swap button handler
    swapBtn.addEventListener("click", handleSwapCurrencies);

    // Form submit / Convert button handler
    document.getElementById("converter-form").addEventListener("submit", (e) => {
        e.preventDefault();
        fetchAndConvert();
    });

    // Real-time calculation on input change with subtle debounce
    let debounceTimer;
    amountInput.addEventListener("input", () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            if (validateAmountInput()) {
                fetchAndConvert();
            }
        }, 300);
    });
}

/**
 * Update flag icons and currency symbol prefix based on current selections
 */
function updateUIElements() {
    const fromCode = fromCurrencySelect.value;
    const toCode = toCurrencySelect.value;

    const fromCurrObj = CURRENCIES.find((c) => c.code === fromCode);
    const toCurrObj = CURRENCIES.find((c) => c.code === toCode);

    if (fromCurrObj) {
        fromFlagImg.src = `https://flagsapi.com/${fromCurrObj.country}/flat/64.png`;
        fromFlagImg.alt = `${fromCurrObj.code} Flag`;
        inputSymbolSpan.textContent = fromCurrObj.symbol || "$";
    }

    if (toCurrObj) {
        toFlagImg.src = `https://flagsapi.com/${toCurrObj.country}/flat/64.png`;
        toFlagImg.alt = `${toCurrObj.code} Flag`;
    }
}

/**
 * Handle Swap Currencies functionality
 */
function handleSwapCurrencies() {
    const tempValue = fromCurrencySelect.value;
    fromCurrencySelect.value = toCurrencySelect.value;
    toCurrencySelect.value = tempValue;

    updateUIElements();
    fetchAndConvert();
}

/**
 * Validate user amount input
 * @returns {boolean} Whether input is valid
 */
function validateAmountInput() {
    hideError();
    const rawVal = amountInput.value.trim();

    if (rawVal === "" || isNaN(rawVal)) {
        showError("Please enter a valid numeric amount.");
        return false;
    }

    const amount = parseFloat(rawVal);
    if (amount <= 0) {
        showError("Amount must be greater than zero.");
        return false;
    }

    return true;
}

/**
 * Fetch live exchange rates and calculate conversion
 */
async function fetchAndConvert() {
    if (!validateAmountInput()) {
        return;
    }

    const amount = parseFloat(amountInput.value);
    const fromCode = fromCurrencySelect.value;
    const toCode = toCurrencySelect.value;

    setLoadingState(true);

    try {
        let rates;
        let lastUpdatedFormatted;

        // Check cache (cache valid if fetched within last 5 minutes)
        const now = Date.now();
        if (ratesCache[fromCode] && (now - ratesCache[fromCode].timestamp < 5 * 60 * 1000)) {
            rates = ratesCache[fromCode].rates;
            lastUpdatedFormatted = ratesCache[fromCode].lastUpdatedFormatted;
        } else {
            // Fetch live data from API
            const response = await fetch(`${API_BASE_URL}${fromCode}`);

            if (!response.ok) {
                throw new Error(`API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            if (data.result !== "success") {
                throw new Error("Failed to fetch exchange rates from provider.");
            }

            rates = data.rates;

            // Format update time
            const lastUpdatedDate = data.time_last_update_utc ? new Date(data.time_last_update_utc) : new Date();
            lastUpdatedFormatted = lastUpdatedDate.toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short"
            });

            // Store in cache
            ratesCache[fromCode] = {
                rates: rates,
                timestamp: now,
                lastUpdatedFormatted: lastUpdatedFormatted
            };
        }

        const rate = rates[toCode];
        if (!rate) {
            throw new Error(`Exchange rate for ${toCode} not found.`);
        }

        const convertedVal = amount * rate;

        // Display result
        displayResult(amount, fromCode, convertedVal, toCode, rate, lastUpdatedFormatted);
        hideError();

    } catch (err) {
        console.error("Conversion error:", err);
        showError(err.message || "Unable to fetch live exchange rates. Please check your connection.");
    } finally {
        setLoadingState(false);
    }
}

/**
 * Display formatted conversion result in DOM
 */
function displayResult(amount, fromCode, convertedVal, toCode, unitRate, lastUpdatedTime) {
    const fromCurrObj = CURRENCIES.find((c) => c.code === fromCode);
    const toCurrObj = CURRENCIES.find((c) => c.code === toCode);

    const fromSymbol = fromCurrObj ? fromCurrObj.symbol : "";
    const toSymbol = toCurrObj ? toCurrObj.symbol : "";

    const formattedAmount = amount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    const formattedConvertedVal = convertedVal.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    const formattedUnitRate = unitRate.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4
    });

    convertedResult.innerHTML = `${fromSymbol}${formattedAmount} ${fromCode} = <span class="highlight">${toSymbol}${formattedConvertedVal} ${toCode}</span>`;
    unitRateText.textContent = `1 ${fromCode} = ${formattedUnitRate} ${toCode}`;
    lastUpdatedText.innerHTML = `<i class="fa-regular fa-clock"></i> Updated: ${lastUpdatedTime}`;
}

/**
 * Set visual loading state for submit button and spinners
 */
function setLoadingState(isLoading) {
    if (isLoading) {
        convertBtn.disabled = true;
        btnSpinner.classList.remove("hidden");
    } else {
        convertBtn.disabled = false;
        btnSpinner.classList.add("hidden");
    }
}

/**
 * Show error banner with message
 */
function showError(msg) {
    errorText.textContent = msg;
    errorMessage.classList.remove("hidden");
}

/**
 * Hide error banner
 */
function hideError() {
    errorMessage.classList.add("hidden");
}
