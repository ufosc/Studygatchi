# Studygatchi

This project implements a Chrome extension using React and Vite with TypeScript.

## Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (version 18+ or 20+) installed on your machine.

### Setup

1. Clone or fork the repository :

    ```sh
    # To clone
    git clone https://github.com/ufosc/Studygatchi.git
    cd Studygatchi/frontend
    ```

2. Install the dependencies:

    ```sh
    npm install
    ```

## Development

Start the development server:

```sh
npm run dev
```

Inside your terminal, enter 'o' to open the project in your browser.

## Build 

To create a production build for later importation as a Chrome extension:

```sh
npm run build
```

This will generate the build files in the `build` directory.

## Load Studygatchi in Chrome

1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable "Developer mode" using the toggle switch in the top right corner.
3. Click "Load unpacked" and select the `build` directory.

## Project Structure

- `public/`: Contains static files and the `manifest.json`.
- `src/`: Contains the React app source code.
- `vite.config.ts`: Vite configuration file.
- `tsconfig.json`: TypeScript configuration file.
- `package.json`: Contains the project dependencies and scripts.
