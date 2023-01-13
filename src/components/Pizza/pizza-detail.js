import React, { useEffect, useState } from "react";
import { getPizza } from "../Cave/Cave.action";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { ENV } from "../../config/config";
import {
  TwitterIcon,
  FacebookIcon,
  FacebookShareButton,
  TwitterShareButton,
} from "react-share";
import PizzaAttribute from "./pizza-attributes";
import { getOwnerOfNFT } from "../../utils/web3";
import FullPageLoader from "../FullPageLoader/FullPageLoader";

const PizzaDetail = (props) => {
  const { id } = useParams();
  const [pizzaDetail, setPizzaDetail] = useState();
  const [attributes, setAttributes] = useState();
  const [pizzaId, setPizzaId] = useState();
  const [ownerAddress, setOwnerAddress] = useState();
  const [fullPageLoader, setFullPageLoader] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    props.getPizza(id);
  }, []);

  useEffect(() => {
    if (props.error) {
      props.history.push("/marketplace");
      setError(props.error);
    }
  }, [props.error]);

  useEffect(() => {
    if (props.pizzas.getPizzaDetail) {
      setFullPageLoader(false);
      const { pizzaDetail } = props.pizzas;
      setPizzaDetail(pizzaDetail.pizza[0]);
      setPizzaId(pizzaDetail.pizza[0]._pizzaId);
      setAttributes(pizzaDetail.pizzaAttributes);
    }
  }, [props.pizzas.getPizzaDetail]);

  useEffect(async () => {
    if (pizzaId) {
      let ownerData = await getOwnerOfNFT(pizzaId);
      setOwnerAddress(ownerData);
    }
  }, [pizzaId]);

  // url to be shared on social media
  // const shareUrl = `${ENV.domainURL}${props.match.url}`;
  const shareUrl = "https://bitznpizzas.arhamsoft.org/";

  return (
    <>
      {fullPageLoader && <FullPageLoader />}
      <div className="cave"></div>
      <div className="main-wrapper reward-detail">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-5">
              <div className="product-info">
                <div className="image">
                  <img
                    src={pizzaDetail && pizzaDetail.image}
                    alt=""
                    className="img-fluid"
                  />
                </div>
                <div className="product-info pizza-description">
                  <div className="discription-head">Description</div>
                  <div className="mt-3">
                    {attributes && attributes.description}
                  </div>
                </div>
                <div className="product-info pizza-creation">
                  <div className="discription-head">CreatedBy</div>
                  <div className="mt-3">
                    {pizzaDetail && pizzaDetail.creatorAddress}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-7">
              <div className="product-info">
                <div className="row ">
                  <div className="col-md-12">
                    <div className="pizza-head">
                      {attributes && attributes.name}
                    </div>
                    <div>Owned By: {ownerAddress}</div>
                  </div>
                </div>
              </div>
              <div className="product-info mt-5">
                <div className="row ">
                  <div className="col-md-12 d-flex pizza-detail">
                    <div class="dropdown show ">
                      <a
                        class="btn"
                        href="#"
                        id="dropdownMenuLink"
                        data-toggle="dropdown"
                      >
                        <i className="fa fa-share"></i>
                      </a>
                      <div
                        class="dropdown-menu"
                        aria-labelledby="dropdownMenuLink"
                      >
                        <a class="dropdown-item">
                          <FacebookShareButton url={shareUrl}>
                            <FacebookIcon size={32} round />
                          </FacebookShareButton>
                        </a>
                        <a class="dropdown-item">
                          <TwitterShareButton url={shareUrl}>
                            <TwitterIcon size={32} round />
                          </TwitterShareButton>
                        </a>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary"
                      title="Link to Token"
                      onClick={() => window.open(pizzaDetail.contentIpfs)}
                    >
                      <i className="fa fa-link"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      title="Contract"
                      onClick={() =>
                        window.open(
                          `${ENV.blockChainExplorer}/${ENV.bitzNpizzaContractAddress}`
                        )
                      }
                    >
                      <i className="fa fa-attachment"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      title="OpenSea Link"
                      onClick={() =>
                        window.open(
                          `${ENV.openSeaBaseUrl}/${ENV.bitzNpizzaContractAddress}/${pizzaDetail._pizzaId}`
                        )
                      }
                    >
                      <i className="fa fa-link"></i>
                    </button>
                  </div>
                </div>
              </div>
                <div className="product-info mt-5">
                  <div className="discription-head">Properties</div>
                  <div className="row mt-3">
                    {attributes &&
                      attributes.attributes.map((attribute) => (
                        <div className="col-md-4 mt-4">
                          <PizzaAttribute props={attribute} />
                        </div>
                      ))}
                  </div>
                </div>
            </div>
          </div>
          <div className="Row mt-5"></div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    pizzas: state.cave,
    error: state.error.error,
  };
};

export default connect(mapStateToProps, { getPizza })(PizzaDetail);
