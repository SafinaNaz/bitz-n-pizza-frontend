import React from "react";
import Select from 'react-select';


const Activities = (props) => {

    return (
        <div className="activity">
            <div className="about-activity">
                <h1>
                    Buy Ingredients
                </h1>
                {
                    props.tabType === "ingredient" && 
                    <div className="container">
                        <div className="row">
                            <div className="main-activity">
                                <div className="form-inline my-form">
                                    <form onSubmit={(e)=> { e.preventDefault(); props.search(true)}}>
                                        <input className="form-control about-form mr-sm-2" onChange={(e)=>{props.searchValue(e.target.value)}} type="text" placeholder="Search..." aria-label="Search" />
                                        <span onClick={() => props.search(true)}><img className="img-fluid" src="images/Icon feather-search.svg" alt="img"/></span>
                                    </form>
                                </div>
                                <div className="dropdown slct-dropdown">
                                    <Select className=" about-form"
                                        value={props.sortingType}
                                        onChange={(e)=>{
                                            props.setSortingType(e)
                                            props.search(true)
                                        }}
                                        options={[
                                            { value: 'ascending', label: 'Ascending' },
                                            { value: 'descending', label: 'Descending' }
                                        ]}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};

export default Activities;