
document.addEventListener("DOMContentLoaded", (e)=>{
    const location = document.getElementById("Location");
    const lat = document.getElementById("lat");
    const clearAllWarning = document.getElementById("ClearAllWarning");
    function showDlg() {
        clearAllWarning.showModal();
    }
    function hideDlg() {
        clearAllWarning.close();
    }

    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("sw.js");
    }

    location.addEventListener("click", (e) =>{
        navigator.geolocation.getCurrentPosition(success, error);
    });

    function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
    
        lat.textContent = `lat: ${latitude} - log: ${longitude}`;
    }
    function error() {
        lat.textContent = "Unable to retrieve your location";
    }
});
