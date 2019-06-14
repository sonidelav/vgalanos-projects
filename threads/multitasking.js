/*
The MIT License

Copyright 2014 Valentinos Galanos <swg_lowraed@hotmail.com>.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
/* 
    Created on : 29 Μαρ 2014, 6:20:49 μμ
    Author     : Valentinos Galanos <swg_lowraed@hotmail.com>
*/
(function(win) {
     win['RSys'] = {
         ThreadLoop: ThreadLoop,
         Thread: Thread,
         ThreadPool: ThreadPool
     };

     /**
      * TheadLoop
      * @param {object} o
      * @returns {_L1.ThreadLoop}
      */
     function ThreadLoop(o) {
         var self = this, isSleeping = 0,
             obj = o || {
                task: function() {
                }, 
                complete: function() {
                }
            }, counter = 0,
             worker = function() {
                 if (self.isRunning) {
                     setTimeout(worker, isSleeping);
                     obj.task.call(self);
                     self.counter++;
                 } else {
                     obj.complete.call(self);
                 }

             };

         self['isRunning'] = true;
         self['counter'] = counter;
         self['stop'] = function() {
             self.isRunning = false;
         };
         self['sleep'] = function(seconds) {
             isSleeping = seconds;
         };
         
         worker();
     }
     /**
      * Thread
      * @param {function} task
      * @returns {_L1.Thread}
      */
     function Thread(task) {
         var self = this, t_res, isSleeping = 0;

         function startWorker(delay) {
             t_res = setTimeout(function() {
                 if (isSleeping > 0)
                     return;
                 task.call(self);
                 self.isRunning = false;
             }, delay);
         }

         self['run'] = function(delay) {
             self.delay = delay;
             startWorker(delay);
         };

         self['stop'] = function() {
             clearTimeout(t_res);
         };

         self['sleep'] = function(seconds) {
             isSleeping = seconds;
             var interval = setInterval(function() {
                 if (isSleeping > 0) {
                     isSleeping--;
                 }
                 else {
                     clearInterval(interval);
                 }
             }, 1000);
         };

         self['isRunning'] = true;

         self['delay'] = 0;
     }

     /**
      * Threads Pool
      * @returns {_L1.ThreadPool}
      */
     function ThreadPool() {
         var self = this, threads = [];
         self['threads'] = threads;

         self['newThread'] = function(task) {
             threads.push(new Thread(task));
         };

         self['runThreads'] = function() {
             for (var i = 0; i < threads.length; ++i) {
                 threads[i].run(0);
             }
         };
     }

 })(this);