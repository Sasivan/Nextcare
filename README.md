# NextCare+

## Introduction

NextCare+ is an innovative remote health monitoring system designed to provide real-time tracking of an individual's vital signs. By leveraging IoT technology and modern web development practices, it offers a seamless interface for both the monitored individual (the "Elder") and their caregivers or family members. The platform aims to provide peace of mind through continuous monitoring, intelligent alerts, and AI-powered health summaries.

## Project Overview

The project consists of two main components:
1.  **IoT Vital Signs Monitor**: A simulated IoT device built to run in the Wokwi environment. It uses an ESP32 with various sensors (temperature, humidity, accelerometer) to collect health data and publishes it to an MQTT broker.
2.  **Web Dashboard**: A Next.js application that subscribes to the MQTT feed and displays the vital signs in real-time. It features distinct user interfaces for the elder and their family, providing relevant controls and information for each.

The core idea is to create a closed-loop system where health data is collected, transmitted, displayed, and analyzed, with functionalities for manual alerts and medication management.

## Workflow Diagram

The data flows through the system as follows:

`IoT Device (Wokwi Simulator)` -> `Collects Sensor Data (Temp, Heart Rate, etc.)` -> `Publishes JSON payload to MQTT Broker` -> `Next.js Web App (Subscribed to MQTT)` -> `Parses and Displays Data in UI` -> `Genkit AI (Analyzes Data for Summaries)` -> `UI updated with AI insights`

## Technology Stack

-   **Frontend**: Next.js (React), TypeScript, Tailwind CSS
-   **UI Components**: ShadCN UI
-   **Real-time Communication**: MQTT.js, HiveMQ (Public Broker)
-   **Generative AI**: Google's Gemini Pro via Genkit
-   **IoT Simulation**: Wokwi with MicroPython
-   **Hardware (Simulated)**: ESP32, MPU6050, DHT22, Potentiometer, Buttons, LEDs

## System Architecture

### 1. IoT Device (`/iot` directory)

-   **`main.py`**: The main script for the ESP32. It initializes sensors, connects to WiFi and the MQTT broker, reads sensor data in a loop, checks for anomalies, and publishes the data.
-   **`mpu6050.py`**: A driver for the MPU6050 accelerometer and gyroscope sensor.
-   **`diagram.json`**: The Wokwi diagram file, which defines the virtual hardware setup and connections.

### 2. Web Application (`/src` directory)

-   **`app/page.tsx`**: The main entry point of the application. It manages the state for different views (Home, Elder, Family) and handles the logic for medication reminders and SOS alerts.
-   **`components/`**: Contains all React components, organized by function (e.g., `real-time-vitals.tsx`, `sidebar.tsx`, `header.tsx`).
-   **`context/mqtt-context.tsx`**: A React Context that manages the MQTT connection and provides the status and received data to the rest of the application.
-   **`hooks/use-mqtt.ts`**: The custom hook responsible for connecting to the MQTT broker, subscribing to topics, and handling incoming messages.
-   **`ai/flows/`**: Contains the Genkit flows for AI-powered features, such as `wellness-summary.ts` and `anomaly-explanation.ts`.

## Features and Functionalities

-   **Dual User Views**: Separate, tailored interfaces for "Elder" and "Family" users.
-   **Real-time Vitals Monitoring**: Live dashboard displaying Heart Rate, Body Temperature, Breath Rate, and more.
-   **AI-Powered Wellness Summary**: On-demand generation of an easy-to-understand summary of the patient's current condition.
-   **AI Anomaly Explanation**: Click on an anomalous vital sign to get an AI-generated explanation of what it means.
-   **Fall Detection**: A system that triggers an alert based on sudden accelerometer shocks.
-   **Medication Management**: Family members can send medication reminders, and elders can mark them as complete. Adherence is tracked and displayed.
-   **SOS Alert System**: Elders can manually trigger an SOS alert, which is logged and displayed for the family.
-   **MQTT Publish/Subscribe Simulator**: A dedicated page to manually publish MQTT messages for testing and debugging.

## Implementation Challenges

-   **Real-time Data Synchronization**: Ensuring the UI updates instantly and reliably as new data arrives from the MQTT broker was a key challenge. This was solved using a custom `useMqtt` hook and React Context.
-   **State Management Across Views**: Managing shared state (like medication schedules) and component visibility between the Elder and Family views required careful state lifting and prop drilling.
-   **Robust Fall Detection Logic**: The initial fall detection logic was simplistic. The current implementation uses a "shock detection" method that triggers on maximum sensor readings, which is more reliable in the simulation but would need refinement for a real-world device.
-   **Integrating Genkit**: Integrating server-side Genkit flows with client-side components required creating clear API-like functions (`generateWellnessSummary`, `explainAnomaly`) that could be called from React components.

## Future Enhancements

-   **User Authentication**: Implement a proper login system to securely manage different users and associate elders with their family members.
-   **Historical Data & Charting**: Store vital sign data over time and display it in charts to track trends.
-   **Persistent State**: Use a database (like Firestore) to persist medication schedules, SOS alerts, and user data.
-   **Notification System**: Implement push notifications for critical alerts (e.g., fall detection, SOS) to family members' devices.
-   **Refined IoT Logic**: Port the MicroPython code to a real ESP32 device and calibrate sensors for accurate real-world readings.

## How to Run the Project

This project is designed to be run from the repository `https://github.com/Sasivan/Nextcare.git`.

### 1. Set up the IoT Simulator

1.  Navigate to the `iot` directory.
2.  The `main.py`, `mpu6050.py`, and `diagram.json` files are configured to run in the Wokwi online ESP32 simulator.
3.  Open [Wokwi for ESP32](https://wokwi.com/projects/new/esp32).
4.  Drag and drop the `diagram.json`, `main.py`, and `mpu6050.py` files into the Wokwi editor.
5.  When the simulation starts, it will automatically connect to the 'Wokwi-GUEST' WiFi and start publishing data to the public HiveMQ MQTT broker.

### 2. Run the Web Application

1.  Clone the repository:
    ```bash
    git clone https://github.com/Sasivan/Nextcare.git
    cd Nextcare
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
4.  Open your browser and navigate to `http://localhost:9002` (or the port specified in your terminal).

The web app will automatically connect to the same MQTT broker and start displaying the data being sent from your Wokwi simulation.

## Conclusion

NextCare+ serves as a powerful proof-of-concept for a modern, real-time health monitoring solution. It successfully integrates IoT, a real-time web dashboard, and generative AI to create a user-friendly and feature-rich platform. While there are many opportunities for enhancement, the current implementation provides a solid foundation for a production-ready application.
