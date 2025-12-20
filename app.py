import os
from flask import Flask, render_template, redirect, url_for
from dotenv import load_dotenv
load_dotenv()
import firebase_admin
from firebase_admin import credentials, auth

app = Flask(__name__)

service_account_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')

if service_account_path and os.path.exists(service_account_path):
    try:
        cred = credentials.Certificate(service_account_path)
        firebase_admin.initialize_app(cred)
        print("Firebase Admin Initialized successfully.")
    except Exception as e:
        print(f"Failed to initialize Firebase Admin: {e}") 
else:
    print("Warning: GOOGLE_APPLICATION_CREDENTIALS not set or file not found. Auth features may not work.")

@app.route('/')
def index():
    return redirect(url_for('auth'))

@app.route('/dashboard')
def dashboard():
    return render_template('index.html')

@app.route('/auth')
def auth():
    def get_clean(key):
        val = os.getenv(key, '')
        return val.strip().strip("'").strip('"')

    firebase_config = {
        'apiKey': get_clean('FIREBASE_API_KEY'),
        'authDomain': get_clean('FIREBASE_AUTH_DOMAIN'),
        'projectId': get_clean('FIREBASE_PROJECT_ID'),
        'storageBucket': get_clean('FIREBASE_STORAGE_BUCKET'),
        'messagingSenderId': get_clean('FIREBASE_MESSAGING_SENDER_ID'),
        'appId': get_clean('FIREBASE_APP_ID')
    }

    print(f"DEBUG: Firebase Config Status - API Key Present: {bool(firebase_config['apiKey'])}, Project: {firebase_config['projectId']}")
    
    return render_template('auth.html', firebase_config=firebase_config)

@app.route('/auditory')
def auditory():
    return render_template('auditory.html')

@app.route('/dual_task')
def dual_task():
    return render_template('dual_task.html')

@app.route('/focus')
def focus():
    return render_template('focus.html')

@app.route('/info')
def info():
    return render_template('info.html')

@app.route('/lapse')
def lapse():
    return render_template('lapse.html')

@app.route('/memory')
def memory():
    return render_template('memory.html')

@app.route('/results')
def results():
    return render_template('results.html')

@app.route('/stroop')
def stroop():
    return render_template('stroop.html')

@app.route('/sustained')
def sustained():
    return render_template('sustained.html')

@app.route('/switching')
def switching():
    return render_template('switching.html')

@app.route('/temporal')
def temporal():
    return render_template('temporal.html')

@app.route('/time')
def time():
    return render_template('time.html')

if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=5001)
