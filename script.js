let mediaRecorder;
let audioChunks = [];
let timerInterval;
let secondsElapsed = 0;

const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");
const downloadLink = document.getElementById("download-link");
const timerElement = document.getElementById("timer");

// Function to format time as MM:SS
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return (
        String(minutes).padStart(2, "0") +
        ":" +
        String(remainingSeconds).padStart(2, "0")
    );
}

// Function to start the timer
function startTimer() {
    secondsElapsed = 0;
    timerElement.textContent = "00:00";
    timerInterval = setInterval(() => {
        secondsElapsed++;
        timerElement.textContent = formatTime(secondsElapsed);
    }, 1000);
}

// Function to stop the timer
function stopTimer() {
    clearInterval(timerInterval);
}

// Start recording
startBtn.addEventListener("click", async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        startBtn.disabled = true;
        stopBtn.disabled = false;

        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
          const audioUrl = URL.createObjectURL(audioBlob);
          downloadLink.href = audioUrl;
          downloadLink.download = `recording_${new Date().toISOString()}.wav`;
          downloadLink.style.display = "block";
          downloadLink.textContent = "Download Audio";
          startBtn.disabled = false;
          stopBtn.disabled = true;
          stopTimer();
        };

        mediaRecorder.start();
        startTimer();
    } catch (error) {
        console.error("Error accessing microphone:", error);
        alert("Microphone access is required for recording.");
    }
});

stopBtn.addEventListener("click", () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
    }
 });