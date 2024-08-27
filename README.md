# air-quality-api
Integration Sample with Air-Visual APIs 

## Overview
This project provides various APIs related to air quality data. It includes fetching air quality data from the IQAir API, logging the most polluted datetime, and retrieving the most polluted supported cities. The application also uses a CRON job to periodically log air quality data. 

## Features
- **Air Quality Data API:** Fetch real-time air quality data from the IQAir API.
- **Most Polluted Datetime API:** Retrieve the datetime when a city was most polluted.
- **Supported Cities API:** Get a list of the most polluted supported cities based on logged data.
- **CRON Job:** Automatically log air quality data for Paris every minute.
- **Structured Logging:** Integrated Winston for logging with daily log rotation.

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.
- MySQL server set up and running.
- An IQAir API key.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/nk1190/air-quality-api.git
   cd air-quality-api

2. **Install dependencies:**
   ```bash
   npm install express axios node-cron mysql2 dotenv
   npm install winston winston-daily-rotate-file
   npm install swagger-jsdoc swagger-ui-express
   
3. **Set up environment variables:**
   - Create a `.env` file in the root directory and add the following:
     ```plaintext
      DB_HOST=your_db_host
      DB_USER=your_db_user
      DB_PASSWORD=your_db_password
      DB_NAME=your_db_name
      PORT=3000
      AIR_VISUAL_API_URL=http://api.airvisual.com/v2/nearest_city
      AIR_VISUAL_API_KEY=your_api_key

     ```
4. **Run Database Script:**
   ```bash
   CREATE TABLE `air_quality_logs` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `city` varchar(255) DEFAULT NULL,
    `state` varchar(255) DEFAULT NULL,
    `country` varchar(255) DEFAULT NULL,
    `aqi_us` int(11) DEFAULT NULL,
    `main_pollutant_us` varchar(255) DEFAULT NULL,
    `aqi_china` int(11) DEFAULT NULL,
    `main_pollutant_china` varchar(255) DEFAULT NULL,
    `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
    ) ENGINE=InnoDB;
    ```
   You can use the committed .sql file for database tables creation and sample data insertion <br><br>
5. **Start the application:**
   ```bash
   npm start

## API Documentation

The API documentation is available and interactive through Swagger. You can view and interact with the API endpoints directly in your browser.

### Access the Swagger Documentation

- **URL:** [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

