<template>
  <div class="m-5">
    <div>
      <h1>Gerechten</h1>

      <div class="container form-group row justify-content-between">
        <div class="form-group w-25">
          <label for="staticEmail" class="col-form-label"
            >Aantal personen</label
          >
          <b-form-input
            type="number"
            id="aantal personen"
            v-model="selectedAantalPersonen"
            class="d-inline-block form-control"
            placeholder="2"
          />
        </div>
        <div class="form-group w-50">
          <label for="staticEmail" class="col-form-label">Zoek</label>
          <b-form-input
            type="text"
            id="search"
            v-model="search"
            class="form-control"
            placeholder="zoek iets"
          />
        </div>
        <div class="d-flex mt-5">
            <label for="switch_1">Enkel lijst</label>
            <b-form-checkbox id="switch_1" v-model="enkelLijst" switch class="ml-2"></b-form-checkbox>
        </div>
      </div>
    </div>
    <table class="table">
      <thead class="thead-dark">
        <tr>
          <th scope="col">#</th>
          <th scope="col">Naam</th>
          <th scope="col">Ingrediënten</th>
          <th scope="col" class="center">Acties</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(gerecht, index) in filteredGerechten"
          :key="index"
          @click="selectedGerecht = gerecht"
        >
          <th scope="row">{{index+1}}</th>
          <td>{{ gerecht.naam }}</td>
          <td>
            <ul>
              <li
                v-for="(ingredient, index) in gerecht.ingredienten"
                :key="index"
              >
                {{ formatIngredient(gerecht.aantalPersonen, ingredient) }}
              </li>
            </ul>
          </td>
          <td class="center">
            <button
              type="button"
              class="btn btn-warning mr-1"
              @click="editedGerecht=gerecht"
              v-b-modal="'edit-modal'"
            >
              <font-awesome-icon :icon="['fas', 'edit']" />
            </button>
            <button
              v-if="!gerechtenInCurrentLijstIds.includes(gerecht.id)"
              type="button"
              class="btn btn-success "
              @click="triggerAddGerecht(gerecht)"
            >
              <font-awesome-icon :icon="['fas', 'plus']" />
            </button>
            <button
              v-else
              type="button"
              class="btn btn-danger "
              @click="deleteGerechtFromList(gerecht)"
            >
              <font-awesome-icon :icon="['fas', 'minus']" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <b-modal size="xl" ok-title = "Wijzig" cancel-title="Annuleren" @ok="editGerecht(editedGerecht)" id="edit-modal" >
      <template slot="modal-title">
        <h1 >Wijzig gerecht</h1>
      </template>
      <template #modal-footer="{ ok, cancel }">
        <b-button @click="cancel()">
          Cancel
        </b-button>
        <b-button variant="danger" @click="triggerConfirmation()">
          Verwijder
        </b-button>
        <b-button variant="primary" @click="ok()">
          Wijzig
        </b-button>

      </template>
      <div>
        <form ref="form" @submit.stop.prevent="">
           <AddIngredienten :gerecht="editedGerecht" ref="AddIngredientenComponent" @resetGerecht="resetGerecht"/>
        </form>
      </div>
    </b-modal>
      <b-modal id="confirmation" title="Verwijderen gerecht" @ok="deleteGerecht">
        <p class="my-4">Ben je zeker dat je dit wil verwijderen?</p>
      </b-modal>
    <b-modal ok-title = "Toevoegen" cancel-title="Annuleren" @ok="addGerechtToList()" id="addGerecht" title="Hoeveel personen">
      <div>
      <form ref="form" @submit.stop.prevent="handleSubmit">
          <label for="text-naam">Aantal personen</label>
          <b-form-input v-model="addedGerecht.selectedAantalPersonen" type="text" id="text-naam" aria-describedby="naam-help-block"></b-form-input>
        </form>
      </div>
    </b-modal>
  </div>
</template>

<script>
// @ is an alias to /src
import { db, fv } from '../main'
import { mapState } from 'vuex'

export default {
  name: 'Home',
  components: {
    AddIngredienten: () => import('../components/AddIngredienten')
  },
  data: function () {
    return {
      listDb: db.collection('Lijsten'),
      selectedGerecht: null,
      selectedAantalPersonen: 2,
      search: '',
      enkelLijst: false,
      editedGerecht: {},
      addedGerecht: {}
    }
  },
  created () {
    this.$store.dispatch('loadGerechtenAndLijsten')
  },
  computed: {
    ...mapState(['gerechten', 'currentList']),
    filteredGerechten () {
      if (this.enkelLijst) {
        return this.currentListGerechten.filter((x) => {
          return x.naam.toLowerCase().includes(this.search.toLowerCase())
        })
      }
      return this.gerechten.filter((x) => {
        return x.naam.toLowerCase().includes(this.search.toLowerCase())
      })
    },
    gerechtenInCurrentLijstIds () {
      return this.currentList.gerechten.map(x => x.id)
    },
    currentListGerechten () {
      return this.currentList.gerechten
    }
  },
  methods: {
    formatIngredient (aantalPersonen, ingredient) {
      return (
        (ingredient.hoeveelheid / aantalPersonen) *
          this.selectedAantalPersonen +
        ' ' +
        ingredient.eenheid +
        ' ' +
        ingredient.ingredient
      )
    },
    editGerecht (gerecht) {
      this.$store.dispatch('editGerecht', gerecht)
    },
    addGerechtToList () {
      this.listDb
        .doc(this.currentList.id)
        .update({
          gerechten: fv.arrayUnion(this.addedGerecht)
        })
        .then(() => {
          const tempGerechten = this.currentList.gerechten
          tempGerechten.push(this.addedGerecht)
          console.log('Document successfully written!')
        })
        .catch(function (error) {
          console.error('Error writing document: ', error)
        })
    },
    deleteGerechtFromList (gerecht) {
      this.listDb
        .doc(this.currentList.id)
        .update({
          gerechten: fv.arrayRemove(gerecht.id)
        })
        .then(() => {
          this.currentList.gerechten.splice(this.currentList.gerechten.findIndex(x => x.id === gerecht.id), 1)
          console.log('Document successfully written!')
        })
        .catch(function (error) {
          console.error('Error writing document: ', error)
        })
    },
    resetGerecht () {
      this.editedGerecht = {
        naam: null,
        aantalPersonen: 2,
        ingredienten: [{
          eenheid: null,
          hoeveelheid: null,
          ingredient: null
        }]
      }
    },
    deleteGerecht () {
      db.collection('gerechten').doc(this.editedGerecht.id).delete()
      var index = this.gerechten.findIndex(x => x.id === (this.editedGerecht.id))
      this.gerechten.splice(index, 1)
      this.$bvModal.hide('edit-modal')
    },
    triggerConfirmation () {
      this.$bvModal.show('confirmation')
    },
    triggerAddGerecht (gerecht) {
      this.addedGerecht = gerecht
      this.$bvModal.show('addGerecht')
    }
  }
}
</script>

<style>
.center {
   text-align: center !important;
}
@media (min-width: 992px){
 .modal-lg {
    max-width: auto !important;
   }
}

@media (min-width: 576px){
  .modal-dialog {
    max-width: auto !important;
  }
}
</style>
