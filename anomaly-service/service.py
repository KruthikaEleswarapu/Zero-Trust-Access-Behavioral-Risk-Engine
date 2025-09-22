from flask import Flask, request, jsonify
import joblib, os
app = Flask(__name__)
MODEL_PATH = os.environ.get('MODEL_PATH', 'if_model.joblib')
if os.path.exists(MODEL_PATH):
    clf = joblib.load(MODEL_PATH)
else:
    clf = None
@app.route('/score', methods=['POST'])
def score():
    data = request.get_json(force=True)
    features = data.get('features', {})
    X = [[features.get('meanInterval',0), features.get('eventCount',0), features.get('uaHash',0), features.get('ipHash',0)]]
    if clf is None:
        # fallback: compute a naive score based on meanInterval deviation
        mean = X[0][0]; score = 0.0 if mean>300 else 0.2 if mean>200 else 0.1 if mean>150 else 0.05
        return jsonify({'score': score})
    pred = clf.decision_function(X)[0]
    # simple mapping: scale to 0..1 risk (inverted)
    risk = 1.0 - ( (pred - clf.offset_) / (1.0 + abs(clf.offset_)) )
    risk = max(0.0, min(1.0, float(risk)))
    return jsonify({'score': risk})
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
