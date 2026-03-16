import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprofcessing import StandardScaler

data = pd.read_csv("datasets/fraud_detection.csv")
scaler = StandardScaler()

model = IsolationForest(
    n_estimators=200,
    contamination=0.80,
    random_state=42,    
)

model.fit(scaled_data)

def detect_fraud(input_data):
    values = [[
        input_data.income,
        input_data.family_size,
        input_data.previous_claims,
        input_data.benefits_received,
        input_data.loan_default,
        input_data.property_owned,
        input_data.age,
        input_data.aadhar_linked_accounts,
        input_data.phone_linked_accounts,
        input_data.rural_flag,
        input_data.location_changes,
        input_data.application_frequency,
        input_data.same_bank_accounts,
        input_data.ip_application_count
    ]]

    df = pd.DataFrame(values, columns=data.columns)
    scaled_input = scaler.transform(df)
    prediction = model.predict(scaled_input)
    anomaly_score = model.decision_function(scaled_input)[0]
    if prediction[0] == -1:
        status = "fraud_suspected"
    else:
        status = "valid_application"


    return {
        "fraud_status": status,
        "anomaly_score": round(float(anomaly_score),4)
    }
    