import pandas as pd
from sklearn import linear_model
import matplotlib.pyplot as plt

df = pd.read_csv('data.csv', header=0, index_col=0)

def f(x, y, slope, intercept):
    return slope*x + intercept

#chuẩn hóa dữ liệu
df.dropna(inplace=True, how = 'all')
df['Temperature'].fillna(df['Temperature'].mean(), inplace=True)
df['Humidity'].fillna(df['Humidity'].mean(), inplace=True)
df['next_temp'].fillna(df['next_temp'].mean(), inplace=True)

#build train model (train 80%, test 20%)
size_train = int(len(df)*0.8)
df_train = df[:size_train]
df_test = df[size_train:]

#build linear regresstion data
X = df_train[['Temperature','Humidity']]
Y = df_train['next_temp']

#train
regr = linear_model.LinearRegression()
regr.fit(X, Y)

print('Intercept: \n', regr.intercept_)
print('Coefficients: \n', regr.coef_)

#vẽ biểu đồ

