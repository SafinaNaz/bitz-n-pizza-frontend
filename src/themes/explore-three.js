import React, { Component } from 'react';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import Explore from '../components/Explore/ExploreFour';
class ExploreTwo extends Component {
    render() {
        return (
            <div className="main">
                <Breadcrumb title="Explore" subpage="Explore" page="Explore Style 3" />
                <Explore />
            </div>
        );
    }
}

export default ExploreTwo;