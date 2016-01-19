import Ember from 'ember';

export default Ember.Service.extend({
    /**
     * The current time.
     *
     * @property time
     * @type {DateTime}
     */
    now: new Date(),

    /**
     * The current time displayed in hh:mm<small>a</small>.
     *
     * @property time
     * @type {String}
     */
    time: function() {
        let now = this.get('now');
        let hours = 0;
        let minutes = 0;
        if (now) {
            hours = now.getHours();
            minutes = now.getMinutes();
        }
        let ampm = hours > 11 ? 'PM' : 'AM';

        if (hours > 12) {
            hours = hours - 12;
        } else if (hours === 0) {
            hours = 12;
        }
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        return hours + ':' + minutes + '<small>' + ampm + '</small>';
    }.property('now'),

    /**
     * The current date displayed as D, M d, Y.
     *
     * @property date
     * @type {String}
     */
    date: function() {
        let now = this.get('now'),
            weekDays = this.get('weekDays'),
            months = this.get('months'),
            day = weekDays[now.getDay()],
            month = months[now.getMonth()],
            date = now.getDate(),
            year = now.getFullYear();

        return day + ', ' + month + ' ' + date + ', ' + year;
    }.property('now'),

    /**
     * The possible weekdays.
     *
     * @property weekDays
     * @type {Array}
     */
    weekDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

    /**
     * The possible month names.
     *
     * @property months
     * @type {Array}
     */
    months: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'November',
        'December'
    ],

    /**
     * Set a timer to set the time next.
     *
     * @method setTimer
     * @param {Number} seconds The number of seconds to set the timer for.
     * @return {Void}
     */
    setTimer(seconds) {
        let self = this;
        Ember.run.later(function() {
            self.setTime();
        }, seconds * 1000);
    },

    /**
     * Set the current time.
     *
     * @method setTime
     * @return {Void}
     */
    setTime: function() {
        let _now = this.get('now');
        let past = 0;
        let now = 0;
        if (_now) {
            past = _now.getMinutes();
            now = _now.getMinutes();
            this.set('now', new Date());
        }
        if (past !== now) {
            this.setTimer(60);
        } else {
            this.setTimer(1);
        }
    }.on('init')
});
