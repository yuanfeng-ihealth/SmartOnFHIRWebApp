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
  // const [enroll, setEnroll] = useState<boolean | null>(null);
  const { store } = useStore();
  const patient = store.patient;

  const name = useMemo(() => getPatientName(patient.name), [store]);
  const address = useMemo(() => getPatientAddress(patient.address), [store]);

  return (
    <div className={classes['patient-snapshot']}>
      <FontAwesomeIcon icon="user-circle" className={classes['patient-snapshot__photo']} />

      <div className={classes['patient-snapshot__info']}>
        <div className={classes['patient-name']}>{name}</div>

        <ul className={classes['patient-snapshot__list']}>
          <li>DOB: {patient.birthDate}</li>
          <li>Admin. Sex: {patient.gender}</li>
          <li>Location: {address}</li>
        </ul>
      </div>
    </div>
  );
};

export default PatientSnapshot;
