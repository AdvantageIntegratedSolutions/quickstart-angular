import appConfig from '../../config/app.config.js';
import quickbase from './quickbase-client';

angular
  .module('app.shared', [])
  .run($rootScope => {
    $rootScope.clientDisplayName = appConfig.client;
  })
  .constant('quickbase', quickbase)