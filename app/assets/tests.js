define('alarm-clock/tests/app.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - app.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app.js should pass jshint.');
  });
});
define('alarm-clock/tests/components/active-alarm.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - components/active-alarm.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/active-alarm.js should pass jshint.');
  });
});
define('alarm-clock/tests/components/alarm-control.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - components/alarm-control.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/alarm-control.js should pass jshint.');
  });
});
define('alarm-clock/tests/components/alarm-form.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - components/alarm-form.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/alarm-form.js should pass jshint.');
  });
});
define('alarm-clock/tests/components/alarm-item.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - components/alarm-item.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/alarm-item.js should pass jshint.');
  });
});
define('alarm-clock/tests/components/prepare-alarm.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - components/prepare-alarm.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/prepare-alarm.js should pass jshint.');
  });
});
define('alarm-clock/tests/components/the-clock.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - components/the-clock.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/the-clock.js should pass jshint.');
  });
});
define('alarm-clock/tests/components/the-rings.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - components/the-rings.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/the-rings.js should pass jshint.');
  });
});
define('alarm-clock/tests/components/touch-to.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - components/touch-to.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/touch-to.js should pass jshint.');
  });
});
define('alarm-clock/tests/helpers/destroy-app', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = destroyApp;

  function destroyApp(application) {
    _ember['default'].run(application, 'destroy');
  }
});
define('alarm-clock/tests/helpers/destroy-app.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - helpers/destroy-app.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/destroy-app.js should pass jshint.');
  });
});
define('alarm-clock/tests/helpers/module-for-acceptance', ['exports', 'qunit', 'alarm-clock/tests/helpers/start-app', 'alarm-clock/tests/helpers/destroy-app'], function (exports, _qunit, _alarmClockTestsHelpersStartApp, _alarmClockTestsHelpersDestroyApp) {
  exports['default'] = function (name) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    (0, _qunit.module)(name, {
      beforeEach: function beforeEach() {
        this.application = (0, _alarmClockTestsHelpersStartApp['default'])();

        if (options.beforeEach) {
          options.beforeEach.apply(this, arguments);
        }
      },

      afterEach: function afterEach() {
        (0, _alarmClockTestsHelpersDestroyApp['default'])(this.application);

        if (options.afterEach) {
          options.afterEach.apply(this, arguments);
        }
      }
    });
  };
});
define('alarm-clock/tests/helpers/module-for-acceptance.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - helpers/module-for-acceptance.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/module-for-acceptance.js should pass jshint.');
  });
});
define('alarm-clock/tests/helpers/resolver', ['exports', 'ember/resolver', 'alarm-clock/config/environment'], function (exports, _emberResolver, _alarmClockConfigEnvironment) {

  var resolver = _emberResolver['default'].create();

  resolver.namespace = {
    modulePrefix: _alarmClockConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _alarmClockConfigEnvironment['default'].podModulePrefix
  };

  exports['default'] = resolver;
});
define('alarm-clock/tests/helpers/resolver.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - helpers/resolver.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/resolver.js should pass jshint.');
  });
});
define('alarm-clock/tests/helpers/start-app', ['exports', 'ember', 'alarm-clock/app', 'alarm-clock/config/environment'], function (exports, _ember, _alarmClockApp, _alarmClockConfigEnvironment) {
  exports['default'] = startApp;

  function startApp(attrs) {
    var application = undefined;

    var attributes = _ember['default'].merge({}, _alarmClockConfigEnvironment['default'].APP);
    attributes = _ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    _ember['default'].run(function () {
      application = _alarmClockApp['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }
});
define('alarm-clock/tests/helpers/start-app.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - helpers/start-app.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/start-app.js should pass jshint.');
  });
});
define('alarm-clock/tests/integration/components/active-alarm-test', ['exports', 'ember-qunit', 'ember', 'ember-test-helpers/wait'], function (exports, _emberQunit, _ember, _emberTestHelpersWait) {

    (0, _emberQunit.moduleForComponent)('active-alarm', 'Integration | Component | active alarm', {
        integration: true
    });

    function copyObject(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
    var timeService = {
        now: {
            getDay: function getDay() {
                return 0;
            },
            getHours: function getHours() {
                return 1;
            },
            getMinutes: function getMinutes() {
                return 2;
            },
            getTime: function getTime() {
                return 100;
            }
        },
        weekDays: ['Today']
    };
    var alarmsService = {
        alarms: [{
            isEnabled: true,
            selectedDays: {
                today: true
            },
            hours: 1,
            minutes: 2
        }]
    };

    (0, _emberQunit.test)('it should render if the alarm is going off.', function (assert) {
        assert.expect(1);
        this.set('alarming', true);
        this.render(_ember['default'].HTMLBars.template((function () {
            return {
                meta: {
                    'revision': 'Ember@1.13.10',
                    'loc': {
                        'source': null,
                        'start': {
                            'line': 1,
                            'column': 0
                        },
                        'end': {
                            'line': 1,
                            'column': 34
                        }
                    }
                },
                arity: 0,
                cachedFragment: null,
                hasRendered: false,
                buildFragment: function buildFragment(dom) {
                    var el0 = dom.createDocumentFragment();
                    var el1 = dom.createComment('');
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
                statements: [['inline', 'active-alarm', [], ['alarming', ['subexpr', '@mut', [['get', 'alarming', ['loc', [null, [1, 24], [1, 32]]]]], [], []]], ['loc', [null, [1, 0], [1, 34]]]]],
                locals: [],
                templates: []
            };
        })()));
        assert.equal(this.$('.alarm-control').length, 1);
    });

    (0, _emberQunit.test)('it should not render if the alarm is not going off', function (assert) {
        assert.expect(1);
        this.set('alarming', false);
        this.render(_ember['default'].HTMLBars.template((function () {
            return {
                meta: {
                    'revision': 'Ember@1.13.10',
                    'loc': {
                        'source': null,
                        'start': {
                            'line': 1,
                            'column': 0
                        },
                        'end': {
                            'line': 1,
                            'column': 34
                        }
                    }
                },
                arity: 0,
                cachedFragment: null,
                hasRendered: false,
                buildFragment: function buildFragment(dom) {
                    var el0 = dom.createDocumentFragment();
                    var el1 = dom.createComment('');
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
                statements: [['inline', 'active-alarm', [], ['alarming', ['subexpr', '@mut', [['get', 'alarming', ['loc', [null, [1, 24], [1, 32]]]]], [], []]], ['loc', [null, [1, 0], [1, 34]]]]],
                locals: [],
                templates: []
            };
        })()));
        assert.equal(this.$('.alarm-control').length, 0);
    });

    (0, _emberQunit.test)('it should render if snoozing has completed', function (assert) {
        assert.expect(1);
        this.set('doneSnoozing', true);
        this.render(_ember['default'].HTMLBars.template((function () {
            return {
                meta: {
                    'revision': 'Ember@1.13.10',
                    'loc': {
                        'source': null,
                        'start': {
                            'line': 1,
                            'column': 0
                        },
                        'end': {
                            'line': 1,
                            'column': 42
                        }
                    }
                },
                arity: 0,
                cachedFragment: null,
                hasRendered: false,
                buildFragment: function buildFragment(dom) {
                    var el0 = dom.createDocumentFragment();
                    var el1 = dom.createComment('');
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
                statements: [['inline', 'active-alarm', [], ['doneSnoozing', ['subexpr', '@mut', [['get', 'doneSnoozing', ['loc', [null, [1, 28], [1, 40]]]]], [], []]], ['loc', [null, [1, 0], [1, 42]]]]],
                locals: [],
                templates: []
            };
        })()));
        assert.equal(this.$('.alarm-control').length, 1);
    });

    (0, _emberQunit.test)('it should render if there is an alarm for the current time.', function (assert) {
        assert.expect(1);
        this.set('timeService', timeService);
        this.set('alarmsService', alarmsService);

        this.render(_ember['default'].HTMLBars.template((function () {
            return {
                meta: {
                    'revision': 'Ember@1.13.10',
                    'loc': {
                        'source': null,
                        'start': {
                            'line': 1,
                            'column': 0
                        },
                        'end': {
                            'line': 1,
                            'column': 68
                        }
                    }
                },
                arity: 0,
                cachedFragment: null,
                hasRendered: false,
                buildFragment: function buildFragment(dom) {
                    var el0 = dom.createDocumentFragment();
                    var el1 = dom.createComment('');
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
                statements: [['inline', 'active-alarm', [], ['timeService', ['subexpr', '@mut', [['get', 'timeService', ['loc', [null, [1, 27], [1, 38]]]]], [], []], 'alarmsService', ['subexpr', '@mut', [['get', 'alarmsService', ['loc', [null, [1, 53], [1, 66]]]]], [], []]], ['loc', [null, [1, 0], [1, 68]]]]],
                locals: [],
                templates: []
            };
        })()));

        assert.equal(this.$('.alarm-control').length, 1);
    });

    (0, _emberQunit.test)('it should not render if there is no relevant alarm', function (assert) {
        assert.expect(5);

        var alarms = copyObject(alarmsService);
        alarms.alarms[0].isEnabled = false;
        this.set('alarmsService', alarms);
        this.set('timeService', timeService);

        this.render(_ember['default'].HTMLBars.template((function () {
            return {
                meta: {
                    'revision': 'Ember@1.13.10',
                    'loc': {
                        'source': null,
                        'start': {
                            'line': 1,
                            'column': 0
                        },
                        'end': {
                            'line': 1,
                            'column': 68
                        }
                    }
                },
                arity: 0,
                cachedFragment: null,
                hasRendered: false,
                buildFragment: function buildFragment(dom) {
                    var el0 = dom.createDocumentFragment();
                    var el1 = dom.createComment('');
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
                statements: [['inline', 'active-alarm', [], ['timeService', ['subexpr', '@mut', [['get', 'timeService', ['loc', [null, [1, 27], [1, 38]]]]], [], []], 'alarmsService', ['subexpr', '@mut', [['get', 'alarmsService', ['loc', [null, [1, 53], [1, 66]]]]], [], []]], ['loc', [null, [1, 0], [1, 68]]]]],
                locals: [],
                templates: []
            };
        })()));
        assert.equal(this.$('.alarm-control').length, 0);

        alarms = copyObject(alarmsService);
        alarms.alarms[0].selectedDays.today = false;
        this.set('alarmsService', alarms);
        this.render(_ember['default'].HTMLBars.template((function () {
            return {
                meta: {
                    'revision': 'Ember@1.13.10',
                    'loc': {
                        'source': null,
                        'start': {
                            'line': 1,
                            'column': 0
                        },
                        'end': {
                            'line': 1,
                            'column': 68
                        }
                    }
                },
                arity: 0,
                cachedFragment: null,
                hasRendered: false,
                buildFragment: function buildFragment(dom) {
                    var el0 = dom.createDocumentFragment();
                    var el1 = dom.createComment('');
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
                statements: [['inline', 'active-alarm', [], ['timeService', ['subexpr', '@mut', [['get', 'timeService', ['loc', [null, [1, 27], [1, 38]]]]], [], []], 'alarmsService', ['subexpr', '@mut', [['get', 'alarmsService', ['loc', [null, [1, 53], [1, 66]]]]], [], []]], ['loc', [null, [1, 0], [1, 68]]]]],
                locals: [],
                templates: []
            };
        })()));
        assert.equal(this.$('.alarm-control').length, 0);

        alarms = copyObject(alarmsService);
        alarms.alarms[0].hours = 5;
        this.set('alarmsService', alarms);
        this.render(_ember['default'].HTMLBars.template((function () {
            return {
                meta: {
                    'revision': 'Ember@1.13.10',
                    'loc': {
                        'source': null,
                        'start': {
                            'line': 1,
                            'column': 0
                        },
                        'end': {
                            'line': 1,
                            'column': 68
                        }
                    }
                },
                arity: 0,
                cachedFragment: null,
                hasRendered: false,
                buildFragment: function buildFragment(dom) {
                    var el0 = dom.createDocumentFragment();
                    var el1 = dom.createComment('');
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
                statements: [['inline', 'active-alarm', [], ['timeService', ['subexpr', '@mut', [['get', 'timeService', ['loc', [null, [1, 27], [1, 38]]]]], [], []], 'alarmsService', ['subexpr', '@mut', [['get', 'alarmsService', ['loc', [null, [1, 53], [1, 66]]]]], [], []]], ['loc', [null, [1, 0], [1, 68]]]]],
                locals: [],
                templates: []
            };
        })()));
        assert.equal(this.$('.alarm-control').length, 0);

        alarms = copyObject(alarmsService);
        alarms.alarms[0].minutes = 5;
        this.set('alarmsService', alarms);
        this.render(_ember['default'].HTMLBars.template((function () {
            return {
                meta: {
                    'revision': 'Ember@1.13.10',
                    'loc': {
                        'source': null,
                        'start': {
                            'line': 1,
                            'column': 0
                        },
                        'end': {
                            'line': 1,
                            'column': 68
                        }
                    }
                },
                arity: 0,
                cachedFragment: null,
                hasRendered: false,
                buildFragment: function buildFragment(dom) {
                    var el0 = dom.createDocumentFragment();
                    var el1 = dom.createComment('');
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
                statements: [['inline', 'active-alarm', [], ['timeService', ['subexpr', '@mut', [['get', 'timeService', ['loc', [null, [1, 27], [1, 38]]]]], [], []], 'alarmsService', ['subexpr', '@mut', [['get', 'alarmsService', ['loc', [null, [1, 53], [1, 66]]]]], [], []]], ['loc', [null, [1, 0], [1, 68]]]]],
                locals: [],
                templates: []
            };
        })()));
        assert.equal(this.$('.alarm-control').length, 0);

        alarms = copyObject(alarmsService);
        alarms.alarms = [];
        this.set('alarmsService', alarms);
        this.render(_ember['default'].HTMLBars.template((function () {
            return {
                meta: {
                    'revision': 'Ember@1.13.10',
                    'loc': {
                        'source': null,
                        'start': {
                            'line': 1,
                            'column': 0
                        },
                        'end': {
                            'line': 1,
                            'column': 68
                        }
                    }
                },
                arity: 0,
                cachedFragment: null,
                hasRendered: false,
                buildFragment: function buildFragment(dom) {
                    var el0 = dom.createDocumentFragment();
                    var el1 = dom.createComment('');
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
                statements: [['inline', 'active-alarm', [], ['timeService', ['subexpr', '@mut', [['get', 'timeService', ['loc', [null, [1, 27], [1, 38]]]]], [], []], 'alarmsService', ['subexpr', '@mut', [['get', 'alarmsService', ['loc', [null, [1, 53], [1, 66]]]]], [], []]], ['loc', [null, [1, 0], [1, 68]]]]],
                locals: [],
                templates: []
            };
        })()));
        assert.equal(this.$('.alarm-control').length, 0);
    });

    (0, _emberQunit.test)('it should not render if the alarm was stopped recently', function (assert) {
        assert.expect(1);

        this.set('timeService', timeService);
        this.set('alarmsService', alarmsService);
        this.set('stopped', {
            getTime: function getTime() {
                return 0;
            }
        });
        this.render(_ember['default'].HTMLBars.template((function () {
            return {
                meta: {
                    'revision': 'Ember@1.13.10',
                    'loc': {
                        'source': null,
                        'start': {
                            'line': 1,
                            'column': 0
                        },
                        'end': {
                            'line': 1,
                            'column': 84
                        }
                    }
                },
                arity: 0,
                cachedFragment: null,
                hasRendered: false,
                buildFragment: function buildFragment(dom) {
                    var el0 = dom.createDocumentFragment();
                    var el1 = dom.createComment('');
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
                statements: [['inline', 'active-alarm', [], ['timeService', ['subexpr', '@mut', [['get', 'timeService', ['loc', [null, [1, 27], [1, 38]]]]], [], []], 'alarmsService', ['subexpr', '@mut', [['get', 'alarmsService', ['loc', [null, [1, 53], [1, 66]]]]], [], []], 'stopped', ['subexpr', '@mut', [['get', 'stopped', ['loc', [null, [1, 75], [1, 82]]]]], [], []]], ['loc', [null, [1, 0], [1, 84]]]]],
                locals: [],
                templates: []
            };
        })()));
        assert.equal(this.$('.alarm-control').length, 0);
    });

    (0, _emberQunit.test)('the sound should play if the alarm is going off', function (assert) {
        assert.expect(1);

        var playing = false;
        this.set('soundService', {
            playing: false,
            play: function play() {
                playing = true;
            },
            stop: function stop() {
                playing = false;
            }
        });
        this.set('alarming', false);

        this.render(_ember['default'].HTMLBars.template((function () {
            return {
                meta: {
                    'revision': 'Ember@1.13.10',
                    'loc': {
                        'source': null,
                        'start': {
                            'line': 1,
                            'column': 0
                        },
                        'end': {
                            'line': 1,
                            'column': 60
                        }
                    }
                },
                arity: 0,
                cachedFragment: null,
                hasRendered: false,
                buildFragment: function buildFragment(dom) {
                    var el0 = dom.createDocumentFragment();
                    var el1 = dom.createComment('');
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
                statements: [['inline', 'active-alarm', [], ['soundService', ['subexpr', '@mut', [['get', 'soundService', ['loc', [null, [1, 28], [1, 40]]]]], [], []], 'alarming', ['subexpr', '@mut', [['get', 'alarming', ['loc', [null, [1, 50], [1, 58]]]]], [], []]], ['loc', [null, [1, 0], [1, 60]]]]],
                locals: [],
                templates: []
            };
        })()));

        this.set('alarming', true);

        return new _ember['default'].RSVP.Promise(function (resolve) {
            _ember['default'].run.later(function () {
                resolve();
            }, 10);
        }).then(function () {
            assert.equal(playing, true);
        });
    });

    (0, _emberQunit.test)('the sound should not play if the alarm is not going off', function (assert) {
        assert.expect(1);

        var playing = true;
        this.set('soundService', {
            playing: true,
            play: function play() {
                console.log('play');
                playing = true;
            },
            stop: function stop() {
                playing = false;
            }
        });
        this.set('alarming', true);

        this.render(_ember['default'].HTMLBars.template((function () {
            return {
                meta: {
                    'revision': 'Ember@1.13.10',
                    'loc': {
                        'source': null,
                        'start': {
                            'line': 1,
                            'column': 0
                        },
                        'end': {
                            'line': 1,
                            'column': 60
                        }
                    }
                },
                arity: 0,
                cachedFragment: null,
                hasRendered: false,
                buildFragment: function buildFragment(dom) {
                    var el0 = dom.createDocumentFragment();
                    var el1 = dom.createComment('');
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
                statements: [['inline', 'active-alarm', [], ['soundService', ['subexpr', '@mut', [['get', 'soundService', ['loc', [null, [1, 28], [1, 40]]]]], [], []], 'alarming', ['subexpr', '@mut', [['get', 'alarming', ['loc', [null, [1, 50], [1, 58]]]]], [], []]], ['loc', [null, [1, 0], [1, 60]]]]],
                locals: [],
                templates: []
            };
        })()));

        this.set('alarming', false);

        return new _ember['default'].RSVP.Promise(function (resolve) {
            _ember['default'].run.later(function () {
                resolve();
            }, 10);
        }).then(function () {
            assert.equal(playing, false);
        });
    });
});
define('alarm-clock/tests/integration/components/active-alarm-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - integration/components/active-alarm-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'integration/components/active-alarm-test.js should pass jshint.\nintegration/components/active-alarm-test.js: line 4, col 8, \'wait\' is defined but never used.\n\n1 error');
  });
});
define('alarm-clock/tests/integration/components/alarm-control-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('alarm-control', 'Integration | Component | alarm control', {
    integration: true
  });

  // test('it renders', function(assert) {
  //
  //   // Set any properties with this.set('myProperty', 'value');
  //   // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +
  //
  //   this.render(hbs`{{alarm-control}}`);
  //
  //   assert.equal(this.$().text().trim(), '');
  //
  //   // Template block usage:" + EOL +
  //   this.render(hbs`
  //     {{#alarm-control}}
  //       template block text
  //     {{/alarm-control}}
  //   `);
  //
  //   assert.equal(this.$().text().trim(), 'template block text');
  // });
});
define('alarm-clock/tests/integration/components/alarm-control-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - integration/components/alarm-control-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'integration/components/alarm-control-test.js should pass jshint.\nintegration/components/alarm-control-test.js: line 1, col 30, \'test\' is defined but never used.\nintegration/components/alarm-control-test.js: line 2, col 8, \'hbs\' is defined but never used.\n\n2 errors');
  });
});
define('alarm-clock/tests/integration/components/alarm-form-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('alarm-form', 'Integration | Component | alarm form', {
    integration: true
  });

  // test('it renders', function(assert) {
  //
  //   // Set any properties with this.set('myProperty', 'value');
  //   // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +
  //
  //   this.render(hbs`{{alarm-form}}`);
  //
  //   assert.equal(this.$().text().trim(), '');
  //
  //   // Template block usage:" + EOL +
  //   this.render(hbs`
  //     {{#alarm-form}}
  //       template block text
  //     {{/alarm-form}}
  //   `);
  //
  //   assert.equal(this.$().text().trim(), 'template block text');
  // });
});
define('alarm-clock/tests/integration/components/alarm-form-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - integration/components/alarm-form-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'integration/components/alarm-form-test.js should pass jshint.\nintegration/components/alarm-form-test.js: line 1, col 30, \'test\' is defined but never used.\nintegration/components/alarm-form-test.js: line 2, col 8, \'hbs\' is defined but never used.\n\n2 errors');
  });
});
define('alarm-clock/tests/integration/components/alarm-item-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('alarm-item', 'Integration | Component | alarm item', {
    integration: true
  });

  // test('it renders', function(assert) {
  //
  //   // Set any properties with this.set('myProperty', 'value');
  //   // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +
  //
  //   this.render(hbs`{{alarm-item}}`);
  //
  //   assert.equal(this.$().text().trim(), '');
  //
  //   // Template block usage:" + EOL +
  //   this.render(hbs`
  //     {{#alarm-item}}
  //       template block text
  //     {{/alarm-item}}
  //   `);
  //
  //   assert.equal(this.$().text().trim(), 'template block text');
  // });
});
define('alarm-clock/tests/integration/components/alarm-item-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - integration/components/alarm-item-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'integration/components/alarm-item-test.js should pass jshint.\nintegration/components/alarm-item-test.js: line 1, col 30, \'test\' is defined but never used.\nintegration/components/alarm-item-test.js: line 2, col 8, \'hbs\' is defined but never used.\n\n2 errors');
  });
});
define('alarm-clock/tests/integration/components/prepare-alarm-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('prepare-alarm', 'Integration | Component | prepare alarm', {
    integration: true
  });

  // test('it renders', function(assert) {
  //
  //   // Set any properties with this.set('myProperty', 'value');
  //   // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +
  //
  //   this.render(hbs`{{prepare-alarm}}`);
  //
  //   assert.equal(this.$().text().trim(), '');
  //
  //   // Template block usage:" + EOL +
  //   this.render(hbs`
  //     {{#prepare-alarm}}
  //       template block text
  //     {{/prepare-alarm}}
  //   `);
  //
  //   assert.equal(this.$().text().trim(), 'template block text');
  // });
});
define('alarm-clock/tests/integration/components/prepare-alarm-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - integration/components/prepare-alarm-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'integration/components/prepare-alarm-test.js should pass jshint.\nintegration/components/prepare-alarm-test.js: line 1, col 30, \'test\' is defined but never used.\nintegration/components/prepare-alarm-test.js: line 2, col 8, \'hbs\' is defined but never used.\n\n2 errors');
  });
});
define('alarm-clock/tests/integration/components/the-clock-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('the-clock', 'Integration | Component | the clock', {
    integration: true
  });

  // test('it renders', function(assert) {
  //
  //   // Set any properties with this.set('myProperty', 'value');
  //   // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +
  //
  //   this.render(hbs`{{the-clock}}`);
  //
  //   assert.equal(this.$().text().trim(), '');
  //
  //   // Template block usage:" + EOL +
  //   this.render(hbs`
  //     {{#the-clock}}
  //       template block text
  //     {{/the-clock}}
  //   `);
  //
  //   assert.equal(this.$().text().trim(), 'template block text');
  // });
});
define('alarm-clock/tests/integration/components/the-clock-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - integration/components/the-clock-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'integration/components/the-clock-test.js should pass jshint.\nintegration/components/the-clock-test.js: line 1, col 30, \'test\' is defined but never used.\nintegration/components/the-clock-test.js: line 2, col 8, \'hbs\' is defined but never used.\n\n2 errors');
  });
});
define('alarm-clock/tests/integration/components/the-rings-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('the-rings', 'Integration | Component | the rings', {
    integration: true
  });

  // test('it renders', function(assert) {
  //
  //   // Set any properties with this.set('myProperty', 'value');
  //   // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +
  //
  //   this.render(hbs`{{the-rings}}`);
  //
  //   assert.equal(this.$().text().trim(), '');
  //
  //   // Template block usage:" + EOL +
  //   this.render(hbs`
  //     {{#the-rings}}
  //       template block text
  //     {{/the-rings}}
  //   `);
  //
  //   assert.equal(this.$().text().trim(), 'template block text');
  // });
});
define('alarm-clock/tests/integration/components/the-rings-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - integration/components/the-rings-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'integration/components/the-rings-test.js should pass jshint.\nintegration/components/the-rings-test.js: line 1, col 30, \'test\' is defined but never used.\nintegration/components/the-rings-test.js: line 2, col 8, \'hbs\' is defined but never used.\n\n2 errors');
  });
});
define('alarm-clock/tests/router.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - router.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'router.js should pass jshint.');
  });
});
define('alarm-clock/tests/routes/alarms.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - routes/alarms.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/alarms.js should pass jshint.');
  });
});
define('alarm-clock/tests/routes/edit.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - routes/edit.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/edit.js should pass jshint.');
  });
});
define('alarm-clock/tests/routes/index.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - routes/index.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/index.js should pass jshint.');
  });
});
define('alarm-clock/tests/routes/new.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - routes/new.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/new.js should pass jshint.');
  });
});
define('alarm-clock/tests/services/alarms.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - services/alarms.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'services/alarms.js should pass jshint.');
  });
});
define('alarm-clock/tests/services/sound.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - services/sound.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'services/sound.js should pass jshint.');
  });
});
define('alarm-clock/tests/services/time.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - services/time.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'services/time.js should pass jshint.');
  });
});
define('alarm-clock/tests/test-helper', ['exports', 'alarm-clock/tests/helpers/resolver', 'ember-qunit'], function (exports, _alarmClockTestsHelpersResolver, _emberQunit) {

  (0, _emberQunit.setResolver)(_alarmClockTestsHelpersResolver['default']);
});
define('alarm-clock/tests/test-helper.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - test-helper.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'test-helper.js should pass jshint.');
  });
});
define('alarm-clock/tests/unit/routes/alarms-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:alarms', 'Unit | Route | alarms', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('alarm-clock/tests/unit/routes/alarms-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - unit/routes/alarms-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/alarms-test.js should pass jshint.');
  });
});
define('alarm-clock/tests/unit/routes/edit-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:edit', 'Unit | Route | edit', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('alarm-clock/tests/unit/routes/edit-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - unit/routes/edit-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/edit-test.js should pass jshint.');
  });
});
define('alarm-clock/tests/unit/routes/index-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:index', 'Unit | Route | index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('alarm-clock/tests/unit/routes/index-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - unit/routes/index-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/index-test.js should pass jshint.');
  });
});
define('alarm-clock/tests/unit/routes/new-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:new', 'Unit | Route | new', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('alarm-clock/tests/unit/routes/new-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - unit/routes/new-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/new-test.js should pass jshint.');
  });
});
define('alarm-clock/tests/unit/services/alarms-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('service:alarms', 'Unit | Service | alarms', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var service = this.subject();
    assert.ok(service);
  });
});
define('alarm-clock/tests/unit/services/alarms-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - unit/services/alarms-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/services/alarms-test.js should pass jshint.');
  });
});
define('alarm-clock/tests/unit/services/sound-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('service:sound', 'Unit | Service | sound', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var service = this.subject();
    assert.ok(service);
  });
});
define('alarm-clock/tests/unit/services/sound-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - unit/services/sound-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/services/sound-test.js should pass jshint.');
  });
});
define('alarm-clock/tests/unit/services/time-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('service:time', 'Unit | Service | time', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var service = this.subject();
    assert.ok(service);
  });
});
define('alarm-clock/tests/unit/services/time-test.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - unit/services/time-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/services/time-test.js should pass jshint.');
  });
});
/* jshint ignore:start */

require('alarm-clock/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;

/* jshint ignore:end */
//# sourceMappingURL=tests.map