import Ember from 'ember';

export default Ember.Component.extend({
    time: Ember.inject.service('time'),
    classNames: 'clock',
    alarms: Ember.inject.service('alarms'),

    nextAlarm: function() {
        let next = this.get('alarms.nextAlarm');
        let hours = next.hours > 12 ? next.hours - 12 : next.hours;
        if (hours === 0) {
            hours = 12;
        }
        let minutes = next.minutes < 10 ? '0' + next.minutes : next.minutes;
        let ampm = next.hours > 11 ? 'PM' : 'AM';

        return hours + ':' + minutes + ampm;
    }.property('alarms.nextAlarm')
});
