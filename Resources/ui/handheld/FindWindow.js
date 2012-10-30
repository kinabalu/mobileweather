function FindWindow(title) {
    var self = Ti.UI.createWindow({
        title:title,
        backgroundColor:'white'
    });
    
    var contentTableView = Ti.UI.createTableView({
        scrollable: true
    });
        
    var findField = Ti.UI.createSearchBar({
        barColor:'#000',
        hintText:'Search by city',
        height:35,
        width:320,
        top:0,
        borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
    });
    
    findField.addEventListener('return', function(e) {
        Ti.API.info("search query:" + e.value);
        mw.app.locationData(e.value);
        findField.blur();
    });
    
    
    self.add(findField);
    findField.focus();
    
    Ti.App.addEventListener("search.result", function(result_data) {
        var locations = [];
        var rowData = [];
        
        var data = result_data.data;
        
        for (var i = 0; i < data.length; i++) {
            var address = data[i];

            locations.push(chooseLocality(address) + ", " + chooseSecondaryIdentifier(address));
            
            Ti.API.debug(JSON.stringify(address));
            
            var row = Ti.UI.createTableViewRow({
                height:'auto'
            });
                        
            var location_view = Ti.UI.createView({
                height:30,
                layout:'vertical',
                top:5,
                right:5,
                bottom:5,
                left:5
            });
    
                        
            var location_lbl = Ti.UI.createLabel({
                text: chooseLocality(address) + ", " + chooseSecondaryIdentifier(address),
                left:5,
                top:5,
                bottom:2,
                height:16,
                textAlign:'left',
                color:'#444444',
                font:{
                    fontFamily:'Trebuchet MS',fontSize:14,fontWeight:'bold'
                }
            });
            
            location_view.add(location_lbl);
            
            row.add(location_view);
            
            row.addEventListener('click', function(e) {
                mw.app.weatherDataByCity(locations[e.index]);
                mw.app.tabGroup.setActiveTab(0);
            });

            rowData[i] = row;
        }
        
        contentTableView.setData(rowData);
        
    });
        
    var tableViewView = Ti.UI.createView({
        width: 300,
        top: 40
    });
    
    self.add(tableViewView);
    
    tableViewView.add(contentTableView);
    
    return self;
}

function chooseLocality(address) {
    if("sublocality" in address) {
        return address['sublocality'];
    }
    return address['locality'];
}

function chooseSecondaryIdentifier(address) {
    if("administrative_area_level_1" in address) {
        return address['administrative_area_level_1'];
    } else if("administrative_area_level_2" in address) {
        return address['administrative_area_level_2'];
    }

    return address['country'];
}
module.exports = FindWindow;