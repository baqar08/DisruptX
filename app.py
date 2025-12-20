from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

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
    app.run(debug=True)
