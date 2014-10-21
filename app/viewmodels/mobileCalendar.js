define(function (require) {

    var mobileCalendar = function () {
            //Hooking up durandal composition callbacks
            this.activate = activate;
            this.binding = binding;
            this.bindingComplete = bindingComplete;
            this.attached = attached;
            this.compositionComplete = compositionComplete;
            this.detached = detached;
        },
        calendar;
    
    function activate(activationData) {//Fires on activation to allow custom activation logic.
        //activationData is a property of the 'compose' method

        this.selected = activationData.selected || moment();
        this.events = activationData.events || [];
        
    }
    function binding(view) {//Fires immediately before databinding occurs.

    }
    function bindingComplete(view) {//Fires immediately after databinding occurs.

    }
    function attached(view, parent, model) {//Fires when the model's view is attached to its parent DOM node.
        var test = this.calendar.observe('MMMM');
        debugger;
        this.calendar.month(2);
        this.calendar.valueHasMutated();
    }
    function compositionComplete(view, parent, model) {//Fires when the model's composition is complete.

    }
    function detached(view, parent, model) {//Fires when the model's view is removed from the DOM 

    }

    /************************************
        Constants
    ************************************/
    var lastDayOffset = [0,3,0,1,0,1,0,0,1,0,1,0]

    /************************************
        Helpers
    ************************************/
    function merge(root) {
        for (var i = 1; i < arguments.length; i++) {
            for (var key in arguments[i]) {
                if (arguments[i].hasOwnProperty(key)) {
                    root[key] = arguments[i][key];
                } else if (root.constructor) {
                    root.constructor.prototype[key] = arguments[i][key];
                }
            }
        }
        return root;
    }

    function extend(a, b, proto) {

        for (var i in b) {
            if (b.hasOwnProperty(i)) {
                a[i] = b[i];
            } else if (proto) {
                a.constructor.prototype[i] = b[i];
            }
        }

        if (b.hasOwnProperty("toString")) {
            a.toString = b.toString;
        }

        if (b.hasOwnProperty("valueOf")) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    /************************************
        Constructors
    ************************************/
    function Calendar(config) {
        var m = new moment(config);
        var o = ko.observable(m);
        merge(this, m, o);
    }

    /************************************
        Top Level Functions
    ************************************/

    calendar = function (input, format, lang, strict) {
        var c;
        c = {};
        c._i = input;
        c._f = format;
        c._l = lang;
        c._strict = strict;

        return new Calendar(c);
    };


    /************************************
        Calendar Prototype
    ************************************/
    extend(calendar.fn = Calendar.prototype, {
        //custom methods that interact with the moment object
        begin: new calendar().date(1),
        data:ko.observableArray(),
        render: function (months) {
            var weekData = [];
            for (var m = 0; m < months; m++) {
                for (var w = 0; w < 7; w++) {
                    weekData[(m * 7) + w] = ko.observable();
                    var week = new calendar().month(this.begin.month() + m).date(1); //.week(this.begin.month(this.begin.month() + m).week() + w - 1)
                    week.week(week.week() + w - 1);
                    debugger;
                    week.weekIndex = w;
                    weekData[(m * 7) + w](week);
                }
            }
            return weekData;
        },
        observe: function (inputString) {
            var observing = ko.observable(this.format(inputString));

            this.subscribe(function (newValue) {
                observing(newValue.format(inputString));
            }, this);

            return observing;
        }
    });

    /************************************
        View Bindings
        These are local functions that will be bound to the view 
    ************************************/
    //mobileCalendar.prototype.initCalendar = initCalendar;
    mobileCalendar.prototype.calendar = new calendar();
    debugger;


    return mobileCalendar;
});