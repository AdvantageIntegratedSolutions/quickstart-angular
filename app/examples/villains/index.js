import VillainsComponent from './villains.component';
import VillainService from './villain.service';

angular
  .module('app.villains', [])
  .component('villains', VillainsComponent)
  .config(($stateProvider) => {
    $stateProvider
      .state('app.villains', {
        url: '/villains',
        template: '<villains></villains>',
        title: 'Villains'
      })
  })