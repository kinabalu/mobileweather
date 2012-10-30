function ApplicationWindow(title) {
	var self = Ti.UI.createWindow({
		title:title,
		backgroundColor:'white'
	});
	
		var contentTableView = Ti.UI.createTableView({
			style: Ti.UI.iPhone.TableViewStyle.GROUPED,
			scrollable: false
		});
		
		var checkOnStartupRow = Ti.UI.createTableViewRow({
            layout:'vertical', 			
		});
		
		var checkOnStartupLabel = Ti.UI.createLabel({
			left: 9,
			text: 'Check on Startup',
			font: {fontFamily: 'Arial-BoldMT', fontSize: 16}
		});
		
		var basicSwitch = Ti.UI.createSwitch({ 
			value: is.app.checkForUpdates,
			right: 8 
		}); 
		basicSwitch.addEventListener('change',function(e) {
			is.app.checkForUpdates = basicSwitch.value;
			Ti.App.Properties.setBool("checkForUpdates", is.app.checkForUpdates);
			
			Ti.API.info('check for updates:'+is.app.checkForUpdates);
		});
			
		checkOnStartupRow.add(checkOnStartupLabel);
		checkOnStartupRow.add(basicSwitch);
		
		contentTableView.appendRow(checkOnStartupRow);
		
		self.add(contentTableView);
	
	return self;
};

module.exports = ApplicationWindow;
