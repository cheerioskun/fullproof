from flask import Flask, request
from web3 import Web3
import requests

app = Flask(__name__)

@app.route("/")
def main():
    args = request.args
    URL = args['url'] 
    hash = args['hash']
    resp = requests.get(URL)
    with open('random.jpg', 'wb') as f:
        f.write(resp.content)
    return str(int(hash == hex(Web3.toInt(Web3.soliditySha3(['bytes'], [resp.content])))))

if __name__ == "__main__":
    app.run()
