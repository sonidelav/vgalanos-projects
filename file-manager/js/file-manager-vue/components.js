/**
 * Created by Sonid on 11/12/2015.
 */
(function (w) {
    // Import
    var Vue = w.Vue,
        $ = w.jQuery;

    if(!Vue) throw new Error('Vue.js is missing!');

    // File Item Component
    var FileItem = Vue.extend({
        template:
            '<li>'+
                '<div v-if="isFile">'+
                    '<span class="span2">'+
                        '<span class="icon-folder-close"></span>'+
                        '<a href="javascript:void(0)">{{item.name}}</a>'+
                    '</span>'+

                    '<span class="span2">{{item.type}}</span>'+
                    '<span class="span2">{{item.size}}</span>'+
                '</div>'+
            '</li>',
        props: {
            'item': Object
        },
        computed: {
            'isFile': function() {
                return this.item.type == 'File';
            },
            'isDirectory': function() {
                return this.item.type == 'Directory';
            }
        },
        ready: function() {
            console.log('File Item Component Loaded...');
        }
    });

    // FileList Component
    var FileList = Vue.extend({
        template:
            '<ul>'+
                '<file v-for="item in items" :item="item"></file>'+
            '</ul>',
        props: {
            'items': Array
        },
        methods: {},
        components: {
            'file': FileItem
        },
        ready: function() {
            console.log('File List Component Loaded...');
        }
    });

    // Export
    w.FileManager  = {
        'Components' : {
            'FileList': FileList
        }
    };
})(window);