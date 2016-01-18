import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['alarm-control'],

    touching: false,

    touchTimer: null,

    touchStart() {
        let self = this;
        self.set('touching', true);
        self.set('touchTimer', Ember.run.later(function() {
            console.log('run later');
            self.set('touching', false);
            self.set('touchTimer', false);
            self.sendAction('longPress');
        }, 5 * 1000));
    },

    touchEnd() {
        this.set('touching', false);
        if (this.get('touchTimer')) {
            Ember.run.cancel(this.get('touchTimer'));
            this.sendAction('shortPress');
        }
    }
});
