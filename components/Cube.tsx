"use client"

import { forwardRef, CSSProperties } from "react"

interface Box3DConfig {
    dimension?: number
    extraClass?: string
    identifier?: string
}

function buildFaceTransform(face: string, halfSize: number): string {
    const transforms: Record<string, string> = {
        front: "translateZ(" + halfSize + "px)",
        back: "translateZ(-" + halfSize + "px) rotateY(180deg)",
        right: "translateX(" + halfSize + "px) rotateY(90deg)",
        left: "translateX(-" + halfSize + "px) rotateY(-90deg)",
        top: "translateY(-" + halfSize + "px) rotateX(90deg)",
        bottom: "translateY(" + halfSize + "px) rotateX(-90deg)"
    }
    return transforms[face] || ""
}

const Box3D = forwardRef<HTMLDivElement, Box3DConfig>(function Box3DComponent(props, forwardedRef) {
    const dimension = props.dimension ?? 150
    const extraClass = props.extraClass ?? ""
    const identifier = props.identifier ?? ""
    
    const halfDimension = dimension / 2
    const faces = ["front", "back", "right", "left", "top", "bottom"]
    
    const containerStyle: CSSProperties = {
        position: "absolute",
        width: dimension + "px",
        height: dimension + "px",
        transformStyle: "preserve-3d"
    }
    
    const faceElements = faces.map(function(faceName) {
        const faceStyle: CSSProperties = {
            width: dimension + "px",
            height: dimension + "px",
            transform: buildFaceTransform(faceName, halfDimension)
        }
        return <div key={faceName} className={faceName} style={faceStyle}></div>
    })
    
    return (
        <div 
            ref={forwardedRef}
            className={"cube " + identifier + " " + extraClass}
            style={containerStyle}
        >
            {faceElements}
        </div>
    )
})

Box3D.displayName = "Box3D"

export default Box3D
