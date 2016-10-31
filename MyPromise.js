var Promise = function(fn) {
    this.result = undefined;
    this.state = 'pending';
    this.queue_fullfield = [];
    this.queue_reject = [];
    this.resolve = (value) => {
        //console.log('resolve',this.state,value);
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
        //console.log('reject',this.state,err,this.result);
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
        var newP = new Promise(function(){});
        var thes = this;
    
        var fulfilledFunc;
        if (typeof onFulfilled === 'function') {
            fulfilledFunc = function () {                
                var res = onFulfilled(thes.result);
                newP.resolve(res);
            };
        } else {
            fulfilledFunc = function () {
                newP.resolve(thes.result);
            };
        }
        
        var rejectedFunc;
        if (typeof onRejected === 'function') {
            rejectedFunc = function () {
                //console.log('onRejected',thes.result);
                var res = onRejected(thes.result);
                newP.resolve(res);
            };
        } else {
            rejectedFunc = function () {
                newP.reject(thes.result);
            }   
        };
        
        //console.log(this.state,onFulfilled,onRejected);
        if (this.state === 'pending') {
            this.queue_fullfield.push(fulfilledFunc);
            this.queue_reject.push(rejectedFunc);
        } else if (this.state === 'fulfilled') {
            setTimeout(fulfilledFunc);
        } else {
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
prom.then(res => console.log(res), res => alert(res+" then!"));
prom.catch(res => alert(res+" catch!"));
//.then(res => alert(res))
/*prom.then(function(){console.log("success")},function(){console.log("err")}).then(function(){console.log("success2")},function(){console.log("err2")});*/