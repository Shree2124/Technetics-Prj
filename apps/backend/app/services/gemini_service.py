import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    print("Warning: GEMINI_API_KEY is not set. Vulnerability analysis will not be available.")
    genai.configure(api_key="DUMMY_KEY") # Configure with a dummy key to avoid crashing
else:
    genai.configure(api_key=GEMINI_API_KEY)

def get_vulnerability_analysis(citizen_data: dict):
    """
    Generates a detailed vulnerability analysis for a citizen using the Gemini API.
    """
    if not GEMINI_API_KEY:
        return "Vulnerability analysis is unavailable because the GEMINI_API_KEY is not configured."

    model = genai.GenerativeModel('gemini-pro')

    prompt = f"""
    Analyze the vulnerability of the following citizen based on their profile data. Provide a detailed, point-by-point analysis covering financial, social, and personal factors. Conclude with a summary of their key vulnerabilities and suggest specific areas for intervention.

    **Citizen Profile:**
    - **Age:** {citizen_data.get('age', 'N/A')}
    - **Income:** {citizen_data.get('income', 'N/A')}
    - **Employment Status:** {citizen_data.get('employmentStatus', 'N/A')}
    - **Family Size:** {citizen_data.get('familySize', 'N/A')}
    - **Education Level:** {citizen_data.get('educationLevel', 'N/A')}
    - **Disability:** {'Yes' if citizen_data.get('disability') else 'No'}
    - **Housing:** Lives in a {'rural' if citizen_data.get('ruralFlag') else 'urban'} area.
    - **Vulnerability Score:** {citizen_data.get('vulnerabilityScore', 'N/A')}/100

    **Analysis:**
    """

    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"An error occurred while generating the analysis: {e}"

