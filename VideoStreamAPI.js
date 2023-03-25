const express = require("express");
const app = express();
const server = require("http").Server(app);
const cors = require("cors");
const fs = require("fs");
const ffmpeg = require("ffmpeg-static");
const { spawn } = require("child_process");

app.use(cors());

var bodyParser = require("body-parser");

app.use(bodyParser.json({ limit: "1000mb" }));
app.use(bodyParser.urlencoded({ limit: "1000mb", extended: true }));

//const io = require('socket.io')(server);

//FOR POSTMAN _________________
// app.use(
//   express.urlencoded({
//     extended: true,
//   })
// );____________________________
app.use(express.json());

app.post("/video-stream", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  var fileData = req.body;

  const arrayData = req.body.data;

  const uint8array = new Uint8Array(Object.values(arrayData));

  fs.writeFileSync("eulerian-remote/videos/input.mp4", Buffer.from(uint8array));

  let { PythonShell } = require("python-shell");
  let options = {
    mode: "text",
    args: ["eulerian-remote/videos/input.mp4"],
  };

  PythonShell.run("eulerian-remote/main.py", options, function (err, results) {
    console.log("The script has been Started!");
    console.log(err);
    for (var i = 0; i < results.length; i++) {
      console.log(results[i]);
    }
    console.log("This script is executed!");

    //res.send({ message: results[6] });
  });
});

server.listen(3000, () => {
  console.log("Server listening on port 3000");
});
