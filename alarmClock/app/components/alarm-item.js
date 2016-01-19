import Ember from 'ember';

export default Ember.Component.extend({
    /**
     * The tag name used for the component.
     *
     * @property tagName
     * @type {String}
     */
    tagName: 'li',

    /**
     * The class names applied to the component.
     *
     * @property classNames
     * @type {Array}
     */
    classNames: ['alarm-item'],

    /**
     * A container for the alarms service.
     *
     * @property alarmsService
     * @type {Service}
     */
    alarmsService: Ember.inject.service('alarms'),

    /**
     * The index of the current item.
     *
     * @property index
     * @type {Number}
     */
    index: function() {
        return this.$().index();
    }.property('alarm'),

    /**
     * The hours that are displayed to the user.
     *
     * @property displayHours
     * @type {Number}
     */
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

    /**
     * The minutes that are displayed to the user.
     *
     * @property displayMinutes
     * @type {String|Number}
     */
    displayMinutes: function() {
        let minutes = this.get('alarm.minutes');
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        return minutes;
    }.property('alarm.minutes'),

    /**
     * Displays AM or PM depending on the time.
     *
     * @property ampm
     * @type {String}
     */
    ampm: function() {
        let hours = this.get('alarm.hours');
        let ampm = 'AM';
        if (hours > 11) {
            ampm = 'PM';
        }
        return ampm;
    }.property('alarm.hours'),

    actions: {
        /**
         * Toggle if an alarm is enabled.
         *
         * @method toggleEnabled
         * @return {Void}
         */
        toggleEnabled() {
            this.set('alarm.isEnabled', !this.get('alarm.isEnabled'));
            this.get('alarmsService').saveAlarms();
        },

        /**
         * Deletes an alarm.
         *
         * @method delete
         * @return {Void}
         */
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

        /**
         * Go to the editing page for an alarm.
         *
         * @method edit
         * @return {Void}
         */
        edit() {
            let index = this.$().index();
            this.sendAction('editAlarm', index);
        }
    }
});
