<template>
  <div v-if="currentList">
    <b-table striped hover :items="getTableData" :fields="fields"></b-table>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data: () => {
    return {
      fields: ['naam', 'eenheid', 'hoeveelheid']

    }
  },
  computed: {
    ...mapState(['gerechten', 'currentList']),
    getTableData () {
      console.log('ayek', this.currentList)
      if (this.currentList === undefined) {
        return []
      }
      const tableData = []
      this.currentList.gerechten.forEach(gerecht => {
        console.log(gerecht.ingredienten)
        gerecht.ingredienten.forEach(ingredient => {
          const index = tableData.findIndex(x => x.naam === ingredient.ingredient)
          if (index >= 0) {
            const tableIngr = tableData[index]
            tableIngr.hoeveelheid = (parseFloat(ingredient.hoeveelheid) / parseFloat(gerecht.aantalPersonen)) * parseFloat(gerecht.selectedAantalPersonen)
          } else {
            const tableIngr = {
              naam: ingredient.ingredient,
              eenheid: ingredient.eenheid,
              hoeveelheid: (parseFloat(ingredient.hoeveelheid) / parseFloat(gerecht.aantalPersonen)) * parseFloat(gerecht.selectedAantalPersonen)
            }
            tableData.push(tableIngr)
          }
        })
      })
      return tableData
    }
  },
  methods: {
    createTableData () {
    }
  }

}
</script>

<style>
</style>
