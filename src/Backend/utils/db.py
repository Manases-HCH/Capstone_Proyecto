# utils/db.py
import os
import pyodbc
from dotenv import load_dotenv

load_dotenv()

driver = os.getenv("DB_DRIVER")
server = os.getenv("DB_SERVER")
database = os.getenv("DB_DATABASE")
user = os.getenv("DB_USER")
password = os.getenv("DB_PASSWORD")

def get_connection():
    if user and password:
        conn_str = (
            f"DRIVER={{{driver}}};"
            f"SERVER={server};"
            f"DATABASE={database};"
            f"UID={user};PWD={password};"
            "TrustServerCertificate=yes;"
        )
    else:
        conn_str = (
            f"DRIVER={{{driver}}};"
            f"SERVER={server};"
            f"DATABASE={database};"
            "Trusted_Connection=yes;"
            "TrustServerCertificate=yes;"
        )

    return pyodbc.connect(conn_str)
