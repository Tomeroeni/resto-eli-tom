<template>
  <div class="m-5">
      <AddIngredienten :gerecht="gerecht" ref="AddIngredientenComponent" @resetGerecht="resetGerecht"/>
  </div>
</template>

<script>
export default {
  components: {
    AddIngredienten: () => import('../components/AddIngredienten')
  },
  data: function () {
    return {
      gerecht: {
        naam: null,
        aantalPersonen: 2,
        ingredienten: [{
          eenheid: null,
          hoeveelheid: null,
          ingredient: null
        }]
      }
    }
  },
  methods: {
    resetGerecht () {
      this.gerecht = {
        naam: null,
        aantalPersonen: 2,
        ingredienten: [{
          eenheid: null,
          hoeveelheid: null,
          ingredient: null
        }]
      }
    }
  }
}
</script>

<style>

</style>
