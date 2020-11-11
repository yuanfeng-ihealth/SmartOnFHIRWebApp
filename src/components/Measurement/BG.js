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