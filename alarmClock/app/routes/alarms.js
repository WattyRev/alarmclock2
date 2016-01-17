import Ember from 'ember';

export default Ember.Route.extend({
    alarms: Ember.inject.service('alarms'),
    model() {
        return this.get('alarms.alarms');
    },
    actions: {
        deleteAlarm(index) {
            let service = this.get('alarms');
            service.get('alarms').removeAt(index);
            service.saveAlarms();
        },
        editAlarm(index) {
            this.transitionTo('edit', index);
        }
    }
});
