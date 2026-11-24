import type {TravelPlace} from '@/config/travel';

export const NUM_TO_ALPHA2: Record<string, string> = {
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

export function countCountries(places: TravelPlace[]): number {
  return new Set(places.map((place) => place.code)).size;
}

export function visitsNewestFirst(place: TravelPlace) {
  return [...place.visits].sort((a, b) => b.date.localeCompare(a.date));
}

export function formatVisitDate(date: string, locale: string): string {
  const [year, month] = date.split('-').map(Number);
  if (!month) return String(year);
  return new Intl.DateTimeFormat(locale, {month: 'short', year: 'numeric', timeZone: 'UTC'}).format(
    new Date(Date.UTC(year, month - 1, 1)),
  );
}

export function placeId(place: TravelPlace, index: number): string {
  return `${place.code}-${index}`;
}

export type TripStop = {id: string; name?: string};

export type Trip = {
  code: string;
  start: string;
  end: string;
  stops: TripStop[];
};

function monthIndex(date: string): number {
  const [year, month] = date.split('-').map(Number);
  return year * 12 + (month || 1) - 1;
}

export function latestTripYear(places: TravelPlace[]): number {
  return Math.max(...places.flatMap((p) => p.visits.map((v) => Number(v.date.slice(0, 4)))));
}

export function tripsInYear(places: TravelPlace[], year: number): Trip[] {
  const visits = places
    .flatMap((place, i) =>
      place.visits
        .filter((v) => v.date.startsWith(`${year}`))
        .map((v) => ({code: place.code, date: v.date, stop: {id: placeId(place, i), name: place.name}})),
    )
    .sort((a, b) => a.code.localeCompare(b.code) || a.date.localeCompare(b.date));

  const trips: Trip[] = [];
  for (const v of visits) {
    const last = trips.at(-1);
    if (last && last.code === v.code && monthIndex(v.date) - monthIndex(last.end) <= 1) {
      last.end = v.date > last.end ? v.date : last.end;
      if (!last.stops.some((s) => s.id === v.stop.id)) last.stops.push(v.stop);
    } else {
      trips.push({code: v.code, start: v.date, end: v.date, stops: [v.stop]});
    }
  }
  return trips.sort((a, b) => b.start.localeCompare(a.start));
}

export function formatTripDates(trip: Trip, locale: string): string {
  if (trip.start === trip.end || !trip.start.includes('-')) return formatVisitDate(trip.start, locale);
  if (trip.start.slice(0, 4) !== trip.end.slice(0, 4)) {
    return `${formatVisitDate(trip.start, locale)} – ${formatVisitDate(trip.end, locale)}`;
  }
  const month = Number(trip.start.slice(5, 7));
  const startMonth = new Intl.DateTimeFormat(locale, {month: 'short', timeZone: 'UTC'}).format(
    new Date(Date.UTC(2000, month - 1, 1)),
  );
  return `${startMonth} – ${formatVisitDate(trip.end, locale)}`;
}

export const TRAVEL_FOCUS_EVENT = 'travel:focus';

export function requestTravelFocus(id: string) {
  window.dispatchEvent(new CustomEvent<string>(TRAVEL_FOCUS_EVENT, {detail: id}));
}

export function findPlaceId(places: TravelPlace[], code: string, name?: string): string | null {
  const index = places.findIndex((p) => p.code === code && p.name === name);
  return index === -1 ? null : placeId(places[index], index);
}
