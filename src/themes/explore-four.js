import React, { Component } from 'react';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import Explore from '../components/Explore/ExploreFive';
class ExploreFour extends Component {
    render() {
        return (
            <div className="main">
                <Breadcrumb title="Explore" subpage="Explore" page="Explore Style 4" />
                <Explore />
            </div>
        );
    }
}

export default ExploreFour;