function SettingsWindow(title) {
	var self = Ti.UI.createWindow({
		title:title,
		backgroundColor:'white'
	});
	
	var contentTableView = Ti.UI.createTableView({
		style: Ti.UI.iPhone.TableViewStyle.GROUPED,
		scrollable: false
	});
	
	temperatureUnitSwitch = CreateSwitchSetting("Fahrenheit?", 'temperatureUnitFahrenheit', false);
	temperatureUnitSwitch.addEventListener('change',function(e) { Ti.App.fireEvent('weatherData.refresh', {data:mw.app.weather_data}); });
	imperialUnitSwitch = CreateSwitchSetting("Imperial Units?", 'imperialUnits', false);
	imperialUnitSwitch.addEventListener('change',function(e) { Ti.App.fireEvent('weatherData.refresh', {data:mw.app.weather_data}); });
	

	contentTableView.appendRow(temperatureUnitSwitch);
	contentTableView.appendRow(imperialUnitSwitch);

	self.add(contentTableView);
	
	return self;
}

function CreateSwitchSetting(label_text, propertyName, defaultState) {

	if(Ti.App.Properties.getBool(propertyName) === null) {
		Ti.App.Properties.setBool(propertyName, defaultState);
	}
	var row = Ti.UI.createTableViewRow({
		height: 50
	});
	
	var label = Ti.UI.createLabel({
		left: 9,
		text: label_text,
		font: {fontFamily: 'Arial-BoldMT', fontSize: 16}
	});
	
	var theSwitch = Ti.UI.createSwitch({
		value: Ti.App.Properties.getBool(propertyName),
		right: 8
	});
	
	theSwitch.addEventListener('change',function(e) {
		Ti.App.Properties.setBool(propertyName, theSwitch.value);
		Ti.API.info(propertyName + ' - '+Ti.App.Properties.getBool(propertyName));
	});

		
	row.add(label);
	row.add(theSwitch);
	
	return row;
}


module.exports = SettingsWindow;