# emotion-service/app.py
# This microservice attempts to use TensorFlow if available and a model file exists.
# If not, it falls back to a lightweight random-emotion predictor so the demo runs without TF.

from flask import Flask, request, jsonify
import os, sys
import numpy as np
import base64
from io import BytesIO
from PIL import Image
import random

MODEL_PATH = os.environ.get('MODEL_PATH', './model.h5')
labels = ['angry','disgust','fear','happy','sad','surprise','neutral']

app = Flask(__name__)

tf_available = False
try:
    from tensorflow.keras.models import load_model
    tf_available = True
except Exception as e:
    print('TensorFlow not available or not installed; using fallback. Error:', e, file=sys.stderr)
    tf_available = False

model = None
if tf_available and os.path.exists(MODEL_PATH):
    try:
        model = load_model(MODEL_PATH)
        print('Loaded TF model from', MODEL_PATH)
    except Exception as e:
        print('Failed to load model, fallback will be used. Error:', e, file=sys.stderr)
        model = None
else:
    print('No model found or TF not available. Running in fallback mode.')

def preprocess_image_bytes(img_bytes):
    img = Image.open(BytesIO(img_bytes)).convert('L')
    img = img.resize((48,48))
    arr = np.array(img).astype('float32') / 255.0
    arr = arr.reshape((1,48,48,1))
    return arr

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json(force=True)
    if not data or 'image' not in data:
        return jsonify({'error': 'no image submitted'}), 400
    b64 = data['image']
    if b64.startswith('data:'):
        b64 = b64.split(',')[1]
    try:
        img_bytes = base64.b64decode(b64)
    except Exception as e:
        return jsonify({'error':'invalid base64 image', 'details': str(e)}), 400

    if model is not None:
        arr = preprocess_image_bytes(img_bytes)
        preds = model.predict(arr)
        idx = int(np.argmax(preds))
        return jsonify({'emotion': labels[idx], 'confidence': float(np.max(preds)), 'probs': preds.tolist()})
    else:
        # fallback: simple heuristic + randomness for demo
        # compute average brightness to bias toward 'happy' if bright, 'sad' if dark
        img = Image.open(BytesIO(img_bytes)).convert('L').resize((48,48))
        mean = np.array(img).mean()
        # pick probabilities
        probs = np.ones(len(labels)) * 0.05
        if mean > 120:
            probs[3] += 0.6  # happy
        else:
            probs[4] += 0.6  # sad
        probs = probs / probs.sum()
        idx = int(np.argmax(probs))
        confidence = float(probs[idx])
        return jsonify({'emotion': labels[idx], 'confidence': confidence, 'probs': probs.tolist(), 'note':'fallback-no-tf'})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port)
