import React from "react";
import IconButton from '@mui/material/IconButton';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import './App.css'

//Setting time inc in seconds
const timeIncrement = 60;

export default function Intervals({title, changeTime, type, time, formatTime}){

    return(
        <>
         <div id={`${type}-label`}>
            <IconButton className = 'adjust-button' id={`${type}-decrement`} onClick={()=> changeTime(-timeIncrement,type)} color='warning'><RemoveIcon/></IconButton>
            <div id={`${type}-detail`}>
                <h5 id={`${type}-length`}>{ time <= 540 ? formatTime(time).substring(1,2) : formatTime(time).substring(0,2)}</h5> 
                                                {/* We have to use substrings to pass testing; they dont want formated numbers*/}
                <h4 id={`${type}-text`}> {title}</h4>
            </div>
            <IconButton className = 'adjust-button' id={`${type}-increment`} onClick={()=> changeTime(timeIncrement, type)} color='warning'><AddIcon/></IconButton>
        </div>
    </>
    )
}