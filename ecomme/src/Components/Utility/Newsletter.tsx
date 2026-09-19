/** @format */

const Newsletter = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // الكود الذي تريد تنفيذه بعد الضغط على Subscribe
  };
  return (
    <section className="mx-auto my-12 w-full max-w-7xl px3">
      <div className="relative flex min-h-[220px] items-center overflow-hidden rounded-1xl bg-[#f5f5f5] px-8 py-8 md:px-12">
        {/* Content */}
        <div className="relative z-10 w-full max-w-[500px]">
          <h2 className="text-6xl font-bold text-[#08060d] md:text-3xl">
            Get the Latest Tech & Deals
          </h2>

          <p className="mt-2 text-sm leading-7 text-[#6b6375]">
            Join us and never miss out on new products and exclusive offers.
          </p>

          {/* Email Form */}
          <form
            onSubmit={handleSubmit}
            className="mt-6 flex w-full max-w-[400px] overflow-hidden rounded-lg bg-white shadow-sm">
            <input
              type="email"
              placeholder="Enter your email"
              className="min-w-0 flex-1 px-4 py-3 text-sm text-[#08060d] outline-none placeholder:text-[#999]"
            />
            <button
              type="submit"
              className="bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600">
              Subscribe
            </button>
          </form>
        </div>
        {/* Decorative Envelope */}
        <div className="absolute bottom-[100px] right-8 hidden text-[150px] opacity-8 md:block">
          ✉
        </div>
        {/* Decorative Circles */}
        <div className="absolute right-[-60px] top-[-60px] h-48 w-48 rounded-full bg-sky-500 opacity-10" />
        <div className="absolute bottom-[-80px] right-[100px] h-40 w-40 rounded-full bg-sky-500 opacity-10" />
      </div>
    </section>
  );
};

export default Newsletter;
