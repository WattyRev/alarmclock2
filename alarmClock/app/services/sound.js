import Ember from 'ember';

export default Ember.Service.extend({
    /**
     * If the sound is currently playing.
     *
     * @property playing
     * @type {Boolean}
     */
    playing: false,

    /**
     * Prepare the audio. Necessary for iOS devices.
     *
     * @method prepare
     * @return {Void}
     */
    prepare() {
        let self = this;
        self.play();
        Ember.run.next(function() {
            self.stop();
        });
    },

    /**
     * Play the sound.
     *
     * @method play
     * @return {Void}
     */
    play() {
        this.set('playing', true);
        Ember.$('audio')[0].play();
    },

    /**
     * Pause and rewind the sound.
     *
     * @method stop
     * @return {Void}
     */
    stop() {
        this.set('playing', false);
        Ember.$('audio')[0].pause();
        Ember.$('audio')[0].currentTime = 0;
    }
});
