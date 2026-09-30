# Currency Converter Application

A sleek, responsive, modern Currency Converter web application built with HTML, CSS, and JavaScript. It provides real-time foreign currency exchange rates powered by an open live API, flag icons for fast currency identification, input validation, and instant currency swapping.

---

## 🌟 Features

- **Live Exchange Rates:** Fetches up-to-date conversion rates automatically from `https://open.er-api.com`.
- **Wide Currency Support:** Includes popular global currencies like USD, INR, EUR, GBP, JPY, AUD, CAD, CHF, CNY, NZD, SGD, AED, BRL, and ZAR.
- **Flag Icons & Dynamic Symbols:** Displays country flag icons and currency prefixes ($ , ₹, €, £, ¥, etc.) that automatically update when currencies are selected.
- **Swap Currencies:** Instant swap button to switch source and target currencies effortlessly.
- **Rate & Timestamp Display:** Shows exact 1-to-1 exchange rates and the last updated date/time.
- **Robust Input Validation:** Prevents invalid inputs (empty fields, non-numeric values, negative numbers) with helpful error messages.
- **Responsive Modern UI:** Glassmorphism card layout with soft gradients, elegant typography, loading spinners, and mobile-friendly styling.
- **Response Caching:** Caches API requests in memory for 5 minutes to ensure fast user experience and prevent unnecessary rate limits.

---

## 📁 Project Structure

```text
currency-converter/
├── index.html      # HTML5 structure with form controls and card layout
├── style.css       # Modern CSS with flexbox/grid, custom variables, and responsive design
├── script.js       # JS logic for API fetching, calculations, UI updates, and error handling
└── README.md       # Comprehensive documentation and local setup guide
```

---

## 🔑 How the API Works & API Key Setup

### Default Live API
By default, this application uses **ExchangeRate-API Open Endpoint**:
```text
https://open.er-api.com/v6/latest/{BASE_CURRENCY}
```
- **No API key required:** Works out of the box without registration.
- **Free & Reliable:** Updates rates regularly and returns clean JSON data.

### Using an API Key (Optional / Alternate Providers)
If you wish to use an authenticated API provider (e.g. ExchangeRate-API Pro, Fixer.io, or OpenExchangeRates):

1. **Sign up** at your preferred provider (e.g., [ExchangeRate-API](https://www.exchangerate-api.com/)).
2. **Obtain your API Key** from your dashboard.
3. Open `script.js` and locate line 27:
   ```javascript
   const API_BASE_URL = "https://open.er-api.com/v6/latest/";
   ```
4. Replace it with your authenticated endpoint:
   ```javascript
   const API_KEY = "YOUR_ACTUAL_API_KEY";
   const API_BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/`;
   ```

---

## 🚀 How to Run the Project Locally

No build tools or server frameworks are required. You can run the project using any of the following methods:

### Method 1: Open directly in Browser
1. Clone or download this project folder.
2. Double-click `index.html` or right-click `index.html` -> **Open With** -> **Google Chrome** (or any modern web browser).

### Method 2: Python Simple HTTP Server
If you have Python installed, navigate to the project directory in your terminal and run:
```bash
python3 -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

### Method 3: VS Code Live Server Extension
1. Open the project folder in **Visual Studio Code**.
2. Install the **Live Server** extension.
3. Click **"Go Live"** in the bottom status bar or right-click `index.html` and select **"Open with Live Server"**.

---

## 🛠️ Built With

- **HTML5:** Semantic markup and accessibility standards.
- **CSS3:** Custom properties (variables), Grid, Flexbox, media queries, animations.
- **JavaScript (ES6+):** Async/Fetch API, DOM manipulation, event listeners, input debouncing.
- **Font Awesome 6:** Modern interface iconography.
- **Flags API:** High quality flag icons (`https://flagsapi.com`).
