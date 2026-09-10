import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative w-full py-12 sm:py-16 lg:py-20 overflow-hidden bg-background">
      <div className="absolute top-12 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-saffron/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute -bottom-10 left-10 w-72 sm:w-96 h-72 sm:h-96 bg-burgundy/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 text-center lg:text-left flex flex-col items-center lg:items-start">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-saffron/10 border border-saffron/30 text-saffron font-medium text-xs sm:text-sm mb-4 sm:mb-5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-saffron" />
              <span>Marathi Club Presents • गणेशोत्सव २०२६</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-burgundy dark:text-amber-50 tracking-tight leading-[1.1] mb-3 sm:mb-5">
              Ganpati Agman
              <span className="block text-2xl sm:text-3xl md:text-4xl mt-1 sm:mt-2 text-saffron font-serif font-normal">
                मंगलमूर्ती मोरया!
              </span>
            </h1>

            <p className="max-w-2xl text-base sm:text-lg md:text-xl text-foreground/80 mb-6 sm:mb-8 leading-relaxed font-sans">
              Join our college&apos;s grandest Ganesh Chaturthi celebration. Showcase your creativity, devotion, and talent across multiple exciting competitions — from eco-friendly home decor and reel making to literature and faculty showcases.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start items-center w-full max-w-md sm:max-w-none">
              <Link
                href="/register"
                className="bg-gradient-to-r from-saffron to-saffron-dark hover:from-saffron-light hover:to-saffron text-white px-7 sm:px-8 py-3.5 sm:py-4 rounded-full font-medium transition-all shadow-lg hover:shadow-saffron/40 hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 group w-full sm:w-auto justify-center text-sm sm:text-base"
              >
                <span>Participate Now</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1.5 transition-transform" />
              </Link>
              <Link
                href="/categories"
                className="px-7 sm:px-8 py-3.5 sm:py-4 rounded-full font-medium text-burgundy border-2 border-burgundy/80 hover:bg-burgundy hover:text-white dark:border-saffron/40 dark:text-amber-100 dark:hover:bg-saffron dark:hover:text-white dark:hover:border-saffron transition-all w-full sm:w-auto text-center text-sm sm:text-base backdrop-blur-sm"
              >
                Explore Submissions
              </Link>
            </div>

            <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-burgundy/10 dark:border-white/10 w-full grid grid-cols-3 gap-2 sm:gap-6 text-center lg:text-left">
              <div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold font-serif text-burgundy dark:text-amber-200">4+</div>
                <div className="text-xs sm:text-sm text-foreground/70 mt-0.5">Categories</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold font-serif text-saffron">Grand</div>
                <div className="text-xs sm:text-sm text-foreground/70 mt-0.5">Prizes & Awards</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold font-serif text-burgundy dark:text-amber-200">Open To</div>
                <div className="text-xs sm:text-sm text-foreground/70 mt-0.5">Students & Staff</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center relative w-full">
            <div className="absolute inset-4 sm:inset-6 bg-gradient-to-tr from-saffron/30 via-amber-400/25 to-burgundy/30 rounded-3xl blur-2xl pointer-events-none" />

            <div className="relative w-full max-w-[320px] sm:max-w-[380px] lg:max-w-[420px] aspect-[2/3] rounded-3xl overflow-hidden border-2 border-amber-400/50 dark:border-amber-400/40 shadow-2xl shadow-saffron/25 group animate-[float_5s_ease-in-out_infinite]">
              <Image
                src="/ganpati-hero.jpg"
                alt="Lord Ganesha - Ganpati Agman Marathi Club Celebration"
                fill
                priority
                sizes="(max-width: 640px) 320px, (max-width: 1024px) 380px, 420px"
                quality={75}
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent pointer-events-none" />

              <div className="absolute bottom-3.5 left-3.5 right-3.5 sm:bottom-4 sm:left-4 sm:right-4 p-3 sm:p-4 rounded-2xl bg-black/45 backdrop-blur-md border border-white/20 text-white flex items-center justify-between shadow-lg">
                <div>
                  <div className="text-[11px] sm:text-xs uppercase tracking-wider text-amber-300 font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>उत्सव आनंदाचा आणि भक्तीचा</span>
                  </div>
                  <div className="text-sm sm:text-base font-serif font-bold text-white mt-0.5">
                    बाप्पा मोरया • आगमन सोहळा
                  </div>
                </div>
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-saffron to-amber-600 flex items-center justify-center flex-shrink-0 text-white font-serif text-base shadow-md border border-amber-300/40">
                  ॐ
                </div>
              </div>

              <div className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 px-3 py-1 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-[11px] sm:text-xs text-amber-200 font-medium">
                Festive 2026
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
