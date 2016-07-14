//https://angular.io/docs/ts/latest/guide/style-guide.html#!#components

class HeroesCtrl {
  constructor($q, $scope, quickbase) {
    this.$q = $q;
    this.quickbase = quickbase;

    this.all().then(function(heroes){
      $scope.heroes = heroes;
    })
  }

  all(){
    let dfd = this.$q.defer();

    this.quickbase.heroes.all({}).then(function(heroes){
      dfd.resolve(heroes);
    })

    return dfd.promise;
  }
}

export default {
  templateUrl: 'heroes/heroes.component.html',
  controller: HeroesCtrl
}