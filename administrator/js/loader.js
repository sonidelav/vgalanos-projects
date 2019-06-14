/*
 * Javascript File
 * @author Valentinos Galanos <swg_lowraed@hotmail.com>
 * @version 1.0.0
 */
(function(win){
    var $ = win.jQuery;
    var APP = win.APP || {}; win.APP = APP;
    /*
     * Script Loader
     */
    var ScriptLoader = function() {
        var self = this;
        var $script_tmp = $('<script>');
        var $html_tmp = $('<div>');
        
        self['loadScript'] = function(script, onload) {
            var $el = $script_tmp.clone();
            $el.attr({
                'src' : script,
                'type' : 'text/javascript',
                'onload' : onload
            }).appendTo('body');
            //console.log('Loader: Script loaded!');
            //console.debug($el);
        };
        
        self['loadHTML'] = function(name, url, onload) {
            var $el = $html_tmp.clone();
            $el.attr({
                'id' : name,
                'class' : 'html-template'
            }).css('display','none').appendTo('body');
            //console.log('Loader: HTML load...');
            //console.debug($el);
            $el.load(url, null, onload);
        };
        
        self['loadCSS'] = function(url) {
            var $el = $('<link>');
            $el.attr({
                'rel' : 'stylesheet',
                'href' : url
            }).appendTo('head');
            //console.log('Loader: CSS load...');
            //console.debug($el);
        };
    };
    
    
    APP['loader'] = new ScriptLoader;
    
    APP.loader.loadScript('js/core.js');
})(this);
