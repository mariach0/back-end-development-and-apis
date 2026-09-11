import express from "express";
import cors from "cors";

const app = express();

app.use(cors({ optionsSuccessStatus: 200 }));

app.use(express.static("public"));

app.get("/", (_req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// Do not change code above this line

app.get('/api', (req, res) => {
  res.status(200).json({
    "unix": new Date().getTime(),
    "utc": new Date().toUTCString()
  })
})

app.get('/api/:date', (req, res) => {
  const date = req.params.date
  const parsed = Number(date) ?  new Date(Number(date)) : new Date(date)

  if (!isNaN(parsed.getTime())) {
    res.status(200).json({
      "unix": parsed.getTime(),
      "utc": parsed.toUTCString()
    })
  } else {
    res.status(400).json({
      "error": "Invalid Date"
    })
  }
})

// Do not change code below this line

const PORT = 8000;
const listener = app.listen(PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
