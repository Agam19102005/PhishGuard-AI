import { useState } from "react";
import axios from "axios";
import {
  ShieldCheck,
  ShieldAlert,
  Search,
  Link2,
  Lock,
  AlertTriangle,
  CheckCircle2,
  Activity,
  ExternalLink,
  RotateCcw,
} from "lucide-react";

function App() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeWebsite = async () => {
    setError("");
    setResult(null);

    if (!url.trim()) {
      setError("Please enter a website URL.");
      return;
    }

    let formattedUrl = url.trim();

    // Add HTTPS when the user enters only a domain
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = `https://${formattedUrl}`;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/predict",
        {
          url: formattedUrl,
        }
      );

      setResult(response.data);
    } catch (err) {
      console.error(err);

      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError(
          "Unable to connect to the detection server. Make sure FastAPI is running."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      analyzeWebsite();
    }
  };

  const resetScan = () => {
    setUrl("");
    setResult(null);
    setError("");
  };

  const isPhishing = result?.prediction === "PHISHING";

  return (
    <div className="app">
      {/* Background decorations */}
      <div className="background-glow glow-one"></div>
      <div className="background-glow glow-two"></div>

      {/* Navigation */}
      <nav className="navbar">
        <div className="brand">
          <div className="brand-icon">
            <ShieldCheck size={24} />
          </div>

          <div>
            <div className="brand-name">PhishGuard AI</div>
            <div className="brand-subtitle">Website Security Scanner</div>
          </div>
        </div>

        <div className="nav-status">
          <span className="status-dot"></span>
          AI Engine Online
        </div>
      </nav>

      {/* Main */}
      <main className="main-container">

        {/* Hero */}
        <section className="hero">
          <div className="security-badge">
            <ShieldCheck size={16} />
            AI-POWERED SECURITY
          </div>

          <h1>
            Detect <span>Fake Websites</span>
            <br />
            Before They Trick You
          </h1>

          <p>
            Analyze a website URL using an AI-powered phishing detection model
            and instantly understand its security risk.
          </p>
        </section>

        {/* Scanner */}
        <section className="scanner-card">

          <div className="scanner-header">
            <div>
              <h2>Scan a Website</h2>
              <p>Enter the URL you want to analyze.</p>
            </div>

            <div className="scanner-icon">
              <Search size={22} />
            </div>
          </div>

          <div className="url-input-wrapper">
            <Link2 size={20} className="input-icon" />

            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="https://example.com"
              disabled={loading}
            />

            <button
              className="scan-button"
              onClick={analyzeWebsite}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Scanning...
                </>
              ) : (
                <>
                  <Search size={18} />
                  Scan Website
                </>
              )}
            </button>
          </div>

          <div className="scanner-hint">
            <Lock size={14} />
            Your URL is analyzed by our phishing detection engine.
          </div>

          {error && (
            <div className="error-box">
              <AlertTriangle size={18} />
              <span>{error}</span>
            </div>
          )}
        </section>

        {/* Loading */}
        {loading && (
          <section className="loading-card">
            <div className="loading-animation">
              <Activity size={28} />
            </div>

            <h3>Analyzing Website...</h3>

            <p>
              Our AI model is evaluating the URL for phishing indicators.
            </p>

            <div className="loading-bar">
              <div></div>
            </div>
          </section>
        )}

        {/* Result */}
        {result && !loading && (
          <section className="result-section">

            <div
              className={`result-banner ${
                isPhishing ? "danger-result" : "safe-result"
              }`}
            >
              <div className="result-icon">
                {isPhishing ? (
                  <ShieldAlert size={34} />
                ) : (
                  <ShieldCheck size={34} />
                )}
              </div>

              <div className="result-main">
                <div className="result-label">
                  {isPhishing ? "THREAT DETECTED" : "WEBSITE APPEARS SAFE"}
                </div>

                <h2>{result.prediction}</h2>

                <p>{result.url}</p>
              </div>

              <div className="risk-badge">
                {result.risk} RISK
              </div>
            </div>

            {/* Statistics */}
            <div className="stats-grid">

              <div className="stat-card">
                <div className="stat-icon phishing-icon">
                  <ShieldAlert size={20} />
                </div>

                <div className="stat-content">
                  <span>Phishing Probability</span>
                  <strong>{result.phishing_probability}%</strong>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon legitimate-icon">
                  <CheckCircle2 size={20} />
                </div>

                <div className="stat-content">
                  <span>Legitimate Probability</span>
                  <strong>{result.legitimate_probability}%</strong>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon activity-icon">
                  <Activity size={20} />
                </div>

                <div className="stat-content">
                  <span>AI Classification</span>
                  <strong>{result.risk}</strong>
                </div>
              </div>

            </div>

            {/* Analysis */}
            <div className="analysis-card">

              <div className="analysis-header">
                <div>
                  <h3>AI Security Analysis</h3>
                  <p>Prediction generated by the PhishGuard AI model.</p>
                </div>

                <div className="model-badge">
                  ONNX MODEL
                </div>
              </div>

              <div className="analysis-items">

                <div className="analysis-item">
                  <CheckCircle2 size={19} />
                  <div>
                    <strong>URL successfully analyzed</strong>
                    <span>The submitted URL was processed by the AI engine.</span>
                  </div>
                </div>

                <div className="analysis-item">
                  {isPhishing ? (
                    <AlertTriangle size={19} />
                  ) : (
                    <CheckCircle2 size={19} />
                  )}

                  <div>
                    <strong>
                      {isPhishing
                        ? "Potential phishing characteristics detected"
                        : "No strong phishing classification detected"}
                    </strong>

                    <span>
                      The machine-learning model classified this URL as{" "}
                      <b>{result.prediction.toLowerCase()}</b>.
                    </span>
                  </div>
                </div>

                <div className="analysis-item">
                  <Activity size={19} />

                  <div>
                    <strong>Model confidence</strong>

                    <span>
                      Legitimate: {result.legitimate_probability}% ·
                      Phishing: {result.phishing_probability}%
                    </span>
                  </div>
                </div>

              </div>

              <div className="result-actions">
                <button className="secondary-button" onClick={resetScan}>
                  <RotateCcw size={17} />
                  Scan Another URL
                </button>

                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="secondary-button"
                >
                  <ExternalLink size={17} />
                  Open Website
                </a>
              </div>

            </div>

          </section>
        )}

        {/* Features */}
        {!result && !loading && (
          <section className="features">

            <div className="feature-card">
              <div className="feature-icon">
                <ShieldCheck size={22} />
              </div>

              <h3>AI Detection</h3>

              <p>
                Uses a pre-trained machine-learning model to classify
                potentially malicious URLs.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Activity size={22} />
              </div>

              <h3>Instant Analysis</h3>

              <p>
                Get a prediction and probability score within seconds.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <AlertTriangle size={22} />
              </div>

              <h3>Risk Assessment</h3>

              <p>
                Understand whether the submitted website presents a low,
                medium, or high phishing risk.
              </p>
            </div>

          </section>
        )}

        {/* Footer */}
        <footer>
          <div>
            <ShieldCheck size={16} />
            PhishGuard AI
          </div>

          <span>
            AI-based phishing URL detection · Educational Project
          </span>
        </footer>

      </main>
    </div>
  );
}

export default App;