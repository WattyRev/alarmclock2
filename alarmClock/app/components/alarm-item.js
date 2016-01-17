import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'li',
    classNames: ['alarm-item'],
    alarmsService: Ember.inject.service('alarms'),

    index: function() {
        return this.$().index();
    }.property('alarm'),

    displayHours: function() {
        let hours = this.get('alarm.hours');
        if (hours > 12) {
            hours = hours - 12;
        }
        if (hours === 0) {
            hours = 12;
        }
        return hours;
    }.property('alarm.hours'),

    displayMinutes: function() {
        let minutes = this.get('alarm.minutes');
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        return minutes;
    }.property('alarm.minutes'),

    ampm: function() {
        let hours = this.get('alarm.hours');
        let ampm = 'AM';
        if (hours > 11) {
            ampm = 'PM';
        }
        return ampm;
    }.property('alarm.hours'),

    actions: {
        toggleEnabled() {
            this.set('alarm.isEnabled', !this.get('alarm.isEnabled'));
        },
        delete() {
            let self = this;
            if (self.get('isDeleting')) {
                Ember.run.cancel(self.get('deleteTimer'));
                let index = self.$().index();
                self.sendAction('deleteAlarm', index);
            } else {
                self.set('isDeleting', true);
                self.set('deleteTimer', Ember.run.later(function() {
                    self.set('isDeleting', false);
                }, 500));
            }
        },
        edit() {
            let index = this.$().index();
            this.sendAction('editAlarm', index);
        }
    }
});
