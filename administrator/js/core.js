/*
 * Javascript File
 * @author Valentinos Galanos <swg_lowraed@hotmail.com>
 * @version 1.0.0
 */
(function(win){
    var $ = win.jQuery;
    var ko = win.ko;
    var APP = win.APP || {}; win.APP = APP;

    // Objects
    
    /*
     * UI Modal
     */
    var UIModals = function(o) {
        var ops = o || {};
        var self = this;
        // Load Template
        APP.loader.loadHTML('modal-template','templates/modal.html');
        var $tmp = $('#modal-template');
        /*
         * Show Modal
         * @param callback Function called on close of modal.
         * @param destroy Destroy modal after close
         */
        self['showModal'] = function(o) {
            var opts = $.extend({
                'title' : 'Modal Title',
                'content' : '<p>Body Message...</p>',
                'destroy' : true,
                'hidden' : function(){}
            }, o || {});
            
            var $modal = $($tmp.html());
            
            // Set Title
            $modal.find('.modal-header h3').text(opts.title);
            // Set Content
            $modal.find('.modal-body').append(opts.content);
            
            $modal.modal('show').on('hidden',function(){
                opts.hidden.call(self, $modal);
                if(opts.destroy) {
                    $(this).remove();
                }
            });
            
            return $modal;
        };
    };
    
    /*
     * Module
     */
    var Module = function() {
        var self = this;
        self['name'] = ko.observable();
        self['src'] = ko.observable();
    };
    /*
     * ModuleManager
     */
    var ModuleManager = function() {
        var self = this;
        self['loaded'] = ko.observableArray();
        
        self['loadModule'] = function(name, src, callback) {
            var module = new Module;
            module.src(src);
            module.name(name);
            APP.loader.loadScript(module.src(), function(){
                if(callback!==undefined) callback(module, this);
                self.loaded.push(module);
            });
            return module;
        };
        
    };
    /*
     * Page
     */
    var Page = function(name, src) {
        var self = this;
        self['name'] = ko.observable(name);
        self['src'] = ko.observable(src);
        
        self['load'] = function($el, onloaded) {
            $el.fadeOut(function(){
                $el.load(self.src(), null, function(){
                    $el.fadeIn();
                    if(onloaded!==undefined)
                        onloaded.call(self, $el);
                });
            });
        };
    };
    /*
     * Page Manager
     */
    var PageManager = function(pages) {
        var self = this;
        self['items'] = ko.observableArray(pages);
        
        self['loadPage'] = function(name, onloaded) {
            self.searchPage(name, function(page) {
                page.load($('#page-view'), onloaded);
            });
        };
        
        self['searchPage'] = function(name, found) {
            var pages = self.items();
            $.each(pages,function(){
                var page = this;
                if(page.name() === name) {
                    found.call(self, page);
                    return false;
                }
            });
        };
        
        self['addPage'] = function(name, url) {
            var p = new Page(name,url);
            self.items().push(p);
        };
    };
    
    
    // Load Core
    
    var modals = new UIModals;
    var modules = new ModuleManager;
    var pages = new PageManager([
        new Page('home','pages/home.html'),
        new Page('about','pages/about.html'),
        new Page('d-notice-send','demos/notice-send.html'),
        new Page('d-google-maps','demos/google-maps.html'),
        new Page('d-google-earth','demos/google-earth.html'),
        new Page('d-unity-games','demos/unity-games.html'),
        new Page('d-post-wall','demos/post-wall.html')
    ]);
    
    APP['core'] = {
        'release' : {
            'version' : '1.0.0',
            'codename' : 'alpha',
            'author' : 'Valentinos Galanos',
            'facebook' : 'https://facebook.com/sonidelav'
        },
        'modals' : modals,
        'modules' : modules,
        'pages' : pages
    };
    // Apply Bindings
    ko.applyBindings(APP.core);
    
    // Load Modules
    modules.loadModule('apis_sdks', 'js/modules/apis+sdks.js');
    modules.loadModule('notifications', 'js/modules/notifications.js');
    modules.loadModule('toolbar', 'js/modules/toolbar.js');
    modules.loadModule('services', 'js/modules/rest-service.js');
    
    // Load Services
    APP.loader.loadScript('js/services/anexartito.js');
    // Load Third Parties
    APP.loader.loadScript('js/services/thirdparties.js');
    
    // Load Home page
    pages.loadPage('home',function($el){
        ko.applyBindings(APP.core, $el.find('.container-fluid')[0]);
    });
})(this);
