// export const makeBP = (data, ehr_id, encounter_id) => {
//   return {
//     "resourceType": "Observation",
//     "meta": {
//         "versionId": "2",
//         "lastUpdated": "2019-06-05T03:00:05.835-04:00",
//         "tag": [
//             {
//                 "system": "https://smarthealthit.org/tags",
//                 "code": "synthea-5-2019"
//             }
//         ]
//     },
//     "status": "final",
//     "category": [
//         {
//             "coding": [
//                 {
//                     "system": "http://terminology.hl7.org/CodeSystem/observation-category",
//                     "code": "vital-signs",
//                     "display": "vital-signs"
//                 }
//             ]
//         }
//     ],
//     "code": {
//         "coding": [
//             {
//                 "system": "http://loinc.org",
//                 "code": "55284-4",
//                 "display": "Blood Pressure"
//             }
//         ],
//         "text": "Blood Pressure"
//     },
//     "subject": {
//         "reference": `Patient/${ehr_id}`
//     },
//     "encounter": {
//         "reference": `Encounter/${encounter_id}`
//     },
//     "effectiveDateTime": data.date,
//     "issued": data.date,
//     "component": [
//         {
//             "code": {
//                 "coding": [
//                     {
//                         "system": "http://loinc.org",
//                         "code": "8462-4",
//                         "display": "Diastolic Blood Pressure"
//                     }
//                 ],
//                 "text": "Diastolic Blood Pressure"
//             },
//             "valueQuantity": {
//                 "value": data.reading.diastolic.value,
//                 "unit": "mm[Hg]",
//                 "system": "http://unitsofmeasure.org",
//                 "code": "mm[Hg]"
//             }
//         },
//         {
//             "code": {
//                 "coding": [
//                     {
//                         "system": "http://loinc.org",
//                         "code": "8480-6",
//                         "display": "Systolic Blood Pressure"
//                     }
//                 ],
//                 "text": "Systolic Blood Pressure"
//             },
//             "valueQuantity": {
//                 "value": data.reading.systolic.value,
//                 "unit": "mm[Hg]",
//                 "system": "http://unitsofmeasure.org",
//                 "code": "mm[Hg]"
//             }
//         }
//     ]
// }
// }

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
