let { PythonShell } = require("python-shell");

let options = {
  mode: "text",
  args: ["./eulerian-remote/videos/udit.mp4"],
};
PythonShell.run("./eulerian-remote/main.py", options, function (err, results) {
  console.log(err);

  for (var i = 0; i < results.length; i++) {
    console.log(results[i]);
  }

  console.log("This script is executed!");
});
