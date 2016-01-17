import Ember from 'ember';

export default Ember.Route.extend({
    alarms: Ember.inject.service('alarms'),
    model() {
        return this.get('alarms.alarms');
    }
});
