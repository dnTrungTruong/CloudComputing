from flask import Flask, jsonify, request
from datetime import datetime
from firebase import firebase
from dateutil import tz

app = Flask(__name__)
app.config["DEBUG"] = True
application = app
firebase = firebase.FirebaseApplication('https://hcmute-cq-hk2-2020-n8.firebaseio.com/')
from_zone = tz.gettz('UTC')
to_zone = tz.gettz('Asia/Ho_Chi_Minh')

a = 0.921291
b = 0.02536222
c = 0.7733201649135459

@app.route('/', methods=['GET'])
def home():
    listTime = []
    listTemperature = []
    listHumidity = []
    listData = [listTime, listTemperature, listHumidity]
    listTree = ['Time', 'Temperature', 'Humidity']
    listCurrent = []
    for i in range(3):
        temp = firebase.get('DHT11_Data/' + listTree[i], None)

        for key, value in temp.items():
            listData[i].append(float(value))

        val = listData[i][len(listData[i]) - 1]
        if i == 0:
                timestamp = int(val)
                utc = datetime.utcfromtimestamp(timestamp)
                utc = utc.replace(tzinfo=from_zone)
                vietnam = utc.astimezone(to_zone)
                val = vietnam.strftime("%H:%M:%S")

        listCurrent.append(val)

    return jsonify({'update_time': listCurrent[0], 'current_temp': listCurrent[1], 'current_humid': listCurrent[2]})

@app.route('/iot', methods=['GET'])
def getNextFromCurrent():
    listTemperature = []
    listHumidity = []
    listData = [listTemperature, listHumidity]
    listTree = ['Temperature', 'Humidity']
    listCurrent = []
    for i in range(2):
        temp = firebase.get('DHT11_Data/' + listTree[i], None)

        for key, value in temp.items():
            listData[i].append(float(value))

        val = listData[i][len(listData[i]) - 1]
        listCurrent.append(val)
    current_temp = listCurrent[0]
    next_temp = a*float(listCurrent[0]) + b*float(listCurrent[1]) + c
    return jsonify({'current': current_temp, 'next': next_temp})

@app.route('/iot/predict', methods=['GET'])
def getNext():
    temp = float(request.args.get('temp', None))
    humid  = float(request.args.get('humid', None))
    next_temp = a*temp + b*humid + c
    return jsonify({'next_temp': next_temp})

if __name__ == '__main__':
    app.run()