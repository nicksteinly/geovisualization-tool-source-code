
## Overview
Code repository is for a geovisualization tool for mapping and relating customers and technicians. It implements TomTom API for geocoding addresses, obtaining driving isochrone data (traffic accounted), and displaying map visuals (markers/clustering, geographical map, heat map). It allows a user to upload customers and technicians data to either replace or append existing map data. A user can also display the nearest technicians (under user selected constraints) to a customer through clicking on a customer map marker and then clicking the "Display Reachable Technicians" button in the side navigation pane (be sure to explode the customer data in the side navigation pane in order to see the "Display Reachable Technicians" button).

The app is implemented through a Flask/Python backend and ReactJS/Electron frontend. The two communicate with RESTful API endpoints. Currently, in order to run the app, the backend must be running on a local server, then the frontend can be started up through either the command prompt or an application file.

### High Level File Structure
##### Backend (`backend/`)
- **Backend Server:** Contains the Python Flask backend.
- **Data Storage (`data/`):** Stores Customer and Technicians CSV and GeoJSON data files.
- **Environment Variables (`env/`):** Contains `.env` file storing the TomTom API key.

##### Frontend (`electron-wrapper/frontend/`)
- **Source Files (`src/`):**  
  - Contains ReactJS components and corresponding CSS files.  
  - Key files:  
    - `index.js` – Root ReactJS file.  
    - `App.js` – Main ReactJS application file.  
    - `main.js` – Root Electron file that loads the static `index.html` from the build.  

- **Dependencies (`node_modules/`):** ReactJS and Electron JavaScript dependency directories.

- **Build Output (`build/`):** Contains the built ReactJS app, including static HTML, CSS, and JavaScript files.

- **Packaged App (`out/`):** Stores the packaged Electron app and the final application file.

- **Configuration Files:**
  - `package.json` – Defines project dependencies, version ranges, and npm scripts.
  - `package-lock.json` – Manages dependencies, sub-dependencies, and installation paths.


### Prerequisites for Modifying Code
* Python must be installed on your machine to run backend. Required Python packages must be installed too, which can be installed executing in Command Prompt:
    ```bash
    pip install -r requirements.txt
    ```
* [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) must be installed on your machine to run frontend for development. Required node dependencing can be install by navigating to the frontend directory in Command Prompt and executing:
    ```bash
    npm install
    ```


### Start the Backend Server (Flask App) Before Running Frontend

- Open **Command Prompt** and navigate to the `backend` directory.
  ```bash
  cd backend
  ```
- Execute the following command to start the backend server (Python must be installed first, as well as the backend Python code's dependencies):
  ```bash
  python app.py
  ```
  This will start running the backend on a local server, typically accessible at `http://localhost:5000` or similar, depending on your configuration.


## ReactJS Development and Electron Packaging Steps
This app uses ReactJS as the frontend web-app framework. It also uses Electron, a framework for creating desktop applications out of frontend web-app frameworks like ReactJS. Electron essentially serves as a wrapper for the ReactJS code to create a desktop app. Ultimately, the frontend portion of the app can be converted to a desktop application file. The below steps go into detail about how to start the React code on a development port, build the React code to static (HTML, CSS, JavaScript) files that the Electron framework code can reference. After correctly referencing these static files in the Electron code, the Electron app can be started up from Command Prompt (steps detailed below). Finally, steps detailing how to package the frontend code as an Electron application file are given. 

### 1. Starting the ReactJS App
- Open a **new Command Prompt window** (keeping the backend server running) and navigate to the `frontend` directory:
  ```bash
  cd frontend
  ```
- Execute the following command to start the react development server and launch the app:
  ```bash
  npm run start-react
  ```
- This will cause the frontend to run on `http://localhost:3000`
- Running the app here can be useful for dynamic development and debugging because changes to the ReactJS JavaScript files will immediately be reflected on the screen.
- If the frontend does not load due to CORS issues, add the following line to `App.py`:
    ```python
    from flask_cors import CORS
    
    CORS(app, origins="*")
    ```
    **Note:** This should only be used for development purposes. After making this change, restart the backend and refresh the frontend page.

### 2. Building the ReactJS App into Static Files

- Open a **new Command Prompt window** (keeping the backend server running) and navigate to the `frontend` directory:
  ```bash
  cd frontend
  ```
- Execute the following command to build the ReactJS app into static files:
  ```bash
  npm run build-react
  ```

### 3. Starting the Static ReactJS Build as an Electron App

- After the ReactJS app finishes building, navigate to the `build/index.html` file located in the `frontend` directory:
  ```bash
  cd frontend/build
  ```
- Open `index.html` and update the file paths for the static JavaScript and CSS files. Change:
  ```html
  <script defer="defer" src="/static/js/main.9aea922e.js"></script>
  <link href="/static/css/main.83dfb275.css" rel="stylesheet" />
  ```
  To:
  ```html
  <script defer="defer" src="../build/static/js/main.9aea922e.js"></script>
  <link href="../build/static/css/main.83dfb275.css" rel="stylesheet" />
  ```
  This adjustment ensures that the Electron app correctly references the built static files from the local directory structure.

- Finally, to launch the Electron app, go back to the **Command Prompt** window where you're inside the `frontend` directory and execute the following command:
  ```bash
  npm run start-electron
  ```
  This will launch your Electron app with the ReactJS app embedded within it, while the backend server continues to run in the background.

## 4. Package the Electron App as an Application file

- To package the Electron app and create an application file, go back to the **Command Prompt** window where you're inside the `frontend` directory and execute the following command:
    ```bash
    npm run make
    ```
This will create an application file in `\frontend\out\frontend-win32-x64`. Note the backend must be running on a local port before trying to run the Electron application file. Original steps for packaging the Electron app here: [Electron Forge](https://www.electronjs.org/docs/latest/tutorial/tutorial-packaging).

---


### Additional Notes:
- **Backend Configuration**: Ensure your backend API is running on the correct port and that any relevant configurations (e.g., CORS, server routes) are set up properly to handle requests from the Electron app.
