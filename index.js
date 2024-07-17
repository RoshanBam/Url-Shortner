const express = require("express");
const { connectMongoDB } = require("./connection");
const urlRoute = require("./routes/url");
const URL = require("./models/url");
require("dotenv").config();

const app = express();
const PORT = 8000;

connectMongoDB(process.env.MONGO_URI).then(() =>
  console.log("Mongodb connected")
);

app.use(express.json());

app.use("/url", urlRoute);

app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
