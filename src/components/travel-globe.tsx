'use client';

import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import {useLocale, useTranslations} from 'next-intl';
import Globe, {type GlobeMethods} from 'react-globe.gl';
import {MeshPhongMaterial} from 'three';
import {feature} from 'topojson-client';
import type {Topology, GeometryCollection} from 'topojson-specification';
import type {Feature, Geometry} from 'geojson';
import {AnimatePresence, motion} from 'framer-motion';
import Image from 'next/image';
import {Plus, Minus, X} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {travelPlaces, type TravelPlace} from '@/config/travel';
import {NUM_TO_ALPHA2, visitsNewestFirst} from '@/lib/travel';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';
const ANTARCTICA_ID = '010';
const START_VIEW = {lat: 42, lng: 15, altitude: 2.2};
const FOCUS_ALTITUDE = 1.6;
const FOCUS_LAT_OFFSET = 9;
const MIN_ALTITUDE = 1.1;
const MAX_ALTITUDE = 3.5;
const TOUR_INTERVAL_MS = 5000;
const FLY_MS = 1200;

type CountryFeature = Feature<Geometry, {name: string}> & {id: string};

type Pin = {
  id: string;
  place: TravelPlace;
  lat: number;
  lng: number;
};

const pins: Pin[] = travelPlaces.map((place, i) => ({
  id: `${place.code}-${i}`,
  place,
  lat: place.coords[0],
  lng: place.coords[1],
}));

const visitedCodes = new Set(travelPlaces.map((p) => p.code));
const tourPins = pins.filter((pin) => pin.place.visits.some((v) => v.caption));

function codeOf(country: CountryFeature) {
  return NUM_TO_ALPHA2[country.id] ?? '';
}

type TravelGlobeProps = {
  visible: boolean;
  reducedMotion: boolean;
};

