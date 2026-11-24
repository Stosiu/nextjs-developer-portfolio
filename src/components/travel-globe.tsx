'use client';

import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import {useLocale, useTranslations} from 'next-intl';
import Globe, {type GlobeMethods} from 'react-globe.gl';
import {
  CylinderGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  MeshStandardMaterial,
  SphereGeometry,
} from 'three';
import {feature} from 'topojson-client';
import type {GeometryCollection, Topology} from 'topojson-specification';
import type {Feature, Geometry} from 'geojson';
import {geoAzimuthalEqualArea, geoPath} from 'd3-geo';
import atlas from 'world-atlas/countries-110m.json';
import {motion} from 'framer-motion';
import Image from 'next/image';
import {Plus, Minus, X} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {travelPlaces, type TravelPlace} from '@/config/travel';
import {NUM_TO_ALPHA2, formatVisitDate, visitsNewestFirst} from '@/lib/travel';
import {createSpace} from '@/components/travel-space';

const ANTARCTICA_ID = '010';
const GLOBE_RADIUS = 100;
const START_VIEW = {lat: 38, lng: 15, altitude: 2.3};
const INTRO_VIEW = {lat: 20, lng: -60, altitude: 5};
const INTRO_MS = 2600;
const FOCUS_ALTITUDE = 1.6;
const FOCUS_LAT_OFFSET = 9;
const MIN_ALTITUDE = 0.6;
const MAX_ALTITUDE = 3.5;
const TOUR_INTERVAL_MS = 5000;
const FLY_MS = 1200;
const PIN_COLOR = '#10B981';
const PIN_OPEN_COLOR = '#FF6B35';
const NOTE_ALTITUDE = 0.085;

type CountryFeature = Feature<Geometry, {name: string}> & {id: string};

type Pin = {
  id: string;
  place: TravelPlace;
  lat: number;
  lng: number;
};

const topology = atlas as unknown as Topology<{countries: GeometryCollection<{name: string}>}>;
const countries = (feature(topology, topology.objects.countries).features as CountryFeature[]).filter(
  (f) => f.id !== ANTARCTICA_ID,
);
const countryByCode = new Map(countries.map((c) => [NUM_TO_ALPHA2[c.id] ?? '', c]));

const pins: Pin[] = travelPlaces.map((place, i) => ({
  id: `${place.code}-${i}`,
  place,
  lat: place.coords[0],
  lng: place.coords[1],
}));

const visitedCodes = new Set(travelPlaces.map((p) => p.code));
const tourPins = pins.filter((pin) => pin.place.visits.some((v) => v.caption));

function codeOf(country: object) {
  return NUM_TO_ALPHA2[(country as CountryFeature).id] ?? '';
}

function fromOverlay(event?: Event) {
  return event?.target instanceof Element && event.target.closest('[data-globe-overlay]') !== null;
}

type PinObject = {group: Group; head: MeshStandardMaterial};

function buildPins(): Map<string, PinObject> {
  const needle = new CylinderGeometry(0.14, 0.04, 6, 6).rotateX(Math.PI / 2).translate(0, 0, 3);
  const head = new SphereGeometry(1.4, 20, 14).translate(0, 0, 6.6);
  const hit = new SphereGeometry(3.2, 8, 6).translate(0, 0, 5.5);
  const needleMaterial = new MeshStandardMaterial({color: '#d4d4d8', metalness: 0.85, roughness: 0.3});
  const hitMaterial = new MeshBasicMaterial({transparent: true, opacity: 0, depthWrite: false});
  return new Map(
    pins.map((pin) => {
      const material = new MeshStandardMaterial({
        color: PIN_COLOR,
        emissive: PIN_COLOR,
        emissiveIntensity: 0.25,
        metalness: 0.2,
        roughness: 0.35,
      });
      const group = new Group();
      group.add(new Mesh(needle, needleMaterial), new Mesh(head, material), new Mesh(hit, hitMaterial));
      group.scale.setScalar(0.001);
      return [pin.id, {group, head: material}];
    }),
  );
}

