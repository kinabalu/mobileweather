(function() {
    
    /**
     * Converts celsius to fahrenheit
     * Formula: °C  x  9/5 + 32 = °F
     */
    mw.app.celsiusToFahrenheit = function celsiusToFahrenheit(celsius) {
        return Math.round((celsius * 9/5) + 32);
    };
    
    mw.app.temperatureText = function temperatureText(temperature, is_fahrenheit) {
        my_temp = is_fahrenheit ? mw.app.celsiusToFahrenheit(temperature) : temperature;
        return my_temp + "\u00B0" + (is_fahrenheit ? "F" : "C");
    };

    /**
     * Wind percentage is in pie of 22.5º
     */
    mw.app.convertWindPercentageToAcronym = function convertWindPercentageToAcronym(percentage) {
    
        wind_percentages = {
            "N": [0,11.25], "NNE": [11.25,33.75], "NE": [33.75,56.25], "ENE": [56.25,78.75],
            "E": [78.75,101.25], "ESE": [101.25,123.75], "SE": [123.75,146.25], "SSE": [146.25,168.75],
            "S": [168.75,191.25], "SSW": [191.25,213.75], "SW": [213.75,236.25], "WSW": [236.25,258.75],
            "W": [258.75,281.25], "WNW": [281.25,303.75], "NW": [303.75,326.25], "NNW": [326.25,348.75]
            // "N": [348.75,360],
        };
    
        for(var key in wind_percentages) {
            cardinal_low = wind_percentages[key][0];
            cardinal_high = wind_percentages[key][1];
            
            if(percentage >= cardinal_low && percentage <= cardinal_high) {
                return key;
            }
        }
    };
    
    mw.app.convertIcon = function convertIcon(icon) {
        switch(icon) {
            case '10d':
                return 'images/glyphs/35.png';
            case '02d':
                return 'images/glyphs/28.png';
            case '01n':
                return 'images/glyphs/19.png';
            case '50n':
                return 'images/glyphs/21.png';
            default:
                return 'images/glyphs/32.png';
        }
    
        return 'images/glyphs/32.png';
    };
    
    mw.app.processWeatherData = function processWeatherData(responseText) {
        var data = JSON.parse(responseText);
        weather_data = {
            'name': data['list'][0]['name'],
            'temp': Math.round(data['list'][0]['main']['temp'] - 273.15),
            'temp_min': Math.round(data['list'][0]['main']['temp_min'] - 273.15),
            'temp_max': Math.round(data['list'][0]['main']['temp_max'] - 273.15),
            'pressure': data['list'][0]['main']['pressure'],
            'humidity': data['list'][0]['main']['humidity'],
            'clouds': data['list'][0]['main']['clouds'],
            'condition_description': data['list'][0]['weather'][0]['description'],
            'wind_mph': Math.round(data['list'][0]['wind']['speed'] * 2.2369),
            'wind_kph': Math.round(data['list'][0]['wind']['speed'] * 3.6),
            'wind_dir': mw.app.convertWindPercentageToAcronym(data['list'][0]['wind']['deg']),
            'icon_url': mw.app.convertIcon(data['list'][0]['weather'][0]['icon'])
        };
        
        mw.app.weather_data = weather_data;
        // alert(JSON.stringify(mw.app.weather_data));
    };
    
    mw.app.weatherDataByCity = function getWeatherDataByCity(city) {
//http://openweathermap.org/data/2.1/find/name?q=london
        // domain = 'http://localhost:8090'
        Ti.API.debug("Calling weather data by city with [" + city + "]");
        domain = 'http://openweathermap.org';
        
        var weather_data = {};
        
        var xhr = Ti.Network.createHTTPClient();
         
        xhr.onload = function(e) {
            Ti.API.info(this.responseText);
            mw.app.processWeatherData(this.responseText);

            Ti.App.fireEvent('weatherData.refresh', {data:mw.app.weather_data});
        };
         
        // Ti.API.info("URL for weatherDataByCity:" + domain + '/data/2.1/find/name?q=' + city);
        xhr.open('GET',domain + '/data/2.1/find/name?q=' + city);
        xhr.send();
    };
    
    mw.app.weatherData = function getWeatherData(lat, lng) {
        // domain = 'http://localhost:8090'
        domain = 'http://openweathermap.org';

        var weather_data = {};
        
        var xhr = Ti.Network.createHTTPClient();
         
        xhr.onload = function(e) {
            mw.app.processWeatherData(this.responseText);
            Ti.App.fireEvent('weatherData.receive', {data:mw.app.weather_data});
        };
         
        xhr.open('GET',domain + '/data/2.1/find/city?lat=' + lat + '&lon=' + lng + '&cnt=1');
        xhr.send();
    };

    mw.app.addressHashmap = function addressHashmap(geo_data) {
        // Ti.API.debug(JSON.stringify(geo_data));
        address_data = [];
        for(var i=0; i<geo_data.length; i++) {
            address = {}
            comp = geo_data[i].address_components;

            for(var j=0; j<comp.length; j++) {
                address[comp[j]['types'][0]] = comp[j]['short_name'];
            }

            address_data.push(address);
        }
        return address_data;
    };

    mw.app.locationData = function getLocationData(searchQuery) {
        
        var location_data = {};
        
        var xhr = Ti.Network.createHTTPClient();
         
        xhr.onload = function(e) {
            if ( this.responseText ) {
    
                var geo_data = JSON.parse(this.responseText);
                address_data = mw.app.addressHashmap(geo_data.results);
                Ti.App.fireEvent('search.result', {
                    data: address_data
                });
            }
        };
         
        xhr.open('GET', "http://maps.googleapis.com/maps/api/geocode/json?address=" + searchQuery + "&sensor=false");
        xhr.send();
    };


})();