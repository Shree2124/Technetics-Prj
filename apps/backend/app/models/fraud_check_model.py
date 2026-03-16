from pydantic import BaseModel


class FraudCheck(BaseModel):

    income: float
    family_size: int
    previous_claims: int
    benefits_received: int
    loan_default: int
    property_owned: int
    age: int

    aadhar_linked_accounts: int
    phone_linked_accounts: int

    rural_flag: int
    location_changes: int

    application_frequency: int
    same_bank_accounts: int
    ip_application_count: int