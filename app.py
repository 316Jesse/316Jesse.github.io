from flask import Flask, render_template, request, jsonify
from pathlib import Path
import sqlite3
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__, static_folder='static')
CORS(app)

def db_connection():
    conn = None
    try:
        conn = sqlite3.connect('mycoins.sqlite')
    except sqlite3.Error as e:
        print(e)
    return conn

@app.route('/')
def home():
    return render_template('index.html')

@app.route("/api/v1.0/<coin>", methods=["GET"])
def get_coin_data(coin):
    conn = db_connection()
    cursor = conn.cursor()
    coin_data = []  # Initialize coin_data as an empty list

    if request.method == "GET":
        cursor.execute(f"SELECT * FROM coins WHERE Ticker = '{coin}'")
        coin_data = [
            {
                "Ticker": row[1],
                "Date": row[2],
                "Price": row[3]
            }
            for row in cursor.fetchall()
        ]

    if coin_data is not None:
        return jsonify(coin_data)

if __name__ == "__main__":
    app.run(debug=True)