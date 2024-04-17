import requests
import flask
from flask_cors import CORS
from generate_code_img import generateImg

app = flask.Flask(__name__)

CORS(app, supports_credentials=True)

@app.route('/getCodeImage', methods=['GET'])
def getToken():
    return "1232"


if __name__ == '__main__':
    app.run(host="127.0.0.1", port=3008, debug=False)
