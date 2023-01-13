import React, { useState } from 'react';
import Cave from '../components/Cave/Cave';

const PizzaCave = (props) => {
    const [forceRender, setForceRender] = useState(false);

    return (
        <div className="main">
            <Cave props={props} forceRender = {forceRender} setForceRender={setForceRender} />
        </div>
    );
}

export default PizzaCave;