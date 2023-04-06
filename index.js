import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.19.0/firebase-app.js'
import { getDatabase, ref, update, onValue } from "https://www.gstatic.com/firebasejs/9.19.0/firebase-database.js"
const firebaseConfig = {
    databaseURL: "https://realtimelocationtracker-emre-default-rtdb.europe-west1.firebasedatabase.app/",
};
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const nickName = document.getElementById('nickname');
const addBtn = document.getElementById('addBtn');
const locationsEl = document.getElementById('locations');

addBtn.addEventListener('click', ()=>{
    if(nickName.value==""){
        alert("You must enter a nickname!")
    }else{
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(setLocation);
        } else { 
            alert("Geolocation is not supported by this browser.")
        }
    }
    
});

function setLocation(position){
    const userLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
    }
    const updates = {};
    updates['/locations/' + nickName.value] = userLocation;
    update(ref(database), updates)
    console.log(`${nickName.value} updated`)
    getLocations()
}

function getLocations(){
    onValue(ref(database, 'locations'), (snapShot)=>{
        const data = snapShot.val();
        console.log("Gelen veri => ", data)
    }) 
}

console.log("Init database => ", database)