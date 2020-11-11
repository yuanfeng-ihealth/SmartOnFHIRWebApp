import React, { FC, useEffect, useState, useContext } from 'react';
// import axios from 'axios';
import api from '../../api';
import { makeBG } from './BG';
import { makeBP } from './BP';
import { getPatientRecord, getPatientObservations } from '../../utils/fhirExtract';

const Measurement = ({ store, loading, client, dispatch, encounter }) => {
  const [measurements, setMeasurements] = useState([]);
  const { patient, user } = store;

  useEffect(() => {
    api.getAllMeasurements().then((res) => {  
      setMeasurements(res.data.data)
    })
    // .then(() => {
    //   getSetUser(patient);
    // })
    // axios({
    //   method: 'get',
    //   url: 'http://192.81.133.207:8080/fhir/Patient',
    //   headers: {
    //     'Access-Control-Allow-Origin': '*',
    //     'Accept': 'application/fhir+json'
    //   }
    // }).then((res) => console.log(res))
  }, [])

  // const getSetUser = async (patient) => {
  //   const ehr_id = patient.id;

  //   if (patient) {
  //     api.getUser(ehr_id).then((res) => {
  //       const user = res.data.data[0];
  //       setUser(user)
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       console.log(patient)
  //       const user = {
  //         firstName: patient.name[0].given[0],
  //         lastName: patient.name[0].family,
  //         ehr_id,
  //         birthDate: patient.birthDate
  //       }
  //       api.createUser(user).then((res) => {
  //         console.log(res)
  //         setUser(res.data.user);
  //       })
  //     })
  //   }
  // }

  const migrate = async (reading) => {
    console.log(store)
    console.log(reading)
    const ehr_id = user.ehr_id;
    console.log(encounter)
    // console.log(encounter_id)
    let send;
    if (reading.type === "Blood Pressure") {
      send = makeBP(reading, ehr_id, encounter.id);
    } else if (reading.type === "Blood Glucose") {
      send = makeBG(reading, ehr_id);
    }
    client.create(send).then((res) => {
      console.log(res);
      getPatientObservations(client).then((observations) => {
        console.log(observations)
        dispatch({type: 'updateObservations', observations})
      })
    })
  }

  const renderButton = (bp) => {
    let bool;
    if (encounter && !store.observations.find((o) => o.effectiveDateTime === bp.date)) {
      bool = true;
    } else {
      bool = false;
    }
    return bool ? <div style={{...style.font, ...style.button}} onClick={() => migrate(bp)}>Send to EHR</div> : null
  }
  
  return loading ? <div>loading</div> : (
    store.enroll === true ?
    <div style={{...style.container}}>
      <div>
        <div style={style.sectionHeader}>Blood Glucose Summary</div>
        <table style={{width: '100%'}}>
          <tbody>
          <tr>
            <th>Blood Glucose</th>
            <th>Date</th>
          </tr>
          {measurements.filter((m) => m.type === 'Blood Glucose').map((bg, i) => 
            <tr key={i}>
              <td>{bg.reading.value + " " + bg.reading.unit}</td>
              <td>{bg.date}</td>
            </tr>
          )}
          </tbody>
        </table>
        <div style={{...style.sectionHeader, marginTop: '40px'}}>Blood Pressure Summary</div>
        <table style={{width: '100%'}}>
          <tbody>
            <tr>
              <th>Systolic</th>
              <th>Diastolic</th>
              <th>Date</th>
            </tr>
            {measurements.filter((m) => m.type === 'Blood Pressure').map((bp, i) => 
              <tr key={i}>
                <td>{bp.reading.systolic.value} {bp.reading.systolic.unit}</td>
                <td>{bp.reading.diastolic.value} {bp.reading.diastolic.unit}</td>
                <td>{bp.date}</td>
                {/* <td>{renderButton(bp)}</td> */}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    : 
    <div style={{...style.container, ...style.font}}>
      <div >
        Enroll patient to access
      </div>
    </div>
  );
};

const style = {
  sectionHeader: {
    'fontFamily': 'Open Sans, sans-serif',
    'color': '#6b8eb6',
    'fontSize': '1em',
    'fontWeight': 'bold',
    'textTransform': 'uppercase',
    'marginBottom': '40px'
  }, 
  font: {
    fontSize: '1em',
    fontFamily: 'Open Sans, sans-serif',
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  button: {
    borderRadius: '5px',
    background: '#6b8eb6',
    color: 'white',
    width: '8em',
    display: 'flex',
    justifyContent: 'center',
    padding: '2px'
  },
  container: {
    background: 'ghostwhite',
    width: '40%',
    padding: '3em'
  }
}

export default Measurement;
