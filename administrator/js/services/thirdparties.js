/*
 * Javascript File
 * @author Valentinos Galanos <swg_lowraed@hotmail.com>
 * @version 1.0.0
 */
(function(win){
    var APP = win.APP || {}; win.APP = APP;
    
    try {
        var thirdParty = APP.core.thirdParty;
        if(thirdParty===undefined) throw 'Third Parties Error: APIs & SDKs Module not located.';
        
        // Dropbox third party SDK
        thirdParty.addLib('DropBox', null,
            'https://www.dropbox.com/static/api/dropbox-datastores-1.0-latest.js');
        
        thirdParty.addLib('Google Maps', null,
            'https://maps.googleapis.com/maps/api/js?v=3&callback=googleMapsInit');
            
        thirdParty.addLib('Google JS API', null,
            'https://www.google.com/jsapi');
        
    } catch(exception) {
        APP.core.notifications.newNotification('Exception',exception);
    }
    
})(this);
