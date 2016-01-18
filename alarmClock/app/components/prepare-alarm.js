import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['prepare-alarm'],

    prepared: false,

    soundService: Ember.inject.service('sound'),

    touchStart() {
        let service = this.get('soundService');
        service.prepare();
        this.set('prepared', true);
    }
});
