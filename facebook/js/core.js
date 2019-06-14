/*
 * Javascript File
 * @author Valentinos Galanos <swg_lowraed@hotmail.com>
 * @version 1.0.0
 */
(function(win){
    var $ = win.jQuery;
    var ko = win.ko;
    
    var APP = win.APP || {}; win.APP = APP;
    var d = win.document;
    
    var FBPost = function(o) {
        var self = this;
        var attrs = o || {};
        for(var prop in attrs) {
            self[prop] = ko.observable(attrs[prop]);
        }
    };
    
    var FBProfile = function(o){
        var self = this;
        var attrs = o || {};
        for(var prop in attrs) {
            self[prop] = ko.observable(attrs[prop]);
        }
    };
    
    var FacebookAPI_loadAttributes = function() {
        var self = this;
        // Load Attributes
        self.callAPI('/me/permissions',function(res){
            var ps = res.data;
            self.permisions(ps);
        });
        self.callAPI('/me',function(res){
            var m_res = res;
            self.callAPI('/me/picture',function(res){
                m_res['picture'] = res.data.url;
                var p = new FBProfile(m_res);
                self.profile(p);
            });
        });
        self.callAPI('/me/home',function(res){
            var l = res.data;
            $(l).each(function(){
                var p = new FBPost(this);
                var fromId = p.from().id;
                self.callAPI('/'+fromId+'/picture', function(res){
                    p.from()['picture'] = res.data.url;
                    self.wall.push(p);
                });
            });
        });
    };
    
    var FacebookAPI = function(){
        var self = this, SDK=null;
        
        // Attributes
        self['authResponse'] = ko.observable();
        self['permisions'] = ko.observableArray();
        self['profile'] = ko.observable();
        self['wall'] = ko.observableArray();
        
        self['loadSDK'] = function(callback){
            var scripts = d.getElementsByTagName('script')[0];
            var js = d.createElement('script');
            js.id = 'facebook-jssdk';
            js.src = '//connect.facebook.net/en_US/sdk.js';
            
            win.fbAsyncInit = function(){
                win.FB.init({
                    'appId' : '111723685507895',
                    'xfbml' : true,
                    'version' : 'v2.5'
                });
                SDK = win.FB;
                if(callback!==undefined) callback.call(self, SDK);
            };
            
            scripts.parentNode.insertBefore(js, scripts);
        };
        
        self['callAPI'] = function(api,callback) {
            if(SDK) {
                SDK.api(api, function(res){
                    console.debug(res);
                    if(callback!==undefined) callback.call(self, res);
                });
            }
        };
        
        self['login'] = function(success, fail){
            if(SDK) {
                SDK.login(function(res){
                    console.debug(res);
                    
                    if(res.authResponse!==undefined) {
                        self.authResponse(res.authResponse);
                        if(res.authResponse) {
                            console.log('Logged in!');
                            if(success!==undefined) success.call(self, res);
                            // Login Success
                        } else {
                            console.log('Login canceled!');
                            if(fail!==undefined) fail.call(self, res);
                            // Login Error
                        }
                    }
                    
                },{
                    scope: "public_profile,user_friends,read_stream,email,read_mailbox"
                });
            }
        };
        
        self['isAuth'] = function(){
            SDK.getLoginStatus(function(res){
                var success = function(res){
                    FacebookAPI_loadAttributes.call(self);
                };
                
                if(res.authResponse!==undefined) {
                    self.authResponse(res.authResponse);
                    if(res.authResponse) {
                        console.log('isAuthenticated!');
                        FacebookAPI_loadAttributes.call(self);
                    } else {
                        self.login(success);
                    }
                } else {
                    self.login(success);
                }
                
            });
        };
        
        self['refresh'] = function(s, ev) {
            var $el = $(ev.target);
            $el.button('loading');
            
            self.callAPI('/me/home',function(res){
                var l = res.data;
                var ml = [];
                
                $(l).each(function(){
                    var p = new FBPost(this);
                    var fromId = p.from().id;
                    self.callAPI('/'+fromId+'/picture', function(res){
                        p.from()['picture'] = res.data.url;
                        ml.push(p);
                        self.wall(ml);
                    });
                });
                $el.button('reset');
            });
            
        };
    };
    
    var fb = new FacebookAPI;
    APP['core'] = {'facebook': fb};
    
    ko.applyBindings(fb,$('#fb-api')[0]);
    
    fb.loadSDK(function(){
        fb.isAuth();
    });
    
})(this);
