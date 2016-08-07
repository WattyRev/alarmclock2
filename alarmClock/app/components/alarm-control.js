import Ember from 'ember';

export default Ember.Component.extend({
    /**
     * A list of classes applied to the component.
     *
     * @property classNames
     * @type {Array}
     */
    classNames: ['alarm-control'],

    /**
     * The timer for determining long and short press.
     *
     * @property touchTimer
     * @type {Timer}
     */
    touchTimer: null,

    /**
     * The nunber of times the person has touched the control.
     *
     * @property touchCount
     * @type {Number}
     */
    touchCount: 0,

    /**
     * The width percentage of the action display.
     *
     * @property widthPercent
     * @type {String}
     */
    widthPercent: Ember.computed('touchCount', function () {
        let count = this.get('touchCount');
        if (!count) {
            return 0;
        }
        return Math.floor(count / 3 * 100) + '%';
    }),

    /**
     * When the user begins touching the screen.
     * Sends longPress after 5 seconds of touching.
     *
     * @method touchStart
     * @return {Void}
     */
    touchStart() {
        let count = this.get('touchCount');

        // Incriment the touch count
        this.set('touchCount', count + 1);

        // Cancel the timer if running
        if (this.get('touchTimer')) {
            Ember.run.cancel(this.get('touchTimer'));

            // If the user touched 3 times, stop the alarm and reset the count
            if (count >=2) {
                Ember.run.later(() => {
                    this.sendAction('stopAlarm');
                    this.set('touchCount', 0);
                }, 150);
                return;
            }
        }

        // After one second, if the user has not touched 3 or more times, snooze the alarm.
        this.set('touchTimer', Ember.run.later(() => {
            this.sendAction('snoozeAlarm');
            this.set('touchCount', 0);
        },  1000));
    }
});
