import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import type { PropFirm, AccountType } from '@/lib/types';

interface FirmCardProps {
  firm: PropFirm;
}

export default function FirmCard({ firm }: FirmCardProps) {
  const {
    id,
    name,
    logo,
    backgroundImage,
    shortDescription,
    websiteUrl,
    minPayoutTime,
    accountTypes = [],
  } = firm;

  // pull out only the 50k “Challenge” accounts
  const challenges = accountTypes.filter(
    (ac) => ac.accountType === 'Challenge' && ac.accountSize === 50000
  );

  // find cheapest (prefers discountedPrice over price)
  const cheapestValue = challenges.reduce<number | null>((min, ac) => {
    const val = ac.discountedPrice ?? ac.price;
    if (val == null) return min;
    return min === null ? val : Math.min(min, val);
  }, null);

  const selected = challenges.find(
    (ac) => (ac.discountedPrice ?? ac.price) === cheapestValue
  );

  const originalPrice = selected?.price ?? null;
  const discountedPrice = selected?.discountedPrice ?? null;
  const discountPct =
    selected?.currentDiscountRate != null
      ? Math.round(selected.currentDiscountRate)
      : null;
  const discountEnds = selected?.discountEndAt
    ? new Date(selected.discountEndAt).toLocaleDateString()
    : null;
  const activationFee = selected?.activationFee ?? null;
  const referralCode = selected?.referralCode ?? null;

  return (
    <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      {backgroundImage && (
        <div
          className="h-32 bg-center bg-cover"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}

      <div className="p-5 flex flex-col h-full">
        {/* --- header (logo + name) --- */}
        <div className="flex items-center space-x-3">
          <img
            src={logo}
            alt={`${name} logo`}
            className="h-10 w-10 object-contain"
          />
          <h3 className="text-xl font-semibold text-neutral-900">{name}</h3>
        </div>

        {/* --- short description --- */}
        <p className="mt-3 text-sm text-neutral-600 line-clamp-3">
          {shortDescription}
        </p>

        {/* --- discount hero (strike + new price + badge) --- */}
        {discountedPrice != null && discountPct != null && (
          <>
            <dt className="text-neutral-500">50k Account Price</dt>
            <dd>
              <div className="flex items-center gap-2">
                {originalPrice != null && (
                  <span className="align-middle text-lg text-neutral-400 line-through">
                    ${originalPrice.toLocaleString()}
                  </span>
                )}
                <div className="flex items-center gap-2">
                  <span className="align-middle text-3xl font-bold text-neutral-900">
                    ${discountedPrice.toLocaleString()}
                  </span>
                  <span className="inline-flex items-center justify-center align-middle rounded-full bg-blue-50 text-primary-500 text-s font-semibold px-2.5 py-1.5 leading-none">
                    {discountPct}%
                  </span>
                </div>
              </div>
              {/* --- coupon code pill --- */}
              {referralCode && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-neutral-500">Coupon Code:</span>
                  <span className="inline-block bg-neutral-100 text-sm font-mono font-semibold px-3 py-1 rounded">
                    {referralCode}
                  </span>
                </div>
              )}
            </dd>
          </>
        )}


        {/* --- other metadata grid --- */}
        <div className="mt-3 grid grid-cols-2 gap-4 text-sm text-neutral-700 flex-1">
          <div>
            <dt className="text-neutral-500">Activation Fee</dt>
            <dd className="font-medium">
              {activationFee != null
                ? `$${activationFee.toLocaleString()}`
                : '—'}
            </dd>
          </div>
          <div>
            <dt className="text-neutral-500">Discount Ends</dt>
            <dd className="font-medium">{discountEnds ?? '—'}</dd>
          </div>
          {/* add more rows here if you need them */}
        </div>

        {/* --- buttons --- */}
        <div className="mt-6 space-y-2">
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button variant="outline" className="w-full">
              Visit Site
            </Button>
          </a>
          <Link href={`/firms/${id}`} className="block">
            <Button variant="default" className="w-full">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
