const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

//_________________________________________________________________________________________
// These lines find elements in the HTML using querySelector.
// We store them in variables so we can show/hide or update content later.
// userTab → Button/tab for Your Weather (location-based).
// searchTab → Button/tab for Search Weather (city search).
// userContainer → The main container holding weather info.
// grantAccessContainer → Section asking user for location permission.
// searchForm → Search box form for entering city names.
// loadingScreen → Loader/spinner shown while fetching API.
// userInfoContainer → The section where weather info is displayed.
// 👉 Use: These act as handles to control the UI.
//_________________________________________________________________________________________



//initially vairables need????

let oldTab = userTab; //Sets the default tab to "Your Weather".
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c"; //Your OpenWeatherMap API key (required for fetching data).
oldTab.classList.add("current-tab");//Highlights the current tab.
getfromSessionStorage();//Runs at start to check if location is already saved.
// 👉 Use: Ensures app starts with Your Weather and checks if user location is already available.




function switchTab(newTab) {
    if(newTab != oldTab) {
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")) {
            //kya search form wala container is invisible, if yes then make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else {
            //main pehle search wale tab pr tha, ab your weather tab visible karna h 
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //ab main your weather tab me aagya hu, toh weather bhi display karna poadega, so let's check local storage first
            //for coordinates, if we haved saved them there.
            getfromSessionStorage();
        }
    }
}

//_________________________________________________________________________________________
// Checks if the user clicked a different tab.
// Removes "current-tab" from the old one and adds it to the new one.
// If switching to Search tab → Show search form, hide others.
// If switching to Your Weather tab → Hide search, reload weather from storage.
// 👉 Use: Allows toggling between "Your Weather" and "Search Weather".
//_________________________________________________________________________________________


userTab.addEventListener("click", () => {
    //pass clicked tab as input paramter
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    //pass clicked tab as input paramter
    switchTab(searchTab);
});

//_________________________________________________________________________________________
// Adds event listeners to both tabs.
// When clicked, switchTab() decides what to show.
// 👉 Use: Connects UI buttons with the switching logic.
//_________________________________________________________________________________________


//check if cordinates are already present in session storage
function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates) {
        //agar local coordinates nahi mile
        grantAccessContainer.classList.add("active");
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }

}

//_________________________________________________________________________________________
// Looks for "user-coordinates" in sessionStorage.
// If not found → Show Grant Location Access screen.
// If found → Convert string to object using JSON.parse() and fetch weather.
// 👉 Use: Saves user from entering location repeatedly.
//_________________________________________________________________________________________

async function fetchUserWeatherInfo(coordinates) {
    const {lat, lon} = coordinates;
    // make grantcontainer invisible
    grantAccessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");

    //API CALL
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );
        const  data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        loadingScreen.classList.remove("active");

    }

//_______________________________________________________________________________________
// Extracts lat and lon.
// Shows loading spinner, hides grant location screen.
// Calls OpenWeather API with lat, lon, and your API_KEY.
// Converts response to JSON.
// Hides loading, shows user info container.
// Passes data to renderWeatherInfo().
// 👉 Use: Fetches real-time weather based on coordinates.
//________________________________________________________________________________________

}

function renderWeatherInfo(weatherInfo) {
    //fistly, we have to fethc the elements 

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    console.log(weatherInfo);

    //fetch values from weatherINfo object and put it UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;

//_________________________________________________________________________________________
// Selects DOM elements for weather details.
// Fills them with values from API response:
// name → City name.
// sys.country → Country code → Converts into flag.
// weather[0].description → Weather condition.
// weather[0].icon → Icon for current weather.
// main.temp → Temperature.
// wind.speed → Wind speed.
// main.humidity → Humidity.
// clouds.all → Cloud percentage.
// 👉 Use: Updates the UI with live weather data.
//_________________________________________________________________________________________
}

function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
    }
}

function showPosition(position) {

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

//_________________________________________________________________________________________
// getLocation() → Checks if browser supports geolocation. If yes, calls showPosition().
// showPosition() → Gets latitude & longitude, saves to sessionStorage, fetches weather.
// 👉 Use: Gets weather for user’s current location.
//_________________________________________________________________________________________
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

//_________________________________________________________________________________________
// Selects Grant Access button.
// On click → calls getLocation() → starts geolocation process.
// 👉 Use: Lets user allow location access.
//_________________________________________________________________________________________

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else 
        fetchSearchWeatherInfo(cityName);
})

//_________________________________________________________________________________________
// Selects input box for city search.
// Adds listener on form submit.
// Prevents default (page reload).
// If input not empty → calls fetchSearchWeatherInfo(cityName).
// 👉 Use: Handles searching by city name.
//_________________________________________________________________________________________

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        
    }
}
//_________________________________________________________________________________________
// Shows loader, hides other containers.
// Calls API with city name.
// Converts response to JSON.
// Hides loader, shows results in UI.
// If error → shows alert.
// 👉 Use: Fetches and displays weather data by city name.
//_________________________________________________________________________________________