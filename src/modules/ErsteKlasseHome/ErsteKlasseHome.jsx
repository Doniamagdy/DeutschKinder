import { Link } from "react-router-dom";

import image1 from "../../assets/Cartoon Kitchen Game (1).png";
import image2 from "../../assets/einkaufen.jpg";
import image3 from "../../assets/childrens-learning-entertaining-cartoon-character-vector-illustration-education-media_1253202-323006.avif";


function ErsteKlasseHome() {
  const lessons = [
    {
      title: "Was magst du? ",
      image: image1,

      button: "Was magst du? ",
      link: "/essen",
    },
    {
      title: "Einkaufen Spiel",
      image: image2,
      button: "Einkaufen Spiel ",
      link: "/einkaufen",
    },
     {
      title: "Gedächtnisspiel",
      image: image3,
      button: "Gedächtnisspiel ",
      link: "/gedaechtnisspiel",
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

                {/* Button */}
                <Link
                  to={lesson.link}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-red-400 px-6 py-3.5 text-base font-extrabold text-white shadow-lg transition duration-300 hover:scale-105 hover:from-orange-500 hover:to-pink-600 focus:outline-none focus:ring-4 focus:ring-pink-200 sm:w-auto sm:min-w-[200px]"
                >
                  {lesson.button}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ErsteKlasseHome;
