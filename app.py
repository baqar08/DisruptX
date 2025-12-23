import os
import json
from flask import Flask, render_template, redirect, url_for, session, request, jsonify
from functools import wraps
from dotenv import load_dotenv
load_dotenv()
import firebase_admin
from firebase_admin import credentials, auth as firebase_auth

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'your-secret-key-change-this-in-production')

firebase_cred_json = os.getenv('FIREBASE_CREDENTIALS_JSON')
service_account_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')

if not firebase_admin._apps:  
    try:
        if firebase_cred_json:
            cred_dict = json.loads(firebase_cred_json)
            cred = credentials.Certificate(cred_dict)
            firebase_admin.initialize_app(cred)
            print("Firebase Admin Initialized successfully from FIREBASE_CREDENTIALS_JSON.")
        elif service_account_path and os.path.exists(service_account_path):
            cred = credentials.Certificate(service_account_path)
            firebase_admin.initialize_app(cred)
            print("Firebase Admin Initialized successfully from service_account_path.")
        else:
            print("Warning: No valid Firebase credentials found. Set FIREBASE_CREDENTIALS_JSON or GOOGLE_APPLICATION_CREDENTIALS.")
    except Exception as e:
        print(f"Failed to initialize Firebase Admin: {e}")

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('logged_in'):
            return redirect(url_for('auth'))
        return f(*args, **kwargs)
    return decorated_function

@app.route('/')
def index():
    return redirect(url_for('auth'))

@app.route('/api/guest-login', methods=['POST'])
def guest_login():
    guest_id = request.json.get('guestId')
    if guest_id:
        session['logged_in'] = True
        session['user_type'] = 'guest'
        session['user_id'] = guest_id
        return jsonify({'success': True, 'message': 'Guest login successful'})
    return jsonify({'success': False, 'message': 'Invalid guest ID'}), 400

@app.route('/api/firebase-login', methods=['POST'])
def firebase_login():
    try:
        id_token = request.json.get('idToken')
        decoded_token = firebase_auth.verify_id_token(id_token)
        uid = decoded_token['uid']
        email = decoded_token.get('email', '')
        
        session['logged_in'] = True
        session['user_type'] = 'firebase'
        session['user_id'] = uid
        session['user_email'] = email
        
        return jsonify({'success': True, 'message': 'Login successful'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 401

@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'success': True, 'message': 'Logged out successfully'})

@app.route('/dashboard')
@login_required
def dashboard():
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
    
    return render_template('index.html', firebase_config=firebase_config)

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
@login_required
def auditory():
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
    
    return render_template('auditory.html', firebase_config=firebase_config)

@app.route('/dual_task')
@login_required
def dual_task():
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
    
    return render_template('dual_task.html', firebase_config=firebase_config)

@app.route('/focus')
@login_required
def focus():
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
    
    return render_template('focus.html', firebase_config=firebase_config)

@app.route('/info')
@login_required
def info():
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
    
    return render_template('info.html', firebase_config=firebase_config)

@app.route('/lapse')
@login_required
def lapse():
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
    
    return render_template('lapse.html', firebase_config=firebase_config)

@app.route('/memory')
@login_required
def memory():
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
    
    return render_template('memory.html', firebase_config=firebase_config)

@app.route('/results')
@login_required
def results():
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
    
    return render_template('results.html', firebase_config=firebase_config)

@app.route('/stroop')
@login_required
def stroop():
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
    
    return render_template('stroop.html', firebase_config=firebase_config)

@app.route('/sustained')
@login_required
def sustained():
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
    
    return render_template('sustained.html', firebase_config=firebase_config)

@app.route('/switching')
@login_required
def switching():
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
    
    return render_template('switching.html', firebase_config=firebase_config)

@app.route('/temporal')
@login_required
def temporal():
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
    
    return render_template('temporal.html', firebase_config=firebase_config)

@app.route('/time')
@login_required
def time():
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
    
    return render_template('time.html', firebase_config=firebase_config)

if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=5001)


    
