export default class HeroService {
  constructor($q, quickbase) {
    this.$q = $q;
    this.quickbase = quickbase;
  }
}