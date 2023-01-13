import React, { useState, useEffect} from "react";
import { connect } from 'react-redux';
import { getArtists, beforeArtists} from './Artist.action';
import FullPageLoader from '../FullPageLoader/FullPageLoader'

const Artist = (props) => {
    
    const [artistList, setArtistList] = useState([])
    const [page, setPage] = useState(1)

    //state to manage Loader
    const [fullLoader, setFullLoader] = useState(true)

    useEffect(() => {
        props.beforeArtists()
        props.getArtists()
    }, [])

    useEffect(()=> {
        setFullLoader(false)
        if(props?.artists?.artists?.length){
            setArtistList(props?.artists?.artists)
        }
    }, [props?.artists?.artists])

    const hanldeLoadMore=()=>{
        setFullLoader(true)
        setPage(prevState => prevState + 1);
        props.getArtists(`page=${page + 1}`)
    }

    return (
        <>
            {
                fullLoader &&
                    <FullPageLoader />
            }
            <div className="cave"></div>
            <div className="main-wrapper artist">
                <div className="container-fluid">
                    <div className="heading">
                        <h1>Meet Artists.</h1>
                        <p>MEET OUR AWESOME ARTISTS</p>
                    </div>
                    <div className="content-wrapper">
                        <div className="row">
                            {
                                artistList?.map((artist, index) => {
                                  return (
                                    <div className="col-md-6" key={artist._id}>
                                        <div className="item-wrapper">
                                            <div className="image">
                                                <img src={artist?.image} alt="artist_img" className="img-fluid" onError={(e)=>{e.target.onerror = null; e.target.src = "images/artist.png"}} />
                                            </div>
                                            <div className="content">
                                                <div>
                                                    <h3>{artist?.name}</h3>
                                                    <div className="artist-descrption" dangerouslySetInnerHTML={{__html: artist?.description}}></div>
                                                </div>
                                                {artist.learnMore && 
                                                    <div className="link">
                                                        <a href={artist?.learnMore} target="_blank" rel="noreferrer"> SEE MORE WORK</a>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                  )
                                })
                            }
                            {
                                props?.pagination?.pages > page &&
                                    <div className="col-12">
                                        <div className="head-button text-center mb-3">
                                            <button type="button" className="btn btn-primary" onClick={()=>{hanldeLoadMore()}}>Load More</button>
                                        </div>
                                    </div>
                                }
                            {
                                !artistList?.length && <div className="not-found"><p>Artists not found.</p></div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const mapStateToProps = state => ({
    artists: state.artist,
    pagination:state?.artist?.pagination,
})

export default connect(mapStateToProps, { getArtists, beforeArtists })(Artist);