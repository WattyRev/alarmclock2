import Ember from 'ember';

export default Ember.Component.extend({
    /**
     * A list of classes applied to the component.
     *
     * @property classNames
     * @type {Array}
     */
    classNames: ['clock'],

    /**
     * A container for the time service.
     *
     * @property time
     * @type {Service}
     */
    time: Ember.inject.service('time'),

    /**
     * A container for the alarms service.
     *
     * @property alarms
     * @type {Service}
     */
    alarms: Ember.inject.service('alarms'),

    /**
     * The amount of time remaining (minutes) in the current snooze.
     *
     * @property snooze
     * @type {String}
     */
    snooze: function() {
        if (!this.get('alarms.snooze')) {
            return '';
        }
        let now = Math.ceil(this.get('time.now').getTime() / 60000);
        let snooze = Math.ceil(this.get('alarms.snooze').getTime() / 60000);
        let remaining = (now - snooze - 10) * -1;
        return remaining + 'mins';
    }.property('alarms.snooze', 'time.now'),

    /**
     * The next alarm that will go off in the next 24 hours.
     *
     * @property nextAlarm
     * @type {String}
     */
    nextAlarm: function() {
        let next = this.get('alarms.nextAlarm');
        if (!next || !next.hours) {
            return '';
        }
        let hours = next.hours > 12 ? next.hours - 12 : next.hours;
        if (hours === 0) {
            hours = 12;
        }
        let minutes = next.minutes < 10 ? '0' + next.minutes : next.minutes;
        let ampm = next.hours > 11 ? 'PM' : 'AM';

        return hours + ':' + minutes + ampm;
    }.property('alarms.nextAlarm'),

    actions: {
        /**
         * Cancel the snooze.
         *
         * @method cancelSnooze
         * @return {Void}
         */
        cancelSnooze() {
            this.set('alarms.snooze', null);
        }
    }
});
