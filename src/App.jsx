import Map, { Layer, Marker, NavigationControl, Source } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef, useState } from 'react';
import Search from './components/Search';
import turfDistance from '@turf/distance'
import StartPin from './start.png'
import EndPin from './destination.png'
import Result from './components/Result';


function App() {
  const totalCities = 24154;
  const mapRef = useRef();
  const inputRef = useRef();
  const [coordinates, setCoordinates] = useState([])
  const [distance, setDistance] = useState(null);
  const [percentCloseness, setPercentCloseness] = useState(null);
  const [viewState, setViewState] = useState({
    longitude: -100,
    latitude: 40,
    zoom: 3.5
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [city1, setCity1] = useState(null);
  const [city2, setCity2] = useState(null);

  async function getRandomCity() {
     const offset = Math.floor(Math.random() * (totalCities - 0 + 1));
     const res = await fetch(`http://geodb-free-service.wirefreethought.com/v1/geo/cities?limit=1&offset=${offset}&hateoasMode=off`, {
       method: "get"
     })
     return await res.json();
  }

  async function startGame() {
    setIsPlaying(true);
    let firstCity = await getRandomCity();
    let secondCity = await getRandomCity();
    setCity1(firstCity);
    setCity2(secondCity);
  }

  function checkResult(value) {
   setPercentCloseness(value * 100/(Math.round((distance + Number.EPSILON) * 100) / 100)); 
   setIsPlaying(false);
   setIsEnded(true);
  }

  useEffect(()=>{
    if(city1 && city2){
      mapRef.current?.flyTo({center: [city1.data[0].longitude, city1.data[0].latitude], duration: 2000});
      let coords = [[city1.data[0].longitude, city1.data[0].latitude], [city2.data[0].longitude ,city2.data[0].latitude]]
      setCoordinates(coords)
        setDistance(turfDistance(...coords, {units: "kilometers"}));
    }
  }, [city1, city2])

  const geojson = {
    'type': 'Feature',
    'properties': {},
    'geometry': {
    'type': 'LineString',
    'coordinates': coordinates}
    }

  const layerStyle = {
    'id': 'route',
    'type': 'line',
    'layout': {
    'line-join': 'round',
    'line-cap': 'round'
    },
    'paint': {
    'line-color': '#23cb75',
    'line-width': 5
    }
    }

  return <div>
        <Map
          ref={mapRef}
          {...viewState}
          onMove={evt=> setViewState(evt.viewState)}
          style={{width: 600, height: 400}}
          mapStyle="mapbox://styles/devasurya/cl3fh7smy003y14mfwq74fjvf"
          mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
        >
        {city1 && (
            <Marker longitude={city1.data[0].longitude} latitude={city1.data[0].latitude} anchor="bottom" >
              <img style={{width:30}} src={StartPin} alt={`${city1.place_name} pin`} />
            </Marker>
        )}
        {city2 && (
            <Marker longitude={city2.data[0].longitude} latitude={city2.data[0].latitude} anchor="bottom" >
              <img style={{width:30}} src={EndPin} alt={`${city1.place_name} pin`} />
            </Marker>
        )}
        <Source id="path-data" type="geojson" data={geojson}>
          <Layer {...layerStyle} />
        </Source>
        <NavigationControl/>
        </Map>
    {isPlaying ? (
      <div>
    {/* <Search setCity1={setCity1} setCity2={setCity2} mapRef={mapRef} /> */}
        <Map
          ref={mapRef}
          {...viewState}
          onMove={evt=> setViewState(evt.viewState)}
          style={{width: 600, height: 400}}
          mapStyle="mapbox://styles/devasurya/cl3fh7smy003y14mfwq74fjvf"
          mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
        >
        {city1 && (
            <Marker longitude={city1.data[0].longitude} latitude={city1.data[0].latitude} anchor="bottom" >
              <img style={{width:30}} src={StartPin} alt={`${city1.place_name} pin`} />
            </Marker>
        )}
        {city2 && (
            <Marker longitude={city2.data[0].longitude} latitude={city2.data[0].latitude} anchor="bottom" >
              <img style={{width:30}} src={EndPin} alt={`${city1.place_name} pin`} />
            </Marker>
        )}
        <Source id="path-data" type="geojson" data={geojson}>
          <Layer {...layerStyle} />
        </Source>
        <NavigationControl/>
        </Map>
        </div>
        ): (
      <div>
        {isEnded ? (<Result distance={Math.round((distance + Number.EPSILON) * 100) / 100} percentCloseness={Math.round((percentCloseness + Number.EPSILON) * 100) / 100} />): <button onClick={startGame}>Start Game</button>}
      </div>
    )} 



</div>
}

export default App;
