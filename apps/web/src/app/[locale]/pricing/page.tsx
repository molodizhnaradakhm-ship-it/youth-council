import { redirect } from 'next/navigation';

type Props = {
  params: Promise<{ locale: string }>;
};

/** Alias for subscriptions / pricing (same page). */
export default async function PricingRedirect({ params }: Props) {
  const { locale } = await params;
  redirect(`/${locale}/subscriptions`);
}
