"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function About() {
    return (
        <section className="relative z-20 py-32 px-6">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="group relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 md:p-12 overflow-hidden hover:bg-white/[0.07] transition-colors duration-500"
                >
                    {/* Subtle Gradient Glow */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px] group-hover:bg-purple-500/30 transition-colors duration-700" />

                    <div className="relative flex flex-col md:flex-row items-center gap-12">
                        {/* Profile Image */}
                        <div className="w-full md:w-1/3 flex justify-center">
                            <div className="relative w-64 h-64 md:w-full md:max-w-xs aspect-square rounded-2xl overflow-hidden shadow-2xl border border-white/10 transition-transform duration-500 group-hover:scale-[1.02]">
                                <Image
                                    src="/profile-v2.png"
                                    alt="Sreelesh C."
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="w-full md:w-2/3 text-left">
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-cinzel tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                                SREELESH C.
                            </h2>

                            <div className="space-y-6 text-white/80 text-lg font-light leading-relaxed font-sans">
                                <p>
                                    B.Tech  student in AI & Data Science, transforming complex data into intelligent solutions. I bridge the gap between technical logic and visual storytelling.
                                </p>
                                <p>
                                    With expertise in video editing, graphic design, and front-end development, I craft digital experiences that are not just functional, but deeply engaging.
                                </p>
                            </div>

                            <div className="mt-10">
                                <a
                                    href="/resume.pdf"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <motion.button
                                        whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 1)" }}
                                        whileTap={{ scale: 0.98 }}
                                        className="px-10 py-4 bg-white/90 text-black font-medium tracking-widest text-sm uppercase rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                                    >
                                        View Resume
                                    </motion.button>
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
