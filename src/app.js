import express from "express";
import api from "./routers/index.js";
import logger from "morgan";
import sequelize from "./db/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();
const port = 8000;

app.use(cors({
    origin: "https://ims-frontend-five-mu.vercel.app/",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));
app.options('*', cors());

app.use(cookieParser());
app.use(express.json());
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));

app.use("/", api);

const syncDb = async () => {
    try {
        await sequelize.sync({force: true });
        console.log("Synced well");
    } catch (error) {
        console.log("Unable to sync", error);
    }
};

syncDb();

app.listen(port, "localhost", () => {
    console.log(`Working on port ${port}`);
});

export default app;
