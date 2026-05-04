/** GoGym tariff API — see https://api.beta.gogym.club/api (Swagger) */

export const GOGYM_API_DEFAULT_BASE = 'https://api.beta.gogym.club';

export const COACH_ROLE = 4;
export const SPORTSMAN_ROLE = 5;

const KZ_COUNTRY_CODE = 'KZ' as const;

const DEFAULT_PLAN_GRADIENT = ['rgba(37, 37, 39, 1)', 'rgba(37, 37, 39, 1)'] as const;

const FEATURE_VALUE_LABEL = {
  Allowed: 'allowed',
  Unlimited: 'unlimited',
  System: 'system',
} as const;

const FEATURE_VALUE_SYMBOL: Record<(typeof FEATURE_VALUE_LABEL)[keyof typeof FEATURE_VALUE_LABEL], string> = {
  [FEATURE_VALUE_LABEL.Allowed]: '✓',
  [FEATURE_VALUE_LABEL.Unlimited]: '∞',
  [FEATURE_VALUE_LABEL.System]: '—',
};

export type LocalizedApiText = Record<string, string | undefined>;

export type TariffFeatureMobile = {
  title?: LocalizedApiText;
  label?: LocalizedApiText;
  /** Relative path e.g. `/tariffPlans/templates.svg` */
  icon?: string;
  iconFullPath?: string;
  /** Icon glyph color (e.g. dark on gradient) */
  iconColor?: string;
  /** Two gradient stops for the icon tile background */
  colors?: string[];
};

export type TariffFeatureApi = {
  key: string;
  name?: LocalizedApiText;
  mobile?: TariffFeatureMobile;
  value?: string | number;
};

export type TariffPlanApi = {
  id: string;
  forRole: number;
  isFree: boolean;
  name: LocalizedApiText;
  description?: LocalizedApiText;
  gradient?: string[];
  features: TariffFeatureApi[];
};

export type TariffPriceApi = {
  tariffPlanName: string;
  price: number;
  countryCode: string;
};

export type TariffFeatureView = {
  key: string;
  title: string;
  description: string;
  valueLabel: string;
  iconUrl: string | null;
  /** Gradient stops from API `mobile.colors`; null → use UI fallback */
  iconColors: [string, string] | null;
  /** When set with `iconUrl`, icon is drawn via mask for correct tint */
  iconColor: string | null;
};

export type TariffPlanView = {
  id: string;
  name: string;
  description: string;
  priceKzt: number;
  isFree: boolean;
  gradient: string[];
  features: TariffFeatureView[];
};

function getApiBase(): string {
  return process.env.GOGYM_API_BASE_URL?.replace(/\/$/, '') || GOGYM_API_DEFAULT_BASE;
}

