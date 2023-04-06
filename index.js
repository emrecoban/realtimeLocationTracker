import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.19.0/firebase-app.js'
import { getDatabase, ref, child, push, update, set } from "https://www.gstatic.com/firebasejs/9.19.0/firebase-database.js"
const firebaseConfig = {
    databaseURL: "https://realtimelocationtracker-emre-default-rtdb.europe-west1.firebasedatabase.app/",
};
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const nickName = document.getElementById('nickname');
const addBtn = document.getElementById('addBtn');

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
    console.log("ncik anme: ", nickName.value)
    const userLocation = {
        user: nickName.value,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
    }
    
    //const userKey = push(child(ref(database), 'locations')).key
    const updates = {};
    updates['/locations/' + nickName.value] = userLocation;
    update(ref(database), updates)
/*     set(ref(database, 'locations/' + nickName), {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
    }); */
    console.log("Veri girişi yapıldı:", database)
}

console.log("Init database => ", database)