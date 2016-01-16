import Ember from 'ember';

export default Ember.Service.extend({
    now: new Date(),

    time: function() {
        let now = this.get('now'),
            hours = now.getHours(),
            minutes = now.getMinutes(),
            ampm = hours > 11 ? 'PM' : 'AM';

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

    weekDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

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

    setTimer() {
        let self = this;
        Ember.run.later(function() {
            self.setTime();
        }, 1000);
    },

    setTime: function() {
        this.set('now', new Date());
        this.setTimer();
    }.on('init')
});
