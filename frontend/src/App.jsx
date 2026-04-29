import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [currencies, setCurrencies] = useState([]);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("TND");
  const [amount, setAmount] = useState(1);
  const [result, setResult] = useState(null);
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetch(`${API_URL}/currencies`)
      .then((r) => r.json())
      .then((data) => setCurrencies(data))
      .catch(() => setError("Impossible de charger les devises."));
  }, [API_URL]);

  const handleConvert = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      setError("Veuillez entrer un montant valide.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/convert?from=${from}&to=${to}&amount=${amount}`
      );
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setResult(null);
      } else {
        setResult(data.converted);
        setRate(data.rate);
        setLastUpdated(
          new Date(data.timestamp * 1000).toLocaleString("fr-FR")
        );
      }
    } catch {
      setError("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  const handleSwitch = () => {
    setFrom(to);
    setTo(from);
    setResult(null);
    setRate(null);
    setError("");
  };

  return (
    <div className="app-container">
      <div className="card">
        {/* Header */}
        <div className="header">
          <div className="header-icon">💱</div>
          <h1>Convertisseur de Devises</h1>
          <p className="subtitle">Taux de change en temps réel · 170+ devises</p>
        </div>

        {/* Amount input */}
        <div className="section-label">Montant</div>
        <div className="amount-box">
          <input
            type="number"
            min="0"
            value={amount}
            onChange={(e) => { setAmount(e.target.value); setResult(null); }}
            placeholder="Entrez un montant"
            className="amount-input"
          />
        </div>

        {/* Currency selectors + Switch */}
        <div className="currencies-row">
          <div className="currency-group">
            <div className="section-label">De</div>
            <select
              value={from}
              onChange={(e) => { setFrom(e.target.value); setResult(null); }}
              className="currency-select"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} — {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Switch Button */}
          <button className="switch-btn" onClick={handleSwitch} title="Inverser les devises">
            <span className="switch-icon">⇄</span>
          </button>

          <div className="currency-group">
            <div className="section-label">Vers</div>
            <select
              value={to}
              onChange={(e) => { setTo(e.target.value); setResult(null); }}
              className="currency-select"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} — {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Convert Button */}
        <button
          className="convert-btn"
          onClick={handleConvert}
          disabled={loading}
        >
          {loading ? (
            <span className="spinner">⟳ Conversion en cours...</span>
          ) : (
            "Convertir"
          )}
        </button>

        {/* Error */}
        {error && <div className="error-box">⚠️ {error}</div>}

        {/* Result */}
        {result !== null && !error && (
          <div className="result-box">
            <div className="result-main">
              <span className="result-amount">{parseFloat(amount).toLocaleString("fr-FR")}</span>
              <span className="result-from">{from}</span>
              <span className="result-eq">=</span>
              <span className="result-converted">
                {result.toLocaleString("fr-FR", { maximumFractionDigits: 4 })}
              </span>
              <span className="result-to">{to}</span>
            </div>
            <div className="result-rate">
              Taux : 1 {from} = {rate?.toLocaleString("fr-FR", { maximumFractionDigits: 6 })} {to}
            </div>
            {lastUpdated && (
              <div className="result-time">Mis à jour le {lastUpdated}</div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="footer">
          Données fournies par ExchangeRate-API · Taux indicatifs
        </div>
      </div>
    </div>
  );
}

export default App;
