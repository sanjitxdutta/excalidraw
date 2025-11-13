"use client";

import React, { useState } from "react";
import { Card } from "@repo/ui/card";
import {
    Circle,
    Square,
    Triangle,
    ArrowRight,
    Pencil,
    Eraser,
    Type,
} from "lucide-react";

interface ShapeToolbarProps {
    onToolSelect?: () => void;
}

export default function ShapeNavbar({ onToolSelect }: ShapeToolbarProps) {
    const [activeTool, setActiveTool] = useState("Select");

    const tools = [
        { name: "Rectangle", icon: Square },
        { name: "Circle", icon: Circle },
        { name: "Triangle", icon: Triangle },
        { name: "Arrow", icon: ArrowRight },
        { name: "Pencil", icon: Pencil },
        { name: "Eraser", icon: Eraser },
        { name: "Text", icon: Type },
    ];

    const handleClick = (name: string) => {
        setActiveTool(name);
        if (onToolSelect) onToolSelect();
    };

    return (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
            <Card
                className="flex items-center gap-2 bg-white border border-black px-4 py-2 rounded-md shadow-md"
                fullWidth={false}
            >
                {tools.map(({ name, icon: Icon }) => {
                    const isActive = activeTool === name;
                    return (
                        <button
                            key={name}
                            onClick={() => handleClick(name)}
                            className={`p-2 flex items-center justify-center transition-all duration-150 ${isActive
                                    ? "bg-black text-white"
                                    : "text-black hover:bg-black hover:text-white"
                                }`}
                            title={name}
                        >
                            <Icon size={18} strokeWidth={2} />
                        </button>
                    );
                })}
            </Card>
        </div>
    );
}
