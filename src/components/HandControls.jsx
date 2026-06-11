import { useEffect, useRef, useState } from "react";

const gestureLabel = {
  none: "Chưa thấy bàn tay",
  point: "Một ngón: đang điều hướng",
  fist: "Nắm tay: giữ cụm sao",
  open: "Xòe tay: mở kỷ niệm",
};

const MEDIAPIPE_VERSION = "0.10.35";

function describeCameraError(cameraError) {
  if (!window.isSecureContext) {
    return "Camera chỉ hoạt động trên HTTPS hoặc localhost.";
  }
  if (!navigator.mediaDevices?.getUserMedia) {
    return "Trình duyệt này không hỗ trợ truy cập camera.";
  }
  if (cameraError?.name === "NotAllowedError") {
    return "Quyền camera đang bị chặn. Hãy cho phép camera trong cài đặt trình duyệt rồi thử lại.";
  }
  if (cameraError?.name === "NotFoundError") {
    return "Không tìm thấy camera trên thiết bị này.";
  }
  if (cameraError?.name === "NotReadableError") {
    return "Camera đang được ứng dụng khác sử dụng.";
  }
  return "Không thể mở camera. Hãy kiểm tra quyền camera rồi thử lại.";
}

function classifyGesture(landmarks) {
  if (!landmarks) return "none";
  const extended = [
    landmarks[8].y < landmarks[6].y,
    landmarks[12].y < landmarks[10].y,
    landmarks[16].y < landmarks[14].y,
    landmarks[20].y < landmarks[18].y,
  ];
  const count = extended.filter(Boolean).length;
  if (extended[0] && count === 1) return "point";
  if (count === 0) return "fist";
  if (count >= 3) return "open";
  return "none";
}

export default function HandControls({ onTurn, onHold, onOpen, onClose }) {
  const videoRef = useRef();
  const streamRef = useRef();
  const detectorRef = useRef();
  const frameRef = useRef();
  const callbacksRef = useRef({ onTurn, onHold, onOpen, onClose });
  const lastGestureRef = useRef("none");
  const previousXRef = useRef(null);
  const lastActionRef = useRef(0);
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recognitionStatus, setRecognitionStatus] = useState("off");
  const [gesture, setGesture] = useState("none");
  const [error, setError] = useState("");

  callbacksRef.current = { onTurn, onHold, onOpen, onClose };

  useEffect(() => {
    return () => {
      cancelAnimationFrame(frameRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      detectorRef.current?.close?.();
    };
  }, []);

  const stopCamera = () => {
    cancelAnimationFrame(frameRef.current);
    streamRef.current?.getTracks().forEach((track) => track.stop());
    detectorRef.current?.close?.();
    detectorRef.current = null;
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setEnabled(false);
    setLoading(false);
    setRecognitionStatus("off");
    setGesture("none");
    previousXRef.current = null;
    lastGestureRef.current = "none";
  };

  const runDetection = () => {
    const video = videoRef.current;
    const detector = detectorRef.current;
    if (!video || !detector || video.readyState < 2) {
      frameRef.current = requestAnimationFrame(runDetection);
      return;
    }

    try {
      const result = detector.detectForVideo(video, performance.now());
      const landmarks = result.landmarks?.[0];
      const nextGesture = classifyGesture(landmarks);
      const now = performance.now();

      if (nextGesture === "point" && landmarks) {
        const currentX = landmarks[8].x;
        if (previousXRef.current !== null) {
          const delta = previousXRef.current - currentX;
          if (Math.abs(delta) > 0.006) callbacksRef.current.onTurn(delta * 2.8);
        }
        previousXRef.current = currentX;
      } else {
        previousXRef.current = null;
      }

      if (nextGesture !== lastGestureRef.current && now - lastActionRef.current > 650) {
        if (nextGesture === "fist") {
          if (lastGestureRef.current === "open") callbacksRef.current.onClose();
          else callbacksRef.current.onHold();
          lastActionRef.current = now;
        }
        if (nextGesture === "open" && lastGestureRef.current === "fist") {
          callbacksRef.current.onOpen();
          lastActionRef.current = now;
        }
        lastGestureRef.current = nextGesture;
        setGesture(nextGesture);
      }
    } catch (detectionError) {
      console.error("Hand detection stopped:", detectionError);
      setRecognitionStatus("unavailable");
      setError("Camera vẫn đang bật, nhưng nhận dạng cử chỉ đã dừng. Hãy tắt và bật lại camera.");
      detectorRef.current?.close?.();
      detectorRef.current = null;
      return;
    }

    frameRef.current = requestAnimationFrame(runDetection);
  };

  const startCamera = async () => {
    setLoading(true);
    setError("");
    try {
      if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
        throw new DOMException("Camera is unavailable in this context", "SecurityError");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      setEnabled(true);
      setLoading(false);
      setRecognitionStatus("loading");

      try {
        const { FilesetResolver, HandLandmarker } = await import("@mediapipe/tasks-vision");
        const vision = await FilesetResolver.forVisionTasks(
          `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MEDIAPIPE_VERSION}/wasm`,
        );
        const options = {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numHands: 1,
          minHandDetectionConfidence: 0.55,
          minTrackingConfidence: 0.55,
        };

        try {
          detectorRef.current = await HandLandmarker.createFromOptions(vision, options);
        } catch (gpuError) {
          console.warn("GPU hand tracking unavailable, falling back to CPU:", gpuError);
          detectorRef.current = await HandLandmarker.createFromOptions(vision, {
            ...options,
            baseOptions: { ...options.baseOptions, delegate: "CPU" },
          });
        }

        setRecognitionStatus("ready");
        setError("");
        runDetection();
      } catch (modelError) {
        console.error("Hand tracking unavailable:", modelError);
        setRecognitionStatus("unavailable");
        setError("Camera đã bật, nhưng chưa tải được nhận dạng cử chỉ. Kiểm tra kết nối mạng rồi bật lại.");
      }
    } catch (cameraError) {
      console.error(cameraError);
      stopCamera();
      setError(describeCameraError(cameraError));
    } finally {
      setLoading(false);
    }
  };

  const statusText = enabled
    ? recognitionStatus === "loading"
      ? "Camera đã bật · đang tải nhận dạng..."
      : recognitionStatus === "unavailable"
        ? "Camera đã bật · chưa có nhận dạng"
        : gestureLabel[gesture]
    : "Điều khiển bằng tay";

  return (
    <div className={`hand-control ${enabled ? "is-enabled" : ""} is-${recognitionStatus}`}>
      <video ref={videoRef} muted playsInline />
      <div className="hand-control-copy">
        <span className="hand-status-dot" />
        <div>
          <strong>{statusText}</strong>
          <small>{error || (enabled ? "Đưa bàn tay vào giữa khung hình" : "Webcam chỉ bật khi bạn cho phép")}</small>
        </div>
      </div>
      <button type="button" onClick={enabled ? stopCamera : startCamera} disabled={loading}>
        {loading ? "Đang mở..." : enabled ? "Tắt camera" : "Bật camera"}
      </button>
    </div>
  );
}
