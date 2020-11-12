import { CERNER_SCOPES, EPIC_SCOPES } from './constants';

export const getLaunchOptions = (window) => {
  const context = {};

  if (window.location.href.match('cerner')) {
    context.clientId = process.env.REACT_APP_CERNER_CLIENT_ID;
    context.scope = CERNER_SCOPES;
  }
  if (window.location.href.match('epic')) {
      context.clientId = process.env.REACT_APP_EPIC_CLIENT_ID;
      context.scope = EPIC_SCOPES;
  }

  return context;
};

export const makeBG = (bg, ehr_id) => {
  return {
    "resourceType": "Observation",
    "meta": {
        "versionId": "3",
        "lastUpdated": "2019-06-06T03:04:16.800-04:00",
        "tag": [
            {
                "system": "https://smarthealthit.org/tags",
                "code": "synthea-5-2019"
            }
        ]
    },
    "status": "final",
    "category": [
        {
            "coding": [
                {
                    "system": "http://terminology.hl7.org/CodeSystem/observation-category",
                    "code": "laboratory",
                    "display": "laboratory"
                }
            ]
        }
    ],
    "code": {
        "coding": [
            {
                "system": "http://loinc.org",
                "code": "2339-0",
                "display": "Glucose"
            }
        ],
        "text": "Glucose"
    },
    "subject": {
        "reference": `Patient/${ehr_id}`
    },
    "effectiveDateTime": bg.date,
    "issued": getComputedStyle.date,
    "valueQuantity": {
        "value": bg.reading.value * 18,
        "unit": "mg/dL",
        "system": "http://unitsofmeasure.org",
        "code": "mg/dL"
    }
  }
}

export const makeBP = (data, ehr_id, encounter_id) => {
  return {
    "resourceType": "Observation",
    "status": "final",
    "category": [
        {
            "coding": [
                {
                    "system": "http://hl7.org/fhir/observation-category",
                    "code": "vital-signs",
                    "display": "Vital Signs"
                }
            ],
            "text": "Vital Signs"
        }
    ],
    "code": {
        "coding": [
            {
                "system": "urn:oid:1.2.840.114350.1.13.0.1.7.2.707679",
                "code": "5",
                "display": "BP"
            },
            // {
            //     "system": "http://open.epic.com/FHIR/StructureDefinition/observation-flowsheet-id",
            //     "code": "tBdNYepLeojPG60x7nUx9kQ0",
            //     "display": "BP"
            // },
            // {
            //     "system": "urn:oid:1.2.246.537.6.96",
            //     "code": "8462-4"
            // },
            // {
            //     "system": "urn:oid:1.2.246.537.6.96",
            //     "code": "8480-6"
            // },
            // {
            //     "system": "http://loinc.org",
            //     "code": "55284-4",
            //     "display": "Blood pressure systolic and diastolic"
            // },
            // {
            //     "system": "http://loinc.org",
            //     "code": "85354-9",
            //     "display": "Blood pressure panel with all children optional"
            // },
            // {
            //     "system": "http://loinc.org",
            //     "code": "8716-3",
            //     "display": "Vital signs"
            // }
        ],
        "text": "BP"
    },
    "subject": {
        "reference": `Patient/${ehr_id}`
    },
    "encounter": {
        "reference": `Encounter/${encounter_id}`
    },
    "effectiveDateTime": data.date,
    "issued": data.date,
    "performer": [
        {
            "reference": `"Practitioner/eVJ5nESE-HX09PZDSCCodsxpFcYmEYxactZKDJun7DIE3"`,
            "display": "Provider Ihealth Labs Inc",
            
        }
    ],
    "component": [
        {
            "code": {
                "coding": [
                    {
                        "system": "http://loinc.org",
                        "code": "8480-6",
                        "display": "Systolic blood pressure"
                    }
                ],
                "text": "Systolic blood pressure"
            },
            "valueQuantity": {
                "value": Math.round(data.reading.systolic.value)    ,
                "unit": "mm[Hg]",
                "system": "http://unitsofmeasure.org",
                "code": "mm[Hg]"
            }
        },
        {
            "code": {
                "coding": [
                    {
                        "system": "http://loinc.org",
                        "code": "8462-4",
                        "display": "Diastolic blood pressure"
                    }
                ],
                "text": "Diastolic blood pressure"
            },
            "valueQuantity": {
                "value": Math.round(data.reading.diastolic.value),
                "unit": "mm[Hg]",
                "system": "http://unitsofmeasure.org",
                "code": "mm[Hg]"
            }
        }
    ]
  }
}
