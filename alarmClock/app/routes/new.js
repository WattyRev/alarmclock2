import Ember from 'ember';

export default Ember.Route.extend({
    /**
     * A container for the alarms service.
     *
     * @property alarms
     * @type {Service}
     */
    alarms: Ember.inject.service('alarms'),

    actions: {
        /**
         * Creates a new alarming.
         *
         * @method createNewAlarm
         * @param {Object} alarm The data to apply to the new alarm
         * @return {Void}
         */
        createNewAlarm(alarm) {
            let alarms = this.get('alarms.alarms');
            alarm.isEnabled = true;
            alarms.push(alarm);
            this.set('alarms.alarms', alarms);
            this.get('alarms').saveAlarms();
            this.transitionToRoute('alarms');
        }
    }
});
