/*
  WetApp Arduino with LCD Screen

  Required dependencies:
    - DHT sensor library (Tested with 1.4.4) - https://github.com/adafruit/DHT-sensor-library
      |- Adafruit Unified Sensor Driver (Tested with 1.1.7) - https://github.com/adafruit/Adafruit_Sensor
    - ArduinoJson (Tested with 6.20.1) - https://arduinojson.org
*/

#include <DHT.h>
#include <LiquidCrystal.h>
#include <ArduinoJson.h>

// Pin that has second pin of the DHT sensor connected
#define DHTPIN 8

// Uncomment the type that corresponds to your DHT sensor
//#define DHTTYPE DHT11   // DHT 11
//#define DHTTYPE DHT21   // DHT 21 (AM2301)
#define DHTTYPE DHT22   // DHT 22  (AM2302), AM2321

// Interval (in ms) between measurements
const long interval = 2000;

// DHT sensor
DHT dht(DHTPIN, DHTTYPE);

// LCD Screen
LiquidCrystal lcd(7, 6, 5, 4, 3, 2);

// Variables for humidity and temperature
float humidity;
float temperature;

// Variable for JSON document. 16 bytes is enough to store the data, see calculator at https://arduinojson.org/v6/assistant
StaticJsonDocument<16> doc;

// Variable to keep track of runtime
unsigned long startMillis;
unsigned long currentMillis;

void setup()
{
  Serial.begin(9600); // start a serial port output
  dht.begin(); // initialize the dht sensor
  lcd.begin(16, 2); // initialize the lcd screen, modify if different size
  startMillis = millis(); // start the timer
}

void loop()
{
  currentMillis = millis(); // get the current time

  if (currentMillis - startMillis >= interval) { // if diff is bigger or equal to interval run the measurement
    measure();

    startMillis = currentMillis; // save the current time for next comparisons
  }
}

// Function that retrieves the measurements and outputs them to serial
void measure() {
  humidity = dht.readHumidity();
  temperature = dht.readTemperature();

  doc["temperature"] = temperature;
  doc["humidity"] = humidity;

  serializeJson(doc, Serial);
  Serial.println();

  write_lcd();
}

// Function that outputs to LCD screen
void write_lcd() {
  lcd.setCursor(1,0);
  lcd.print("Tem.: ");
  lcd.print(temperature);
  lcd.print(" ");
  lcd.print((char)223);
  lcd.print("C");

  lcd.setCursor(1,1);
  lcd.print("Hum.: ");
  lcd.print(humidity);
  lcd.print(" %");
}