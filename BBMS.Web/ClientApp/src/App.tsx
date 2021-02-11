import * as React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import Counter from './components/Counter';
import FetchData from './components/FetchData';
import BloodTransaction from './pages/BloodTransaction/list';
import SignupDonor from './pages/SignupDonor/create';

import './pages/custom.css'

export default () => (
    <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/bloodtransaction/:page?' component={BloodTransaction} />
        <Route path='/blooddonor/signup' component={SignupDonor} />
        {/* <Route path='/blooddonor/signupsuccess' render={(props) => <SignupDonorSuccess {...props} />} /> */}
        <Route path='/counter' component={Counter} />
        <Route path='/fetch-data/:startDateIndex?' component={FetchData} />
    </Layout>
);
