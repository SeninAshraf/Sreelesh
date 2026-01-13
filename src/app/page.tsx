import ScrollyCanvas from "@/components/ScrollyCanvas";
import Overlay from "@/components/Overlay";
import Projects from "@/components/Projects";
import About from "@/components/About";
import Achievements from "@/components/Achievements";
import Contact from "@/components/Contact";

export default function Home() {
    return (
        <main className="bg-[#121212] min-h-screen">
            {/* Scroll Sequence Area */}
            <div className="relative h-[500vh]">
                <div className="sticky top-0 left-0 h-[100dvh] w-full overflow-hidden">
                    <ScrollyCanvas />
                    <Overlay />
                </div>
            </div>

            <div className="relative z-20 bg-[#121212]">
                {/* About Section */}
                <About />

                {/* Projects Grid */}
                <Projects />

                {/* Achievements Section */}
                <Achievements />

                {/* Contact Section */}
                <Contact />
            </div>
        </main>
    );
}
