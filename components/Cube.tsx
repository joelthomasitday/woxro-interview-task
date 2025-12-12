import React, { forwardRef } from "react";

interface CubeProps {
  size?: number;
  className?: string;
  cubeClass?: string;
}

const Cube = forwardRef<HTMLDivElement, CubeProps>(({ size = 150, className = "", cubeClass = "" }, ref) => {
  const faceStyle = {
    width: `${size}px`,
    height: `${size}px`,
  };

  return (
    <div 
      ref={ref}
      className={`cube ${cubeClass} ${className}`}
      style={{
        position: "absolute",
        width: `${size}px`,
        height: `${size}px`,
        transformStyle: "preserve-3d",
      }}
    >
      <div className="front" style={{ ...faceStyle, transform: `translateZ(${size / 2}px)` }}></div>
      <div className="back" style={{ ...faceStyle, transform: `translateZ(-${size / 2}px) rotateY(180deg)` }}></div>
      <div className="right" style={{ ...faceStyle, transform: `translateX(${size / 2}px) rotateY(90deg)` }}></div>
      <div className="left" style={{ ...faceStyle, transform: `translateX(-${size / 2}px) rotateY(-90deg)` }}></div>
      <div className="top" style={{ ...faceStyle, transform: `translateY(-${size / 2}px) rotateX(90deg)` }}></div>
      <div className="bottom" style={{ ...faceStyle, transform: `translateY(${size / 2}px) rotateX(-90deg)` }}></div>
    </div>
  );
});

Cube.displayName = "Cube";

export default Cube;
