import React, { Component } from 'react';
import LiveAuctions from '../components/Auctions/AuctionsTwo';
class Auctions extends Component {
    render() {
        return (
            <div className="main">
                <LiveAuctions />
            </div>
        );
    }
}

export default Auctions;