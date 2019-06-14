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
     * Link view model
     */
    var Link = function(label,onclick){
        var self = this;
        self['label'] = ko.observable(label);
        self['onclick'] = function(toolbar, ev) {
            if(onclick!==undefined) {
                onclick.call(toolbar,ev);
            }
        };
    };
    /*
     * Demo view model
     */
    var Demo = function(name,run) {
        var self = this;
        self['name'] = ko.observable(name);
        self['run'] = function(i, ev) {
            if(run!==undefined) run.call(self, ev);
        };
    };
    /*
     * Toolbal view model
     */
    var Toolbar = function() {
        var self = this;
        
        APP.loader.loadHTML('toolbar-template','templates/toolbar.html',function(){
            var $tmp = $('#toolbar-template');
            $tmp.find('.navbar').prependTo('body');
            ko.applyBindings(self, $('.navbar')[0]);
            
            //APP.core.notifications.newNotification('Module loaded', 'Toolbar Loaded successfully!');
        });
        
        self['demos'] = ko.observableArray();
        self['links'] = ko.observableArray();
        
        // Add Base Links
        self.links([
            
            new Link('home',function(ev){
                $(ev.target).parents('ul').find('a.active').removeClass('active');
                $(ev.target).addClass('active');
                APP.core.pages.loadPage('home',function($el){
                    ko.applyBindings(APP.core, $el.find('.container-fluid')[0]);
                });
            }),
            
            new Link('about',function(ev){
                $(ev.target).parents('ul').find('a.active').removeClass('active');
                $(ev.target).addClass('active');

                APP.core.pages.loadPage('about',function($el){
                    ko.applyBindings(APP.core, $el.find('#about-page')[0]);
                });
            })
            
        ]);
        // Add some demos
        self.demos([
            new Demo('Notification Send', function(ev){
                $(ev.target).parents('ul').find('a.active').removeClass('active');
                APP.core.pages.loadPage('d-notice-send');
            }),
            new Demo('Post Wall', function(ev){
                $(ev.target).parents('ul').find('a.active').removeClass('active');
                APP.core.pages.loadPage('d-post-wall');
            }),
            new Demo('Google Maps', function(ev){
                $(ev.target).parents('ul').find('a.active').removeClass('active');
                APP.core.pages.loadPage('d-google-maps',function(){
                    if(APP.core.thirdParty.findLib('Google Maps').loaded()) {
                        win.googleMapsInit();
                    }
                });
            }),
            new Demo('Google Earth', function(ev){
                $(ev.target).parents('ul').find('a.active').removeClass('active');
                APP.core.pages.loadPage('d-google-earth',function(){
                    
                });
            }),
            new Demo('Unity3D Web Player', function(ev){
                $(ev.target).parents('ul').find('a.active').removeClass('active');
                APP.core.pages.loadPage('d-unity-games',function(){
                    
                });
            })
        ]);
        
        self['addLink'] = function(name,onclick) {
            var l = new Link(name, onclick);
            self.links.push(l);
        };
    };
    
    var toolbar = new Toolbar;
    
    APP['core'] = $.extend(APP.core,{
        'toolbar' : toolbar
    });
})(this);
