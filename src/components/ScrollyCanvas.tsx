"use client";

import { motion, AnimatePresence, useScroll, useMotionValueEvent, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function ScrollyCanvas({ numFrames = 48 }: { numFrames?: number }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [contentLoaded, setContentLoaded] = useState(false);
    const [minTimeElapsed, setMinTimeElapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Combine both states for the UI overlay
    const showLoader = !contentLoaded || !minTimeElapsed;

    // 1. Detect Mobile & Enforce minimum 1-second load time
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.matchMedia("(max-width: 768px)").matches);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);

        const timer = setTimeout(() => setMinTimeElapsed(true), 1000);

        return () => {
            window.removeEventListener("resize", checkMobile);
            clearTimeout(timer);
        };
    }, []);

    const { scrollYProgress } = useScroll();

    // Use all frames for smoothness since we only have 48
    const effectiveFrames = numFrames;

    // Transform scroll (0-1) to frame index
    const frameIndex = useTransform(scrollYProgress, [0, 1], [0, effectiveFrames - 1]);

    // 2. Handle Resize Logic Separately (Desktop Only)
    useEffect(() => {
        if (isMobile) return;

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
    }, [contentLoaded, images, isMobile]);

    // 3. Preload images (Desktop) OR Handle Video (Mobile)
    useEffect(() => {
        if (isMobile) {
            // Mobile: Content is ready when video starts (handled by video onLoadedData)
            return;
        }

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
                        resolve();
                    }
                });
                promises.push(promise);
                loadedImages[i] = null as any;
            }

            await Promise.all(promises);
            setImages(loadedImages);
            setContentLoaded(true);
        };

        loadImages();
    }, [numFrames, isMobile]);

    // 4. Efficient Render Function (Desktop)
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

    // 5. Initial render when loaded (Desktop)
    useEffect(() => {
        if (!isMobile && contentLoaded && images.length > 0) {
            renderFrame(0, images);
        }
    }, [contentLoaded, isMobile]);

    // 6. Subscribe to scroll changes (Desktop)
    let isTicking = false;
    useMotionValueEvent(frameIndex, "change", (latest) => {
        if (isMobile || !contentLoaded || images.length === 0 || isTicking) return;
        isTicking = true;
        requestAnimationFrame(() => {
            const index = Math.floor(latest);
            renderFrame(index, images);
            isTicking = false;
        });
    });

    return (
        <div className="relative w-full h-full">
            {isMobile ? (
                <video
                    src="/videos/RESPONSE.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                    onLoadedData={() => setContentLoaded(true)}
                />
            ) : (
                <canvas ref={canvasRef} className="block w-full h-full object-cover" />
            )}

            <AnimatePresence>
                {showLoader && (
                    <motion.div
                        key="loader"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.2, ease: "easeInOut" }}
                        className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0a] z-50 pointer-events-none"
                    >
                        <motion.h1
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="text-4xl md:text-6xl font-cinzel font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-br from-gray-100 via-gray-400 to-gray-600 animate-pulse"
                            style={{ textShadow: "0px 0px 20px rgba(255,255,255,0.1)" }}
                        >
                            SREELESH C
                        </motion.h1>
                        <div className="mt-4 w-32 h-[1px] bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-50" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
