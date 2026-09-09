import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-burgundy text-white/90 py-12 border-t border-burgundy-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-serif text-2xl font-bold text-saffron mb-4">Marathi Club</h3>
            <p className="text-white/70 max-w-xs">
              Celebrating culture, tradition, and creativity together during the auspicious festival of Ganesh Chaturthi.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-saffron transition-colors">Home</Link></li>
              <li><Link href="/categories" className="hover:text-saffron transition-colors">Categories</Link></li>
              <li><Link href="/submit" className="hover:text-saffron transition-colors">Submit</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4">Contact</h4>
            <p className="text-white/70 text-sm leading-relaxed">
              Email: <a href="mailto:contact@marathiclub.example.com" className="hover:text-saffron transition-colors break-all sm:break-normal">contact@marathiclub.example.com</a><br/>
              Follow us on our social media for updates.
            </p>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-white/50">
          <p>&copy; {new Date().getFullYear()} Marathi Club. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
