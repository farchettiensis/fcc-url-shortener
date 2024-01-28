# URL Shortener Microservice

This is my solution to the URL Shortener Microservice challenge as part of freeCodeCamp's Back End Development and APIs Projects certification.

## Overview

This URL shortener microservice allows users to shorten long URLs. Users can submit a URL to be shortened, and the service will generate a unique short URL. Additionally, users can access the original URL by visiting the short URL.

## Features

- POST a URL to `/api/shorturl` and receive a JSON response with `original_url` and `short_url` properties.
- Visiting `/api/shorturl/<short_url>` redirects users to the original URL.
- Handles invalid URLs and returns a JSON response with `{ error: 'invalid url' }`.

## Usage

1. Submit a POST request to `/api/shorturl` with a JSON body containing the original URL.
   Example:
   ```json
   { "url": "https://www.example.com" }
   ```

2. Receive a JSON response with the original and short URL.
   Example:
   ```json
   { "original_url": "https://www.example.com", "short_url": 1 }
   ```

3. Visit `/api/shorturl/1` to be redirected to the original URL.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/url-shortener.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file and add your MongoDB connection URI:
   ```
   MONGO_URI=your_mongodb_uri
   ```

4. Start the server:
   ```bash
   npm start
   ```

The server will be running on [http://localhost:3000](http://localhost:3000).