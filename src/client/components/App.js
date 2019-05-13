import React from 'react';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import NewsListPage from './NewsListPage';
import NewsDetailsPage from './NewsDetailsPage';
import NotFoundPage from './NotFoundPage';
import ApplicationLayout from './ApplicationLayout';
import mainTheme from '../theme';

const App = ({ history }) => (
  <React.Fragment>
    <CssBaseline />
    <ConnectedRouter history={history}>
      <MuiThemeProvider theme={mainTheme}>
        <ApplicationLayout>
          <Switch>
            <Route path='/' exact={true} component={NewsListPage} />
            <Route path='/news/:id' exact={true} component={NewsDetailsPage} />

            <Route component={NotFoundPage} />
          </Switch>
        </ApplicationLayout>
      </MuiThemeProvider>
    </ConnectedRouter>
  </React.Fragment>
);

export default App;
