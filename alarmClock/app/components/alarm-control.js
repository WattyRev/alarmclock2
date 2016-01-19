import Ember from 'ember';

export default Ember.Component.extend({
    /**
     * A list of classes applied to the component.
     *
     * @property classNames
     * @type {Array}
     */
    classNames: ['alarm-control'],

    /**
     * If the user is currently touching the screen.
     *
     * @property touching
     * @type {Boolean}
     */
    touching: false,

    /**
     * The timer for determining long and short press.
     *
     * @property touchTimer
     * @type {Timer}
     */
    touchTimer: null,

    /**
     * When the user begins touching the screen.
     * Sends longPress after 5 seconds of touching.
     *
     * @method touchStart
     * @return {Void}
     */
    touchStart() {
        let self = this;
        self.set('touching', true);
        self.set('touchTimer', Ember.run.later(function() {
            if (!self.get('touching')) {
                return;
            }
            self.set('touching', false);
            self.set('touchTimer', false);
            self.sendAction('longPress');
        }, 5 * 1000));
    },

    /**
     * When the user stoppes touching the screen.
     * Sends shortPress and cancels the touchTimer.
     *
     * @method touchEnd
     * @return {Void}
     */
    touchEnd() {
        this.set('touching', false);
        if (this.get('touchTimer')) {
            Ember.run.cancel(this.get('touchTimer'));
            this.sendAction('shortPress');
        }
    }
});
