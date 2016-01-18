import Ember from 'ember';

export default Ember.Service.extend({
    playing: false,

    prepare() {
        let self = this;
        self.play();
        Ember.run.next(function() {
            self.stop();
        });
    },

    play() {
        this.set('playing', true);
        Ember.$('audio')[0].play();
    },

    stop() {
        this.set('playing', false);
        Ember.$('audio')[0].pause();
        Ember.$('audio')[0].currentTime = 0;
    }
});
