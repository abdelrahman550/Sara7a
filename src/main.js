import express from "express";
import { NotFoundException } from "./common/exceptions/error.exception.js";
import { PORT } from "./config.js";
import { bootstrapDB } from "./DB/connection.db.js";
import { UserModel } from "./DB/models/user.model.js";
import { globalErrorHandler } from "./middleware/index.js";
import { authenticationController, usersController } from "./modules/index.js";
import cors from "cors"

const app = express();

app.use(cors())
app.use(express.json());

app.use("/users", usersController);
app.use("/auth", authenticationController);

app.all("{/*dummy}", (req, res, next) => {
  next(NotFoundException("Invalid app route"));
});

app.use(globalErrorHandler);

async function bootstrap() {
  try {
    await bootstrapDB();
    await UserModel.syncIndexes();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to DB:", error.message);
    process.exit(1);
  }
}

bootstrap();
