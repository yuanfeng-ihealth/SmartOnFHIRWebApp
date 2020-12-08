import React, { useEffect, useState } from 'react';
import seedMeasurements from '../../seeds/measurements';
import moment from 'moment';
import _ from 'lodash';
import '../../App.scss';
// import axios from 'axios';
// import api from '../../api';
import { makeBG, makeBP } from '../../utils/helper';
import { getPatientObservations } from '../../utils/fhirExtract';
import { Col, Table } from 'antd';
const { Column, ColumnGroup } = Table;

const BGTable = ({ store, loading, client, dispatch, encounter, measurements = [] }) => {
  const filterB = (data) => {
    return _.filter(data, ['beforeMeal', true])
  }
  
  const filterA = (data) => {
    return _.filter(data, ['beforeMeal', false])
  }

  const renderMeasurement = (filtered) => {
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
    footer={ () => <span>Measurements are in mg/dL</span>}
    title={() => <span style={{fontWeight: 'bold'}}>Blood Glucose</span>}
    dataSource={measurements.filter((m) => m.type === "Blood Glucose")} 
    pagination={false}
    className='bgTable'
  >
    <Column
      title="Date"
      dataIndex="date"
      key='date'
      className='bg-cell'
      // sorter={(a,b)=>a.date-b.date}
      // showSorterTooltip={false}
      render={(data)=>moment(data).format('MM/DD/YYYY')}
      width={'12%'}
      // style={style.cell}
    />
    <Column
      title="overnight"
      className='overnight bg-cell'
      dataIndex="overnight"
      key='reading'
      // sorter={(a,b)=>a.date-b.date}
      // render={(data)=>console.log(data)}
      width={'12%'}
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

export default BGTable;
