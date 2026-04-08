import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/events.js";


const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", authRoutes);
app.use("/api", eventRoutes);


app.get("/", (req, res) => {
  res.send("Server running");
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
