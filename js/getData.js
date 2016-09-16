
var serverURLs = [{ID:1, PID:"1081332", URL:"https://fhir-open-api-dstu2.smarthealthit.org"},
    {ID:2, PID:"Patient-60132", URL:"http://52.72.172.54:8080/fhir/baseDstu2"},
    {ID:3, PID:"Tbt3KuCY0B5PSrJvCu2j-PlK.aiHsu2xUjUM8bWpetXoB", URL:"https://open-ic.epic.com/FHIR/api/FHIR/DSTU2"},
    {ID:4, PID:"107868", URL:"http://fhirtest.uhn.ca/baseDstu2"},
    {ID:5, PID:"1316024", URL:"https://fhir-open.sandboxcernerpowerchart.com/dstu2/d075cf8b-3261-481d-97e5-ba6c48d3b41f"},
    {ID:6, PID:"1000000005", URL:"http://fhir.i2b2.org/srv-dstu2-0.2/api/open"},
    {ID:7, PID:"5ee2f816-b533-e611-8128-0a69c1b3225b", URL:"http://fhir.careevolution.com/apitest/fhir"}
    ];

//(function () {
    var serverURL = getURLById(parseInt($(server_list).val())).URL;

    var $selectValue = $('#select_value').find('strong');

    $selectValue.text(getURLById(parseInt($(server_list).val())).URL + "/Patient/" + getURLById(parseInt($(server_list).val())).PID);

    $('#server_list').selectric().on('change', function () {
        serverURL = getURLById(parseInt($(server_list).val())).URL;

        $selectValue.text(serverURL + "/Patient/" + getURLById(parseInt($(server_list).val())).PID);
    });
//}());
function getURLById(id) {
    var results = serverURLs.filter(function(x) { return x.ID == id });
    return (results.length > 0 ? results[0] : null);
}

function getPatientName(pt) {
    if (pt.name) {
        /*var names = pt.name.map(function(name) {
         return name.given.join(" ") + " " + name.family.join(" ");
         });
         return names.join(" / ")*/
        var names = pt.name;
        return names[0].given.join(" ") + " " + names[0].family.join(" ");
    } else {
        return "unknown";
    }
}

function getPatientBirth(pt) {
    if (pt.birthDate) {
        return pt.birthDate;
    } else {
        return "unknown";
    }
}

function getPatientGender(pt) {
    if (pt.gender) {
        return pt.gender;
    } else {
        return "unknown";
    }
}


function getPatientEmail(pt) {
    var email = "unknown email";
    pt.telecom.forEach(function (t) {
        if (t.system == "email")
        {
            email = t.value;
            return;
        }
    });
    return email;
}

function getFullAddress(address) {
    var fulladdress = Object.prototype.toString.call(address);
    return fulladdress;
}

function getPatientAddress(pt) {
    if (pt.address) {

        //return Object.prototype.toString.call(pt.address);
        //pt.addr.map(getFullAddress);


        var addresses = pt.address;
        return addresses[0].line + ", " + addresses[0].city + ", " + addresses[0].state + " " + addresses[0].postalCode;
    } else {
        return "unknown";
    }
}


function reset() {
    document.getElementById('patient_name').innerHTML = "";
    document.getElementById('patient_gender').innerHTML = "";
    document.getElementById('patient_birth').innerHTML = "";
    document.getElementById('patient_address').innerHTML = "";
    document.getElementById('patient_email').innerHTML = "";
    document.getElementById('med_list').innerHTML = "";
    document.getElementById('cond_list').innerHTML = "";
    document.getElementById('med_ord_list').innerHTML = "";
    //med_list.parentNode.removeChild(med_list);
    /*var list = document.getElementById('med_list'),
     items = Array.prototype.slice.call(list.childNodes),
     item;
     while (item = items.pop()) {
     if (item.firstChild && item.firstChild.checked) {
     list.removeChild(item);
     }
     }*/
}


function displayPatient(pt) {
    document.getElementById('patient_name').innerHTML = getPatientName(pt);
    document.getElementById('patient_gender').innerHTML = getPatientGender(pt);
    document.getElementById('patient_birth').innerHTML = getPatientBirth(pt);
    document.getElementById('patient_address').innerHTML = getPatientAddress(pt);
    document.getElementById('patient_email').innerHTML = getPatientEmail(pt);
}


