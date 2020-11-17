import React, { useEffect, useState } from 'react';
import seedMeasurements from '../../seeds/measurements';
import moment from 'moment';
import _ from 'lodash';
import '../../App.scss'
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

  const renderBGTable = () => {
    const filterB = (data) => {
      console.log(data)
      return _.filter(data, ['beforeMeal', true])
    }
    
    const filterA = (data) => {
      console.log(data)
      return _.filter(data, ['beforeMeal', false])
    }

    const renderMeasurement = (filtered) => {
      console.log(filtered);
      return {
        children: 
        <div>
          <div>
            <span>
              {filtered[0] ? Math.round(filtered[0].reading * 18) : ""}
            </span>
          </div>
        </div>
      }
    }

    return (
    <Table 
      classname="logBookTable"
      style={{...style.table, marginBottom: '30px'} } 
      footer={ () => <span>Measurements are in mg/dL</span>}
      title={() => <span style={{fontWeight: 'bold'}}>Blood Glucose</span>}
      dataSource={measurements.filter((m) => m.type === "Blood Glucose")} 
      pagination={false}
    >
      <Column
        title="Date"
        dataIndex="date"
        key='date'
        className='bg-cell'
        // sorter={(a,b)=>a.date-b.date}
        // showSorterTooltip={false}
        render={(data)=>moment(data).format('MM/DD/YYYY')}
        width={'11%'}
        style={style.cell}
      />
      <Column
        title="overnight"
        className='overnight bg-cell'
        dataIndex="overnight"
        key='reading'
        // sorter={(a,b)=>a.date-b.date}
        // render={(data)=>console.log(data)}
        width={'11%'}
      />
      <ColumnGroup title="Breakfast" className='bg-cell'>
      <Column
        title="B"
        dataIndex="breakfast"
        key='reading'
        className='bg-cell'
        // sorter={(a,b)=>a.date-b.date}
        render={(data)=>{
          const filtered = filterB(data) || [];
          return renderMeasurement(filtered)
        }}
        width={'12%'}
      />
      <Column
        title="A"
        dataIndex="breakfast"
        key='reading'
        className='bg-cell' 
        // sorter={(a,b)=>a.date-b.date}
        render={(data)=>{
          const filtered = filterA(data) || {};
          return renderMeasurement(filtered)
        }}
        width={'12%'}
      />
      </ColumnGroup>
      <ColumnGroup title="Lunch" className='bg-cell'>
      <Column
        title="B"
        dataIndex="lunch"
        key='reading'
        className='bg-cell'
        // sorter={(a,b)=>a.date-b.date}
        render={(data)=>{
          const filtered = filterB(data) || [];
          return renderMeasurement(filtered)
        }}
        width={'12%'}
      />
      <Column
        title="A"
        dataIndex="lunch"
        key='reading'
        className='bg-cell'
        render={(data)=>{
          const filtered = filterB(data) || [];
          return renderMeasurement(filtered)
        }}
        width={'12%'}
      />
      </ColumnGroup>
      <ColumnGroup title="Dinner" className='bg-cell'>
      <Column
        title="B"
        dataIndex="dinner"
        key='reading'
        className='bg-cell'
        render={(data)=>{
          const filtered = filterB(data) || [];
          return renderMeasurement(filtered)
        }}
        width={'12%'}
      />
      <Column
        title="A"
        dataIndex="dinner"
        key='reading'
        className='bg-cell'
        render={(data)=>{
          const filtered = filterB(data) || [];
          return renderMeasurement(filtered)
        }}
        width={'12%'}
      />
      </ColumnGroup>
      <Column
        title="bedtime"
        dataIndex="bedtime"
        key='reading'
        // className='bg-cell'
        className='bg-cell'
        // sorter={(a,b)=>a.date-b.date}
        // render={(data)=>{
        //   console.log(data)
        // }}
        width={'12%'}
      />
    </Table>
    )
  }

  const renderBGSummary = () => {
    const source = [
      {type: 'Fasting', average: 62, count: 3, percentage: "33%", range: "45-85"},
      {type: 'Before Meal', average: 71, count: 10, percentage: "60%", range: "45-85"},
      {type: 'After Meal', average: 127, count: 11, percentage: "45%", range: "41-200"},
      {type: 'Bedtime+Overnight Hypos', average: 44, count: 2, percentage: "33%", range: "43-45"},
      {type: 'Bedtime', average: 85, count: 1, percentage: "0%", range: "85-85"},
      {type: 'Overnight', average: 44, count: 2, percentage: "0%", range: "43-45"},
      {type: 'Critical High', average: 200, count: 2, percentage: "N/A", range: "200-200"},
      {type: 'Critical Low', average: 47, count: 8, percentage: "N/A", range: "41-56"},
   ];

    const columns = [
      {
          title:'Type',
          key:'type',
          align:'center',
          dataIndex: 'type',
          width: '26%',
          className:'bg-cell'
      },
      {
          title:'Ct.',
          key:'count',
          align:'center',
          dataIndex:'count',
          width: '10%',
          className:'bg-cell'
      },
      {
          title:'Average\n(mg/dL)',
          key:'average',
          align:'center',
          dataIndex:'average',
          className:'bg-cell'
      },
      {
          title:'Range\n(mg/dL)',
          key:'range',
          align:'center',
          dataIndex:'range',
          width: '20%',
          className:'bg-cell'
      },
      {
          title:'Vital Spent in Normal Range',
          key:'percentage',
          align:'center',
          dataIndex:'percentage',
          className:'bg-cell'
      },
    ];

    return <Table 
                    dataSource={source}
                    columns={columns}
                    bordered
                    pagination={false}
                    title={ ()=> <span>Blood Glucose Summary</span> }
                    style={{...style.table, justifyContent: 'space-between'}}
                    rowClassName='bg-cell'
                    className='statisticsTable'
                />
  }

  const renderBPTable = () => {
    const renderMeasurement = (data) => {
      
      return data ? (
        <div>
          <div>
            <span>{data.systolic}/{data.diastolic} {data.beat}bpm</span>
          </div>
        </div>
      ) : ""
    }
    return (
      <Table 
        classname="logBookTable"
        style={{...style.table, marginBottom: '30px'} } 
        footer={ () => <span>Measurements are in mmHg</span>}
        title={() => <span style={{fontWeight: 'bold'}}>Blood Pressure</span>}
        dataSource={measurements.filter((m) => m.type === "Blood Pressure")} 
        pagination={false}
      >
        <Column
          title="Date"
          dataIndex="date"
          key='date'
          className='bp-cell'
          // sorter={(a,b)=>a.date-b.date}
          // showSorterTooltip={false}
          render={(data)=>moment(data).format('MM/DD/YYYY')}
          width={'11%'}
          style={style.cell}
        />
        <Column
          title="Overnight"
          className='bp-cell'
          dataIndex="overnight"
          key='reading'
          // sorter={(a,b)=>a.date-b.date}
          render={(data)=>renderMeasurement(data)}
          width={'11%'}
        />
        <Column
          title="Morning"
          className='bp-cell'
          dataIndex="morning"
          key='reading'
          // sorter={(a,b)=>a.date-b.date}
          render={(data)=>renderMeasurement(data)}
          width={'11%'}
        />
        <Column
          title="Afternoon"
          className='bp-cell'
          dataIndex="afternoon"
          key='reading'
          // sorter={(a,b)=>a.date-b.date}
          render={(data)=>renderMeasurement(data)}
          width={'11%'}
        />
        <Column
          title="Evening"
          className='bp-cell'
          dataIndex="evening"
          key='reading'
          // sorter={(a,b)=>a.date-b.date}
          render={(data)=>renderMeasurement(data)}
          width={'11%'}
        />
        
      </Table>
      )
  }
  
  const renderBPSummary = () => {
    const source = [
      {type: 'Fasting', average: 62, count: 3, percentage: "33%", range: "45-85"},
      {type: 'Before Meal', average: 71, count: 10, percentage: "60%", range: "45-85"},
      {type: 'After Meal', average: 127, count: 11, percentage: "45%", range: "41-200"},
      {type: 'Bedtime+Overnight Hypos', average: 44, count: 2, percentage: "33%", range: "43-45"},
      {type: 'Bedtime', average: 85, count: 1, percentage: "0%", range: "85-85"},
      {type: 'Overnight', average: 44, count: 2, percentage: "0%", range: "43-45"},
      {type: 'Critical High', average: 200, count: 2, percentage: "N/A", range: "200-200"},
      {type: 'Critical Low', average: 47, count: 8, percentage: "N/A", range: "41-56"},
   ];

    const columns = [
      {
          title:'Type',
          key:'type',
          align:'center',
          dataIndex: 'type',
          width: '26%',
          className:'bp-cell'
      },
      {
          title:'Ct.',
          key:'count',
          align:'center',
          dataIndex:'count',
          width: '10%',
          className:'bp-cell'
      },
      {
          title:'Average\n(mmHg)',
          key:'average',
          align:'center',
          dataIndex:'average',
          className:'bp-cell'
      },
      {
          title:'Range\n(mmHg)',
          key:'range',
          align:'center',
          dataIndex:'range',
          width: '20%',
          className:'bp-cell'
      },
      {
          title:'Vital Spent in Normal Range',
          key:'percentage',
          align:'center',
          dataIndex:'percentage',
          className:'bp-cell'
      },
    ];

    return <Table 
                    dataSource={source}
                    columns={columns}
                    bordered
                    pagination={false}
                    title={ ()=> <span>Blood Pressure Summary</span> }
                    style={{...style.table, justifyContent: 'space-between'}}
                    rowClassName='bg-cell'
                    className='statisticsTable'
          />
  }

  return loading ? <div>loading</div> : (
    // store.enroll === true ?
    store ? 
    <div style={{...style.container}}>
      <div>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          {renderBGTable()}
          {renderBGSummary()}
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          {renderBPTable()}
          {renderBPSummary()}
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
