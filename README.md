# Convey

An AI-powered interview survey app that democratizes high-quality data collection in a data-driven era.

## Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- [DFX SDK (Dfinity)](https://internetcomputer.org/docs/current/developer-docs/setup/cli-tools/install/) — for running ICP canisters locally

## Getting Started

Follow these steps to get the application running on your local machine:

### 1. Install Dependencies

Install the required frontend and backend dependencies:

```bash
npm install
```

### 2. Start Local ICP and Deploy Canisters
Start the local Internet Computer replica and deploy your backend canisters:

```bash
dfx start --background
dfx deploy
```
✅ Important: Make sure your backend canister is deployed. It's required for authentication.

### 3. Set Up Environment Variables
Create a .env file in the root directory and configure your environment variables:

```env
# LLM credentials
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=

# DFX CANISTER ENVIRONMENT VARIABLES
DFX_VERSION='0.28.0'
DFX_NETWORK='local'
CANISTER_ID_FRONTEND=
CANISTER_ID=
CANISTER_CANDID_PATH=
# END DFX CANISTER ENVIRONMENT VARIABLES
```

### 4. Start the Backend Server
In a separate terminal window/tab, start the Node.js backend server:

```bash
node server.js
```
By default, the backend runs at http://localhost:4000.

### Project Structure
```bash
├── public/           # Static files
├── src/              # React source code
├── server.js         # Node.js backend server
├── package.json      # Project dependencies and scripts
├── .env              # Environment variables (excluded from git)
└── README.md         # This file
```

### License
This project is licensed under the MIT License. See the LICENSE file for more information.
