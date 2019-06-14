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
     * Web Method
     */
    var WebMethod = function(obj, service) {
        var o = $.extend({
            'name': 'method',
            'type' : 'GET',
            'dataType' : 'json'
        },obj||{});
        var self = this;
        
        // Attributes
        self['name'] = ko.observable(o.name);
        self['type'] = ko.observable(o.type);
        self['dataType'] = ko.observable(o.dataType);
        self['params'] = ko.observable(o.params);
        
        // Methods
        self['callMethod'] = function(params, onsuccess) {
            var prms = $.extend({}, params || {});
            $.ajax({
                'url' : service.getMethodURL(o.name),
                'type' : self.type(),
                'dataType' : self.dataType(),
                'data' : $.param(prms),
                'success' : function(res){
                    if(onsuccess!==undefined) {
                        onsuccess.call(self, res, prms);
                    }
                }
            });
        };
        
        // UI Methods
        self['call'] = function() {
            var $el = $('<pre>');
            APP.core.notifications.newNotification('Service Method Called', 
                'Method '+self.name()+' called!');
                
            self.callMethod(null,function(res){
                $el.text(win.JSON.stringify(res));
                APP.core.modals.showModal({
                    'title' : 'Results of method ' + self.name(),
                    'content' : $el
                });
            });
        };
    };
    /*
     * Web Service
     */
    var WebService = function(obj) {
        var o = $.extend({
            'baseUrl' : false,
            'name' : false
        }, obj || {});
        // Instance of me.
        var self = this;
        // Attributes
        self['methods'] = ko.observableArray();
        self['options'] = ko.observable(o);
        // Methods
        self['addMethod'] = function(obj) {
            var m = new WebMethod(obj, self);
            self.methods.push(m);
        };
        self['removeMethod'] = function(name) {
            var m = self.findMethod(name);
            self.methods.remove(m);
        };
        self['findMethod'] = function(name, onfound) {
            var ret=null;
            $(self.methods()).each(function(){
                if(this.name() === name) {
                    if(onfound!==undefined) onfound.call(self, this);
                    ret=this;
                    return false;
                }
            });
            return ret;
        };
        self['callMethod'] = function(name, params, callback) {
            var m = self.findMethod(name);
            m.callMethod(params, callback);
        };
        self['getMethodURL'] = function(name) {
            var m = self.findMethod(name);
            var url = self.options().baseUrl + '/' + m.name();
            return url;
        };
    };
    /*
     * Services Manager
     */
    var ServicesManager = function() {
        var self = this;
        
        // Load Template
        APP.loader.loadCSS('css/web-services.css');
        APP.loader.loadHTML('services-template','templates/web-services.html',function(){
            var $tmp = $('#services-template');
            $tmp.find('#services-board').prependTo('body');
            ko.applyBindings(self, $('#services-board')[0]);
            
            APP.core.pages.addPage('services','pages/services.html');
            APP.core.toolbar.addLink('services',function(ev){
                APP.core.pages.loadPage('services',function($el){
                    var page = $el.find('#services-panel')[0];
                    ko.applyBindings(self, page);
                });
            });
        });
        
        self['loaded'] = ko.observableArray();
        
        self['addService'] = function(name, baseUrl){
            var service = new WebService({
                'name':name,
                'baseUrl':baseUrl
            });
            self.loaded.push(service);
            return service;
        };
        
        self['findService'] = function(name, onfound) {
            var ret=null, services = self.loaded();
            $(services).each(function(){
                if(this.options().name === name) { 
                    if(onfound!==undefined) onfound.call(self, this);
                    ret = this;
                    return false;
                }
            });
            return ret;
        };
        
        self['callMethod'] = function(service, method, params, callback) {
            var s = self.findService(service);
            s.callMethod(method, params, callback);
        };
        
        // UI Actions
        
        self['createService'] = function() {
            
            // Form
            var f = $('<form class="form-vertical">').append(
                '<label for="name">Service Name:</label>',
                '<input type="text" name="name">',
                '<label for="url">baseUrl:</label>',
                '<input type="text" name="url">'
            );
            
            APP.core.modals.showModal({
                'title' : 'Create a service...',
                'content' : f,
                'hidden' : function(modal){
                    var name = modal.find('input[name=name]').val();
                    var url  = modal.find('input[name=url]').val();
                    if(name && url) {
                        self.addService(name,url);
                        APP.core
                        .notifications
                        .newNotification('Service','Service ' + name + ' created successfull!');
                    }
                }
            });
            
        };
        
        self['createMethod'] = function(service) {
            
            var f = $('<form>').append(
                '<label>Service: </label>', 
                '<input disabled type="text" value="' + service.options().name + '">',
                '<label>Name:</label>', '<input type="text" name="name">'
            );
        
            APP.core.modals.showModal({
                'title' : 'Create a method...',
                'content' : f,
                'hidden' : function(modal){
                    var name = modal.find('input[name=name]').val();
                    if(name) {
                        service.addMethod({'name':name});
                        APP.core
                        .notifications
                        .newNotification('Service Method',
                            'On service ' + service.options().name + 
                                ' method ' + name + ' created successfull!');
                    }
                }
            });
            
        };
        
        self['hasThirdParty'] = ko.observable(APP.core.thirdParty!==undefined);
        self['createThirdParty'] = function() {
            if(self.hasThirdParty()) {
                
                var f = $('<form class="form-vertical">').append(
                    '<label>Name:</label>','<input type="text" name="name">',
                    '<label>Source:</label>','<input type="text" name="src">',
                    '<label>Script:</label>',
                    '<textarea name="script" style="width:450px;height:350px;font-size:10px;font-family:monospace;"></textarea>'
                );
                
                APP.core.modals.showModal({
                    'title': 'Insert Third Party SDK/API',
                    'content': f,
                    'hidden':function(modal){
                        var name = modal.find('input[name=name]').val();
                        var script = modal.find('textarea').val();
                        var src = modal.find('input[name=src]').val();
                        
                        if(name && (script || src)) {
                            APP.core.thirdParty.addLib(name, script, src);
                        }
                    }
                });
                
            }
        };
        self['thirdLibs'] = APP.core.thirdParty.libs;
    };
    
    
    var serviceManager = new ServicesManager;
    
    APP['core'] = $.extend(APP.core, {
        'services': serviceManager
    });
    
})(this);
