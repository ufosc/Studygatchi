# Studygatchi

Studygatchi is an open-source Chrome/Firefox extension that encourages productivity and studying through combining Tamagotchi-style pet mechanics and gachapon/gambling!

We use a Django REST backend, PostgreSQL database, and a React frontend powered with Vite.

Check out UF OSC's other projects here: <https://ufosc.org/projects/>

## Quickstart with Docker

The fastest way to get the full stack running locally is by using Docker Compose.

### Prerequsites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) or [Docker Engine](https://docs.docker.com/compose/install/) with the `docker-compose` plugin.
- Make sure you have [Node.js](https://nodejs.org/) (version 18+ or 20+) installed on your machine.

#### Optional

- [tmux](https://github.com/tmux/tmux) or similar will be nice to have if you are running both the frontend and backend simultaneously.

### Setup

1. To setup the project, first fork the OSC repo. Then clone:

    ```bash
    # To clone
    git clone https://github.com/[INSERT YOUR GITHUB USERNAME HERE]/Studygatchi.git
    cd Studygatchi/
    ```

2. Configure your environment variables

    Copy the `.env-example` in the project's root and name the copy `.env`. You may change the fields inside if you wish.

3. Start the backend

    ```bash
    docker compose up --build
    ```

4. Start the frontend

    ```bash
    npm run dev
    ```

    You can type 'o' into the Vite prompt to open the project in your default browser. Note that it will be a regular webpage, not an extension.

5. Access the services:

    - Frontend: <http://localhost:5173>
    - Backend: <http://localhost:8000/>
    - PostgreSQL database: localhost:5432

### Testing

Run your tests locally with the `.venv` active by doing the following:

```bash
cd backend/
pytest
```

You can also run them in Docker if you prefer:

```bash
docker compose exec backend pytest
```

### Notes

- If you're having issues connecting to the backend, make sure that the PostgreSQL service is running on your system. You might need to do this manually with `sudo systemctl status postgresql`. Verify that your credentials in `.env` and `settings.py` match the fields in PostgreSQL.

---

## Manual Setup

If you prefer to run the backend directly on your host machine without containerizing.

### Frontend Setup

#### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (version 18+ or 20+) installed on your machine.

#### Setup

1. To setup the project, first fork the OSC repo. Then clone:

    ```bash
    # To clone
    git clone https://github.com/[INSERT YOUR GITHUB USERNAME HERE]/Studygatchi.git
    cd Studygatchi/
    ```

2. Install the dependencies:

    ```bash
    cd frontend
    npm install
    ```

#### Development

Start the development server:

```bash
npm run dev
```

Inside your terminal, enter 'o' to open the project in your browser.

#### Build

To create a production build for later importation as a Chrome extension:

```bash
npm run build
```

This will generate the build files in the `build` directory.

### Backend Setup

#### Prerequisites

This guide expects that you have [Python](https://www.python.org/downloads/) (At least 3.12.0) installed.

- For macOS users, if Python was installed via either Homebrew or the official Python installer, you may need to use `python3` and `pip3` instead of `python` and `pip`.

#### Windows & Generic Linux Setup

1. To setup the project, first fork the OSC repo. Then clone:

    ```bash
    # To clone
    git clone https://github.com/[INSERT YOUR GITHUB USERNAME HERE]/Studygatchi.git
    cd Studygatchi/
    ```

2. Install `uv`

    ```powershell
    # Windows Powershell
    powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
    ```

    ```bash
    # macOS and Linux
    curl -LsSf https://astral.sh/uv/install.sh | sh
    ```

    You may need to restart your shell before `uv` appears on your path.

3. Create a virtual environment

    ```bash
    uv venv .venv --python 3.12

    # You can also forgo uv and do it the old fashioned way if you prefer
    # python -m venv .venv
    ```

4. Activate the virtual environment

    ```bash
    # macOS and Linux
    source .venv/bin/activate

    # Windows Powershell
    source .venv\Scripts\Activate.ps1
    ```

5. Install the dependencies

    ```bash
    cd backend
    uv pip install -r requirements.txt
    # If you skipped uv
    # pip install -r requirements.txt
    ```

6. Install PostgreSQL (version 17)
    - Note: This might take a long time.
    - Windows: <https://www.postgresql.org/download/windows/>
    - Linux: <https://www.postgresql.org/download/linux/>
    - We will use this to be able to connect Django with Postgres!

7. Access the PostgreSQL shell, logged in as the superuser

    ```bash
    cd <directory you installed it to>/17/bin
    psql -U postgres
    ```

    When prompted for a password, use the password you put in the install wizard.

8. Run the following SQL commands:

    ```sql
    CREATE USER <myprojectuser> WITH PASSWORD '<your_secure_password>';
    CREATE DATABASE studygatchi_db OWNER <myprojectuser>;
    GRANT ALL PRIVILEGES ON DATABASE studygatchi_db TO <myprojectuser>;
    \q
    ```

    Replace `<myprojectuser>` with whatever username you want; same for the password

9. Create a file called `settings.py` in the backend directory and copy and paste the contents of `settings_template.txt` into `settings.py`.

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
    python manage.py makemigrations
    python manage.py migrate
    ```

13. Test the connection by running this command

    ```bash
    python manage.py runserver
    ```

    If you see the following message, cool stuff, it's working!

    ```text
    WARNING: This is a development server. Do not use it in a production setting. Use a production WSGI or ASGI server instead.
    For more information on production servers see: https://docs.   djangoproject.com/en/6.0/howto/deployment/
    ```

#### Arch Linux setup

- This guide assumes an installation that uses `systemd`. If you're using something else like OpenRC or runit, tweak the `systemctl` commands accordingly.

1. To setup the project, first fork the OSC repo. Then clone:

    ```bash
    # To clone
    git clone https://github.com/[INSERT YOUR GITHUB USERNAME HERE]/Studygatchi.git
    cd Studygatchi/
    ```

2. Install `uv` and `postgresql`

    ```bash
    pacman -Syu uv postgresql
    ```

3. Create a virtual environment

    ```bash
    uv venv .venv --python 3.12

    # You can also forgo uv and do it the old fashioned way if you prefer
    # python -m venv .venv
    ```

4. Activate the virtual environment

    ```bash
    source .venv/bin/activate
    ```

5. Install the dependencies

    ```bash
    cd backend
    uv pip install -r requirements.txt
    # If you skipped uv
    # pip install -r requirements.txt
    ```

6. Initialize the database cluster

    ```bash
    sudo -u postgres initdb -D /var/lib/postgres/data
    ```

7. Start the PostgreSQL service

    ```bash
    sudo systemctl start postgresql
    ```

    - It's optional, but recommended that you have PostgreSQL run at startup so you don't need to manually start it every time you want to contribute:

    ```bash
    sudo systemctl enable postgresql
    ```

8. Access the PostgreSQL shell, logged in as the superuser:

    ```bash
    psql -U postgres
    ```

9. **Run the following SQL commands:**

    ```sql
    CREATE USER <myprojectuser> WITH PASSWORD '<your_secure_password>';
    CREATE DATABASE studygatchi_db OWNER <myprojectuser>;
    GRANT ALL PRIVILEGES ON DATABASE studygatchi_db TO <myprojectuser>;
    \q
    ```

    Replace `<myprojectuser>` with whatever username you want, and likewise for the password.

10. In the backend directory, create a file called `settings.py` with the contents of `settings_template.txt`.

    ```bash
    cd backend/
    cp settings_template.txt settings.py
    ```

11. In `settings.py`, go to where it says `DATABASES`, and insert your info from step 6 into the corresponding places.

12. Go back to the root of the project

    ```bash
    cd ../
    ```

13. Run the following commands *with the venv active* to apply migrations:

    ```bash
    python3 manage.py makemigrations
    python3 manage.py migrate
    ```

14. Test the connection by running this command:

    ```bash
    python manage.py runserver
    ```

    If you see the following message, cool stuff, it's working!

    ```text
    WARNING: This is a development server. Do not use it in a production setting. Use a production WSGI or ASGI server instead.
    For more information on production servers see: https://docs.   djangoproject.com/en/6.0/howto/deployment/
    ```

### Loading Studygatchi in Chrome

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
