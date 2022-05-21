import { useEffect, useState } from "react";
import styles from "./Result.module.css"

function Result({ reset, guess, distance, percentCloseness}) {
    const [endText, setEndText] = useState("")
    useEffect(()=> {
        if(percentCloseness >= 90) setEndText("Excellent Work") 
        else if(percentCloseness >= 80) setEndText("Well Done")
        else if(percentCloseness >= 70) setEndText("Noice!")
        else if(percentCloseness >= 50) setEndText("Not Bad")
        else if(percentCloseness >= 30) setEndText("Good Work")
        else setEndText("Get Good")
    }, [percentCloseness])
    return <div className={styles.container}>
        <i  style={{textAlign:"center",margin:'5px'}}>{endText}</i>
        <h3 >The actual distance between the two cities : <span style={{color: "red"}}>{distance} km</span> </h3>
        <h3>Your guess : <span style={{color: "red"}}>{guess} km</span> </h3>
        <h3>Accuracy : <span style={{color: "green"}}>{percentCloseness} %</span></h3>
        <button className={styles.button} onClick={()=>{reset()}}>Play Again</button>
    </div>
}

export default Result;