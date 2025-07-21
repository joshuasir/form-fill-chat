# React App

A modern React application with a Node.js backend server.

## Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

## Getting Started

Follow these steps to get the application running on your local machine:

### 1. Install Dependencies

First, install all required dependencies:

```bash
npm i
```

### 2. Environment Setup

Create a `.env` file in the root directory of the project and configure your environment variables. Here's an example of what your `.env` file might look like:

```env
# LLM credentials
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=
```

**Note:** Make sure to replace the placeholder values with your actual configuration values. Never commit your `.env` file to version control.

### 3. Start the Development Server

To run the React development server:

```bash
npm run dev
```

This will start the development server, typically on `http://localhost:3000`. The page will automatically reload when you make changes to the code.

### 4. Start the Backend Server

In a separate terminal window/tab, start the Node.js backend server:

```bash
node server.js
```

The backend server will start running, typically on the port specified in your `.env` file (default: `http://localhost:3001`).

## Project Structure

```
├── public/          # Static files
├── src/            # React source code
├── server.js       # Node.js backend server
├── package.json    # Project dependencies and scripts
├── .env           # Environment variables (not tracked in git)
└── README.md      # This file
```

## Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Creates a production build
- `npm run test` - Runs the test suite
- `npm run lint` - Runs the linter

## License

This project is licensed under the MIT License - see the LICENSE file for details.
