## How to Run

1. Clone the repository and navigate to the project directory

```bash
git clone https://github.com/your-username/to-do-task.git
cd to-do-task
```

2. Setup Backend Environment
   Create `.env` file in backend folder with:

```
MONGODB_URI=mongodb+srv://todo:todopass123@todo.1vflmct.mongodb.net/?retryWrites=true&w=majority&appName=todo
JWT_SECRET=jwt_secret_key
PORT=5000
JWT_EXPIRE=24h
```

3. Start Backend

```bash
cd backend
npm install
npm start
```

4. Start Frontend
   Open a new terminal and run:

```bash
cd frontend
npm install
npm start
```

The app will be available at http://localhost:3000
