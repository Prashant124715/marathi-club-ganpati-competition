export function InfoSection() {
  return (
    <section className="py-14 sm:py-24 bg-zinc-50 dark:bg-zinc-900/50 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-burgundy/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-64 h-64 bg-saffron/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-burgundy dark:text-foreground mb-4 sm:mb-6">
              About the Competition
            </h2>
            <p className="text-foreground/80 text-sm sm:text-base md:text-lg mb-6 leading-relaxed">
              Ganpati Agman is an annual competition organized by the Marathi Club to celebrate the auspicious festival of Ganesh Chaturthi. It brings together students and faculty to showcase their artistic talents and cultural devotion.
            </p>
            <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 text-sm sm:text-base">
              {[
                'Open to all college students and faculty',
                'Multiple categories to participate in',
                'Exciting prizes for winners',
                'Judged by esteemed cultural committee members'
              ].map((item, i) => (
                <li key={i} className="flex items-center text-foreground/80">
                  <span className="w-2 h-2 bg-saffron rounded-full mr-3 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl border border-black/5 dark:border-white/5">
            <h3 className="text-xl sm:text-2xl font-bold mb-6 text-center">Important Dates</h3>
            <div className="space-y-5 sm:space-y-6">
              {[
                { event: 'Registration Opens', date: 'Sep 10, 2026' },
                { event: 'Submission Deadline', date: 'Sep 15, 2026' },
                { event: 'Voting Period', date: 'Sep 16 - Sep 18, 2026' },
                { event: 'Results Announcement', date: 'Sep 20, 2026' }
              ].map((timeline, idx) => (
                <div key={idx} className="flex justify-between items-center border-b border-foreground/10 pb-3.5 sm:pb-4 last:border-0 last:pb-0 text-sm sm:text-base gap-2">
                  <span className="font-medium text-foreground/90">{timeline.event}</span>
                  <span className="text-saffron font-semibold text-right whitespace-nowrap">{timeline.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
