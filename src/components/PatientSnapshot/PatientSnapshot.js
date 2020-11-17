import React, { FC, useMemo, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useStore } from '../StoreProvider';
import api from '../../api';

import classes from './PatientSnapshot.module.scss';

const getPatientName = (name = []) => {
  const entry = name.find(n => n.use === 'official') || name[0];
  return entry ? `${entry.given} ${entry.family}` : 'No name';
};

const getPatientAddress = (address = []) => {
  const entry = address[0];
  return entry ? [entry.city, entry.state].filter(item => !!item).join(', ') : 'No Address';
};

const PatientSnapshot = () => {
  const [enroll, setEnroll] = useState(false);
  const { store } = useStore();
  const patient = store.patient;
  console.log(patient)
  const name = useMemo(() => getPatientName(patient.name), [store]);
  const address = useMemo(() => getPatientAddress(patient.address), [store]);

  const renderEnroll = () => {  
    const style = {marginLeft: '200px', borderRadius: '5px', background: '#6b8eb6', color: 'white', fontSize: '1em', fontFamily: 'Open Sans, sans-serif', fontWeight: 'bold', textTransform: 'uppercase'};
    if (enroll === false) {
      return <button style={style} onClick={() => this.enrollUser(this.state.patient)}>Refer Patient</button>
    } else if (enroll === true) {
      return <button style={{...style, background: 'lightgrey'}} disabled>Enrolled </button>
    }
  }

  return (
    <div className={classes['patient-snapshot']}>
      <FontAwesomeIcon icon="user-circle" className={classes['patient-snapshot__photo']} />

      <div className={classes['patient-snapshot__info']}>
        <div className={classes['patient-name']}>{name}</div>

        <ul className={classes['patient-snapshot__list']}>
          <li>DOB: {patient.birthDate}</li>
          <li>Gender: {patient.gender}</li>
          <li>Race: {patient.extension[0].extension[1].valueString}</li>
          <li>Ethnicicty: {patient.extension[1].extension[1].valueString}</li>
          <li>Address: {patient.address[0].line}</li>
          <li>Location: {address} {patient.address[0].postalCode}</li>
          <li>Managing Org: {patient.managingOrganization.display}</li>
        </ul>
      </div>
    </div>
  );
};

export default PatientSnapshot;
