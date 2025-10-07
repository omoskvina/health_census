const addPatientButton = document.getElementById("addPatient");
const report = document.getElementById("report");
const btnSearch = document.getElementById('btnSearch');
const patients = [];

let patientsNumber = null;
let conditionsBreakdownContainer = null;
let conditionsBreakdown = null;
let conditionsList = null;
let genderBasedConditionsContainer = null;
let genderBasedConditions = null;
let conditionsByGenderList = null;
let conditionsForGenderList = null;



function addPatient() {
    const name = document.getElementById("name").value;
    const gender = document.querySelector('input[name="gender"]:checked');
    const age = document.getElementById("age").value;
    const condition = document.getElementById("condition").value;

    if (name && gender && age && condition) {
        patients.push({ name, gender: gender.value, age, condition });
        resetForm();
        generateReport();
    }
}


function resetForm() {
    document.getElementById("name").value = "";
    document.querySelector('input[name="gender"]:checked').checked = false;
    document.getElementById("age").value = "";
    document.getElementById("condition").value = "";
}

function generateReport() {

    const numPatients = patients.length;
    const conditionsCount = {
        Diabetes: 0,
        Thyroid: 0,
        "High Blood Pressure": 0,
    };
    const genderConditionsCount = {
        Male: {
            Diabetes: 0,
            Thyroid: 0,
            "High Blood Pressure": 0,
        },
        Female: {
            Diabetes: 0,
            Thyroid: 0,
            "High Blood Pressure": 0,
        },
    };

    for (const patient of patients) {
        conditionsCount[patient.condition]++;
        genderConditionsCount[patient.gender][patient.condition]++;
    }


    if (patientsNumber == null) {
        const patientsNumberDiv = document.createElement("div");
        patientsNumberDiv.setAttribute("id", "patientsNumberContainer");

        const patientsNumberParagraph = document.createElement("p");
        patientsNumberParagraph.setAttribute("id", "patientsNumber");

        patientsNumberDiv.appendChild(patientsNumberParagraph);
        report.appendChild(patientsNumberDiv);
        patientsNumber = document.getElementById("patientsNumber");

    }

    patientsNumber.innerHTML = `Number of patients: ${numPatients}`;

    if (conditionsBreakdownContainer == null) {
        const conditionsBreakdownDiv = document.createElement("div");
        conditionsBreakdownDiv.setAttribute("id", "conditionsBreakdownContainer");

        const conditionsBreakdownParagraph = document.createElement("p");
        conditionsBreakdownParagraph.setAttribute("id", "conditionsBreakdown");

        conditionsBreakdownDiv.appendChild(conditionsBreakdownParagraph);
        report.appendChild(conditionsBreakdownDiv);

        conditionsBreakdown = document.getElementById("conditionsBreakdown");
        conditionsBreakdownContainer = document.getElementById("conditionsBreakdownContainer");
    }

    conditionsBreakdown.innerHTML = `Conditions Breakdown:`;

    if (conditionsList == null) {
        const conditionsItemsList = document.createElement("ul");
        conditionsItemsList.setAttribute("id", "conditionsList");
        conditionsBreakdownContainer.appendChild(conditionsItemsList);
        conditionsList = document.getElementById("conditionsList");
    }

    for (const condition in conditionsCount) {
        const id = condition.toLowerCase().replace(/ /g, "-");
        if (document.getElementById(id) == null) {
            const conditionsItem = document.createElement("li");
            conditionsItem.setAttribute("id", id);
            conditionsList.appendChild(conditionsItem);
        }

        document.getElementById(id).innerHTML = `${condition}: ${conditionsCount[condition]}`;

    }

    if (genderBasedConditionsContainer == null) {
        const genderBasedConditionsDiv = document.createElement("div");
        genderBasedConditionsDiv.setAttribute("id", "genderBasedConditionsContainer");
        const genderBasedConditionsParagraph = document.createElement("p");
        genderBasedConditionsParagraph.setAttribute("id", "genderBasedConditions");

        genderBasedConditionsDiv.appendChild(genderBasedConditionsParagraph);
        report.appendChild(genderBasedConditionsDiv);

        genderBasedConditionsContainer = document.getElementById("genderBasedConditionsContainer");
        genderBasedConditions = document.getElementById("genderBasedConditions");

    }

    genderBasedConditions.innerHTML = `Gender-Based Conditions:`;

    if (conditionsByGenderList == null) {
        const conditionsByGender = document.createElement("ul");
        conditionsByGender.setAttribute("id", "conditionsByGenderList");
        genderBasedConditionsContainer.appendChild(conditionsByGender);
        conditionsByGenderList = document.getElementById("conditionsByGenderList");
    }

    for (const gender in genderConditionsCount) {
        const id = gender.toLowerCase().replace(/ /g, "-") + "Item";
        if (document.getElementById(id) == null) {
            const genderItem = document.createElement("li");
            genderItem.setAttribute("id", id);
            conditionsByGenderList.appendChild(genderItem);

        }
        document.getElementById(id).innerHTML = `${gender}:`;
        const conditionsListId = gender.toLowerCase().replace(/ /g, "-") + "Conditions";
        if (document.getElementById(conditionsListId) == null) {
            const conditionsForGender = document.createElement("ul");
            conditionsForGender.setAttribute("id", conditionsListId);
            document.getElementById(id).appendChild(conditionsForGender);
            conditionsForGenderList = document.getElementById(conditionsListId);
        }


        for (const condition in genderConditionsCount[gender]) {
            const conditionId = condition.toLowerCase().replace(/ /g, "-") + gender;
            if (document.getElementById(conditionId) == null) {
                const conditionItem = document.createElement("li");
                conditionItem.setAttribute("id", conditionId);
                conditionsForGenderList.appendChild(conditionItem);
            }

            document.getElementById(conditionId).innerHTML += `${condition}: ${genderConditionsCount[gender][condition]}`;
        }
    }

    report.style.border = '3px solid rgb(106, 166, 152, 0.5)';
    report.style.borderRadius = '10px';

}


addPatientButton.addEventListener("click", addPatient);

function searchCondition() {
    const input = document.getElementById('conditionInput').value.toLowerCase();
    const resultDiv = document.getElementById('result');
    resultDiv.style.border = '3px solid rgb(106, 166, 152, 0.5)';
    resultDiv.style.borderRadius = '10px';
    resultDiv.innerHTML = '';

    fetch('health_analysis.json')
        .then(response => response.json())
        .then(data => {
            const condition = data.conditions.find(item => item.name.toLowerCase() === input);

            if (condition) {
                const symptoms = condition.symptoms.join(', ');
                const prevention = condition.prevention.join(', ');
                const treatment = condition.treatment;

                resultDiv.innerHTML += `<h3>${condition.name}</h3>`;
                resultDiv.innerHTML += `<img src="${condition.imagesrc}" alt="hjh">`;

                resultDiv.innerHTML += `<p><strong>Symptoms:</strong> ${symptoms}</p>`;
                resultDiv.innerHTML += `<p><strong>Prevention:</strong> ${prevention}</p>`;
                resultDiv.innerHTML += `<p><strong>Treatment:</strong> ${treatment}</p>`;
            } else {
                resultDiv.innerHTML = 'Condition not found.';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            resultDiv.innerHTML = 'An error occurred while fetching data.';
        });
}

btnSearch.addEventListener('click', searchCondition);