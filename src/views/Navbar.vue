<template>
  <nav class=" navbar navbar-expand-md navbar-dark bg-dark">
    <div
      class="navbar-collapse collapse w-100 order-1 order-md-0 dual-collapse2"
    >
      <ul class="navbar-nav mr-auto">
        <li class="nav-item">
            <router-link class="nav-link" :class="{ active: routePath === '/' }" to="/">Home</router-link>
        </li>
        <li class="nav-item">
            <router-link class="nav-link" :class="{ active: routePath === '/add' }" to="add">Toevoegen</router-link>
        </li>
        <li class="nav-item">
            <router-link class="nav-link" :class="{ active: routePath === '/lijst' }" to="lijst">Lijst</router-link>
        </li>
      </ul>
    </div>
    <div class="mx-auto order-0">
      <router-link class="navbar-brand mx-auto" to="/">Resto EliTom</router-link>
    </div>
    <div class="navbar-collapse w-100 order-3">
      <ul class="navbar-nav ml-auto mr-5">
        <li class="nav-item ">
          <b-dropdown v-if="currentList" id="dropdown-1" :text="currentList.naam" class="m-md-2">
            <b-dropdown-item v-b-modal="'modal'" >Nieuwe lijst</b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-group id="dropdown-group-1" header="Lijsten">
              <b-dropdown-item v-for="list in lijsten" :key="list.key" @click="selectList(list)">
                <div class="row">
                  <div class="col-8">
                    {{list.naam}}
                  </div>
                  <div class="col-4">
                    <button
                            type="button"
                            class="btn-sm btn-outline-danger"
                            @click="deleteList(list)"
                          >
                      <font-awesome-icon :icon="['fas', 'times']" />
                    </button>
                  </div>
                </div>

              </b-dropdown-item>
            </b-dropdown-group>
          </b-dropdown>
        </li>
      </ul>
    </div>
    <b-modal ok-title = "Toevoegen" cancel-title="Annuleren" @ok="addLijst" id="modal" title="Voeg een nieuwe lijst toe">
      <div>
      <form ref="form" @submit.stop.prevent="handleSubmit">
          <label for="text-naam">Naam</label>
          <b-form-input v-model="naam" type="text" id="text-naam" aria-describedby="naam-help-block"></b-form-input>
            <b-alert
              :show="dismissCountDown"
              dismissible
              variant="warning"
              @dismissed="dismissCountDown=0"
              @dismiss-count-down="countDownChanged"
            >
              <p>Maat ge moet wel iets invullen eh</p>
              <b-progress
                variant="danger"
                :max="dismissSecs"
                :value="dismissCountDown"
                height="4px"
              ></b-progress>
            </b-alert>
        </form>
      </div>
    </b-modal>
  </nav>
</template>

<script>
import { mapState } from 'vuex'
import { db } from '../main'

export default {
  data: function () {
    return {
      naam: '',
      dismissSecs: 10,
      dismissCountDown: 0,
      showDismissibleAlert: false,
      routePath: '/'
    }
  },
  computed: {
    ...mapState(['currentList', 'lijsten']) // assuming you are using namespaced modules

  },
  watch: {
    $route: function (newval, oldval) {
      this.routePath = newval.path
    }
  },
  methods: {
    selectList (list) {
      this.$store.dispatch('selectList', list)
    },
    addLijst (bvModalEvt) {
      bvModalEvt.preventDefault()
      this.handleSubmit()
    },
    deleteList (lijst) {
      db.collection('Lijsten').doc(lijst.id).delete()
      this.$store.state.lijsten.splice(this.$store.state.lijsten.findIndex(x => x.id === lijst.id), 1)
    },
    handleSubmit () {
      // Exit when the form isn't valid
      if (this.naam.length <= 0) {
        this.showAlert()
        return
      }
      this.$store.dispatch('createNewList', this.naam)
      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide('modal')
      })
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
.dropdown>button:focus~.dropdown-menu {
   display: block;
}
</style>
