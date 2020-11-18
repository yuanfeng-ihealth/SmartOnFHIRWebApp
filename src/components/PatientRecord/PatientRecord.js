import React, { FC } from 'react';
import { useStore } from '../StoreProvider';

import {
  AllergiesVisualizer,
  CarePlansVisualizer,
  ConditionsVisualizer,
  EncountersVisualizer,
  ImmunizationsVisualizer,
  MedicationsVisualizer,
  ObservationsVisualizer,
  PatientVisualizer,
  ProceduresVisualizer,
  ReportsVisualizer
} from './fhir-visualizer';
import Measurement from '../Measurement';
import { finished } from 'stream';

const getResourceByType = ( patientRecord, resourceType ) => {
  return patientRecord.filter(resource => resource.resourceType === resourceType);
};

const PatientRecord = ({ resources, loading, client }) => {
  const { store, dispatch } = useStore();
  console.log(getResourceByType(store.records, 'Encounter'))
  console.log(store.records)
  return (
    <div style={{display: 'flex'}}>
      <div style={{width: '100%'}}>
        {/* <PatientVisualizer dispatch={dispatch} client={client} patient={store.patient} observations={getResourceByType(resources, 'Observation')}/> */}
        <Measurement store={store} client={client} loading={loading} dispatch={dispatch} encounter={getResourceByType(store.records, 'Encounter').find(e => e.status === 'in-progress' || e.status === 'planned' || e.status === 'finished')}/>
        <ConditionsVisualizer rows={getResourceByType(resources, 'Condition')} />
        <ObservationsVisualizer rows={getResourceByType(store.observations, 'Observation')} />
        <ReportsVisualizer rows={getResourceByType(resources, 'DiagnosticReport')} />
        <MedicationsVisualizer rows={getResourceByType(resources, 'MedicationRequest')} />
        <AllergiesVisualizer rows={getResourceByType(resources, 'AllergyIntolerance')} />
        <CarePlansVisualizer rows={getResourceByType(resources, 'CarePlan')} />
        <ProceduresVisualizer rows={getResourceByType(resources, 'Procedure')} />
        <EncountersVisualizer rows={getResourceByType(resources, 'Encounter')} />
        <ImmunizationsVisualizer rows={getResourceByType(resources, 'Immunization')} />
      </div>
    </div>
  );
};

export default PatientRecord;
