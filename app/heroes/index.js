import HeroesComponent from "./heroes.component";
import HeroService from './hero.service';

angular
  .module('app.heroes', [])

  .config(($stateProvider) => {
    $stateProvider
      .state('app.heroes', {
        url: '/heroes',
        template: "<heroes></heroes>",
        title: 'Heroes'
      })
  })

  .component('heroes', HeroesComponent)