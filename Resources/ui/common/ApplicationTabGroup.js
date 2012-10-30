function ApplicationTabGroup(Window) {
	//create module instance
	var self = Ti.UI.createTabGroup();
	
	//create app tabs
	var weatherWin = new Window(L('weather')),
		settingsWin = new SettingsWindow(L('settings')),
		findWin = new FindWindow(L('find'));
	
	var weatherTab = Ti.UI.createTab({
		title: L('weather'),
		icon: '/images/KS_nav_ui.png',
		window: weatherWin
	});
	weatherWin.containingTab = weatherTab;
	
	var settingsTab = Ti.UI.createTab({
		title: L('settings'),
		icon: '/images/KS_nav_views.png',
		window: settingsWin
	});
	settingsWin.containingTab = settingsTab;

	var findTab = Ti.UI.createTab({
		title: L('find'),
		icon: '/images/icon-search.png',
		window: findWin
	});
	findWin.containingTab = findTab;
	
	self.addTab(weatherTab);
	self.addTab(findTab);
	self.addTab(settingsTab);
	
	return self;
};

module.exports = ApplicationTabGroup;
