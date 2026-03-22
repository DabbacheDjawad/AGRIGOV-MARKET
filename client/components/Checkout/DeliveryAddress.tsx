import Image from "next/image";

interface Address {
  name: string;
  line1: string;
  line2: string;
  phone: string;
  mapImageUrl: string;
}

interface Props {
  address: Address;
  onChangeClick: () => void;
}

export default function DeliveryAddress({ address, onChangeClick }: Props) {
  return (
    <div className="bg-neutral-surface dark:bg-neutral-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-primary/10 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 dark:border-primary/10 flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
        <h2 className="text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-white">
          <span className="material-icons text-primary text-xl">location_on</span>
          Delivery Address
        </h2>
        <button
          type="button"
          onClick={onChangeClick}
          className="text-sm font-semibold text-primary-dark dark:text-primary hover:underline"
        >
          Change
        </button>
      </div>

      {/* Body */}
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="grow">
            <h3 className="font-bold text-gray-900 dark:text-white">{address.name}</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-1">{address.line1}</p>
            <p className="text-gray-600 dark:text-gray-300">{address.line2}</p>
            <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm">{address.phone}</p>
          </div>
          <div className="hidden sm:block relative w-32 h-24 rounded-lg overflow-hidden border border-gray-200 dark:border-primary/20 shrink-0">
            <Image
              src={address.mapImageUrl}
              alt="Map showing delivery location"
              fill
              className="object-cover"
              sizes="128px"
            />
          </div>
        </div>
      </div>
    </div>
  );
}