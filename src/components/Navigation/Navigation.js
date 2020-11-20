import React, { FC, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import PatientSnapshot from '../PatientSnapshot';

import classes from './Navigation.module.scss';



const Navigation = (props) => {
  // const [pathway, setPathway] = useState<Option | ReadonlyArray<Option> | null>(null);

  // const onChangeHandler = (pathway: Option | ReadonlyArray<Option> | null): void => {
  //   setPathway(pathway);
  // };

  return (
    <nav className={classes.navigation}>
      <div className={classes['navigation__left-panel']}>
        <PatientSnapshot />
      </div>

      <div className={classes['navigation__right-panel']}>
       <div>{`Fetched ${props.resourcesLength ? props.resourcesLength : 0} resources`}</div>
      </div>
    </nav>
  );
};

export default Navigation;
