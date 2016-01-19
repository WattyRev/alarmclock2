import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';
import wait from 'ember-test-helpers/wait';

moduleForComponent('active-alarm', 'Integration | Component | active alarm', {
  integration: true
});

function copyObject(obj) {
    return JSON.parse(JSON.stringify(obj));
}
var timeService = {
    now: {
        getDay: function() {
            return 0;
        },
        getHours: function() {
            return 1;
        },
        getMinutes: function() {
            return 2;
        },
        getTime: function() {
            return 100;
        }
    },
    weekDays: [
        'Today'
    ]
};
var alarmsService = {
    alarms: [
        {
            isEnabled: true,
            selectedDays: {
                today: true
            },
            hours: 1,
            minutes: 2
        }
    ]
};

test('it should render if the alarm is going off.', function(assert) {
    assert.expect(1);
    this.set('alarming', true);
    this.render(hbs`{{active-alarm alarming=alarming}}`);
    assert.equal(this.$('.alarm-control').length, 1);
});

test('it should not render if the alarm is not going off', function(assert){
    assert.expect(1);
    this.set('alarming', false);
    this.render(hbs`{{active-alarm alarming=alarming}}`);
    assert.equal(this.$('.alarm-control').length, 0);
});

test('it should render if snoozing has completed', function(assert){
    assert.expect(1);
    this.set('doneSnoozing', true);
    this.render(hbs`{{active-alarm doneSnoozing=doneSnoozing}}`);
    assert.equal(this.$('.alarm-control').length, 1);
});

test('it should render if there is an alarm for the current time.', function(assert){
    assert.expect(1);
    this.set('timeService', timeService);
    this.set('alarmsService', alarmsService);

    this.render(hbs`{{active-alarm timeService=timeService alarmsService=alarmsService}}`);

    assert.equal(this.$('.alarm-control').length, 1);
});

test('it should not render if there is no relevant alarm', function(assert){
    assert.expect(5);

    var alarms = copyObject(alarmsService);
    alarms.alarms[0].isEnabled = false;
    this.set('alarmsService', alarms);
    this.set('timeService', timeService);

    this.render(hbs`{{active-alarm timeService=timeService alarmsService=alarmsService}}`);
    assert.equal(this.$('.alarm-control').length, 0);

    alarms = copyObject(alarmsService);
    alarms.alarms[0].selectedDays.today = false;
    this.set('alarmsService', alarms);
    this.render(hbs`{{active-alarm timeService=timeService alarmsService=alarmsService}}`);
    assert.equal(this.$('.alarm-control').length, 0);

    alarms = copyObject(alarmsService);
    alarms.alarms[0].hours = 5;
    this.set('alarmsService', alarms);
    this.render(hbs`{{active-alarm timeService=timeService alarmsService=alarmsService}}`);
    assert.equal(this.$('.alarm-control').length, 0);

    alarms = copyObject(alarmsService);
    alarms.alarms[0].minutes = 5;
    this.set('alarmsService', alarms);
    this.render(hbs`{{active-alarm timeService=timeService alarmsService=alarmsService}}`);
    assert.equal(this.$('.alarm-control').length, 0);

    alarms = copyObject(alarmsService);
    alarms.alarms = [];
    this.set('alarmsService', alarms);
    this.render(hbs`{{active-alarm timeService=timeService alarmsService=alarmsService}}`);
    assert.equal(this.$('.alarm-control').length, 0);
});

test('it should not render if the alarm was stopped recently', function(assert){
    assert.expect(1);

    this.set('timeService', timeService);
    this.set('alarmsService', alarmsService);
    this.set('stopped', {
        getTime: function() {
            return 0;
        }
    });
    this.render(hbs`{{active-alarm timeService=timeService alarmsService=alarmsService stopped=stopped}}`);
    assert.equal(this.$('.alarm-control').length, 0);
});


test('the sound should play if the alarm is going off', function(assert){
    assert.expect(1);

    var playing = false;
    this.set('soundService', {
        playing: false,
        play: function() {
            playing = true;
        },
        stop: function() {
            playing = false;
        }
    });
    this.set('alarming', false);

    this.render(hbs`{{active-alarm soundService=soundService alarming=alarming}}`);

    this.set('alarming', true);

    return new Ember.RSVP.Promise(function(resolve) {
        Ember.run.later(function() {
            resolve();
        }, 10);
    }).then(function() {
        assert.equal(playing, true);
    });
});

test('the sound should not play if the alarm is not going off', function(assert){
    assert.expect(1);

    var playing = true;
    this.set('soundService', {
        playing: true,
        play: function() {
            console.log('play');
            playing = true;
        },
        stop: function() {
            playing = false;
        }
    });
    this.set('alarming', true);

    this.render(hbs`{{active-alarm soundService=soundService alarming=alarming}}`);

    this.set('alarming', false);

    return new Ember.RSVP.Promise(function(resolve) {
        Ember.run.later(function() {
            resolve();
        }, 10);
    }).then(function() {
        assert.equal(playing, false);
    });
});
