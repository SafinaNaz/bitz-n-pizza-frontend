import React, { Component } from 'react';

import Help from '../components/HelpCenter/HelpCenter';
import Faq from '../components/Faq/Faq';
class HelpCenter extends Component {
    render() {
        return (
            <div className="main">
                <Help />
                <Faq />
            </div>
        );
    }
}

export default HelpCenter;