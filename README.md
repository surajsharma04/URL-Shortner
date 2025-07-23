# URL Shortener Backend

A minimal and fast URL shortening service built with **Node.js**, **Express**, and **SQLite**. It generates short unique links using `nanoid` and validates URLs using `valid-url`.

---

## 🔧 How to Run

```bash
# Navigate to the backend directory
cd backend

# Initialize Node.js project
npm init -y

# Install dependencies
npm install express cors sqlite3 nanoid valid-url

# Start the server
npm start
```

By default, the server runs on **http://localhost:3000**

---

## 📦 Dependencies

- **express** – Web framework  
- **cors** – Cross-Origin Resource Sharing middleware  
- **sqlite3** – Lightweight database  
- **nanoid** – Generates unique short IDs  
- **valid-url** – Validates user-submitted URLs  

---

## 📑 API Endpoints

### `POST /api/shorten`

Shortens a long URL.

**Request:**
```json
{
  "longUrl": "https://example.com/very/long/url"
}
```

**Response:**
```json
{
  "shortId": "a1b2C3d4",
  "shortUrl": "http://localhost:3000/a1b2C3d4",
  "longUrl": "https://example.com/very/long/url"
}
```

---

### `GET /:shortId`

Redirects to the original `longUrl` if the `shortId` is valid.

- **302 Redirect** if found  
- **404 Not Found** if `shortId` does not exist  

---

## 📂 Suggested Project Structure

```
backend/
├── data/                  # SQLite DB storage
│   └── urls.sqlite3
├── src/
│   ├── index.js           # Server entry point
│   ├── db.js              # Database logic
│   ├── routes.js          # API route handlers
│   └── utils.js           # URL validation, helpers
├── package.json
└── README.md
```

---

## ⚙️ Scripts

```json
"scripts": {
  "start": "node src/index.js",
  "dev": "nodemon src/index.js"
}
```

- `npm start` – starts the server  
- `npm run dev` – development mode (if you install nodemon)

---

## 🧪 Optional Enhancements

- Add click tracking and analytics  
- Add expiration to short links  
- Support custom aliases  
- Add web front-end  

---

> Developed by Suraj Sharma
