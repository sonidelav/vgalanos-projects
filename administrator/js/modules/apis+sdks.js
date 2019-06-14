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
     * API or SDK
     */
    var ThirdPartyLib = function(name, script, src) {
        var self = this;
        self['name'] = ko.observable(name);
        self['script'] = ko.observable(script);
        self['src'] = ko.observable(src);
        self['loaded'] = ko.observable(false);
        
        self['load'] = function(onload) {
            var $el = $('<script>').attr({
                'class' : self.name(),
                'src' : self.src(),
                'onload' : function(){
                    if(win.console!==undefined) {
                        win.console.log('Third party lib loaded: ' + self.name());
                        if(win.console.debug!==undefined) {
                            win.console.debug(this);
                        }
                    }
                    if(onload!==undefined) onload.call(self, this);
                    self.loaded(true);
                }
            }).html(self.script());
            $el.appendTo('body');
        };
    };
    /*
     * API & SDK Manager
     */
    var ThirdPartyManager = function() {
        var self = this;
        self['libs'] = ko.observableArray();
        
        self['addLib'] = function(name, script, src) {
            var lib = new ThirdPartyLib(name, script, src);
            self.libs.push(lib);
        };
        
        self['findLib'] = function(name) {
            var ret=null;
            $(self.libs()).each(function(){
                if(this.name()===name) {
                    ret = this;
                    return false;
                }
            });
            return ret;
        };
        
        self['loadLib'] = function(name, onload) {
            var l = self.findLib(name);
            if(l.loaded()===false) l.load(onload);
        };
    };
    
    var thirdPartyManager = new ThirdPartyManager;
    
    APP['core'] = $.extend(APP.core, {
        'thirdParty': thirdPartyManager
    });
    
})(this);
