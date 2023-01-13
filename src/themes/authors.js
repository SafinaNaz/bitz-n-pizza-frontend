import React, { Component } from 'react';
import Author from '../components/Authors/Authors';
import TopSeller from '../components/TopSeller/TopSellerTwo';
class Authors extends Component {
    render() {
        return (
            <div className="main">
                <Author />
                <TopSeller />
            </div>
        );
    }
}

export default Authors;