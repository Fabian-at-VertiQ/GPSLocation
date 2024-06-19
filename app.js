
document.addEventListener("DOMContentLoaded", (e)=>{
    
    const caseNum = document.getElementById("CaseNum");
    const decedent = document.getElementById("Decedent");
    const incident = document.getElementById("Incident");
    const home = document.getElementById("Home");
    const death = document.getElementById("Death");
    const locationIncident = document.getElementById("LocationIncident");
    const locationHome = document.getElementById("LocationHome");
    const locationDeath = document.getElementById("LocationDeath"); 
    const deleteLocations = document.querySelectorAll("button.delete");

    const userWelcome = document.getElementById("UserWelcome");  
    const closeWelcome = document.getElementById("CloseWelcome");
    const userId = document.getElementById("UserId");
    const displayUserId = document.getElementById("DisplayUserId");
    const userIdRequired = document.getElementById("UserIdRequired");


    const warningNoCase = document.getElementById("WarningNoCase");  
    const hideWarningNoCase = document.getElementById("HideWarningNoCase");  

    const clearAll = document.getElementById("ClearAll");  
    const clearAllWarning = document.getElementById("ClearAllWarning");
    const resetStorage = document.getElementById("ResetStorage");
    const hideWarning = document.getElementById("HideWarning");

    const sendStoredData = document.getElementById("SendStoredData");
    const storedData = document.getElementById("StoredData");
    const noLocalStorage = document.getElementById("NoLocalStorage");

    let data = {};
    //Check if LocalStorage is available
    if(isStorageAvailable()){
        //Check if there is a user id in the LocalStorage otherwise ask for it
        let tmpUserId = window.localStorage.getItem("userId");
        if(tmpUserId === "" || tmpUserId === null ){
            userWelcome.showModal();
        }
        displayUserId.textContent = tmpUserId;
        userId.value = tmpUserId;

        closeWelcome.addEventListener("click", (e) =>{
            if(userId.validity.valueMissing){
                userId.setCustomValidity("You must enter your user ID before continuing");
                userId.reportValidity();
            }
            else{
                userWelcome.close();
                window.localStorage.setItem("userId", userId.value);
                displayUserId.textContent = userId.value;
            }
        });
        
        caseNum.addEventListener("change", (e)=>{
            //check if the case already has data, if it does, show it
            data = JSON.parse(window.localStorage.getItem("cases"));
            let tmpCaseNum = e.target.value;
            let locDisplay = [locationIncident, locationHome, locationDeath];
            if(data !== null && tmpCaseNum in data){
                decedent.value = data[tmpCaseNum]["Decedent"];
                if("Locations" in data[tmpCaseNum]){
                    let loc = ["incident", "home", "death"];
                    for(let n= 0; n<3; n++){
                        let tmpLoc = data[tmpCaseNum]["Locations"][loc[n]];
                        locDisplay[n].textContent = tmpLoc === null ? "" : `Lat: ${tmpLoc["Latitud"]} - Long: ${tmpLoc["Longitud"]}`;
                    }
                }
                else{
                    locDisplay.forEach((l) => l.textContent = "");
                }
            }
            else{
                decedent.value = "";
                locDisplay.forEach((l) => l.textContent = "");
            }
        });

        deleteLocations.forEach((button) => {
            button.addEventListener("click", (e)=>{
                let button = e.target.dataset.button;
                let p = document.querySelector(`p[data-button="${button}"`);
                if(p.textContent !== ""){
                    p.textContent = "";
                    data = JSON.parse(window.localStorage.getItem("cases"));
                    delete data[caseNum.value]["Locations"][button];
                    window.localStorage.setItem("cases", JSON.stringify(data));
                }
            });
        });

        incident.addEventListener("click", (e) => {
            navigator.geolocation.getCurrentPosition(incidentLocation, error);
        });
        home.addEventListener("click", (e) => {
            navigator.geolocation.getCurrentPosition(homeLocation, error);
        });
        death.addEventListener("click", (e) => {
            navigator.geolocation.getCurrentPosition(deathLocation, error);
        });


        function incidentLocation(position) {
            StoreLocation("incident", locationIncident, position.coords.latitude, position.coords.longitude);
        }

        function homeLocation(position) {
            StoreLocation("home", locationHome, position.coords.latitude, position.coords.longitude);
        }

        function deathLocation(position) {
            StoreLocation("death", locationDeath, position.coords.latitude, position.coords.longitude);
        }
            
        function StoreLocation(type, locationDisplay, latitude, longitude){
            if(caseNum.value === ""){
                warningNoCase.showModal();
                return;
            }
            locationDisplay.textContent = `lat: ${latitude} - log: ${longitude}`;
            data = JSON.parse(window.localStorage.getItem("cases"));

            if(data === null){
                data = {};
                data[caseNum.value] = {}
            }
            if (!(caseNum.value in data)){
                data[caseNum.value] = {};
            }
            if(!("Locations" in data[caseNum.value])){
                data[caseNum.value]["Locations"] = {};
            }
            let locations = data[caseNum.value]["Locations"];
            locations[type] = {
                "DateTime": new Date().toLocaleString(),
                "Latitud": latitude,
                "Longitud": longitude
            }
            data[caseNum.value] = {
                "UserId": userId.value, 
                "Decedent": decedent.value,
                "Locations": locations
            };
            
            window.localStorage.setItem("cases", JSON.stringify(data));
        };

        hideWarningNoCase.addEventListener("click", (e) => {
            warningNoCase.close();
        });

        clearAll.addEventListener("click", (e) =>{
            clearAllWarning.showModal();
        });

        resetStorage.addEventListener("click", (e) =>{
            window.localStorage.setItem("cases", "{}");
            clearAllWarning.close();
        });

        hideWarning.addEventListener("click", (e) => {
            clearAllWarning.close();
        });

        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("sw.js");
        }
              

        function error() {
            lat.textContent = "Unable to retrieve your location";
        }
    }
    else{
        noLocalStorage.showModal();
    }


    //
    function isStorageAvailable() {
        let storage;
        try {
            storage = window["localStorage"];
            const x = "__storage_test__";
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        } 
        catch (e) {
            return false;
        }
    }

    sendStoredData.addEventListener("click", (e)=>{
        storedData.textContent = window.localStorage.getItem("cases");
    });
    
});
