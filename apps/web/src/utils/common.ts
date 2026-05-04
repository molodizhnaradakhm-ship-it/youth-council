import headerStyles from '@/views/Header/Header.module.scss';

const LOCALE_MAP: Record<string, string> = {
  ua: 'uk',
};

export function formatDate(dateString: string): string {
  const date = new Date(dateString);

  const day = date.getDate().toString().padStart(2, '0');

  const month = (date.getMonth() + 1).toString().padStart(2, '0');

  const year = date.getFullYear().toString();

  return `${day}.${month}.${year}`;
}

export function formatDateString(date: string, locale: string): string {
  const inputDate: Date = new Date(date);

  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };

  return inputDate.toLocaleDateString(locale, options);
}

/** e.g. Monday, March 17, 2025 */
export function formatDateLong(date: string, locale: string): string {
  return new Date(date).toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function scrollToAnchor(anchorId: string, headerHeight: number = 0): void {
  const anchorElement = document.getElementById(anchorId);

  const header = document.querySelector<HTMLElement>(`.${headerStyles.wrapper}`);

  if (!anchorElement) {
    console.error(`Anchor element with id '${anchorId}' not found.`);
    return;
  }

  const offset =
    anchorElement.getBoundingClientRect().top + window.scrollY - (header?.offsetHeight ?? headerHeight);

  window.scrollTo({ behavior: 'smooth', top: offset });
}

export const parseCoordinatesString = (coordinates: string): { lat: number; lng: number } => {
  const [latitudeRaw, longitudeRaw] = coordinates.split(',').map((s) => s.trim());
  const lat = Number.parseFloat(latitudeRaw ?? '');
  const lng = Number.parseFloat(longitudeRaw ?? '');
  return { lat, lng };
};

export function beautifyNumber(x: number | string) {
  return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ' ');
}

export const gMapKey = 'AIzaSyD2DtfFd5gGfXBLDIefuin3wL_y-IhEWo4';

export const replaceVars = ({
  string,
  vars,
}: {
  string: string;
  vars: {
    [key: string]: unknown;
  };
}) => {
  const parts = string.split(/(\{\{.*?\}\})/);

  return parts
    .map((part) => {
      if (part.startsWith('{{') && part.endsWith('}}')) {
        const placeholder = part.substring(2, part.length - 2).trim();

        const value = vars[placeholder];

        return value != null ? value : part;
      }
      return part;
    })
    .join('');
};

export function convertMsToMin(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);

  const minutes = Math.floor(totalSeconds / 60);

  const seconds = totalSeconds % 60;

  const formattedSeconds = seconds.toString().padStart(2, '0');

  return `${minutes}:${formattedSeconds} min`;
}

export function isYouTubeOrVimeoLink(url: string): boolean {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;

  const vimeoRegex = /^(https?:\/\/)?(www\.)?(vimeo\.com)\/.+$/;

  return youtubeRegex.test(url) || vimeoRegex.test(url);
}

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);

  const remainingSeconds = Math.floor(seconds % 60);

  // Додаємо провідний нуль для секунд, якщо менше 10
  const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

  return `${minutes}:${formattedSeconds}`;
}

export const mapLocale = (locale: string) => {
  return LOCALE_MAP[locale] ?? locale;
};
