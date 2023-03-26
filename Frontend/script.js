const videoButton = document.getElementById("main__video-button");
const video = document.getElementById("main__video");

const videoFile = new File(["video.mp4"], "video.mp4", { type: "video/mp4" });
const videoBlob = new Blob([videoFile], { type: "video/mp4" });

//////////////////////////////

let usermsg = document.getElementById("usermsg");
let heartratemsg = document.getElementById("heartrate");
let chatgptprompt = document.getElementById("chatgpt");
let heartratetext = document.getElementById("heartRateText");
//////////////////////////////

let mediaRecorder;
let recordedChunks = [];
async function init() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    startWebcam(stream);
  } catch (err) {
    console.log("Error retrieving a media device.");
    console.log(err);
  }
}

function startWebcam(stream) {
  window.stream = stream;
  video.srcObject = stream;
}

function recordingStop() {
  scriptEnd();
  mediaRecorder.stop();
  videoButton.textContent = "fetching";
}

videoButton.onclick = (e) => {
  switch (videoButton.textContent) {
    case "Record":
      scriptStart();
      startRecording();
      setTimeout(recordingStop, 9000);
      videoButton.textContent = "Wait..";
      break;
  }
};

function startRecording() {
  if (video.srcObject === null) {
    video.srcObject = window.stream;
  }
  mediaRecorder = new MediaRecorder(window.stream, {
    mimeType: "video/webm;codecs=vp9,opus",
  });
  mediaRecorder.start(4000);

  mediaRecorder.addEventListener("dataavailable", function (e) {
    console.log(e.data.size);
    recordedChunks.push(e.data);
  });
  mediaRecorder.addEventListener("stop", () => {
    const recording = new Blob(recordedChunks, {
      type: "video/webm;codecs=vp9,opus",
    });

    console.log(recording);
    var arrayPromise = new Promise(function (resolve) {
      var reader = new FileReader();

      reader.onloadend = function () {
        resolve(reader.result);
      };

      reader.readAsArrayBuffer(recording);
    });
    try {
      arrayPromise.then(function (array) {
        console.log("Array contains", array.byteLength, "bytes.");
        var value = new Uint8Array(array);
        try {
          fetch("http://127.0.0.1:3000/video-stream", {
            method: "POST",
            body: JSON.stringify({ data: value }),
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((response) => {
              console.log(response);
              response.json().then(function (res) {
                if (
                  res != null &&
                  res != undefined &&
                  res.bpmRes != null &&
                  res.bpmRes != undefined
                ) {
                  console.log(res.bpmRes);
                  heartGIF.setAttribute("src", "heart.gif");
                  usermsg.innerText = "";
                  heartratetext.innerText = res.bpmRes.slice(0, 17) + " bpm";
                  videoButton.textContent = "Start";
                  return res.bpmRes;
                } else {
                  console.log("Server err!");
                  return "";
                }
              });
              return response.json;
              // response.json();
            })

            .catch((error) => console.error(error));
        } catch (err) {
          console.log(err);
        }
      });
    } catch (error) {
      console.log(error);
    }

    recordedChunks = [];
    console.log("process finished");
  });
}

function recordVideo(event) {
  recordedChunks.push(event.data);
}

init();

////////////////////////

function scriptStart() {
  heartratetext.innerText = "Please wait...";
  usermsg.innerText =
    "Please be patient while the camera is capturing the subject";
  let heartGIF = document.createElement("img");
  heartGIF.setAttribute("id", "heartGIF");
  heartGIF.setAttribute("src", "heartbeat.gif");
  heartratemsg.append(heartGIF);
}

function scriptEnd() {
  usermsg.innerText =
    "Looks good! Please wait while we are processing your video";
}

////////////////////////
