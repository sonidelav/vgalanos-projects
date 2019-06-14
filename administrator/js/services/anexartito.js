/*
 * Javascript File
 * @author Valentinos Galanos <swg_lowraed@hotmail.com>
 * @version 1.0.0
 */
(function(win){
    var $ = win.jQuery;
    var ko = win.ko;
    var APP = win.APP || {}; win.APP = APP;
    
    try {
        var services = APP.core.services;
        if(services===undefined) throw 'Anexartito Service Error: Services Module not located.';
        
        var anex_service = services.addService('anexartito','anex.php/api');
        anex_service.addMethod({name: 'teams'});
        
    } catch(exception) {
        APP.core.notifications.newNotification('Exception',exception);
    }
    
})(this);
