"use client";

import React from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { PenTool, Users, Share2, Cloud, Github } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LandingPage() {

  const router = useRouter();

  function handleGetStarted() {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/rooms");
    } else {
      router.push("/signin");
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">

      {/* NAV */}
      <nav className="
        w-full flex items-center justify-between
        px-4 py-4 md:px-8
        bg-black border-b border-gray-800
      ">
        <div
          className="text-xl md:text-2xl font-bold cursor-pointer"
          onClick={() => router.push("/")}
        >
          DrawBoard
        </div>

        <div className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-sm hover:underline cursor-pointer">Features</a>
          <a href="#about" className="text-sm hover:underline cursor-pointer">About</a>
          <a href="#footer" className="text-sm hover:underline cursor-pointer">Contact</a>
          <Button fullWidth={false} variant="light" onClick={handleGetStarted}>
            Get Started
          </Button>
        </div>
      </nav>

      {/* HERO */}
      <header className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            A Simple, Collaborative Whiteboard for Your Ideas
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            Sketch, brainstorm, and collaborate with your team in real-time — right from your browser.
          </p>
          <div className="max-w-xs mx-auto">
            <Button variant="light" onClick={handleGetStarted}>
              Start Drawing
            </Button>
          </div>
        </div>
      </header>

      {/* FEATURES */}
      <section id="features" className="
        bg-white text-black 
        px-4 py-12
        md:px-6 md:py-20
      ">
        <div className="max-w-6xl mx-auto">
          <h2 className="
            text-2xl font-bold text-center mb-10
            md:text-3xl md:mb-12
          ">
            Why Choose DrawBoard?
          </h2>

          <div className="
            grid grid-cols-1 gap-6
            sm:grid-cols-2
            md:grid-cols-3 md:gap-8
          ">

            <Card className="text-center">
              <PenTool className="mx-auto mb-4" size={28} />
              <h3 className="font-semibold text-lg md:text-xl mb-2">Intuitive Drawing</h3>
              <p className="text-gray-600 text-sm md:text-base">
                Drag, drop, sketch, and design with a clean, minimal canvas built for speed.
              </p>
            </Card>

            <Card className="text-center">
              <Users className="mx-auto mb-4" size={28} />
              <h3 className="font-semibold text-lg md:text-xl mb-2">Real-time Collaboration</h3>
              <p className="text-gray-600 text-sm md:text-base">
                Work together seamlessly with your teammates on the same board.
              </p>
            </Card>

            <Card className="text-center">
              <Share2 className="mx-auto mb-4" size={28} />
              <h3 className="font-semibold text-lg md:text-xl mb-2">Easy Sharing</h3>
              <p className="text-gray-600 text-sm md:text-base">
                Share your board with one click and control who can edit or view.
              </p>
            </Card>

            <Card className="text-center sm:col-span-2 md:col-span-1">
              <Cloud className="mx-auto mb-4" size={28} />
              <h3 className="font-semibold text-lg md:text-xl mb-2">Cloud Sync</h3>
              <p className="text-gray-600 text-sm md:text-base">
                Access your drawings anywhere with secure cloud storage.
              </p>
            </Card>

            <Card className="text-center sm:col-span-2 md:col-span-1">
              <Github className="mx-auto mb-4" size={28} />
              <h3 className="font-semibold text-lg md:text-xl mb-2">Open Source</h3>
              <p className="text-gray-600 text-sm md:text-base">
                Built for the community — contribute and make it even better.
              </p>
            </Card>

          </div>

          <div className="mt-10 text-center md:mt-12">
            <Button variant="dark" fullWidth={false}>Learn More</Button>
          </div>
        </div>
      </section>


      {/* FOOTER */}
      <footer id="footer" className="
        bg-black border-t border-gray-800 
        text-center py-8 px-4 mt-auto
      ">
        <p className="mb-4 text-sm md:text-base">
          Made with ❤️ for creators. © {new Date().getFullYear()} DrawBoard
        </p>
        <div className="flex justify-center gap-4 md:gap-6 text-sm md:text-base">
          <a href="#" className="hover:underline cursor-pointer">Privacy Policy</a>
          <a href="#" className="hover:underline cursor-pointer">Terms of Service</a>
          <a href="#" className="hover:underline cursor-pointer">GitHub</a>
        </div>
      </footer>
    </div>
  );
}
