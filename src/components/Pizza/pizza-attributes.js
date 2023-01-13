import React from 'react'

function PizzaAttribute(props) {
    return (
        <div className="product-info-1">
            <div className="ingredients-head">{props.props.trait_type}</div>
            <div className='ingNM'>{props.props.value}</div>
            <div className='ingNM'>{props?.props?.percent}% have this trait</div>
        </div>
    )
}

export default PizzaAttribute
