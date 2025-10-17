import cv2
import face_recognition
import numpy as np
import mysql.connector
import time
import json
import bcrypt
from flask import Flask, request, jsonify
from flask_cors import CORS  # allow frontend to talk to backend

app = Flask(__name__)
CORS(app)  # Enable CORS for React

# ----- MySQL Connection -----
def connect_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Nikil@sql",
        database="face_security_db"
    )

# ----- API to Add Person -----
@app.route("/api/add-person", methods=["POST"])
def add_person():
    try:
        data = request.json
        name = data.get("name")
        user_id = data.get("userId")  # match frontend key
        department = data.get("department")
        role = data.get("role", "student").lower()
        password = data.get("password")

        if not all([name, user_id, department, role, password]):
            return jsonify({"error": "Missing required fields"}), 400

        # Role validation
        if role not in ['student', 'staff', 'visitor', 'admin', 'guard']:
            role = 'student'

        # Password validation
        if len(password) < 6:
            return jsonify({"error": "Password must be at least 6 characters"}), 400

        # Password hashing
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        # Face Capture
        cap = cv2.VideoCapture(0)
        print("📸 Scanning face for 10 seconds...")

        start_time = time.time()
        encodings_list = []

        while time.time() - start_time < 10:
            ret, frame = cap.read()
            if not ret:
                continue

            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            face_locations = face_recognition.face_locations(rgb_frame)
            if face_locations:
                encodings = face_recognition.face_encodings(rgb_frame, face_locations)
                if encodings:
                    encodings_list.append(encodings[0])
                    (top, right, bottom, left) = face_locations[0]
                    cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)

            cv2.imshow("Capturing Face", frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        cap.release()
        cv2.destroyAllWindows()

        if not encodings_list:
            return jsonify({"error": "No face detected"}), 400

        # Average embedding
        avg_encoding = np.mean(encodings_list, axis=0)
        encoding_str = json.dumps(avg_encoding.tolist())

        # Save to DB
        conn = connect_db()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO users (name, user_id, department, role, face_embedding, password_hash)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (name, user_id, department, role, encoding_str, hashed_password))
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": f"✅ User '{name}' registered successfully!"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True)

