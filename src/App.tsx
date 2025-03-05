import React, { useEffect, useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store, fetchNews } from "./store";
import { RootState, AppDispatch } from "./store";
import "./App.scss";

const categories = [
  "SCIENCE",
  "GENERAL",
  "ENTERTAINMENT",
  "TECHNOLOGY",
  "BUSINESS",
  "HEALTH",
  "SPORTS",
];

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { news, status, error } = useSelector((state: RootState) => state.news);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const now = new Date();
    dispatch(fetchNews({ year: now.getFullYear(), month: now.getMonth() + 1 }));

    const interval = setInterval(() => {
      dispatch(
        fetchNews({ year: now.getFullYear(), month: now.getMonth() + 1 })
      );
    }, 30000);

    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <div className="news-container">
      {/* Меню */}
      <div className={`menu ${menuOpen ? "open" : ""}`}>
        <button className="close-button" onClick={() => setMenuOpen(false)}>
          ✕
        </button>
        <ul>
          {categories.map((category) => (
            <li key={category}>{category}</li>
          ))}
        </ul>
      </div>

      {/* Шапка */}
      <header>
        <button className="menu-button" onClick={() => setMenuOpen(true)}>
          ☰
        </button>
        <h1>BESIDER</h1>
      </header>

      <main>
        {status === "loading" && <div className="loading">Загрузка...</div>}
        {error && <div className="error">{error}</div>}
        {Object.entries(news).map(([date, articles]) => (
          <section key={date}>
            <h2>News for {date}</h2>
            {articles.map((article) => (
              <article key={article.web_url} className="news-item">
                <a
                  href={article.web_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {article.multimedia.length > 0 && (
                    <img src={article.multimedia[0].url} alt="News" />
                  )}
                  <div className="news-content">
                    <span className="source">{article.source}</span>
                    <p>{article.abstract}</p>
                    <span className="date">
                      {new Date(article.pub_date).toLocaleString()}
                    </span>
                  </div>
                </a>
              </article>
            ))}
          </section>
        ))}
      </main>

      <div className="loading-icon"></div>
    </div>
  );
};

const WrappedApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default WrappedApp;
