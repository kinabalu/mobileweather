function ApplicationWindow(title) {
    var temp_lbl;
    var city_lbl;
    var weather_img;
    
    var self = Ti.UI.createWindow({
        title:title,
        backgroundColor:'white'
    });
    
    Ti.Geolocation.purpose = "Access to lat/lng for Current Weather";
    Ti.Geolocation.getCurrentPosition(function(e) {
        if (!e.success || e.error) {
            Ti.API.warn('getCurrentPosition: Error : ' + JSON.stringify(e.error));
            alert('getCurrentPosition error: ' + JSON.stringify(e.error));
        } else {
            Ti.API.warn('getCurrentPosition lon: ' + e.coords.longitude + ', lat: ' + e.coords.latitude);
            Ti.App.Properties.setDouble("longitude", e.coords.longitude);
            Ti.App.Properties.setDouble("latitude", e.coords.latitude);
        }
    });
    
    mw.app.weatherData(Ti.App.Properties.getDouble("latitude"), Ti.App.Properties.getDouble("longitude"));
    
    Ti.App.addEventListener("weatherData.refresh", function(result_data)
    {
        var data = result_data.data;
        
        // TODO do some error checking here to ensure the data is not crap
        weather_img.setImage(data['icon_url']);
        city_lbl.text = data['name'];
        
        is_fahrenheit = Ti.App.Properties.getBool("temperatureUnitFahrenheit");
        is_imperial = Ti.App.Properties.getBool("imperialUnits");
        temp_lbl.text = mw.app.temperatureText(data.temp, is_fahrenheit);
        wind_lbl.text = "Wind: " + (is_imperial ? data.wind_mph + "mph " : data.wind_kph + "kph ") + data.wind_dir;

    });
    
    Ti.App.addEventListener('weatherData.receive', function(result_data)
    {
        var data = result_data.data;
         
        var info_view = Titanium.UI.createView({
            left: 5,
            top: 30,
            width:150,
            height:150,
            layout: 'vertical'
        });
        self.add(info_view);
        
        var image_view = Ti.UI.createView({
            left: 160,
            top: 5,
            width: 120,
            height: 120
        });
        self.add(image_view);
        
        weather_img = Titanium.UI.createImageView({
            image: data['icon_url']
        });
        
        image_view.add(weather_img);

        temp_lbl = Ti.UI.createLabel({
            text: mw.app.temperatureText(data.temp, Ti.App.Properties.getBool("temperatureUnitFahrenheit")),
            textAlign:'left',
            color:'#444444',
            font:{
                fontFamily:'Trebuchet MS',fontSize:58,fontWeight:'bold'
            }
        });
        
        info_view.add(temp_lbl);
        
        city_lbl = Ti.UI.createLabel({
            text:data['name'],
            textAlign:'left',
            color:'#444444',
            font:{
                fontFamily:'Trebuchet MS',fontSize:28,fontWeight:'bold'
            }
        });
        info_view.add(city_lbl);
          
        var wind_view = Titanium.UI.createView({
            left: 5,
            top: 190,
            width:320,
            height:150,
            layout: 'vertical'
        });
        self.add(wind_view);

        wind_lbl = Ti.UI.createLabel({
            text:"Wind: " + data['wind_kph'] + "kph " + data['wind_dir'],
            textAlign: 'left',
            color: '#444444',
            font:{
                fontFamily:'Trebuchet MS',fontSize:28,fontWeight:'bold'
            }
        });
        
        wind_view.add(wind_lbl);

    });

    return self;
}

module.exports = ApplicationWindow;
