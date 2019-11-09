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
    var e = document.getElementById("selectMake");
    var makeID = e.options[e.selectedIndex].value;
    var models = carModels.filter(x => x.make_id === makeID);
    var selectModel = document.getElementById("selectModel");
    for (var i = 0; i < models.length; i++) {
      var opt = models[i];
      var el = document.createElement("option");
      el.textContent = opt.model;
      el.value = opt.model;
      selectModel.appendChild(el);
    }
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
