import "../tmp/templates";
import "./layout";
import "./shared";

import "./heroes"; //example feature
import "./villains"; //example feature

const DEPENDENCIES = [
  'ui.router',
  'templates',
  'app.layout',
  'app.shared',
  'app.heroes', //example feature
  'app.villains', //example feature
];

angular
  .module('app', DEPENDENCIES)
  .config(($stateProvider, $urlRouterProvider) => {
    $stateProvider
      .state('app', {
        abstract: true,
        templateUrl: 'layout/app-layout.html'
      })

    $urlRouterProvider.otherwise('/heroes');
  })
  .run($rootScope => {
    // Change page title based on state
    $rootScope.$on('$stateChangeSuccess', (event, nextState) => {
      $rootScope.setPageTitle(nextState.title);
    });

    // Helper method for setting the page's title
    $rootScope.setPageTitle = (title) => {
      if (title) {
        $rootScope.pageTitle = title;
      }
    };
  })

angular.bootstrap(document, ['app']);