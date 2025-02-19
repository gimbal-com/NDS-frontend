import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Input, InputNumber, message } from "antd";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "mapbox-gl/dist/mapbox-gl.css";
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import { createJobByClient } from "../../../store/job/jobSlice";

const ClientJobNewPage = () => {
    const [map, setMap] = useState();
    const [geometry, setGeometry] = useState();
    const [title, setTitle] = useState("");
    const [description, setDecsription] = useState("");
    const [address, setAddress] = useState("");
    const [budget, setBudget] = useState(null);
    const mapNode = useRef(null);

    const addressInputRef = useRef(null);

    const dispatch = useDispatch();
    const user = useSelector(store => store.user.user);

    const handleSubmit = () => {
        if (title && description && address && budget) {
            dispatch(createJobByClient({ title, description, address, budget, geometry: JSON.stringify(geometry), userId: user._id }));
            setAddress("");
            setTitle("");
            setDecsription("");
            setBudget(0);
            setGeometry(null);
        } else {
            message.warning("Please input all fields");
        }
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

                        const cursorPosition = address.length;
                        
                        requestAnimationFrame(() => {
                            console.log(address?.length, address?.length + completion.length);
                            
                            addressInputRef.current.setSelectionRange(cursorPosition, cursorPosition + completion.length);                          
                        });

                        // Restore the cursor position to where the user was typing
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


    return (
        <div className="container">
            <div className="page-header">
                <span className="sub-title">Create a New Job</span>
                <Link to='/client/jobs'>
                    <Button icon={<ArrowLeftOutlined />} type="primary">Return to List</Button>
                </Link>
            </div>
            <div className="job-new-content">
                <div className="job-new-form">
                    <Input
                        value={title}
                        className="job-input"
                        placeholder="Job Title"
                        onChange={e => setTitle(e.target.value)}
                    />
                    <Input.TextArea
                        value={description}
                        className="job-input"
                        placeholder="Job Description"
                        onChange={e => setDecsription(e.target.value)}
                        rows={4}
                    />
                    <InputNumber
                        value={budget}
                        className="job-input"
                        placeholder="Budget"
                        onChange={value => setBudget(value)}
                    />
                    <Input
                        className="job-input"
                        placeholder="Address"
                        onChange={handleAddressChange}
                        value={address}
                        ref={addressInputRef}
                    />
                    <Button
                        type="primary"
                        onClick={handleSubmit}
                        className="job-submit-button"
                    >
                        Submit
                    </Button>
                </div>
                <div className="job-new-map">
                    <div ref={mapNode} className="job-new-map-container" />
                </div>
            </div>
        </div>
    )
}

export default ClientJobNewPage;