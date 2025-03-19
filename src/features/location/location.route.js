const express = require("express");
const router = express.Router();
const { ResponseHelper, RequestHelper } = require("../../helpers");
const axios = require("axios");
const { Country, State, City } = require("country-state-city");
const { ErrorMap } = require("../../constants");

// Get location details by postal code
router.get("/by-pincode/:pincode", async (req, res) => {
  const requestHelper = new RequestHelper(req);
  const responseHelper = new ResponseHelper(res);

  try {
    const pincode = requestHelper.params("pincode");

    // Validate pincode format
    if (!/^\d{6}$/.test(pincode)) {
      return responseHelper
        .error({
          message: "Invalid pincode format. Must be 6 digits.",
          status: 400,
        })
        .send();
    }

    // Call India Post API
    const response = await axios.get(
      `https://api.postalpincode.in/pincode/${pincode}`
    );

    const data = response.data[0];

    // Check if the API request was successful
    if (data.Status !== "Success" || data.PostOffice.length === 0) {
      return responseHelper
        .error({
          ...ErrorMap.NOT_FOUND,
          message: "No location found for the provided pincode",
        })
        .send();
    }

    // Extract the first post office data since all post offices in same pincode
    // will have same city, state and country
    const locationInfo = data.PostOffice[0];

    return responseHelper
      .body({
        city: locationInfo.District,
        state: locationInfo.State,
        country: locationInfo.Country,
      })
      .send();
  } catch (error) {
    return responseHelper.error(error).send();
  }
});

// Get all countries
router.get("/countries", async (req, res) => {
  const responseHelper = new ResponseHelper(res);

  try {
    const countries = Country.getAllCountries();
    return responseHelper
      .body({
        countries: countries.map((country) => ({
          name: country.name,
          code: country.isoCode,
          currency: country.currency,
          latitude: country.latitude,
          longitude: country.longitude,
          flag: country.flag,
        })),
      })
      .send();
  } catch (error) {
    return responseHelper.error(error).send();
  }
});

// Get states by country code
router.get("/states-by-country/:countryCode", async (req, res) => {
  const requestHelper = new RequestHelper(req);
  const responseHelper = new ResponseHelper(res);

  try {
    const countryCode = requestHelper.params("countryCode");

    // Validate country code
    const country = Country.getCountryByCode(countryCode);
    if (!country) {
      return responseHelper
        .error({
          message: "Invalid country code",
          status: 400,
        })
        .send();
    }

    const states = State.getStatesOfCountry(countryCode);
    return responseHelper
      .body({
        country: {
          name: country.name,
          code: country.isoCode,
        },
        states: states.map((state) => ({
          name: state.name,
          code: state.isoCode,
          latitude: state.latitude,
          longitude: state.longitude,
        })),
      })
      .send();
  } catch (error) {
    return responseHelper.error(error).send();
  }
});

// Get cities by state code
router.get("/cities-by-state/:countryCode/:stateCode", async (req, res) => {
  const requestHelper = new RequestHelper(req);
  const responseHelper = new ResponseHelper(res);

  try {
    const countryCode = requestHelper.params("countryCode");
    const stateCode = requestHelper.params("stateCode");

    // Validate country code
    const country = Country.getCountryByCode(countryCode);
    if (!country) {
      return responseHelper
        .error({
          message: "Invalid country code",
          status: 400,
        })
        .send();
    }

    // Validate state code
    const state = State.getStateByCodeAndCountry(stateCode, countryCode);
    if (!state) {
      return responseHelper
        .error({
          message: "Invalid state code",
          status: 400,
        })
        .send();
    }

    const cities = City.getCitiesOfState(countryCode, stateCode);
    return responseHelper
      .body({
        country: {
          name: country.name,
          code: country.isoCode,
        },
        state: {
          name: state.name,
          code: state.isoCode,
        },
        cities: cities.map((city) => ({
          name: city.name,
          latitude: city.latitude,
          longitude: city.longitude,
        })),
      })
      .send();
  } catch (error) {
    return responseHelper.error(error).send();
  }
});

module.exports = router;
