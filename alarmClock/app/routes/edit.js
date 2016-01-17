import Ember from 'ember';

export default Ember.Route.extend({
    alarmsService: Ember.inject.service('alarms'),

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
