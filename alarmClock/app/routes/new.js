import Ember from 'ember';

export default Ember.Route.extend({
    alarms: Ember.inject.service('alarms'),

    actions: {
        createNewAlarm(alarm) {
            let alarms = this.get('alarms.alarms');
            alarm.isEnabled = true;
            alarms.push(alarm);
            this.set('alarms.alarms', alarms);
            this.get('alarms').saveAlarms();
            this.transitionTo('alarms');
        }
    }
});
