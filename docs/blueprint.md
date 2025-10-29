# **App Name**: VitalView

## Core Features:

- MQTT Data Ingestion: Establishes a WebSocket connection to the public MQTT broker (broker.mqttdashboard.com) and subscribes to the 'vital-signs' topic to receive real-time sensor data.
- JSON Parsing: Parses incoming JSON payloads from MQTT messages into structured data objects for easy access and manipulation.
- Vital Sign Display: Displays key vital signs (Heart Rate, Body Temperature, Shirt Humidity, Breath Rate, Environment Temperature, Medication Adherence) in dedicated, easy-to-read cards or widgets, updating in real-time.
- Anomaly Highlighting: Highlights data cards with abnormal vital signs by changing the background or border color to draw immediate attention.  A tool will analyze the output of the MQTT simulator to help determine anomalies.
- Anomaly Logging: Logs the contents of the 'abnormal_sign' array from the JSON payload in a dedicated section, providing a history of current anomalies.
- Connection Status: Displays the current MQTT connection state (e.g., Connecting, Connected, Disconnected) via a visible status indicator.
- Responsive Layout: Ensures the layout adapts and displays correctly on various screen sizes, including desktops, tablets, and phones.

## Style Guidelines:

- Primary color: Soft blue (#74A4BC), conveying a sense of calm and reliability.
- Background color: Light gray (#F0F4F7), providing a clean and unobtrusive backdrop.
- Accent color: Warm orange (#E0824C) for highlighting anomalies and critical information, creating necessary contrast.
- Body and headline font: 'Inter', a grotesque-style sans-serif, will provide a clean, modern, and highly readable interface.
- Use clear, simple icons to represent each vital sign for quick recognition.
- Employ a card-based layout to present vital signs in an organized and easily digestible manner.
- Incorporate subtle animations for real-time data updates and anomaly alerts.