export function TravelGlobe({visible, reducedMotion}: TravelGlobeProps) {
  const t = useTranslations('travel');
  const locale = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [size, setSize] = useState({width: 0, height: 0});
  const [countries, setCountries] = useState<CountryFeature[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [hoveredCode, setHoveredCode] = useState<string | null>(null);
  const [touring, setTouring] = useState(!reducedMotion);
  const [altitude, setAltitude] = useState(START_VIEW.altitude);

  const regionNames = useMemo(() => new Intl.DisplayNames([locale], {type: 'region'}), [locale]);

  const pinNodes = useMemo(() => {
    if (typeof document === 'undefined') return new Map<string, HTMLDivElement>();
    return new Map(
      pins.map((pin) => {
        const node = document.createElement('div');
        node.style.width = '0';
        node.style.height = '0';
        return [pin.id, node];
      }),
    );
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setSize({width: entry.contentRect.width, height: entry.contentRect.height});
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch(GEO_URL)
      .then((res) => res.json())
      .then((topology: Topology<{countries: GeometryCollection<{name: string}>}>) => {
        if (cancelled) return;
        const collection = feature(topology, topology.objects.countries);
        setCountries(
          (collection.features as CountryFeature[]).filter((f) => f.id !== ANTARCTICA_ID),
        );
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;
    if (visible) globe.resumeAnimation();
    else globe.pauseAnimation();
  }, [visible]);

  const flyTo = useCallback(
    (pin: Pin) => {
      globeRef.current?.pointOfView(
        {lat: pin.lat + FOCUS_LAT_OFFSET, lng: pin.lng, altitude: FOCUS_ALTITUDE},
        reducedMotion ? 0 : FLY_MS,
      );
      setAltitude(FOCUS_ALTITUDE);
    },
    [reducedMotion],
  );

  useEffect(() => {
    if (!touring || !visible || tourPins.length === 0) return;
    let index = 0;
    const step = () => {
      const pin = tourPins[index % tourPins.length];
      index += 1;
      setActiveId(pin.id);
      flyTo(pin);
    };
    const timer = setInterval(step, TOUR_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [touring, visible, flyTo]);

  const select = useCallback(
    (pin: Pin | null) => {
      setTouring(false);
      setActiveId(pin?.id ?? null);
      if (pin) flyTo(pin);
    },
    [flyTo],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveId(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleGlobeReady = useCallback(() => {
    const globe = globeRef.current;
    if (!globe) return;
    globe.controls().enableZoom = false;
    globe.pointOfView(START_VIEW, 0);
  }, []);

  const zoom = useCallback(
    (factor: number) => {
      const globe = globeRef.current;
      if (!globe) return;
      const next = Math.min(MAX_ALTITUDE, Math.max(MIN_ALTITUDE, globe.pointOfView().altitude * factor));
      globe.pointOfView({altitude: next}, reducedMotion ? 0 : 400);
      setAltitude(next);
    },
    [reducedMotion],
  );

  const globeMaterial = useMemo(
    () => new MeshPhongMaterial({color: '#0d1216', emissive: '#050708', shininess: 6}),
    [],
  );

  const openId = activeId ?? hoveredId;

  useEffect(() => {
    for (const [id, node] of pinNodes) node.classList.toggle('travel-pin-open', id === openId);
  }, [openId, pinNodes]);

  const activeCode = pins.find((p) => p.id === activeId)?.place.code ?? null;

  const capColor = useCallback(
    (d: object) => {
      const code = codeOf(d as CountryFeature);
      if (!visitedCodes.has(code)) return '#181b1d';
      return code === hoveredCode || code === activeCode ? 'rgba(16, 185, 129, 0.85)' : 'rgba(16, 185, 129, 0.5)';
    },
    [hoveredCode, activeCode],
  );

  const polygonAltitude = useCallback(
    (d: object) => {
      const code = codeOf(d as CountryFeature);
      if (!visitedCodes.has(code)) return 0.004;
      return code === hoveredCode || code === activeCode ? 0.03 : 0.012;
    },
    [hoveredCode, activeCode],
  );

  const handlePolygonClick = useCallback(
    (d: object) => {
      const code = codeOf(d as CountryFeature);
      select(pins.find((p) => p.place.code === code) ?? null);
    },
    [select],
  );

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      onPointerDown={() => setTouring(false)}
    >
      {size.width > 0 && (
        <Globe
          ref={globeRef}
          width={size.width}
          height={size.height}
          backgroundColor="rgba(0,0,0,0)"
          globeMaterial={globeMaterial}
          showAtmosphere
          atmosphereColor="#10B981"
          atmosphereAltitude={0.18}
          onGlobeReady={handleGlobeReady}
          onGlobeClick={() => select(null)}
          polygonsData={countries}
          polygonCapColor={capColor}
          polygonSideColor={(d) =>
            visitedCodes.has(codeOf(d as CountryFeature)) ? 'rgba(16, 185, 129, 0.25)' : 'rgba(0, 0, 0, 0)'
          }
          polygonStrokeColor={() => '#2f3437'}
          polygonAltitude={polygonAltitude}
          polygonsTransitionDuration={reducedMotion ? 0 : 300}
          onPolygonHover={(d) => setHoveredCode(d ? codeOf(d as CountryFeature) : null)}
          onPolygonClick={handlePolygonClick}
          showPointerCursor={(type, d) => type === 'polygon' && visitedCodes.has(codeOf(d as CountryFeature))}
          htmlElementsData={pins}
          htmlAltitude={0.015}
          htmlElement={(d) => pinNodes.get((d as Pin).id) as HTMLElement}
          htmlElementVisibilityModifier={(el, isVisible) => {
            el.style.visibility = isVisible ? 'visible' : 'hidden';
          }}
          htmlTransitionDuration={0}
        />
      )}

      {pins.map((pin) => {
        const node = pinNodes.get(pin.id);
        if (!node) return null;
        return createPortal(
          <PinMarker
            pin={pin}
            countryName={regionNames.of(pin.place.code) ?? pin.place.code}
            open={pin.id === openId}
            active={pin.id === activeId}
            reducedMotion={reducedMotion}
            onSelect={() => select(pin.id === activeId ? null : pin)}
            onHover={(hovering) => setHoveredId(hovering ? pin.id : null)}
            onClose={() => select(null)}
          />,
          node,
          pin.id,
        );
      })}

      <p className="pointer-events-none absolute top-3 inset-x-0 text-center text-xs text-white/40">
        {t('hint')}
      </p>

      <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 z-40 flex flex-col gap-1">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => zoom(0.75)}
          disabled={altitude <= MIN_ALTITUDE}
          aria-label={t('zoomIn')}
          className="border border-white/10 bg-black/80 backdrop-blur-sm text-white/60 hover:text-white hover:bg-white/10"
        >
          <Plus />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => zoom(1 / 0.75)}
          disabled={altitude >= MAX_ALTITUDE}
          aria-label={t('zoomOut')}
          className="border border-white/10 bg-black/80 backdrop-blur-sm text-white/60 hover:text-white hover:bg-white/10"
        >
          <Minus />
        </Button>
      </div>
    </div>
  );
}

type PinMarkerProps = {
  pin: Pin;
  countryName: string;
  open: boolean;
  active: boolean;
  reducedMotion: boolean;
  onSelect: () => void;
  onHover: (hovering: boolean) => void;
  onClose: () => void;
};

function PinMarker({pin, countryName, open, active, reducedMotion, onSelect, onHover, onClose}: PinMarkerProps) {
  const t = useTranslations('travel');
  const visits = pin.place.visits.length;
  const title = pin.place.name ? `${pin.place.name}, ${countryName}` : countryName;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onSelect}
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => onHover(false)}
        onFocus={() => onHover(true)}
        onBlur={() => onHover(false)}
        aria-label={`${title}, ${t('visits', {count: visits})}`}
        aria-expanded={open}
        className="pointer-events-auto absolute -left-[9px] -top-[27px] block transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-full motion-reduce:transition-none"
      >
        <svg width="18" height="28" viewBox="0 0 18 28" aria-hidden className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]">
          <line x1="9" y1="13" x2="9" y2="27" stroke="#d4d4d8" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="9" cy="8" r="7" fill={active || open ? '#FF6B35' : '#10B981'} />
          <circle cx="6.5" cy="5.5" r="2" fill="white" opacity="0.45" />
        </svg>
        {visits > 1 && (
          <span className="absolute -right-2 -top-1.5 min-w-4 h-4 px-1 rounded-full bg-white text-[10px] font-semibold leading-4 text-neutral-900">
            {visits}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <StickyNote
            pin={pin}
            title={title}
            closable={active}
            reducedMotion={reducedMotion}
            onClose={onClose}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

type StickyNoteProps = {
  pin: Pin;
  title: string;
  closable: boolean;
  reducedMotion: boolean;
  onClose: () => void;
};

function StickyNote({pin, title, closable, reducedMotion, onClose}: StickyNoteProps) {
  const t = useTranslations('travel');
  const visits = visitsNewestFirst(pin.place);
  const [selected, setSelected] = useState(0);
  const visit = visits[selected] ?? visits[0];
  const image = visit.image ?? visits.find((v) => v.image)?.image;
  const tilt = (pin.id.charCodeAt(0) % 2 === 0 ? -1 : 1) * 2;

  return (
    <motion.div
      initial={reducedMotion ? {opacity: 1, rotate: tilt} : {opacity: 0, y: 8, rotate: 0, scale: 0.95}}
      animate={{opacity: 1, y: 0, rotate: tilt, scale: 1}}
      exit={{opacity: 0, y: 8, scale: 0.95}}
      transition={{duration: reducedMotion ? 0 : 0.2}}
      className="pointer-events-auto absolute bottom-[34px] -left-[112px] w-56 bg-amber-100 text-neutral-900 shadow-[0_10px_25px_rgba(0,0,0,0.55)]"
      style={{transformOrigin: 'bottom center'}}
    >
      <span
        aria-hidden
        className="absolute -top-2.5 left-1/2 h-5 w-16 -translate-x-1/2 rotate-[-3deg] bg-white/50 backdrop-blur-[1px]"
      />
      {image && (
        <div className="px-2.5 pt-3">
          <div
            className="relative w-full overflow-hidden bg-white p-1 shadow-sm"
            style={{aspectRatio: image.width > image.height ? '16 / 10' : '1 / 1'}}
          >
            <div className="relative h-full w-full">
              <Image
                src={image}
                alt={title}
                fill
                sizes="208px"
                placeholder="blur"
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      )}
      <div className="px-3 pb-3 pt-2.5">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold leading-tight">{title}</p>
          {closable && (
            <button
              type="button"
              onClick={onClose}
              aria-label={t('close')}
              className="-mr-1 -mt-0.5 shrink-0 rounded p-0.5 text-neutral-500 hover:text-neutral-900"
            >
              <X size={14} />
            </button>
          )}
        </div>
        {visits.length > 1 ? (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {visits.map((v, i) => (
              <button
                key={`${v.year}-${i}`}
                type="button"
                onClick={() => setSelected(i)}
                aria-pressed={i === selected}
                className={`rounded-sm px-1.5 py-0.5 text-[11px] font-medium tabular-nums ${
                  i === selected ? 'bg-neutral-900 text-amber-100' : 'bg-amber-200/80 text-neutral-700 hover:bg-amber-300'
                }`}
              >
                {v.year}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-xs text-neutral-600 tabular-nums">{visit.year}</p>
        )}
        {visit.caption && <p className="mt-1.5 text-xs leading-snug text-neutral-700">{visit.caption}</p>}
      </div>
    </motion.div>
  );
}
