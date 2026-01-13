"use client";

import { useScroll, useMotionValueEvent, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function ScrollyCanvas({ numFrames = 120 }: { numFrames?: number }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const { scrollYProgress } = useScroll();

    // Use reduced frames for performance (load every 2nd frame)
    // 120 frames -> 60 frames effective
    const effectiveFrames = Math.floor(numFrames / 2);

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
    }, [isLoaded, images]); // Re-run if images load

    // Preload images (Skip every 2nd frame)
    useEffect(() => {
        const loadImages = async () => {
            const loadedImages: HTMLImageElement[] = [];
            const promises: Promise<void>[] = [];

            let loadIndex = 0;
            for (let i = 0; i < numFrames; i += 2) {
                const currentIndex = i / 2; // Capture index safely
                const promise = new Promise<void>((resolve) => {
                    const img = new Image();
                    img.src = `/sequence/frame_${i.toString().padStart(3, "0")}.png`;
                    img.onload = () => {
                        loadedImages[currentIndex] = img;
                        resolve();
                    };
                    img.onerror = () => {
                        console.error(`Failed to load frame ${i}`);
                        resolve(); // Resolve anyway to avoid hanging
                    }
                });
                promises.push(promise);
                // Pre-allocate to preserve order (though JS arrays are sparse)
                loadedImages[currentIndex] = null as any;
            }

            await Promise.all(promises);
            setImages(loadedImages);
            setIsLoaded(true);
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
        if (isLoaded && images.length > 0) {
            renderFrame(0, images);
        }
    }, [isLoaded]);

    // Subscribe to scroll changes to re-render using RequestAnimationFrame for perf
    let isTicking = false;
    useMotionValueEvent(frameIndex, "change", (latest) => {
        if (!isLoaded || images.length === 0 || isTicking) return;
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
            {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#121212] z-50 transition-opacity duration-500">
                    <span className="text-white/50 text-sm font-cinzel tracking-widest animate-pulse">Loading Experience...</span>
                </div>
            )}
        </div>
    );
}
