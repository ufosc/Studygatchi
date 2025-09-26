# Table of Contents
Coming soon!

# Contributing

## Setup
To setup the project, first fork the OSC repo. Then clone: 
    ```sh
    # To clone
    git clone https://github.com/[INSERT YOUR GITHUB USERNAME HERE]/Studygatchi.git
    ```

## Frontend

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (version 18+ or 20+) installed on your machine.

### Setup

2. Install the dependencies:

    ```sh
    cd Studygatchi/frontend
    npm install
    ```

### Development

Start the development server:

```sh
npm run dev
```

Inside your terminal, enter 'o' to open the project in your browser.

### Build 

To create a production build for later importation as a Chrome extension:

```sh
npm run build
```

This will generate the build files in the `build` directory.

### Load Studygatchi in Chrome

1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable "Developer mode" using the toggle switch in the top right corner.
3. Click "Load unpacked" and select the `build` directory.

### Project Structure

- `public/`: Contains static files and the `manifest.json`.
- `src/`: Contains the React app source code.
- `vite.config.ts`: Vite configuration file.
- `tsconfig.json`: TypeScript configuration file.
- `package.json`: Contains the project dependencies and scripts.

## Backend (Windows/Linux)

### Prerequisites
This guide expects that you have [Python](https://www.python.org/downloads/) (At least 3.12.0) installed.

### Setup
1. **Create the venv**

    ```sh
    cd Studygatchi
	python -m venv env
    ```
    To activate the venv:
    
    - On Windows PowerShell:

    ```sh
    ./env/Scripts/Activate.ps1
    ```

    - On Windows Command Prompt:
    
    ```sh
    ./env/Scripts/activate.bat
    ```

    - On Linux:
    
    ```sh
    ./env/Scripts/activate
    ```


2. **Run the following commands to install Django and the Django Rest Framework:**
    
    ```sh
    pip install django
    pip install djangorestframework
    ```

3. **Install PostgreSQL (version 17)** ***(THIS WILL TAKE A LONG TIME)***
	- Windows: https://www.postgresql.org/download/windows/
	- Linux: https://www.postgresql.org/download/linux/

4. **Activate the venv (if it's not already active) using the corresponding command and install psycopg2**
	
    ```sh
    pip install psycopg2-binary
    ```
    We will use this to be able to connect Django with Postgres!

5. **Access the PostgreSQL shell, logged in as the superuser:**
    
    ```sh
    cd <directory you installed it to>/17/bin
    psql -U postgres
    ```
    When prompted for a password, use the password you put in the install wizard.

6. **Run the following SQL commands:**
	
    ```sql
    CREATE USER <myprojectuser> WITH PASSWORD '<your_secure_password>';
	CREATE DATABASE studygatchi_db OWNER <myprojectuser>;
  	GRANT ALL PRIVILEGES ON DATABASE studygatchi_db TO <myprojectuser>;
	\q
    ```
	Replace `<myprojectuser>` with whatever username you want, same for the password;

7. **Create a file called `settings.py` in the backend directory and copy and paste the contents of `settings_template.txt` into `settings.py`.**

8. **In `settings.py`, go to where it says `DATABASES`, and insert your info from step 6 into the corresponding places.**

9. **Run the following commands** ***with the venv active*** **to apply migrations:**
    
    ```sh
	python manage.py makemigrations
	python manage.py migrate
    ```

10. **Test the connection by running this command:**
	
    ```sh
    python manage.py runserver
    ```

	If it all goes well, cool stuff, it's working!

## Backend (Mac)

### Prerequisites
This guide expects that you have [Python](https://www.python.org/downloads/) (At least 3.12.0) installed. 

If Python was installed via either Homebrew or the official Python installer, you may need to use ``python3`` and ``pip3`` instead for the terminal to work.

### Setup
1. **Create the venv**

    ```zsh
    cd Studygatchi
	python3 -m venv env
    ```
    To activate the venv:

    ```zsh
    source /env/bin/activate
    ```

2. **Run the following commands to install Django and the Django Rest Framework:**
    
    ```zsh
    pip3 install django
    pip3 install djangorestframework
    ```

3. **Install PostgreSQL (version 17)** ***(THIS WILL TAKE A LONG TIME)***
	- Mac: https://www.postgresql.org/download/macosx/

4. **Activate the venv (if it's not already active) using the corresponding command and install psycopg2**
	
    ```zsh
    pip3 install psycopg2-binary
    ```
    We will use this to be able to connect Django with Postgres!

5. **Create a database for Studygatchi**

    ```zsh
    createdb studygatchi_db
    ```

6. **Access the PostgreSQL shell, logged in as the superuser:**
    
    ```zsh
    cd <directory you installed it to>/env/bin
    psql
    ```

    6a. ***If psql is not found, try this solution***
	```zsh
    brew install pgcli
	brew link --force libpq
    ```

7. **Run the following SQL commands:**
	
    ```sql
    CREATE USER <myprojectuser> WITH PASSWORD '<your_secure_password>';
	CREATE DATABASE studygatchi_db OWNER <myprojectuser>;
  	GRANT ALL PRIVILEGES ON DATABASE studygatchi_db TO <myprojectuser>;
	\q
    ```
	Replace `<myprojectuser>` with whatever username you want, same for the password;
    
    Use `quit` to exit the PostgreSQL shell;

8. **Create a file called `settings.py` in the backend directory and copy and paste the contents of `settings_template.txt` into `settings.py`.**

9. **In `settings.py`, go to where it says `DATABASES`, and insert your info from step 7 into the corresponding places.**

10. **Run the following commands** ***with the venv active*** **to apply migrations:**
    
    ```zsh
	python3 manage.py makemigrations
	python3 manage.py migrate
    ```

11. **Test the connection by running this command:**
	
    ```zsh
    python3 manage.py runserver
    ```

	If it all goes well, cool stuff, it's working!