import appConfig from '../../config/app.config.js';
import Header from './header.component';

angular
  .module('app.layout', [])
  .run($rootScope => {
    let name = appConfig.clientDisplayName;
    $rootScope.clientDisplayName = name ? name : appConfig.client;

    $rootScope.appLogo = appConfig.appLogo;

    let alt = $rootScope.appLogo.dashboardAlt;
    $rootScope.appLogo.dashboardAlt = alt ? alt : appConfig.client;

    let icon = $rootScope.appLogo.iconUrl;
    $rootScope.appLogo.iconUrl = icon ? icon : $rootScope.appLogo.dashboardUrl;
  })
  .component('appHeader', Header)