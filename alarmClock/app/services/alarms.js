import Ember from 'ember';

export default Ember.Service.extend({
    /**
     * The alarms.
     *
     * @property alarms
     * @type {Array}
     */
    alarms: null,

    /**
     * A container for the time service.
     *
     * @property time
     * @type {Service}
     */
    time: Ember.inject.service('time'),

    /**
     * When snooze was started.
     *
     * @property snooze
     * @type {DateTime}
     */
    snooze: null,

    /**
     * The next alarm that will go off within 24 hours.
     *
     * @property nextAlarm
     * @type {Object}
     */
    nextAlarm: function () {
        let alarms = this.get('alarms');
        let time = this.get('time');
        let now = time.get('now');
        let today = time.get('weekDays')[now.getDay()].toLowerCase();
        let tomorrow;
        if (now.getDay() > 5) {
            tomorrow = time.get('weekDays')[0].toLowerCase();
        } else {
            tomorrow = time.get('weekDays')[now.getDay() + 1].toLowerCase();
        }
        if (!alarms.length) {
            return {};
        }
        let filtered = alarms.filter(function (value) {
            let selectedDays = value.selectedDays;

            if (!value.isEnabled) {
                return false;
            }
            if (!selectedDays[today] && !selectedDays[tomorrow]) {
                return false;
            }
            if (selectedDays[today] && value.hours >= now.getHours()) {
                if (value.hours === now.getHours()) {
                    if (!now) {
                        return true;
                    }
                    return value.minutes > now.getMinutes();
                } else {
                    return true;
                }
            }
            if (selectedDays[tomorrow] && value.hours <= now.getHours()) {
                if (value.hours === now.getHours()) {
                    if (!now) {
                        return false;
                    }
                    return value.minutes < now.getMinutes();
                } else {
                    return true;
                }
            }
        });
        filtered.sort(function (a,b) {
            if (a.selectedDays[today] && !b.selectedDays[today]) {
                return 1;
            }
            if (!a.selectedDays[today] && b.selectedDays[today]) {
                return -1;
            }
            if (a.hours < b.hours) {
                return 1;
            }
            if (a.hours > b.hours) {
                return -1;
            }
            if (a.minutes < b.minutes) {
                return 1;
            }
            if (a.minutes > b.minutes) {
                return -1;
            }
        });
        return filtered[0];
    }.property('alarms', 'time.now'),

    /**
     * Save the alarms data to localStorage.
     *
     * @method saveAlarms
     * @return {Void}
     */
    saveAlarms: function () {
        localStorage.alarms = JSON.stringify(this.get('alarms'));
    },

    /**
     * Retrieve the alarms data from localStorage.
     *
     * @method getAlarms
     * @return {Void}
     */
    getAlarms: function () {
        let alarms = localStorage.alarms ? JSON.parse(localStorage.alarms) : [];
        this.set('alarms', alarms);
    }.on('init')

});
