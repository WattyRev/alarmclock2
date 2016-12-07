import Ember from 'ember';

export default Ember.Route.extend({
    /**
     * A container for the alarms service.
     *
     * @property alarms
     * @type {Service}
     */
    alarms: Ember.inject.service('alarms'),

    /**
     * Generates the route's model.
     *
     * @method model
     * @return {Array}
     */
    model() {
        return this.get('alarms.alarms');
    },

    actions: {
        /**
         * Delete an alarm.
         *
         * @method deleteAlarm
         * @param {Number} index The index of the alarm to remove.
         * @return {Void}
         */
        deleteAlarm(index) {
            let service = this.get('alarms');
            service.get('alarms').removeAt(index);
            service.saveAlarms();
        },
        /**
         * Edit an alarm.
         *
         * @method editAlarm
         * @param {Number} index The index of the alarm to edit.
         * @return {Void}
         */
        editAlarm(index) {
            this.transitionTo('edit', index);
        }
    }
});
