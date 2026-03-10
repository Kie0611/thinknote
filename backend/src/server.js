import express from 'express';
import cookieParser from 'cookie-parser';
import { ENV } from './lib/env.js';
import { connectDB } from '../config/db.js';
import authRoutes from './routes/authRoutes.js';
import folderRoutes from './routes/folderRoutes.js'
import noteRoutes from './routes/noteRoutes.js'

const app = express();
const PORT = ENV.PORT;

app.use(express.json()); //req.body
app.use(cookieParser()) //req.cookies

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/folders", folderRoutes)
app.use("/api/v1/notes", noteRoutes)

app.listen(PORT, () => {
  console.log('Server is running on port:', PORT);
  connectDB();
});