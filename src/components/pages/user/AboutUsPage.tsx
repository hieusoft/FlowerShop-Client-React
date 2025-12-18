"use client"

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      {/* HERO */}
      <section className="py-20 text-center bg-[#FAFAF7]">
        <h1 className="text-4xl md:text-5xl font-bold text-neutral-900">
          Java Florist flower shop
        </h1>
        <p className="mt-5 max-w-2xl mx-auto text-neutral-600 text-base md:text-lg leading-relaxed">
          Convey your emotions and wishes through exquisitely designed bouquets of flowers for every special occasion in life.
        </p>
      </section>

      {/* CONTENT */}
      <section className="container max-w-5xl mx-auto py-20 px-4">
        {/* MAIN CARD */}
        <div className="rounded-3xl border border-[#DADFC8] bg-[#FEFEF5] shadow-lg p-10 md:p-14 space-y-12">
          
          {/* ABOUT US */}
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900">
              About Us
            </h2>
            <div className="h-px bg-neutral-300 my-5" />
            <p className="text-neutral-600 leading-relaxed text-base md:text-lg">
              Java Florist is a professional flower delivery service that helps
              people express love, gratitude, and celebration through flowers.
              We offer carefully crafted bouquets for occasions such as
              birthdays, weddings, anniversaries, new baby celebrations, and
              special festivals like Mother’s Day and Father’s Day.
            </p>
          </div>

          {/* MISSION */}
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900">
              Our Mission
            </h2>
            <div className="h-px bg-neutral-300 my-5" />
            <p className="text-neutral-600 leading-relaxed text-base md:text-lg">
              Our mission is to provide high-quality floral arrangements at
              affordable prices while delivering excellent customer experience.
              We aim to ensure fast delivery, professional service, and complete
              customer satisfaction for every order.
            </p>
          </div>

          {/* VISION */}
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900">
              Our Vision
            </h2>
            <div className="h-px bg-neutral-300 my-5" />
            <p className="text-neutral-600 leading-relaxed text-base md:text-lg">
              Java Florist strives to become a leading flower delivery service in
              Mumbai and surrounding areas, while expanding our reach nationwide
              through a trusted network of professional florists.
            </p>
          </div>

          {/* SERVICES */}
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900">
              Our Services
            </h2>
            <div className="h-px bg-neutral-300 my-5" />

            <ul className="grid grid-cols-2 md:grid-cols-3 gap-3 text-neutral-700 text-base">
              <li>🎂 Birthday Bouquets</li>
              <li>💍 Wedding Flowers</li>
              <li>👶 New Baby Bouquets</li>
              <li>💖 Anniversary Flowers</li>
              <li>🌸 Mother’s Day</li>
              <li>🎁 Father’s Day</li>
              <li>🙏 Thank You Bouquets</li>
            </ul>

            <p className="mt-6 text-neutral-600 leading-relaxed text-base md:text-lg">
              All bouquets are delivered within 5 hours during working hours
              (9:00 AM – 9:00 PM). Orders placed outside working hours will be
              delivered on the next working day.
            </p>
          </div>

          {/* DELIVERY */}
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900">
              Delivery Coverage
            </h2>
            <div className="h-px bg-neutral-300 my-5" />
            <p className="text-neutral-600 leading-relaxed text-base md:text-lg">
              Java Florist provides reliable flower delivery services across
              Mumbai and nearby regions. We also support nationwide delivery
              through our trusted florist partners to ensure timely and safe
              delivery.
            </p>
          </div>

        </div>
      </section>
    </div>
  )
}
