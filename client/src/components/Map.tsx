import React from "react";
import { MdGpsFixed } from "react-icons/md";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

interface MapProps {
  latitude: number;
  longitude: number;
}

const CenterButton: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
  const map = useMap();

  const handleClick = () => {
    map.setView([lat, lng], 18);
  };

  return (
    <button
      onClick={handleClick}
      style={{
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 1000,
        padding: "8px 12px",
        backgroundColor: "#fff",
        border: "1px solid #ccc",
        borderRadius: 4,
        cursor: "pointer",
      }}
    >
      <MdGpsFixed fontSize={20} />
    </button>
  );
};

const Map: React.FC<MapProps> = ({ latitude, longitude }) => {
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={18}
      maxZoom={28}
      style={{ height: "300px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[latitude, longitude]}>
        <Popup>
          Location: {latitude}, {longitude}
        </Popup>
      </Marker>
      <CenterButton lat={latitude} lng={longitude} />
    </MapContainer>
  );
};

export default Map;
