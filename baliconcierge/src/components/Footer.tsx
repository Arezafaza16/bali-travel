export default function Footer() {
  return (
    <footer className="bg-stone-50 w-full py-12 border-t border-stone-200">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col gap-4">
          <div className="text-xl font-h2 font-bold text-primary">
            BaliConcierge
          </div>
          <p className="font-body-md text-sm text-secondary">
            Curating elevated, unforgettable experiences across the Island of the Gods.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="font-label-caps text-label-caps text-primary uppercase tracking-widest">Legal</h4>
          <ul className="space-y-2">
            <li><a className="text-sm text-secondary hover:text-primary transition-colors opacity-80 hover:opacity-100" href="#">Privacy Policy</a></li>
            <li><a className="text-sm text-secondary hover:text-primary transition-colors opacity-80 hover:opacity-100" href="#">Terms of Service</a></li>
          </ul>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="font-label-caps text-label-caps text-primary uppercase tracking-widest">Support</h4>
          <ul className="space-y-2">
            <li><a className="text-sm text-secondary hover:text-primary transition-colors opacity-80 hover:opacity-100" href="#">Local Guide</a></li>
            <li><a className="text-sm text-secondary hover:text-primary transition-colors opacity-80 hover:opacity-100" href="#">Contact Support</a></li>
          </ul>
        </div>
      </div>
      <div className="px-4 sm:px-6 md:px-8 max-w-7xl mx-auto mt-12 pt-8 border-t border-stone-200 text-center">
        <p className="font-body-md text-sm text-secondary">© 2024 BaliConcierge Luxury Travel. All rights reserved.</p>
      </div>
    </footer>
  );
}
