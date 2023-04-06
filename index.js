import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.0/firebase-app.js";
import {
  getDatabase,
  ref,
  update,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.19.0/firebase-database.js";
const firebaseConfig = {
  databaseURL:
    "https://realtimelocationtracker-emre-default-rtdb.europe-west1.firebasedatabase.app/",
};
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const nickName = document.getElementById("nickname");
const addBtn = document.getElementById("addBtn");
const locationsEl = document.getElementById("locations");

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
  };
  const updates = {};
  updates["/locations/" + nickName.value] = userLocation;
  update(ref(database), updates);
  console.log(`${nickName.value} updated`);
  getLocations();
}

let markers = []

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
  onValue(ref(database, "locations"), (snapShot) => {
    const data = snapShot.val();
    const infoWindow = new google.maps.InfoWindow(); // Marker Info
    console.log("Gelen veri => ", Object.values(data));
    removeMarkers();
    markers = []
    Object.values(data).map((locData)=>{
        const newMarker = new google.maps.Marker({
            position: new google.maps.LatLng(locData.latitude, locData.longitude),
            map: map,
            icon: "img/navigation.png",
            title: locData.label,
            optimized: false,
        });
        newMarker.addListener("click", ()=>{
            infoWindow.close();
            infoWindow.setContent(newMarker.getTitle());
            infoWindow.open(newMarker.getMap(), newMarker);
        })
        markers.push(newMarker);
    })
    showMarkers();
  });
}

const setMapOnAll = (map)=>{
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

const showMarkers = ()=>{
    setMapOnAll(map);
}

const removeMarkers = ()=>{
    setMapOnAll(null);
    markers = [];
}

console.log("Init database => ", database);
// Google Maps API: AIzaSyAGCkfuPFMFAj-KloukOh3EyWJ7KceCQnY