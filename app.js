
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
        lat.value = GeolocationCoordinates.latitude;
    });
});
