import React, { useEffect, useState } from 'react';
// import measurements from '../../seeds/measurements';
import moment from 'moment';
import _ from 'lodash';
import '../../App.scss'
// import axios from 'axios';
// import api from '../../api';
import { makeBG, makeBP } from '../../utils/helper';
import { getPatientObservations } from '../../utils/fhirExtract';
import { Col, Table } from 'antd';
const { Column, ColumnGroup } = Table;

const BPTable = ({ measurements = [] }) => {
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
      dataSource={measurements.filter((m) => m.type === "Blood Pressure")} 
      style={{marginBottom: '30px'} } 
      footer={ () => <span>Measurements are in mmHg</span>}
      title={() => <span style={{fontWeight: 'bold'}}>Blood Pressure</span>}
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

export default BPTable;