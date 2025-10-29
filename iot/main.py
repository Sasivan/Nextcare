import network
import time
from machine import Pin, ADC, SoftI2C
import mpu6050
import dht
import ujson
from umqtt.simple import MQTTClient

# --- ⚙️ MQTT Server Parameters ---
MQTT_CLIENT_ID = "micropython-vital-signs-monitor"
MQTT_BROKER = "broker.mqttdashboard.com"
MQTT_USER = "luna"
MQTT_PASSWORD = "leandro"
MQTT_TOPIC = "vital-signs"

# --- 📌 Pin Definitions ---
body_sensor = dht.DHT22(Pin(15))
potentiometer = ADC(Pin(35))
potentiometer.atten(ADC.ATTN_11DB)
i2c = SoftI2C(scl=Pin(25), sda=Pin(26))
mpu = mpu6050.accel(i2c)
button = Pin(27, Pin.IN, Pin.PULL_UP)
led_red = Pin(2, Pin.OUT)
led_yellow = Pin(0, Pin.OUT)
led_green = Pin(4, Pin.OUT)
buzzer = Pin(16, Pin.OUT)

# --- 📈 Sensor Constants and Thresholds ---
ACZ_MAX = 32767
ACZ_MIN = -32768
POTENTIOMETER_MAX = 4095
HEART_RATE_THRESHOLD = [60, 100]
BODY_TEMPERATURE_THRESHOLD = 37
SHIRT_HUMIDITY_THRESHOLD = 70
BREATH_RATE_THRESHOLD = [12, 18]
ENV_TEMPERATURE_THRESHOLD = [5, 35]

# --- 💥 FALL DETECTION CONSTANTS & VARIABLES (SIMPLIFIED SHOCK ALERT) ---
# Check if any single raw axis hits its max (32767) or min (-32768) value.
# This simulates a hard, sudden shock that bottoms out the sensor.
SHOCK_THRESHOLD_RAW = 30000 

fall_detected = False
impact_time = 0 
BUZZER_DURATION = 0.5

previous_data = ""
swallow_pill = False

current_millis = lambda: time.ticks_ms()


# --- 🚨 SHOCK ALERT FUNCTION (New Simplified Logic) ---

def check_for_shock(accel_data):
    """
    Triggers an alert if any single accelerometer axis hits its max or min value.
    (Simulating a sudden, hard impact)
    """
    ax = accel_data["AcX"]
    ay = accel_data["AcY"]
    az = accel_data["AcZ"]

    # Check if any axis is near its positive or negative limit (max/min raw values)
    if (abs(ax) > SHOCK_THRESHOLD_RAW or
        abs(ay) > SHOCK_THRESHOLD_RAW or
        abs(az) > SHOCK_THRESHOLD_RAW):
        
        print(">>> SHOCK ALERT: Sensor reading bottomed out (Immediate Trigger).")
        return True
        
    return False


# --- 🌐 Connect to Wifi ---
print("Connecting to WiFi", end="")
sta_if = network.WLAN(network.STA_IF)
sta_if.active(True)
sta_if.connect('Wokwi-GUEST', '')
while not sta_if.isconnected():
    print(".", end="")
    time.sleep(0.5)
print("\nConnected! IP:", sta_if.ifconfig()[0])

# --- 🚀 Connect to MQTT Server ---
print("Connecting to MQTT server... ", end="")
try:
    mqtt_client = MQTTClient(MQTT_CLIENT_ID, MQTT_BROKER, user=MQTT_USER, password=MQTT_PASSWORD)
    mqtt_client.connect()
    print("Connected!")
except Exception as e:
    print("Error connecting to MQTT:", e)
    for _ in range(5):
        led_red.value(1); time.sleep(0.1); led_red.value(0); time.sleep(0.1)
    while True:
        pass


