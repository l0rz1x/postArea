from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import re
import nltk
nltk.download('stopwords')
from nltk.corpus import stopwords
import __main__

app = FastAPI(title="Categorical Classification API")
stop_words = set(stopwords.words('english'))
def cleaner(text):
    lowered = text.lower()
    cleaned = re.sub(r'[^a-z\s]', '',lowered)
    split_list = cleaned.split()
    filtered_words = [word for word in split_list if word not in stop_words]
    final_text = " ".join(filtered_words)   
    return final_text

__main__.cleaner = cleaner    
model = joblib.load('categorical-clasiffication-for-postArea.pkl')

class New_text(BaseModel):
    text: str

@app.post("/predict-category")
def makePrediction(request: New_text):
    prediction = model.predict([request.text])[0]
    
    return {
        "category": prediction,
        "message": "predicted succesfuly"
    }