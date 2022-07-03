import "./app.css";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { useEffect, useState } from "react";
import { ContactsOutlined, Room, Star, StarBorder } from "@material-ui/icons";
import axios from "axios";
import { format } from "timeago.js";
import Register from "./components/Register";
import Login from "./components/Login";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css'; 

function App() {
  
  const myStorage = window.localStorage;
  const [currentUser, setCurrentUser] = useState(null);
  //const currentUser = "manas";
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [star, setStar] = useState(0);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);


  const [viewport, setViewport] = useState({  
    width: "100vw",
    height: "100vh",
    latitude:46,
    longitude:17,
    zoom: 4
  });

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewport({ ...viewport, latitude: lat, longitude: long });
  };

  const handleAddClick = (e) => {
    console.log(e);
    const [long, lat] = e.lngLat;
    setNewPlace({
      lat,
      long,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      desc,
      star,
      lat: newPlace.lat,
      long: newPlace.long,
    };
    try {
      const res = await axios.post("/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const getPins = async () => {
      try {
        const allPins = await axios.get("/pins");
        setPins(allPins.data);
        console.log(allPins.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, []);

  const handleLogout = () => {
    setCurrentUser(null);
   // myStorage.removeItem("user");
  };

  

 
  

  return (
    <div className="App">
    <ReactMapGL
      {...viewport}
      mapboxApiAccessToken = {process.env.REACT_APP_MAPBOX}
      onViewportChange = {nextViewport => setViewport(nextViewport)}
      mapStyle="mapbox://styles/safak/cknndpyfq268f17p53nmpwira"
      onDblClick={handleAddClick}
      transitionDuration="100"
      
    >
      {pins.map(p => (
        
        <div key={p._id}>

        <Marker
              latitude={p.lat}
              longitude={p.long}
              offsetLeft={-viewport.zoom * 3.5}
              offsetTop={-viewport.zoom * 7}
      >
       <Room     
                style={{
                  fontSize: 7 * viewport.zoom,
                  color: p.username === currentUser ? "tomato" : "slateblue",
                  
                  cursor: "pointer"
                }}
                onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
        />
      </Marker>
      
      {p._id === currentPlaceId && (

      <Popup 
      longitude={p.lat} 
      latitude={p.long}
      closeOnClick = {false}
      closeButton = {true}
      anchor="left"
      onClose={() => setCurrentPlaceId(null)}
      >
      
      <div className="card" key = {p._id}>
          <label>Place</label>
          <h4 className="place">{p.title}</h4>
          <label>Review</label>
          <p className="desc">{p.desc}</p>
          <label>Rating</label>
          <div className="stars" >
            {Array(p.rating).fill(<Star className="star" />)}
          </div>
          <label>Information</label>

          <span className="username">
            Created by <b>{p.username}</b>
          </span>
          <span className="date">{format(p.createdAt)}</span>
      </div> 

    </Popup>
      )}
    </div>
      ))}
    {newPlace && (

      <Popup 
      longitude={newPlace.lat} 
      latitude={newPlace.long}
      closeOnClick = {false}
      closeButton = {true}
      anchor="left"
      onClose={() => setNewPlace(null)}
      >
       <div>
          
       
          <form onSubmit={handleSubmit}>
            <label>Title</label>
            <input
              placeholder="Enter a title"
              autoFocus
              onChange={(e) => setTitle(e.target.value)}
            />
            <label>Description</label>
            <textarea
              placeholder="Say us something about this place."
              onChange={(e) => setDesc(e.target.value)}
            />
            <label>Rating</label>
            <select onChange={(e) => setStar(e.target.value)}>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
            <button type="submit" className="submitButton">
              Add Pin
            </button>
          </form>
        </div>


      </Popup>
    )}

    {currentUser ? (
          <button className="button logout"
          onClick={handleLogout}>
            Log out
          </button>
        ) : (
          <div className="buttons">
            <button className="button login"
             onClick={() => setShowLogin(true)}>
              Log in
            </button>
            <button
              className="button register"
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>
          </div>
        )} 

        <Register/>
 
        {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && (
          <Login
            setShowLogin={setShowLogin}
            setCurrentUsername={setCurrentUser}
             myStorage={myStorage}
          />
        )} 


    </ReactMapGL>
    </div>
  );
}

export default App;