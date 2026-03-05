'use client';

import {useState, useCallback, useRef} from 'react';
import {Plus, Minus} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {ComposableMap, Geographies, Geography, ZoomableGroup} from 'react-simple-maps';
import {AnimatePresence, motion, useReducedMotion} from 'framer-motion';
import {visitedCountries, type VisitedCountry} from '@/config/travel';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const visitedSet = new Map(visitedCountries.map((c) => [c.code, c]));

const ANTARCTICA = 'AQ';

const MAP_CENTER: [number, number] = [10, 35];
const MAP_SCALE = 150;

type PopoverData = {
  country: VisitedCountry;
  name: string;
};

type ZoomState = {
  coordinates: [number, number];
  zoom: number;
};

function Minimap({zoom, coordinates}: ZoomState) {
  if (zoom <= 1.05) return null;

  const viewW = 100 / zoom;
  const viewH = 60 / zoom;
  const offsetX = ((coordinates[0] - MAP_CENTER[0]) / 360) * -100;
  const offsetY = ((coordinates[1] - MAP_CENTER[1]) / 180) * -60;
  const rectX = 50 - viewW / 2 + offsetX;
  const rectY = 30 - viewH / 2 + offsetY;

  return (
    <div className="absolute bottom-3 left-3 z-40 w-32 h-[76px] rounded border border-white/10 bg-black/80 backdrop-blur-sm overflow-hidden">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{scale: 28, center: MAP_CENTER}}
        width={100}
        height={60}
        className="w-full h-full"
      >
        <Geographies geography={GEO_URL}>
          {({geographies}) =>
            geographies
              .filter((geo) => geo.properties.ISO_A2 !== ANTARCTICA)
              .map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  tabIndex={-1}
                  style={{
                    default: {
                      fill: visitedSet.has(geo.properties.ISO_A2)
                        ? 'rgba(16, 185, 129, 0.4)'
                        : '#1a1a1a',
                      stroke: '#2a2a2a',
                      strokeWidth: 0.3,
                      outline: 'none',
                      pointerEvents: 'none',
                    },
                    hover: {fill: '', outline: 'none'},
                    pressed: {fill: '', outline: 'none'},
                  }}
                />
              ))
          }
        </Geographies>
        <rect
          x={rectX}
          y={rectY}
          width={viewW}
          height={viewH}
          fill="rgba(16, 185, 129, 0.1)"
          stroke="rgba(16, 185, 129, 0.6)"
          strokeWidth={0.8}
          rx={0.5}
        />
      </ComposableMap>
    </div>
  );
}

