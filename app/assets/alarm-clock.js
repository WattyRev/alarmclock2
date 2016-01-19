"use strict";
/* jshint ignore:start */

/* jshint ignore:end */

define('alarm-clock/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', 'alarm-clock/config/environment'], function (exports, _ember, _emberResolver, _emberLoadInitializers, _alarmClockConfigEnvironment) {

  var App = undefined;

  _ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = _ember['default'].Application.extend({
    modulePrefix: _alarmClockConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _alarmClockConfigEnvironment['default'].podModulePrefix,
    Resolver: _emberResolver['default']
  });

  (0, _emberLoadInitializers['default'])(App, _alarmClockConfigEnvironment['default'].modulePrefix);

  exports['default'] = App;
});
define('alarm-clock/components/active-alarm', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({
        classNames: ['active-alarm'],

        timeService: _ember['default'].inject.service('time'),

        alarmsService: _ember['default'].inject.service('alarms'),

        soundService: _ember['default'].inject.service('sound'),

        stopped: null,

        doneSnoozing: false,

        alarming: (function () {
            var now = this.get('timeService.now');
            var stopped = this.get('stopped');
            if (this.get('doneSnoozing')) {
                return true;
            }
            if (stopped && stopped.getTime() + 61000 >= now.getTime()) {
                return false;
            }
            var weekDays = this.get('timeService.weekDays');
            var today = weekDays[now.getDay()].toLowerCase();
            var alarm = this.get('alarmsService.alarms').filter(function (value) {
                if (!value.isEnabled) {
                    return false;
                }
                if (!value.selectedDays[today]) {
                    return false;
                }
                if (value.hours !== now.getHours()) {
                    return false;
                }
                if (value.minutes !== now.getMinutes()) {
                    return false;
                }
                return true;
            });
            if (!alarm[0]) {
                return false;
            }
            return true;
        }).property('timeService.now', 'stopped', 'doneSnoozing'),

        toggleSound: (function () {
            var alarming = this.get('alarming');
            var sound = this.get('soundService');
            var playing = this.get('soundService.playing');
            if (alarming && !playing) {
                sound.play();
                return;
            }
            if (!alarming && playing) {
                sound.stop();
                return;
            }
        }).observes('alarming'),

        actions: {
            snooze: function snooze() {
                var self = this;
                self.set('doneSnoozing', false);
                var service = self.get('alarmsService');
                service.set('snooze', self.get('timeService.now'));
                _ember['default'].run.later(function () {
                    service.set('snooze', null);
                    self.set('doneSnoozing', true);
                }, 10 * 60 * 1000);
            },

            stop: function stop() {
                this.set('doneSnoozing', false);
                this.set('stopped', this.get('timeService.now'));
            }
        }
    });
});
define('alarm-clock/components/alarm-control', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({
        classNames: ['alarm-control'],

        touching: false,

        touchTimer: null,

        touchStart: function touchStart() {
            var self = this;
            self.set('touching', true);
            self.set('touchTimer', _ember['default'].run.later(function () {
                console.log('run later');
                self.set('touching', false);
                self.set('touchTimer', false);
                self.sendAction('longPress');
            }, 5 * 1000));
        },

        touchEnd: function touchEnd() {
            this.set('touching', false);
            if (this.get('touchTimer')) {
                _ember['default'].run.cancel(this.get('touchTimer'));
                this.sendAction('shortPress');
            }
        }
    });
});
define('alarm-clock/components/alarm-form', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({
        tagName: 'form',

        time: null,

        selectedDays: {
            sunday: false,
            monday: true,
            tuesday: true,
            wednesday: true,
            thursday: true,
            friday: true,
            saturday: false
        },

        actions: {
            toggleDay: function toggleDay(dayName) {
                dayName = 'selectedDays.' + dayName;
                this.set(dayName, !this.get(dayName));
            }
        },

        isValidTime: function isValidTime() {
            var time = this.get('time');
            if (!time) {
                return false;
            }
            time = time.split(':');
            if (time.length !== 2) {
                return false;
            }
            time.map(function (value) {
                return parseInt(value);
            });
            if (time[0] < 0 || time[0] > 23 || time[1] < 0 || time[1] > 59) {
                return false;
            }
            return true;
        },

        sendSubmit: function sendSubmit() {
            var alarm = {};

            var time = this.get('time').split(':').map(function (value) {
                return parseInt(value);
            });
            alarm.hours = time[0];
            alarm.minutes = time[1];
            alarm.selectedDays = this.get('selectedDays');
            this.sendAction('save', alarm);
        },

        submit: function submit(e) {
            e.preventDefault();
            if (this.isValidTime()) {
                this.sendSubmit();
            }
        }
    });
});
define('alarm-clock/components/alarm-item', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({
        tagName: 'li',
        classNames: ['alarm-item'],
        alarmsService: _ember['default'].inject.service('alarms'),

        index: (function () {
            return this.$().index();
        }).property('alarm'),

        displayHours: (function () {
            var hours = this.get('alarm.hours');
            if (hours > 12) {
                hours = hours - 12;
            }
            if (hours === 0) {
                hours = 12;
            }
            return hours;
        }).property('alarm.hours'),

        displayMinutes: (function () {
            var minutes = this.get('alarm.minutes');
            if (minutes < 10) {
                minutes = '0' + minutes;
            }
            return minutes;
        }).property('alarm.minutes'),

        ampm: (function () {
            var hours = this.get('alarm.hours');
            var ampm = 'AM';
            if (hours > 11) {
                ampm = 'PM';
            }
            return ampm;
        }).property('alarm.hours'),

        actions: {
            toggleEnabled: function toggleEnabled() {
                this.set('alarm.isEnabled', !this.get('alarm.isEnabled'));
                this.get('alarmsService').saveAlarms();
            },
            'delete': function _delete() {
                var self = this;
                if (self.get('isDeleting')) {
                    _ember['default'].run.cancel(self.get('deleteTimer'));
                    var index = self.$().index();
                    self.sendAction('deleteAlarm', index);
                } else {
                    self.set('isDeleting', true);
                    self.set('deleteTimer', _ember['default'].run.later(function () {
                        self.set('isDeleting', false);
                    }, 500));
                }
            },
            edit: function edit() {
                var index = this.$().index();
                this.sendAction('editAlarm', index);
            }
        }
    });
});
define('alarm-clock/components/app-version', ['exports', 'ember-cli-app-version/components/app-version', 'alarm-clock/config/environment'], function (exports, _emberCliAppVersionComponentsAppVersion, _alarmClockConfigEnvironment) {

  var name = _alarmClockConfigEnvironment['default'].APP.name;
  var version = _alarmClockConfigEnvironment['default'].APP.version;

  exports['default'] = _emberCliAppVersionComponentsAppVersion['default'].extend({
    version: version,
    name: name
  });
});
define('alarm-clock/components/prepare-alarm', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({
        classNames: ['prepare-alarm'],

        prepared: false,

        soundService: _ember['default'].inject.service('sound'),

        touchStart: function touchStart() {
            var service = this.get('soundService');
            service.prepare();
            this.set('prepared', true);
        }
    });
});
define('alarm-clock/components/the-clock', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({
        time: _ember['default'].inject.service('time'),
        classNames: 'clock',
        alarms: _ember['default'].inject.service('alarms'),

        snooze: (function () {
            if (!this.get('alarms.snooze')) {
                return '';
            }
            var now = Math.ceil(this.get('time.now').getTime() / 60000);
            var snooze = Math.ceil(this.get('alarms.snooze').getTime() / 60000);
            var remaining = (now - snooze - 10) * -1;
            return remaining + 'mins';
        }).property('alarms.snooze', 'time.now'),

        nextAlarm: (function () {
            var next = this.get('alarms.nextAlarm');
            if (!next.hours) {
                return '';
            }
            var hours = next.hours > 12 ? next.hours - 12 : next.hours;
            if (hours === 0) {
                hours = 12;
            }
            var minutes = next.minutes < 10 ? '0' + next.minutes : next.minutes;
            var ampm = next.hours > 11 ? 'PM' : 'AM';

            return hours + ':' + minutes + ampm;
        }).property('alarms.nextAlarm')
    });
});
define('alarm-clock/components/the-rings', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({});
});
define('alarm-clock/components/time-input', ['exports', 'ember-time-input/components/time-input'], function (exports, _emberTimeInputComponentsTimeInput) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberTimeInputComponentsTimeInput['default'];
    }
  });
});
define('alarm-clock/components/touch-to', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    /**
     * Default tag name applied to the component.
     *
     * @type {String}
     */
    tagName: 'a',

    /**
     * When the touchStart event is sent from the component.
     *
     * @return {Void}
     */
    touchStart: function touchStart() {
      var context = this.container.lookup('controller:application');
      var destination = this.get('destination');
      context.transitionTo(destination);
    }
  });
});
define('alarm-clock/controllers/array', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller;
});
define('alarm-clock/controllers/object', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller;
});
define('alarm-clock/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'alarm-clock/config/environment'], function (exports, _emberCliAppVersionInitializerFactory, _alarmClockConfigEnvironment) {
  exports['default'] = {
    name: 'App Version',
    initialize: (0, _emberCliAppVersionInitializerFactory['default'])(_alarmClockConfigEnvironment['default'].APP.name, _alarmClockConfigEnvironment['default'].APP.version)
  };
});
define('alarm-clock/initializers/export-application-global', ['exports', 'ember', 'alarm-clock/config/environment'], function (exports, _ember, _alarmClockConfigEnvironment) {
  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_alarmClockConfigEnvironment['default'].exportApplicationGlobal !== false) {
      var value = _alarmClockConfigEnvironment['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = _ember['default'].String.classify(_alarmClockConfigEnvironment['default'].modulePrefix);
      }

      if (!window[globalName]) {
        window[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete window[globalName];
          }
        });
      }
    }
  }

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('alarm-clock/router', ['exports', 'ember', 'alarm-clock/config/environment'], function (exports, _ember, _alarmClockConfigEnvironment) {

  var Router = _ember['default'].Router.extend({
    location: _alarmClockConfigEnvironment['default'].locationType
  });

  Router.map(function () {
    this.route('alarms');
    this.route('new');
    this.route('edit', {
      path: '/edit/:index'
    });
  });

  exports['default'] = Router;
});
define('alarm-clock/routes/alarms', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Route.extend({
        alarms: _ember['default'].inject.service('alarms'),
        model: function model() {
            return this.get('alarms.alarms');
        },
        actions: {
            deleteAlarm: function deleteAlarm(index) {
                var service = this.get('alarms');
                service.get('alarms').removeAt(index);
                service.saveAlarms();
            },
            editAlarm: function editAlarm(index) {
                this.transitionTo('edit', index);
            }
        }
    });
});
define('alarm-clock/routes/edit', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Route.extend({
        alarmsService: _ember['default'].inject.service('alarms'),

        model: function model(params) {
            var alarm = this.get('alarmsService.alarms').objectAt(params.index);
            var time = alarm.hours + ':';
            if (alarm.minutes > 10) {
                time += alarm.minutes;
            } else {
                time += '0' + alarm.minutes;
            }
            return {
                alarm: alarm,
                time: time,
                index: params.index
            };
        },

        actions: {
            saveAlarm: function saveAlarm(alarm) {
                var alarms = this.get('alarmsService.alarms');
                var index = this.get('currentModel.index');
                var _alarm = alarms.objectAt(index);
                alarm.isEnabled = _alarm.isEnabled;
                alarms.splice(index, 1);
                alarms.push(alarm);
                this.set('alarmsService.alarms', alarms);
                this.get('alarmsService').saveAlarms();
                this.transitionTo('alarms');
            }
        }
    });
});
define('alarm-clock/routes/index', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define('alarm-clock/routes/new', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Route.extend({
        alarms: _ember['default'].inject.service('alarms'),

        actions: {
            createNewAlarm: function createNewAlarm(alarm) {
                var alarms = this.get('alarms.alarms');
                alarm.isEnabled = true;
                alarms.push(alarm);
                this.set('alarms.alarms', alarms);
                this.get('alarms').saveAlarms();
                this.transitionTo('alarms');
            }
        }
    });
});
define('alarm-clock/services/alarms', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Service.extend({
        alarms: null,
        time: _ember['default'].inject.service('time'),

        snooze: null,

        nextAlarm: (function () {
            var alarms = this.get('alarms');
            var time = this.get('time');
            var now = time.get('now');
            var today = time.get('weekDays')[now.getDay()].toLowerCase();
            var tomorrow = undefined;
            if (now.getDay() > 5) {
                tomorrow = time.get('weekDays')[0].toLowerCase();
            } else {
                tomorrow = time.get('weekDays')[now.getDay() + 1].toLowerCase();
            }
            if (!alarms.length) {
                return {};
            }
            var filtered = alarms.filter(function (value) {
                var selectedDays = value.selectedDays;

                if (!value.isEnabled) {
                    return false;
                }
                if (!selectedDays[today] && !selectedDays[tomorrow]) {
                    return false;
                }
                if (selectedDays[today] && value.hours >= now.getHours()) {
                    if (value.hours === now.getHours()) {
                        return value.minutes > now.getMinutes();
                    } else {
                        return true;
                    }
                }
                if (selectedDays[tomorrow] && value.hours <= now.getHours()) {
                    if (value.hours === now.getHours()) {
                        return value.minutes < now.getMinutes();
                    } else {
                        return true;
                    }
                }
            });
            filtered.sort(function (a, b) {
                if (a.selectedDays[today] && !b.selectedDays[today]) {
                    return 1;
                }
                if (!a.selectedDays[today] && b.selectedDays[today]) {
                    return -1;
                }
                if (a.hours < b.hours) {
                    return 1;
                }
                if (a.hours > b.hours) {
                    return -1;
                }
                if (a.minutes < b.minutes) {
                    return 1;
                }
                if (a.minutes > b.minutes) {
                    return -1;
                }
            });
            return filtered[0];
        }).property('alarms', 'time.now'),

        saveAlarms: function saveAlarms() {
            localStorage.alarms = JSON.stringify(this.get('alarms'));
        },

        getAlarms: (function () {
            var alarms = localStorage.alarms ? JSON.parse(localStorage.alarms) : [];
            this.set('alarms', alarms);
        }).on('init')

    });
});
define('alarm-clock/services/sound', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Service.extend({
        playing: false,

        prepare: function prepare() {
            var self = this;
            self.play();
            _ember['default'].run.next(function () {
                self.stop();
            });
        },

        play: function play() {
            this.set('playing', true);
            _ember['default'].$('audio')[0].play();
        },

        stop: function stop() {
            this.set('playing', false);
            _ember['default'].$('audio')[0].pause();
            _ember['default'].$('audio')[0].currentTime = 0;
        }
    });
});
define('alarm-clock/services/time', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Service.extend({
        now: new Date(),

        time: (function () {
            var now = this.get('now'),
                hours = now.getHours(),
                minutes = now.getMinutes(),
                ampm = hours > 11 ? 'PM' : 'AM';

            if (hours > 12) {
                hours = hours - 12;
            } else if (hours === 0) {
                hours = 12;
            }
            if (minutes < 10) {
                minutes = '0' + minutes;
            }
            return hours + ':' + minutes + '<small>' + ampm + '</small>';
        }).property('now'),

        date: (function () {
            var now = this.get('now'),
                weekDays = this.get('weekDays'),
                months = this.get('months'),
                day = weekDays[now.getDay()],
                month = months[now.getMonth()],
                date = now.getDate(),
                year = now.getFullYear();

            return day + ', ' + month + ' ' + date + ', ' + year;
        }).property('now'),

        weekDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'November', 'December'],

        setTimer: function setTimer(seconds) {
            var self = this;
            _ember['default'].run.later(function () {
                self.setTime();
            }, seconds * 1000);
        },

        setTime: (function () {
            var past = this.get('now').getMinutes();
            this.set('now', new Date());
            var now = this.get('now').getMinutes();
            if (past !== now) {
                this.setTimer(60);
            } else {
                this.setTimer(1);
            }
        }).on('init')
    });
});
define("alarm-clock/templates/alarms", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@1.13.10",
          "loc": {
            "source": null,
            "start": {
              "line": 2,
              "column": 4
            },
            "end": {
              "line": 2,
              "column": 63
            }
          },
          "moduleName": "alarm-clock/templates/alarms.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "revision": "Ember@1.13.10",
          "loc": {
            "source": null,
            "start": {
              "line": 3,
              "column": 4
            },
            "end": {
              "line": 3,
              "column": 64
            }
          },
          "moduleName": "alarm-clock/templates/alarms.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child2 = (function () {
      return {
        meta: {
          "revision": "Ember@1.13.10",
          "loc": {
            "source": null,
            "start": {
              "line": 6,
              "column": 8
            },
            "end": {
              "line": 8,
              "column": 8
            }
          },
          "moduleName": "alarm-clock/templates/alarms.hbs"
        },
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("            ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [["inline", "alarm-item", [], ["alarm", ["subexpr", "@mut", [["get", "alarm", ["loc", [null, [7, 31], [7, 36]]]]], [], []], "deleteAlarm", "deleteAlarm", "editAlarm", "editAlarm"], ["loc", [null, [7, 12], [7, 86]]]]],
        locals: ["alarm"],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@1.13.10",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 11,
            "column": 0
          }
        },
        "moduleName": "alarm-clock/templates/alarms.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "manage-alarms");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("ul");
        dom.setAttribute(el2, "class", "alarms-list");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var morphs = new Array(3);
        morphs[0] = dom.createMorphAt(element0, 1, 1);
        morphs[1] = dom.createMorphAt(element0, 3, 3);
        morphs[2] = dom.createMorphAt(dom.childAt(element0, [5]), 1, 1);
        return morphs;
      },
      statements: [["block", "touch-to", [], ["destination", "index", "class", "nav fa fa-clock-o"], 0, null, ["loc", [null, [2, 4], [2, 76]]]], ["block", "touch-to", [], ["destination", "new", "class", "add-alarm fa fa-plus"], 1, null, ["loc", [null, [3, 4], [3, 77]]]], ["block", "each", [["get", "model", ["loc", [null, [6, 16], [6, 21]]]]], [], 2, null, ["loc", [null, [6, 8], [8, 17]]]]],
      locals: [],
      templates: [child0, child1, child2]
    };
  })());
});
define("alarm-clock/templates/application", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@1.13.10",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 6,
            "column": 0
          }
        },
        "moduleName": "alarm-clock/templates/application.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "background");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(3);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0]), 1, 1);
        morphs[1] = dom.createMorphAt(fragment, 2, 2, contextualElement);
        morphs[2] = dom.createMorphAt(fragment, 4, 4, contextualElement);
        return morphs;
      },
      statements: [["content", "the-rings", ["loc", [null, [2, 4], [2, 17]]]], ["content", "outlet", ["loc", [null, [4, 0], [4, 10]]]], ["content", "prepare-alarm", ["loc", [null, [5, 0], [5, 17]]]]],
      locals: [],
      templates: []
    };
  })());
});
define("alarm-clock/templates/components/active-alarm", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@1.13.10",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 3,
              "column": 0
            }
          },
          "moduleName": "alarm-clock/templates/components/active-alarm.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [["inline", "alarm-control", [], ["shortPress", "snooze", "longPress", "stop"], ["loc", [null, [2, 4], [2, 58]]]]],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@1.13.10",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 4,
            "column": 0
          }
        },
        "moduleName": "alarm-clock/templates/components/active-alarm.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["block", "if", [["get", "alarming", ["loc", [null, [1, 6], [1, 14]]]]], [], 0, null, ["loc", [null, [1, 0], [3, 7]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("alarm-clock/templates/components/alarm-control", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@1.13.10",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 7,
            "column": 0
          }
        },
        "moduleName": "alarm-clock/templates/components/alarm-control.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "background");
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [2]);
        var morphs = new Array(1);
        morphs[0] = dom.createAttrMorph(element0, 'class');
        return morphs;
      },
      statements: [["attribute", "class", ["concat", ["action ", ["subexpr", "if", [["get", "touching", ["loc", [null, [4, 24], [4, 32]]]], "touching"], [], ["loc", [null, [4, 19], [4, 45]]]]]]]],
      locals: [],
      templates: []
    };
  })());
});
define("alarm-clock/templates/components/alarm-form", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@1.13.10",
          "loc": {
            "source": null,
            "start": {
              "line": 12,
              "column": 4
            },
            "end": {
              "line": 12,
              "column": 61
            }
          },
          "moduleName": "alarm-clock/templates/components/alarm-form.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Cancel");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@1.13.10",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 15,
            "column": 0
          }
        },
        "moduleName": "alarm-clock/templates/components/alarm-form.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "button-group");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        dom.setAttribute(el2, "type", "button");
        var el3 = dom.createTextNode("Sunday");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        dom.setAttribute(el2, "type", "button");
        var el3 = dom.createTextNode("Monday");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        dom.setAttribute(el2, "type", "button");
        var el3 = dom.createTextNode("Tuesday");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        dom.setAttribute(el2, "type", "button");
        var el3 = dom.createTextNode("Wednesday");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        dom.setAttribute(el2, "type", "button");
        var el3 = dom.createTextNode("Thursday");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        dom.setAttribute(el2, "type", "button");
        var el3 = dom.createTextNode("Friday");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        dom.setAttribute(el2, "type", "button");
        var el3 = dom.createTextNode("Saturday");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "action");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        dom.setAttribute(el2, "type", "submit");
        var el3 = dom.createTextNode("Save");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [2]);
        var element1 = dom.childAt(element0, [1]);
        var element2 = dom.childAt(element0, [3]);
        var element3 = dom.childAt(element0, [5]);
        var element4 = dom.childAt(element0, [7]);
        var element5 = dom.childAt(element0, [9]);
        var element6 = dom.childAt(element0, [11]);
        var element7 = dom.childAt(element0, [13]);
        var morphs = new Array(16);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        morphs[1] = dom.createAttrMorph(element1, 'class');
        morphs[2] = dom.createElementMorph(element1);
        morphs[3] = dom.createAttrMorph(element2, 'class');
        morphs[4] = dom.createElementMorph(element2);
        morphs[5] = dom.createAttrMorph(element3, 'class');
        morphs[6] = dom.createElementMorph(element3);
        morphs[7] = dom.createAttrMorph(element4, 'class');
        morphs[8] = dom.createElementMorph(element4);
        morphs[9] = dom.createAttrMorph(element5, 'class');
        morphs[10] = dom.createElementMorph(element5);
        morphs[11] = dom.createAttrMorph(element6, 'class');
        morphs[12] = dom.createElementMorph(element6);
        morphs[13] = dom.createAttrMorph(element7, 'class');
        morphs[14] = dom.createElementMorph(element7);
        morphs[15] = dom.createMorphAt(dom.childAt(fragment, [4]), 1, 1);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [["inline", "input", [], ["type", "text", "value", ["subexpr", "@mut", [["get", "time", ["loc", [null, [1, 26], [1, 30]]]]], [], []], "placeholder", "06:00"], ["loc", [null, [1, 0], [1, 52]]]], ["attribute", "class", ["concat", [["subexpr", "if", [["get", "selectedDays.sunday", ["loc", [null, [3, 38], [3, 57]]]], "selected"], [], ["loc", [null, [3, 33], [3, 70]]]]]]], ["element", "action", ["toggleDay", "sunday"], ["on", "touchStart"], ["loc", [null, [3, 72], [3, 119]]]], ["attribute", "class", ["concat", [["subexpr", "if", [["get", "selectedDays.monday", ["loc", [null, [4, 38], [4, 57]]]], "selected"], [], ["loc", [null, [4, 33], [4, 70]]]]]]], ["element", "action", ["toggleDay", "monday"], ["on", "touchStart"], ["loc", [null, [4, 72], [4, 119]]]], ["attribute", "class", ["concat", [["subexpr", "if", [["get", "selectedDays.tuesday", ["loc", [null, [5, 38], [5, 58]]]], "selected"], [], ["loc", [null, [5, 33], [5, 71]]]]]]], ["element", "action", ["toggleDay", "tuesday"], ["on", "touchStart"], ["loc", [null, [5, 73], [5, 121]]]], ["attribute", "class", ["concat", [["subexpr", "if", [["get", "selectedDays.wednesday", ["loc", [null, [6, 38], [6, 60]]]], "selected"], [], ["loc", [null, [6, 33], [6, 73]]]]]]], ["element", "action", ["toggleDay", "wednesday"], ["on", "touchStart"], ["loc", [null, [6, 75], [6, 125]]]], ["attribute", "class", ["concat", [["subexpr", "if", [["get", "selectedDays.thursday", ["loc", [null, [7, 38], [7, 59]]]], "selected"], [], ["loc", [null, [7, 33], [7, 72]]]]]]], ["element", "action", ["toggleDay", "thursday"], ["on", "touchStart"], ["loc", [null, [7, 74], [7, 123]]]], ["attribute", "class", ["concat", [["subexpr", "if", [["get", "selectedDays.friday", ["loc", [null, [8, 38], [8, 57]]]], "selected"], [], ["loc", [null, [8, 33], [8, 70]]]]]]], ["element", "action", ["toggleDay", "friday"], ["on", "touchStart"], ["loc", [null, [8, 72], [8, 119]]]], ["attribute", "class", ["concat", [["subexpr", "if", [["get", "selectedDays.saturday", ["loc", [null, [9, 38], [9, 59]]]], "selected"], [], ["loc", [null, [9, 33], [9, 72]]]]]]], ["element", "action", ["toggleDay", "saturday"], ["on", "touchStart"], ["loc", [null, [9, 74], [9, 123]]]], ["block", "touch-to", [], ["destination", "alarms", "tagName", "button"], 0, null, ["loc", [null, [12, 4], [12, 74]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("alarm-clock/templates/components/alarm-item", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@1.13.10",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 16,
            "column": 0
          }
        },
        "moduleName": "alarm-clock/templates/components/alarm-item.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("span");
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode(":");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("span");
        dom.setAttribute(el1, "class", "days");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("span");
        var el3 = dom.createTextNode("S");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("span");
        var el3 = dom.createTextNode("M");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("span");
        var el3 = dom.createTextNode("T");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("span");
        var el3 = dom.createTextNode("W");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("span");
        var el3 = dom.createTextNode("T");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("span");
        var el3 = dom.createTextNode("F");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("span");
        var el3 = dom.createTextNode("S");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("span");
        dom.setAttribute(el1, "class", "button-group");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        dom.setAttribute(el2, "class", "fa fa-pencil");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(fragment, [2]);
        var element2 = dom.childAt(element1, [1]);
        var element3 = dom.childAt(element1, [3]);
        var element4 = dom.childAt(element1, [5]);
        var element5 = dom.childAt(element1, [7]);
        var element6 = dom.childAt(element1, [9]);
        var element7 = dom.childAt(element1, [11]);
        var element8 = dom.childAt(element1, [13]);
        var element9 = dom.childAt(fragment, [4]);
        var element10 = dom.childAt(element9, [1]);
        var element11 = dom.childAt(element9, [3]);
        var element12 = dom.childAt(element9, [5]);
        var morphs = new Array(15);
        morphs[0] = dom.createMorphAt(element0, 0, 0);
        morphs[1] = dom.createMorphAt(element0, 2, 2);
        morphs[2] = dom.createMorphAt(element0, 3, 3);
        morphs[3] = dom.createAttrMorph(element2, 'class');
        morphs[4] = dom.createAttrMorph(element3, 'class');
        morphs[5] = dom.createAttrMorph(element4, 'class');
        morphs[6] = dom.createAttrMorph(element5, 'class');
        morphs[7] = dom.createAttrMorph(element6, 'class');
        morphs[8] = dom.createAttrMorph(element7, 'class');
        morphs[9] = dom.createAttrMorph(element8, 'class');
        morphs[10] = dom.createAttrMorph(element10, 'class');
        morphs[11] = dom.createElementMorph(element10);
        morphs[12] = dom.createElementMorph(element11);
        morphs[13] = dom.createAttrMorph(element12, 'class');
        morphs[14] = dom.createElementMorph(element12);
        return morphs;
      },
      statements: [["content", "displayHours", ["loc", [null, [1, 6], [1, 22]]]], ["content", "displayMinutes", ["loc", [null, [1, 23], [1, 41]]]], ["content", "ampm", ["loc", [null, [1, 41], [1, 49]]]], ["attribute", "class", ["concat", [["subexpr", "if", [["get", "alarm.selectedDays.sunday", ["loc", [null, [3, 22], [3, 47]]]], "selected"], [], ["loc", [null, [3, 17], [3, 60]]]]]]], ["attribute", "class", ["concat", [["subexpr", "if", [["get", "alarm.selectedDays.monday", ["loc", [null, [4, 22], [4, 47]]]], "selected"], [], ["loc", [null, [4, 17], [4, 60]]]]]]], ["attribute", "class", ["concat", [["subexpr", "if", [["get", "alarm.selectedDays.tuesday", ["loc", [null, [5, 22], [5, 48]]]], "selected"], [], ["loc", [null, [5, 17], [5, 61]]]]]]], ["attribute", "class", ["concat", [["subexpr", "if", [["get", "alarm.selectedDays.wednesday", ["loc", [null, [6, 22], [6, 50]]]], "selected"], [], ["loc", [null, [6, 17], [6, 63]]]]]]], ["attribute", "class", ["concat", [["subexpr", "if", [["get", "alarm.selectedDays.thursday", ["loc", [null, [7, 22], [7, 49]]]], "selected"], [], ["loc", [null, [7, 17], [7, 62]]]]]]], ["attribute", "class", ["concat", [["subexpr", "if", [["get", "alarm.selectedDays.friday", ["loc", [null, [8, 22], [8, 47]]]], "selected"], [], ["loc", [null, [8, 17], [8, 60]]]]]]], ["attribute", "class", ["concat", [["subexpr", "if", [["get", "alarm.selectedDays.saturday", ["loc", [null, [9, 22], [9, 49]]]], "selected"], [], ["loc", [null, [9, 17], [9, 62]]]]]]], ["attribute", "class", ["concat", ["fa fa-power-off ", ["subexpr", "if", [["get", "alarm.isEnabled", ["loc", [null, [12, 40], [12, 55]]]], "selected"], [], ["loc", [null, [12, 35], [12, 68]]]]]]], ["element", "action", ["toggleEnabled"], ["on", "touchStart"], ["loc", [null, [12, 70], [12, 112]]]], ["element", "action", ["edit"], ["on", "touchStart"], ["loc", [null, [13, 33], [13, 66]]]], ["attribute", "class", ["concat", ["fa fa-trash ", ["subexpr", "if", [["get", "isDeleting", ["loc", [null, [14, 36], [14, 46]]]], "selected"], [], ["loc", [null, [14, 31], [14, 59]]]]]]], ["element", "action", ["delete"], ["on", "touchStart"], ["loc", [null, [14, 61], [14, 96]]]]],
      locals: [],
      templates: []
    };
  })());
});
define("alarm-clock/templates/components/prepare-alarm", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@1.13.10",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 5,
              "column": 0
            }
          },
          "moduleName": "alarm-clock/templates/components/prepare-alarm.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          var el2 = dom.createTextNode("\n        Tap to Begin\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@1.13.10",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 6,
            "column": 0
          }
        },
        "moduleName": "alarm-clock/templates/components/prepare-alarm.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["block", "unless", [["get", "prepared", ["loc", [null, [1, 10], [1, 18]]]]], [], 0, null, ["loc", [null, [1, 0], [5, 11]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("alarm-clock/templates/components/the-clock", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@1.13.10",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 3,
              "column": 0
            }
          },
          "moduleName": "alarm-clock/templates/components/the-clock.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("span");
          dom.setAttribute(el1, "class", "next-alarm");
          var el2 = dom.createElement("i");
          dom.setAttribute(el2, "class", "fa fa-bell-o");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]), 1, 1);
          return morphs;
        },
        statements: [["content", "snooze", ["loc", [null, [2, 57], [2, 67]]]]],
        locals: [],
        templates: []
      };
    })();
    var child1 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "revision": "Ember@1.13.10",
            "loc": {
              "source": null,
              "start": {
                "line": 4,
                "column": 4
              },
              "end": {
                "line": 6,
                "column": 4
              }
            },
            "moduleName": "alarm-clock/templates/components/the-clock.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("        ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("span");
            dom.setAttribute(el1, "class", "next-alarm");
            var el2 = dom.createElement("i");
            dom.setAttribute(el2, "class", "fa fa-bell-o");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]), 1, 1);
            return morphs;
          },
          statements: [["content", "nextAlarm", ["loc", [null, [5, 61], [5, 74]]]]],
          locals: [],
          templates: []
        };
      })();
      return {
        meta: {
          "revision": "Ember@1.13.10",
          "loc": {
            "source": null,
            "start": {
              "line": 3,
              "column": 0
            },
            "end": {
              "line": 7,
              "column": 0
            }
          },
          "moduleName": "alarm-clock/templates/components/the-clock.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [["block", "if", [["get", "nextAlarm", ["loc", [null, [4, 10], [4, 19]]]]], [], 0, null, ["loc", [null, [4, 4], [6, 11]]]]],
        locals: [],
        templates: [child0]
      };
    })();
    return {
      meta: {
        "revision": "Ember@1.13.10",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 10,
            "column": 0
          }
        },
        "moduleName": "alarm-clock/templates/components/the-clock.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("h1");
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("h2");
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(3);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        morphs[1] = dom.createUnsafeMorphAt(dom.childAt(fragment, [1]), 0, 0);
        morphs[2] = dom.createMorphAt(dom.childAt(fragment, [3]), 0, 0);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [["block", "if", [["get", "snooze", ["loc", [null, [1, 6], [1, 12]]]]], [], 0, 1, ["loc", [null, [1, 0], [7, 7]]]], ["content", "time.time", ["loc", [null, [8, 4], [8, 19]]]], ["content", "time.date", ["loc", [null, [9, 4], [9, 17]]]]],
      locals: [],
      templates: [child0, child1]
    };
  })());
});
define("alarm-clock/templates/components/the-rings", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@1.13.10",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 267,
            "column": 0
          }
        },
        "moduleName": "alarm-clock/templates/components/the-rings.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        dom.setNamespace("http://www.w3.org/2000/svg");
        var el1 = dom.createElement("svg");
        dom.setAttribute(el1, "version", "1.1");
        dom.setAttribute(el1, "xmlns", "http://www.w3.org/2000/svg");
        dom.setAttribute(el1, "xmlns:xlink", "http://www.w3.org/1999/xlink");
        dom.setAttribute(el1, "x", "0px");
        dom.setAttribute(el1, "y", "0px");
        dom.setAttribute(el1, "viewBox", "0 0 381.7 381.7");
        dom.setAttribute(el1, "style", "enable-background:new 0 0 381.7 381.7;");
        dom.setAttributeNS(el1, "http://www.w3.org/XML/1998/namespace", "xml:space", "preserve");
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("path");
        dom.setAttribute(el2, "d", "M278.8,352.4c0,0-0.5,0.3-1.5,0.8c-1,0.5-2.4,1.2-4.2,2.1c-0.9,0.4-1.9,1-3,1.5c-1.1,0.5-2.3,1-3.6,1.6\n		c-1.3,0.6-2.6,1.2-4.1,1.8c-1.5,0.6-3,1.2-4.6,1.8c-6.4,2.6-14.1,5-22.5,7.2c-8.4,2.1-17.5,3.6-26.6,4.6\n		c-9.1,0.9-18.3,1-26.9,0.7c-8.6-0.5-16.6-1.4-23.4-2.7c-1.7-0.3-3.3-0.6-4.9-0.9c-1.5-0.3-3-0.7-4.4-1c-1.4-0.3-2.6-0.6-3.8-0.9\n		c-1.2-0.3-2.2-0.6-3.2-0.9c-3.9-1.1-6.1-1.7-6.1-1.7l2.1-6.6c0,0,1,0.3,2.9,0.8c0.9,0.3,2.1,0.6,3.4,1c0.7,0.2,1.4,0.4,2.2,0.6\n		c0.8,0.2,1.6,0.4,2.5,0.6c1.8,0.4,3.7,0.9,5.8,1.3c2.1,0.4,4.5,0.8,6.9,1.3c0.6,0.1,1.3,0.2,1.9,0.3c0.6,0.1,1.3,0.2,2,0.3\n		c1.3,0.2,2.7,0.3,4.1,0.5c2.8,0.4,5.8,0.6,8.8,0.8c12.3,0.8,26.8,0.6,42.1-2.1c1.9-0.3,3.8-0.7,5.8-1c1.9-0.4,3.9-0.9,5.8-1.3\n		c1-0.2,1.9-0.4,2.9-0.7c1-0.3,1.9-0.5,2.9-0.8c1.9-0.6,3.9-1.1,5.8-1.7c7.8-2.5,15.5-5.5,23-9c7.4-3.6,14.7-7.6,21.4-12.1\n		c6.7-4.5,13.2-9.3,18.9-14.5c11.7-10.1,21.1-21.2,28.2-31.3c7.1-10.1,12-19.3,15.1-25.8c1.5-3.3,2.7-5.9,3.4-7.7\n		c0.7-1.8,1.1-2.8,1.1-2.8l6.4,2.6c0,0,0.2-0.6,0.6-1.6c0.4-1,1-2.4,1.6-4.2c1.2-3.5,2.8-8.1,4.1-12.9c0.3-1.2,0.7-2.4,1-3.5\n		c0.3-1.2,0.6-2.3,0.8-3.5c0.5-2.2,1-4.3,1.4-6.1c0.7-3.6,1.1-6,1.1-6l-6.8-1.1c0,0,0.4-2.3,0.7-4.7c0.3-2.3,0.6-4.7,0.6-4.7\n		l6.9,0.8c0,0,0-0.3,0.1-0.8c0.1-0.5,0.2-1.3,0.2-2.2c0.1-1.8,0.3-4.3,0.5-6.7c0.2-2.4,0.2-4.9,0.3-6.7c0-1.8,0.1-3.1,0.1-3.1\n		l3.6,0c0,0,0,3.1-0.2,8.5c-0.2,2.7-0.4,6-0.8,9.8c-0.2,1.9-0.5,3.9-0.8,6c-0.1,1.1-0.3,2.1-0.4,3.3c-0.2,1.1-0.4,2.2-0.6,3.4\n		c-0.4,2.3-0.8,4.7-1.4,7.2c-0.6,2.5-1.1,5-1.8,7.6c-0.7,2.6-1.5,5.3-2.3,8c-0.8,2.7-1.8,5.4-2.7,8.2c-4,11.1-9.3,22.5-15.7,33.2\n		c-6.4,10.7-13.9,20.8-21.8,29.4c-7.8,8.7-16,16-23.4,21.8c-3.6,2.9-7.2,5.4-10.3,7.6c-3.2,2.1-6,3.9-8.3,5.3\n		c-4.7,2.7-7.5,4.3-7.5,4.3L278.8,352.4z M381.7,189.6l-7.1,0c0,0-0.1-2.2-0.1-5.5c0-0.8-0.1-1.7-0.1-2.7c-0.1-0.9-0.1-1.9-0.2-3\n		c-0.2-2.1-0.3-4.2-0.5-6.4c-0.3-2.2-0.5-4.4-0.8-6.4c-0.1-1-0.3-2-0.4-2.9c-0.2-0.9-0.3-1.8-0.5-2.6c-0.6-3.3-1-5.4-1-5.4\n		l-6.6,1.3c0,0-0.1-0.4-0.2-1.2c-0.2-0.8-0.5-2-0.8-3.5c-0.4-1.5-0.7-3.4-1.3-5.4c-0.6-2.1-1.3-4.4-2-7c-0.8-2.5-1.7-5.3-2.7-8.1\n		c-1-2.9-2.3-5.8-3.5-8.9c-2.7-6.1-5.7-12.5-9.3-18.6c-0.9-1.5-1.8-3.1-2.7-4.6c-0.9-1.5-1.9-3-2.8-4.4c-0.5-0.7-0.9-1.5-1.4-2.2\n		c-0.5-0.7-1-1.4-1.5-2.1c-1-1.4-2-2.8-2.9-4.1c-2-2.7-4-5.2-5.9-7.5c-2-2.3-3.9-4.5-5.6-6.5c-1.8-1.9-3.5-3.7-5-5.2\n		c-1.5-1.6-2.9-2.8-4-3.9c-1.1-1.1-2-1.9-2.6-2.5c-0.6-0.6-0.9-0.9-0.9-0.9l4.5-5c0,0-2.3-2-5.8-5c-1.8-1.4-3.9-3.1-6.1-4.9\n		c-2.3-1.8-4.8-3.5-7.3-5.3c-2.5-1.7-5.1-3.3-7.5-4.9c-2.4-1.5-4.8-2.8-6.8-4c-2-1.2-3.7-2-4.9-2.6c-1.2-0.6-1.9-1-1.9-1l-3,6\n		c0,0-0.5-0.3-1.4-0.7c-0.9-0.5-2.2-1.1-3.9-1.8c-1.6-0.7-3.5-1.6-5.5-2.5c-2.1-0.8-4.3-1.7-6.5-2.6c-2.2-0.9-4.5-1.6-6.6-2.3\n		c-1.1-0.4-2.1-0.7-3-1c-1-0.3-1.9-0.6-2.7-0.8c-3.4-1-5.7-1.6-5.7-1.6l1.7-6.7c0,0-1.8-0.4-4.5-1.1c-1.3-0.3-2.9-0.7-4.6-1\n		c-1.7-0.3-3.5-0.6-5.3-1c-3.6-0.7-7.3-1.1-10-1.5c-2.7-0.4-4.6-0.5-4.6-0.5l-0.6,6.9c0,0-1.8-0.1-4.8-0.4\n		c-0.8-0.1-1.6-0.1-2.6-0.2c-0.9,0-1.9-0.1-3-0.1c-2.1,0-4.6-0.2-7.2-0.1c-2.6,0.1-5.5,0.1-8.5,0.3c-3,0.2-6.2,0.4-9.5,0.8\n		c-6.6,0.8-13.6,1.8-20.5,3.5c-1.7,0.4-3.5,0.8-5.2,1.2c-1.7,0.5-3.4,1-5.1,1.4c-0.8,0.2-1.7,0.5-2.5,0.7\n		c-0.8,0.3-1.6,0.5-2.4,0.8c-1.6,0.5-3.2,1.1-4.8,1.6c-3.1,1.1-6.1,2.3-8.9,3.5c-2.8,1.2-5.4,2.4-7.8,3.5c-4.8,2.4-8.7,4.4-11.3,6\n		c-1.3,0.8-2.4,1.4-3.1,1.8c-0.7,0.4-1.1,0.6-1.1,0.6l-3.6-5.9c0,0-2.1,1.3-5.2,3.3c-1.6,1-3.3,2.2-5.2,3.5\n		c-1.9,1.3-3.9,2.7-5.8,4.3c-7.8,5.9-14.9,12.7-14.9,12.7L61.8,55c0,0-1.3,1.3-3.4,3.2c-1.9,2-4.6,4.7-7.1,7.5\n		c-2.4,2.8-4.9,5.6-6.6,7.9c-1.7,2.2-2.9,3.7-2.9,3.7l8.3,6.3c0,0-0.2,0.2-0.6,0.7c-0.4,0.5-0.9,1.2-1.6,2.2\n		c-1.3,1.9-3.4,4.7-5.8,8.4c-4.8,7.3-11,18.3-16.5,32.4c-0.3,0.9-0.7,1.8-1,2.7c-0.3,0.9-0.6,1.8-0.9,2.8\n		c-0.6,1.9-1.3,3.8-1.9,5.7c-1.1,3.9-2.4,7.9-3.3,12.1c-1,4.2-1.8,8.6-2.6,13c-0.6,4.5-1.3,9.1-1.6,13.7\n		c-1.5,18.7,0.1,38.9,5.2,58.3c5.1,19.5,13.6,37.9,24.1,53.5c5.2,7.8,10.9,14.9,16.7,21.3c5.8,6.3,11.8,11.9,17.6,16.7\n		c11.6,9.6,22.4,16,30.2,20.2c2,1,3.7,1.9,5.2,2.7c1.5,0.8,2.9,1.3,3.9,1.8c2.1,1,3.3,1.5,3.3,1.5l-4.1,9.5c0,0,1.4,0.7,4,1.7\n		c2.5,1,6.2,2.5,10.6,3.9c8.9,3,21,6.2,33.4,7.9c12.4,1.8,24.8,2.2,34.2,1.7c2.3,0,4.5-0.3,6.4-0.4c1.9-0.2,3.5-0.3,4.9-0.4\n		c2.7-0.3,4.3-0.5,4.3-0.5l0.4,3.4c0,0-0.4,0.1-1.2,0.2c-0.8,0.1-2,0.3-3.5,0.4c-1.5,0.1-3.4,0.3-5.5,0.4\n		c-1.1,0.1-2.2,0.2-3.4,0.2c-1.2,0.1-2.4,0.1-3.7,0.1c-5.2,0.2-11.3,0.1-17.8-0.2c-6.5-0.4-13.5-1.1-20.4-2.3\n		c-3.5-0.6-6.9-1.2-10.3-2c-1.7-0.4-3.3-0.8-5-1.2c-1.6-0.4-3.2-0.9-4.8-1.3c-1.6-0.5-3.1-0.9-4.7-1.3c-1.5-0.5-3-1-4.4-1.5\n		c-1.4-0.5-2.8-1-4.2-1.4c-1.3-0.5-2.6-1-3.8-1.5c-2.4-1-4.7-1.8-6.6-2.7c-1.9-0.9-3.6-1.6-5-2.3c-1.4-0.6-2.5-1.1-3.2-1.5\n		c-0.7-0.4-1.1-0.6-1.1-0.6l3.1-6.2c0,0-0.8-0.4-2.3-1.2c-1.4-0.7-3.5-1.8-5.9-3.2c-2.4-1.4-5.2-2.9-8.1-4.8\n		c-1.4-0.9-2.9-1.9-4.5-2.9c-1.5-1-3-2.1-4.5-3.2c-3-2.1-5.9-4.4-8.6-6.5c-2.7-2.1-5.1-4.3-7.2-6.1c-2.1-1.8-3.7-3.5-4.9-4.6\n		c-1.2-1.1-1.8-1.7-1.8-1.7l-4.9,4.9c0,0-0.2-0.2-0.5-0.5c-0.3-0.3-0.8-0.9-1.5-1.5c-1.3-1.4-3.2-3.3-5.5-5.9\n		c-4.6-5.2-11-12.8-17.6-22.8c-6.6-9.9-13.2-22.3-18.6-36.2c-0.3-0.9-0.7-1.7-1-2.6c-0.3-0.9-0.6-1.8-0.9-2.7\n		c-0.6-1.8-1.2-3.6-1.8-5.4c-0.6-1.8-1.1-3.7-1.6-5.6c-0.5-1.9-1.1-3.7-1.5-5.7c-0.9-3.8-1.9-7.7-2.5-11.6c-0.3-2-0.7-3.9-1-5.9\n		l-0.8-5.9c-0.6-3.9-0.8-7.9-1.1-11.8c-0.2-2-0.2-3.9-0.2-5.9c0-2-0.1-3.9-0.1-5.9c0.1-7.8,0.5-15.5,1.4-22.9\n		c1.8-14.8,5.3-28.4,9.2-39.7c4-11.3,8.3-20.3,11.5-26.4c0.8-1.6,1.6-2.9,2.2-4.1c0.7-1.2,1.2-2.2,1.7-3c0.9-1.6,1.4-2.5,1.4-2.5\n		l5.9,3.6c0,0,0.3-0.5,0.8-1.3c0.5-0.8,1.2-1.8,1.8-2.8c0.7-1,1.3-2.1,1.8-2.8c0.5-0.8,0.9-1.3,0.9-1.3l-5.7-3.9\n		c0,0,0.5-0.8,1.6-2.2c0.5-0.7,1.2-1.6,1.9-2.7c0.7-1.1,1.6-2.3,2.7-3.6c4-5.3,10.1-12.6,18.3-20.7c8.2-8,18.5-16.5,30.5-24.3\n		c6-3.9,12.5-7.5,19.2-10.8c1.7-0.8,3.4-1.6,5.1-2.4c1.7-0.8,3.4-1.6,5.2-2.3c3.5-1.4,7.1-2.9,10.7-4.1c14.5-5,29.5-8.2,43.8-9.6\n		c14.2-1.4,27.5-1,38.9,0.2c11.4,1.2,20.7,3.3,27.2,4.9c3.2,0.9,5.8,1.6,7.5,2.1c1.7,0.5,2.6,0.8,2.6,0.8l-3.1,9.9\n		c0,0,1.1,0.4,2.9,1c1.7,0.6,4,1.3,6.3,2.2c2.2,0.9,4.5,1.8,6.2,2.4c0.8,0.3,1.5,0.7,2,0.9c0.5,0.2,0.8,0.3,0.8,0.3l4.2-9.5\n		c0,0,0.8,0.4,2.3,1c1.5,0.7,3.6,1.6,6.3,3c2.7,1.4,6,3,9.6,5.1c3.7,2,7.6,4.6,11.9,7.4c8.5,5.8,18,13.2,27.2,22.2\n		c2.3,2.2,4.5,4.6,6.8,7c2.2,2.4,4.4,5,6.6,7.6c2.1,2.6,4.2,5.3,6.3,8c1,1.4,2,2.8,3,4.2c1,1.4,2,2.8,2.9,4.3\n		c7.6,11.5,13.8,23.8,18.5,35.8c4.7,12,7.8,23.7,9.7,33.9c2,10.1,2.6,18.7,3,24.7c0.2,3,0.2,5.3,0.2,6.9\n		C381.7,188.8,381.7,189.6,381.7,189.6z");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("svg");
        dom.setAttribute(el1, "version", "1.1");
        dom.setAttribute(el1, "xmlns", "http://www.w3.org/2000/svg");
        dom.setAttribute(el1, "xmlns:xlink", "http://www.w3.org/1999/xlink");
        dom.setAttribute(el1, "x", "0px");
        dom.setAttribute(el1, "y", "0px");
        dom.setAttribute(el1, "viewBox", "0 0 381.7 381.7");
        dom.setAttribute(el1, "style", "enable-background:new 0 0 381.7 381.7;");
        dom.setAttributeNS(el1, "http://www.w3.org/XML/1998/namespace", "xml:space", "preserve");
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("path");
        dom.setAttribute(el2, "class", "st0");
        dom.setAttribute(el2, "d", "M202.2,350c0,0,0.9-0.1,2.7-0.2c1.7-0.1,4.3-0.4,7.5-0.8c6.4-0.9,15.7-2.5,26.4-5.8\n		c10.7-3.3,22.8-8.5,34.7-15.7c1.5-0.9,3-1.9,4.5-2.8c0.7-0.5,1.5-1,2.2-1.4c0.7-0.5,1.5-1,2.2-1.6c1.5-1,2.9-2.1,4.4-3.2\n		c1.4-1.1,2.9-2.2,4.3-3.4c5.7-4.6,11.2-9.6,16.3-15.1c5.1-5.4,9.8-11.2,14-17.2c2.2-2.9,4.1-6.1,6-9.1c0.9-1.6,1.8-3.1,2.7-4.6\n		c0.4-0.8,0.9-1.5,1.3-2.3c0.4-0.8,0.8-1.6,1.2-2.3c0.8-1.6,1.6-3.1,2.3-4.6c0.7-1.6,1.4-3.1,2.1-4.6c0.3-0.8,0.7-1.5,1-2.3\n		c0.3-0.8,0.6-1.5,0.9-2.3c0.6-1.5,1.2-3,1.8-4.5c0.5-1.5,1-3,1.5-4.5c0.5-1.5,1-2.9,1.4-4.4c0.4-1.5,0.8-2.9,1.2-4.3\n		c0.2-0.7,0.4-1.4,0.6-2.1c0.2-0.7,0.3-1.4,0.5-2.1c1.3-5.4,2.2-10.5,2.9-15c0.3-2.3,0.6-4.4,0.8-6.3c0.2-2,0.3-3.8,0.4-5.4\n		c0.3-3.2,0.3-5.8,0.3-7.5c0-1.7,0.1-2.7,0.1-2.7l6.9,0c0,0,0,1-0.1,2.8c-0.1,1.8-0.1,4.5-0.4,7.9c-0.1,1.7-0.3,3.6-0.5,5.6\n		c-0.3,2-0.5,4.2-0.8,6.6c-0.7,4.7-1.6,10-3,15.6c-0.2,0.7-0.3,1.4-0.5,2.2c-0.2,0.7-0.4,1.4-0.6,2.2c-0.4,1.5-0.8,2.9-1.3,4.5\n		c-0.4,1.5-1,3-1.5,4.6c-0.5,1.5-1,3.1-1.6,4.7c-0.6,1.6-1.2,3.1-1.9,4.7c-0.3,0.8-0.6,1.6-1,2.4c-0.4,0.8-0.7,1.6-1.1,2.4\n		c-0.7,1.6-1.5,3.2-2.2,4.8c-0.8,1.6-1.6,3.2-2.4,4.8c-0.4,0.8-0.8,1.6-1.3,2.4c-0.4,0.8-0.9,1.6-1.4,2.4\n		c-0.9,1.6-1.9,3.2-2.8,4.8c-2,3.1-4,6.4-6.3,9.5c-4.4,6.3-9.3,12.3-14.6,18c-5.3,5.7-11,10.9-17,15.8c-1.5,1.2-3,2.4-4.5,3.5\n		c-1.5,1.1-3.1,2.2-4.6,3.3c-0.8,0.5-1.5,1.1-2.3,1.6c-0.8,0.5-1.6,1-2.3,1.5c-1.6,1-3.1,2-4.6,3c-12.5,7.5-25.1,12.9-36.2,16.4\n		c-11.1,3.5-20.8,5.2-27.5,6.1c-3.4,0.4-6,0.8-7.8,0.9c-1.8,0.1-2.8,0.2-2.8,0.2L202.2,350z M242.6,338.2c0,0-1.7,0.6-4.8,1.6\n		c-1.5,0.5-3.4,1-5.5,1.6c-2.1,0.6-4.6,1.2-7.2,1.8c-5.3,1.3-11.6,2.2-18.4,3c-1.7,0.1-3.4,0.3-5.2,0.4c-0.9,0.1-1.8,0.1-2.6,0.2\n		c-0.9,0-1.8,0-2.7,0.1c-1.8,0-3.6,0.1-5.4,0.1c-1.8,0-3.6-0.1-5.4-0.1c-14.6-0.4-29-3.3-39.4-6.5c-5.2-1.6-9.5-3.1-12.5-4.3\n		c-1.5-0.6-2.6-1.1-3.4-1.4c-0.8-0.3-1.2-0.5-1.2-0.5l1.4-3.2c0,0,0.4,0.2,1.2,0.5c0.8,0.3,1.9,0.8,3.4,1.3\n		c2.9,1.2,7.1,2.7,12.2,4.2c10.2,3.1,24.3,6,38.6,6.3c1.8,0,3.6,0.1,5.3,0.1c1.8,0,3.5-0.1,5.3-0.1c0.9,0,1.7,0,2.6-0.1\n		c0.9-0.1,1.7-0.1,2.6-0.2c1.7-0.1,3.4-0.3,5.1-0.4c6.6-0.8,12.8-1.7,18-3c2.6-0.6,5-1.1,7.1-1.8c2.1-0.6,3.9-1.1,5.4-1.6\n		c3-1,4.6-1.6,4.6-1.6L242.6,338.2z M52.5,270.5c0,0,0.3,0.5,0.8,1.4c0.3,0.5,0.6,1,1,1.7c0.4,0.6,0.9,1.4,1.4,2.2\n		c2.1,3.3,5.2,8.1,9.4,13.4c8.2,10.7,21.2,23.7,36.2,33.8c15,10.2,31.8,17.5,44.9,21.1c1.6,0.5,3.2,0.9,4.7,1.3\n		c1.5,0.4,2.9,0.7,4.3,1c1.3,0.3,2.6,0.6,3.8,0.8c1.2,0.2,2.3,0.4,3.2,0.6c2,0.3,3.5,0.6,4.5,0.8c1.1,0.1,1.6,0.2,1.6,0.2\n		l-0.5,3.4c0,0-0.6-0.1-1.6-0.2c-1.1-0.2-2.6-0.5-4.6-0.8c-1-0.2-2.1-0.4-3.3-0.6c-1.2-0.2-2.5-0.6-3.9-0.9\n		c-1.4-0.3-2.8-0.7-4.4-1c-1.5-0.4-3.1-0.9-4.8-1.4c-13.4-3.7-30.6-11.1-45.9-21.5c-15.3-10.4-28.5-23.6-36.9-34.5\n		c-4.3-5.4-7.5-10.3-9.6-13.7c-0.5-0.9-1-1.6-1.4-2.3c-0.4-0.7-0.7-1.3-1-1.7c-0.5-0.9-0.8-1.4-0.8-1.4L52.5,270.5z M41.6,256.7\n		c0,0-0.3-0.7-1-2.1c-0.6-1.4-1.4-3.5-2.5-6.2c-0.5-1.3-1-2.8-1.6-4.5c-0.5-1.6-1.2-3.4-1.7-5.3c-0.5-1.9-1.1-4-1.7-6.1\n		c-0.6-2.2-1.1-4.5-1.6-6.8c-2.1-9.6-3.6-20.9-3.7-33.1c-0.1-1.5,0-3.1,0-4.6c0-1.5,0.1-3.1,0.1-4.7c0.2-3.1,0.4-6.3,0.7-9.5\n		c0.7-6.4,1.7-12.8,3.2-19.2c2.9-12.7,7.3-25.1,12.8-36.1c5.4-11,11.8-20.5,17.8-28.2c6-7.7,11.7-13.6,15.9-17.5\n		c1-1,2-1.9,2.8-2.6c0.8-0.7,1.5-1.3,2.1-1.9c1.2-1,1.8-1.5,1.8-1.5l4.5,5.3c0,0-0.5,0.4-1.5,1.3c-1,0.8-2.4,2.1-4.1,3.7\n		C83,77.9,82,78.8,81,79.8c-1,1-2.1,2.1-3.2,3.3c-2.3,2.4-4.8,5.2-7.4,8.3c-5.2,6.3-10.8,14.1-15.8,23.1c-5,8.9-9.5,19-12.7,29.4\n		c-3.3,10.4-5.4,21.2-6.4,31.4c-1,10.2-0.9,19.8-0.2,27.9c0.1,1,0.2,2,0.2,3c0.1,1,0.2,1.9,0.3,2.9c0.2,1.9,0.5,3.6,0.7,5.3\n		c0.6,3.3,1.1,6.1,1.5,8.5c0.5,2.3,1,4.2,1.2,5.4c0.1,0.6,0.3,1.1,0.3,1.4c0.1,0.3,0.1,0.5,0.1,0.5l3.4-0.9c0,0,0.4,1.3,1,3.7\n		c0.4,1.2,0.7,2.6,1.3,4.2c0.5,1.6,1.2,3.4,1.8,5.4c2.9,7.9,7.4,18.2,13.3,27.7c5.8,9.6,12.9,18.3,18.6,24.4\n		c1.5,1.5,2.8,2.9,4,4.1c1.2,1.2,2.3,2.2,3.2,3c1.8,1.7,2.8,2.6,2.8,2.6l-2.3,2.6c0,0-0.2-0.2-0.6-0.5c-0.4-0.3-0.9-0.8-1.6-1.4\n		c-0.7-0.6-1.5-1.4-2.4-2.3c-0.9-0.9-2-1.8-3-3c-4.4-4.4-9.9-10.7-14.8-17.4c-1.2-1.7-2.4-3.4-3.6-5.1c-1.1-1.7-2.2-3.4-3.2-5.1\n		c-1-1.6-1.9-3.3-2.8-4.9c-0.4-0.8-0.9-1.5-1.3-2.3c-0.4-0.7-0.8-1.5-1.1-2.2c-1.4-2.8-2.6-5.1-3.3-6.8c-0.8-1.7-1.2-2.6-1.2-2.6\n		L41.6,256.7z M91.7,61.3c0,0,0.2-0.2,0.6-0.5c0.4-0.3,0.9-0.7,1.6-1.2c1.3-0.9,3.1-2.2,4.9-3.5c1.8-1.3,3.6-2.4,5-3.3\n		c1.4-0.9,2.3-1.5,2.3-1.5l5.4,8.9c0,0-0.9,0.5-2.1,1.4c-1.3,0.8-3,1.9-4.7,3.1c-1.7,1.2-3.3,2.4-4.6,3.2\n		c-0.6,0.4-1.1,0.8-1.5,1.1c-0.4,0.3-0.6,0.4-0.6,0.4L91.7,61.3z M350.3,189.8l-3.3,0c0,0-0.1-2.2-0.1-5.9\n		c-0.2-3.8-0.5-9.1-1.5-15.6c-1-6.4-2.4-13.9-4.7-21.6c-2.3-7.8-5.3-15.9-9.1-23.7c-7.5-15.6-17.8-29.6-26.8-39\n		c-1.1-1.2-2.2-2.3-3.2-3.4c-1-1-2.1-2-3-2.9c-1-0.9-1.8-1.8-2.7-2.5c-0.9-0.7-1.6-1.4-2.4-2.1c-1.4-1.2-2.6-2.2-3.3-2.9\n		c-0.8-0.6-1.2-1-1.2-1l-2.2,2.7c0,0-0.5-0.4-1.6-1.2c-1-0.8-2.5-2.1-4.5-3.4c-2-1.4-4.4-3.2-7.3-5c-1.4-0.9-2.9-1.9-4.6-2.9\n		c-1.7-1-3.4-2-5.2-3c-7.4-4-16.4-8-26.4-11.2c-2.5-0.8-5.1-1.5-7.7-2.2c-2.6-0.7-5.3-1.2-8-1.9c-2.7-0.5-5.4-1-8.2-1.4\n		c-1.4-0.2-2.8-0.4-4.2-0.5c-1.4-0.2-2.8-0.4-4.2-0.5c-11.1-1-22.4-0.8-32.8,0.5c-10.4,1.3-20,3.6-28,6.1c-2,0.7-3.9,1.3-5.7,1.9\n		c-1.8,0.7-3.5,1.4-5.1,2c-0.8,0.3-1.6,0.6-2.3,0.9c-0.7,0.3-1.4,0.6-2.1,0.9c-1.3,0.6-2.6,1.2-3.7,1.7c-2.2,1-3.9,2-5.1,2.6\n		c-1.2,0.6-1.8,0.9-1.8,0.9l-3.3-6.1c0,0,0.7-0.4,2-1c1.2-0.6,3-1.6,5.2-2.6c2.2-1,4.7-2.2,7.5-3.3c2.8-1.1,5.7-2.3,8.8-3.3\n		c1.5-0.5,3-1,4.5-1.5c1.5-0.5,3-0.9,4.4-1.3c1.4-0.4,2.8-0.8,4.2-1.1c1.3-0.3,2.6-0.6,3.8-0.9c1.2-0.3,2.2-0.5,3.2-0.7\n		c1-0.2,1.8-0.3,2.5-0.5c1.4-0.2,2.2-0.4,2.2-0.4l-0.6-3.4c0,0,0.4-0.1,1.3-0.2c0.8-0.1,2-0.4,3.5-0.6c1.5-0.2,3.4-0.4,5.5-0.7\n		c2.1-0.3,4.6-0.4,7.2-0.6c5.3-0.4,11.4-0.4,18-0.2c1.7,0,3.3,0.2,5,0.3c1.7,0.1,3.4,0.2,5.1,0.4c3.4,0.4,7,0.8,10.4,1.5\n		c1.7,0.3,3.5,0.6,5.2,1c1.7,0.4,3.4,0.8,5.1,1.2c0.8,0.2,1.7,0.4,2.5,0.6c0.8,0.2,1.7,0.5,2.5,0.7c1.6,0.5,3.3,0.9,4.9,1.4\n		c1.6,0.5,3.1,1,4.6,1.5c1.5,0.5,3,1,4.4,1.6c1.4,0.6,2.8,1.1,4.1,1.6c0.7,0.3,1.3,0.5,2,0.8c0.6,0.3,1.2,0.6,1.9,0.8\n		c2.4,1.1,4.7,2.1,6.6,3c1.9,1,3.6,1.8,5,2.5c1.4,0.7,2.4,1.3,3.1,1.7c0.7,0.4,1.1,0.6,1.1,0.6l-1.7,3c0,0,1.4,0.8,3.5,2\n		c2,1.3,4.7,3,7.4,4.8c2.6,1.9,5.2,3.6,7.1,5.2c1.9,1.5,3.1,2.5,3.1,2.5l-0.1,0.1c0,0,0.4,0.3,1.2,1c0.8,0.7,1.9,1.7,3.4,2.9\n		c0.7,0.6,1.5,1.3,2.4,2.1c0.8,0.8,1.8,1.7,2.7,2.6c1,0.9,2,1.9,3.1,3c1,1.1,2.1,2.2,3.3,3.4c9.1,9.5,19.7,23.9,27.4,39.8\n		c3.8,8,6.9,16.3,9.3,24.2c2.4,7.9,3.8,15.5,4.8,22.1c0.9,6.6,1.3,12.1,1.5,15.9C350.3,187.6,350.3,189.8,350.3,189.8z");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("svg");
        dom.setAttribute(el1, "version", "1.1");
        dom.setAttribute(el1, "xmlns", "http://www.w3.org/2000/svg");
        dom.setAttribute(el1, "xmlns:xlink", "http://www.w3.org/1999/xlink");
        dom.setAttribute(el1, "x", "0px");
        dom.setAttribute(el1, "y", "0px");
        dom.setAttribute(el1, "viewBox", "0 0 381.7 381.7");
        dom.setAttribute(el1, "style", "enable-background:new 0 0 381.7 381.7;");
        dom.setAttributeNS(el1, "http://www.w3.org/XML/1998/namespace", "xml:space", "preserve");
        var el2 = dom.createTextNode("\n	 ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("path");
        dom.setAttribute(el2, "d", "M333.1,191.7c0,0,0,1.4-0.1,4c0,0.7,0,1.4-0.1,2.2c0,0.8-0.1,1.7-0.2,2.6c-0.1,0.9-0.1,2-0.2,3c0,0.5-0.1,1.1-0.1,1.7\n		c-0.1,0.6-0.1,1.2-0.2,1.8c-1.1,9.7-3.7,23.5-10.2,39c-6.5,15.4-16.9,32.3-32,46.8c-7.5,7.3-16,14-25.4,19.7\n		c-9.4,5.7-19.6,10.3-30.2,13.8c-10.6,3.5-21.6,5.5-32.6,6.4c-10.9,0.8-21.8,0.4-32.1-1.1c-10.3-1.5-20.2-4.2-29.1-7.6\n		c-9-3.4-17.1-7.5-24.2-11.9c-7.1-4.3-13.2-9-18.4-13.5c-1.3-1.1-2.6-2.2-3.7-3.3c-1.1-1.1-2.3-2.1-3.3-3.2\n		c-2.1-2.1-3.9-4.1-5.6-5.8c-1.6-1.8-3-3.5-4.3-4.9c-1.2-1.5-2.2-2.7-3-3.8c-0.8-1-1.4-1.8-1.8-2.4c-0.4-0.5-0.6-0.8-0.6-0.8\n		l5.6-4.1c0,0,0.2,0.3,0.6,0.8c0.4,0.5,1,1.3,1.7,2.3c0.8,1,1.7,2.2,2.8,3.6c1.2,1.4,2.5,2.9,4.1,4.7c1.6,1.7,3.3,3.6,5.3,5.5\n		c1,1,2.1,2,3.2,3c1.1,1.1,2.3,2,3.5,3.1c4.9,4.2,10.7,8.7,17.5,12.8c6.8,4.2,14.5,8.1,23,11.3c8.5,3.2,17.8,5.8,27.7,7.2\n		c19.6,2.9,41.3,1.6,61.5-5c10.1-3.3,19.8-7.7,28.7-13.1c8.9-5.5,17-11.8,24.2-18.7c14.3-13.8,24.3-29.9,30.5-44.6\n		c6.1-14.7,8.6-27.9,9.7-37.1c0.1-0.6,0.1-1.1,0.2-1.7c0-0.5,0.1-1.1,0.1-1.6c0.1-1,0.2-2,0.2-2.9c0.1-0.9,0.1-1.7,0.2-2.5\n		c0-0.8,0-1.5,0.1-2.1c0.1-2.5,0.1-3.8,0.1-3.8L333.1,191.7z M326.2,190l-6.6,0c0,0,0-1.8-0.1-5.1c-0.1-1.7-0.3-3.7-0.4-6.2\n		c-0.1-1.2-0.3-2.5-0.4-3.9c-0.2-1.4-0.3-2.9-0.6-4.4c-1-6.2-2.7-13.6-5.5-21.8c-2.9-8.2-6.9-17.3-12.6-26.3\n		c-0.7-1.1-1.5-2.3-2.2-3.4c-0.8-1.1-1.6-2.2-2.4-3.4c-0.4-0.6-0.8-1.1-1.2-1.7c-0.4-0.6-0.9-1.1-1.3-1.7\n		c-0.9-1.1-1.8-2.2-2.7-3.4c-3.7-4.4-7.8-8.8-12.3-13c-4.6-4.1-9.5-8.1-14.8-11.7c-5.4-3.6-11.1-6.9-17.1-9.8\n		c-6-2.9-12.5-5.3-19.1-7.2c-3.3-1-6.7-1.7-10.1-2.5c-1.7-0.3-3.4-0.6-5.2-0.9c-1.7-0.3-3.5-0.5-5.2-0.7c-7-0.8-14.1-1.2-21.2-0.8\n		c-7.1,0.3-14.2,1.2-21.2,2.7c-14,3-27.4,8.4-39.5,15.6c-6,3.7-11.7,7.8-16.9,12.2c-1.3,1.1-2.6,2.2-3.9,3.4\n		c-1.2,1.2-2.5,2.4-3.7,3.5c-2.4,2.5-4.7,4.9-6.9,7.5c-8.8,10.2-15.5,21.4-20.4,32.6c-0.7,1.4-1.1,2.8-1.7,4.2\n		c-0.6,1.4-1.1,2.8-1.6,4.2c-0.5,1.4-1,2.8-1.4,4.2c-0.4,1.4-0.8,2.8-1.2,4.2c-0.2,0.7-0.4,1.4-0.6,2.1c-0.2,0.7-0.3,1.4-0.5,2.1\n		c-0.3,1.4-0.6,2.8-0.9,4.1c-0.2,1.4-0.5,2.7-0.7,4.1c-0.1,0.7-0.2,1.3-0.4,2c-0.1,0.7-0.2,1.3-0.3,2c-1.5,10.6-1.5,20.5-0.7,29.2\n		c0.8,8.7,2.3,16.1,3.9,22.2c0.4,1.5,0.8,2.9,1.2,4.3c0.4,1.3,0.9,2.6,1.2,3.7c0.4,1.1,0.7,2.2,1.1,3.2c0.4,1,0.7,1.8,1,2.6\n		c0.6,1.6,1.1,2.8,1.4,3.5c0.4,0.8,0.5,1.2,0.5,1.2l-6,2.7c0,0-0.2-0.4-0.6-1.3c-0.4-0.8-0.9-2.1-1.5-3.7\n		c-0.3-0.8-0.7-1.7-1.1-2.7c-0.4-1-0.7-2.1-1.2-3.3c-0.4-1.2-0.9-2.5-1.3-3.9c-0.4-1.4-0.8-2.9-1.3-4.5\n		c-1.7-6.3-3.3-14.2-4.1-23.3c-0.8-9.1-0.8-19.5,0.8-30.7c0.1-0.7,0.2-1.4,0.3-2.1c0.1-0.7,0.3-1.4,0.4-2.1\n		c0.3-1.4,0.5-2.8,0.8-4.3c0.3-1.4,0.7-2.9,1-4.3c0.2-0.7,0.3-1.5,0.5-2.2c0.2-0.7,0.4-1.5,0.6-2.2c0.4-1.5,0.8-2.9,1.3-4.4\n		c0.5-1.5,1-2.9,1.5-4.4c0.5-1.5,1.1-3,1.7-4.4c0.6-1.5,1.1-3,1.8-4.5c5.1-11.8,12.3-23.6,21.4-34.3c2.3-2.7,4.7-5.3,7.2-7.8\n		c1.3-1.2,2.6-2.5,3.9-3.7c1.3-1.2,2.7-2.4,4.1-3.6c5.5-4.7,11.5-9,17.8-12.8c12.7-7.6,26.8-13.3,41.5-16.4\n		c7.4-1.5,14.8-2.5,22.3-2.8c7.5-0.4,14.9,0,22.3,0.8c1.8,0.3,3.7,0.4,5.5,0.8c1.8,0.3,3.6,0.6,5.4,1c3.6,0.8,7.1,1.6,10.6,2.6\n		c6.9,2,13.7,4.5,20,7.6c6.4,3,12.4,6.5,18,10.3c5.6,3.8,10.8,8,15.6,12.3c4.7,4.4,9,9,13,13.6c0.9,1.2,1.9,2.4,2.8,3.5\n		c0.5,0.6,0.9,1.2,1.4,1.8c0.4,0.6,0.9,1.2,1.3,1.8c0.8,1.2,1.7,2.4,2.5,3.6c0.8,1.2,1.5,2.4,2.3,3.6c6.1,9.5,10.3,19,13.3,27.6\n		c3,8.7,4.8,16.5,5.8,23c0.3,1.6,0.4,3.2,0.6,4.6c0.2,1.5,0.4,2.8,0.5,4.1c0.2,2.5,0.4,4.7,0.5,6.5\n		C326.1,188.1,326.2,190,326.2,190z");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("svg");
        dom.setAttribute(el1, "version", "1.1");
        dom.setAttribute(el1, "xmlns", "http://www.w3.org/2000/svg");
        dom.setAttribute(el1, "xmlns:xlink", "http://www.w3.org/1999/xlink");
        dom.setAttribute(el1, "x", "0px");
        dom.setAttribute(el1, "y", "0px");
        dom.setAttribute(el1, "viewBox", "0 0 381.7 381.7");
        dom.setAttribute(el1, "style", "enable-background:new 0 0 381.7 381.7;");
        dom.setAttributeNS(el1, "http://www.w3.org/XML/1998/namespace", "xml:space", "preserve");
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("path");
        dom.setAttribute(el2, "d", "M99,128.4c0,0-0.1,0.1-0.3,0.4c-0.2,0.2-0.4,0.6-0.7,1.1c-0.6,1-1.5,2.3-2.6,4.1c-2.2,3.6-5,8.9-7.7,15.6\n		c-2.7,6.7-5.1,14.8-6.6,23.7c-1.4,8.9-1.7,18.6-0.9,28.2c0.9,9.6,3.2,19,6.2,27.5c3.1,8.5,7.1,15.9,11,22\n		c3.9,6.1,7.8,10.7,10.6,13.9c1.4,1.6,2.6,2.7,3.3,3.6c0.4,0.4,0.7,0.7,0.9,0.9c0.2,0.2,0.3,0.3,0.3,0.3l4.9-4.9\n		c0,0,0.5,0.5,1.3,1.2c0.8,0.7,1.7,1.7,2.8,2.6c1.1,0.9,2.1,1.8,2.9,2.5c0.8,0.7,1.4,1.1,1.4,1.1l-6.5,8.1c0,0,0.6,0.5,1.5,1.2\n		c0.4,0.4,1,0.8,1.5,1.2c0.6,0.4,1.2,0.9,1.8,1.3c2.5,1.8,5.1,3.4,5.1,3.4l5.6-8.8c0,0,0.4,0.2,1.1,0.7c0.7,0.5,1.8,1.1,3.2,1.9\n		c0.7,0.4,1.5,0.8,2.3,1.3c0.9,0.4,1.8,0.9,2.8,1.4c0.5,0.3,1,0.5,1.5,0.8c0.5,0.2,1.1,0.5,1.7,0.7c1.1,0.5,2.3,1.1,3.6,1.6\n		c5,2.1,11.1,4.1,17.8,5.6c6.7,1.4,13.9,2.3,21.3,2.4c7.3,0.1,14.6-0.6,21.3-2c6.7-1.3,12.8-3.3,17.8-5.3c2.6-0.9,4.8-2.1,6.8-3\n		c2-1,3.7-1.9,5.1-2.6c1.4-0.8,2.5-1.4,3.2-1.8c0.4-0.2,0.7-0.4,0.8-0.5c0.2-0.1,0.3-0.2,0.3-0.2l5.5,8.9c0,0,0.7-0.5,2-1.3\n		c0.6-0.4,1.4-0.9,2.3-1.5c0.9-0.6,1.8-1.3,2.9-2c4.2-3,9.5-7.4,14.3-12.3c1.2-1.2,2.4-2.5,3.5-3.7c1.1-1.3,2.2-2.5,3.3-3.8\n		c2-2.5,3.9-4.9,5.3-7c1.5-2.1,2.6-3.9,3.5-5.2c0.4-0.6,0.7-1.1,0.9-1.5c0.2-0.3,0.3-0.5,0.3-0.5l-8.9-5.4c0,0,0.7-1.2,1.7-3\n		c0.6-0.9,1.1-2,1.7-3.1c0.6-1.2,1.3-2.4,1.8-3.7c2.4-5,4.1-10.3,4.1-10.3l9.9,3.3c0,0,0.2-0.5,0.5-1.5c0.4-0.9,0.7-2.3,1.2-4\n		c0.2-0.8,0.5-1.7,0.8-2.7c0.2-1,0.5-2,0.7-3c0.2-1,0.5-2.1,0.7-3.2c0.2-1.1,0.4-2.2,0.6-3.4c0.1-0.6,0.2-1.1,0.3-1.7\n		c0.1-0.6,0.1-1.1,0.2-1.7c0.1-1.1,0.3-2.2,0.4-3.3c0.2-2.1,0.3-4.1,0.5-5.9c0.1-1.7,0.1-3.2,0.1-4.2c0-1,0-1.6,0-1.6l3.5,0\n		c0,0,0,0.7-0.1,1.9c0,0.6,0,1.3-0.1,2.2c0,0.4,0,0.9,0,1.3c0,0.5-0.1,1-0.1,1.5c-0.2,2.1-0.3,4.5-0.7,7c-0.2,1.3-0.3,2.6-0.5,3.9\n		c-0.2,1.3-0.5,2.7-0.7,4c-0.2,1.4-0.6,2.7-0.9,4c-0.3,1.3-0.6,2.6-0.9,3.9c-0.7,2.5-1.3,4.8-2,6.7c-0.7,2-1.2,3.6-1.7,4.7\n		c-0.4,1.1-0.7,1.8-0.7,1.8l-9.7-3.9c0,0-0.3,0.7-0.7,1.7c-0.4,1-1,2.3-1.6,3.6c-0.6,1.3-1.2,2.6-1.7,3.5c-0.5,1-0.8,1.6-0.8,1.6\n		l9.2,4.9c0,0-0.5,1.1-1.6,2.8c-0.5,0.9-1.1,2-1.9,3.2c-0.8,1.2-1.7,2.6-2.6,4.1c-1,1.5-2.1,3-3.3,4.7c-1.2,1.6-2.6,3.3-3.9,5\n		c-0.7,0.8-1.5,1.7-2.2,2.5c-0.8,0.9-1.5,1.8-2.3,2.6c-1.6,1.7-3.2,3.4-4.9,5c-6.8,6.6-14.4,12.2-20.5,15.8\n		c-1.5,0.9-2.9,1.7-4.2,2.4c-1.2,0.7-2.4,1.2-3.3,1.7c-0.9,0.5-1.6,0.8-2.1,1.1c-0.5,0.3-0.8,0.4-0.8,0.4l-1.5-3.1\n		c0,0-1.5,0.7-4.1,1.8c-1.3,0.6-2.9,1.2-4.7,1.9c-0.9,0.4-1.9,0.7-3,1.1c-1,0.4-2.2,0.7-3.3,1.1c-4.7,1.4-10.2,2.8-16.2,3.8\n		c-6,0.9-12.5,1.4-19,1.4c-6.5,0-13-0.7-19-1.7c-3-0.5-5.9-1.2-8.6-1.8c-1.3-0.4-2.6-0.7-3.9-1.1c-0.6-0.2-1.3-0.3-1.9-0.5\n		c-0.6-0.2-1.2-0.4-1.8-0.6c-1.2-0.4-2.3-0.8-3.3-1.1c-1-0.4-2-0.8-2.9-1.2c-0.9-0.4-1.8-0.7-2.6-1c-0.8-0.4-1.5-0.7-2.1-1\n		c-1.3-0.6-2.3-1-3-1.4c-0.7-0.3-1-0.5-1-0.5l-1.5,3.1c0,0-0.7-0.4-2-1c-1.3-0.6-3.2-1.7-5.6-3.1c-4.7-2.8-11.3-7.2-18.4-13.5\n		c-0.9-0.7-1.8-1.6-2.6-2.5c-0.9-0.9-1.8-1.7-2.7-2.6c-1.7-1.9-3.6-3.7-5.3-5.8c-1.8-2-3.5-4.2-5.3-6.5c-1.6-2.3-3.4-4.6-4.9-7.2\n		c-6.4-9.9-11.6-21.5-14.8-33.7c-1.6-6.1-2.6-12.3-3.3-18.5c-0.6-6.2-0.6-12.3-0.4-18.2c0.3-5.9,1.2-11.6,2.2-16.9\n		c0.3-1.3,0.6-2.6,0.9-3.9c0.1-0.6,0.3-1.3,0.4-1.9c0.2-0.6,0.4-1.2,0.5-1.8c0.3-1.2,0.7-2.4,1-3.6c0.4-1.2,0.8-2.3,1.2-3.4\n		c3-8.9,6.7-16,9.4-20.7c1.3-2.4,2.6-4.2,3.3-5.4c0.4-0.6,0.7-1.1,0.9-1.4c0.2-0.3,0.3-0.5,0.3-0.5L99,128.4z M265.2,108.3\n		c0,0-0.5-0.4-1.3-1.1c-0.9-0.7-2.1-1.9-3.8-3.1c-0.8-0.7-1.7-1.4-2.7-2.2c-1-0.7-2.2-1.5-3.3-2.4c-1.2-0.9-2.5-1.7-3.9-2.6\n		c-1.4-0.9-2.9-1.8-4.4-2.7c-6.3-3.6-13.9-7.1-22.6-9.7c-2.2-0.6-4.4-1.3-6.6-1.8c-1.1-0.3-2.3-0.5-3.4-0.8\n		c-1.2-0.2-2.3-0.4-3.5-0.6l-1.8-0.3l-1.8-0.2c-1.2-0.2-2.4-0.3-3.6-0.5c-1.2-0.1-2.4-0.2-3.6-0.3c-1.2-0.1-2.4-0.2-3.6-0.2\n		l-3.6-0.1c-1.2-0.1-2.4,0-3.6,0.1c-1.2,0-2.4,0-3.6,0.1c-1.2,0.1-2.4,0.2-3.6,0.3c-1.2,0.1-2.4,0.2-3.5,0.4\n		c-1.2,0.1-2.3,0.3-3.5,0.4c-1.1,0.2-2.3,0.4-3.4,0.6c-1.1,0.2-2.3,0.4-3.3,0.7c-8.8,1.9-16.8,4.8-23.3,7.9\n		c-6.5,3-11.6,6.3-15.2,8.6c-1.7,1.2-3.1,2.2-4,2.8c-0.5,0.3-0.8,0.6-1,0.8c-0.2,0.2-0.3,0.3-0.3,0.3l4.2,5.5c0,0-0.8,0.6-2.1,1.6\n		c-0.7,0.5-1.4,1.2-2.3,1.9c-0.9,0.8-1.9,1.6-2.9,2.6c-4.2,3.9-9.5,9.5-13.9,15.7c-4.5,6.2-8.2,12.9-10.5,18.1\n		c-0.3,0.7-0.6,1.3-0.9,1.9c-0.3,0.6-0.5,1.2-0.7,1.7c-0.4,1.1-0.8,2-1.1,2.8c-0.3,0.8-0.5,1.4-0.6,1.8c-0.1,0.4-0.2,0.6-0.2,0.6\n		l-3.3-1.1c0,0,0.2-0.7,0.6-1.9c0.5-1.2,1.1-2.8,1.9-4.8c1.7-3.9,4.2-9.1,7.2-14c3-4.9,6.4-9.5,9.1-12.9c1.4-1.6,2.6-3,3.4-3.9\n		c0.9-0.9,1.4-1.4,1.4-1.4l-7.6-7.2c0,0,0.5-0.5,1.4-1.5c0.9-1,2.4-2.3,4.2-4c3.7-3.4,9.1-8,16.3-12.7c0.9-0.6,1.8-1.2,2.8-1.8\n		c1-0.6,1.9-1.1,2.9-1.7c2-1.2,4.1-2.2,6.3-3.3c4.4-2.1,9.2-4.2,14.2-5.8c2.5-0.9,5.1-1.6,7.8-2.3c1.3-0.3,2.7-0.6,4-0.9l2-0.5\n		l2.1-0.4c5.5-1.1,11.2-1.6,16.9-1.9l4.3-0.1c1.4,0,2.9,0.1,4.3,0.1l2.1,0.1l2.1,0.2c1.4,0.1,2.8,0.2,4.2,0.3\n		c2.8,0.4,5.6,0.6,8.3,1.2c1.3,0.3,2.7,0.4,4,0.8c1.3,0.3,2.6,0.6,3.9,0.9c10.4,2.6,19.6,6.5,27.2,10.5c7.6,4,13.4,8.2,17.3,11.3\n		c2,1.5,3.5,2.8,4.5,3.7c1,0.9,1.6,1.3,1.6,1.3L265.2,108.3z M308.8,190.1l-13.7,0.1c0,0,0-0.8-0.1-2.3c0-0.7,0-1.6-0.1-2.6\n		c-0.1-1-0.2-2.2-0.3-3.4c-0.4-5-1.4-11.6-3.1-18c-1.7-6.4-4.1-12.7-6.3-17.2c-0.5-1.2-1.1-2.1-1.5-3.1c-0.5-0.9-0.9-1.7-1.2-2.3\n		c-0.7-1.3-1.1-2-1.1-2l8.9-5.1c0,0-0.2-0.3-0.5-0.9c-0.3-0.6-0.8-1.4-1.4-2.4c-0.6-1-1.3-2.1-2.1-3.3c-0.8-1.2-1.7-2.4-2.6-3.7\n		c-0.4-0.6-0.9-1.3-1.3-1.9c-0.5-0.6-0.9-1.2-1.4-1.7c-0.9-1.1-1.7-2.2-2.5-3.1c-1.5-1.7-2.5-2.9-2.5-2.9l2.6-2.3\n		c0,0,0.9,1,2.4,2.8c0.8,0.9,1.6,2,2.7,3.3c0.5,0.6,1,1.3,1.6,2c0.5,0.7,1.1,1.5,1.7,2.3c0.6,0.8,1.2,1.7,1.8,2.6\n		c0.6,0.9,1.2,1.9,1.8,2.8c1.3,1.9,2.4,4.1,3.7,6.2c2.3,4.4,4.7,9.2,6.6,14.2l0.7,1.9l0.6,1.9c0.4,1.3,0.9,2.5,1.3,3.8\n		c0.4,1.3,0.7,2.5,1.1,3.8c0.2,0.6,0.3,1.2,0.5,1.8c0.1,0.6,0.3,1.2,0.4,1.8c0.3,1.2,0.6,2.4,0.8,3.6c0.2,1.2,0.4,2.3,0.6,3.5\n		c0.5,2.3,0.7,4.4,0.9,6.4c0.3,2,0.4,3.8,0.5,5.4c0.1,0.8,0.1,1.6,0.2,2.3c0,0.7,0,1.4,0.1,1.9\n		C308.8,188.7,308.8,190.1,308.8,190.1z M166.6,86c0,0,0.4-0.1,1.3-0.3c0.4-0.1,0.9-0.2,1.5-0.3c0.6-0.1,1.3-0.2,2.1-0.4\n		c0.8-0.1,1.6-0.3,2.6-0.5c0.9-0.2,2-0.3,3-0.4c1.1-0.1,2.2-0.3,3.5-0.4c1.2-0.1,2.5-0.2,3.9-0.3c5.4-0.3,11.7-0.3,18.4,0.5\n		c6.7,0.7,13.7,2.2,20.6,4.3c6.8,2.2,13.4,5,19.3,8.3c5.9,3.2,11.1,6.8,15.3,10.2c0.5,0.4,1.1,0.8,1.6,1.2c0.5,0.4,1,0.8,1.4,1.2\n		c0.9,0.8,1.8,1.5,2.6,2.3c1.6,1.5,3,2.8,4.1,3.9c1.1,1.1,1.9,2,2.5,2.6c0.3,0.3,0.5,0.5,0.7,0.7c0.1,0.2,0.2,0.3,0.2,0.3\n		l-2.6,2.3c0,0-0.1-0.1-0.2-0.2c-0.1-0.2-0.3-0.4-0.6-0.7c-0.6-0.6-1.4-1.5-2.4-2.6c-1-1.1-2.4-2.3-3.9-3.8\n		c-0.8-0.7-1.7-1.4-2.5-2.2c-0.4-0.4-0.9-0.8-1.4-1.2c-0.5-0.4-1-0.8-1.5-1.2c-8-6.6-20.2-13.8-33.5-17.9\n		c-6.6-2.1-13.4-3.5-19.9-4.2c-6.5-0.7-12.6-0.7-17.8-0.4c-1.3,0.1-2.5,0.2-3.7,0.3c-1.2,0.1-2.3,0.3-3.3,0.4\n		c-1,0.1-2,0.2-2.9,0.4c-0.9,0.2-1.7,0.3-2.5,0.4c-0.7,0.1-1.4,0.2-2,0.3c-0.6,0.1-1.1,0.2-1.5,0.3c-0.8,0.2-1.2,0.3-1.2,0.3\n		L166.6,86z M277.4,121.2c0,0,0.5,0.6,1.1,1.5c0.3,0.4,0.7,0.9,1.2,1.5c0.4,0.5,0.8,1.2,1.3,1.8c0.8,1.2,1.7,2.4,2.3,3.3\n		c0.6,0.9,1,1.6,1,1.6l-5.8,3.8c0,0-0.4-0.6-0.9-1.5c-0.6-0.9-1.4-2-2.2-3.1c-0.4-0.6-0.8-1.1-1.2-1.7c-0.4-0.5-0.8-1-1.1-1.4\n		c-0.6-0.8-1.1-1.4-1.1-1.4L277.4,121.2z");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("svg");
        dom.setAttribute(el1, "version", "1.1");
        dom.setAttribute(el1, "xmlns", "http://www.w3.org/2000/svg");
        dom.setAttribute(el1, "xmlns:xlink", "http://www.w3.org/1999/xlink");
        dom.setAttribute(el1, "x", "0px");
        dom.setAttribute(el1, "y", "0px");
        dom.setAttribute(el1, "viewBox", "0 0 381.7 381.7");
        dom.setAttribute(el1, "style", "enable-background:new 0 0 381.7 381.7;");
        dom.setAttributeNS(el1, "http://www.w3.org/XML/1998/namespace", "xml:space", "preserve");
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("path");
        dom.setAttribute(el2, "d", "M151.4,117.4c0,0-0.2,0.1-0.6,0.3c-0.4,0.2-0.9,0.5-1.6,1c-0.7,0.4-1.6,0.9-2.6,1.6c-1,0.7-2.2,1.3-3.4,2.3\n		c-5.1,3.5-12.1,9.2-18.5,17.7c-3.2,4.2-6.3,9.1-9,14.6c-2.6,5.5-4.7,11.5-6.2,18c-1.5,6.4-2.1,13.3-1.9,20.4\n		c0,3.5,0.5,7,0.9,10.5l0.5,2.6l0.2,1.3l0.3,1.3l0.6,2.6l0.7,2.5c1.9,6.8,4.8,13.3,8.4,19.3c3.5,6,7.9,11.4,12.5,16.2\n		c9.4,9.5,20.4,15.9,30.3,19.5c5,1.8,9.7,3,13.9,3.8c2.1,0.4,4.1,0.6,6,0.9c0.9,0.1,1.8,0.1,2.7,0.2c0.9,0,1.7,0.2,2.5,0.2\n		c1.6,0,3,0.1,4.2,0.1c1.2,0,2.2-0.1,3.1-0.1c0.8,0,1.5-0.1,1.9-0.1c0.4,0,0.7-0.1,0.7-0.1l0.5,6.9c0,0-0.2,0-0.7,0.1\n		c-0.5,0-1.2,0.1-2.1,0.1c-0.9,0-2,0.1-3.3,0.1c-1.3,0-2.8-0.1-4.5-0.1c-0.8,0-1.7-0.1-2.7-0.2c-0.9-0.1-1.9-0.1-2.9-0.2\n		c-2-0.3-4.2-0.5-6.5-1c-4.6-0.8-9.7-2.1-15.1-4.1c-10.7-3.9-22.6-10.9-32.8-21.1c-5-5.2-9.7-11-13.6-17.5\n		c-3.8-6.5-7-13.5-9.1-20.9l-0.8-2.8l-0.6-2.8l-0.3-1.4l-0.2-1.4l-0.5-2.8c-0.5-3.8-1-7.6-1-11.4c-0.2-7.6,0.5-15.1,2-22.1\n		c1.6-7,3.9-13.6,6.7-19.5c2.9-5.9,6.2-11.2,9.7-15.8c7-9.2,14.6-15.4,20-19.2c1.3-1,2.6-1.8,3.7-2.5c1.1-0.7,2.1-1.3,2.8-1.7\n		c0.8-0.5,1.4-0.8,1.8-1c0.4-0.2,0.6-0.3,0.6-0.3L151.4,117.4z M270.7,190.3l-7.1,0c0,0,0-0.6-0.1-1.8c0-0.6,0-1.3-0.1-2.1\n		c-0.1-0.8-0.2-1.8-0.2-2.9c-0.1-1.1-0.3-2.3-0.4-3.5c-0.2-1.3-0.5-2.7-0.7-4.1c-0.7-2.9-1.5-6.2-2.7-9.6\n		c-2.5-6.9-6.5-14.6-12.4-21.8c-5.9-7.2-13.7-13.6-22.4-18.1c-8.7-4.6-18.2-7.2-27.5-8c-4.6-0.4-9.2-0.4-13.4,0.1\n		c-4.2,0.4-8.1,1.2-11.7,2.1c-3.6,0.9-6.7,2.2-9.5,3.2c-0.7,0.3-1.3,0.6-2,0.9c-0.6,0.3-1.3,0.5-1.8,0.9c-0.6,0.3-1.1,0.6-1.7,0.9\n		c-0.5,0.3-1,0.5-1.5,0.8c-0.9,0.5-1.8,1-2.5,1.4c-0.7,0.5-1.3,0.8-1.8,1.2c-0.5,0.3-0.9,0.5-1.1,0.7c-0.2,0.2-0.4,0.3-0.4,0.3\n		l-4-5.8c0,0,0.1-0.1,0.4-0.3c0.3-0.2,0.7-0.4,1.2-0.8c0.5-0.3,1.2-0.8,2-1.3c0.8-0.5,1.7-1,2.7-1.6c0.5-0.3,1.1-0.6,1.6-0.9\n		c0.6-0.3,1.2-0.6,1.8-0.9c0.6-0.4,1.3-0.6,2-0.9c0.7-0.3,1.4-0.7,2.2-1c3.1-1.2,6.5-2.6,10.4-3.6c3.9-1,8.2-1.9,12.8-2.3\n		c4.6-0.5,9.6-0.5,14.7-0.1c10.1,0.8,20.6,3.7,30.2,8.8c9.6,5,18.1,12,24.6,19.9c6.5,7.8,10.9,16.3,13.6,23.9\n		c1.4,3.8,2.3,7.4,3,10.6c0.3,1.6,0.6,3.1,0.8,4.5c0.2,1.4,0.3,2.7,0.5,3.9c0.1,1.2,0.2,2.2,0.2,3.2c0.1,0.9,0,1.7,0.1,2.3\n		C270.7,189.6,270.7,190.3,270.7,190.3z M149.8,255.2c0,0-0.3-0.2-0.9-0.6c-0.6-0.4-1.5-1-2.6-1.8c-1.1-0.7-2.4-1.8-3.8-2.9\n		c-1.4-1.2-3-2.6-4.7-4.2c-3.3-3.2-6.9-7.2-10.1-12c-3.2-4.7-6.1-10.2-8.2-15.8c-2.2-5.7-3.6-11.6-4.3-17.3\n		c-0.7-5.7-0.7-11.2-0.4-15.7c0-0.6,0.1-1.1,0.1-1.7c0-0.5,0.1-1.1,0.2-1.6c0.2-1,0.2-2,0.4-2.9c0.4-1.8,0.6-3.4,0.9-4.7\n		c0.3-1.3,0.5-2.3,0.7-3c0.2-0.7,0.3-1,0.3-1l3.3,0.9c0,0-0.2,0.6-0.5,1.8c-0.1,0.6-0.3,1.4-0.5,2.2c-0.1,0.4-0.2,0.9-0.3,1.4\n		c-0.1,0.5-0.2,1.1-0.3,1.6c-0.1,0.6-0.2,1.2-0.3,1.8c-0.1,0.6-0.2,1.3-0.2,2c-0.2,1.4-0.3,2.9-0.4,4.6c-0.1,3.3-0.3,7,0.2,11\n		c0.7,8,2.9,17.2,7.4,26.1c4.5,8.9,11.2,17.6,19.7,24.3c8.4,6.7,18.2,11.5,27.8,13.8c4.8,1.2,9.6,1.9,14.3,2.1\n		c4.7,0.3,9.1-0.1,13-0.6c4-0.5,7.6-1.3,10.7-2.2c1.6-0.4,3-1,4.3-1.4c1.3-0.5,2.5-1,3.6-1.4c1.1-0.5,2-0.9,2.8-1.3\n		c0.8-0.3,1.5-0.8,2.1-1c0.6-0.3,1-0.5,1.3-0.6c0.3-0.1,0.4-0.2,0.4-0.2l5,9.1c0,0,1.2-0.7,3.3-1.9c1-0.7,2.3-1.5,3.7-2.4\n		c1.4-1,3-2,4.6-3.4c3.3-2.6,6.9-5.8,10.5-9.7c3.5-3.9,6.9-8.3,9.7-13.1c5.7-9.5,9.3-20.2,10.5-28.4c0.1-0.5,0.2-1,0.3-1.5\n		c0.1-0.5,0.1-1,0.2-1.4c0.1-0.9,0.2-1.8,0.4-2.7c0.1-1.7,0.2-3.2,0.3-4.4c0.1-2.5,0.1-3.9,0.1-3.9l3.6,0c0,0,0,0.5,0,1.4\n		c0,0.4,0,1,0,1.6c0,0.3,0,0.7,0,1c0,0.4-0.1,0.8-0.1,1.2c-0.1,0.8-0.1,1.7-0.2,2.7c-0.1,1-0.3,2.1-0.4,3.2\n		c-0.1,0.6-0.1,1.2-0.2,1.8c-0.1,0.6-0.2,1.2-0.3,1.8c-0.1,0.6-0.2,1.3-0.3,1.9c-0.1,0.7-0.3,1.3-0.5,2\n		c-1.2,5.5-3.3,11.8-6.3,18.1c-1.6,3.1-3.3,6.4-5.3,9.5c-1,1.6-2.1,3.1-3.2,4.6c-0.5,0.8-1.2,1.5-1.7,2.2\n		c-0.6,0.7-1.1,1.5-1.8,2.2l-1.9,2.1c-0.6,0.7-1.3,1.4-1.9,2.1c-1.3,1.4-2.7,2.6-4,3.9c-2.8,2.5-5.6,4.8-8.5,6.8\n		c-5.8,4.1-11.6,7.2-16.8,9.4c-5.2,2.2-9.7,3.4-12.9,4.2c-1.6,0.3-2.8,0.7-3.7,0.8c-0.9,0.2-1.3,0.2-1.3,0.2l-1.2-6.9\n		c0,0-0.2,0-0.7,0.1c-0.4,0.1-1,0.2-1.9,0.3c-0.8,0.1-1.8,0.2-2.9,0.4c-1.1,0.2-2.4,0.2-3.8,0.3c-0.7,0.1-1.4,0.1-2.2,0.1\n		c-0.8,0-1.5,0-2.4,0.1c-0.8,0-1.6,0-2.5-0.1c-0.8,0-1.7,0-2.6-0.1c-1.7-0.2-3.6-0.2-5.4-0.5c-0.9-0.1-1.8-0.2-2.7-0.4\n		c-0.9-0.2-1.8-0.3-2.7-0.5c-7.3-1.4-14.3-4-19.3-6.5c-1.2-0.6-2.4-1.2-3.4-1.7c-1-0.6-1.8-1.1-2.5-1.5c-0.7-0.4-1.2-0.8-1.6-1\n		c-0.4-0.2-0.6-0.4-0.6-0.4L149.8,255.2z M116.8,160.9c0,0,0.1-0.1,0.2-0.4c0.1-0.3,0.2-0.7,0.5-1.1c0.2-0.5,0.5-1.1,0.8-1.7\n		c0.3-0.7,0.6-1.4,1-2.2c1.5-3.2,4-7.4,6.8-11.3c2.8-3.9,6-7.5,8.6-10.1c0.7-0.6,1.3-1.2,1.8-1.7c0.5-0.5,1-1,1.4-1.3\n		c0.8-0.7,1.3-1.1,1.3-1.1l2.3,2.6c0,0-0.2,0.2-0.7,0.6c-0.4,0.4-1.1,0.9-1.7,1.5c-0.7,0.7-1.5,1.4-2.4,2.3\n		c-0.8,0.9-1.7,1.8-2.6,2.7c-0.8,1-1.7,1.9-2.4,2.9c-0.7,0.9-1.4,1.8-2,2.6c-1.1,1.6-1.8,2.6-1.8,2.6l2.9,2c0,0-0.2,0.2-0.4,0.6\n		c-0.2,0.4-0.6,0.9-0.9,1.5c-0.4,0.6-0.9,1.3-1.3,2.1c-0.4,0.8-1,1.6-1.4,2.5c-0.4,0.9-0.9,1.7-1.3,2.5c-0.4,0.8-0.7,1.6-1,2.3\n		c-0.3,0.7-0.6,1.2-0.7,1.6c-0.2,0.4-0.2,0.6-0.2,0.6L116.8,160.9z M248.9,126.3c0,0-0.3-0.3-0.9-0.7c-0.6-0.5-1.4-1.2-2.5-2.1\n		c-0.5-0.4-1.2-0.9-1.8-1.4c-0.3-0.3-0.7-0.5-1-0.8c-0.4-0.3-0.8-0.5-1.2-0.8c-0.8-0.6-1.6-1.2-2.5-1.8c-0.9-0.6-1.9-1.2-2.9-1.8\n		c-4.1-2.5-9-5-14.6-7.2c-5.6-2.1-11.7-3.8-18-4.7c-6.3-0.9-12.8-1.1-18.7-0.7c-6,0.4-11.5,1.4-16.1,2.6c-1.1,0.3-2.2,0.6-3.3,0.9\n		c-1,0.3-2,0.7-2.9,1c-1.9,0.6-3.4,1.3-4.7,1.8c-0.7,0.2-1.2,0.5-1.7,0.7c-0.5,0.2-0.9,0.4-1.2,0.6c-0.7,0.3-1,0.5-1,0.5l-1.5-3.1\n		c0,0,0.4-0.2,1.1-0.5c0.4-0.2,0.8-0.4,1.3-0.6c0.5-0.2,1.1-0.5,1.8-0.8c1.4-0.5,2.9-1.2,4.9-1.8c1-0.3,2-0.7,3-1\n		c1.1-0.3,2.2-0.6,3.4-1c4.8-1.2,10.5-2.3,16.7-2.7c6.2-0.4,12.9-0.2,19.5,0.7c6.6,0.9,12.9,2.7,18.7,4.9\n		c5.8,2.2,10.9,4.9,15.2,7.4c1,0.7,2,1.3,3,1.9c0.9,0.6,1.8,1.3,2.6,1.9c0.4,0.3,0.8,0.6,1.2,0.8c0.4,0.3,0.7,0.6,1.1,0.8\n		c0.7,0.5,1.3,1,1.9,1.5c1.1,0.9,2,1.7,2.6,2.2c0.6,0.5,0.9,0.8,0.9,0.8L248.9,126.3z M273.8,183.2c0,0,0-0.8-0.2-2.3\n		c-0.1-0.7-0.2-1.6-0.3-2.6c-0.2-1-0.4-2.1-0.6-3.4c-1-4.9-2.6-11.3-5.4-17.4c-2.7-6.1-6.1-11.8-9.1-15.8c-0.3-0.5-0.7-1-1.1-1.4\n		c-0.4-0.4-0.7-0.9-1-1.3c-0.3-0.4-0.6-0.8-0.9-1.1c-0.3-0.3-0.6-0.6-0.8-0.9c-1-1.1-1.5-1.7-1.5-1.7l2.6-2.3c0,0,0.6,0.7,1.6,1.8\n		c0.3,0.3,0.5,0.6,0.8,0.9c0.3,0.4,0.6,0.8,0.9,1.2c0.3,0.4,0.7,0.9,1,1.3c0.4,0.5,0.8,1,1.1,1.5c3.1,4.2,6.7,10.2,9.5,16.5\n		c2.9,6.3,4.6,13,5.6,18.1c0.2,1.3,0.4,2.5,0.6,3.5c0.1,1.1,0.2,2,0.3,2.7c0.2,1.5,0.3,2.4,0.3,2.4L273.8,183.2z");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() {
        return [];
      },
      statements: [],
      locals: [],
      templates: []
    };
  })());
});
define("alarm-clock/templates/components/touch-to", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@1.13.10",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 2,
            "column": 0
          }
        },
        "moduleName": "alarm-clock/templates/components/touch-to.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [["content", "yield", ["loc", [null, [1, 0], [1, 9]]]]],
      locals: [],
      templates: []
    };
  })());
});
define("alarm-clock/templates/edit", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@1.13.10",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 4,
            "column": 0
          }
        },
        "moduleName": "alarm-clock/templates/edit.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "manage-alarms");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0]), 1, 1);
        return morphs;
      },
      statements: [["inline", "alarm-form", [], ["save", "saveAlarm", "selectedDays", ["subexpr", "@mut", [["get", "model.alarm.selectedDays", ["loc", [null, [2, 47], [2, 71]]]]], [], []], "time", ["subexpr", "@mut", [["get", "model.time", ["loc", [null, [2, 77], [2, 87]]]]], [], []]], ["loc", [null, [2, 4], [2, 89]]]]],
      locals: [],
      templates: []
    };
  })());
});
define("alarm-clock/templates/index", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@1.13.10",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 1,
              "column": 59
            }
          },
          "moduleName": "alarm-clock/templates/index.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@1.13.10",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 4,
            "column": 0
          }
        },
        "moduleName": "alarm-clock/templates/index.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(3);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        morphs[1] = dom.createMorphAt(fragment, 2, 2, contextualElement);
        morphs[2] = dom.createMorphAt(fragment, 4, 4, contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [["block", "touch-to", [], ["destination", "alarms", "class", "nav fa fa-pencil"], 0, null, ["loc", [null, [1, 0], [1, 72]]]], ["content", "the-clock", ["loc", [null, [2, 0], [2, 13]]]], ["content", "active-alarm", ["loc", [null, [3, 0], [3, 16]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("alarm-clock/templates/new", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@1.13.10",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 4,
            "column": 0
          }
        },
        "moduleName": "alarm-clock/templates/new.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "manage-alarms");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0]), 1, 1);
        return morphs;
      },
      statements: [["inline", "alarm-form", [], ["save", "createNewAlarm"], ["loc", [null, [2, 4], [2, 40]]]]],
      locals: [],
      templates: []
    };
  })());
});
/* jshint ignore:start */

/* jshint ignore:end */

/* jshint ignore:start */

define('alarm-clock/config/environment', ['ember'], function(Ember) {
  var prefix = 'alarm-clock';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (!runningTests) {
  require("alarm-clock/app")["default"].create({"name":"alarm-clock","version":"0.0.0+f3c58e01"});
}

/* jshint ignore:end */
//# sourceMappingURL=alarm-clock.map