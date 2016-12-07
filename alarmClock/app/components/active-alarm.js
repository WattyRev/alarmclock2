import Ember from 'ember';

export default Ember.Component.extend({
    /**
     * The classes that are applied to the Component.
     *
     * @property classNames
     * @type {array}
     */
    classNames: ['active-alarm'],

    /**
     * A container for the time service.
     *
     * @property timeService
     * @type {Service}
     */
    timeService: Ember.inject.service('time'),

    /**
     * A container for the alarms service.
     *
     * @property alarmsService
     * @type {Service}
     */
    alarmsService: Ember.inject.service('alarms'),

    /**
     * A container for the sound service.
     *
     * @property soundService
     * @type {Service}
     */
    soundService: Ember.inject.service('sound'),

    /**
     * When the alarm was last stopped.
     *
     * @property stopped
     * @type {DateTime}
     */
    stopped: null,

    /**
     * If snoozing has completed.
     *
     * @property doneSnoozing
     * @type {Boolean}
     */
    doneSnoozing: false,

    /**
     * If the alarm should currently be activated.
     *
     * @property alarming
     * @type {Boolean}
     */
    alarming: Ember.computed('timeService.now', 'stopped', 'doneSnoozing', function () {
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
        let alarm = this.get('alarmsService.alarms').filter(function (value) {
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
    }),

    /**
     * Toggles the playing of the alarm sound.
     *
     * @method toggleSound
     * @return {Void}
     */
    toggleSound: function () {
        let alarming = this.get('alarming');
        let sound = this.get('soundService');
        let playing = this.get('soundService.playing');
        if (alarming && !playing) {
            if (!sound) {
                return;
            }
            sound.play();
            return;
        }
        if (!alarming && playing) {
            sound.stop();
            return;
        }
    }.observes('alarming'),

    actions: {
        /**
         * Trigger snoozing.
         *
         * @method snooze
         * @return {Void}
         */
        snooze() {
            this.set('doneSnoozing', false);
            let service = this.get('alarmsService');
            service.set('snooze', this.get('timeService.now'));
            this.set('stopped', this.get('timeService.now'));
            Ember.run.later(() => {
                if (this.get('isDestroyed')) {
                    return;
                }
                service.set('snooze', null);
                this.set('doneSnoozing', true);
            }, 10 * 60 * 1000);
        },

        /**
         * Stop the alarm.
         *
         * @method stop
         * @return {Void}
         */
        stop() {
            this.set('doneSnoozing', false);
            this.set('stopped', this.get('timeService.now'));
        }
    }
});
