"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import RegistrationSidebar from "@/components/Auth/FarmRegistration/SideBar";
import FormStepper from "@/components/Auth/FarmRegistration/FormStepper";
import RoleStep from "@/components/Auth/FarmRegistration/RoleStep";
import FarmDetailsForm from "@/components/Auth/FarmRegistration/FarmForm";
import VerificationStep from "@/components/Auth/FarmRegistration/VerificationStep";
import { COAT_OF_ARMS_URL } from "@/types/FarmRegistration";
import type { RegistrationFormState, RegistrationStep, UserRole } from "@/types/FarmRegistration";

const INITIAL_FORM: RegistrationFormState = {
  role: "Farmer",
  region: "",
  district: "",
  address: "",
  farmSize: "",
  farmSizeUnit: "Hectares",
  cropType: "Grains (Maize, Wheat, Rice)",
  documentFile: null,
};

export default function RegistrationPage() {
  const [step, setStep] = useState<RegistrationStep>(2); // HTML shows step 2
  const [form, setForm] = useState<RegistrationFormState>(INITIAL_FORM);

  const setField = <K extends keyof RegistrationFormState>(
    key: K,
    value: RegistrationFormState[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const canGoBack = step > 1;
  const canContinue = step < 3;

  const handleBack = () => {
    if (canGoBack) setStep((s) => (s - 1) as RegistrationStep);
  };

  const handleContinue = () => {
    if (canContinue) setStep((s) => (s + 1) as RegistrationStep);
  };

  const continueLabel = step === 3 ? "Submit Application" : "Continue";
  const backLabel = "Back";

  return (
    <div className="bg-background-light  font-display text-gray-800  min-h-screen flex flex-col transition-colors duration-200">

      <main className="grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-5xl grid lg:grid-cols-12 gap-8 items-start">
          <RegistrationSidebar />

          {/* Form card */}
          <div className="lg:col-span-8 w-full">
            <div className="bg-white  rounded-2xl shadow-xl border border-gray-100  overflow-hidden">
              {/* Stepper */}
              <FormStepper currentStep={step} />

              <form
                className="p-6 sm:p-8 space-y-8"
                onSubmit={(e) => e.preventDefault()}
                noValidate
              >
                {/* Step content */}
                <div key={step} className="space-y-8">
                  {step === 1 && (
                    <RoleStep
                      selected={form.role}
                      onSelect={(role: UserRole) => setField("role", role)}
                    />
                  )}
                  {step === 2 && (
                    <FarmDetailsForm form={form} onChange={setField} />
                  )}
                  {step === 3 && <VerificationStep />}
                </div>

                {/* Navigation buttons */}
                <div className="pt-6 border-t border-gray-100  flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={!canGoBack}
                    className="group inline-flex items-center px-6 py-3 border border-gray-300  text-base font-medium rounded-lg text-gray-700  bg-white  hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <span className="material-icons text-sm mr-2 group-hover:-translate-x-1 transition-transform">
                      arrow_back
                    </span>
                    {backLabel}
                  </button>

                  <button
                    type="button"
                    onClick={handleContinue}
                    className="group inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-black bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all"
                  >
                    {continueLabel}
                    <span className="material-icons text-sm ml-2 group-hover:translate-x-1 transition-transform">
                      {step === 3 ? "check" : "arrow_forward"}
                    </span>
                  </button>
                </div>
              </form>
            </div>

            {/* Footer legal / seal */}
            <div className="mt-8 text-center space-y-2">
              <p className="text-sm text-gray-500 ">
                Protected by reCAPTCHA and subject to the Ministry&apos;s{" "}
                <Link href="#" className="text-primary-dark  hover:underline">
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-primary-dark  hover:underline">
                  Terms of Service
                </Link>
                .
              </p>
              <div className="flex items-center justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all">
                <div className="relative h-8 w-8">
                  <Image
                    src={COAT_OF_ARMS_URL}
                    alt="National Coat of Arms"
                    fill
                    className="object-contain"
                    sizes="32px"
                  />
                </div>
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-widest border-l border-gray-300 pl-4">
                  Official Ministry Platform
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}