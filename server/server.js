// import express from "express";
// import cors from "cors";
// import connectDB from "./configs/db.js";
// import "dotenv/config";
// import router from "./routes/index.js";

// const app = express();
// // eslint-disable-next-line no-undef
// const PORT = process.env.PORT || 3000;

// await connectDB();

// // Middleware
// app.use(express.json());
// app.use(cors());

// //API routes
// app.use("/api", router);

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
import { bootstrap } from './loaders/index.js';
bootstrap();