import Button from "@/components/Button";
import Input from "@/components/Input";
import Select from "@/components/Select";
import ShowListingName from "@/components/ShowListingName";
import { useCreateDevice } from "@/hooks/useCreateDevice";
import { useDeleteDevice } from "@/hooks/useDeleteDevice";
import { useListDevices } from "@/hooks/useListDevices";
import { useListings } from "@/hooks/useListings";
import { Device, Listing } from "@/lib/types";
import React, { useState } from "react";
import { toast } from "react-toastify";

const Devices: React.FC = () => {
  const {
    devices,
    isLoading: isDevicesLoading,
    refetch: refetchDevices,
  } = useListDevices();
  const { listings, isLoading: isListingsLoading } = useListings();
  const [selectedListing, setSelectedListing] = useState<number | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>("");
  const [isConnected, setIsConnected] = useState(false);

  const { createDevice, isCreateDeviceLoading } = useCreateDevice();
  const { deleteDevice } = useDeleteDevice();

  const connectESP32 = async () => {
    try {
      // Request access to the serial port
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 115200 });

      setIsConnected(true);
      const reader = port.readable?.getReader();
      let accumulatedData = ""; // To accumulate data from chunks

      if (!reader) {
        setDeviceId(null);
        return;
      }

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const text = new TextDecoder().decode(value);
        accumulatedData += text; // Append chunks

        // Extract id from logs
        const match = accumulatedData.match(/Unique ID:\s*([0-9A-Fa-f]{12})/);
        if (match) {
          setDeviceId(match[1]);
          break; // Stop reading after getting id
        }
      }

      reader.releaseLock();

      await port.close();
      setIsConnected(false);
    } catch (error) {
      console.error("Serial connection error:", error);
      setDeviceId(null);
      setIsConnected(false);
      toast.error("Failed to connect to ESP32");
    }
  };

  const handleDeleteDevice = async (id: string) => {
    try {
      await deleteDevice(id);
      toast.success("Device deleted successfully");
      refetchDevices();
    } catch (error) {
      console.error("Error deleting device:", error);
      toast.error("Failed to delete device");
    }
  };

  const handleAddDevice = async () => {
    if (!deviceId || !selectedListing) {
      toast.error("Please select a listing and enter a device ID");
      return;
    }

    try {
      await createDevice({
        deviceId,
        listingId: selectedListing,
      });
      setDeviceId("");
      setSelectedListing(null);
      toast.success("Device added successfully");
      refetchDevices();
    } catch (error) {
      console.error("Error adding device:", error);
      toast.error("Failed to add device");
    }
  };

  if (!listings) {
    return null;
  }

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Devices</h1>

      {/* List Devices */}
      {isDevicesLoading ? (
        <p>Loading devices...</p>
      ) : (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Assigned Devices</h2>
          {devices?.length ? (
            <ul className="space-y-4">
              {devices.map((device: Device) => (
                <li
                  key={device.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p>
                      <strong>Device ID:</strong> {device.deviceId}
                    </p>
                    <p>
                      <strong>Listing ID:</strong>{" "}
                      <ShowListingName listingId={device.listingId} />
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="bg-red-500 text-white"
                    onClick={() => handleDeleteDevice(device.deviceId)}
                  >
                    Delete
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No devices assigned yet.</p>
          )}
        </div>
      )}

      {/* Add Device Form */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Add a New Device</h2>
        <div className="space-y-4">
          {isListingsLoading ? (
            <p>Loading listings...</p>
          ) : (
            <Select
              label="Select Listing"
              optionLabel="Choose a listing"
              options={listings.map((listing: Listing) => ({
                value: String(listing.id),
                label: listing.title,
              }))}
              value={selectedListing ? String(selectedListing) : ""}
              onChange={(e) => {
                const selectedValue = e.target.value;
                setSelectedListing(
                  selectedValue ? parseInt(selectedValue) : null
                );
              }}
            />
          )}

          <Button
            onClick={connectESP32}
            disabled={isConnected}
            className="bg-blue-500 text-white"
          >
            {isConnected ? "Connected" : "Connect ESP32"}
          </Button>

          {deviceId && (
            <Input
              label="Device ID"
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
              disabled
            />
          )}

          <Button
            onClick={handleAddDevice}
            disabled={!deviceId || !selectedListing}
            isLoading={isCreateDeviceLoading}
          >
            Add Device
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Devices;
