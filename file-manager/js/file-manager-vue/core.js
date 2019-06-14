/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/*
 * Javascript File
 * @author Valentinos Galanos <swg_lowraed@hotmail.com>
 * @version 1.0.0
 */
(function(w){
    // Import
    var Vue = w.Vue,
        FileManager = w.FileManager || {},
        Components = FileManager.Components,
        $ = w.jQuery;

    if(!Vue) throw new Error('Vue.js is missing!');

    if(!Components) throw new Error('Components is missing!');


    // Application Store
    var AppStore = {
        'files': [],

        'loadFiles': function() {
            console.log('New File Added...');
            this.files.push({
                "name":"api2.php",
                "path":"\/home\/vhosts\/vg-portofolio.ueuo.com\/file-manager\/api2.php",
                "type":"File",
                "size":1804
            });
        }
    };


    // Application Core
    var CoreApp = new Vue({
        el: '#app',
        template:
            '<div>'+
                '<h3>Entries</h3>'+
                '<list class="file-list" :items="files"></list>'+
            '</div>',
        data: {
            files: AppStore.files
        },
        components: {
            'list': Components.FileList
        },
        ready: function() {
            //AppStore.loadFiles();
        }
    });

    // Export
    w.CoreApp = CoreApp;
    w.AppStore = AppStore;
})(window);
