#include <ArduinoJson.h>
#include <WiFiUdp.h>
#include <NTPClient.h>
#include <ESP8266WiFi.h>                                                    // esp8266 library
#include <FirebaseArduino.h>
#include <DHT.h>                                                            // dht11 temperature and humidity sensor library


#define NTP_OFFSET   0      // In seconds
#define NTP_INTERVAL 60 * 1000    // In miliseconds
#define NTP_ADDRESS  "europe.pool.ntp.org"

#define FIREBASE_HOST "hcmute-cq-hk2-2020-n8.firebaseio.com"                          // the project name address from firebase id
#define FIREBASE_AUTH "30uNN4a1gpdbmiYFDhQozCfsjJRU2sYyvSnIX8YQ"            // the secret key generated from firebase

#define WIFI_SSID "AQUAFINA"                                             // input your home or public wifi name 
#define WIFI_PASSWORD "111199999"                                    //password of wifi ssid
 
#define DHTPIN D4                                                           // what digital pin we're connected to
#define DHTTYPE DHT11                                                       // select dht type as DHT 11 or DHT22

DHT dht(DHTPIN, DHTTYPE);                                                     
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, NTP_ADDRESS, NTP_OFFSET, NTP_INTERVAL);

void setup() {
  timeClient.begin();
  Serial.begin(9600);
  delay(1000);                
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);                                     //try to connect with wifi
  Serial.print("Connecting to ");
  Serial.print(WIFI_SSID);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println();
  Serial.print("Connected to ");
  Serial.println(WIFI_SSID);
  Serial.print("IP Address is : ");
  Serial.println(WiFi.localIP());                                            //print local IP address
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);                              // connect to firebase
  dht.begin();                                                               //Start reading dht sensor
}

void loop() { 
  timeClient.update();
  unsigned long timeStamp = timeClient.getEpochTime();
  float h = dht.readHumidity();                                              // Reading temperature or humidity takes about 250 milliseconds!
  float t = dht.readTemperature();                                           // Read temperature as Celsius (the default)
    
  if (isnan(h) || isnan(t)) {                                                // Check if any reads failed and exit early (to try again).
    Serial.println(F("Failed to read from DHT sensor!"));
    return;
  }

  Serial.print("Timestamp: ");  Serial.print(timeStamp);
  String fireTime = String(timeStamp);
  Serial.print("Humidity: ");  Serial.print(h);
  String fireHumid = String(h);                                       //convert integer humidity to string humidity 
  Serial.print("%  Temperature: ");  Serial.print(t);  Serial.println("°C ");
  String fireTemp = String(t);                                                   //convert integer temperature to string temperature

  Firebase.pushString("/DHT11_Data/Time", fireTime);
  Firebase.pushString("/DHT11_Data/Humidity", fireHumid);                                  //setup path and send readings
  Firebase.pushString("/DHT11_Data/Temperature", fireTemp);                                //setup path and send readings

  delay(14000);
   
}
