import React, { Component } from 'react';

import ItemDetail from '../components/ItemDetails/ItemDetails';
import LiveAuctions from '../components/Auctions/AuctionsThree';
class ItemDetails extends Component {
    render() {
        return (
            <div className="main">
                <ItemDetail />
                <LiveAuctions />
            </div>
        );
    }
}

export default ItemDetails;