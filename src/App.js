import './App.css';
import React, {useState } from 'react'
import Intervals from './Intervals';
import { IconButton } from '@mui/material';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';


const defaultSession = 25*60; //minutes to seconds
const defaultBreak = 5*60; //minutes to seconds
const secondInMs = 1000;
let timer;
let isOnBreak=false;


function App() {

  const [display,setDisplay] = useState(defaultSession); 
  const [breakTime,setBreakTime] = useState(defaultBreak); 
  const [sessionTime,setSessionTime] = useState(defaultSession);
  const [timerOn,setTimerOn] = useState(false);
  const [onBreak,setOnBreak] = useState(false);


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

  const playPause = () =>{
    let time = new Date().getTime();
    let nextTime = new Date().getTime() + secondInMs;
    if(!timerOn){
      timer = setInterval(() => {
         time = new Date().getTime();
         if(time > nextTime){
            setDisplay( (prev) => {
              if(prev>0){
                console.log('Counting ' + prev)
                console.log(isOnBreak);
                return prev-1
              } else {
                let returnValue;
                isOnBreak ? console.log('Switch to Session') : console.log('Swtch to break');
                isOnBreak ?  isOnBreak=false : isOnBreak=true;
                isOnBreak ?  setOnBreak(false) : setOnBreak(true);
                isOnBreak ?  returnValue = sessionTime : returnValue = breakTime;
                return returnValue;
              }
              })
              nextTime += secondInMs
              }
      },1000);
    }
    if(timerOn){
      clearInterval(timer);
    }
    setTimerOn(!timerOn)
  }
    
  const reset = () =>{
    clearInterval(timer);
    setDisplay(defaultSession);
    setBreakTime(defaultBreak);
    setSessionTime(defaultSession);
    setTimerOn(false);
    setOnBreak(false);
  }


  return (
    <div className="App">
      <header className="App-header">
        <h1>Jake's 25 - 5 Clock</h1>
        <div id='app-all'>  

          <Intervals id='break-label' title='Break Length' changeTime={changeTime} type='break' time={breakTime} formatTime={formatTime}/>

          <div id='timer-group'>
            <h1 id ='time-left'>{formatTime(display)}</h1>
            <h5 id='in-on'>{onBreak ? 'On' : 'In'}</h5>
            <h4 id='timer-label'>{onBreak ? 'Break' : 'Session'}</h4>
            <div id='timer-buttons'>
              <IconButton id='start_stop' color='warning' onClick={()=> playPause()}>{timerOn ? <PauseCircleOutlineIcon/> : <PlayCircleOutlineIcon/>}</IconButton>
              <IconButton id='reset' color='warning' onClick={()=> reset()}> <RotateLeftIcon/> </IconButton>
            </div>
          </div>

          <Intervals id='session-label' title='Session Length' changeTime={changeTime} type='session' time={sessionTime} formatTime={formatTime}/>
 
        </div>
      </header>
    </div>
  );
}

export default App;
