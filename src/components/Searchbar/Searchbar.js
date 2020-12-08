import React, { useEffect } from 'react';
import { AutoComplete } from 'antd';
import { useStore } from '../StoreProvider';
import _ from 'lodash';

const Searchbar = (props) => {
  const store = useStore();
  const patients = _.get(store, 'store.patients', []);
  const dispatch = _.get(store, 'dispatch');
  const options = patients.map((p) => {
    return { 
      value: p.resource.name[0].family + ' ' + p.resource.name[0].given[0], 
      patient: p.resource
    }
  });
  
  const onSelect = (value, obj) => {
    dispatch({type: 'updatePatient', patient: obj.patient});
  }

  return (
    <div style={{width: '100vw'}}>
      <AutoComplete 
        options={options}
        style={{width: '1000px'}}
        filterOption
        onSelect={onSelect}
        defaultOpen={false}
      />
    </div>
  )
}

export default Searchbar;
