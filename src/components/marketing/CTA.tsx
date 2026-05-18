export function CTA() {
  return (
    <section className="relative mx-auto max-w-4xl px-6 py-24 text-center md:py-32">
      <h2 className="mb-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
        Ready to upgrade your logistics?
      </h2>
      <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-400">
        Join the future of warehousing today. Request a personalized demo for your facility.
      </p>

      <form className="mx-auto flex max-w-md items-center justify-center sm:flex-row flex-col gap-3 sm:gap-0">
        <input
          type="email"
          placeholder="Enter your work email"
          required
          className="h-12 w-full rounded-full sm:rounded-r-none border border-white/10 bg-white/5 px-6 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 sm:border-r-0"
        />
        <button
          type="submit"
          className="h-12 w-full sm:w-auto shrink-0 rounded-full sm:rounded-l-none bg-cyan-500 px-8 font-semibold text-slate-950 transition-colors hover:bg-cyan-400"
        >
          Request Access
        </button>
      </form>
    </section>
  );
}
