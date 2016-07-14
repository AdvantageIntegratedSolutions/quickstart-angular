//https://angular.io/docs/ts/latest/guide/style-guide.html#!#services

export default class HeroService {
  constructor($q, quickbase) {
    this.$q = $q;
    this.quickbase = quickbase;
  }
}