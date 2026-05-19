"use client";

import { useState, useRef, useCallback } from "react";
import { ALGERIA_WILAYA_PATHS, WILAYA_TO_REGION, normalizeShapeName } from "@/lib/AlgeriaRegions";
import RegionDataCard from "./RegionalDataCard";
import { SEASONS, CROP_TYPES, METRICS } from "@/types/Regional";
import type { SeasonOption, CropTypeOption, MetricOption, RegionDetail } from "@/types/Regional";

interface Props {
  activeRegionId: string | null;
  onRegionClick: (id: string) => void;
  onCardClose: () => void;
  activeDetail: RegionDetail | null;
}

export default function RegionalMap({ activeRegionId, onRegionClick, onCardClose, activeDetail }: Props) {
  const [season, setSeason] = useState<SeasonOption>("Q3 2026");
  const [cropType, setCropType] = useState<CropTypeOption>("All Crops");
  const [metric, setMetric] = useState<MetricOption>("Order Count");

  // Zoom & pan state
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  // Drag state
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  // Fixed viewBox dimensions (Algeria geographic bounds)
  const viewBox = { x: -9, y: -37.5, width: 21.5, height: 19.5 };
  const centerX = viewBox.x + viewBox.width / 2;   // 1.75
  const centerY = viewBox.y + viewBox.height / 2;  // -27.75

  // Zoom at a specific point (in viewBox coordinates)
  const zoomAt = useCallback((pointX: number, pointY: number, newScale: number) => {
    setScale((prevScale) => {
      const oldScale = prevScale;
      // Adjust translation so the point stays fixed on screen
      const newTranslateX = pointX - (pointX - translate.x) * (newScale / oldScale);
      const newTranslateY = pointY - (pointY - translate.y) * (newScale / oldScale);
      setTranslate({ x: newTranslateX, y: newTranslateY });
      return newScale;
    });
  }, [translate.x, translate.y]);

  const handleZoomIn = () => zoomAt(centerX, centerY, scale * 1.2);
  const handleZoomOut = () => zoomAt(centerX, centerY, scale / 1.2);
  
  const handleReset = () => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
    // Also abort any ongoing drag
    isDragging.current = false;
    if (svgRef.current) svgRef.current.style.cursor = "grab";
  };

  // Drag panning
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    const target = e.target as Element;
    if (target.closest("path")) return;
    isDragging.current = true;
    dragStart.current = { x: e.clientX - translate.x, y: e.clientY - translate.y };
    if (svgRef.current) svgRef.current.style.cursor = "grabbing";
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging.current) return;
    const newTranslateX = e.clientX - dragStart.current.x;
    const newTranslateY = e.clientY - dragStart.current.y;
    setTranslate({ x: newTranslateX, y: newTranslateY });
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    if (svgRef.current) svgRef.current.style.cursor = "grab";
  };

  const selectClass = "bg-transparent border-none p-0 text-sm font-semibold text-slate-700 focus:ring-0 cursor-pointer outline-none";

  return (
    <section className="flex-1 flex flex-col relative bg-neutral-light/20 min-h-175">
      {/* Floating filter bar */}
      <div className="absolute top-6 left-6 right-6 z-10 flex flex-wrap items-center justify-between pointer-events-none">


        <div className="bg-surface-light/90 backdrop-blur-md border border-white/50 p-3 rounded-xl shadow-sm pointer-events-auto">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">{metric}</p>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500">Low</span>
            <div className="h-2 w-32 bg-linear-to-r from-neutral-light via-primary/50 to-primary rounded-full" />
            <span className="text-[10px] text-slate-500">High</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-12 relative overflow-hidden">
        <svg
          ref={svgRef}
          viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
          className="w-full h-full max-w-4xl drop-shadow-xl overflow-visible"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{ cursor: "grab" }}
        >
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="0.1" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Transform order: translate, then scale (zoom), then flip Y */}
          <g transform={`translate(${translate.x}, ${translate.y}) scale(${scale}) scale(1, -1)`}>
            {ALGERIA_WILAYA_PATHS.map((wilaya) => {
              const normalizedName = normalizeShapeName(wilaya.wilaya);
              const region = WILAYA_TO_REGION[normalizedName];
              const isActive = activeRegionId === region;

              return (
                <path
                  key={wilaya.wilaya}
                  d={wilaya.svg_path}
                  stroke="#ffffff"
                  strokeWidth={0.03}
                  onClick={() => region && onRegionClick(region)}
                  className="cursor-pointer transition-all duration-300"
                  style={{
                    fill: isActive ? "#0df20d" : "#e2e8e2",
                    fillOpacity: isActive ? 1 : 1,
                  }}
                  onMouseEnter={(e) => {
                    const target = e.target as SVGPathElement;
                    if (!isActive) {
                      target.style.fill = "#0df20d";
                      target.style.fillOpacity = "0.4";
                    }
                  }}
                  onMouseLeave={(e) => {
                    const target = e.target as SVGPathElement;
                    if (!isActive) {
                      target.style.fill = "#e2e8e2";
                      target.style.fillOpacity = "1";
                    }
                  }}
                >
                  <title>{wilaya.wilaya}</title>
                </path>
              );
            })}
          </g>
        </svg>

{activeDetail && (
  <>
    {/* Mobile: bottom sheet */}
    <div className="md:hidden absolute bottom-0 left-0 right-0 z-20">
      <RegionDataCard region={activeDetail} onClose={onCardClose} mobile />
    </div>
    {/* Desktop: floating card */}
    <div className="hidden md:block">
      <RegionDataCard region={activeDetail} onClose={onCardClose} />
    </div>
  </>
)}

        {/* Zoom controls */}
        <div className="absolute bottom-6 left-6 flex gap-2 z-10">
          <button
            type="button"
            aria-label="Zoom in"
            className="bg-surface-light p-2 rounded-lg shadow-sm border border-slate-200 text-slate-600 hover:text-primary transition-colors"
            onClick={handleZoomIn}
          >
            <span className="material-icons">add</span>
          </button>
          <button
            type="button"
            aria-label="Zoom out"
            className="bg-surface-light p-2 rounded-lg shadow-sm border border-slate-200 text-slate-600 hover:text-primary transition-colors"
            onClick={handleZoomOut}
          >
            <span className="material-icons">remove</span>
          </button>
          <button
            type="button"
            aria-label="Reset view"
            className="bg-surface-light p-2 rounded-lg shadow-sm border border-slate-200 text-slate-600 hover:text-primary transition-colors"
            onClick={handleReset}
          >
            <span className="material-icons">my_location</span>
          </button>
        </div>
      </div>
    </section>
  );
}