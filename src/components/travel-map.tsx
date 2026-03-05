'use client';

import {useState, useCallback, useRef, memo} from 'react';
import {ComposableMap, Geographies, Geography, ZoomableGroup} from 'react-simple-maps';
import {AnimatePresence, motion, useReducedMotion} from 'framer-motion';
import Image from 'next/image';
import {Plus, Minus} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {visitedCountries, type VisitedCountry} from '@/config/travel';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const ANTARCTICA_ID = '010';
const MAP_CENTER: [number, number] = [10, 35];
const MAP_SCALE = 150;

// ISO 3166-1 numeric → alpha-2 mapping
// world-atlas topojson uses numeric IDs, our config uses alpha-2
const NUM_TO_ALPHA2: Record<string, string> = {
  '004': 'AF', '008': 'AL', '012': 'DZ', '020': 'AD', '024': 'AO',
  '028': 'AG', '032': 'AR', '051': 'AM', '036': 'AU', '040': 'AT',
  '031': 'AZ', '044': 'BS', '048': 'BH', '050': 'BD', '052': 'BB',
  '112': 'BY', '056': 'BE', '084': 'BZ', '204': 'BJ', '064': 'BT',
  '068': 'BO', '070': 'BA', '072': 'BW', '076': 'BR', '096': 'BN',
  '100': 'BG', '854': 'BF', '108': 'BI', '132': 'CV', '116': 'KH',
  '120': 'CM', '124': 'CA', '140': 'CF', '148': 'TD', '152': 'CL',
  '156': 'CN', '170': 'CO', '174': 'KM', '178': 'CG', '180': 'CD',
  '188': 'CR', '191': 'HR', '192': 'CU', '196': 'CY', '203': 'CZ',
  '208': 'DK', '262': 'DJ', '212': 'DM', '214': 'DO', '218': 'EC',
  '818': 'EG', '222': 'SV', '226': 'GQ', '232': 'ER', '233': 'EE',
  '748': 'SZ', '231': 'ET', '242': 'FJ', '246': 'FI', '250': 'FR',
  '266': 'GA', '270': 'GM', '268': 'GE', '276': 'DE', '288': 'GH',
  '300': 'GR', '308': 'GD', '320': 'GT', '324': 'GN', '328': 'GY',
  '332': 'HT', '340': 'HN', '348': 'HU', '352': 'IS', '356': 'IN',
  '360': 'ID', '364': 'IR', '368': 'IQ', '372': 'IE', '376': 'IL',
  '380': 'IT', '384': 'CI', '388': 'JM', '392': 'JP', '400': 'JO',
  '398': 'KZ', '404': 'KE', '408': 'KP', '410': 'KR', '414': 'KW',
  '417': 'KG', '418': 'LA', '428': 'LV', '422': 'LB', '426': 'LS',
  '430': 'LR', '434': 'LY', '438': 'LI', '440': 'LT', '442': 'LU',
  '450': 'MG', '454': 'MW', '458': 'MY', '462': 'MV', '466': 'ML',
  '470': 'MT', '478': 'MR', '480': 'MU', '484': 'MX', '498': 'MD',
  '492': 'MC', '496': 'MN', '499': 'ME', '504': 'MA', '508': 'MZ',
  '104': 'MM', '516': 'NA', '524': 'NP', '528': 'NL', '554': 'NZ',
  '558': 'NI', '562': 'NE', '566': 'NG', '578': 'NO', '512': 'OM',
  '586': 'PK', '591': 'PA', '598': 'PG', '600': 'PY', '604': 'PE',
  '608': 'PH', '616': 'PL', '620': 'PT', '634': 'QA', '642': 'RO',
  '643': 'RU', '646': 'RW', '682': 'SA', '686': 'SN', '688': 'RS',
  '694': 'SL', '702': 'SG', '703': 'SK', '705': 'SI', '706': 'SO',
  '710': 'ZA', '724': 'ES', '144': 'LK', '736': 'SD', '740': 'SR',
  '752': 'SE', '756': 'CH', '760': 'SY', '762': 'TJ', '834': 'TZ',
  '764': 'TH', '768': 'TG', '780': 'TT', '788': 'TN', '792': 'TR',
  '795': 'TM', '800': 'UG', '804': 'UA', '784': 'AE', '826': 'GB',
  '840': 'US', '858': 'UY', '860': 'UZ', '862': 'VE', '704': 'VN',
  '887': 'YE', '894': 'ZM', '716': 'ZW', '-99': '', '010': 'AQ',
};

const visitedByNumeric = new Map<string, VisitedCountry>();
const visitedByAlpha2 = new Map(visitedCountries.map((c) => [c.code, c]));
for (const [num, alpha2] of Object.entries(NUM_TO_ALPHA2)) {
  const country = visitedByAlpha2.get(alpha2);
  if (country) visitedByNumeric.set(num, country);
}

type PopoverData = {
  country: VisitedCountry;
  name: string;
};

type ZoomState = {
  coordinates: [number, number];
  zoom: number;
};

const MinimapGeographies = memo(function MinimapGeographies() {
  return (
    <Geographies geography={GEO_URL}>
      {({geographies}) =>
        geographies
          .filter((geo) => geo.id !== ANTARCTICA_ID)
          .map((geo) => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              tabIndex={-1}
              style={{
                default: {
                  fill: visitedByNumeric.has(geo.id as string)
                    ? 'rgba(16, 185, 129, 0.4)'
                    : '#1a1a1a',
                  stroke: '#2a2a2a',
                  strokeWidth: 0.3,
                  outline: 'none',
                  pointerEvents: 'none' as const,
                },
                hover: {fill: '', outline: 'none'},
                pressed: {fill: '', outline: 'none'},
              }}
            />
          ))
      }
    </Geographies>
  );
});

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
        <MinimapGeographies />
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
    (geo: {id: string | number; properties: {name: string}}) => {
      const country = visitedByNumeric.get(geo.id as string);
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
    (geo: {id: string | number; properties: {name: string}}) => {
      const country = visitedByNumeric.get(geo.id as string);
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
          onMoveEnd={handleMoveEnd}
        >
          <Geographies geography={GEO_URL}>
            {({geographies}) =>
              geographies
                .filter((geo) => geo.id !== ANTARCTICA_ID)
                .map((geo) => {
                  const isVisited = visitedByNumeric.has(geo.id as string);

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => handleGeoMouseEnter(geo)}
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
            className={`absolute z-50 pointer-events-none overflow-hidden rounded-lg border border-white/10 bg-neutral-900/95 backdrop-blur-sm shadow-xl ${
              popover.country.image && popover.country.image.width < popover.country.image.height ? 'w-48' : 'w-56'
            }`}
            style={getPopoverStyle()}
          >
            {popover.country.image && (
              <div
                className="relative w-full"
                style={{
                  aspectRatio:
                    popover.country.image.width > popover.country.image.height
                      ? '16 / 9'
                      : '3 / 4',
                }}
              >
                <Image
                  src={popover.country.image}
                  alt={popover.name}
                  fill
                  sizes="224px"
                  placeholder="blur"
                  className="object-cover object-center"
                />
              </div>
            )}
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-white">{popover.name}</p>
              <p className="text-xs text-white/50">{popover.country.year}</p>
              {popover.country.caption && (
                <p className="text-xs text-white/40 mt-1">{popover.country.caption}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
