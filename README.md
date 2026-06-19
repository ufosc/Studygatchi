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

1. Install the dependencies:

    ```sh
    cd frontend
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

### Contributing

When making a pull request to the frontend, you *must* follow these rules to ensure your PR is not automatically rejected:

- Pull requests must be made to the `dev` branch, *NOT* `main`.
- Pull requests must include an image of the changes made to the frontend.

## Backend Setup

### Prerequisites

This guide expects that you have [Python](https://www.python.org/downloads/) (At least 3.12.0) installed.

- For macOS users, if Python was installed via either Homebrew or the official Python installer, you may need to use `python3` and `pip3` instead of `python` and `pip`.

### Windows & Generic Linux Setup

1. Install `uv`

    ```powershell
    # Windows Powershell
    powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
    ```

    ```bash
    # macOS and Linux
    curl -LsSf https://astral.sh/uv/install.sh | sh
    ```

    You may need to restart your shell before `uv` appears on your path.

2. Create a virtual environment

    ```bash
    uv venv .venv --python 3.12

    # You can also forgo uv and do it the old fashioned way if you prefer
    # python -m venv .venv
    ```

3. Activate the virtual environment

    ```bash
    # macOS and Linux
    source .venv/bin/activate

    # Windows Powershell
    source .venv\Scripts\Activate.ps1
    ```

4. Install the dependencies

    ```bash
    cd backend
    uv pip install -r requirements.txt
    # If you skipped uv
    # pip install -r requirements.txt
    ```

5. Install PostgreSQL (version 17)
    - Note: This might take a long time.
    - Windows: <https://www.postgresql.org/download/windows/>
    - Linux: <https://www.postgresql.org/download/linux/>
    - We will use this to be able to connect Django with Postgres!

6. Access the PostgreSQL shell, logged in as the superuser

    ```bash
    cd <directory you installed it to>/17/bin
    psql -U postgres
    ```

    When prompted for a password, use the password you put in the install wizard.

7. Run the following SQL commands:

    ```sql
    CREATE USER <myprojectuser> WITH PASSWORD '<your_secure_password>';
    CREATE DATABASE studygatchi_db OWNER <myprojectuser>;
    GRANT ALL PRIVILEGES ON DATABASE studygatchi_db TO <myprojectuser>;
    \q
    ```

    Replace `<myprojectuser>` with whatever username you want; same for the password

8. Create a file called `settings.py` in the backend directory and copy and paste the contents of `settings_template.txt` into `settings.py`.

    ```bash
    cd backend/
    cp settings_template.txt settings.py
    ```

9. In `settings.py`, go to where it says `DATABASES`, and insert your info from step 6 into the corresponding places.

10. Go back to the root of the project

    ```bash
    cd ../
    ```

11. Run the following commands *with the venv active* to apply migrations:

    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```

12. Test the connection by running this command

    ```bash
    python manage.py runserver
    ```

    If you see the following message, cool stuff, it's working!

    ```text
    WARNING: This is a development server. Do not use it in a production setting. Use a production WSGI or ASGI server instead.
    For more information on production servers see: https://docs.   djangoproject.com/en/6.0/howto/deployment/
    ```

### Arch Linux setup

- This guide assumes an installation that uses `systemd`. If you're using something else like OpenRC or runit, tweak the `systemctl` commands accordingly.

1. Install `uv` and `postgresql`

    ```bash
    pacman -Syu uv postgresql
    ```

2. Create a virtual environment

    ```bash
    uv venv .venv --python 3.12

    # You can also forgo uv and do it the old fashioned way if you prefer
    # python -m venv .venv
    ```

3. Activate the virtual environment

    ```bash
    source .venv/bin/activate
    ```

4. Install the dependencies

    ```bash
    cd backend
    uv pip install -r requirements.txt
    # If you skipped uv
    # pip install -r requirements.txt
    ```

5. Initialize the database cluster

    ```bash
    sudo -u postgres initdb -D /var/lib/postgres/data
    ```

6. Start the PostgreSQL service

    ```bash
    sudo systemctl start postgresql
    ```

    - It's optional, but recommended that you have PostgreSQL run at startup so you don't need to manually start it every time you want to contribute:

    ```bash
    sudo systemctl enable postgresql
    ```

7. Access the PostgreSQL shell, logged in as the superuser:

    ```bash
    psql -U postgres
    ```

8. **Run the following SQL commands:**

    ```sql
    CREATE USER <myprojectuser> WITH PASSWORD '<your_secure_password>';
    CREATE DATABASE studygatchi_db OWNER <myprojectuser>;
    GRANT ALL PRIVILEGES ON DATABASE studygatchi_db TO <myprojectuser>;
    \q
    ```

    Replace `<myprojectuser>` with whatever username you want, and likewise for the password.

9. In the backend directory, create a file called `settings.py` with the contents of `settings_template.txt`.

    ```bash
    cd backend/
    cp settings_template.txt settings.py
    ```

10. In `settings.py`, go to where it says `DATABASES`, and insert your info from step 6 into the corresponding places.

11. Go back to the root of the project

    ```bash
    cd ../
    ```

12. Run the following commands *with the venv active* to apply migrations:

    ```bash
    python3 manage.py makemigrations
    python3 manage.py migrate
    ```

13. Test the connection by running this command:

    ```bash
    python manage.py runserver
    ```

    If you see the following message, cool stuff, it's working!

    ```text
    WARNING: This is a development server. Do not use it in a production setting. Use a production WSGI or ASGI server instead.
    For more information on production servers see: https://docs.   djangoproject.com/en/6.0/howto/deployment/
    ```
