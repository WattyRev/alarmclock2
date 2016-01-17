import Ember from 'ember';

export default Ember.Component.extend({
    /**
     * Default tag name applied to the component.
     *
     * @type {String}
     */
    tagName: 'a',

    /**
     * When the touchStart event is sent from the component.
     *
     * @return {Void}
     */
    touchStart() {
        let context = this.container.lookup('controller:application');
        let destination = this.get('destination');
        context.transitionTo(destination);
    }
});
