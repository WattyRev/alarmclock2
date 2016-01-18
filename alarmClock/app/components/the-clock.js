import Ember from 'ember';

export default Ember.Component.extend({
    time: Ember.inject.service('time'),
    classNames: 'clock',
    alarms: Ember.inject.service('alarms'),

    snooze: function() {
        if (!this.get('alarms.snooze')) {
            return '';
        }
        let now = Math.round(this.get('time.now').getTime() / 60000);
        let snooze = Math.round(this.get('alarms.snooze').getTime() / 60000);
        let remaining = (now - snooze - 10) * -1;
        return remaining + 'mins';
    }.property('alarms.snooze', 'time.now'),

    nextAlarm: function() {
        let next = this.get('alarms.nextAlarm');
        if (!next) {
            return '';
        }
        let hours = next.hours > 12 ? next.hours - 12 : next.hours;
        if (hours === 0) {
            hours = 12;
        }
        let minutes = next.minutes < 10 ? '0' + next.minutes : next.minutes;
        let ampm = next.hours > 11 ? 'PM' : 'AM';

        return hours + ':' + minutes + ampm;
    }.property('alarms.nextAlarm')
});
