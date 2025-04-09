# How to Run

1. Setup Backend Environment
   Create `.env` file in backend folder with:

```
MONGODB_URI=mongodb+srv://todo:todopass123@todo.1vflmct.mongodb.net/?retryWrites=true&w=majority&appName=todo
JWT_SECRET=jwt_secret_key
PORT=5000
```

2. Start Backend

```bash
cd backend
npm install
npm start
```

3. Start Frontend

```bash
cd frontend
npm install
npm start
```

The app will be available at http://localhost:3000
