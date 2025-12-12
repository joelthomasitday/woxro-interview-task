"use client"

import { useLayoutEffect, useRef, useEffect, useState } from "react"
import Box3D from "@/components/Cube"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { BOX_ANIMATION_CONFIG } from "@/data/cubesData"

gsap.registerPlugin(ScrollTrigger)

function lerp(from: number, to: number, t: number): number {
    return from + (to - from) * t
}

function getSmallScreenPositions(): Record<string, { vertical: number; horizontal: number }> | null {
    return null
}

function computeSmallScreenLayout(isSmallScreen: boolean): Record<string, { vertical: number; horizontal: number }> | null {
    if (!isSmallScreen) {
        return getSmallScreenPositions()
    }
    const layout: Record<string, { vertical: number; horizontal: number }> = {}
    layout["box-a"] = { vertical: 50, horizontal: 20 }
    layout["box-b"] = { vertical: 70, horizontal: 20 }
    layout["box-c"] = { vertical: 20, horizontal: 20 }
    layout["box-d"] = { vertical: 70, horizontal: 80 }
    layout["box-e"] = { vertical: 20, horizontal: 80 }
    layout["box-f"] = { vertical: 50, horizontal: 80 }
    return layout
}

function attachImagesToBoxFaces(container: HTMLDivElement): void {
    const allFaces = container.querySelectorAll(".cube > div")
    const imageUrls = ["/cube1.png", "/cube2.png", "/cube3.png", "/cube4.png", "/cube5.png"]
    let counter = 0
    
    allFaces.forEach(function(faceElement) {
        const hasImage = faceElement.querySelector("img") !== null
        if (hasImage) return
        
        const imgEl = document.createElement("img")
        imgEl.src = imageUrls[counter % imageUrls.length]
        imgEl.alt = "Box Image " + (counter + 1)
        faceElement.appendChild(imgEl)
        counter = counter + 1
    })
}

function initializeSmoothScroll(): (() => void) | null {
    if (typeof window === "undefined") return null
    
    const LenisClass = (window as any).Lenis
    if (!LenisClass) return null
    
    const scrollInstance = new LenisClass()
    scrollInstance.on("scroll", ScrollTrigger.update)
    
    gsap.ticker.add(function(timestamp) {
        scrollInstance.raf(timestamp * 1000)
    })
    gsap.ticker.lagSmoothing(0)
    
    return function cleanup() {
        scrollInstance.destroy()
    }
}

