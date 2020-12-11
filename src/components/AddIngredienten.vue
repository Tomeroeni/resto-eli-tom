<template>
  <div>
      <h1 v-if="!gerecht.id">Geef hier u gerecht in</h1>
      <b-alert
      :show="dismissCountDown"
      dismissible
      variant="success"
      @dismissed="dismissCountDown=0"
      @dismiss-count-down="countDownChanged"
    >
      <p>Succesvol toegevoegd!</p>
      <b-progress
        variant="success"
        :max="dismissSecs"
        :value="dismissCountDown"
        height="4px"
      ></b-progress>
    </b-alert>
    <form ref="gerechtform"  style="position: relative">
      <h3 class="my-4">Naam</h3>
      <input
        type="text"
        class="form-control"
        id="name"
        v-model="gerecht.naam"
        placeholder="Naam gerecht"
      />
      <h3 class="my-4">Aantal personen</h3>
      <input
        type="number"
        class="form-control"
        id="name"
        v-model="gerecht.aantalPersonen"
      />
    <h3 class="my-4">Ingrediënten</h3>
        <div
        v-on:keyup.enter="addIngredient()"
          class="d-flex flex-row justify-content-between"
          v-for="(ingredient, index) in gerecht.ingredienten"
          :key="index"
        >
          <div class="form-group ingredient my-3">
            <small id="hoeveelheidHelp" class="form-text text-muted"
              >Hoeveelheid</small
            >
            <input
              type="number"
              id="hoeveelheid"
              v-model="gerecht.ingredienten[index].hoeveelheid"
              class="form-control"
              :ref="'hoeveelheid'+index"
              placeholder="100"
            />
          </div>

          <div class="form-group ingredient my-3">
            <small id="hoeveelheidHelp" class="form-text text-muted"
              >Eenheid</small
            >
            <input
              type="text"
              id="hoeveelheid"
              v-model="gerecht.ingredienten[index].eenheid"
              class="form-control"
              placeholder="gram"
            />
          </div>

          <div class="form-group ingredient my-3">
            <small id="hoeveelheidHelp" class="form-text text-muted"
              >Ingredient</small
            >
            <input
              type="text"
              id="hoeveelheid"
              v-model="gerecht.ingredienten[index].ingredient"
              class="form-control"
              :placeholder="getPlaceholder(index)"
            />
          </div>

          <button
            type="button"
            class="btn btn-danger minus"
            @click="deleteIngredient(index)"
          >
            <font-awesome-icon :icon="['fas', 'minus']" />
          </button>
        </div>
      <button
        type="button"
        class="btn btn-success"
        @click="addIngredient()"
      >
        <font-awesome-icon :icon="['fas', 'plus']" />
      </button>
            <br />
      <button v-if="!gerecht.id" type="button" @click="addGerecht()" class="btn btn-primary my-4">
        Submit
      </button>
    </form>
  </div>
</template>

<script>
import { db } from '../main'
export default {
  data: function () {
    return {
      gerechtenDb: db.collection('gerechten'),
      placeholders: [
        '3 Eieren',
        'Appels',
        'Sla',
        'Kaas',
        'Chappeluur',
        'Gehakt'
      ],
      dismissSecs: 10,
      dismissCountDown: 0,
      showDismissibleAlert: false

    }
  },
  props: {
    gerecht: {
      Type: Object,
      default: function () {
        return {
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
  },
  methods: {
    defaultGerecht () {
      return {
        naam: null,
        aantalPersonen: 2,
        ingredienten: [{
          eenheid: null,
          hoeveelheid: null,
          ingredient: null
        }]

      }
    },
    addIngredient () {
      this.gerecht.ingredienten.push({
        hoeveelheid: null,
        eenheid: null,
        ingredient: null
      })
      const ref = 'hoeveelheid' + (this.gerecht.ingredienten.length - 1)
      this.$nextTick(() => {
        this.$refs[ref][0].focus()
      })
    },
    deleteIngredient (index) {
      this.gerecht.ingredienten.splice(index, 1)
    },
    getPlaceholder () {
      return this.placeholders[Math.floor(Math.random() * 6)]
    },
    addGerecht () {
      if (this.gerecht.id) {
        this.gerechtenDb
          .doc()
          .update({
            naam: this.gerecht.naam,
            aantalPersonen: this.gerecht.aantalPersonen,
            ingredienten: this.gerecht.ingredienten
          })
          .then(function () {
            console.log('Document successfully written!')
          })
          .catch(function (error) {
            console.error('Error writing document: ', error)
          })
      } else {
        this.gerechtenDb
          .doc()
          .set({
            naam: this.gerecht.naam,
            aantalPersonen: this.gerecht.aantalPersonen,
            ingredienten: this.gerecht.ingredienten
          })
          .then(function () {
            console.log('Document successfully written!')
          })
          .catch(function (error) {
            console.error('Error writing document: ', error)
          })
      }
      this.$refs.gerechtform.reset()
      this.$emit('resetGerecht')
      this.showAlert()
    },
    countDownChanged (dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    showAlert () {
      this.dismissCountDown = this.dismissSecs
    }

  }
}
</script>

<style>
.ingredient {
  width: 30%;
}
.add {
  position: absolute;
  right: 0;
  height: 40px;
}
.minus {
  margin-top: 20px;
    height: 40px;
    align-self: CENTER;
}
</style>
