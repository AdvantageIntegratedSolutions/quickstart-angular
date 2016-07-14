//https://angular.io/docs/ts/latest/guide/style-guide.html#!#services

export default class VillainService {
  constructor($q, quickbase) {
    this.$q = $q;
    this.quickbase = quickbase;
  }
}