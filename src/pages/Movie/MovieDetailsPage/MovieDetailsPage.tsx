import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import s from "./MovieDetailsPage.module.scss";
import { getMovieById } from "../../../services/movieService";
import type { Movie } from "../../../types/movie";
import Button from "../../../components/ui/Button/Button";
import IconFavorite from "../../../assets/icons/icon-fav.svg?react";
import IconFavoriteActive from "../../../assets/icons/icon-favorite-active.svg?react";
import TrailerModal from "../../../components/ui/TrailerModal/TrailerModal";

// RTK Query imports
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

  // RTK Query hooks
  const { data: favorites = [], refetch } = useGetFavoritesQuery();
  const [addFavorite] = useAddFavoriteMutation();
  const [removeFavorite] = useRemoveFavoriteMutation();

  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (movieId) {
      getMovieById(movieId)
        .then(setMovie)
        .finally(() => setLoading(false));
    }
  }, [movieId]);

  useEffect(() => {
    if (movie && favorites.length) {
      setIsFavorite(favorites.some((m) => String(m.id) === String(movieId)));
    }
  }, [favorites, movie, movieId]);

  const handleTrailerClick = () => {
    setIsTrailerOpen(true);
  };

  const toggleFavorite = async () => {
    if (!movie) return;
    if (isFavorite) {
      await removeFavorite(movie.id).unwrap();
    } else {
      await addFavorite(movie.id).unwrap();
    }
    refetch();
  };

  if (loading)
    return (
      <div className={s.container}>
        <div className={s.wrapper}>
          <div className={s.status}>Loading...</div>
        </div>
      </div>
    );

  if (!movie)
    return (
      <div className={s.container}>
        <div className={s.wrapper}>
          <div className={s.status}>Movie not found</div>
        </div>
      </div>
    );

  return (
    <div className={s.container}>
      <div className={s.wrapper}>
        <div className={s.mainSection}>
          <div className={s.info}>
            <div className={s.topInfo}>
              <span className={s.rating}>
                {movie.tmdbRating ? Number(movie.tmdbRating).toFixed(1) : "N/A"}
              </span>
              <span className={s.year}>{movie.releaseDate?.slice(0, 4)}</span>
              <span className={s.genres}>{movie.genres?.join(", ")}</span>
              <span className={s.runtime}>
                {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
              </span>
            </div>
            <h1 className={s.title}>{movie.title}</h1>
            <p className={s.plot}>{movie.plot}</p>
            <div className={s.actions}>
              <Button className={s.trailerBtn} onClick={handleTrailerClick}>
                Trailer
              </Button>
              <button className={s.favoriteBtn} onClick={toggleFavorite}>
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
                {movie.language || movie.languages?.join(", ")}
              </span>
            </div>
            <div className={s.detailRow}>
              <span className={s.label}>Budget</span>
              <span className={s.value}>{movie.budget}</span>
            </div>
            <div className={s.detailRow}>
              <span className={s.label}>Revenue</span>
              <span className={s.value}>{movie.revenue}</span>
            </div>
            <div className={s.detailRow}>
              <span className={s.label}>Director</span>
              <span className={s.value}>{movie.director}</span>
            </div>
            <div className={s.detailRow}>
              <span className={s.label}>Production</span>
              <span className={s.value}>{movie.production}</span>
            </div>
            <div className={s.detailRow}>
              <span className={s.label}>Awards</span>
              <span className={s.value}>{movie.awardsSummary}</span>
            </div>
          </div>
        </div>

        {isTrailerOpen && (
          <TrailerModal
            isOpen={isTrailerOpen}
            onClose={() => setIsTrailerOpen(false)}
            trailerUrl={
              movie.trailerUrl ||
              `https://www.youtube.com/embed/${movie.trailerYoutubeId}`
            }
            movieTitle={movie.title}
          />
        )}
      </div>
    </div>
  );
};

export default MovieDetailsPage;
