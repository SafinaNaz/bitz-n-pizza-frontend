import React from 'react';
import routes from './routes';
import { PrivateRoute } from './privateRoute';
import {  BrowserRouter as Router, Switch } from 'react-router-dom';

function App() {
  return (
    <React.Fragment>
      <Router >
        <Switch>
            {
              routes.map((route, index) => {
                return (
                  <PrivateRoute
                    key={index}
                    path={route.path}
                    exact={route.exact}
                    access={true}
                    component={props =>
                      <route.layout {...props} title={route.title} subpage = {route.subpage} page = {route.page}  >
                        <route.component {...props} />
                      </route.layout>
                    }
                  />
                )
              })
            }
          </Switch>
      </Router>
    </React.Fragment>
  );
}

export default App;