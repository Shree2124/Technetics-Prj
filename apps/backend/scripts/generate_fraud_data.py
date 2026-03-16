import pandas as pd
import numpy as np
import random
from datetime import datetime
import os

# Set random seed for reproducibility
np.random.seed(42)
random.seed(42)

def generate_fraud_data(n_samples=10000):
    """
    Generate realistic fraud detection dataset with 10,000 rows
    """
    data = []
    
    for i in range(n_samples):
        # Generate realistic income distribution (skewed towards lower income)
        income = np.random.lognormal(10.5, 0.8)  # Log-normal distribution
        income = max(15000, min(300000, income))  # Clamp between 15k and 300k
        
        # Family size (1-10, with higher probability for smaller families)
        family_size = np.random.choice(
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            p=[0.05, 0.15, 0.25, 0.2, 0.15, 0.1, 0.05, 0.03, 0.015, 0.005]
        )
        
        # Previous claims (0-10, most people have 0-3 claims)
        previous_claims = np.random.choice(
            list(range(0, 11)),
            p=[0.3, 0.25, 0.2, 0.1, 0.07, 0.05, 0.02, 0.005, 0.003, 0.001, 0.001]
        )
        
        # Benefits received (correlated with previous claims)
        if previous_claims == 0:
            benefits_received = 0
        else:
            benefits_received = min(previous_claims, np.random.randint(1, previous_claims + 1))
        
        # Loan default (correlated with income and previous claims)
        default_prob = 0.1 + (1 - income/300000) * 0.3 + previous_claims * 0.05
        loan_default = 1 if random.random() < min(default_prob, 0.8) else 0
        
        # Property owned (correlated with income and age)
        age = np.random.normal(38, 12)  # Age distribution
        age = max(18, min(70, int(age)))
        
        property_prob = 0.1 + (income/300000) * 0.4 + (age-18)/52 * 0.3
        property_owned = np.random.poisson(max(property_prob, 0.1))
        property_owned = min(property_owned, 5)  # Cap at 5 properties
        
        # Aadhar linked accounts (1-5, most people have 1-2)
        aadhar_linked_accounts = np.random.choice(
            [1, 2, 3, 4, 5],
            p=[0.4, 0.35, 0.15, 0.07, 0.03]
        )
        
        # Phone linked accounts (1-4)
        phone_linked_accounts = np.random.choice(
            [1, 2, 3, 4],
            p=[0.5, 0.3, 0.15, 0.05]
        )
        
        # Rural flag (30% rural)
        rural_flag = 1 if random.random() < 0.3 else 0
        
        # Location changes (0-5, correlated with fraud indicators)
        location_changes = np.random.poisson(0.5 + loan_default * 0.5 + previous_claims * 0.2)
        location_changes = min(location_changes, 5)
        
        # Application frequency (correlated with fraud indicators)
        app_freq_base = 1 + previous_claims * 0.5 + loan_default * 2
        application_frequency = np.random.poisson(max(app_freq_base, 1))
        application_frequency = min(application_frequency, 10)
        
        # Same bank accounts (0-3, lower for fraud cases)
        if loan_default == 1:
            same_bank_accounts_p = [0.5, 0.3, 0.15, 0.05]  # Sum = 1.0
        else:
            same_bank_accounts_p = [0.3, 0.4, 0.2, 0.1]  # Sum = 1.0

        same_bank_accounts = np.random.choice(
            [0, 1, 2, 3],
            p=same_bank_accounts_p
        )
        
        # IP application count (correlated with fraud)
        ip_count_base = 1 + loan_default * 3 + location_changes * 0.5
        ip_application_count = np.random.poisson(max(ip_count_base, 1))
        ip_application_count = min(ip_application_count, 15)
        
        data.append([
            int(income),
            family_size,
            previous_claims,
            benefits_received,
            loan_default,
            property_owned,
            age,
            aadhar_linked_accounts,
            phone_linked_accounts,
            rural_flag,
            location_changes,
            application_frequency,
            same_bank_accounts,
            ip_application_count
        ])
    
    # Create DataFrame
    columns = [
        'income', 'family_size', 'previous_claims', 'benefits_received',
        'loan_default', 'property_owned', 'age', 'aadhar_linked_accounts',
        'phone_linked_accounts', 'rural_flag', 'location_changes',
        'application_frequency', 'same_bank_accounts', 'ip_application_count'
    ]
    
    df = pd.DataFrame(data, columns=columns)
    
    return df

def main():
    print("Generating 10,000 rows of fraud detection data...")
    
    # Generate data
    df = generate_fraud_data(10000)
    
    # Create dataset directory if it doesn't exist
    dataset_dir = os.path.join(os.path.dirname(__file__), '..', 'app', 'datasets')
    os.makedirs(dataset_dir, exist_ok=True)
    
    # Save to CSV
    output_path = os.path.join(dataset_dir, 'fraud_data.csv')
    df.to_csv(output_path, index=False)
    
    print(f"✅ Generated {len(df)} rows of data")
    print(f"📁 Saved to: {output_path}")
    
    # Show statistics
    print("\n📊 Dataset Statistics:")
    print(f"Average income: ₹{df['income'].mean():,.0f}")
    print(f"Average family size: {df['family_size'].mean():.1f}")
    print(f"Loan default rate: {(df['loan_default'].sum() / len(df) * 100):.1f}%")
    print(f"Rural population: {(df['rural_flag'].sum() / len(df) * 100):.1f}%")
    print(f"Average age: {df['age'].mean():.1f} years")
    
    # Show sample data
    print("\n📋 Sample data (first 5 rows):")
    print(df.head().to_string(index=False))
    
    # Show fraud indicators correlation
    print("\n🔍 Fraud Indicators Summary:")
    fraud_mask = df['loan_default'] == 1
    if fraud_mask.sum() > 0:
        print("Defaulters vs Non-defaulters:")
        print(f"  Average income: ₹{df[fraud_mask]['income'].mean():,.0f} vs ₹{df[~fraud_mask]['income'].mean():,.0f}")
        print(f"  Average claims: {df[fraud_mask]['previous_claims'].mean():.1f} vs {df[~fraud_mask]['previous_claims'].mean():.1f}")
        print(f"  Average location changes: {df[fraud_mask]['location_changes'].mean():.1f} vs {df[~fraud_mask]['location_changes'].mean():.1f}")

if __name__ == "__main__":
    main()
