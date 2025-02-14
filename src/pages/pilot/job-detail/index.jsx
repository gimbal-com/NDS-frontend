import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Input, InputNumber, message, Modal } from "antd";
import { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "mapbox-gl/dist/mapbox-gl.css";
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import { createJobByClient, getJobDetailByPliot } from "../../../store/job/jobSlice";

const PilotJobDetail = () => {

  const { id } = useParams();
  const userId = useSelector(store => store.user.user._id);

  const jobDetail = useSelector(store => store.job.jobDetail);

  const [map, setMap] = useState();
  const [isClaimDialogOpen, setIsClaimDialogOpen] = useState(false);

  const [jobCreatorId, setJobCreatorId] = useState('');
  const [jobId, setJobId] = useState('');
  const [claimContent, setClaimContent] = useState('');
  const [claimerId, setClaimerId] = useState('');

  const mapNode = useRef(null);

  const dispatch = useDispatch();
  const user = useSelector(store => store.user.user);

  const handleClaim = () => {
    setIsClaimDialogOpen(true);
  }

  const handleSubmit = () => {
    if (jobCreatorId && jobId && claimContent && claimerId) {
      dispatch(createJobByClient({ jobCreatorId, jobId, claimContent, claimerId }));
    } else {
      message.warning("Please input claim content");
    }
    setIsClaimDialogOpen(false);
  }

  const handleAddressChange = (e) => {
    let addr = e;

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(addr)}.json?country=us&access_token=${import.meta.env.VITE_PUBLIC_MAPBOX_TOKEN}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const features = data.features;

        if (features.length > 0) {
          const firstSuggestion = features[0].place_name;
          console.log("@@@@@@@@@@>>>>>>>>>>>>>>>>>>>>");


          // Check if the first suggestion starts with the user's current input
          if (firstSuggestion.toLowerCase().startsWith(addr.toLowerCase())) {

            // Restore the cursor position to where the user was typing
            map.flyTo({ center: features[0].geometry.coordinates, zoom: 10 });
          }
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  // useEffect hook for initializing the map and Mapbox Draw tool
  useEffect(() => {
    const node = mapNode.current;                                               // Get the map container DOM node

    if (typeof window === 'undefined' || node === null) return;                 // Check if the window object is available (to avoid issues during SSR)

    // Initialize the Mapbox map with default settings
    const mapboxMap = new mapboxgl.Map({
      container: node,
      accessToken: import.meta.env.VITE_PUBLIC_MAPBOX_TOKEN,                      // Access token for Mapbox
      style: 'mapbox://styles/mapbox/streets-v11', // Map style
      center: [-74.5, 40],                                                    // Default map center (longitude, latitude)
      zoom: 3                                                                 // Default zoom level
    });

    setMap(mapboxMap);

    if (id) {
      dispatch(getJobDetailByPliot(id));
    }// Set the map instance in state

    return () => {
      mapboxMap.remove();                                                     // Cleanup the map on component unmount
    };
  }, []);

  useEffect(() => {
    if (jobDetail.j_address !== undefined) {
      setClaimerId(userId);
      setJobId(jobDetail._id);
      setJobCreatorId(jobDetail.j_creator.u_email)
      handleAddressChange(jobDetail.j_address);
    }
  }, [jobDetail]);

  return (
    <div className="container">
      <div className="page-header">
        <span className="sub-title">Job description</span>
        <Link to='/pilot/jobs'>
          <Button icon={<ArrowLeftOutlined />} type="primary">Return to List</Button>
        </Link>
      </div>
      <div className="job-new-content">
        <div className="job-new-form">
          <div className="job-new-content">
            <label className="job-detail-title">title: </label>
            <label className="job-detail-content">{jobDetail.j_title}</label>
          </div>
          <div className="job-new-content">
            <label className="job-detail-title">description: </label>
            <label className="job-detail-content">{jobDetail.j_description}</label>
          </div>
          <div className="job-new-content">
            <label className="job-detail-title">budget: </label>
            <label className="job-detail-content">{jobDetail.j_budget}</label>
          </div>
          <div className="job-new-content">
            <label className="job-detail-title">address: </label>
            <label className="job-detail-content">{jobDetail.j_address}</label>
          </div>
          {
            jobDetail?.j_creator &&
            <div className="job-new-content">
              <label className="job-detail-title">creator: </label>
              <label className="job-detail-content">{jobDetail.j_creator.u_email}</label>
            </div>
          }
          <Button
            type="primary"
            onClick={handleClaim}
            className="job-claim-button"
          >
            Claim
          </Button>
        </div>
        <div className="job-new-map">
          <div ref={mapNode} className="job-new-map-container" />
        </div>
      </div>
      <Modal
        open={isClaimDialogOpen}
        title="Message"
        onOk={handleSubmit}
        onCancel={() => setIsClaimDialogOpen(false)}
      >
        <Input.TextArea
          value={claimContent}
          className="job-input"
          placeholder="Job Description"
          onChange={e => setClaimContent(e.target.value)}
          rows={4}
        />
      </Modal>
    </div>
  )
}

export default PilotJobDetail;