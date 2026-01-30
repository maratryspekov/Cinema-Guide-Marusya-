import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import s from "./MovieDetailsPage.module.scss";
import { getMovieById } from "../../../services/movieService";
import type { Movie } from "../../../types/movie";
import Button from "../../../components/ui/Button/Button";
import IconFavorite from "../../../assets/icons/icon-fav.svg?react";
import IconFavoriteActive from "../../../assets/icons/icon-favorite-active.svg?react";
import TrailerModal from "../../../components/ui/TrailerModal/TrailerModal";
import { toast } from "react-toastify";

import { useAppSelector } from "../../../app/hooks";
import {
  useGetFavoritesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} from "../../../features/auth/authApi";

const MovieDetailsPage = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  const user = useAppSelector((s) => s.auth.user);

  // Важно: не дергаем favorites если не авторизован
  const {
    data: favorites = [],
    isFetching: favoritesFetching,
    refetch,
  } = useGetFavoritesQuery(undefined, { skip: !user });

  const [addFavorite, { isLoading: isAdding }] = useAddFavoriteMutation();
  const [removeFavorite, { isLoading: isRemoving }] =
    useRemoveFavoriteMutation();

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        if (!movieId) return;
        const data = await getMovieById(movieId);
        if (!cancelled) setMovie(data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [movieId]);

  // Не храним isFavorite в state — считаем из источника правды (favorites + movie)
  const isFavorite = useMemo(() => {
    if (!user || !movie) return false;
    return favorites.some((m) => String(m.id) === String(movie.id));
  }, [user, movie, favorites]);

  const handleTrailerClick = () => setIsTrailerOpen(true);

  const toggleFavorite = async () => {
    if (!movie) return;

    if (!user) {
      toast.info("Please sign in to use favorites");
      return;
    }

    try {
      if (isFavorite) {
        await removeFavorite(movie.id).unwrap();
        toast.success("Removed from favorites");
      } else {
        await addFavorite(movie.id).unwrap();
        toast.success("Added to favorites");
      }
      // Обновим список, чтобы UI точно синхронизировался
      refetch();
    } catch {
      toast.error("Error updating favorites");
    }
  };

  if (loading)
    return (
      <div className={s.container} data-testid="movie-details-page">
        <div className={s.wrapper}>
          <div className={s.status}>Loading...</div>
        </div>
      </div>
    );

  if (!movie)
    return (
      <div className={s.container} data-testid="movie-details-page">
        <div className={s.wrapper}>
          <div className={s.status}>Movie not found</div>
        </div>
      </div>
    );

  const releaseYear = movie.releaseDate?.slice(0, 4) || "—";
  const runtime =
    movie.runtime && movie.runtime > 0
      ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
      : "—";
  const rating = movie.tmdbRating ? Number(movie.tmdbRating).toFixed(1) : "N/A";

  const favBusy = favoritesFetching || isAdding || isRemoving;

  return (
    <div className={s.container} data-testid="movie-details-page">
      <div className={s.wrapper}>
        <div className={s.mainSection}>
          <div className={s.info}>
            <div className={s.topInfo}>
              <span className={s.rating}>{rating}</span>
              <span className={s.year}>{releaseYear}</span>
              <span className={s.genres}>{movie.genres?.join(", ")}</span>
              <span className={s.runtime}>{runtime}</span>
            </div>

            <h1 className={s.title} data-testid="movie-title">
              {movie.title}
            </h1>

            <p className={s.plot} data-testid="movie-plot">
              {movie.plot}
            </p>

            <div className={s.actions}>
              <Button className={s.trailerBtn} onClick={handleTrailerClick}>
                Trailer
              </Button>

              <button
                className={s.favoriteBtn}
                type="button"
                onClick={toggleFavorite}
                data-testid="favorite-toggle"
                aria-label={
                  isFavorite ? "Remove from favorites" : "Add to favorites"
                }
                aria-pressed={isFavorite}
                aria-busy={favBusy}
                disabled={favBusy}
              >
                {isFavorite ? (
                  <IconFavoriteActive className={s.favoriteIcon} />
                ) : (
                  <IconFavorite className={s.favoriteIcon} />
                )}
              </button>
            </div>
          </div>

          <img src={movie.posterUrl} alt={movie.title} className={s.poster} />
        </div>

        <div className={s.detailsSection}>
          <h2 className={s.sectionTitle}>About Movie</h2>
          <div className={s.detailsGrid}>
            <div className={s.detailRow}>
              <span className={s.label}>Original Language</span>
              <span className={s.value}>
                {movie.language || movie.languages?.join(", ") || "—"}
              </span>
            </div>
            <div className={s.detailRow}>
              <span className={s.label}>Budget</span>
              <span className={s.value}>{movie.budget || "—"}</span>
            </div>
            <div className={s.detailRow}>
              <span className={s.label}>Revenue</span>
              <span className={s.value}>{movie.revenue || "—"}</span>
            </div>
            <div className={s.detailRow}>
              <span className={s.label}>Director</span>
              <span className={s.value}>{movie.director || "—"}</span>
            </div>
            <div className={s.detailRow}>
              <span className={s.label}>Production</span>
              <span className={s.value}>{movie.production || "—"}</span>
            </div>
            <div className={s.detailRow}>
              <span className={s.label}>Awards</span>
              <span className={s.value}>{movie.awardsSummary || "—"}</span>
            </div>
          </div>
        </div>

        {isTrailerOpen && (
          <TrailerModal
            isOpen={isTrailerOpen}
            onClose={() => setIsTrailerOpen(false)}
            trailerUrl={
              movie.trailerUrl ||
              (movie.trailerYoutubeId
                ? `https://www.youtube.com/embed/${movie.trailerYoutubeId}`
                : "")
            }
            movieTitle={movie.title}
          />
        )}
      </div>
    </div>
  );
};

export default MovieDetailsPage;
