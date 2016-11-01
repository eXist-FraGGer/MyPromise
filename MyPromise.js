var Promise = function (fn) {
    this.result = undefined;
    this.state = 'pending';
    this.queue_fullfield = [];
    this.queue_reject = [];
    this.resolve = (value) => {
        if (this.state !== 'pending') return;
        this.result = value;
        this.state = 'fulfilled';
        for(var i = 0; i < this.queue_fullfield.length; i++) {
            this.queue_fullfield[i].apply(null,arguments);
        }
        this.queue_fullfield = [];
        this.queue_reject = [];
        return this;
    };
    this.reject = (err) => {
        if (this.state !== 'pending') return;
        this.state = 'rejected';
        this.result = err;
        for(var i = 0; i < this.queue_reject.length; i++) {
            this.queue_reject[i].apply(null,arguments);
        }
        this.queue_reject = [];
        this.queue_fullfield = [];
        return this;
    }
    fn(this.resolve,this.reject);
}

Promise.prototype = {
    then: function(onFulfilled, onRejected) {
        var thes = this;
        var newP = new Promise(function(resolve, reject) {
            setTimeout(function() {});
        });
    
        var fulfilledFunc;
        if (typeof onFulfilled === 'function') {
            fulfilledFunc = function () {
                newP.resolve(onFulfilled(thes.result));
            };
        } else {
            fulfilledFunc = function () {
                newP.resolve(thes.result);
            };
        }
        
        var rejectedFunc;
        if (typeof onRejected === 'function') {
            rejectedFunc = function () {
                newP.reject(onRejected(thes.result));
            };
        } else {
            rejectedFunc = function () {
                newP.reject(thes.result);
            }   
        };
        
        if (this.state === 'pending') {
            this.queue_fullfield.push(fulfilledFunc);
            this.queue_reject.push(rejectedFunc);
        } else if (this.state === 'fulfilled') {
            setTimeout(fulfilledFunc);
        } else if (this.state === 'rejected') {
            setTimeout(rejectedFunc);
        }
        return newP;
    },
    catch: function(onRejected) {
        return this.then(null, onRejected);
    }
}


var prom = new Promise(function(resolve, reject) {
    setTimeout(function() {
        //console.log(resolve);
        reject(123);
    },2000);
});
//setTimeout(function(){console.log('sd')});

// prom.resolve('ollolo');
// prom.reject('emmmsad');
prom.then(res => { console.log(res+" then 1 resolve!"); return res+" then 1 resolve!"; }, 
          res => { console.log(res+" then 1 reject!"); return res+" then 1 reject!"; })
    .then(res => { console.log(res+" then 2 resolve!"); return res+" then 2 resolve!"; }, 
          res => { console.log(res+" then 2 reject!"); return res+" then 2 reject!"; })
    .catch(res => { console.log(res+" catch!"); return ; res+" catch!"});
//prom.catch(res => alert(res+" catch!"));
//.then(res => alert(res))
/*prom.then(function(){console.log("success")},function(){console.log("err")}).then(function(){console.log("success2")},function(){console.log("err2")});*/