import "dotenv/config";

import app from "./app.js";
import connectDB from "./database/databaseCnFl.js";

const port = process.env.PORT || 3001;

connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(
                `Example app is running on http://localhost:${port}`
            );
        });
    })
    .catch((err) => {
        console.log("MongoDB connection error", err);
    });