type TravelGlobeProps = {
  visible: boolean;
  reducedMotion: boolean;
  onReady: () => void;
};

export function TravelGlobe({visible, reducedMotion, onReady}: TravelGlobeProps) {
  const t = useTranslations('travel');
  const locale = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const spaceRef = useRef<ReturnType<typeof createSpace> | null>(null);
  const overOverlay = useRef(false);
  const introStart = useRef<number | null>(null);
  const pointerStart = useRef<{x: number; y: number} | null>(null);
  const [size, setSize] = useState({width: 0, height: 0});
  const [ready, setReady] = useState(false);
  const [introDone, setIntroDone] = useState(reducedMotion);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [touring, setTouring] = useState(!reducedMotion);
  const [altitude, setAltitude] = useState(START_VIEW.altitude);

  const regionNames = useMemo(() => new Intl.DisplayNames([locale], {type: 'region'}), [locale]);
  const pinObjects = useMemo(buildPins, []);
  const noteNodes = useMemo(() => {
    if (typeof document === 'undefined') return new Map<string, HTMLDivElement>();
    return new Map(
      pins.map((pin) => {
        const node = document.createElement('div');
        node.style.width = '0';
        node.style.height = '0';
        node.dataset.globeOverlay = '';
        return [pin.id, node];
      }),
    );
  }, []);

  const openId = activeId ?? hoveredId;
  const openPin = pins.find((p) => p.id === openId) ?? null;
  const activeCode = pins.find((p) => p.id === activeId)?.place.code ?? null;

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
    const globe = globeRef.current;
    if (!globe || !ready) return;
    if (visible) {
      globe.resumeAnimation();
      if (!reducedMotion) spaceRef.current?.start();
    } else {
      globe.pauseAnimation();
      spaceRef.current?.stop();
    }
  }, [visible, ready, reducedMotion]);

  useEffect(() => () => spaceRef.current?.dispose(), []);

  useEffect(() => {
    if (!ready) return;
    introStart.current ??= performance.now();
    const start = introStart.current;
    const order = [...pins].sort((a, b) => a.lng - b.lng).map((p) => p.id);
    let frame = 0;
    const introEnd = start + 900 + order.length * 25 + 350;
    const tick = (now: number) => {
      let settled = reducedMotion || now > introEnd;
      order.forEach((id, i) => {
        const obj = pinObjects.get(id);
        if (!obj) return;
        const target = id === openId ? 1.35 : 1;
        const appear = reducedMotion ? 1 : Math.min(1, Math.max(0, (now - start - 900 - i * 25) / 350));
        const eased = 1 - Math.pow(1 - appear, 3);
        const goal = target * eased;
        const current = obj.group.scale.x;
        const next = reducedMotion ? goal : current + (goal - current) * 0.25;
        obj.group.scale.setScalar(next);
        if (Math.abs(goal - next) > 0.002) settled = false;
      });
      if (!settled) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    for (const [id, obj] of pinObjects) {
      const color = id === openId ? PIN_OPEN_COLOR : PIN_COLOR;
      obj.head.color.set(color);
      obj.head.emissive.set(color);
    }
    return () => cancelAnimationFrame(frame);
  }, [ready, openId, pinObjects, reducedMotion]);

  const flyTo = useCallback(
    (pin: Pin) => {
      const alt = Math.min(FOCUS_ALTITUDE, globeRef.current?.pointOfView().altitude ?? FOCUS_ALTITUDE);
      globeRef.current?.pointOfView(
        {lat: pin.lat + FOCUS_LAT_OFFSET * (alt / FOCUS_ALTITUDE), lng: pin.lng, altitude: alt},
        reducedMotion ? 0 : FLY_MS,
      );
    },
    [reducedMotion],
  );

  useEffect(() => {
    if (!touring || !visible || !introDone || tourPins.length === 0) return;
    let index = 0;
    const timer = setInterval(() => {
      const pin = tourPins[index % tourPins.length];
      index += 1;
      setActiveId(pin.id);
      flyTo(pin);
    }, TOUR_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [touring, visible, introDone, flyTo]);

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
    globe.renderer().setPixelRatio(Math.min(2, window.devicePixelRatio));
    const controls = globe.controls();
    controls.enableZoom = true;
    controls.zoomSpeed = 0.6;
    controls.minDistance = GLOBE_RADIUS * (1 + MIN_ALTITUDE);
    spaceRef.current = createSpace(globe);
    if (reducedMotion) {
      globe.pointOfView(START_VIEW, 0);
      controls.maxDistance = GLOBE_RADIUS * (1 + MAX_ALTITUDE);
    } else {
      globe.pointOfView(INTRO_VIEW, 0);
      globe.pointOfView(START_VIEW, INTRO_MS);
      setTimeout(() => {
        controls.maxDistance = GLOBE_RADIUS * (1 + MAX_ALTITUDE);
        setIntroDone(true);
      }, INTRO_MS);
    }
    setReady(true);
    onReady();
  }, [reducedMotion, onReady]);

  const zoom = useCallback(
    (factor: number) => {
      const globe = globeRef.current;
      if (!globe) return;
      const next = Math.min(MAX_ALTITUDE, Math.max(MIN_ALTITUDE, globe.pointOfView().altitude * factor));
      globe.pointOfView({altitude: next}, reducedMotion ? 0 : 400);
    },
    [reducedMotion],
  );

  const handleZoom = useCallback((pov: {altitude: number}) => {
    setAltitude(Math.round(pov.altitude * 20) / 20);
  }, []);

  const globeMaterial = useMemo(
    () => new MeshPhongMaterial({color: '#0d1216', emissive: '#050708', shininess: 6}),
    [],
  );

  const capColor = useCallback(
    (d: object) => {
      const code = codeOf(d);
      if (!visitedCodes.has(code)) return '#181b1d';
      return code === activeCode ? 'rgba(16, 185, 129, 0.85)' : 'rgba(16, 185, 129, 0.5)';
    },
    [activeCode],
  );

  const polygonAltitude = useCallback(
    (d: object) => {
      const code = codeOf(d);
      if (!visitedCodes.has(code)) return 0.004;
      return code === activeCode ? 0.025 : 0.012;
    },
    [activeCode],
  );

  const sideColor = useCallback(
    (d: object) => (visitedCodes.has(codeOf(d)) ? 'rgba(16, 185, 129, 0.25)' : 'rgba(0, 0, 0, 0)'),
    [],
  );
  const strokeColor = useCallback(() => '#2f3437', []);
  const pinObject = useCallback((d: object) => pinObjects.get((d as Pin).id)?.group ?? new Group(), [pinObjects]);
  const noteElement = useCallback((d: object) => noteNodes.get((d as Pin).id) as HTMLElement, [noteNodes]);
  const noteVisibility = useCallback((el: HTMLElement, isVisible: boolean) => {
    el.style.visibility = isVisible ? 'visible' : 'hidden';
  }, []);
  const noteData = useMemo(() => (openPin ? [openPin] : []), [openPin]);

  const handlePinClick = useCallback(
    (d: object, event: MouseEvent) => {
      if (fromOverlay(event)) return;
      const pin = d as Pin;
      select(pin.id === activeId ? null : pin);
    },
    [select, activeId],
  );

  const handlePinHover = useCallback((d: object | null) => {
    if (overOverlay.current) return;
    setHoveredId(d ? (d as Pin).id : null);
  }, []);

  const handlePolygonClick = useCallback(
    (d: object, event: MouseEvent) => {
      if (fromOverlay(event)) return;
      const code = codeOf(d);
      select(pins.find((p) => p.place.code === code) ?? null);
    },
    [select],
  );

  const handleGlobeClick = useCallback(
    (_: unknown, event: MouseEvent) => {
      if (fromOverlay(event)) return;
      select(null);
    },
    [select],
  );

  const showPointerCursor = useCallback(
    (type: string, d: object) => type === 'object' || (type === 'polygon' && visitedCodes.has(codeOf(d))),
    [],
  );

  const handleSpaceClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const start = pointerStart.current;
    if (!(e.target instanceof HTMLCanvasElement) || !start) return;
    if (Math.hypot(e.clientX - start.x, e.clientY - start.y) > 5) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (globeRef.current?.toGlobeCoords(x, y)) return;
    if (!reducedMotion) spaceRef.current?.spawnMeteor((x / rect.width) * 2 - 1, -(y / rect.height) * 2 + 1);
  };

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`}
      onPointerDown={(e) => {
        pointerStart.current = {x: e.clientX, y: e.clientY};
        setTouring(false);
      }}
      onClick={handleSpaceClick}
    >
      {size.width > 0 && (
        <Globe
          ref={globeRef}
          width={size.width}
          height={size.height}
          rendererConfig={{antialias: true, alpha: true, powerPreference: 'high-performance'}}
          backgroundColor="rgba(0,0,0,0)"
          globeMaterial={globeMaterial}
          showAtmosphere
          atmosphereColor="#10B981"
          atmosphereAltitude={0.18}
          onGlobeReady={handleGlobeReady}
          onGlobeClick={handleGlobeClick}
          onZoom={handleZoom}
          polygonsData={countries}
          polygonCapColor={capColor}
          polygonSideColor={sideColor}
          polygonStrokeColor={strokeColor}
          polygonAltitude={polygonAltitude}
          polygonsTransitionDuration={reducedMotion ? 0 : 600}
          onPolygonClick={handlePolygonClick}
          objectsData={pins}
          objectAltitude={0.004}
          objectThreeObject={pinObject}
          onObjectClick={handlePinClick}
          onObjectHover={handlePinHover}
          showPointerCursor={showPointerCursor}
          htmlElementsData={noteData}
          htmlAltitude={NOTE_ALTITUDE}
          htmlElement={noteElement}
          htmlElementVisibilityModifier={noteVisibility}
          htmlTransitionDuration={0}
        />
      )}

      {openPin &&
        noteNodes.get(openPin.id) &&
        createPortal(
          <StickyNote
            key={openPin.id}
            pin={openPin}
            title={
              openPin.place.name
                ? `${openPin.place.name}, ${regionNames.of(openPin.place.code)}`
                : (regionNames.of(openPin.place.code) ?? openPin.place.code)
            }
            closable={openPin.id === activeId}
            reducedMotion={reducedMotion}
            onClose={() => select(null)}
            onPointerEnter={() => {
              overOverlay.current = true;
            }}
            onPointerLeave={() => {
              overOverlay.current = false;
            }}
          />,
          noteNodes.get(openPin.id) as HTMLDivElement,
        )}

      <ul className="sr-only">
        {pins.map((pin) => (
          <li key={pin.id}>
            <button type="button" onClick={() => select(pin)}>
              {pin.place.name ? `${pin.place.name}, ` : ''}
              {regionNames.of(pin.place.code)}, {t('visits', {count: pin.place.visits.length})}
            </button>
          </li>
        ))}
      </ul>

      <p className="pointer-events-none absolute top-3 inset-x-0 text-center text-xs text-white/40">{t('hint')}</p>

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

type StickyNoteProps = {
  pin: Pin;
  title: string;
  closable: boolean;
  reducedMotion: boolean;
  onClose: () => void;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
};

function StickyNote({pin, title, closable, reducedMotion, onClose, onPointerEnter, onPointerLeave}: StickyNoteProps) {
  const t = useTranslations('travel');
  const locale = useLocale();
  const visits = visitsNewestFirst(pin.place);
  const [selected, setSelected] = useState(0);
  const visit = visits[selected] ?? visits[0];
  const tilt = (pin.id.charCodeAt(0) % 2 === 0 ? -1 : 1) * 2;

  return (
    <motion.div
      initial={reducedMotion ? {opacity: 1, rotate: tilt} : {opacity: 0, y: 8, rotate: 0, scale: 0.95}}
      animate={{opacity: 1, y: 0, rotate: tilt, scale: 1}}
      transition={{duration: reducedMotion ? 0 : 0.2}}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      className="pointer-events-auto absolute bottom-[14px] -left-[112px] w-56 cursor-default bg-amber-100 text-neutral-900 shadow-[0_10px_25px_rgba(0,0,0,0.55)]"
      style={{transformOrigin: 'bottom center'}}
    >
      <span
        aria-hidden
        className="absolute -top-2.5 left-1/2 h-5 w-16 -translate-x-1/2 rotate-[-3deg] bg-white/50 backdrop-blur-[1px]"
      />
      <div className="px-2.5 pt-3">
        <div
          className="relative w-full overflow-hidden bg-white p-1 shadow-sm"
          style={{
            aspectRatio: visit.image && visit.image.width > visit.image.height ? '16 / 10' : visit.image ? '1 / 1' : '16 / 10',
          }}
        >
          <div className="relative h-full w-full">
            {visit.image ? (
              <Image
                key={visit.date}
                src={visit.image}
                alt={title}
                fill
                sizes="208px"
                placeholder="blur"
                className="object-cover object-center"
              />
            ) : (
              <CountrySketch code={pin.place.code} coords={pin.place.coords} label={t('noPhoto')} />
            )}
          </div>
        </div>
      </div>
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
                key={`${v.date}-${i}`}
                type="button"
                onClick={() => setSelected(i)}
                aria-pressed={i === selected}
                className={`rounded-sm px-1.5 py-0.5 text-[11px] font-medium tabular-nums ${
                  i === selected ? 'bg-neutral-900 text-amber-100' : 'bg-amber-200/80 text-neutral-700 hover:bg-amber-300'
                }`}
              >
                {formatVisitDate(v.date, locale)}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-xs text-neutral-600 tabular-nums">{formatVisitDate(visit.date, locale)}</p>
        )}
        {visit.caption && <p className="mt-1.5 text-xs leading-snug text-neutral-700">{visit.caption}</p>}
      </div>
    </motion.div>
  );
}

function CountrySketch({code, coords, label}: {code: string; coords: [number, number]; label: string}) {
  const sketch = useMemo(() => {
    const country = countryByCode.get(code);
    if (!country) return null;
    const projection = geoAzimuthalEqualArea()
      .rotate([-coords[1], -coords[0]])
      .clipAngle(22)
      .fitExtent(
        [
          [16, 12],
          [184, 104],
        ],
        country,
      );
    const point = projection([coords[1], coords[0]]);
    return {d: geoPath(projection)(country) ?? '', point};
  }, [code, coords]);

  return (
    <div className="relative h-full w-full bg-[#0d1216]">
      <svg viewBox="0 0 200 116" className="h-full w-full" aria-hidden>
        <defs>
          <pattern id="sketch-dots" width="8" height="8" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.7" fill="rgba(255,255,255,0.08)" />
          </pattern>
        </defs>
        <rect width="200" height="116" fill="url(#sketch-dots)" />
        {sketch && (
          <>
            <path d={sketch.d} fill="rgba(16,185,129,0.25)" stroke="#10B981" strokeWidth="1" />
            {sketch.point && <circle cx={sketch.point[0]} cy={sketch.point[1]} r="3.5" fill={PIN_OPEN_COLOR} />}
          </>
        )}
      </svg>
      <span className="absolute bottom-1.5 right-2 text-[10px] uppercase tracking-wider text-white/40">{label}</span>
    </div>
  );
}
