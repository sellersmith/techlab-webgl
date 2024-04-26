import { useEffect, useRef, useState } from "react";
import { state } from "../store";
export function DragImage({ children }) {
  const dropzoneRef = useRef(null);

  const handleDragOver = (event) => {
    event.preventDefault();
    dropzoneRef.current.classList.add("dragging");
  };

  const handleDrop = (event) => {
    event.preventDefault();
    dropzoneRef.current.classList.remove("dragging");
    const droppedFile = event.dataTransfer.files[0];

    if (droppedFile && droppedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target.result;
        state.decal = result;
        state.decals.push(result);
      };
      reader.readAsDataURL(droppedFile);
    } else {
      console.error("Invalid file type. Please drop an image.");
    }
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    dropzoneRef.current.classList.remove("dragging");
  };

  const [dropZoneZIndex, setDropZoneZIndex] = useState(-1);

  function setDropZonePositive() {
    setDropZoneZIndex(1);
  }
  function setDropZoneNegative() {
    setDropZoneZIndex(-1);
  }

  useEffect(() => {
    window.addEventListener("dragenter", setDropZonePositive);

    window.addEventListener("dragend", setDropZoneNegative);

    window.addEventListener("drop", setDropZoneNegative);

    return () => {
      window.removeEventListener("dragenter", setDropZonePositive);

      window.removeEventListener("dragend", setDropZoneNegative);

      window.removeEventListener("drop", setDropZoneNegative);
    };
  }, []);

  return (
    <div style={{ height: "100%", position: "relative" }}>
      <p
        style={{
          position: "absolute",
          left: "50%",
          top: "0",
          zIndex: 100,
          transform: "translateX(-50%)",
          fontSize: "50px",
        }}
      >
        {" "}
        Drop a fancy image here
      </p>
      <div
        className="dropzone"
        style={{ zIndex: `${dropZoneZIndex}` }}
        ref={dropzoneRef}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragLeave={handleDragLeave}
      ></div>
      {children}
    </div>
  );
}
