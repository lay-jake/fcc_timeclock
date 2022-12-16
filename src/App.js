import './App.css';
import React, {useState } from 'react'
import Intervals from './Intervals';
import { IconButton } from '@mui/material';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import beep from './beep.mp3'



const defaultSession = 25*60; //minutes to seconds
const defaultBreak = 5*60; //minutes to seconds
const secondInMs = 1000;
let timer;
let isOnBreak = false;

function App() {

  const [display,setDisplay] = useState(defaultSession); 
  const [breakTime,setBreakTime] = useState(defaultBreak); 
  const [sessionTime,setSessionTime] = useState(defaultSession);
  const [timerOn,setTimerOn] = useState(false);
  const [onBreak,setOnBreak] = useState(false);
  const [audio,setAudio] = useState(new Audio(beep));

  /**
   * @param {Empty} - None ; just executes audio file
   */
  const playAudio =()=>{
    audio.currentTime = 0;
    audio.play();
  }

  /**
   * Function will determine to add or subtract time from session or break states.
   * Will not let go under 1 or over 60
   * 
   * @param {int} time - Defined in Intervals as constant - typically (60) or (-60) 
   * @param {string} type - Break or Session 
   * @returns 
   */

  const changeTime = (time,type) => {
   
    switch(type){

      case 'break':
        if(timerOn){
          return;
        } else if (sessionTime !== display){
          reset();
        }

        if(breakTime <= (60 /* 60 Seconds = 1min*/) && time < 0){return}
        if(breakTime >= (60*60 /*Minutes to Seconds*/) && time > 0){return}

        setBreakTime((prev) => prev + time);
        
        break;

      case 'session':
        if(timerOn){
          return;
        } else if (sessionTime !== display){
          reset();
        }

        if(sessionTime <= (60 /* 60 Seconds = 1min*/) && time < 0){return}
        if(sessionTime >= (60*60 /*Minutes to Seconds*/) && time > 0){return}

          setSessionTime((prev) => prev + time);

          if (!timerOn){
              setDisplay((prev) => prev + time)
            }
            break;
       default:
            return;
    }
  }

  /**
   * 
   * @param {integer} time - provide to be converted
   * @returns formatted string for time as MM:SS
   * 
   */

  const formatTime = (time) => {
     let minutes = Math.floor(time/60);
     let seconds = time % 60;
    return (`${minutes.toLocaleString('en-us',{minimumIntegerDigits:2,useGrouping:false})}:${seconds.toLocaleString('en-us',{minimumIntegerDigits:2,useGrouping:false})}`)
  }

  /**
   * 
   * @param {none} - function checks to see if this is a play or pause action, gets new time/date and then sets a marker 1s in the future.
   *                 Interval set up to check marker to see if we have passed it, if we do drops display time by a second and then replaces marker with a new one
   *                 once we reach zero, changes display to opposite of what it is, sets new markers and continues until broken by reset or pause action.
   * 
   */

  const playPause = () =>{
    let time = new Date().getTime();
    let nextTime = new Date().getTime() + secondInMs;
    if(!timerOn){
      timer = setInterval(() => {
         time = new Date().getTime();
         if(time > nextTime){
            setDisplay( (prev) => {
              if(prev<=0 && !isOnBreak){
                playAudio();
                isOnBreak = true;
                setOnBreak(true);
                return breakTime
              } else if (prev<=0 && isOnBreak){
                playAudio();
                isOnBreak=false;
                setOnBreak(false)
                return sessionTime;
              } else {
                return prev-1
              }
              })
              nextTime += secondInMs
              }
      },30);
    }
    if(timerOn){
      clearInterval(timer);
    }
    setTimerOn(!timerOn)
  }
  
  /**
   * 
   * @param {None} - Calls for a reset on variables to original state
   * 
   */
  const reset = () =>{
    clearInterval(timer);
    setTimerOn(false);
    setOnBreak(false);
    isOnBreak=false;
    setDisplay(defaultSession);
    setBreakTime(defaultBreak);
    setSessionTime(defaultSession);
  }


  return (
    <div className="App">
      <header className="App-header">
        <h1>Jake's Clock</h1>
        <div id='app-all'>
        <div className={sessionTime !== display ? (isOnBreak ? 'active' :''): ''}> 
          <Intervals className="running" id='break-label' title='Break Length' changeTime={changeTime} type='break' time={breakTime} formatTime={formatTime}/>
          </div>
            <div className={ sessionTime !== display ? (timerOn ? 'running': 'paused'): ""} id='timer-group'>
                <h1 id ='time-left'>{formatTime(display)}</h1>
                <h5 id='in-on'>{isOnBreak ? 'On' : 'In'}</h5>
                <h4 id='timer-label'>{isOnBreak ? 'Break' : 'Session'}</h4>
                <div id='timer-buttons'>
                  <IconButton id='start_stop' color='warning' onClick={()=> playPause()}>{timerOn ? <PauseCircleOutlineIcon/> : <PlayCircleOutlineIcon/>}</IconButton>
                  <IconButton id='reset' color='warning' onClick={()=> reset()}> <RotateLeftIcon/> </IconButton>
                </div>
          </div>
          <div className={sessionTime !== display ? (isOnBreak ? '' : 'active'): ''}> 
          <Intervals id='session-label' title='Session Length' changeTime={changeTime} type='session' time={sessionTime} formatTime={formatTime}/>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
