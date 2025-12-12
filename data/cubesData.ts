type PositionState = {
    yPos: number
    xPos: number
    xAngle: number
    yAngle: number
    zAngle: number
    depth: number
}

type BoxAnimation = {
    start: PositionState
    end: PositionState
}

const BOX_ANIMATION_CONFIG: Record<string, BoxAnimation> = {}

BOX_ANIMATION_CONFIG["box-a"] = {
    start: { yPos: -55, xPos: 37.5, xAngle: 360, yAngle: -360, zAngle: -48, depth: -30000 },
    end: { yPos: 50, xPos: 15, xAngle: 0, yAngle: 3, zAngle: 0, depth: 0 }
}

BOX_ANIMATION_CONFIG["box-b"] = {
    start: { yPos: -35, xPos: 32.5, xAngle: -360, yAngle: 360, zAngle: 90, depth: -30000 },
    end: { yPos: 75, xPos: 25, xAngle: 1, yAngle: 2, zAngle: 0, depth: 0 }
}

BOX_ANIMATION_CONFIG["box-c"] = {
    start: { yPos: -65, xPos: 50, xAngle: -360, yAngle: -360, zAngle: -180, depth: -30000 },
    end: { yPos: 25, xPos: 25, xAngle: -1, yAngle: 2, zAngle: 0, depth: 0 }
}

BOX_ANIMATION_CONFIG["box-d"] = {
    start: { yPos: -35, xPos: 50, xAngle: -360, yAngle: -360, zAngle: -180, depth: -30000 },
    end: { yPos: 75, xPos: 75, xAngle: 1, yAngle: -2, zAngle: 0, depth: 0 }
}

BOX_ANIMATION_CONFIG["box-e"] = {
    start: { yPos: -55, xPos: 62.5, xAngle: 360, yAngle: 360, zAngle: -135, depth: -30000 },
    end: { yPos: 25, xPos: 75, xAngle: -1, yAngle: -2, zAngle: 0, depth: 0 }
}

BOX_ANIMATION_CONFIG["box-f"] = {
    start: { yPos: -35, xPos: 67.5, xAngle: -180, yAngle: -360, zAngle: -180, depth: -30000 },
    end: { yPos: 50, xPos: 85, xAngle: 0, yAngle: -3, zAngle: 0, depth: 0 }
}

export { BOX_ANIMATION_CONFIG }
export type { PositionState, BoxAnimation }
