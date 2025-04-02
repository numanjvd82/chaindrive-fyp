import { useState } from "react";

const ESP32Reader = () => {
  const [uniqueId, setUniqueId] = useState("No ID received yet");
  const [isConnected, setIsConnected] = useState(false);

  const connectESP32 = async () => {
    try {
      // Request access to the serial port
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 115200 });

      setIsConnected(true);
      const reader = port.readable?.getReader();
      let accumulatedData = ""; // To accumulate data from chunks

      if (!reader) {
        setUniqueId("Failed to get reader");
        return;
      }

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const text = new TextDecoder().decode(value);
        accumulatedData += text; // Append chunks
        console.log("Accumulated Data:", accumulatedData);

        // Extract id from logs
        const match = accumulatedData.match(/Unique ID:\s*([0-9A-Fa-f]{12})/);
        if (match) {
          setUniqueId(match[1]);
          break; // Stop reading after getting id
        }
      }
      reader.releaseLock();

      await port.close();
      setIsConnected(false);
    } catch (error) {
      console.error("Serial connection error:", error);
      setUniqueId("Failed to read id");
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-md shadow-md">
      <h2 className="text-lg font-bold">ESP32 Unique Id</h2>
      <p className="text-gray-600">{uniqueId}</p>
      <button
        onClick={connectESP32}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        {isConnected ? "Reading..." : "Connect ESP32"}
      </button>
    </div>
  );
};

export default ESP32Reader;
