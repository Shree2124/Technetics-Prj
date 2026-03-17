from app.db import get_db

def get_scheme_recommendations(data):
    """
    Recommends schemes based on citizen data from the database.
    """
    db = get_db()
    schemes = list(db.schemes.find({"active": True}))
    recommendations = []

    for scheme in schemes:
        score = 0
        eligibility = scheme.get('eligibility', {})
        num_criteria = len(eligibility)

        if num_criteria == 0: continue

        # Simple matching logic based on schema
        if 'maxIncome' in eligibility and data.income <= eligibility['maxIncome']:
            score += 1
        if 'minFamilySize' in eligibility and data.family_size >= eligibility['minFamilySize']:
            score += 1
        
        # Placeholder for more complex criteria matching if added to the schema
        # e.g., if 'employment_status' in eligibility and data.employment_status in eligibility['employment_status']:
        #     score += 1

        if score > 0:
            matching_percentage = (score / num_criteria) * 100
            recommendations.append({
                "scheme_id": str(scheme['_id']),
                "scheme_name": scheme['schemeName'],
                "description": scheme['description'],
                "matching_score": round(matching_percentage, 2)
            })

    recommendations.sort(key=lambda x: x['matching_score'], reverse=True)
    return recommendations
