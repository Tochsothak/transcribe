import React, { useEffect, useRef, useState } from "react";

export default function HomePage(props) {
  const { setAudioStream, setFile } = props;

  const { recordingStatus, setRecordingStatus } = useState("interactive");
  const { audioChucks, setAudioChanks } = useState([]);

  const { duration, setDuration } = useState(0);
  const mediaRecorder = useRef(null);
  const mimeType = "audio/webm";

  async function startRecording() {
    let tempStream;
    console.log("Start recording");
    try {
      const streamData = navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      tempStream = streamData;
    } catch (err) {
      console.log(err.message);
      return;
    }
    setRecordingStatus("recording");
    //create media recorder instance using the stream
    const media = new MediaRecorder(tempStream, { type: mimeType });
    mediaRecorder.current = media;
    mediaRecorder.current.start();
    let localAudioChunks = [];
    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === "undefined") {
        return;
      }
      if (event.data.size === 0) {
        return;
      }
      localAudioChunks.push[event.data];
    };
    setAudioChanks(localAudioChunks);
  }

  async function stopRecording() {
    setRecordingStatus("interactive");
    console.log("Stop recording");
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
      const audioBlob = new Blob(audioChucks, { type: mimeType });
      setAudioStream(audioBlob);
      audioChucks([]);
      duration(0);
    };
  }

  useEffect(() => {
    if (recordingStatus === "interactive") {
      return;
    }

    const Interval = setInterval(() => {
      setDuration((curr) => curr + 1);
    }, 1000);
    return () => clearInterval(Interval);
  });
  return (
    <main className="flex-1 p-4 flex flex-col text-center justify-center gap-3 sm:gap-4 md:gap-5 pb-20">
      <h1 className="font-semibold text-5xl sm:text-6xl md:text-7xl">
        Free<span className="text-blue-400 bold">Scribe</span>
      </h1>
      <h3 className="font-medium md:text-lg">
        Record<span className="text-blue-400"> &rarr;</span>
        <span>Transcribe</span>
        <span className="text-blue-400"> &rarr;</span>
        <span>Translate</span>
      </h3>

      <button className="flex items-center justify-between max-w-full w-72 mx-auto my-4 specialBtn px-4 py-2 rounded-xl">
        <p className="text-blue-400">
          {recordingStatus === "interact" ? "Record" : "Stop recording"}
        </p>
        <div className="flex items-center gap-2">
          {duration && <p>{duration}s</p>}
          <i
            className={
              "fa-solid duration-200 fa-microphone " +
              (recordingStatus === "recording" ? "text-rose-300" : "")
            }
          ></i>
        </div>
      </button>
      <p className="text-base">
        Or&nbsp;
        <label className="text-blue-400 cursor-pointer hover:text-blue-600 duration-200">
          Upload
          <input
            onChange={(e) => {
              const tempFile = e.target.files[0];
              setFile(tempFile);
            }}
            className="hidden"
            type="file"
            accept="
      .mp3,.wave"
          />
        </label>
        &nbsp; a mp3 file
      </p>
      <p className="italic text-slate-400">Free now free forever</p>
    </main>
  );
}
