import { Logos } from "./Logos"

export default function Main() {
  return (
    <section
      id="logo cloud"
      aria-label="Company logos"
      className="logo-cloud mt-24 flex animate-slide-up-fade flex-col items-center justify-center gap-y-6 text-center sm:mt-32"
    >
      <p className="logo-title text-xl text-gray-800 sm:text-2xl md:text-3xl lg:text-4xl dark:text-gray-200">
        شركاء النجاح
      </p>
      <div className="grid grid-cols-1 items-center gap-10 gap-y-3 text-gray-900 sm:grid-cols-3 md:gap-x-20 dark:text-gray-200">
        <Logos.sdaia />
        <Logos.me />
        <Logos.ibm />
      </div>
    </section>
  )
}
