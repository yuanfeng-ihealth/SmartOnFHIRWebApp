import React from "react";
import { useHistory } from "react-router-dom";
import '../../App.scss'
import { Button, Input } from 'antd';
import { ReactComponent as Logo } from '../../logos/sharecare-logo.svg';

const LoginPage = (props) => {
   
  let history = useHistory();

  const login = () => {
    history.push({pathname: '/app'})
  }

  return (
      <div className='loginContainer'>
        {console.log(props)}
        <div className='loginPanel'>
          <div className='sharecare-logo'>
            <Logo />
          </div>
          <Input placeholder="Username"></Input>
          <Input placeholder="Password"></Input>
          <Button type='primary' className='loginButton' onClick={() => login()}>Login</Button>
        </div>
      </div>
  )
}

export default LoginPage;