function getMedicationName(medCodings) {
    var coding = medCodings.find(function (c) {
        //return c.system.substring(0, 3) == "urn";
        //return c.system == "urn:oid:2.16.840.1.113883.6.88";
        //return c.system == "http://www.nlm.nih.gov/research/umls/rxnorm";
        return c.system != "";
    });

    return coding && coding.display || "Unnamed Medication(TM)";

}

function displayMedication(medCodings) {
    document.getElementById('med_list').innerHTML += "<li class=\"ui-state-default\"><span class=\"ui-icon ui-icon-arrowthick-2-n-s\"></span>" + getMedicationName(medCodings) + "</li>";
}

function getConditionName(condCodings) {
    var coding = condCodings.find(function (c) {
        //return c.system.substring(0, 3) == "urn";
        return c.system != "";
    });

    return coding && coding.display || "unknown Condition";

}

function displayCondition(condCodings) {
    document.getElementById('cond_list').innerHTML += "<li class=\"ui-state-default\"><span class=\"ui-icon ui-icon-arrowthick-2-n-s\"></span>" + getConditionName(condCodings) + "</li>";
}

function displayMedicationOrder(medCodings) {
    document.getElementById('med_ord_list').innerHTML += "<li class=\"ui-state-default\"><span class=\"ui-icon ui-icon-arrowthick-2-n-s\"></span>" + getMedicationName(medCodings) + "</li>";
}

// Submit form with id function.
function submit_by_id() {


    var patient_id = document.getElementById("patient_id");

    if (patient_id.value == null || patient_id.value == "") {
        //alert("Patient ID must be filled out!");
        $.alert({
            theme: 'bootstrap',
            title: 'Error',
            content: 'Patient ID must be filled out!',
            confirm: function () {
                //$.alert('Confirmed!'); // shorthand.
                patient_id.focus();
            }
        });

    } else {
        /*if (isNaN(patient_id.value) || patient_id.value < 1 || patient_id.value > 10000000) {
         //alert("Please fill out a valid Patient ID");
         $.alert({
         theme: 'bootstrap',
         title: 'Error',
         content: 'Please fill out a valid Patient ID!',
         confirm: function () {
         patient_id.value = "";
         //patient_id.autofocus="true";
         patient_id.focus();
         }
         });

         } else */
        {
            reset();

            var init = {
                //serviceUrl: "https://fhir-open-api-dstu2.smarthealthit.org",
                //serviceUrl: "	http://52.72.172.54:8080/fhir/baseDstu2",
                serviceUrl: serverURL,
                patientId: patient_id.value
            };

            var smart = FHIR.client(init),
                pt = smart.patient;

            smart.patient.read().then(function (pt) {
                displayPatient(pt);
            });

            smart.patient.api.fetchAllWithReferences({
                type: "Condition"
            }, ["Condition"]).then(function (results, refs) {
                results.forEach(function (prescription) {
                    if (prescription.code) {
                        displayCondition(prescription.code.coding);
                    }
                });
            });

            smart.patient.api.fetchAllWithReferences({
                type: "MedicationDispense"
            }, ["MedicationDispense"]).then(function (results, refs) {
                results.forEach(function (prescription) {
                    if (prescription.medicationCodeableConcept) {
                        displayMedication(prescription.medicationCodeableConcept.coding);
                    } else if (prescription.medicationReference) {
                        var med = refs(prescription, prescription.medicationReference);
                        displayMedication(med && med.code.coding || "Unknown");
                    }
                });
            });

            smart.patient.api.search({
                type: "MedicationOrder", query: {patient: init.patientId}
            }).then(function (mo) {
                mo.data.entry.forEach(function (re) {
                    var rx = re.resource;
                    if (rx.medicationCodeableConcept) {
                        document.getElementById('med_ord_list').innerHTML +=
                            "<li class=\"ui-state-default\"><span class=\"ui-icon ui-icon-arrowthick-2-n-s\"></span>"
                            + rx.medicationCodeableConcept.text + "</li>";
                    } else {

                        //alert(rx.prescriber.reference);
                        document.getElementById('med_ord_list').innerHTML +=
                            "<li class=\"ui-state-default\"><span class=\"ui-icon ui-icon-arrowthick-2-n-s\"></span>"
                            + rx.medicationReference.display + "</li>";
                    }
                });
            });


        }
    }

}

