#Install in terminal
#pip install opencv-python
#pip install cmake
#pip install dlib
#pip install face_recognition
#pip install numpy==1.26.4

import cv2
import numpy as np
import os
import mysql.connector
import time
import requests
from datetime import datetime
import dlib
import face_recognition
import json

# ----- MySQL Configuration -----
def connect_to_mysql():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Nikil@sql",
        database="face_security_db"
    )

# ----- Send Log to Backend -----
def send_log_to_backend(name, person_id, status, reason=None):
    url = "http://localhost:5000/api/logs"
    payload = {
        "name": name,
        "personId": None if person_id == -1 else person_id,
        "status": status.lower(),
        "reason": reason,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    try:
        response = requests.post(url, json=payload)
        if response.status_code == 200:
            print("✅ Log sent to backend successfully")
        else:
            print(f"❌ Failed to send log: {response.status_code}, {response.text}")
    except Exception as e:
        print("🚨 Error while sending log:", str(e))

# ----- Face Detection Setup -----
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
MODELS_PATH = os.path.join(BASE_DIR, "models")
os.makedirs(MODELS_PATH, exist_ok=True)

PROTO_TXT = os.path.join(MODELS_PATH, "deploy.prototxt.txt")
MODEL_FILE = os.path.join(MODELS_PATH, "res10_300x300_ssd_iter_140000.caffemodel")
LANDMARK_PREDICTOR = os.path.join(MODELS_PATH, "shape_predictor_68_face_landmarks.dat")

net = cv2.dnn.readNetFromCaffe(PROTO_TXT, MODEL_FILE)
predictor = dlib.shape_predictor(LANDMARK_PREDICTOR)

MATCH_THRESHOLD = 0.4
NOD_CHANGE_THRESHOLD = 25
BASELINE_FRAMES = 5

# ----- Face Detection Functions -----
def detect_faces_dnn(frame, conf_threshold=0.5):
    (h, w) = frame.shape[:2]
    blob = cv2.dnn.blobFromImage(cv2.resize(frame, (300, 300)), 1.0,
                                 (300, 300), (104.0, 177.0, 123.0))
    net.setInput(blob)
    detections = net.forward()
    boxes = []
    for i in range(detections.shape[2]):
        confidence = detections[0, 0, i, 2]
        if confidence > conf_threshold:
            box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
            (startX, startY, endX, endY) = box.astype("int")
            boxes.append((max(0, startX), max(0, startY),
                          min(w, endX) - max(0, startX),
                          min(h, endY) - max(0, startY)))
    return boxes

def crop_face(frame, box):
    (x, y, w, h) = box
    return frame[y:y+h, x:x+w]

def draw_face_mesh(frame, shape_np):
    for (x, y) in shape_np:
        cv2.circle(frame, (x, y), 1, (0, 255, 0), -1)

# ----- Compare Embedding with DB -----
def compare_embedding_mysql(new_embedding):
    conn = connect_to_mysql()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, face_embedding, user_id FROM users")
    rows = cursor.fetchall()
    for user_id_db, name, embedding_json, usn in rows:
        if not embedding_json:
            # Skip if embedding is None
            continue
        try:
            stored_embedding = np.array(json.loads(embedding_json))
        except Exception as e:
            print(f"❌ Error parsing embedding for user {name}: {e}")
            continue
        distance = np.linalg.norm(new_embedding - stored_embedding)
        if distance < MATCH_THRESHOLD:
            conn.close()
            return user_id_db, name, usn
    conn.close()
    return None

# ----- Log Entry in MySQL -----
def log_entry_mysql(name, user_id, status, reason=None):
    try:
        conn = connect_to_mysql()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO entry_logs (person_name, user_id, status, remarks)
            VALUES (%s, %s, %s, %s)
        """, (name, None if user_id == -1 else user_id, status.lower(), reason))
        conn.commit()
    except Exception as e:
        print("❌ Error logging entry to DB:", e)
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

# ----- Main Recognition Function -----
def main():
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Could not open webcam.")
        return

    print("📸 Scanning face for 10 seconds...")
    start_time = time.time()
    collected_embeddings = []
    recognized_user = None
    baseline_nose_values = []
    nod_detected = False
    display_name = "Unknown"

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame = cv2.flip(frame, 1)
        elapsed = time.time() - start_time
        if elapsed > 10:
            break

        boxes = detect_faces_dnn(frame)
        if boxes:
            box = max(boxes, key=lambda b: b[2]*b[3])
            (x, y, w, h) = box
            face_img = crop_face(frame, box)
            rgb_face = cv2.cvtColor(face_img, cv2.COLOR_BGR2RGB)
            gray = cv2.cvtColor(face_img, cv2.COLOR_BGR2GRAY)
            rect = dlib.rectangle(0, 0, face_img.shape[1], face_img.shape[0])
            shape = predictor(gray, rect)
            shape_np = np.array([[shape.part(i).x, shape.part(i).y] for i in range(68)])
            draw_face_mesh(face_img, shape_np)

            # Liveness check (nose movement)
            current_nose_y = shape_np[30][1]
            if len(baseline_nose_values) < BASELINE_FRAMES:
                baseline_nose_values.append(current_nose_y)
            else:
                avg_baseline = np.mean(baseline_nose_values)
                if abs(current_nose_y - avg_baseline) > NOD_CHANGE_THRESHOLD:
                    nod_detected = True

            face_encodings = face_recognition.face_encodings(rgb_face)
            if face_encodings:
                embedding = face_encodings[0]
                collected_embeddings.append(embedding)
                # Only store recognized user, do NOT log yet
                if not recognized_user:
                    result = compare_embedding_mysql(embedding)
                    if result:
                        recognized_user = result
                        display_name = result[1]

            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
            cv2.putText(frame, display_name, (x, y - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 255, 0), 2)

        cv2.imshow("Smart Security", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

    # ----- Final Decision (Log only once) -----
    if nod_detected:
        print("👁️‍🗨️ Liveness detected ✅")
        if recognized_user:
            person_id, name, usn = recognized_user
            print(f"✅ Access Granted for {name} (USN: {usn})")
            send_log_to_backend(name=name, person_id=person_id, status="authorized")
        elif collected_embeddings:
            print("🚫 Face detected but not recognized.")
            send_log_to_backend(name="Unknown", person_id=-1, status="unrecognized", reason="Face not matched")
        else:
            print("❌ No valid face embedding found.")
            send_log_to_backend(name="Unknown", person_id=-1, status="unrecognized", reason="No face encoding")
    else:
        print("❌ Liveness failed (no nod detected).")
        send_log_to_backend(name="Unknown", person_id=-1, status="liveness_failed", reason="No nod detected")

if __name__ == "__main__":
    main()
