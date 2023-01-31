import { useCallback, useRef } from "react";
import proj, {JP_ZONE_TO_EPSG_MAP} from "./proj";

function App() {
  const mapContainerRef = useRef();

  const handleSubmit = useCallback((event) => {
    event.preventDefault();

    const convertCoordinatesFrom = event.target.elements['convertCoordinatesFrom'].value;
    const convertCoordinatesFromTxt = event.target.elements['convertCoordinatesFrom'].selectedOptions[0].text;
    const coordinateInput = event.target.elements['coordinateInput'].value
      .split(',')
      .map((x) => parseFloat(x));
    
    const out = proj(convertCoordinatesFrom, 'EPSG:4326', coordinateInput);
    console.log(out);

    const newMap = document.createElement('div');
    newMap.setAttribute('class', 'coordinate-map');
    newMap.setAttribute('data-style', 'geolonia/gsi');
    newMap.setAttribute('data-lng', out[0]);
    newMap.setAttribute('data-lat', out[1]);
    newMap.setAttribute('data-zoom', 16);
    newMap.setAttribute('data-open-popup', 'on');
    newMap.setAttribute('data-gesture-handling', 'off');
    newMap.innerText = `元座標: ${coordinateInput.join(',')} (${convertCoordinatesFromTxt})\n\n世界座標系 (EPSG:4326)\n緯度: ${out[1]}\n経度: ${out[0]}`;
    mapContainerRef.current.innerText = '';
    mapContainerRef.current.appendChild(newMap);

    // eslint-disable-next-line no-undef
    const map = new geolonia.Map({
      container: newMap,
    });
  }, []);

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="">
        <div className="mb-3">
          <label htmlFor="convertCoordinatesFrom">変換元座標系</label>
          <select id="convertCoordinatesFrom" name="convertCoordinatesFrom" className="form-select">
            {Object.entries(JP_ZONE_TO_EPSG_MAP).map(([jpZone, epsg]) => (
              <option key={epsg} value={epsg}>公共座標{jpZone}系</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="coordinateInput">入力座標 <code>(x,y)</code></label>
          <input 
            id="coordinateInput" 
            name="coordinateInput"
            className="form-control" 
            type="text"
            defaultValue="11573.375,22694.980"
            />
        </div>
        <div>
          <button type="submit" className="btn btn-primary">変換する</button>
        </div>
      </form>
      <div ref={mapContainerRef}></div>
    </div>
  );
}

export default App;
