import React, { forwardRef } from "react";

interface CubeProps {
  size: number;
  images: string[];
  className?: string;
}

const Cube = forwardRef<HTMLDivElement, CubeProps>(({ size, images, className = "" }, ref) => {
  return (
    <div 
      ref={ref}
      className={`scene ${className}`} 
      style={{ width: size, height: size, perspective: "1000px" }}
    >
      <div
        className="cube"
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          transformStyle: "preserve-3d",
        }}
      >
        <div
          className="cube-face front"
          style={{ backgroundImage: `url(${images[0]})`, transform: `rotateY(0deg) translateZ(${size / 2}px)` }}
        ></div>
        <div
          className="cube-face right"
          style={{ backgroundImage: `url(${images[1]})`, transform: `rotateY(90deg) translateZ(${size / 2}px)` }}
        ></div>
        <div
          className="cube-face back"
          style={{ backgroundImage: `url(${images[2]})`, transform: `rotateY(180deg) translateZ(${size / 2}px)` }}
        ></div>
        <div
          className="cube-face left"
          style={{ backgroundImage: `url(${images[3]})`, transform: `rotateY(-90deg) translateZ(${size / 2}px)` }}
        ></div>
        <div
          className="cube-face top"
          style={{ backgroundImage: `url(${images[4]})`, transform: `rotateX(90deg) translateZ(${size / 2}px)` }}
        ></div>
        <div
          className="cube-face bottom"
          style={{ backgroundImage: `url(${images[5]})`, transform: `rotateX(-90deg) translateZ(${size / 2}px)` }}
        ></div>
      </div>
    </div>
  );
});

Cube.displayName = "Cube";

export default Cube;
