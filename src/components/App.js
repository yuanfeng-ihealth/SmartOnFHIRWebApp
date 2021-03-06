import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Home from './Home';
import Launcher from './Launcher';
import LoginPage from './Login/loginPage';

const App = () => {
  return (
  <Router>
    <Route path="/login" component={LoginPage} />
    <Route path="/app" component={Home} />
    <Route path="/" component={Launcher} exact />
  </Router>
  );
};

export default App;
