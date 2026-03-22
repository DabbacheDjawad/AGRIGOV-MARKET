interface Props {
  onClick: () => void;
}

export default function AddNewCard({ onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group bg-slate-50 dark:bg-white/5 border-2 border-dashed border-slate-300 dark:border-white/10 rounded-xl overflow-hidden hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 flex flex-col items-center justify-center min-h-85 cursor-pointer w-full"
    >
      <div className="h-16 w-16 bg-white dark:bg-white/10 rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
        <span className="material-icons text-3xl text-primary-dark dark:text-primary">add</span>
      </div>
      <h3 className="font-bold text-lg text-earth-800 dark:text-white">Add New Product</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 text-center px-6">
        List a new harvest to your inventory
      </p>
    </button>
  );
}