import pandas as pd

# Dummy data for schemes - in a real application, this would come from a database
SCHEMES = [
    {
        "id": "scheme_001",
        "name": "Housing Support for Low-Income Families",
        "criteria": {
            "income_max": 60000,
            "family_size_min": 3,
            "housing_type": ["temporary", "rented"]
        }
    },
    {
        "id": "scheme_002",
        "name": "Education Grant for Students",
        "criteria": {
            "education_level": ["primary", "secondary"],
            "income_max": 120000
        }
    },
    {
        "id": "scheme_003",
        "name": "Healthcare Assistance for the Unemployed",
        "criteria": {
            "employment_status": "unemployed",
            "health_condition": 1
        }
    }
]

def get_scheme_recommendations(data):
    """
    Recommends schemes based on citizen data and calculates a matching score.
    """
    recommendations = []

    for scheme in SCHEMES:
        score = 0
        criteria = scheme['criteria']
        num_criteria = len(criteria)

        if 'income_max' in criteria and data.income <= criteria['income_max']:
            score += 1
        if 'family_size_min' in criteria and data.family_size >= criteria['family_size_min']:
            score += 1
        if 'housing_type' in criteria and data.housing_type in criteria['housing_type']:
            score += 1
        if 'education_level' in criteria and data.education_level in criteria['education_level']:
            score += 1
        if 'employment_status' in criteria and data.employment_status == criteria['employment_status']:
            score += 1
        if 'health_condition' in criteria and data.health_condition == criteria['health_condition']:
            score += 1

        if score > 0:
            matching_percentage = (score / num_criteria) * 100
            recommendations.append({
                "scheme_id": scheme['id'],
                "scheme_name": scheme['name'],
                "matching_score": round(matching_percentage, 2)
            })

    # Sort recommendations by matching score
    recommendations.sort(key=lambda x: x['matching_score'], reverse=True)

    return recommendations