export function TravelMap() {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({x: 0, y: 0});
  const [popover, setPopover] = useState<PopoverData | null>(null);
  const [mobileActive, setMobileActive] = useState<string | null>(null);
  const [zoomState, setZoomState] = useState<ZoomState>({
    coordinates: MAP_CENTER,
    zoom: 1,
  });

  const handleMove = useCallback(
    (position: {x: number; y: number; zoom: number}) => {
      setZoomState((prev) => ({...prev, zoom: position.zoom}));
    },
    [],
  );

  const handleMoveEnd = useCallback((position: ZoomState) => {
    setZoomState(position);
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoomState((prev) => ({...prev, zoom: Math.min(prev.zoom * 1.5, 5)}));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomState((prev) => ({...prev, zoom: Math.max(prev.zoom / 1.5, 1)}));
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMouse({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const getPopoverStyle = useCallback((): React.CSSProperties => {
    const container = containerRef.current;
    if (!container) return {display: 'none'};

    const {offsetWidth: w} = container;
    let x = mouse.x + 16;
    let y = mouse.y - 16;
    let translateY = '-100%';

    if (x + 256 > w) {
      x = mouse.x - 16 - 256;
    }

    if (mouse.y < 200) {
      y = mouse.y + 16;
      translateY = '0%';
    }

    return {
      left: x,
      top: y,
      transform: `translateY(${translateY})`,
    };
  }, [mouse]);

  const handleGeoMouseEnter = useCallback(
    (geo: {properties: {name: string; ISO_A2: string}}) => {
      const country = visitedSet.get(geo.properties.ISO_A2);
      if (country) {
        setPopover({country, name: geo.properties.name});
      }
    },
    [],
  );

  const handleGeoMouseLeave = useCallback(() => {
    setPopover(null);
  }, []);

  const handleGeoClick = useCallback(
    (geo: {properties: {name: string; ISO_A2: string}}) => {
      const country = visitedSet.get(geo.properties.ISO_A2);
      if (!country) return;

      setMobileActive((prev) => {
        if (prev === country.code) return null;
        setPopover({country, name: geo.properties.name});
        return country.code;
      });
    },
    [],
  );

  const handleContainerClick = useCallback((e: React.MouseEvent) => {
    if ((e.target as SVGElement).tagName !== 'path') {
      setMobileActive(null);
      setPopover(null);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent"
      onMouseMove={handleMouseMove}
      onClick={handleContainerClick}
    >
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: MAP_SCALE,
          center: MAP_CENTER,
        }}
        className="w-full h-auto"
        style={{marginTop: '-30px', marginBottom: '-80px'}}
      >
        <ZoomableGroup
          center={zoomState.coordinates}
          zoom={zoomState.zoom}
          minZoom={1}
          maxZoom={5}
          onMove={handleMove}
          onMoveEnd={handleMoveEnd}
        >
          <Geographies geography={GEO_URL}>
            {({geographies}) =>
              geographies
                .filter((geo) => geo.properties.ISO_A2 !== ANTARCTICA)
                .map((geo) => {
                  const isVisited = visitedSet.has(geo.properties.ISO_A2);

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => isVisited && handleGeoMouseEnter(geo)}
                      onMouseLeave={handleGeoMouseLeave}
                      onClick={() => isVisited && handleGeoClick(geo)}
                      style={{
                        default: {
                          fill: isVisited ? 'rgba(16, 185, 129, 0.3)' : '#1a1a1a',
                          stroke: '#2a2a2a',
                          strokeWidth: 0.5,
                          outline: 'none',
                          cursor: isVisited ? 'pointer' : 'grab',
                        },
                        hover: {
                          fill: isVisited ? 'rgba(16, 185, 129, 0.6)' : '#1a1a1a',
                          stroke: '#2a2a2a',
                          strokeWidth: 0.5,
                          outline: 'none',
                          cursor: isVisited ? 'pointer' : 'grab',
                        },
                        pressed: {
                          fill: isVisited ? 'rgba(16, 185, 129, 0.6)' : '#1a1a1a',
                          stroke: '#2a2a2a',
                          strokeWidth: 0.5,
                          outline: 'none',
                        },
                      }}
                    />
                  );
                })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      <Minimap zoom={zoomState.zoom} coordinates={zoomState.coordinates} />

      <div className="absolute bottom-3 right-3 z-40 flex flex-col gap-1">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleZoomIn}
          disabled={zoomState.zoom >= 5}
          className="border border-white/10 bg-black/80 backdrop-blur-sm text-white/60 hover:text-white hover:bg-white/10"
        >
          <Plus />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleZoomOut}
          disabled={zoomState.zoom <= 1}
          className="border border-white/10 bg-black/80 backdrop-blur-sm text-white/60 hover:text-white hover:bg-white/10"
        >
          <Minus />
        </Button>
      </div>

      <AnimatePresence>
        {popover && (
          <motion.div
            initial={reducedMotion ? {opacity: 1} : {opacity: 0}}
            animate={{opacity: 1}}
            exit={reducedMotion ? {opacity: 0} : {opacity: 0}}
            transition={{duration: reducedMotion ? 0 : 0.15}}
            className="absolute z-50 pointer-events-none w-64 overflow-hidden rounded-lg border border-white/10 bg-neutral-900/95 backdrop-blur-sm shadow-xl"
            style={getPopoverStyle()}
          >
            <img
              src={popover.country.image}
              alt={popover.name}
              className="w-full h-32 object-cover"
            />
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-white">{popover.name}</p>
              <p className="text-xs text-white/50">{popover.country.year}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
