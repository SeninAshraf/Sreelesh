"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export default function Overlay() {
    const { scrollYProgress } = useScroll();

    const y1 = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
    const opacity1 = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

    const y2 = useTransform(scrollYProgress, [0.2, 0.5], [100, 0]);
    const opacity2 = useTransform(scrollYProgress, [0.2, 0.4, 0.6], [0, 1, 0]);

    const y3 = useTransform(scrollYProgress, [0.5, 0.8], [100, 0]);
    const opacity3 = useTransform(scrollYProgress, [0.5, 0.7, 0.9], [0, 1, 0]);

    return (
        <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-center">
            {/* Section 1 */}
            <motion.div
                style={{ y: y1, opacity: opacity1 }}
                className="absolute inset-0 flex items-center justify-center"
            >
                <div className="text-center px-4">
                    <h1 className="text-4xl md:text-8xl font-bold tracking-tighter mb-4">Sreelesh C.</h1>
                    <p className="text-lg md:text-2xl text-white/70">Visual Content Creator</p>
                </div>
            </motion.div>

            {/* Section 2 */}
            <motion.div
                style={{ y: y2, opacity: opacity2 }}
                className="absolute inset-0 flex items-center justify-start px-6 md:px-24"
            >
                <h2 className="text-3xl md:text-7xl font-bold max-w-2xl leading-tight">
                    I build digital <span className="text-blue-500">experiences</span>.
                </h2>
            </motion.div>

            {/* Section 3 */}
            <motion.div
                style={{ y: y3, opacity: opacity3 }}
                className="absolute inset-0 flex items-center justify-end px-6 md:px-24"
            >
                <h2 className="text-3xl md:text-7xl font-bold max-w-2xl text-right leading-tight">
                    Bridging <span className="text-purple-500">design</span> <br /> and engineering.
                </h2>
            </motion.div>
        </div>
    );
}
