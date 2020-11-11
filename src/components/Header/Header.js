import React from 'react';
import classes from './Header.module.scss';

const Header = (props) => {
  return (
    <header className={classes.header}>
      <img src={props.logo} alt="logo" />
    </header>
  );
};

export default Header;
