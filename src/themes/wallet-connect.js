import React, { Component } from 'react';
import Wallet from '../components/Wallet/Wallet';
import { connect } from 'react-redux';

class WalletConnect extends Component {
    
    render() {
        return (
            <div className="main">
                <Wallet history = {this.props.history} />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    wallet: state.wallet.accountAddress
})

export default connect(mapStateToProps, {})(WalletConnect);