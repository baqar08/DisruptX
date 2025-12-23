# DisruptX
<div align="center">
  <!-- <img src="static/images/logo.svg" alt="DisruptX Logo" width="200"/> -->
   


**DisruptX is a comprehensive web-based cognitive testing platform designed for ADHD research and general cognitive training. It offers a suite of interactive tasks to measure attention, memory, and executive function.**

</div>

## Features

*   **Core Cognitive Tasks:**
    *   **Focus Task:** Measures selective attention and inhibition of distractions.
    *   **Working Memory:** Classic digit span test to evaluate short-term retention capacity.
    *   **Stroop Task:** Standard color-word interference test for cognitive control.
*   **Attention & Vigilance:**
    *   **Sustained Attention:** Long-format task to measure ability to maintain focus over time.
    *   **Lapse Detector:** Monitors for brief lapses in vigilance using infrequent signals.
*   **Advanced Assessment:**
    *   **Dual Task:** Tests multitasking by managing simultaneous visual and auditory stimuli.
    *   **Task Switching:** Evaluates cognitive flexibility by adapting to changing sorting rules.
    *   **Temporal Stability:** Analyzes performance consistency and fatigue over time blocks.
*   **Specialized Modules:**
    *   **Auditory Distractions:** Specifically tests tolerance to specific auditory noise types.
    *   **Time Perception:** Estimates internal time-keeping accuracy with interval tests.
*   **Analytics:**
    *   **Results Viewer:** Detailed dashboard to review and analyze performance history across all tasks.
    *   **Firebase Integration:** Secure data storage and user authentication.

## Technologies Used

*   **Backend:** Python, Flask
*   **Database & Auth:** Firebase (Firestore, Authentication)
*   **Frontend:** HTML5, CSS3, Vanilla JavaScript
*   **Configuration:** Python-dotenv

## Demo Video

A showcase of the cognitive tasks and platform features.

🎥 [DEMO VIDEO](LINK_TO_YOUR_DEMO_VIDEO)

### Live Demo [Link](LINK_TO_YOUR_LIVE_DEMO)

## Local Setup and Installation

Follow these steps to get the application running on your local machine.

### 1. Prerequisites

*   Python 3.7+
*   `pip` (Python package installer)
*   **Firebase Project**: You need a Firebase project with Firestore and Authentication enabled.

### 2. Clone the Repository

Clone this repository to your local machine using Git:

```bash
git clone https://github.com/baqar08/DisruptX.git
cd DisruptX
```

### 3. Create a Virtual Environment

It is highly recommended to create a virtual environment to manage project dependencies.

```bash
# For Windows
python -m venv venv
venv\Scripts\activate

# For macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 4. Install Dependencies

Install all the required Python libraries using `pip`.

```bash
pip install -r requirements.txt
```

### 5. Configuration

This project requires Firebase credentials to function.

1.  **Service Account:** Place your Firebase Admin SDK JSON file in the root directory and name it `serviceAccountKey.json`.
2.  **Environment Variables:** Create a `.env` file in the root directory with your Firebase configuration:
    ```env
    SECRET_KEY=your_secret_key
    GOOGLE_APPLICATION_CREDENTIALS=serviceAccountKey.json
    FIREBASE_API_KEY=your_api_key
    FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    FIREBASE_PROJECT_ID=your_project_id
    FIREBASE_STORAGE_BUCKET=your_project.appspot.com
    FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    FIREBASE_APP_ID=your_app_id
    ```

### 6. Run the Application

Once the setup is complete, you can start the Flask development server:

```bash
python app.py
```

Now, open your web browser and navigate to the following address:

```
http://localhost:5001/
```

You should see the **DisruptX** dashboard running!

## How to Use

1.  **Login/Guest Access:** Create an account or use Guest Login to access the dashboard.
2.  **Select a Task:** Choose from the categorized list of cognitive tasks (Core, Attention, Analysis).
3.  **Perform Task:** Follow the on-screen instructions for each specific cognitive test.
4.  **View Results:** Check the Results section to see your performance metrics and history.
5.  **Settings:** Use the toggle to switch between light and dark themes (if supported) or logout.

## Author

-   Name: Baqar Mustafa
-   Email: baqarmustafa84@gmail.com
-   GitHub: baqar08
