import React, { Component } from 'react';
import Activities from '../components/Activities/Activities';
import Indigridients from '../components/Indigredients/Indigridients';

class Marketplace extends Component {

    state={
        search:false,
        searchValue:'',
        sortingType:'',
        tabType: 'ingredient'    //ingredient, pizza
    }

searchValue=(cb)=>{
    this.setState({searchValue:cb, search:false})
}

search=(cb)=>{
    this.setState({search: cb})
}

setTabType = (type) => {
    this.setState({
        tabType: type
    })
}

setSortingType = (type) => {
    this.setState({
        sortingType: type
    })
}

render() {
        return (
            <div className="main">
                {
                    <Activities searchValue={this.searchValue} search={this.search}  setSortingType = {this.setSortingType} sortingType = {this.state.sortingType} tabType={this.state.tabType} />
                }
                <Indigridients search={this.state.search} searchValue={this.state.searchValue} setTabType={this.setTabType} sorting={this.state.sortingType.value} tabType={this.state.tabType}/>
            </div>
        );
    }
}

export default Marketplace;