'use strict';

import './popup.css';
import {
  carMakes,
  carModels
} from './vehicleList.js';

(function () {
  // We will make use of Storage API to get and store `count` value
  // More information on Storage API can we found at
  // https://developer.chrome.com/extensions/storage

  // To get storage access, we have to mention it in `permissions` property of manifest.json file
  // More information on Permissions can we found at
  // https://developer.chrome.com/extensions/declare_permissions

  var selectYear = document.getElementById("selectYear");
  var today = new Date();
  var yyyy = today.getFullYear();
  for (var i = 0; i < 12; i++) {
    var opt = yyyy - i
    var el = document.createElement("option");
    el.textContent = opt;
    el.value = opt;
    selectYear.appendChild(el);
  }
  var selectMake = document.getElementById("selectMake");
  var makes = carMakes;
  for (var i = 0; i < makes.length; i++) {
    var opt = makes[i];
    var el = document.createElement("option");
    el.textContent = opt.make;
    el.value = opt.make_id;
    selectMake.appendChild(el);
  }
  selectMake.onchange = function () {
    document.getElementById("selectModel").innerHTML = ""
    var e = document.getElementById("selectMake");
    var makeID = e.options[e.selectedIndex].value;
    var models = carModels.filter(x => x.make_id === makeID);
    var selectModel = document.getElementById("selectModel");
    var el = document.createElement("option");
    el.textContent = "Model";
    selectModel.appendChild(el);
    for (var i = 0; i < models.length; i++) {
      var opt = models[i];
      var el = document.createElement("option");
      el.textContent = opt.model;
      el.value = opt.model;
      selectModel.appendChild(el);
    }
  }
  selectModel.onchange = function () {
    var year = getYear()
    var make = getMake()
    var model = getModel()
    getStyleId(make, model, year)
  }

  function getYear() {
    var e = document.getElementById("selectYear");
    var year = e.options[e.selectedIndex].text;
    return year
  }

  function getMake() {
    var e = document.getElementById("selectMake");
    var make = e.options[e.selectedIndex].text;
    return make
  }

  function getModel() {
    var e = document.getElementById("selectModel");
    var model = e.options[e.selectedIndex].text;
    return model
  }

  function getStyleId(make, model, year) {
    var url = `https://www.edmunds.com/gateway/api/vehicle/v4/makes/${make}/models/${model}/years/${year}/styles/`;
    var request = new XMLHttpRequest()

    request.open('GET', url, true)
    request.onload = function () {
      var data = JSON.parse(this.response)
      if (request.status >= 200 && request.status < 400) {
        console.log(make)
        calculateValues(data.results[0]["id"], make, model, year)
      } else {
        alert("Vehicle not found")
      }
    }

    request.send()
  }

  function calculateValues(styleID) {
    var year = getYear()
    var make = getMake()
    var model = getModel()
    var url = `https://www.edmunds.com/gateway/api/coreresearch/v1/tco/makes/${make}/models/${model}/years/${year}/zips/85035/styles/${styleID}/`

    var request = new XMLHttpRequest()

    request.open('GET', url, true)
    request.onload = function () {
      var data = JSON.parse(this.response)
      if (request.status >= 200 && request.status < 400) {
        let insurance = parseFloat(data.results[Object.keys(data.results)[0]][0]["tco"]["total"]["insurance"]) || 0.0
        if (insurance === 0.0) {
          alert("Estimations not found")
          return
        }
        let maintenance = parseFloat(data.results[Object.keys(data.results)[0]][0]["tco"]["total"]["maintenance"])
        let repairs = parseFloat(data.results[Object.keys(data.results)[0]][0]["tco"]["total"]["repairs"])
        insurance = insurance / 60
        maintenance = maintenance / 60
        repairs = repairs / 60
        var total = insurance + maintenance + repairs
        alert(Number((total).toFixed(2)))
      } else {
        alert("Estimations not found")
      }
    }

    request.send()
  }



  // Communicate with background file by sending a message
  chrome.runtime.sendMessage({
      type: 'GREETINGS',
      payload: {
        message: 'Hello, my name is Pop. I am from Popup.',
      },
    },
    response => {
      console.log(response.message);
    }
  );
})();
