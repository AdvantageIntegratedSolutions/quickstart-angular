module.exports = {
  name: "QuickStartHeroesVsVillains",
  description: "",
  client: "Advantage",
  username: "kith",
  origin: "https://github.com/AdvantageIntegratedSolutions/quickstart.git",
  authors: ["cjett@advantagequickbase.com", "khensel@advantagequickbase.com"],
  bootstrap: "./app/main.js",
  timezone: "mountain",
  baseConfig: {
    realm: "ais",
    username: "kith",
    async: "promise",
    databaseId: "bkyez3kdm",
    token: "b529p7sb9skfggdddr98jds6gaaa",
    tables: {
      heroes: {
        dbid: "bkyez3kfn",
        rid: 3,
        heroName: 6,
        realName: 7,
        mainPower: 8
      },

      villains: {
        dbid: "bkyez3kjy",
        rid: 3,
        name: 6,
        nemesis: 7,
        mainPower: 8
      }
    }
  }
}