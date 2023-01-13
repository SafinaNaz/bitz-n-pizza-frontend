import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getFaqs } from './Faq.action';

class Faq extends Component {
    state = {}

    componentDidMount(){
        window.scrollTo(0, 0);
        this.props.getFaqs()
    }

    render() {
        const { faqs } = this.props
        return (
            <section className="faq-area">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-8 col-lg-7">
                            {/* Intro */}
                            <div className="intro text-center">
                                <span>FAQ</span>
                                <h3 className="mt-3 mb-0">Frequently Asked Questions</h3>
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum obcaecati dignissimos quae quo ad iste ipsum officiis deleniti asperiores sit.</p>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-12">
                            {/* FAQ Content */}
                            <div className="faq-content">
                                {/* Netstorm Accordion */}
                                <div className="accordion" id="netstorm-accordion">
                                    <div className="row justify-content-center">
                                        <div className="col-12 col-md-10">
                                            {/* Single Accordion Item */}
                                            { faqs && faqs.map((faq, idx) => {
                                                return (
                                                    <div key={`fd_${idx}`} className="single-accordion-item p-3">
                                                        {/* Card Header */}
                                                        <div className="card-header bg-inherit border-0 p-0">
                                                            <h2 className="m-0">
                                                                <button className={`btn d-block text-left w-100 py-4 ${idx !== 0 && "collapsed"}`} type="button" data-toggle="collapse" data-target={`#collapse${idx}`}>
                                                                    {faq.question}
                                                                </button>
                                                            </h2>
                                                        </div>
                                                        <div id={`collapse${idx}`} className={`collapse  ${idx === 0 && "show"}`} data-parent="#netstorm-accordion">
                                                            {/* Card Body */}
                                                            <div className="card-body py-3" dangerouslySetInnerHTML={{__html: faq?.answer}}>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

const mapStateToProps = state => ({
    faqs: state.faq.faqs
})

export default connect(mapStateToProps, { getFaqs })(Faq);