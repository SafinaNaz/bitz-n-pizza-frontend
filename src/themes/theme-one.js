import React, { Component } from 'react';

import Banner from '../components/Banner/Banner';
import Collection from '../components/Collection/Collection';
import Create from '../components/Create/Create';
import Pizza from '../components/Pizza/Pizza';

class ThemeOne extends Component {
    render() {
        return (
            <div className="main">
                <Banner/>
                <Collection/>
                <Create/>
                <Pizza/>
            </div>
        );
    }
}

export default ThemeOne;