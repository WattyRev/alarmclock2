import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'form',

    time: null,

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
        toggleDay(dayName) {
            dayName = 'selectedDays.' + dayName;
            this.set(dayName, !this.get(dayName));
        }
    },

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

    submit(e) {
        e.preventDefault();
        if (this.isValidTime()) {
            this.sendSubmit();
        }
    }
});
