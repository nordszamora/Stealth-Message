# StealthMessage

**StealthMessage** is a designed platform that allows users to send and receive
anonymous messages without revealing its identity. The platform was inspired on NGL.

## Features

- **Anonymous Messaging:** Send and receive messages without disclosing your
identity.
- **User Profiles:** Create and customize profiles.
- **Message Notifications:** Receive notifications for new anonymous messages.
- **Simple UI:** User-friendly design for ease of use.

## Technologies Used

- **Frontend:** ReactJS with Vite
- **Backend:** Flask
- **Database:** MySQL
- **Deployment:** Vercel (frontend) and PythonAnywhere (backend)
- **Authentication:** JWT cookies

## Getting Started
Install this project on your local machine and here are following steps.

### Installation

1. **Clone the Repository**

   ```
   $ git clone https://github.com/nordszamora/Stealth-Message.git

   $ cd Stealth-Message

   $ pip install -r requirements.txt
   ```

2. **Backend setup**

   ```
   $ cd backend

   $ flask db init

   $ flask db migrate -m 'stealthy'

   $ flask db upgrade

   $ py app.py
   ```

3. **Frontend setup**

   ```
   $ cd frontend

   $ npm install

   $ npm run dev
   ```

Open your browser and run http://localhost:5173

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
