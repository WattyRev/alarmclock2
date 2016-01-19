import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['alarm-control'],

    touching: false,

    touchTimer: null,

    touchStart() {
        let self = this;
        self.set('touching', true);
        self.set('touchTimer', Ember.run.later(function() {
            if (!self.get('touching')) {
                console.log('timer ended, but the user is no longer touching the screen.');
                return;
            }
            console.log('timer completed. Sending long press');
            self.set('touching', false);
            self.set('touchTimer', false);
            self.sendAction('longPress');
        }, 5 * 1000));
    },

    touchEnd() {
        this.set('touching', false);
        if (this.get('touchTimer')) {
            console.log('timer is running. cancelling timer and sending short press.');
            Ember.run.cancel(this.get('touchTimer'));
            this.sendAction('shortPress');
        }
    }
});
