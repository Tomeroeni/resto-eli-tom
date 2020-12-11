import Vue from 'vue'
import Vuex from 'vuex'
import { db } from '../main'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentList: null,
    gerechten: [],
    lijsten: []
  },
  mutations: {
    CHANGE_LIST (state, payload) {
      state.currentList = payload
    },
    LOAD_LIJSTEN (state, payload) {
      state.lijsten = payload
    },
    LOAD_GERECHTEN (state, payload) {
      state.gerechten = payload
    }
  },
  actions: {
    selectList ({ commit, state }, list) {
      commit('CHANGE_LIST', list)
    },
    createNewList ({ commit, dispatch, state }, naam) {
      db.collection('Lijsten')
        .add({
          naam: naam,
          gerechten: []
        })
        .then(docRef => {
          const list = { id: docRef.id, naam: naam, gerechten: [] }
          dispatch('selectList', list)
          state.lijsten.push(list)
          console.log('Document successfully written!')
        })
        .catch(function (error) {
          console.error('Error writing document: ', error)
        })
    },
    editGerecht ({ commit, state }, gerecht) {
      db.collection('gerechten')
        .doc(gerecht.id)
        .update({
          aantalPersonen: 4,
          ingredienten: gerecht.ingredienten,
          naam: gerecht.naam
        })
      var index = state.gerechten.findIndex(x => x.id === gerecht.id)

      if (index !== -1) {
        state.gerechten[index] = gerecht
      }
    },
    loadGerechtenAndLijsten ({ commit, dispatch, state }) {
      db.collection('Lijsten')
        .get()
        .then((querySnapshot) => {
          const lijsten = []
          querySnapshot.forEach((doc) => {
            const tempList = doc.data()
            tempList.id = doc.id
            lijsten.push(tempList)
          })
          commit('LOAD_LIJSTEN', lijsten)
        })
        .catch(function (error) {
          console.log('Error getting documents: ', error)
        })

      db.collection('gerechten')
        .get()
        .then((querySnapshot) => {
          const gerechten = []
          querySnapshot.forEach((doc) => {
            const tempGerecht = doc.data()
            tempGerecht.id = doc.id
            gerechten.push(tempGerecht)
          })
          commit('LOAD_GERECHTEN', gerechten)
          dispatch('selectList', state.lijsten[0])
        })
        .catch(function (error) {
          console.log('Error getting documents: ', error)
        })
    }
  },
  modules: {
  }
})