# --- 🔄 Main Loop ---
while True:
    try:
        # Read potentiometer simulating heart rate (0-220 BPM)
        pot_value = potentiometer.read()
        heart_rate = int((pot_value / POTENTIOMETER_MAX) * 220)

        # Read MPU6050 data
        accelerometer_gyroscope = mpu.get_values()
        
        # Call Shock Detection Function (Replaces Fall Detection)
        shock_alert = check_for_shock(accelerometer_gyroscope)
        # Note: We reuse the 'fall_alert' variable name for simplicity
        fall_alert = shock_alert 

        # Simulate breath rate from AcZ (scaled to 0-25 breaths/min)
        AcZ_scaled_to_positive = accelerometer_gyroscope["AcZ"] - ACZ_MIN
        breath_rate = int((AcZ_scaled_to_positive / (ACZ_MAX - ACZ_MIN)) * 25)
        
        # Environment Temperature from MPU6050
        environment_temperature = round(float(accelerometer_gyroscope["Tmp"]), 1)

        # Reading the DHT22 sensor
        body_sensor.measure() 
        body_temp = body_sensor.temperature()
        shirt_humidity = body_sensor.humidity()

        # Check if the button is pressed (Pill Adherence Logic)
        if button.value() == 0:
            swallow_pill = True
            print("Pill swallowed registered!")
            buzzer.value(1); time.sleep(0.1); buzzer.value(0)
        
        # --- Vital Sign Anomaly Check ---
        abnormal_sign = []
        
        # Add Shock Alert to the list
        if fall_alert:
            abnormal_sign.append("EMERGENCY: Shock detected (Instant Impact)")

        if body_temp > BODY_TEMPERATURE_THRESHOLD:
            abnormal_sign.append("High body temperature")
        if shirt_humidity > SHIRT_HUMIDITY_THRESHOLD:
            abnormal_sign.append("High sweat (Humidity)")
        if heart_rate < HEART_RATE_THRESHOLD[0] or heart_rate > HEART_RATE_THRESHOLD[1]:
            abnormal_sign.append("Uncommon heart rate")
        if breath_rate < BREATH_RATE_THRESHOLD[0] or breath_rate > BREATH_RATE_THRESHOLD[1]:
            abnormal_sign.append("Unusual breath rate")
        if environment_temperature < ENV_TEMPERATURE_THRESHOLD[0] or environment_temperature > ENV_TEMPERATURE_THRESHOLD[1]:
            abnormal_sign.append("Not safest environment temperature")
        
        if not abnormal_sign:
            abnormal_sign.append("All vital signs are within normal range")

        # --- MQTT Payload Creation ---
        print("Measuring vital signs... ", end="")
        message_data = {
            "body_temperature": body_temp,
            "shirt_humidity": shirt_humidity,
            "heart_rate": heart_rate,
            "breath_rate": breath_rate,
            "env_temperature": environment_temperature,
            "swallow_pill_today": swallow_pill,
            "fall_emergency": fall_alert, 
            "abnormal_sign": abnormal_sign,
            "AcX": accelerometer_gyroscope["AcX"], 
            "GyX": accelerometer_gyroscope["GyX"]
        }
        message = ujson.dumps(message_data)

        # --- Publish Data ---
        if message != previous_data:
            print("Updated! Sending to MQTT topic '{}': {}".format(MQTT_TOPIC, message))
            
            # Sound buzzer for any anomaly detected
            if len(abnormal_sign) > 1 or abnormal_sign[0] != "All vital signs are within normal range":
                buzzer.value(1); time.sleep(BUZZER_DURATION); buzzer.value(0)

            mqtt_client.publish(MQTT_TOPIC, message)
            
            # Success: Green LED flash
            led_green.on(); time.sleep(0.1); led_green.off() 
            
            previous_data = message
        else:
            print("No change.")
            # No Change: Yellow LED flash
            led_yellow.on(); time.sleep(0.1); led_yellow.off() 

    except Exception as e:
        print("Error during main loop or publishing:", e)
        # Error: Red LED flash
        led_red.on(); time.sleep(1); led_red.off()
        try:
            mqtt_client.connect()
        except:
            pass

    # IMPORTANT: Loop is fast (0.5s) for responsive detection
    time.sleep(0.5)
