import React, { useEffect, useState } from 'react';
import seedMeasurements from '../../seeds/measurements';
import moment from 'moment';
import _ from 'lodash';
import '../../App.scss'
import BGTable from './BGTable';
import BGSummary from './BGSummary';
import BPTable from './BPTable';
import BPSummary from './BPSummary'
// import axios from 'axios';
// import api from '../../api';
import { makeBG, makeBP } from '../../utils/helper';
import { getPatientObservations } from '../../utils/fhirExtract';
import { Col, Table } from 'antd';
const { Column, ColumnGroup } = Table;

const Measurement = ({ store, loading, client, dispatch, encounter }) => {
  const [measurements, setMeasurements] = useState(seedMeasurements);
  const { patient, user } = store;

  useEffect(() => {
    // api.getAllMeasurements().then((res) => {  
    //   setMeasurements(res.data.data)
    // })
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
    // console.log(store)
    // console.log(reading)
    const ehr_id = user.ehr_id;
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
        dispatch({type: 'updateObservations', observations})
      })
    })
  }

  return loading ? <div>loading</div> : (
    // store.enroll === true ?
    store ? 
    <div style={{...style.container}}>
      <div>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <BGTable measurements={measurements}/>
          <BGSummary />
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <BPTable />
          <BPSummary measurements={measurements}/>
        </div>
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
    // background: 'ghostwh ite',
    // width: '40%',
    padding: '3em'
  },
  table: {
    textAlign: "center",
    // border: "1px solid grey",
    // borderRadius: '5px',
    width: '49%',
    // margin:
  },
  cell: {
    padding: '10px',
    // border: '1px solid grey'
  }
}

export default Measurement;