export async function fetchTariffPlansConfig(): Promise<TariffPlanApi[]> {
  const res = await fetch(`${getApiBase()}/v1/config/tariff-plans`, {
    next: { revalidate: 300 },
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    throw new Error(`tariff-plans config: ${res.status}`);
  }
  const data = (await res.json()) as unknown;
  if (!Array.isArray(data)) {
    throw new Error('tariff-plans config: expected array');
  }
  return data as TariffPlanApi[];
}

export async function fetchTariffPrices(): Promise<TariffPriceApi[]> {
  const res = await fetch(`${getApiBase()}/v1/landing/tariff-plans/prices`, {
    next: { revalidate: 300 },
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    throw new Error(`tariff-plans prices: ${res.status}`);
  }
  const data = (await res.json()) as unknown;
  if (!Array.isArray(data)) {
    throw new Error('tariff-plans prices: expected array');
  }
  return data as TariffPriceApi[];
}

export function buildKztPriceMap(prices: TariffPriceApi[] | null | undefined): Map<string, number> {
  const map = new Map<string, number>();
  if (!Array.isArray(prices)) {
    return map;
  }
  for (const row of prices) {
    if (row.countryCode === KZ_COUNTRY_CODE) {
      map.set(row.tariffPlanName, row.price);
    }
  }
  return map;
}

/** Normalize API `mobile.colors` to a pair for `linear-gradient` */
export function normalizeFeatureIconColors(colors?: string[] | null): [string, string] | null {
  if (!colors?.length) {
    return null;
  }
  const a = colors[0]?.trim();
  const b = (colors.length >= 2 ? colors[1] : colors[0])?.trim();
  if (!a) {
    return null;
  }
  return [a, b || a];
}

/** Resolve icon URL from API `iconFullPath` */
export function resolveFeatureIconUrl(iconFullPath?: string): string | null {
  if (!iconFullPath) {
    return null;
  }
  if (iconFullPath.startsWith('http://') || iconFullPath.startsWith('https://')) {
    return iconFullPath;
  }
  if (iconFullPath.startsWith('//')) {
    return `https:${iconFullPath}`;
  }
  return `https://${iconFullPath}`;
}

const LOCALE_FALLBACK_ORDER: Record<string, readonly string[]> = {
  ua: ['uk', 'en'],
  en: ['en', 'uk'],
};

function pickLocalized(text: LocalizedApiText | undefined, locale: string): string {
  if (!text) {
    return '';
  }
  const order = LOCALE_FALLBACK_ORDER[locale] ?? [locale, 'en', 'uk'];

  for (const key of order) {
    const v = text[key];
    if (typeof v === 'string' && v.length > 0) {
      return v;
    }
  }
  const first = Object.values(text).find((s) => typeof s === 'string' && s.length);
  return (first as string) ?? '';
}

function formatFeatureValue(value: string | number | undefined): string {
  if (value == null) {
    return '';
  }
  if (typeof value === 'string' && value in FEATURE_VALUE_SYMBOL) {
    return FEATURE_VALUE_SYMBOL[value as keyof typeof FEATURE_VALUE_SYMBOL];
  }
  return String(value);
}

export function planToView(plan: TariffPlanApi, priceMap: Map<string, number>, locale: string): TariffPlanView {
  const priceKzt = plan.isFree ? 0 : (priceMap.get(plan.id) ?? 0);

  const features: TariffFeatureView[] = (plan.features ?? []).map((f) => {
    const title = pickLocalized(f.mobile?.title ?? f.name ?? {}, locale);
    const description = pickLocalized(f.mobile?.label, locale);
    const valueLabel = formatFeatureValue(f.value);

    const iconColor = f.mobile?.iconColor?.trim() || null;

    return {
      key: f.key,
      title: title || pickLocalized(f.name ?? {}, locale),
      description,
      valueLabel,
      iconUrl: resolveFeatureIconUrl(f.mobile?.iconFullPath),
      iconColors: normalizeFeatureIconColors(f.mobile?.colors),
      iconColor,
    };
  });

  return {
    id: plan.id,
    name: pickLocalized(plan.name, locale),
    description: pickLocalized(plan.description, locale),
    priceKzt,
    isFree: plan.isFree,
    gradient: plan.gradient?.length ? plan.gradient : [...DEFAULT_PLAN_GRADIENT],
    features,
  };
}

export function splitPlansByRole(plans: TariffPlanApi[] | null | undefined): {
  coach: TariffPlanApi[];
  sportsman: TariffPlanApi[];
} {
  const list = Array.isArray(plans) ? plans : [];
  const coach = list.filter((p) => p.forRole === COACH_ROLE);
  const sportsman = list.filter((p) => p.forRole === SPORTSMAN_ROLE);

  return { coach, sportsman };
}

export function sortTariffPlansByPriceAsc(plans: TariffPlanView[]): TariffPlanView[] {
  return [...plans].sort((a, b) => {
    if (a.priceKzt !== b.priceKzt) {
      return a.priceKzt - b.priceKzt;
    }
    return a.id.localeCompare(b.id);
  });
}

export function formatKzt(amount: number): string {
  const formatted = new Intl.NumberFormat('kk-KZ', {
    maximumFractionDigits: 2,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);

  return `${formatted} ₸`;
}
