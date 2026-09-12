const isProd = process.env.NODE_ENV === "production";

const sendDev = (error, res) => {
  return res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    extra: error.extra,
    stack: error.stack,
    error,
  });
};

const sendProd = (error, res) => {
  if (error.isOperational) {
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
      extra: error.extra,
    });
  }

  console.error(error);
  return res.status(500).json({
    status: "error",
    message: "Something went wrong",
  });
};

export const globalErrorHandler = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (isProd) {
    sendProd(error, res);
  } else {
    sendDev(error, res);
  }
};