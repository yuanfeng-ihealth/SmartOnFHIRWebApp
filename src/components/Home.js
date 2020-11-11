import React, { useState, useEffect, useReducer } from "react";
import logo from '../logo.png';
import FHIR from 'fhirclient';
import { getPatientRecord } from '../utils/fhirExtract';
import { FHIRClientProvider } from './FHIRClient';
import { StoreProvider } from './StoreProvider';
import PatientRecord from './PatientRecord';
import Header from './Header';
import Navigation from './Navigation'

/**
 * Wraps everything into `FhirClientProvider` so that any component
 * can have access to the fhir client through the context.
 */

const reducer = (state, action) => {
  switch (action.type) {
    case 'updatePatient':
      return {...state, patient: action.patient};
    case 'updateUser': 
      return {...state, user: action.user};
    case 'updateRecords':
      console.log(action)
      return {...state, records: action.records};
    case 'updateObservations':
      console.log(action)
      return {...state, observations: action.observations};
    case 'updateEnroll':
      return {...state, enroll: action.enroll};
    case 'updateEncounter': 
      return {...state, encounter: action.encounter}
    default: 
      return state
  }
}

export default function Home() {
  // const [patientRecords, setPatientRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fhir, setFhir] = useState(null);
  const initState = {};
  const [state, dispatch] = useReducer(reducer, initState);

  useEffect(() => {
    FHIR.oauth2.ready().then((client) => {
      window.fhir = client;
      setFhir(client);
      // dispatch({type: 'updateEncounter', encounter: client.encounter});
      getPatientRecord(client).then((records) => {
        // setPatientRecords(records);
        dispatch({type: "updateRecords", records})
        dispatch({type: 'updateObservations', observations: records.filter((resource) => resource.resourceType === 'Observation')})
        setLoading(false)
        client.patient.read().then((patient) => dispatch({type: "updatePatient", patient}))
        // client.user.read().then((user) => dispatch({type: 'updateUser', user}))
    })
  })
  }, [])


  return (
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
  );
}
