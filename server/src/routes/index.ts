import express from "express";

const indexRouter = express.Router();

/* GET home page. */
indexRouter.get("/", async function (req, res, next) {
  const dbInstance = req.app.locals.db;

  if (!dbInstance)
    return res.status(500).json({ error: "Database not initialized" });

  res.json({ success: "FETCHED SUCCESSFULLY" });
});

export default indexRouter;
