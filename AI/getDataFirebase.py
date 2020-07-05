import csv
import json
import pprint

from firebase import firebase
import pandas as pd

firebase = firebase.FirebaseApplication('https://hcmute-cq-hk2-2020-n8.firebaseio.com/')

# find nearest index of a time stamp
def findIndex(timeStamp):
    for i in range(len(listTime) - 1):
        if timeStamp == listTime[i]:
            return i
        if int(listTime[i]) <= timeStamp and int(listTime[i + 1]) >= timeStamp:
            if(timeStamp - int(listTime[i]) < int(listTime[i + 1]) - timeStamp):
                return i
            else:
                return i + 1
    return None

# init lists to contain data
listTime = []
listTemperature = []
listHumidity = []
listData = [listTime, listTemperature, listHumidity]
listTree = ['Time', 'Temperature', 'Humidity']

# get data from firebase
for i in range(3):
    data = firebase.get('DHT11_Data/' + listTree[i], None)

    for key, value in data.items():
        listData[i].append(value)

# build Temp data to train model
nextTempList = []
for i in range(len(listTime)):
    timeStamp = int(listTime[i]) + 3600
    index = findIndex(timeStamp)
    if(index is not None):
        nextTempList.append(listTemperature[index])

# build data file to train model
size = len(nextTempList)
pd.DataFrame({'Temperature': listTemperature[:size],
              'Humidity': listHumidity[:size], 'next_temp': nextTempList}).to_csv('data.csv')
df = pd.read_csv('data.csv', index_col=0)
print(df)


# get data from firebase
#pd.DataFrame({'Timestamp': listTime, 'Temperature': listTemperature, 'Humidity': listHumidity}).to_csv('data.csv')
# print(len(listTime))
# print(len(listTemperature))
# print(len(listHumidity))
# df = pd.read_csv('data.csv', index_col=0)
# print(df)
