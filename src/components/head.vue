<template>
  <div class="head">
    <div class="search-restaurant">
      <h1>Search Nearest Restaurants</h1>
      <div class="d-flex">
        <button
          type="button"
          class="btn btn-light hint--bottom me-2"
          aria-label="Select with your location"
          @click="getLocation"
        >
          <i class="fa-solid fa-location-dot"></i>
        </button>
        <div class="hint--bottom" aria-label="Select country">
          <select class="form-select me-1" @change="selectCountryOnChange">
            <option selected>Country</option>
            <option
              v-for="item in countryData"
              :key="item.cityName"
              :value="item.citySlug"
            >
              {{ item.cityName }}
            </option>
          </select>
        </div>
        <div class="hint--bottom" aria-label="Select district">
          <select
            class="form-select"
            @change="selectDistrictOnChange"
            :disabled="districtStatus"
          >
            <option selected>District</option>
            <option
              v-for="item in districtData"
              :key="item.cityName"
              :value="item.citySlug"
            >
              {{ item.cityName }}
            </option>
          </select>
        </div>
      </div>
      <div class="d-flex justify-content-center" v-if="spinnerStatus">
        <div class="spinner-border mt-3" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <div class="d-flex justify-content-center text-danger mt-4" v-if="error">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["searchData"],
  data() {
    return {
      countryData: null,
      selectedCountry: null,
      districtData: null,
      searchText: "",
      spinnerStatus: false,
      districtStatus: true,
      userPosition: {},
      error: null,
    };
  },
  created() {
    this.getCountry();
  },
  methods: {
    getCountry() {
      this.spinnerStatus = true;
      this.$appAxios
        .get("https://www.nosyapi.com/apiv2/getTurkeyCity?id=84716")
        .then((x) => {
          this.spinnerStatus = false;
          this.countryData = x.data.data;
        });
    },
    selectCountryOnChange(event) {
      this.selectedCountry = event.target.value;
      this.spinnerStatus = true;
      this.$appAxios
        .get(
          `https://www.nosyapi.com/apiv2/getTurkeyCity?id=84716&city=${event.target.value}`
        )
        .then((x) => {
          this.spinnerStatus = false;
          this.districtStatus = false;
          this.districtData = x.data.data;
        });
    },
    selectDistrictOnChange(event) {
      this.$emit("onChance", {
        country: this.selectedCountry,
        district: event.target.value,
      });
    },
    getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.setPosition);
      } else {
        this.error = "Geolocation is not supported by this browser.";
        setTimeout(() => {
          this.error = null;
        }, 3000);
      }
    },
    async setPosition(position) {
      var userCity = null;
      await this.$appAxios.get("https://ipapi.co/json").then((x) => {
        userCity = x.data.city;
      });
      this.userPosition = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        city: userCity,
      };
      this.$emit("userLocation", this.userPosition);
    },
  },
  watch: {
    searchData(value) {
      this.spinnerStatus = value;
    },
  },
};
</script>

<style scoped>
.form-control {
  border: none !important;
}
.form-control:focus {
  color: #212529;
  background-color: #fff;
  border-color: red !important;
  border: none !important;
  outline: 0;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px,
    rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px,
    rgba(0, 0, 0, 0.09) 0px -3px 5px;
}
.form-control:focus + button {
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px,
    rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px,
    rgba(0, 0, 0, 0.09) 0px -3px 5px;
}
</style>
