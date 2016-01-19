import Ember from 'ember';

export default Ember.Route.extend({
    /**
     * A container for the alarms service.
     *
     * @property alarmsService
     * @type {Service}
     */
    alarmsService: Ember.inject.service('alarms'),

    /**
     * Generates the model for the route.
     *
     * @method model
     * @param {Object} params Dynamic urls parts.
     * @return {Object}
     */
    model(params) {
        let alarm = this.get('alarmsService.alarms').objectAt(params.index);
        let time = alarm.hours + ':';
        if (alarm.minutes > 10) {
            time += alarm.minutes;
        } else {
            time += '0' + alarm.minutes;
        }
        return {
            alarm: alarm,
            time: time,
            index: params.index
        };
    },

    actions: {
        /**
         * Save an alarm.
         *
         * @method saveAlarm
         * @param {Object} alarm The alarm object to save.
         * @return {Void}
         */
        saveAlarm(alarm) {
            let alarms = this.get('alarmsService.alarms');
            let index = this.get('currentModel.index');
            let _alarm = alarms.objectAt(index);
            alarm.isEnabled = _alarm.isEnabled;
            alarms.splice(index, 1);
            alarms.push(alarm);
            this.set('alarmsService.alarms', alarms);
            this.get('alarmsService').saveAlarms();
            this.transitionTo('alarms');
        }
    }
});
