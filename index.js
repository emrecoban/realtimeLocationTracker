import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.0/firebase-app.js";
import {
  getDatabase,
  ref,
  update,
  onValue,
  query,
  startAt,
  orderByChild,
  get,
  limitToLast,
} from "https://www.gstatic.com/firebasejs/9.19.0/firebase-database.js";
const firebaseConfig = {
  databaseURL:
    "https://realtimelocationtracker-emre-default-rtdb.europe-west1.firebasedatabase.app/",
};
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const nickName = document.getElementById("nickname");
const addBtn = document.getElementById("addBtn");
const showList = document.getElementById("showList");
const locationList = document.getElementById("locationList");
const arrow = document.getElementById("arrow");

addBtn.addEventListener("click", () => {
  if (nickName.value == "") {
    alert("You must enter a nickname!");
  } else {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(setLocation);
      
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }
});

function setLocation(position) {
  const userLocation = {
    label: nickName.value,
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    timestamp: Date.now(),
  };
  const updates = {};
  updates["/locations/" + nickName.value] = userLocation;
  update(ref(database), updates);
  console.log(`${nickName.value} updated`);
  getLocations();
}

let markers = [];

let map;
async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");
  map = new Map(document.getElementById("locations"), {
    center: { lat: 41.2797, lng: 36.3361 }, // Samsun, TR
    zoom: 12,
  });
}

window.initMap = initMap();

function getLocations() {
  const now = Date.now();
  const oneMinuteAgo = now - (10 * 1000);
  console.log("zaman => ", now)
  const onlyOnline = query(ref(database, "locations"), orderByChild('timestamp'), startAt(oneMinuteAgo));
  onValue(onlyOnline, (snapShot) => {
    const data = snapShot.val();
    if(data){
      const infoWindow = new google.maps.InfoWindow(); // Marker Info
      removeMarkers();
      markers = [];
      Object.values(data).map((locData) => {
        const newMarker = new google.maps.Marker({
          position: new google.maps.LatLng(locData.latitude, locData.longitude),
          map: map,
          icon: "img/navigation.png",
          title: locData.label,
          optimized: false,
        });
        newMarker.addListener("click", () => {
          infoWindow.close();
          infoWindow.setContent(newMarker.getTitle());
          infoWindow.open(newMarker.getMap(), newMarker);
        });
        markers.push(newMarker);
      });
      showMarkers();
    }else{
      console.log("uygun veri yok.")
    }
  });
}

const setMapOnAll = (map) => {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
};

const showMarkers = () => {
  setMapOnAll(map);
};

const removeMarkers = () => {
  setMapOnAll(null);
  markers = [];
};

showList.addEventListener('click', ()=>{
  if(locationList.classList.value === "hide"){
    locationList.className = "show"
    arrow.className = "arrow up"

    get(query(ref(database, 'locations'),orderByChild('timestamp'), limitToLast(7))).then((snapshot) => {
      if (snapshot.exists()) {
        locationList.innerHTML = Object.values(snapshot.val()).map((location)=>{
            return `<li><b>${location.label}</b> - ${location.latitude.toString().slice(0, 6)} ° N, ${location.longitude.toString().slice(0, 6)} ° E</li>`
        }).join('');
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
    
  }else{
    locationList.className = "hide"
    arrow.className = "arrow down"
  }
});

console.log("Init database => ", database);