import express from "express";
import serverless from "serverless-http";
import test from '../src/routes/test';
import jwtAuth from '../src/routes/jwtAuth';
const app = express();
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    hello: "hi!"
  });
});

// app.use(`/.netlify/functions/api`, router);
app.use(`/.netlify/functions/api`, jwtAuth);

export default app;
export const handler = serverless(app);
