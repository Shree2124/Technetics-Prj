import pandas as pd

def detect_fraud(data):
    """
    Detects potential fraud based on a set of rules.
    """
    fraud_score = 0
    reasons = []

    # Rule 1: Unusually high income for certain employment statuses
    if data.employment_status in ['unemployed', 'informal'] and data.income > 150000:
        fraud_score += 0.4
        reasons.append("High income for an unemployed or informal worker.")

    # Rule 2: Mismatched education and income
    if data.education_level == 'primary' and data.income > 200000:
        fraud_score += 0.3
        reasons.append("High income for primary education level.")

    # Rule 3: Multiple applications from the same device/IP (Placeholder)
    # This would require more infrastructure to track IP addresses or device IDs.

    # Rule 4: Inconsistent data (e.g., age and education level)
    # This is a placeholder for more complex validation.

    return {
        "fraud_score": min(1.0, fraud_score),
        "reasons": reasons
    }
