import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import { useEffect, useState } from "react";

const useCocoSsdModel = () => {
  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      await tf.setBackend("webgl");
      await tf.ready();
      const loadedModel = await cocoSsd.load();
      setModel(loadedModel);
    };

    loadModel();
  }, []);

  return model;
};

export default useCocoSsdModel;
