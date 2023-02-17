import logo from "./logo.svg";
import "./App.css";
import {
  AiOutlinePlus,
  AiOutlineMinus,
  AiFillPlayCircle,
  AiFillPauseCircle,
} from "react-icons/ai";
import { GrPowerReset } from "react-icons/gr";
import { useEffect, useRef, useState } from "react";

function App() {
  const [breakLength, setBreakLength] = useState(5); // 5
  const [sessionLength, setSessionLength] = useState(25); // 25
  const timeConverted = Math.floor(sessionLength * 60);
  const breakConverted = Math.floor(breakLength * 60);
  // 1500 seconds = 25 mins
  const [time, setTime] = useState(1600);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timer, setTimer] = useState(null);
  const [breaker, setBreaker] = useState(null);
  const [breakTime, setBreakTime] = useState(1600);
  const [isBreak, setIsBreak] = useState(false);
  const alarmRef = useRef(null);

  const handleReset = () => {
    setBreakLength(5);
    setSessionLength(25);
    alarmRef.current.stop();
  };

  const handleControls = (action) => {
    if (!isPlaying) {
      if (action === "break-decrement") {
        if (breakLength === 1) return;
        setBreakLength(breakLength - 1);
      }

      if (action === "break-increment") {
        if (breakLength >= 60) return;
        setBreakLength(breakLength + 1);
      }

      if (action === "session-decrement") {
        if (sessionLength === 1) return;
        setSessionLength(sessionLength - 1);
      }

      if (action === "session-increment") {
        if (sessionLength >= 60) return;
        setSessionLength(sessionLength + 1);
      }
    }
  };

  function timeConversion(value) {
    const minutes = Math.floor(value / 60);
    const seconds = value % 60;

    const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;

    return formattedTime;
  }

  const toggleTimer = () => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
      setIsPlaying(false);
    } else {
      const countdown = setInterval(() => {
        setTime((time) => time - 1);
      }, 1000);
      setTimer(countdown);
      setIsPlaying(true);
    }
  };

  const toogleBreaker = () => {
    if (breaker) {
      clearInterval(breaker);
      setBreaker(null);
      setIsPlaying(false);
    } else {
      const countdown = setInterval(() => {
        setBreakTime((breakTime) => breakTime - 1);
      }, 1000);
      setBreaker(countdown);
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    setTime(timeConverted);
    setBreakTime(breakConverted);
  }, [sessionLength, breakLength]);

  useEffect(() => {
    if (time === 0 && isBreak === false) {
      clearInterval(timer);
      setTimer(null);
      setTime(timeConverted);
      setIsBreak(true);
      toogleBreaker();
      alarmRef.current.play();
    }
    if (breakTime === 0 && isBreak === true) {
      clearInterval(breaker);
      setBreaker(null);
      setBreakTime(breakConverted);
      setIsBreak(false);
      toggleTimer();
    }
  }, [time, breakTime, isBreak]);

  function calcualteFraction(value) {
    let timeFraction = value / timeConverted;
    const circleFraction = 785;
    const circleDasharray = `${(timeFraction * circleFraction).toFixed(0)} 785`;

    return circleDasharray;
  }

  // useEffect(() => {
  //   handleCircleAnimation();
  // }, [time]);

  // console.log(time, breakTime, timer, breaker);

  return (
    <div className="clock">
      <div className="container column">
        <div className="timer-wrapper column">
          <div className="timer-inner">
            <audio id="beep" src="./alarm.wav" ref={alarmRef} />
            <span id="timer-label" className="label">
              {!isBreak ? "Session" : "Break"}
            </span>
            <div id="time-left">
              {!isBreak ? timeConversion(time) : timeConversion(breakTime)}
            </div>
            <button id="reset" onClick={() => handleReset()}>
              <GrPowerReset />
            </button>
          </div>

          <div id="circle">
            <svg>
              <circle
                cx="125"
                cy="125"
                r="125"
                fill="rgba(0,0,0,0)"
                stroke="var(--dark)"
                strokeWidth="6"
              ></circle>

              <path
                fill="rgba(0,0,0,0)"
                stroke="var(--green)"
                strokeLinecap="round"
                strokeWidth="6"
                strokeDasharray={calcualteFraction(time)}
                d="M 0, 125
      a 125,125 0 1,0 250,0
      a 125,125 0 1,0 -250,0"
                className={isBreak ? "hidden" : "visible"}
              ></path>
              <path
                fill="rgba(0,0,0,0)"
                stroke="var(--red)"
                strokeLinecap="round"
                strokeWidth="6"
                strokeDasharray={calcualteFraction(breakTime)}
                d="M 0, 125
      a 125,125 0 1,0 250,0
      a 125,125 0 1,0 -250,0"
                className={isBreak ? "visible" : "hidden"}
              ></path>
            </svg>
          </div>
        </div>

        <div className="controls row">
          <div className="break column">
            <span id="break-length" className="length-value">
              {breakLength}
            </span>
            <div className="button-control row">
              <button
                id="break-decrement"
                onClick={(e) => handleControls(e.currentTarget.id)}
              >
                <AiOutlineMinus />
              </button>
              <span className="divider" />
              <button
                id="break-increment"
                onClick={(e) => handleControls(e.currentTarget.id)}
              >
                <AiOutlinePlus />
              </button>
            </div>
            <div id="break-label" className="label">
              Break Length
            </div>
          </div>

          <div className="session column">
            <span id="session-length" className="length-value">
              {sessionLength}
            </span>
            <div className="button-control row">
              <button
                id="session-decrement"
                onClick={(e) => handleControls(e.currentTarget.id)}
              >
                <AiOutlineMinus />
              </button>
              <span className="divider" />
              <button
                id="session-increment"
                onClick={(e) => handleControls(e.currentTarget.id)}
              >
                <AiOutlinePlus />
              </button>
            </div>
            <div id="session-label" className="label">
              Session Length
            </div>
          </div>
        </div>
        <div className="playback-control">
          <button
            id="start_stop"
            onClick={() => (!isBreak ? toggleTimer() : toogleBreaker())}
          >
            {isPlaying ? <AiFillPauseCircle /> : <AiFillPlayCircle />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
