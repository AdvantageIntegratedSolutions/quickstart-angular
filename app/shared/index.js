import appConfig from '../../config/app.config.js';
import quickbase from './quickbase-client';

angular
  .module('app.shared', [])
  .run($rootScope => {
    let name = appConfig.clientDisplayName;
    $rootScope.clientDisplayName = name ? name : appConfig.client;
    // Logo spec
    $rootScope.appLogo = quickstartConfig.appLogo;
    let alt = $rootScope.appLogo.dashboardAlt;
    $rootScope.appLogo.dashboardAlt = alt ? alt : quickstartConfig.client;
    let icon = $rootScope.appLogo.iconUrl;
    $rootScope.appLogo.iconUrl = icon ? icon : $rootScope.appLogo.dashboardUrl;
  })
  .constant('quickbase', quickbase)