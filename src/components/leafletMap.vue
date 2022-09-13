<template>
  <div id="app" class="leaflet-map">
    <div
      class="quick-menu-back"
      :class="{ 'btnToogle-active': btnToogle, 'btnToogle-action': btnToogleAction }"
    >
      <div class="quick-menu rounded">
        <div class="quick-menu-search">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input
            class=""
            type="search"
            placeholder="Search"
            aria-label="Search"
            v-model="searchText"
          />
        </div>
        <div class="d-flex justify-content-center" v-if="spinnerStatus">
          <div class="spinner-border mt-3" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <ul v-else>
          <li
            v-for="item in tempCoordArray"
            :key="item.id"
            @click="quickMenuSelected(item)"
          >
            <!-- <div class="me-1"><i class="fa-solid fa-location-dot"></i></div> -->
            <div class="me-2 ms-1 route shadow-sm" @click="directions(item)">
              <i class="fa-solid fa-route"></i>
            </div>
            <div class="restaurant-name">{{ item.name }}</div>
            <small>{{ item.country }} street, {{ item.city }}</small>
          </li>
        </ul>
      </div>
      <div class="quick-menu-toggle">
        <button type="button" class="btn btn-dark" @click="btnToogle = !btnToogle">
          <i class="fa-solid fa-angle-right"></i>
        </button>
      </div>
    </div>
    <l-map :zoom="zoom" :center="center">
      <l-tile-layer :url="osmUrl" :attribution="attribution" />
      <l-routing-machine :waypoints="waypoints" v-if="coordArray.length < 1" />
      <div v-if="coordArray.length > 0">
        <l-marker
          :lat-lng="getCoord(item.lat, item.long)"
          v-for="item in coordArray"
          :key="item.id"
        >
          <l-popup>
            <div>{{ item.name }}</div>
          </l-popup>
        </l-marker>
      </div>
    </l-map>
  </div>
</template>

<script>
import { latLng } from "leaflet";
import { LMap, LTileLayer, LMarker, LPopup } from "vue2-leaflet";
import LRoutingMachine from "./LRouting/LRoutingMachine.vue";

const attribution = "Map";
const osmUrl = "http://{s}.tile.osm.org/{z}/{x}/{y}.png";

export default {
  props: ["changedData", "userLocationData"],
  components: { LMap, LTileLayer, LRoutingMachine, LMarker, LPopup },
  data() {
    return {
      zoom: 6,
      center: { lat: 39.925533, lng: 32.866287 },
      osmUrl,
      attribution,
      waypoints: [
        // { lat: 39.925533, lng: 32.866287 },
        // { lat: 37.0, lng: 35.321335 },
      ],
      coordArray: [],
      tempCoordArray: [],
      showPopup: false,
      btnToogle: false,
      btnToogleAction: false,
      spinnerStatus: false,
      searchText: "",
      userDirection: null,
    };
  },
  created() {
    this.coordArray = [];
    var windowParams = window.location.pathname.replace("/", "").split("&");
    if (windowParams.length > 3)
      this.waypoints = [
        { lat: windowParams[0], lng: windowParams[1] },
        { lat: windowParams[2], lng: windowParams[3] },
      ];
  },
  methods: {
    getCoord(a, b) {
      return latLng(a, b);
    },
    zoomUpdate(zoom) {
      this.currentZoom = zoom;
    },
    centerUpdate(center) {
      this.currentCenter = center;
    },
    quickMenuSelected(item) {
      this.center = latLng(item.lat, item.long);
      this.zoom = 14;
    },
    loading(value) {
      this.$emit("search", value);
      this.spinnerStatus = value;
    },

    directions(item) {
      this.userDirection = item;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.setPositionDirections);
      } else {
        this.error = "Geolocation is not supported by this browser.";
        setTimeout(() => {
          this.error = null;
        }, 3000);
      }
    },
    async setPositionDirections(position) {
      var userCity = null;
      await this.$appAxios.get("https://ipapi.co/json").then((x) => {
        userCity = x.data.city;
      });
      this.userPosition = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        city: userCity,
      };
      window.location.href = `${window.location.origin}/${this.userPosition.latitude}&${this.userPosition.longitude}&${this.userDirection.lat}&${this.userDirection.long}`;
    },
  },
  watch: {
    changedData() {
      this.loading(true);
      this.$appAxios
        .get(
          `https://www.nosyapi.com/apiv2/getTurkey?id=84716&city=${this.changedData.country}&country=${this.changedData.district}`
        )
        .then((x) => {
          this.loading(false);
          const data = x.data.data;
          this.coordArray = [];
          data.forEach((element, index) => {
            this.coordArray.push({
              id: index,
              name: element.name,
              city: element.city,
              country: element.country,
              lat: element.latitude,
              long: element.longitude,
            });
          });
          this.tempCoordArray = this.coordArray;
          this.center = { lat: data[0].latitude, lng: data[0].longitude };
          this.showPopup = true;
          this.btnToogle = true;
        });
    },
    userLocationData() {
      this.loading(true);
      this.$appAxios
        .get(
          `https://www.nosyapi.com/apiv2/getTurkey?id=84716&city=${this.userLocationData.city.toLowerCase()}`
        )
        .then((x) => {
          this.loading(false);
          const data = x.data.data;
          this.coordArray = [];
          data.forEach((element, index) => {
            this.coordArray.push({
              id: index,
              name: element.name,
              city: element.city,
              country: element.country,
              lat: element.latitude,
              long: element.longitude,
            });
          });
          this.tempCoordArray = this.coordArray;
        });
      this.center = {
        lat: this.userLocationData.latitude,
        lng: this.userLocationData.longitude,
      };
      this.showPopup = true;
      this.btnToogle = true;
    },
    coordArray() {
      if (this.coordArray.length > 0) this.btnToogleAction = true;
    },
    searchText() {
      this.tempCoordArray = this.coordArray.filter(
        (x) => x.name.toLowerCase().indexOf(this.searchText.toLowerCase()) !== -1
      );
    },
  },
};
</script>

<style>
html,
body,
#app {
  height: 100%;
  margin: 0;
}
</style>
