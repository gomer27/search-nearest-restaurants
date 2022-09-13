<template>
  <div id="app">
    <top-head
      @onChance="onChance"
      :searchData="searchData"
      @userLocation="userLocation"
    />
    <leaflet-map
      :changedData="changedData"
      @search="search"
      :userLocationData="userLocationData"
    />
  </div>
</template>

<script>
import head from "./components/head.vue";
import leafletMap from "./components/leafletMap.vue";

export default {
  data() {
    return {
      changedData: null,
      searchData: null,
      userLocationData: null,
    };
  },
  components: {
    "top-head": head,
    leafletMap,
  },
  methods: {
    onChance(value) {
      this.changedData = value;
    },
    userLocation(value) {
      this.userLocationData = value;
    },
    search(value) {
      this.searchData = value;
    },
  },
};
</script>

<style scoped></style>
