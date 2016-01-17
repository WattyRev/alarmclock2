import Ember from 'ember';

export default Ember.Service.extend({
    alarms: null,

    saveAlarms: function() {
        localStorage.alarms = JSON.stringify(this.get('alarms'));
    },

    getAlarms: function() {
        let alarms = localStorage.alarms ? JSON.parse(localStorage.alarms) : [];
        this.set('alarms', alarms);
    }.on('init')
});
