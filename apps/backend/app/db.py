import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv() # Load environment variables from .env file

MONGO_URI = os.getenv("MONGODB_URI")

client = MongoClient(MONGO_URI)
db = client.get_database("technetics-hackathon")

def get_db():
    return db
