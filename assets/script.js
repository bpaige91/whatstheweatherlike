const apiKey = "2c1c995165d40fdebe148a3c47692348";
let cityArray = []

//display date in a normal format 
const TodayIs = moment().format('MMMM Do , YYYY');
    $('#todayIs').text(TodayIs);

const DayTwo = moment().add(1, 'days').calendar(); 
    $('#day-Two').text(DayTwo);

const DayThree = moment().add(2, 'days').calendar();
    $('#day-Three').text(DayThree);

const DayFour = moment().add(3, 'days').calendar();
    $('#day-Four').text(DayFour);

const DayFive = moment().add(4, 'days').calendar();
    $('#day-Five').text(DayFive);

const DaySix = moment().add(5, 'days').calendar();
    $('#day-Six').text(DaySix); 



    $("#searchButton").on("click", function () {
        city = $(this).parent("div").children("div").children("input").val();
        $(this).parent("div").children("div").children("input").val("");
        currentCall();

    console.log(city);
    
    });


storedCities = JSON.parse(localStorage.getItem("cities"));


if (storedCities !== null) {
    city = storedCities[0].name;
    window.onload = currentCall(city);
};
console.log(storedCities);


function renderList() {
    Object.values(storedCities).forEach((value) => {
        const $cityLi = $("<li>", { "class": "list-group-item" });
        $cityLi.text(value.name);
        $(".list-group").prepend($cityLi);
        $("#refresh").hide();  
    }
    ) 
}


if (storedCities !== null) {
    renderList();
}


function currentCall() {
    // $('#todayIs').removeAttr("d-none");
    const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
    $.ajax({
        url: queryURL,
        method: "GET",
    })
    //promise - call the api for the information
        .then(function (response) {
            //make an array to save in local storage and appear in nav as buttons
            const $cityLi = $("<li>", { "class": "list-group-item" });
            //thank you stack overflow for icon help
            const iconCode = response.weather[0].icon;
            const iconURL = "http://openweathermap.org/img/wn/" + iconCode + ".png";

            // console.log(iconCode);

            cityObject = {
                name: response.name
            }
            // console.log(cityArray)
            

            // turns the saved cities array into a string
            cityArray = JSON.parse(localStorage.getItem("cities"));
            if (cityArray === null) {
                localStorage.setItem("cities", JSON.stringify([cityObject]));
            }
            else {
        
                //if you search a city twice, it will be moved to the end of button line 
                function listCleaner() {
                    for (i = 0; i < cityArray.length; i++) {
                        if (cityArray[i].name === cityObject.name) {
                            removedCity = cityArray.splice([i], 1);
                        };
                    }
                    cityArray.unshift(cityObject);

                    localStorage.setItem("cities", JSON.stringify(cityArray));
                }
            }       if (cityArray !== null){
                    listCleaner();}

            
            city = {name: response.name}
                // change text of current weather card
            cityLat = response.coord.lat;
            cityLong = response.coord.lon;
            cityId = response.id;
            $(".city").text(response.name);
            $(".temp").text("Temperature  :  " + response.main.temp + "°");
            $(".humidity").text("Humidity  :  " + response.main.humidity + "%");
            $(".windSpeed").text("Wind Speed  :  " + response.wind.speed + "mph");
            $("#icon").attr('src', iconURL);
           
                // -------------------------------------------------------
            // background gradient based on current weather conditions
        
            weatherEl = response.weather[0].main;
            console.log(weatherEl);
            // function backgroundChange (){
            //     const background = document.getElementById("background").
            //     element.classList.add("-"+[weatherEl])
            // }


            const uviURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${cityLat}&lon=${cityLong}&units=imperial`;
            $.ajax({
                url: uviURL,
                method: "GET",
            })
                .then(function (response) {
                    $(".uvIndex").text("UV Index  : "+response.value);
                })


            const fiveDayURL = `https://api.openweathermap.org/data/2.5/forecast?appid=${apiKey}&id=${cityId}&units=imperial`;
            //sets the information 
            let index = 3;
            $.ajax({
                url: fiveDayURL,
                method: "GET",
            })
             // change inner text of five day forcast cards
                .then(function (response) {
                    for (let i = 4; i < response.list.length; i += 8) {
                        const iconCode = response.list[i].weather[0].icon;
                        const iconURL = "http://openweathermap.org/img/wn/" + iconCode + ".png";
                        const shortDate = response.list[i].dt_txt.substr(0, response.list[i].dt_txt.indexOf(' '));
                        $("#day-" + index).text(shortDate);
                        // const shortDate = response.list[i].dt_txt.substr(0, response.list[i].dt_txt.indexOf(' '));
                        // $("#day-" + index).text(shortDate);
                        // const temp = Math.floor(+response.list[i].main.temp)
                        $("#temp-" + index).text("Temperature:  "+response.list[i].main.temp + "°");
                        $("#humid-" + index).text("Humidity:  "+response.list[i].main.humidity + "%");
                        $("#icon-" + index).attr('src', iconURL);
                        index = index + 8;
                    }
                })
        })

};
$(document).on("click", "li", function () {
    city = $(this).text();
    currentCall();

});