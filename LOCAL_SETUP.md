# StudyCubs Local Setup Guide 🚀

Follow these steps to run the project on your local machine.

## 1. Prerequisites
You need the following software installed:
- **Node.js**: [Download here](https://nodejs.org/) (For Frontend)
- **XAMPP / WAMP**: (For PHP & MySQL Backend)

---

## 2. Backend Setup (PHP & MySQL)

1. Open **XAMPP Control Panel** and **Start** Apache and MySQL.
2. **Create Database**:
   - Go to `http://localhost/phpmyadmin`.
   - Create a new database named: `studycubs_db`.
3. **Import Tables**:
   - Select `studycubs_db`.
   - Click the `Import` tab, choose `backend/schema.sql`, and click `Go`.
4. **Move Backend Folder**:
   - Copy the `backend` folder from your project.
   - Paste it in `C:\xampp\htdocs\studycubs\backend`.
5. **Check Database Config**:
   - Open `C:\xampp\htdocs\studycubs\backend\db.php`.
   - Ensure the credentials match your XAMPP settings:
     ```php
     $host = 'localhost';
     $dbname = 'studycubs_db';
     $user = 'root';
     $pass = ''; // Default is empty in XAMPP
     ```

---

## 3. Frontend Setup (React)

1. **Open Terminal**: Navigate to the `frontend` folder.
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Start Development Server**:
   ```bash
   npm run dev
   ```
4. **Access the Site**: Open `http://localhost:5173` in your browser.

---

## 4. Testing Lead Capture

1. Click **"Book Free Demo"** on the website.
2. Fill in the form and submit.
3. Verify:
   - **Database**: Check the `leads` table in phpMyAdmin.
   - **Admin Dashboard**: Go to `http://localhost:5173/admin` to see the lead listed.

---

## 💡 Troubleshooting
- **White Page?**: Check the terminal for errors. Ensure you only have one Router in `main.jsx` and none in `App.jsx`.
- **Form not submitting?**: Ensure XAMPP is running and the path `http://localhost/studycubs/backend/api.php` is correct.
