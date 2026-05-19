interface RegistryCertificationCardProps {
  officialName:   string;
  signatureKey:   string;
}

export default function RegistryCertificationCard({
  officialName,
  signatureKey,
}: RegistryCertificationCardProps) {
  return (
    <>
      {/* Certification card */}
      <div className="bg-primary text-slate-900 rounded-xl p-8 space-y-6 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-slate-900/70">verified_user</span>
          <h3 className="font-bold text-lg">Registry Certification</h3>
        </div>
        <p className="text-sm text-slate-800/80 italic">
          "I hereby certify that the entered pricing data conforms to the latest directive from the
          Ministry of Agriculture and Soil Resources."
        </p>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-900/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-slate-900">person</span>
            </div>
            <div>
              <div className="text-xs uppercase font-bold tracking-widest text-slate-800/70">
                Approving Official
              </div>
              <div className="font-bold">{officialName}</div>
            </div>
          </div>

          <div className="p-4 bg-slate-900/10 rounded-lg border border-slate-900/10">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-800/70 mb-2">
              Digital Signature Key
            </label>
            <code className="text-xs font-mono opacity-70">{signatureKey}</code>
          </div>
        </div>
      </div>
    </>
  );
}