# Train a tiny IsolationForest model on synthetic data.
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
import joblib
rng = np.random.RandomState(42)
N = 500
meanInterval = rng.normal(loc=120, scale=30, size=N)
eventCount = rng.poisson(lam=20, size=N)
uaHash = rng.randint(0,100,size=N)
ipHash = rng.randint(0,100,size=N)
X = pd.DataFrame({ 'meanInterval': meanInterval, 'eventCount': eventCount, 'uaHash': uaHash, 'ipHash': ipHash })
clf = IsolationForest(contamination=0.01, random_state=42)
clf.fit(X)
joblib.dump(clf, 'if_model.joblib')
print('model trained')