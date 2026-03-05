from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pdfplumber
import pandas as pd
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- PDF TEXT EXTRACTION ---------------- #

def extract_text_from_pdf(file):
    text = ""
    with pdfplumber.open(file) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text.lower()


# ---------------- TF-IDF KEYWORDS ---------------- #

def extract_keywords(text, top_n=15):

    text = re.sub(r"[^a-zA-Z\s]", "", text)

    vectorizer = TfidfVectorizer(
        stop_words="english",
        max_features=5000
    )

    tfidf_matrix = vectorizer.fit_transform([text])

    feature_names = vectorizer.get_feature_names_out()
    scores = tfidf_matrix.toarray()[0]

    word_scores = dict(zip(feature_names, scores))

    sorted_words = sorted(
        word_scores.items(),
        key=lambda x: x[1],
        reverse=True
    )[:top_n]

    if not sorted_words:
        return {}

    max_score = sorted_words[0][1]

    normalized = {
        word: round((score / max_score) * 100, 2)
        for word, score in sorted_words
    }

    return normalized


# ---------------- METRICS ---------------- #

def compute_metrics(text):
    words = text.split()
    word_count = len(words)

    reading_time = round(word_count / 200) if word_count > 0 else 0

    unique_words = len(set(words))
    vocab_richness = round(unique_words / word_count, 2) if word_count > 0 else 0

    return {
        "word_count": word_count,
        "reading_time": reading_time,
        "vocab_richness": vocab_richness
    }


# ---------------- SIMILARITY ---------------- #

def compute_similarity(text1, text2):
    vectorizer = TfidfVectorizer(stop_words="english")
    vectors = vectorizer.fit_transform([text1, text2])
    similarity = cosine_similarity(vectors[0:1], vectors[1:2])
    return float(similarity[0][0])

# ---------------- ABSTRACT GENERATOR ---------------- #

def generate_abstract(text):

    original_text = text

    text = text.lower()

    if "abstract" in text:
        text = text.split("abstract", 1)[1]

    sentences = text.split(".")

    clean_sentences = [
        s.strip() for s in sentences
        if len(s.split()) > 6 and "university" not in s and "email" not in s
    ]

    abstract = ". ".join(clean_sentences[:2])

    if abstract:
        abstract = abstract.strip().capitalize() + "."

    return abstract


# ---------------- COMPARE ROUTE ---------------- #

class CompareRequest(BaseModel):
    text1: str
    text2: str

@app.post("/compare")
def compare_papers(request: CompareRequest):
    similarity = compute_similarity(request.text1, request.text2)
    return {"similarity": similarity}


# ---------------- DOMAIN DETECTION ---------------- #

def detect_domain(text):
    text = text.lower()

    domains = {

        "Artificial Intelligence": [
            "neural", "deep learning", "machine learning",
            "model", "training", "dataset", "classification",
            "prediction", "cnn", "rnn"
        ],

        "Computer Networks": [
            "network", "routing", "packet", "bandwidth",
            "protocol", "latency", "tcp", "udp", "communication"
        ],

        "Cyber Security": [
            "attack", "encryption", "malware", "security",
            "threat", "authentication", "intrusion", "firewall"
        ],

        "Data Science": [
            "data", "analysis", "statistics", "regression",
            "visualization", "mining", "clustering"
        ],

        "Software Engineering": [
            "software", "development", "testing",
            "system", "architecture", "design", "requirements"
        ]
    }

    scores = {}

    for domain, keywords in domains.items():
        scores[domain] = sum(text.count(word) for word in keywords)

    detected_domain = max(scores, key=scores.get)

    return detected_domain


# ---------------- UPLOAD ROUTE ---------------- #

@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    text = extract_text_from_pdf(file.file)

    keywords = extract_keywords(text)
    metrics = compute_metrics(text)
    domain = detect_domain(text)
    abstract = generate_abstract(text)

    return {
        "keywords": keywords,
        "metrics": metrics,
        "domain": domain,
        "abstract": abstract,
        "full_text": text
    }