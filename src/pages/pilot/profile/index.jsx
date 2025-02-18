import { PlusOutlined } from "@ant-design/icons";
import { Button, Modal, Upload, Input, message, Row, Col, Tooltip, Slider } from "antd";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCertficateListByPilot, getPilotProfile, updatePilotProfile, uploadCertificateFileByPilot } from "../../../store/user/userSlice";

import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "mapbox-gl/dist/mapbox-gl.css";
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

const PilotProfileEdit = () => {
    const [certFile, setCertFile] = useState(null);
    const [certName, setCertName] = useState("");
    const [address, setAddress] = useState("");
    const [radius, setRadius] = useState(0);
    const [center, setCenter] = useState();
    const [zoomLevel, setZoomLevel] = useState(1);
    const [isCertsModalOpen, setIsCertsModalOpen] = useState(false);
    const [isCertDetailOpen, setIsDetailOpen] = useState(false);
    const [currentCertFileUrl, setCurrentCertFileUrl] = useState("");
    const [map, setMap] = useState();
    const mapNode = useRef(null);
    const addressInputRef = useRef(null);

    const certList = useSelector(store => store.user.certList);
    const user = useSelector(store => store.user.user);

    const dispatch = useDispatch();

    const uploadProps = {
        onRemove: (file) => {
            setCertFile();
        },
        beforeUpload: (file, files) => {
            setCertFile(file);
            return false;
        },
        fileList: certFile ? [certFile] : [],
    }

    const handleSaveCert = () => {
        if (!certFile) {
            message.info("Select a Certificate File.");
            return;
        }
        if (!certName) {
            message.info("Input a Certificate Name");
            return;
        }
        dispatch(uploadCertificateFileByPilot({ userId: user._id, file: certFile, name: certName }));
    }

    const handleDBClickCert = (path) => {
        setCurrentCertFileUrl(path);
        setIsDetailOpen(true);
    }

    const handleAddressChange = (e) => {
        let addr = e.target.value;

        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(addr)}.json?country=us&access_token=${import.meta.env.VITE_PUBLIC_MAPBOX_TOKEN}`;

        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                const features = data.features;

                if (features.length > 0) {
                    const firstSuggestion = features[0].place_name;

                    // Check if the first suggestion starts with the user's current input
                    if (firstSuggestion.toLowerCase().startsWith(address.toLowerCase())) {
                        // Set the completion text (highlight it as auto-filled)
                        const completion = firstSuggestion.substring(address.length);

                        // Don't overwrite the user's current input; append only the completed part

                        setAddress(address + completion);

                        requestAnimationFrame(() => {
                            console.log(address?.length, address?.length + completion.length);

                            addressInputRef.current.setSelectionRange(address?.length, address?.length + completion.length);
                        });

                        // Restore the cursor position to where the user was typing
                        setCenter(features[0].geometry.coordinates);
                        map.flyTo({ center: features[0].geometry.coordinates, zoom: 10 });
                    }
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        let address = e.target.value;
        setAddress(address);
    }

    const handleSaveProfileData = () => {
        const updatedData = {
            _id: user._id,
            u_operation_radius: radius,
            u_address: address
        };

        dispatch(updatePilotProfile(updatedData));
    }   

    const handleZoomChange = () => {
        if (map) {
            const currentZoom = map.getZoom();
            setZoomLevel(currentZoom);  // Update the zoom level in state
            drawCircleOnMap(map.getCenter(), radius);  // Redraw the circle with updated zoom
        }
    };

    // Function to convert meters to pixels based on zoom level
    const metersToPixels = (meters, zoomLevel) => {
        // 1 pixel at zoom level 0 covers an area of around 156,543 meters at the equator.
        const earthCircumference = 40008000; // Earth's circumference in meters
        const metersPerPixel = earthCircumference / Math.pow(2, zoomLevel + 8); // Conversion factor

        return meters * 1000 / metersPerPixel; // Convert meters to map units (pixels)
    };

    const drawCircleOnMap = (center, radiusInMeters) => {
        if (map) {
            // Remove any existing circle
            if (map.getLayer('circle-layer')) {
                map.removeLayer('circle-layer');
                map.removeSource('circle-source');
            }

            // Create a new source and layer for the circle
            const circleSource = {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: center,
                    },
                },
            };

            map.addSource('circle-source', circleSource);

            const radiusInPixels = metersToPixels(radiusInMeters, map.getZoom());

            map.addLayer({
                id: 'circle-layer',
                type: 'circle',
                source: 'circle-source',
                paint: {
                    'circle-radius': radiusInPixels / 2, // Convert the radius to match map units (pixels)
                    'circle-color': '#FF5733',           // Color of the circle
                    'circle-opacity': 0.5                // Transparency of the circle
                },
            });
        }
    };

    useEffect(() => {
        if (center && radius) {
            drawCircleOnMap(center, radius);
        }
    }, [dispatch, radius, zoomLevel, map]);

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

        // Initialize Mapbox Draw tool
        const draw = new MapboxDraw({
            displayControlsDefault: false,                                          // Disable default controls
            controls: {
                polygon: true,                                                      // Enable polygon drawing
                trash: true                                                         // Enable trash (delete) button
            }
        });

        mapboxMap.addControl(draw);                                                 // Add the draw control to the map

        // Listen for drawing events and update geometry state
        mapboxMap.on('draw.create', updateArea);
        mapboxMap.on('draw.delete', updateArea);
        mapboxMap.on('draw.update', updateArea);

        // Update area function called on drawing or updating polygons
        function updateArea() {
            const data = draw.getAll();                                             // Get all the drawn geometries
            if (data.features.length > 0) {
                setGeometry(data.features);                                         // Store the drawn polygon in the state
            } else {
                console.log('No polygon selected');                                 // Log message if no polygon is drawn
            }
        }

        setMap(mapboxMap);                                                          // Set the map instance in state

        return () => {
            mapboxMap.remove();                                                     // Cleanup the map on component unmount
        };
    }, []);

    useEffect(() => {
        if (user._id) {
            dispatch(getCertficateListByPilot(user._id));
            dispatch(getPilotProfile(user._id));
        }
    }, [dispatch, user._id])

    return (
        <div className="container">
            <div className="page-header">
                <span className="page-subtitle">My Profile</span>
            </div>
            <div className="pilot-profile-container">
                <div className="pilot-profile-detail">
                    <div className="pilot-profile-detail-item">
                        <span>Pilot Name: </span>
                        <span>{user.u_username}</span>
                    </div>
                    <div className="pilot-profile-detail-item">
                        <span>Pilot Email: </span>
                        <span>{user.u_email}</span>
                    </div>
                    <div className="pilot-profile-detail-item">
                        <span>Pilot Operational Area: </span>
                        <span>{`${user.u_address || ""} ${user.u_operation_radius || 0} KMs`}</span>
                    </div>
                    <Input
                        placeholder="Address"
                        onChange={handleAddressChange}
                        value={address}
                        ref={addressInputRef}
                        style={{ marginBottom: 16 }}
                    />
                    <Button block type="primary" onClick={handleSaveProfileData}>Save</Button>
                </div>
                <div className="pilot-profile-address-map">
                    <div ref={mapNode} className="pilot-address-map-container" />
                    <div className="profile-address-radius">
                        <label className="radius-label">Operation Radius</label>
                        <Slider min={0} max={1000} onChange={value => setRadius(value)} value={radius} />
                    </div>
                    <div className="pilot-certificate-container">
                        <div className="pilot-certificate-header">
                            <span>My Certificates</span>
                            <Button size="small" type="primary" icon={<PlusOutlined />} onClick={() => setIsCertsModalOpen(true)}>
                                Add a Certificate
                            </Button>
                        </div>
                        <Row>
                            {
                                certList.map(item => {
                                    return (
                                        <Col span={24} xs={24} sm={12} md={8} lg={8} xl={6} xxl={4} key={item?.path}>
                                            <Tooltip title={item?.name}>
                                                <div className="pilot-cert-item" onDoubleClick={() => handleDBClickCert(item?.path)}>
                                                    <img src={`${import.meta.env.VITE_PUBLIC_API_URL}/images/certs/${item?.path}`} alt={item?.name} />
                                                </div>
                                            </Tooltip>
                                        </Col>
                                    )
                                })
                            }
                        </Row>
                    </div>
                </div>
            </div>
            <Modal open={isCertsModalOpen} onCancel={() => setIsCertsModalOpen(false)} onOk={handleSaveCert}>
                <Upload {...uploadProps} multiple>
                    <Input placeholder="Certificate File" style={{ cursor: 'pointer' }} readOnly value={certFile?.name} addonAfter="Select Files" />
                </Upload>
                <Input onChange={e => setCertName(e.target.value)} style={{ marginTop: 12 }} value={certName} placeholder="Certificate Name" />
            </Modal>
            <Modal
                open={isCertDetailOpen}
                onOk={() => setIsDetailOpen(false)}
                onCancel={() => setIsDetailOpen(false)}
                title="Certficate Detail"
                width={1000}
            >
                <div className="cert-image-zoom">
                    <img src={`${import.meta.env.VITE_PUBLIC_API_URL}/images/certs/${currentCertFileUrl}`} />
                </div>
            </Modal>
        </div>
    )
}

export default PilotProfileEdit;