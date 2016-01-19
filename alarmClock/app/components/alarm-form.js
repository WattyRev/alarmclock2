import Ember from 'ember';

export default Ember.Component.extend({
    /**
     * The tag used for the Component.
     *
     * @property tagName
     * @type {String}
     */
    tagName: 'form',

    /**
     * The value of the time input.
     * Expects a value of (N)N:NN.
     * No validation because I don't care.
     *
     * @property time
     * @type {String}
     */
    time: null,

    /**
     * What days the user has selected to enable the alarm on.
     *
     * @property selectedDays
     * @type {Object}
     */
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
        /**
         * Toggle the selection of a given day.
         *
         * @method toggleDay
         * @return {Void}
         */
        toggleDay(dayName) {
            dayName = 'selectedDays.' + dayName;
            this.set(dayName, !this.get(dayName));
        }
    },

    /**
     * Check if a provided time is valid.
     *
     * @method isValidTime
     * @return {Boolean}
     */
    isValidTime() {
        let time = this.get('time');
        if (!time) {
            return false;
        }
        time = time.split(':');
        if (time.length !== 2) {
            return false;
        }
        time.map(function(value) {
            return parseInt(value);
        });
        if (time[0] < 0 || time[0] > 23 || time[1] < 0 || time[1] > 59) {
            return false;
        }
        return true;
    },

    /**
     * Sends submission to the parent context.
     *
     * @method sendSubmit
     * @return {Void}
     */
    sendSubmit() {
        let alarm = {};

        let time = this.get('time').split(':').map(function(value) {
            return parseInt(value);
        });
        alarm.hours = time[0];
        alarm.minutes = time[1];
        alarm.selectedDays = this.get('selectedDays');
        this.sendAction('save', alarm);
    },

    /**
     * When the user submits the form.
     *
     * @method submit
     * @param {Event} e submit event
     * @return {Void}
     */
    submit(e) {
        e.preventDefault();
        if (this.isValidTime()) {
            this.sendSubmit();
        }
    }
});
