import { useRef, useState } from "react";
import styles from './Search.module.css'

function Search({setStartResult, setDestinationResult, mapRef}){

    const startRef = useRef(null);
    const destinationRef = useRef(null);

    const [startResults, setStartResults] = useState([])
    const [destinationResults, setDestinationResults] = useState([])

    async function searchLocation(location, start) {
        if(location.length <= 1) {
            setStartResults([])
            return;
        } 
        try {
            const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?access_token=${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}`, {
                method: "get",
            })
            let results = await res.json();
            if(start) setStartResults(results.features);
            else setDestinationResults(results.features);
    } catch (error) {console.log(error)} 
    }

    function setStartLocation(result) {
        setStartResults([]);
        startRef.current.value=result.place_name
        console.log(result);
        setStartResult(result);
        mapRef.current?.flyTo({center: [result.center[0], result.center[1]], duration: 2000});
    }

    function setDestinationLocation(result) {
        setDestinationResults([]);
        destinationRef.current.value=result.place_name
        console.log(result);
        setDestinationResult(result);
        mapRef.current?.flyTo({center: [result.center[0], result.center[1]], duration: 2000});
    }

    return <div>
        <div>
            <input type="text" id={"startSearch"} ref={startRef} onClick={(evt)=>evt.target.value=""} onChange={(evt)=> searchLocation(evt.target.value, true)} placeholder="Starting Location" />
            <div>
                {(startResults.length > 2) ? (
                    <div className={styles.searchResults}>
                        {startResults.map((place, index) => (
                            <div className={styles.result} onClick={()=> setStartLocation(startResults[index]) } key={index}>{place.place_name}</div>
                        ))}
                    </div>
                ): null}
            </div>
            <input type="text" id={"destinationSearch"} ref={destinationRef} onClick={(evt)=>evt.target.value=""} onChange={(evt)=> searchLocation(evt.target.value, false)} placeholder="Destination Location" />
            <div>
                {(destinationResults.length > 2) ? (
                    <div className={styles.searchResults}>
                        {destinationResults.map((place, index) => (
                            <div className={styles.result} onClick={()=> setDestinationLocation(destinationResults[index]) } key={index}>{place.place_name}</div>
                        ))}
                    </div>
                ): null}
            </div>
        </div>
    </div>
}

export default Search;