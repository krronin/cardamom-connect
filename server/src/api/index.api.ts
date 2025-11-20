import express from "express";
const router = express.Router();

router.get("/", async (req, res) => {
  const db = req.app.locals.db;
  const data = await db.collection("users").find({}).toArray();
  console.log("INDEX API APP:LOCAL.DB", data);
  res.json({
    message: "🦄🌈✨👋🌎🌍🌏✨🌈🦄",
  });
});

export default router;