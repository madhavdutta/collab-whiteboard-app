# Collaborative Whiteboard SaaS

A real-time collaborative whiteboard application with SaaS features.

## Features

- Real-time collaborative drawing
- User authentication and authorization
- Room-based collaboration
- Subscription plans
- User profiles
- Cursor tracking
- Drawing tools (pen, eraser)
- Canvas saving and exporting

## Tech Stack

- **Frontend**: React, Socket.io client, Zustand for state management
- **Backend**: Node.js, Express, Socket.io
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example`
4. Start the development server:
   ```
   npm run dev
   ```

## Deployment

This application is designed to be deployed on your own server. Follow these steps:

1. Build the frontend:
   ```
   npm run build
   ```
2. Start the production server:
   ```
   npm start
   ```

## License

This project is licensed under the MIT License.
