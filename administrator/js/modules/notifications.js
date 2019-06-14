/*
 * Javascript File
 * @author Valentinos Galanos <swg_lowraed@hotmail.com>
 * @version 1.0.0
 */
(function(win){
    var $ = win.jQuery;
    var ko = win.ko;
    var APP = win.APP || {}; win.APP = APP;
    
    
    /*
     * Notification View Model
     */
    var Notification = function(o){
        var opts = o || {};
        var self = this;
        // Load Attributes
        self['message'] = ko.observable(opts.message || 'message goes here!');
        self['title'] = ko.observable(opts.title || 'Notification');
        
        self['closeMe'] = function(notice, ev) {
            var $el = $(ev.target);
            $el.parents('li.notice').fadeOut(function(){
                notifiManager.notices.remove(notice);
            });
        };
    };
    
    /*
     * Notification System
     */
    var Notifi = function() {
        var self = this;
        self['notices'] = ko.observableArray();
        
        // Load Template
        APP.loader.loadCSS('css/notifications.css');
        APP.loader.loadHTML('notifi-template','templates/notifications.html',function(){
            var $tmp = $('#notifi-template');
            $tmp.find('.notifications').appendTo('body');
            ko.applyBindings(self, $('.notifications')[0]);
        });
        
        self['newNotification'] = function(title, message) {
            var notify = new Notification({
                'title' : title,
                'message' : message
            });
            
            self.notices.push(notify);
        };
    };
    
    var notifiManager = new Notifi;
    
    APP['core'] = $.extend(APP.core,{
        'notifications' : notifiManager
    });
    
})(this);
