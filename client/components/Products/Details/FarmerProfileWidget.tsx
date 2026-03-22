import Image from "next/image";
import type { FarmerProfile } from "@/types/ProductDetails";

interface Props {
  farmer: FarmerProfile;
}

export default function FarmerProfileWidget({ farmer }: Props) {
  return (
    <div className="space-y-6">
      {/* Farmer card */}
      <div className="bg-neutral-surface dark:bg-neutral-surface-dark rounded-xl shadow-sm border border-neutral-border dark:border-neutral-border-dark p-5">
        <div className="flex items-start gap-4">
          {/* Avatar with verified badge */}
          <div className="relative shrink-0">
            <div className="relative w-14 h-14">
              <Image
                src={farmer.avatarUrl}
                alt={`${farmer.name} portrait`}
                fill
                className="rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm"
                sizes="56px"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-green-100 dark:bg-green-900 p-0.5 rounded-full border border-white dark:border-gray-800">
              <span className="material-icons text-green-600 text-xs">check_circle</span>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <h4 className="text-base font-bold text-gray-900 dark:text-white">{farmer.name}</h4>
            <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
              <span className="material-icons text-[10px]">location_on</span>
              {farmer.location}
            </p>
            <div className="flex items-center gap-1">
              <span className="text-yellow-400 material-icons text-sm">star</span>
              <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                {farmer.rating}
              </span>
              <span className="text-xs text-gray-400">({farmer.salesCount} sales)</span>
            </div>
          </div>
        </div>

        <hr className="my-4 border-neutral-border dark:border-neutral-border-dark" />

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { label: "Response", value: farmer.responseTime },
            { label: "On Time", value: farmer.onTimeDelivery },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-gray-50 dark:bg-gray-800/50 p-2 rounded text-center"
            >
              <span className="block text-xs text-gray-400 uppercase">{stat.label}</span>
              <span className="text-sm font-semibold text-gray-800 dark:text-white">
                {stat.value}
              </span>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="w-full py-2 text-sm font-medium text-primary hover:text-primary-dark border border-primary hover:bg-primary-light/10 rounded-lg transition-colors"
        >
          Message Farmer
        </button>
      </div>

      {/* Certifications */}
      <div className="bg-neutral-surface dark:bg-neutral-surface-dark rounded-xl shadow-sm border border-neutral-border dark:border-neutral-border-dark p-5">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Verified Certifications
        </h4>
        <div className="flex flex-wrap gap-2">
          {farmer.certifications.map((cert) => (
            <span
              key={cert.id}
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cert.badgeClass}`}
            >
              {cert.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}