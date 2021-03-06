class VillainsCtrl {
  constructor($q, $scope, quickbase) {
    this.$q = $q;
    this.quickbase = quickbase;

    this.all().then(function(villains){
      $scope.villains = villains;
    })
  }

  all(){
    let dfd = this.$q.defer();

    this.quickbase.villains.all({}).then(function(villains){
      dfd.resolve(villains);
    })

    return dfd.promise;
  }
}

export default {
  bindings: { score: '=' },
  templateUrl: 'examples/villains/villains.component.html',
  controller: VillainsCtrl
}