export default function LandingPage() {
    const pinnedSectionRef = useRef<HTMLElement>(null)
    const brandingRef = useRef<HTMLDivElement>(null)
    const boxContainerRef = useRef<HTMLDivElement>(null)
    const primaryTextRef = useRef<HTMLDivElement>(null)
    const secondaryTextRef = useRef<HTMLDivElement>(null)
    const boxElementRefs = useRef<(HTMLDivElement | null)[]>([])
    
    const [isSmallScreen, setIsSmallScreen] = useState(false)
    const [boxDimension, setBoxDimension] = useState(150)

    useEffect(function setupResizeAndScroll() {
        function handleResize() {
            const smallScreen = window.innerWidth < 768
            setIsSmallScreen(smallScreen)
            setBoxDimension(smallScreen ? 80 : 150)
            ScrollTrigger.refresh()
        }

        handleResize()
        window.addEventListener("resize", handleResize)

        let cleanupScroll = initializeSmoothScroll()
        
        if (cleanupScroll === null) {
            const delayedInit = setTimeout(function() {
                cleanupScroll = initializeSmoothScroll()
            }, 100)
            
            return function() {
                clearTimeout(delayedInit)
                window.removeEventListener("resize", handleResize)
                if (cleanupScroll) cleanupScroll()
            }
        }

        return function() {
            window.removeEventListener("resize", handleResize)
            if (cleanupScroll) cleanupScroll()
        }
    }, [])

    useLayoutEffect(function setupScrollAnimation() {
        const pinnedSection = pinnedSectionRef.current
        const branding = brandingRef.current
        const boxContainer = boxContainerRef.current
        const primaryText = primaryTextRef.current
        const secondaryText = secondaryTextRef.current
        
        if (!pinnedSection || !branding || !boxContainer || !primaryText || !secondaryText) {
            return
        }

        const smallScreenLayout = computeSmallScreenLayout(isSmallScreen)
        attachImagesToBoxFaces(boxContainer)

        const scrollDistance = window.innerHeight * 4

        ScrollTrigger.create({
            trigger: pinnedSection,
            start: "top top",
            end: "+=" + scrollDistance + "px",
            scrub: 1,
            pin: true,
            pinSpacing: true,
            onUpdate: function(trigger) {
                const scrollProgress = trigger.progress
                
                const brandBlurAmount = Math.min(scrollProgress * 20, 1)
                branding.style.filter = "blur(" + lerp(0, 20, brandBlurAmount) + "px)"
                
                const brandFadeProgress = scrollProgress >= 0.02 ? Math.min((scrollProgress - 0.02) * 100, 1) : 0
                branding.style.opacity = String(1 - brandFadeProgress)

                const boxFadeProgress = scrollProgress > 0.01 ? Math.min((scrollProgress - 0.01) * 100, 1) : 0
                boxContainer.style.opacity = String(boxFadeProgress)

                const primaryProgress = Math.min(scrollProgress * 2.5, 1)
                primaryText.style.transform = "translate(-50%, -50%) scale(" + lerp(1, 1.5, primaryProgress) + ")"
                primaryText.style.filter = "blur(" + lerp(0, 20, primaryProgress) + "px)"
                primaryText.style.opacity = String(1 - primaryProgress)

                const secondaryStartPoint = (scrollProgress - 0.4) * 10
                const secondaryProgress = Math.max(0, Math.min(secondaryStartPoint, 1))
                const secondaryScale = lerp(0.75, 1, secondaryProgress)
                const secondaryBlur = lerp(10, 0, secondaryProgress)

                secondaryText.style.transform = "translate(-50%, -50%) scale(" + secondaryScale + ")"
                secondaryText.style.filter = "blur(" + secondaryBlur + "px)"
                secondaryText.style.opacity = String(secondaryProgress)

                const phase1Progress = Math.min(scrollProgress * 2, 1)
                const phase2Progress = scrollProgress >= 0.5 ? (scrollProgress - 0.5) * 2 : 0

                const boxKeys = Object.keys(BOX_ANIMATION_CONFIG)
                
                for (let idx = 0; idx < boxKeys.length; idx++) {
                    const boxKey = boxKeys[idx]
                    const boxEl = boxElementRefs.current[idx]
                    
                    if (!boxEl) continue

                    const animData = BOX_ANIMATION_CONFIG[boxKey]
                    const { start, end } = animData

                    let targetY = end.yPos
                    let targetX = end.xPos
                    let sourceY = start.yPos
                    let sourceX = start.xPos

                    if (smallScreenLayout && smallScreenLayout[boxKey]) {
                        const mobileCoords = smallScreenLayout[boxKey]
                        targetY = mobileCoords.vertical
                        targetX = mobileCoords.horizontal
                        sourceY = start.yPos * 0.8
                        sourceX = start.xPos
                    }

                    const currentY = lerp(sourceY, targetY, phase1Progress)
                    const currentX = lerp(sourceX, targetX, phase1Progress)
                    const currentXAngle = lerp(start.xAngle, end.xAngle, phase1Progress)
                    const currentYAngle = lerp(start.yAngle, end.yAngle, phase1Progress)
                    const currentZAngle = lerp(start.zAngle, end.zAngle, phase1Progress)
                    const currentDepth = lerp(start.depth, end.depth, phase1Progress)

                    let extraYRotation = 0
                    if (boxKey === "box-b") {
                        extraYRotation = lerp(0, 180, phase2Progress)
                    } else if (boxKey === "box-d") {
                        extraYRotation = lerp(0, -180, phase2Progress)
                    }

                    boxEl.style.top = currentY + "%"
                    boxEl.style.left = currentX + "%"
                    boxEl.style.transform = 
                        "translate3d(-50%, -50%, " + currentDepth + "px) " +
                        "rotateX(" + currentXAngle + "deg) " +
                        "rotateY(" + (currentYAngle + extraYRotation) + "deg) " +
                        "rotateZ(" + currentZAngle + "deg)"
                }
            }
        })

        return function cleanupTriggers() {
            ScrollTrigger.getAll().forEach(function(t) { t.kill() })
        }
    }, [isSmallScreen])

    function storeBoxRef(element: HTMLDivElement | null, position: number): void {
        boxElementRefs.current[position] = element
    }

    return (
        <>
            <section ref={pinnedSectionRef} className="sticky">
                <div ref={brandingRef} className="logo">
                    <div className="col">
                        <div className="block block-1"></div>
                        <div className="block block-2"></div>
                    </div>
                    <div className="col">
                        <div className="block block-3"></div>
                        <div className="block block-4"></div>
                    </div>
                    <div className="col">
                        <div className="block block-5"></div>
                        <div className="block block-6"></div>
                    </div>
                </div>
                <div ref={boxContainerRef} className="cubes">
                    <Box3D ref={function(el) { storeBoxRef(el, 0) }} identifier="box-a" dimension={boxDimension} />
                    <Box3D ref={function(el) { storeBoxRef(el, 1) }} identifier="box-b" dimension={boxDimension} />
                    <Box3D ref={function(el) { storeBoxRef(el, 2) }} identifier="box-c" dimension={boxDimension} />
                    <Box3D ref={function(el) { storeBoxRef(el, 3) }} identifier="box-d" dimension={boxDimension} />
                    <Box3D ref={function(el) { storeBoxRef(el, 4) }} identifier="box-e" dimension={boxDimension} />
                    <Box3D ref={function(el) { storeBoxRef(el, 5) }} identifier="box-f" dimension={boxDimension} />
                </div>
                <div ref={primaryTextRef} className="header-1">
                    <h1>
                        The first media company crafted for the digital first generation.
                    </h1>
                </div>
                <div ref={secondaryTextRef} className="header-2 text-center px-4 sm:px-8 max-w-2xl mx-auto top-[40%] md:top-[50%]">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-white">Where innovation meets precision.</h2>
                    <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed">
                        Symphonia unites visionary thinkers, creative architects, and
                        analytical experts, collaborating seamlessly to transform challenges
                        into oppurtunities. Together, we deliver tailored solutions that drive
                        impact and inspire growth.
                    </p>
                </div>
            </section>
            <section className="about">
                <h2>Your next section goes here.</h2>
            </section>
        </>
    )
}