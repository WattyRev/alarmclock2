import Ember from 'ember';

export default Ember.Component.extend({
    time: Ember.inject.service('time'),
    classNames: 'clock',
});
