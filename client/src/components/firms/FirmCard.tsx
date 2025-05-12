import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import type { PropFirm } from '@/lib/types';

interface FirmCardProps {
  firm: PropFirm;
}

export default function FirmCard({ firm }: FirmCardProps) {
  const {
    id,
    name,
    logo,
    backgroundImage,
    websiteUrl,
    accountTypes = [],
  } = firm;

  console.log(firm)

  const challenges = accountTypes.filter(
    (ac) => ac.accountType === 'Challenge' && ac.accountSize === 50000
  );

  const cheapest = challenges.reduce<null | typeof challenges[0]>((min, ac) => {
    const price = ac.discountedPrice ?? ac.price ?? Infinity;
    if (!min) return ac;
    const minPrice = min.discountedPrice ?? min.price ?? Infinity;
    return price < minPrice ? ac : min;
  }, null);

  if (!cheapest) return null;

  const originalPrice = cheapest.price ?? 0;
  const discountedPrice = cheapest.discountedPrice ?? originalPrice;
  const discountPct = cheapest.currentDiscountRate != null
    ? Math.round(cheapest.currentDiscountRate)
    : null;
  const activationFee = cheapest.activationFee ?? 0;
  const discountEnd = cheapest.discountEndAt
    ? new Date(cheapest.discountEndAt).toLocaleDateString()
    : '—';
  const couponCode = cheapest.referralCode ?? '';

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-4">
      {backgroundImage && (
        <div
          className="h-24 bg-center bg-cover rounded-lg mb-4"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}

      <div className="flex items-center mb-4">
        <img src={logo} alt={name} className="h-10 w-10 rounded-full mr-3" />
        <h2 className="text-lg font-semibold">{name}</h2>
      </div>

      <div className="mb-4">
        <p className="text-sm text-neutral-500 mb-1">50k Challenge Price</p>
        <div className="flex items-center">
          {originalPrice !== discountedPrice && (
            <span className="text-neutral-400 line-through mr-2 text-sm">
              ${originalPrice}
            </span>
          )}
          <span className="text-2xl font-bold">${discountedPrice}</span>
          {/* {discountPct !== null && (
            <span className="ml-2 bg-blue-100 text-blue-600 text-xs font-bold px-2 py-0.5 rounded-full">
              {discountPct}%
            </span>
          )} */}
        </div>
        {couponCode && (
          <div className="mt-2 text-xs">
            Coupon: <span className="font-mono bg-neutral-100 px-2 py-0.5 rounded">{couponCode}</span>
          </div>
        )}
      </div>

      <div className="text-xs text-neutral-500 space-y-1 mb-4">
        <div>Activation Fee: ${activationFee}</div>
        <div>Discount Ends: {discountEnd}</div>
      </div>

      <div className="flex flex-col space-y-2">
        <a href={websiteUrl} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" className="w-full text-sm">Visit Site</Button>
        </a>
        <Link href={`/firms/${id}`}>
          <Button className="w-full text-sm">View Details</Button>
        </Link>
      </div>
    </div>
  );
}
