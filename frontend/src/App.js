import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [paper1, setPaper1] = useState(null);
  const [paper2, setPaper2] = useState(null);
  const [data1, setData1] = useState(null);
  const [data2, setData2] = useState(null);
  const [similarity, setSimilarity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [activeSection, setActiveSection] = useState("upload");
  const [analysisView, setAnalysisView] = useState("paper1");

  // ---------------- UPLOAD ----------------
  const uploadPaper = async (file, setData) => {
    if (!file) return alert("Select file first");

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/upload",
        formData
      );
      setData(response.data);
    } catch {
      alert("Upload failed");
    }

    setLoading(false);
  };

  // ---------------- SIMILARITY ----------------
  const calculateSimilarity = async () => {
    if (!data1 || !data2) {
      alert("Upload both papers first");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/compare",
        {
          text1: data1.full_text,
          text2: data2.full_text,
        }
      );

      setSimilarity(response.data.similarity);
    } catch {
      alert("Similarity calculation failed");
    }
  };

  const currentData =
    analysisView === "paper1" ? data1 : data2;

  const barColorsDark = [
    "linear-gradient(90deg,#6366F1,#8B5CF6)",
    "linear-gradient(90deg,#22D3EE,#0EA5E9)",
    "linear-gradient(90deg,#F59E0B,#FBBF24)",
    "linear-gradient(90deg,#EC4899,#F472B6)",
    "linear-gradient(90deg,#10B981,#34D399)",
  ];

  const barColorsLight = [
    "linear-gradient(90deg,#818CF8,#A5B4FC)",
    "linear-gradient(90deg,#67E8F9,#93C5FD)",
    "linear-gradient(90deg,#FCD34D,#FDE68A)",
    "linear-gradient(90deg,#F9A8D4,#FBCFE8)",
    "linear-gradient(90deg,#6EE7B7,#A7F3D0)",
  ];

  const getInterpretation = () => {
    if (similarity === null) return "Not calculated";
    if (similarity > 0.8) return "Highly Similar Research Focus";
    if (similarity > 0.5) return "Moderately Related Topics";
    return "Different Research Areas";
  };

  const generateSummary = (data) => {
    if (!data || !data.keywords) return "";
    const topKeywords = Object.keys(data.keywords).slice(0, 3);
    return `This paper primarily focuses on ${topKeywords.join(", ")}.`;
  };

  return (
    <div className={darkMode ? "layout dark" : "layout light"}>

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>PaperLab</h2>

        <div className="menu">
          <div
            className={`menu-item ${activeSection === "upload" ? "active" : ""}`}
            onClick={() => setActiveSection("upload")}
          >
            Upload Papers
          </div>

          <div
            className={`menu-item ${activeSection === "analysis" ? "active" : ""}`}
            onClick={() => setActiveSection("analysis")}
          >
            Analysis Dashboard
          </div>

          <div
            className={`menu-item ${activeSection === "summary" ? "active" : ""}`}
            onClick={() => setActiveSection("summary")}
          >
            AI Insights
          </div>

          <div
            className={`menu-item ${activeSection === "compare" ? "active" : ""}`}
            onClick={() => setActiveSection("compare")}
          >
            Compare Papers
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="main">

        <div style={{ textAlign: "right", marginBottom: "20px" }}>
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        {/* ================= UPLOAD ================= */}
        {activeSection === "upload" && (
          <div className="keywords-box">
            <h2>Upload Papers</h2>

            <input type="file" onChange={(e) => setPaper1(e.target.files[0])} />
            <button onClick={() => uploadPaper(paper1, setData1)}>
              Upload Paper 1
            </button>

            <br /><br />

            <input type="file" onChange={(e) => setPaper2(e.target.files[0])} />
            <button onClick={() => uploadPaper(paper2, setData2)}>
              Upload Paper 2
            </button>

            {loading && <p>Processing...</p>}
          </div>
        )}

        {/* ================= ANALYSIS ================= */}
        {activeSection === "analysis" && currentData && (
          <>
            <div style={{ marginBottom: "20px" }}>
              <button onClick={() => setAnalysisView("paper1")}>
                View Paper 1
              </button>

              <button
                onClick={() => setAnalysisView("paper2")}
                style={{ marginLeft: "10px" }}
              >
                View Paper 2
              </button>
            </div>

            {/* METRIC CARDS */}
            {currentData.metrics && (
              <div className="metrics-container">

                <div className="metric-card">
                  <h4>Word Count</h4>
                  <h2>{currentData.metrics.word_count}</h2>
                </div>

                <div className="metric-card">
                  <h4>Reading Time</h4>
                  <h2>{currentData.metrics.reading_time} mins</h2>
                </div>

                <div className="metric-card">
                  <h4>Vocabulary Diversity</h4>
                  <h2>
                    {(currentData.metrics.vocab_richness * 100).toFixed(0)}%
                  </h2>
                </div>

              </div>
            )}

            {/* KEYWORD BARS */}
            <div className="keywords-box">
              <h2>Keyword Importance (TF-IDF)</h2>

              {Object.entries(currentData.keywords).map(
                ([word, score], index) => {
                  const colors = darkMode
                    ? barColorsDark
                    : barColorsLight;

                  return (
                    <div className="bar-row" key={word}>
                      <span className="word">{word}</span>
                      <div className="bar">
                        <div
                          className="bar-fill"
                          style={{
                            width: `${score}%`,
                            background:
                              colors[index % colors.length],
                          }}
                        ></div>
                      </div>
                      <span>{score}</span>
                    </div>
                  );
                }
              )}
            </div>
          </>
        )}

        {/* ================= SUMMARY ================= */}
        {activeSection === "summary" && currentData && (
          <div className="keywords-box">

            <h2>AI Insights</h2>

            <h3>Detected Research Domain</h3>
            <p style={{ fontSize: "22px", fontWeight: "bold" }}>
              {currentData.domain}
            </p>

            <br />

            <h3>Generated Abstract</h3>
            <p style={{
              lineHeight: "1.8",
              fontSize: "16px",
              padding: "10px",
              background: darkMode ? "#1f2937" : "#f3f4f6",
              borderRadius: "8px"
            }}>
              {currentData.abstract}
            </p>

          </div>
        )}

        {/* ================= COMPARE ================= */}
        {activeSection === "compare" && data1 && data2 && (
          <div className="keywords-box">
            <h2>Comparison Results</h2>

            <button onClick={calculateSimilarity}>
              Calculate Similarity
            </button>

            <h3>
              Similarity Score:{" "}
              {similarity !== null
                ? similarity.toFixed(2)
                : "Not calculated"}
            </h3>

            <p style={{ fontWeight: "bold" }}>
              {getInterpretation()}
            </p>

            <br />

            <h4>Paper 1 Summary</h4>
            <p>{generateSummary(data1)}</p>

            <h4>Paper 2 Summary</h4>
            <p>{generateSummary(data2)}</p>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;