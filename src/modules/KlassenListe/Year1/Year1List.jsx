import { useEffect, useState } from "react";
import "../../../App.css";

const INITIAL_STUDENTS = [
  { id: 1, name: "Adam Ahmed  ", stars: 0 },
  { id: 2, name: "Ali Alaa ", stars: 0 },
  { id: 3, name: "Ali Amr  ", stars: 0 },
  { id: 4, name: "Belal Mohamed ", stars: 0 },
  { id: 5, name: "Celine Noureldin ", stars: 0 },
  { id: 6, name: "Hana Khaled  ", stars: 0 },
  { id: 7, name: "Hassan Mahmoud ", stars: 0 },
  { id: 8, name: "Marwan Mohamed   ", stars: 0 },
  { id: 9, name: "Mohab Mostafa", stars: 0 },
  { id: 10, name: "Mohamed Ahmed", stars: 0 },
  { id: 11, name: "Saleh Ahmed  ", stars: 0 },
  { id: 12, name: "Selim Ahmed  ", stars: 0 },
  { id: 13, name: "Selim Amr   ", stars: 0 },
  { id: 14, name: "Selim Mahmoud", stars: 0 },
];

const STORAGE_KEY = "super-stars-class-v1";

function getInitialStudents() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved !== null) {
      const parsed = JSON.parse(saved);

      if (
        Array.isArray(parsed) &&
        parsed.length === INITIAL_STUDENTS.length &&
        parsed.every(
          (student, index) =>
            student.id === INITIAL_STUDENTS[index].id &&
            student.name === INITIAL_STUDENTS[index].name &&
            Number.isSafeInteger(student.stars) &&
            student.stars >= 0,
        )
      ) {
        return parsed;
      }
    }
  } catch {
    // If saved data is invalid, use the default class.
  }

  return INITIAL_STUDENTS.map((student) => ({ ...student }));
}

function Year1List() {
  const [students, setStudents] = useState(getInitialStudents);
  const [showResetMessage, setShowResetMessage] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    } catch {
      console.warn("Unable to save class data in localStorage.");
    }
  }, [students]);

  const addStar = (id) => {
    setStudents((currentStudents) =>
      currentStudents.map((student) =>
        student.id === id ? { ...student, stars: student.stars + 1 } : student,
      ),
    );

    setShowResetMessage(false);
  };

  const resetStars = () => {
    const confirmed = window.confirm(
      "Are you sure you want to reset all stars to zero?",
    );

    if (!confirmed) return;

    setStudents((currentStudents) =>
      currentStudents.map((student) => ({
        ...student,
        stars: 0,
      })),
    );

    setShowResetMessage(true);
  };

  const sortedStudents = students
    .map((student, originalIndex) => ({
      ...student,
      originalIndex,
    }))
    .sort((a, b) => b.stars - a.stars || a.originalIndex - b.originalIndex);

  const totalStars = students.reduce(
    (total, student) => total + student.stars,
    0,
  );

  const topScore = Math.max(0, ...students.map((student) => student.stars));

  return (
    <main className="app-shell">
      <div className="background-shape shape-one" />
      <div className="background-shape shape-two" />

      <header className="hero">
        <div className="hero-mascot" aria-hidden="true">
          🌈
        </div>

        <h1>
          Unsere kleinen<span> Sterne!</span>
        </h1>

        <div className="stats-grid">
          <div className="stat-card students-stat">
            <span className="stat-emoji">🧒</span>
            <strong>{students.length}</strong>
            <span className="stat-label">Die Schüler</span>
          </div>

          <div className="stat-card stars-stat">
            <span className="stat-emoji">⭐</span>
            <strong>{totalStars}</strong>
            <span className="stat-label">Total Sterne</span>
          </div>

          <div className="stat-card trophy-stat">
            <span className="stat-emoji">🏆</span>
            <strong>{topScore}</strong>
            <span className="stat-label">Top Score</span>
          </div>
        </div>
      </header>

      <section className="leaderboard">
        <div className="leaderboard-header">
          <div>
            <span className="section-kicker">LET'S SHINE ✨</span>
            <h2>Class Leaderboard</h2>
            <p>Every little effort deserves a star!</p>
          </div>

          <button type="button" className="reset-button" onClick={resetStars}>
            <span aria-hidden="true">↻</span> Reset Stars
          </button>
        </div>

        {showResetMessage && (
          <div className="reset-message" role="status">
            🌱 Fresh start! Everyone can shine again!
          </div>
        )}

        <div className="list-heading">
          <span>RANK & STUDENT</span>
          <span>STARS</span>
        </div>

        <div className="student-list">
          {sortedStudents.map((student, index) => {
            const isFirst = index === 0 && student.stars > 0;

            return (
              <article
                className={`student-card ${isFirst ? "top-student" : ""}`}
                key={`${student.id}-${student.stars}`}
              >
                <div
                  className={`rank-number ${
                    index < 3 && student.stars > 0 ? "medal-rank" : ""
                  }`}
                >
                  {student.stars > 0 && index === 0
                    ? "🥇"
                    : student.stars > 0 && index === 1
                      ? "🥈"
                      : student.stars > 0 && index === 2
                        ? "🥉"
                        : String(index + 1).padStart(2, "0")}
                </div>

                <div className={`student-avatar avatar-${student.id % 6}`}>
                  {student.name.charAt(0).toUpperCase()}
                </div>

                <div className="student-details">
                  <h3>{student.name}</h3>

                  <div
                    className="star-display"
                    aria-label={`${student.stars} stars`}
                  >
                    {student.stars === 0 ? (
                      <span className="no-stars">Ready to shine!</span>
                    ) : (
                      <>
                        {Array.from(
                          { length: Math.min(student.stars, 5) },
                          (_, starIndex) => (
                            <span
                              className="mini-star"
                              key={starIndex}
                              aria-hidden="true"
                            >
                              ⭐
                            </span>
                          ),
                        )}

                        {student.stars > 5 && (
                          <span className="extra-stars">
                            +{student.stars - 5}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="score-pill">
                  <strong key={student.stars}>{student.stars}</strong>
                  <span>{student.stars === 1 ? "star" : "stars"}</span>
                </div>

                <button
                  type="button"
                  className="add-star-button"
                  onClick={() => addStar(student.id)}
                  aria-label={`Give ${student.name} one star`}
                  title={`Give ${student.name} a star`}
                >
                  <span className="button-star" aria-hidden="true">
                    ⭐
                  </span>
                  <span className="button-plus">+1</span>
                </button>
              </article>
            );
          })}
        </div>

        <div className="encouragement">
          <span className="encouragement-emoji">🎈</span>
          <div>
            <strong>You're all amazing!</strong>
            <p>Keep trying, keep learning, keep shining!</p>
          </div>
          <span className="encouragement-heart">💖</span>
        </div>

        <footer className="app-footer">
          <span>🌟 Made for little stars</span>
          <span className="saved-indicator">
            <span className="saved-dot" />
            Auto-save enabled
          </span>
        </footer>
      </section>
    </main>
  );
}

export default Year1List;
