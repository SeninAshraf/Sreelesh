"use client";

import { motion, AnimatePresence, useScroll, useMotionValueEvent, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function ScrollyCanvas({ numFrames = 48 }: { numFrames?: number }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [minTimeElapsed, setMinTimeElapsed] = useState(false);

    // Combine both states for the UI overlay
    const showLoader = !imagesLoaded || !minTimeElapsed;

    // Enforce minimum 1-second load time for branding
    useEffect(() => {
        const timer = setTimeout(() => setMinTimeElapsed(true), 1000);
        return () => clearTimeout(timer);
    }, []);

    const { scrollYProgress } = useScroll();

    // Use all frames for smoothness since we only have 48
    const effectiveFrames = numFrames;

    // Transform scroll (0-1) to frame index
    const frameIndex = useTransform(scrollYProgress, [0, 1], [0, effectiveFrames - 1]);

    // Handle Resize Logic Separately
    useEffect(() => {
        const handleResize = () => {
            if (!canvasRef.current) return;
            // Cap DPR at 1 for maximum performance
            const dpr = 1;
            canvasRef.current.width = window.innerWidth * dpr;
            canvasRef.current.height = window.innerHeight * dpr;

            // Re-render current frame after resize
            if (images.length > 0) {
                const currentFrame = Math.floor(frameIndex.get());
                renderFrame(currentFrame, images);
            }
        };

        // Initial sizing
        handleResize();

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [imagesLoaded, images]); // Re-run if images load

    // Preload images (Load ALL frames sequentially)
    useEffect(() => {
        const loadImages = async () => {
            const loadedImages: HTMLImageElement[] = [];
            const promises: Promise<void>[] = [];

            for (let i = 0; i < numFrames; i++) {
                const promise = new Promise<void>((resolve) => {
                    const img = new Image();
                    // Add cache buster to ensure new sequence loads
                    img.src = `/sequence/frame_${i.toString().padStart(3, "0")}.png?v=2`;
                    img.onload = () => {
                        loadedImages[i] = img;
                        resolve();
                    };
                    img.onerror = () => {
                        console.error(`Failed to load frame ${i}`);
                        resolve(); // Resolve anyway to avoid hanging
                    }
                });
                promises.push(promise);
                // Pre-allocate to preserve order (though JS arrays are sparse)
                loadedImages[i] = null as any;
            }

            await Promise.all(promises);
            setImages(loadedImages);
            setImagesLoaded(true);
        };

        loadImages();
    }, [numFrames]);

    // Efficient Render Function
    const renderFrame = (index: number, imgs: HTMLImageElement[]) => {
        const canvas = canvasRef.current;
        if (!canvas || !imgs[index]) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const img = imgs[index];
        const cw = canvas.width;
        const ch = canvas.height;
        const iw = img.width;
        const ih = img.height;

        // Zoom by 10% to crop out potential edge watermarks
        const scale = Math.max(cw / iw, ch / ih) * 1.1;
        const x = (cw - iw * scale) / 2;
        const y = (ch - ih * scale) / 2;

        ctx.clearRect(0, 0, cw, ch);
        ctx.drawImage(img, x, y, iw * scale, ih * scale);
    };

    // Initial render when loaded
    useEffect(() => {
        if (imagesLoaded && images.length > 0) {
            renderFrame(0, images);
        }
    }, [imagesLoaded]);

    // Subscribe to scroll changes to re-render using RequestAnimationFrame for perf
    let isTicking = false;
    useMotionValueEvent(frameIndex, "change", (latest) => {
        if (!imagesLoaded || images.length === 0 || isTicking) return;
        isTicking = true;
        requestAnimationFrame(() => {
            const index = Math.floor(latest);
            renderFrame(index, images);
            isTicking = false;
        });
    });

    return (
        <div className="relative w-full h-full">
            <canvas ref={canvasRef} className="block w-full h-full object-cover" />
            {showLoader && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0a] z-50 transition-opacity duration-700">
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-4xl md:text-6xl font-cinzel font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-br from-gray-100 via-gray-400 to-gray-600 animate-pulse"
                        style={{ textShadow: "0px 0px 20px rgba(255,255,255,0.1)" }}
                    >
                        SREELESH C
                    </motion.h1>
                    <div className="mt-4 w-32 h-[1px] bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-50" />
                </div>
            )}
        </div>
    );
}
