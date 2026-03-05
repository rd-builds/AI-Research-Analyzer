# AI-Powered Research Paper Analyzer

A full-stack web application that analyzes research papers using Natural Language Processing (NLP) techniques.

The system allows users to upload research papers (PDF format) and automatically extract structured insights such as keyword importance, document metrics, and similarity comparison between two papers.

---

## Project Overview

With the rapid growth of academic publications, manually reading and comparing research papers is time-consuming and inefficient.

This project provides an automated analytical tool that:

* Extracts text from uploaded PDFs
* Identifies important keywords using TF-IDF
* Computes document-level metrics
* Measures similarity between two research papers
* Displays results in an interactive dashboard

---

## Tech Stack

### Backend

* FastAPI
* Pandas
* NumPy
* Scikit-learn (TF-IDF and Cosine Similarity)
* PDFPlumber

### Frontend

* React.js
* Axios
* CSS (Custom Styling)
* Dark and Light Mode Interface

---

## Core Features

### 1. PDF Upload and Text Extraction

* Upload research papers in PDF format
* Automatically extracts full textual content

### 2. Keyword Importance (TF-IDF)

* Removes stopwords
* Computes TF-IDF scores
* Displays keyword importance using visual bar charts

### 3. Document Metrics

* Word Count
* Estimated Reading Time
* Vocabulary Diversity (Unique word ratio)

### 4. Paper-to-Paper Similarity

* Uses TF-IDF vectorization
* Computes Cosine Similarity
* Classifies research similarity level:

  * Highly Similar
  * Moderately Related
  * Different Research Areas

### 5. Interactive Dashboard

* Sidebar navigation (Upload / Analysis / Compare)
* Metric cards display
* Keyword visualization
* Dark and Light mode toggle

---

## Installation and Setup Instructions

### Prerequisites

Ensure you have installed:

* Python (3.9 or higher)
* Node.js (v18 or higher)
* Git

---

## Step 1: Clone the Repository

git clone <your-repository-link>
cd AI-Research-Analyzer

---

## Step 2: Setup Backend

cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

Start the backend server:

uvicorn main:app --host 127.0.0.1 --port 8000

Backend runs at:

[http://127.0.0.1:8000](http://127.0.0.1:8000)

API documentation available at:

[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## Step 3: Setup Frontend

Open a new terminal:

cd frontend
npm install
npm start

Frontend runs at:

[http://localhost:3000](http://localhost:3000)

---

## How to Run the Application

1. Start the backend server.
2. Start the frontend server.
3. Open [http://localhost:3000](http://localhost:3000) in your browser.
4. Upload Paper 1.
5. Upload Paper 2 (optional for comparison).
6. View analysis metrics and keyword importance.
7. Use the Compare section to calculate similarity.

---

## Similarity Calculation

Similarity between two papers is calculated using:

* TF-IDF Vectorization
* Cosine Similarity

Cosine Similarity Formula:

Cosine Similarity = (A · B) / (||A|| ||B||)

Score Range:

* 0 → Completely different
* 1 → Identical research focus

---

## Project Structure

AI-Research-Analyzer/
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│
├── README.md

---

## Future Improvements

* Advanced topic modeling
* Citation pattern visualization
* Multi-paper clustering
* Export analysis results as PDF

---

## Author

Developed as an academic project demonstrating:

* Full-stack development
* NLP-based document analysis
* Backend–Frontend integration
* Data visualization

---

## License

This project is developed for educational purposes.
