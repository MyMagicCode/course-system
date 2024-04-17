import flask
from flask_cors import CORS
from generate_code_img import generateImg

HOST = "127.0.0.1"
PORT = 3008

app = flask.Flask(__name__)

CORS(app, supports_credentials=True)

@app.route('/getCodeImage', methods=['GET'])
def getToken():
    name = flask.request.args.get('name')
    value = generateImg(name)
    return {
        "value":value,
        "url": f'http://{HOST}:{PORT}/static/{name}.png',
    }


if __name__ == '__main__':
    app.run(host=HOST, port=3008, debug=False)
