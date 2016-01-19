import Ember from 'ember';

// This file is here because iOS will not play audio unless it is initiated by
// a user interaction. This component forces the user to tap the screen, which
// plays and pauses the sound so that it can be played programatically later.
export default Ember.Component.extend({
    /**
     * A list of classes applied to the component.
     *
     * @property classNames
     * @type {Array}
     */
    classNames: ['prepare-alarm'],

    /**
     * If the audio is prepared.
     *
     * @property
     * @type {}
     */
    prepared: false,

    /**
     * A container for the sound service.
     *
     * @property soundService
     * @type {Service}
     */
    soundService: Ember.inject.service('sound'),

    /**
     * When the user touches the component.
     *
     * @method touchStart
     * @return {Void}
     */
    touchStart() {
        let service = this.get('soundService');
        service.prepare();
        this.set('prepared', true);
    }
});
