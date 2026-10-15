import cors from "cors";
import express from "express";
import helmet from "helmet";
import {
  AppError,
  NotFoundException,
} from "./common/exceptions/error.exception.js";
import { generateLimiter } from "./common/utils/index.js";
import { APPLICATION_NAME, ORIGINS, PORT } from "./config.js";
import { bootstrapDB } from "./DB/connection.db.js";
import { bootstrapRedis } from "./DB/connection.redis.js";
import {
  ConversationMessageModel,
  ConversationModel,
  MessageModel,
  RevealRequestModel,
  UserModel,
} from "./DB/models/index.js";
import { globalErrorHandler } from "./middleware/index.js";
import {
  authenticationController,
  conversationsController,
  messagesController,
  revealRequestsController,
  usersController,
} from "./modules/index.js";
import morgan from "morgan";

const fixedORIGINS = (ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (origin && fixedORIGINS.includes(origin)) {
      return callback(null, true);
    }
    return callback(new AppError("unauthorized origin.", 401));
  },
};

const app = express();

app.set("trust proxy", true);

const limiter = generateLimiter({});

app.use(helmet(), cors(), morgan("common"), limiter, express.json());
app.use("/assets", express.static("./assets"));

app.all("/", (req, res) =>
  res.status(200).send({ message: `Welcom to ${APPLICATION_NAME}'s API` }),
);

app.use("/users", usersController);
app.use("/messages", messagesController);
app.use("/auth", authenticationController);
app.use("/reveal-requests", revealRequestsController);
app.use("/conversations", conversationsController);

app.all("{/*dummy}", (req, res, next) => {
  next(NotFoundException("Invalid app route"));
});

app.use(globalErrorHandler);

async function bootstrap() {
  try {
    await bootstrapDB();
    await bootstrapRedis();

    await UserModel.syncIndexes();
    await MessageModel.syncIndexes();
    await RevealRequestModel.syncIndexes();
    await ConversationModel.syncIndexes();
    await ConversationMessageModel.syncIndexes();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to DB:", error.message);
    process.exit(1);
  }
}

await bootstrap();
