import React, { useState, useEffect } from "react";
import "./index.css";

const API_URL = "https://api.exchangerate-api.com/v4/latest";
function App() {  
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("EUR");
  const [toCurrency, setToCurrency] = useState("USD");
  const [amount, setAmount] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
  async function getCurrencies() {
    try {
      const res = await fetch(`${API_URL}/${fromCurrency}`);
      const data = await res.json();
      setCurrencies(Object.keys(data.rates));
    } catch {
      setError("Failed to fetch currencies");
    }
  }

  getCurrencies();
}, [fromCurrency]);

  async function handleConvert() {
  if (!amount || amount <= 0) {
    setError("Amount must be greater than zero");
    return;
  }

  setError(null);
  setIsLoading(true);
  setConvertedAmount(null);

  try {
    const res = await fetch(`${API_URL}/${fromCurrency}`);
    const data = await res.json();
    const rate = data.rates[toCurrency];
    setConvertedAmount(Number(amount) * rate);
  } catch {
    setError("Failed to convert currencies");
  } finally {
    setIsLoading(false);
  }
}

  return (
    <div className="app">
      <h1>Currency Exchange Calculator</h1>

      <div className="converter-container">
        {error && <p className="error">{error}</p>}

        <div className="input-group">

          <input
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))} 
            type="number"
            placeholder="Amount"
            className="input-field"
          />


          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)} 
            className="dropdown"
          >
            {currencies.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <span className="arrow">→</span>


          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)} 
            className="dropdown"
          >
            {currencies.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <button className="convert-button" onClick={handleConvert}>
          Convert
        </button>

        {isLoading && <p className="loading">Converting...</p>}

        {convertedAmount !== null && !isLoading && (
          <p className="result">
            {amount} {fromCurrency} = {convertedAmount.toFixed(2)} {toCurrency}
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
