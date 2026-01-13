"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const achievements = [
    {
        id: 1,
        title: "Matrix Hackathon 2025",
        award: "Secured 2nd Prize",
        image: "/achievements/matrix-hackathon.jpg",
    },
    {
        id: 2,
        title: "Kotech 2025",
        award: "Secured 3rd Prize",
        image: "/achievements/kotech-prize.jpg",
    }
];

export default function Achievements() {
    return (
        <section className="relative z-20 bg-[#121212] py-24 px-4 md:px-12 border-t border-white/5">
            <div className="max-w-7xl mx-auto">
                <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-3xl md:text-4xl font-bold mb-16 border-b border-white/10 pb-6"
                >
                    Achievements
                </motion.h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {achievements.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
                        >
                            {/* Image Background */}
                            <div className="absolute inset-0">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                            </div>

                            <div className="absolute bottom-0 left-0 p-8 w-full z-10">
                                <div className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-wider text-black bg-yellow-400 rounded-full uppercase">
                                    {item.award}
                                </div>
                                <h4 className="text-2xl font-bold mb-1">{item.title}</h4>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
