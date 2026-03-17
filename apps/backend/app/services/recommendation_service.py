from app.db import get_db

def get_scheme_recommendations(citizen_profile):
    """
    Recommends schemes based on a strict rule-based eligibility check.
    A citizen must meet all criteria to be eligible.
    """
    db = get_db()
    schemes = list(db.schemes.find({"active": True}))
    recommendations = []

    for scheme in schemes:
        is_eligible = True
        eligibility_criteria = scheme.get('eligibility', {})

        if not eligibility_criteria: 
            continue

        # Age check
        if 'minAge' in eligibility_criteria and citizen_profile.get('age', 0) < eligibility_criteria['minAge']:
            is_eligible = False
        if 'maxAge' in eligibility_criteria and citizen_profile.get('age', 100) > eligibility_criteria['maxAge']:
            is_eligible = False
        
        # Income check
        if 'maxIncome' in eligibility_criteria and citizen_profile.get('income', float('inf')) > eligibility_criteria['maxIncome']:
            is_eligible = False

        # Rural check
        if eligibility_criteria.get('ruralOnly') and not citizen_profile.get('ruralFlag'):
            is_eligible = False

        # Family size check
        if 'minFamilySize' in eligibility_criteria and citizen_profile.get('familySize', 1) < eligibility_criteria['minFamilySize']:
            is_eligible = False

        if is_eligible:
            recommendations.append({
                "scheme_id": str(scheme['_id']),
                "scheme_name": scheme['schemeName'],
                "description": scheme['description'],
                "category": scheme.get('category', 'N/A'),
                "benefitAmount": scheme.get('benefitAmount', 0)
            })
            
    return recommendations
