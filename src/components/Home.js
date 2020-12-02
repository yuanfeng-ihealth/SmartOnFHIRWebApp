import React, { useState, useEffect, useReducer } from "react";
import logo from '../logos/logo.png';
import FHIR from 'fhirclient';
import { getPatientRecord } from '../utils/fhirExtract';
import { FHIRClientProvider } from './FHIRClient';
import { StoreProvider } from './StoreProvider';
import PatientRecord from './PatientRecord';
import Header from './Header';
import Navigation from './Navigation'
import { getPatient, createPatient, getAllMeasurements, getPatients } from '../api'

/**
 * Wraps everything into `FhirClientProvider` so that any component
 * can have access to the fhir client through the context.
 */

const reducer = (state, action) => {
  switch (action.type) {
    case 'updatePatient':
      return {...state, patient: action.patient};
    case 'updatePatients':
      return {...state, patients: action.patients};
    case 'updateUser': 
      return {...state, user: action.user};
    case 'updateRecords':
      console.log(action)
      return {...state, records: action.records};
    case 'updateEnroll':
      return {...state, enroll: action.enroll};
    case 'updateObservations':
      console.log(action)
      return {...state, observations: action.observations};
    case 'updateEncounters': 
      return {...state, encounters: action.encounters}
    case 'updateConditions':
      return {...state, conditions: action.conditions}
    case 'updateMedications':
      return {...state, medications: action.medications}
    default: 
      return state
  }
}

export default function Home (props) {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(false);
  const [fhir, setFhir] = useState(null);
  const initState = {
    loggedIn: false
  };
  const [state, dispatch] = useReducer(reducer, initState);

  useEffect(() => {
    console.log(props)
    props.location.standaloneLaunch ? iHealthLaunch() : FhirLaunch()
  }, [])

  const FhirLaunch = () => {
    FHIR.oauth2.ready().then((client) => {
      setFhir(client);
      setSearch(false);
      getPatientRecord(client).then((records) => {
        console.log(records)
        client.patient.read().then((patient) => dispatch({type: "updatePatient", patient}))
        dispatch({type: "updateRecords", records})
        dispatch({type: 'updateObservations', observations: records.filter((resource) => resource.resourceType === 'Observation')})
        getPatients().then((d) => console.log(d.data));
        setLoading(false);
      })
    })
  }

  const iHealthLaunch = () => {
    setSearch(true);
    getPatients().then((bundle) => {
      console.log(bundle);
      dispatch({type: "updatePatients", patients: bundle.data.entry});
      setLoading(false)
    })
  }

  return !search ? (
    <FHIRClientProvider fhir={fhir}>
      <StoreProvider store={state} dispatch={dispatch}>
        <div>
          <Header logo={logo} />
          <Navigation resourcesLength={state.records && state.records.length}/>
        </div>
        <div>
          <PatientRecord client={fhir} resources={state.records} loading={loading} dispatch={dispatch} />
        </div>
    </StoreProvider>
  </FHIRClientProvider>
  // <div>
  //   HELLO
  // </div>
  ) : 
  <div>
    {console.log(state)}
    { state.patients ? state.patients.map((entry) => {
      return <li>{entry.resource.name[0].given + ' ' + entry.resource.name[0].family}</li>
    }) : ""}
  </div>
}
