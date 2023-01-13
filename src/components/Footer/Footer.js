import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { getSettings } from '../Settings/Setting.action';
import { ENV } from '../../config/config';

class Footer extends Component {
	state = {}

	componentDidMount() {
		this.props.getSettings()
	}
	render() {
		const { setting } = this.props
		return (
			<footer className="footer-area">
				{/* Footer Top */}
				<div className="footer-top">
					<div className="container-fluid">
						<div className="row">
							<div className="col-md-3 res-margin">
								{/* Footer Items */}
								<div className="footer-items">
									{/* Logo */}
									<a className="navbar-brand" href="/">
										<img alt='s_img' className="img-fluid" src="images/Group 585.png" />
									</a>
								</div>
							</div>
							<div className="col-md-3 res-margin">
								{/* Footer Items */}
								<div className="footer-items">
									{/* Footer Title */}
									<ul>
										<li>
											<Link to="/">About</Link>
										</li>
										<li>
											<Link to="/">Roadmap</Link>
										</li>
										<li>
											<Link to="/"> Team</Link>
										</li>
										<li>
											<Link to="/faq">FAQ</Link>
										</li>
										<li>
											<a rel="noreferrer" target="_blank" href={`https://testnets.opensea.io/assets/${ENV.bitzNpizzaContractAddress}`}> OpenSea</a>
										</li>
									</ul>
								</div>
							</div>
							<div className="col-md-6">
								{/* Footer Items */}
								<div className="footer-items">
									<h3>
										Join Our Community
									</h3>
									<div className="footer-icons">
										{setting?.facebook && 
											<a href={setting.facebook}>
												<FontAwesomeIcon icon={faFacebook} />
												{/* <i className="fa fa-facebook fa-lg" aria-hidden="true"></i> */}
												{/* <img className="img-fluid" src="images/Group 9.svg" /> */}
											</a>
										}
										{setting?.instagram && 
											<a href={setting.instagram}>
												<FontAwesomeIcon icon={faInstagram} />
												{/* <i className="fa fa-instagram fa-lg" aria-hidden="true"></i> */}
												{/* <img className="img-fluid" src="images/Group 15.svg" /> */}
											</a>
										}
										{setting?.twitter &&
											<a href={setting.twitter}>
												<FontAwesomeIcon icon={faTwitter} />
												{/* <i className="fa fa-twitter fa-lg" aria-hidden="true"></i> */}
												{/* <img className="img-fluid" src="images/Group 12.svg" /> */}
											</a>   
										}
										{setting?.email && 
											<a href={setting.email}>
												<FontAwesomeIcon icon={faEnvelope} />
												{/* <i className="fa fa-envelope-o fa-lg" aria-hidden="true"></i> */}
												{/* <img className="img-fluid" src="images/Group 11.svg" /> */}
											</a>
										}
										{setting?.youtube && 
											<a href={setting.youtube}>
												<FontAwesomeIcon icon={faYoutube} />
												{/* <i className="fa fa-youtube fa-lg" aria-hidden="true"></i> */}
												{/* <img className="img-fluid" src="images/Group 13.svg" /> */}
											</a>
										}
										{/* {
											setting?.vine && 
											<a href={setting.vine}>
												<img className="img-fluid" src="images/Group 10.svg" />
											</a>
										} */}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/* Footer Bottom */}
				<div className="footer-bottom">
					<div className="container">
						<p>{new Date().getFullYear()}</p>
					</div>
				</div>
			</footer>
		);
	}
}

const mapStateToProps = state => ({
	setting : state.setting.setting
})

export default connect(mapStateToProps, {getSettings})(Footer);