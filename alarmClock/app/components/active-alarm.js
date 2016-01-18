import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['active-alarm'],

    timeService: Ember.inject.service('time'),

    alarmsService: Ember.inject.service('alarms'),

    soundService: Ember.inject.service('sound'),

    stopped: null,

    doneSnoozing: false,

    alarming: function() {
        let now = this.get('timeService.now');
        let stopped = this.get('stopped');
        if (this.get('doneSnoozing')) {
            return true;
        }
        if (stopped && stopped.getTime() + 61000 >= now.getTime()) {
            return false;
        }
        let weekDays = this.get('timeService.weekDays');
        let today = weekDays[now.getDay()].toLowerCase();
        let alarm = this.get('alarmsService.alarms').filter(function(value) {
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
    }.property('timeService.now', 'stopped', 'doneSnoozing'),

    toggleSound: function() {
        let alarming = this.get('alarming');
        let sound = this.get('soundService');
        let playing = this.get('soundService.playing');
        if (alarming && !playing) {
            sound.play();
            return;
        }
        if (!alarming && playing) {
            sound.stop();
            return;
        }
    }.observes('alarming'),

    actions: {
        snooze() {
            let self = this;
            self.set('doneSnoozing', false);
            let service = self.get('alarmsService');
            service.set('snooze', self.get('timeService.now'));
            Ember.run.later(function() {
                service.set('snooze', null);
                self.set('doneSnoozing', true);
            }, 10 * 60 * 1000);
        },

        stop() {
            this.set('doneSnoozing', false);
            this.set('stopped', this.get('timeService.now'));
        }
    }
});
