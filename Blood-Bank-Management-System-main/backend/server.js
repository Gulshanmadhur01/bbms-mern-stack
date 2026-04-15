import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import donorRoutes from "./routes/donorRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import facilityRoutes from "./routes/facilityRoutes.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import systemRoutes from "./routes/systemRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";
import { swaggerUi, swaggerDocs } from "./openapi/index.js"
import { startAIEngine } from "./utils/automationJob.js";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      // For beginners, we'll allow all in production too if FRONTEND_URL is not set, 
      // but ideally you'd set FRONTEND_URL on Render.
      callback(null, true); 
    }
  },
  credentials: true,
}));

app.use('/api/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// 🧩 Routes

app.use("/api/auth", authRoutes);


app.use("/api/donor", donorRoutes);

app.use("/api/facility", facilityRoutes);

app.use("/api/admin", adminRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/system", systemRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/chatbot", chatbotRoutes);



import bloodLabRoutes from "./routes/bloodLabRoutes.js";
app.use("/api/blood-lab", bloodLabRoutes);


import hospitalRoutes from "./routes/hospitalRoutes.js";
app.use("/api/hospital", hospitalRoutes);


// 🗄️ DB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
     console.log("MongoDB Connected ✅");
     startAIEngine();
  })
  .catch((err) => console.log("MongoDB Error ❌", err));

// 🚀 Serve Static Frontend Files
const frontendPath = path.resolve(__dirname, "../frontend/dist");
app.use(express.static(frontendPath));

// 🌐 Catch-all route to serve the frontend index.html
// 🌐 Catch-all route to serve the frontend index.html
// This regex matches any path that does NOT start with /api
app.get(/^(?!\/api).+/, (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"), (err) => {
    if (err) {
      res.status(500).send("Error loading frontend. Did you run 'npm run build' in the frontend folder?");
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
