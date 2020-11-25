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

const BGSummary = ({ store, loading, client, dispatch, encounter }) => {
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
                  style={{justifyContent: 'space-between'}}
                  rowClassName='bg-cell'
                  className='statisticsTable'
              />
}

export default BGSummary;
