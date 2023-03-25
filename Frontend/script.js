const videoButton = document.getElementById("main__video-button");
const video = document.getElementById("main__video");

const videoFile = new File(["video.mp4"], "video.mp4", { type: "video/mp4" });
const videoBlob = new Blob([videoFile], { type: "video/mp4" });

//var FileSaver = require("file-saver");

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

videoButton.onclick = (e) => {
  switch (videoButton.textContent) {
    case "Record":
      startRecording();
      videoButton.textContent = "Stop";
      break;
    case "Stop":
      videoButton.textContent = "Record";
      mediaRecorder.stop();
      e.preventDefault();
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
  //mediaRecorder.ondataavailable = recordVideo;

  mediaRecorder.addEventListener("dataavailable", function (e) {
    console.log(e.data.size);
    recordedChunks.push(e.data);
    // e.data
    //   .stream()
    //   .getReader()
    //   .read()
    //   .then(({ done, value }) => {
    //     // If there is no more data to read
    //     if (done) {
    //       console.log("done", done);
    //       // controller.close();
    //       return;
    //     }
    //     // Get the data and send it to the browser via the controller
    //     //controller.enqueue(value);
    //     // Check chunks by logging to the console
    //     console.log(done, value);
    //     // API Call

    //     fetch("http://127.0.0.1:3000/video-stream", {
    //       method: "POST",
    //       body: JSON.stringify({ data: value }),
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     })
    //       .then((response) => response.json())
    //       .then((data) => console.log(data))
    //       .catch((error) => console.error(error));
    //   });
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
           // response.json();
          }
          )
          .then((data) => {
            console.log(data);
            return data.json();
          })
          .catch((error) => console.error(error));
  
        } catch (err) {
          console.log(err)
        }      
      });
      
    } catch (error) {
      console.log(error);
    }

    
    recordedChunks = [];
    console.log('process finished');
  });
}

function function2() {
  // all the stuff you want to happen after that pause
  console.log("Blah blah blah blah extra-blah");
}

function recordVideo(event) {
  recordedChunks.push(event.data);
  // if (event.data && event.data.size > 0) {
  //   console.log(event.data.stream().getReader());

  //   event.data
  //     .stream()
  //     .getReader()
  //     .read()
  //     .then(({ done, value }) => {
  //       // If there is no more data to read
  //       if (done) {
  //         console.log("done", done);
  //         // controller.close();
  //         return;
  //       }
  //       // Get the data and send it to the browser via the controller
  //       //controller.enqueue(value);
  //       // Check chunks by logging to the console
  //       console.log(done, value);
  //       // API Call

  //       fetch("http://127.0.0.1:3000/video-stream", {
  //         method: "POST",
  //         body: JSON.stringify({ data: value }),
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       })
  //         .then((response) => response.json())
  //         .then((data) => console.log(data))
  //         .catch((error) => console.error(error));
  //     });

  //   // console.log(event.data.size);
  //   // video.srcObject = null;
  //   // let videoUrl = URL.createObjectURL(event.data);
  //   // video.src = videoUrl;
  //   // alert(videoUrl);
  // }
}

// function stopRecording() {
//   mediaRecorder.stop();
// }

// async function handleStop(e) {
//   //console.log(e);
// }

init();
