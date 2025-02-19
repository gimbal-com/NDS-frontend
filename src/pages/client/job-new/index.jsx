import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Input, InputNumber, message } from "antd";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
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

  // Flag to skip autocomplete when backspace is pressed.
  const skipAutocompleteRef = useRef(false);
  // Ref to store the current selection (cursor) position.
  const selectionRef = useRef({ start: 0, end: 0 });

  const dispatch = useDispatch();
  const user = useSelector((store) => store.user.user);

  const handleSubmit = () => {
    if (title && description && address && budget) {
      dispatch(
        createJobByClient({
          title,
          description,
          address,
          budget,
          geometry: JSON.stringify(geometry),
          userId: user._id,
        })
      );
      setAddress("");
      setTitle("");
      setDecsription("");
      setBudget(0);
      setGeometry(null);
    } else {
      message.warning("Please input all fields");
    }
  };

  // Capture key down events for backspace and tab.
  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      // When Tab is pressed, prevent the default tab behavior,
      // accept the auto-completion, and move the caret to the end.
      e.preventDefault();
      if (addressInputRef.current) {
        const input = addressInputRef.current;
        // Move the caret to the end of the input.
        input.setSelectionRange(address.length, address.length);
        // Update our selection ref.
        selectionRef.current = { start: address.length, end: address.length };
      }
      return;
    }
    if (e.key === "Backspace") {
      skipAutocompleteRef.current = true;
    }
  };

  // Capture selection changes so we can restore the cursor position.
  const handleSelect = (e) => {
    selectionRef.current = {
      start: e.target.selectionStart,
      end: e.target.selectionEnd,
    };
  };

  const handleAddressChange = (e) => {
    const newAddress = e.target.value;

    // If the user is deleting (backspace pressed), skip auto-completion.
    if (skipAutocompleteRef.current) {
      skipAutocompleteRef.current = false; // reset the flag
      setAddress(newAddress);
      return;
    }

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      newAddress
    )}.json?country=us&access_token=${import.meta.env.VITE_PUBLIC_MAPBOX_TOKEN}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const features = data.features;

        if (features.length > 0) {
          const firstSuggestion = features[0].place_name;

          // Only autocomplete if the suggestion starts with what the user typed.
          if (firstSuggestion.toLowerCase().startsWith(newAddress.toLowerCase())) {
            const completion = firstSuggestion.substring(newAddress.length);

            // Update the state to include the completion.
            setAddress(newAddress + completion);

            // Highlight the auto-completed text so the user can easily overwrite it.
            requestAnimationFrame(() => {
              if (addressInputRef.current) {
                addressInputRef.current.setSelectionRange(
                  newAddress.length,
                  newAddress.length + completion.length
                );
                // Update our selection ref with the new selection.
                selectionRef.current = {
                  start: newAddress.length,
                  end: newAddress.length + completion.length,
                };
              }
            });

            //fly to the location on the map.
            
            map.flyTo({ center: features[0].geometry.coordinates, zoom: 10 });
          }
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    // Always update the state with the latest input value.
    setAddress(newAddress);
  };

  // Preserve the cursor position on every address update.
  useEffect(() => {
    const input = addressInputRef.current;
    if (input && document.activeElement === input) {
      input.setSelectionRange(selectionRef.current.start, selectionRef.current.end);
    }
  }, [address]);

  // Initialize the map and Mapbox Draw tool.
  useEffect(() => {
    const node = mapNode.current;
    if (typeof window === "undefined" || node === null) return;

    const mapboxMap = new mapboxgl.Map({
      container: node,
      accessToken: import.meta.env.VITE_PUBLIC_MAPBOX_TOKEN,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-74.5, 40],
      zoom: 3,
    });

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
    });

    mapboxMap.addControl(draw);

    mapboxMap.on("draw.create", updateArea);
    mapboxMap.on("draw.delete", updateArea);
    mapboxMap.on("draw.update", updateArea);

    function updateArea() {
      const data = draw.getAll();
      if (data.features.length > 0) {
        setGeometry(data.features);
      } else {
        console.log("No polygon selected");
      }
    }

    setMap(mapboxMap);

    return () => {
      mapboxMap.remove();
    };
  }, []);

  return (
    <div className="container">
      <div className="page-header">
        <span className="sub-title">Create a New Job</span>
        <Link to="/client/jobs">
          <Button icon={<ArrowLeftOutlined />} type="primary">
            Return to List
          </Button>
        </Link>
      </div>
      <div className="job-new-content">
        <div className="job-new-form">
          <Input
            value={title}
            className="job-input"
            placeholder="Job Title"
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input.TextArea
            value={description}
            className="job-input"
            placeholder="Job Description"
            onChange={(e) => setDecsription(e.target.value)}
            rows={4}
          />
          <InputNumber
            value={budget}
            className="job-input"
            placeholder="Budget"
            onChange={(value) => setBudget(value)}
          />
          <Input
            className="job-input"
            placeholder="Address"
            onChange={handleAddressChange}
            onKeyDown={handleKeyDown}
            onSelect={handleSelect}
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
  );
};

export default ClientJobNewPage;
