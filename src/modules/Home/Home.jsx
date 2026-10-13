
function Home() {
    const lessons = [
  {
    title: "Erste Klasse 🎨",
    description: "Lerne die Farben auf Deutsch!",
    image:
      "https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&w=800&q=80",
    button: "Erste Klasse! 🚀",
    link: "/erste-klasse",
  },
  {
    title: "Zweite Klasse 🐻",
    description: "Entdecke tolle Tiere auf Deutsch!",
    image:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80",
    button: "Tiere entdecken! 🐾",
    link: "/tiere",
  },
];
  return (
    <section className="min-h-screen  px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <div className="mb-10 text-center">
          <span className="inline-block -rotate-2 rounded-full bg-orange-400 px-5 py-2 text-sm font-bold text-white shadow-md">
            🇩🇪 Deutsch macht Spaß!
          </span>

          <h2 className="mt-4 text-3xl font-extrabold  sm:text-4xl lg:text-5xl">
            Lass uns Deutsch lernen! 🌈
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-base font-medium text-gray-600 sm:text-lg">
            Spiele, entdecke und lerne neue Wörter auf Deutsch! 🚀
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {lessons.map((lesson) => (
            <article
              key={lesson.title}
              className="group overflow-hidden rounded-4xl border-4 border-white bg-white shadow-xl transition duration-300 hover:-translate-y-2 hover:rotate-[0.5deg] hover:shadow-2xl"
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden sm:h-64">
                <img
                  src={lesson.image}
                  alt={lesson.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />

                {/* Decorative bubbles */}
                <span className="absolute left-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-300 text-2xl shadow-md">
                  ⭐
                </span>

                <span className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-pink-400 text-xl shadow-md">
                  ✨
                </span>
              </div>

              {/* Content */}
              <div className="p-6 text-center sm:p-8">
                <h3 className="text-2xl font-extrabold  sm:text-3xl">
                  {lesson.title}
                </h3>

                <p className="mt-3 text-base font-medium leading-relaxed text-gray-600 sm:text-lg">
                  {lesson.description}
                </p>

                {/* Button */}
                <a
                  href={lesson.link}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-linear-to-r from-orange-400 to-pink-500 px-6 py-3.5 text-base font-extrabold text-white shadow-lg transition duration-300 hover:scale-105 hover:from-orange-500 hover:to-pink-600 focus:outline-none focus:ring-4 focus:ring-pink-200 sm:w-auto sm:min-w-[200px]"
                >
                  {lesson.button}
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Home
