let recorder;
let chunks = [];
let stream;
let isRecording = false;
let timerInterval;
let seconds = 0;

const status = document.getElementById("status");
const indicator = document.getElementById("indicator");
const recText = document.getElementById("recText");
const timer = document.getElementById("timer");
const recordBtn = document.getElementById("recordBtn");

function formatTime(sec) {
  const mins = Math.floor(sec / 60);
  const secs = sec % 60;
  return `${String(mins).padStart(2,"0")}:${String(secs).padStart(2,"0")}`;
}

function startTimer() {
  seconds = 0;
  timerInterval = setInterval(() => {
    seconds++;
    timer.innerText = formatTime(seconds);
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timer.innerText = "00:00";
}

recordBtn.onclick = async () => {

  if (!isRecording) {

    try {
      stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });

      recorder = new MediaRecorder(stream);

      recorder.ondataavailable = e => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "meeting-recording.webm";
        a.click();

        chunks = [];
        stream.getTracks().forEach(track => track.stop());

        indicator.classList.remove("recording");
        recText.innerText = "Not Recording";
        stopTimer();

        recordBtn.innerText = "Start Recording";
        recordBtn.classList.remove("danger");
        recordBtn.classList.add("primary");

        status.innerText = "Recording saved";
        isRecording = false;

        setTimeout(() => {
          window.close();
        }, 800);
      };

      recorder.start();

      indicator.classList.add("recording");
      recText.innerText = "Recording...";
      startTimer();

      recordBtn.innerText = "Stop Recording";
      recordBtn.classList.remove("primary");
      recordBtn.classList.add("danger");

      status.innerText = "Recording started";
      isRecording = true;

    } catch (err) {
      status.innerText = "Permission denied or error occurred";
    }

  } else {
    recorder.stop();
    status.innerText = "Stopping...";
  }
};

document.getElementById("closeBtn").onclick = () => {
  window.close();
};