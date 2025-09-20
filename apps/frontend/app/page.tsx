"use client";

import React from "react";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { PenTool, Users, Share2, Cloud, Github } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* NAV */}
      <nav className="w-full flex items-center justify-between px-8 py-4 bg-black border-b border-gray-800">
        <div className="text-2xl font-bold">DrawBoard</div>
        <div className="flex items-center gap-6">
          <a href="#features" className="text-sm hover:underline cursor-pointer">Features</a>
          <a href="#about" className="text-sm hover:underline cursor-pointer">About</a>
          <a href="#footer" className="text-sm hover:underline cursor-pointer">Contact</a>
          <Button fullWidth={false} onClick={() => (window.location.href = "/signup")}>
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
            <Button onClick={() => (window.location.href = "/signup")}>
              Start Drawing
            </Button>
          </div>
        </div>
      </header>

      {/* FEATURES */}
      <section id="features" className="py-20 px-6 bg-white text-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose DrawBoard?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
            <Card className="text-center">
              <PenTool className="mx-auto mb-4 cursor-pointer" size={32} />
              <h3 className="font-semibold text-xl mb-2">Intuitive Drawing</h3>
              <p className="text-gray-600">Drag, drop, sketch, and design with a clean, minimal canvas built for speed.</p>
            </Card>
            <Card className="text-center">
              <Users className="mx-auto mb-4 cursor-pointer" size={32} />
              <h3 className="font-semibold text-xl mb-2">Real-time Collaboration</h3>
              <p className="text-gray-600">Work together seamlessly with your teammates on the same board.</p>
            </Card>
            <Card className="text-center">
              <Share2 className="mx-auto mb-4 cursor-pointer" size={32} />
              <h3 className="font-semibold text-xl mb-2">Easy Sharing</h3>
              <p className="text-gray-600">Share your board with one click and control who can edit or view.</p>
            </Card>
            <Card className="text-center">
              <Cloud className="mx-auto mb-4 cursor-pointer" size={32} />
              <h3 className="font-semibold text-xl mb-2">Cloud Sync</h3>
              <p className="text-gray-600">Access your drawings anywhere with secure cloud storage.</p>
            </Card>
            <Card className="text-center">
              <Github className="mx-auto mb-4 cursor-pointer" size={32} />
              <h3 className="font-semibold text-xl mb-2">Open Source</h3>
              <p className="text-gray-600">Built for the community — contribute and make it even better.</p>
            </Card>
          </div>
          <div className="mt-12 text-center">
            <Button fullWidth={false}>Learn More</Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="footer" className="mt-auto bg-black border-t border-gray-800 text-center py-8 px-6">
        <p className="mb-4">Made with ❤️ for creators. © {new Date().getFullYear()} DrawBoard</p>
        <div className="flex justify-center gap-6">
          <a href="#" className="text-sm hover:underline cursor-pointer">Privacy Policy</a>
          <a href="#" className="text-sm hover:underline cursor-pointer">Terms of Service</a>
          <a href="#" className="text-sm hover:underline cursor-pointer">GitHub</a>
        </div>
      </footer>
    </div>
  );
}
