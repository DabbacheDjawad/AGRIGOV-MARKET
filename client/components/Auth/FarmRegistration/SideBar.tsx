import Image from "next/image";
import { BENEFITS, HERO_IMAGE_URL } from "@/types/FarmRegistration";

export default function RegistrationSidebar() {
  return (
    <div className="lg:col-span-4 hidden lg:block space-y-6 pt-8">
      {/* Benefits card */}
      <div className="bg-primary/10 dark:bg-primary/5 p-6 rounded-xl border border-primary/20">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
          Why Join Agri-Connect?
        </h3>
        <ul className="space-y-4 mt-4">
          {BENEFITS.map((item) => (
            <li key={item.title} className="flex items-start gap-3">
              <span className="material-icons text-primary-dark dark:text-primary text-xl mt-0.5">
                {item.icon}
              </span>
              <div>
                <strong className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {item.title}
                </strong>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Hero image with testimonial overlay */}
      <div className="relative rounded-xl overflow-hidden aspect-4/3">
        <Image
          src={HERO_IMAGE_URL}
          alt="Farmer inspecting crops in a field at sunset"
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 0px, 33vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent flex items-end p-6">
          <p className="text-white text-sm font-medium">
            &ldquo;Agri-Connect helped us reduce post-harvest losses by 40%.&rdquo;
            <br />
            <span className="opacity-75 text-xs block mt-1">- Sarah M., Grain Farmer</span>
          </p>
        </div>
      </div>
    </div>
  );
}