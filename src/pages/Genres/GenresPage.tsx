import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import s from "./GenresPage.module.scss";

// Images for genres mapping
const genreImages: Record<string, string> = {
  drama: new URL("../../assets/images/genre/genre-drama.jpg", import.meta.url)
    .href,
  comedy: new URL("../../assets/images/genre/genre-comedy.jpg", import.meta.url)
    .href,
  detective: new URL(
    "../../assets/images/genre/genre-detective.jpg",
    import.meta.url,
  ).href,
  family: new URL("../../assets/images/genre/genre-family.jpg", import.meta.url)
    .href,
  history: new URL(
    "../../assets/images/genre/genre-history.jpg",
    import.meta.url,
  ).href,
  thriller: new URL(
    "../../assets/images/genre/genre-thriller.jpg",
    import.meta.url,
  ).href,
  fantasy: new URL(
    "../../assets/images/genre/genre-fantasy.jpg",
    import.meta.url,
  ).href,
  adventure: new URL(
    "../../assets/images/genre/genre-adventure.jpg",
    import.meta.url,
  ).href,
  horror: new URL("../../assets/images/genre/genre-horror.jpg", import.meta.url)
    .href,
  scifi: new URL("../../assets/images/genre/genre-scifi.jpg", import.meta.url)
    .href,
  mystery: new URL(
    "../../assets/images/genre/genre-mystery.jpg",
    import.meta.url,
  ).href,
  romance: new URL(
    "../../assets/images/genre/genre-romance.jpg",
    import.meta.url,
  ).href,
  music: new URL("../../assets/images/genre/genre-music.jpg", import.meta.url)
    .href,
  crime: new URL("../../assets/images/genre/genre-crime.jpg", import.meta.url)
    .href,
  "tv-movie": new URL(
    "../../assets/images/genre/genre-tv-movie.jpg",
    import.meta.url,
  ).href,
  documentary: new URL(
    "../../assets/images/genre/genre-documentary.jpg",
    import.meta.url,
  ).href,
  action: new URL("../../assets/images/genre/genre-action.jpg", import.meta.url)
    .href,
  western: new URL(
    "../../assets/images/genre/genre-western.jpg",
    import.meta.url,
  ).href,
  animation: new URL(
    "../../assets/images/genre/genre-animation.jpg",
    import.meta.url,
  ).href,
  war: new URL("../../assets/images/genre/genre-war.jpg", import.meta.url).href,
  "stand-up": new URL(
    "../../assets/images/genre/genre-stand-up.jpg",
    import.meta.url,
  ).href,
};

type Genre = {
  name: string;
  image: string;
  slug: string; // добавили “машинное” имя для тестов
};

const GenresPage = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const res = await fetch("https://cinemaguide.skillbox.cc/movie/genres");
        const data: string[] = await res.json();

        const genresWithImages: Genre[] = data.map((raw) => {
          const slug = raw.toLowerCase();

          return {
            slug,
            name: raw.charAt(0).toUpperCase() + raw.slice(1),
            image:
              genreImages[slug] ||
              new URL(
                "../../assets/images/genre/genre-fantasy.jpg",
                import.meta.url,
              ).href,
          };
        });

        if (!cancelled) setGenres(genresWithImages);
      } catch {
        if (!cancelled) setGenres([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleGenreClick = (genreSlug: string) => {
    navigate(`/movies?genre=${genreSlug}`);
  };

  return (
    <div className={s.container} data-testid="genres-page">
      <div className={s.genresWrapper}>
        <h1 className={s.title}>Genres</h1>

        {isLoading && (
          <div data-testid="genres-loading" className={s.cards}>
            Loading...
          </div>
        )}

        {!isLoading && (
          <div className={s.cards} data-testid="genres-list">
            {genres.map((genre) => (
              <div
                key={genre.slug}
                className={s.card}
                role="button"
                tabIndex={0}
                aria-label={`Open genre ${genre.name}`}
                data-testid="genre-item"
                data-genre={genre.slug}
                onClick={() => handleGenreClick(genre.slug)}
                onKeyDown={(e) => {
                  e.preventDefault();
                  if (e.key === "Enter" || e.key === " ") {
                    handleGenreClick(genre.slug);
                  }
                }}
              >
                <img
                  src={genre.image}
                  alt={genre.name}
                  className={s.cardImage}
                />
                <div className={s.cardName}>{genre.name}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GenresPage;
