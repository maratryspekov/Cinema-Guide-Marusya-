import { useEffect, useState } from "react";
import { getRandomMovie } from "../../../services/movieService";
import type { Movie } from "../../../types/movie";
import s from "./Hero.module.scss";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import IconHeart from "../../../assets/icons/icon-fav.svg?react";
import IconRefresh from "../../../assets/icons/icon-refresh.svg?react";
import Button from "../../../components/ui/Button/Button";
import { useAppSelector } from "../../../app/hooks";
import {
  useGetFavoritesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} from "../../../features/auth/authApi";
import AuthModal from "../../../components/Authorization/AuthForm";
import TrailerModal from "../../../components/ui/TrailerModal/TrailerModal";

const Hero = () => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  // локальное состояние, но обновляем его аккуратно
  const [isFavorite, setIsFavorite] = useState(false);

  const [pendingFavoriteAction, setPendingFavoriteAction] = useState<
    "add" | "remove" | null
  >(null);
  const [isFavBusy, setIsFavBusy] = useState(false);

  const user = useAppSelector((s) => s.auth.user);
  const navigate = useNavigate();

  const {
    data: favorites = [],
    refetch: refetchFavorites,
    isSuccess: favoritesLoaded,
  } = useGetFavoritesQuery(undefined, { skip: !user });

  const [addFavorite] = useAddFavoriteMutation();
  const [removeFavorite] = useRemoveFavoriteMutation();

  const fetchMovie = () => {
    getRandomMovie().then(setMovie);
  };

  useEffect(() => {
    fetchMovie();
  }, []);

  // ✅ ВАЖНО: синхронизацию делаем только когда favorites реально получены
  useEffect(() => {
    if (!user || !movie) {
      setIsFavorite(false);
      return;
    }

    // пока favorites не загружены — НЕ перезаписываем isFavorite
    if (!favoritesLoaded) return;

    setIsFavorite(favorites.some((f) => f.id === movie.id));
  }, [user, movie, favorites, favoritesLoaded]);

  // ✅ делаем действие с явным "add/remove", чтобы не зависеть от старого isFavorite
  const performFavoriteAction = async (action: "add" | "remove") => {
    if (!movie || isFavBusy) return;

    setIsFavBusy(true);

    // оптимистично сразу меняем UI
    const nextIsFav = action === "add";
    setIsFavorite(nextIsFav);

    try {
      if (action === "remove") {
        await removeFavorite(movie.id).unwrap();
        toast.success("Movie removed from favorites");
      } else {
        await addFavorite(movie.id).unwrap();
        toast.success("Movie added to favorites");
      }

      if (user) await refetchFavorites();
    } catch (error) {
      // откат UI, если ошибка
      setIsFavorite(!nextIsFav);
      toast.error("Error updating favorites");
    } finally {
      setIsFavBusy(false);
    }
  };

  const handleFavoriteClick = () => {
    if (!movie) return;

    if (!user) {
      // пользователь хочет "включить" избранное (если он не залогинен)
      setPendingFavoriteAction("add");
      setIsAuthOpen(true);
      return;
    }

    // если залогинен — решаем действие на основе текущего isFavorite
    performFavoriteAction(isFavorite ? "remove" : "add");
  };

  const handleAuthSuccess = () => {
    setIsAuthOpen(false);

    if (pendingFavoriteAction) {
      const action = pendingFavoriteAction;
      setPendingFavoriteAction(null); // ✅ сброс ДО выполнения, чтобы не было дублей
      performFavoriteAction(action);
    }
  };

  const handleTrailerClick = () => setIsTrailerOpen(true);

  const handleAboutClick = () => {
    if (movie) navigate(`/movie/${movie.id}`);
  };

  if (!movie) return <div className={s.hero__loading}>Loading...</div>;

  const releaseYear = movie.releaseDate?.slice(0, 4) || "—";
  const duration =
    movie.runtime && movie.runtime > 0
      ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
      : "";

  const roundedRating =
    movie.tmdbRating !== undefined && movie.tmdbRating !== null
      ? (Math.round(Number(movie.tmdbRating) * 10) / 10).toFixed(1)
      : "";

  return (
    <section className={s.hero}>
      <div className={s.hero__content}>
        <div className={s.hero__info}>
          <div className={s.hero__wrapper}>
            <div className={s.hero__meta}>
              <span className={s.hero__rating}>★ {roundedRating}</span>
              <span className={s.hero__year}>{releaseYear}</span>
              <span className={s.hero__genres}>{movie.genres.join(", ")}</span>
              {duration && <span className={s.hero__duration}>{duration}</span>}
            </div>

            <h1 className={s.hero__title}>{movie.title}</h1>
            <p className={s.hero__description}>{movie.plot}</p>
          </div>

          <div className={s.hero__buttons}>
            <Button
              className={`${s.hero__btn} ${s["hero__btn--primary"]}`}
              onClick={handleTrailerClick}
            >
              Trailer
            </Button>

            <div className={s.buttonsRow}>
              <Button className={s.hero__btn} onClick={handleAboutClick}>
                About Movie
              </Button>

              <Button
                className={s.hero__iconbtn}
                aria-pressed={isFavorite}
                data-testid="favorite-toggle"
                aria-label={
                  isFavorite ? "Remove from favorites" : "Add to favorites"
                }
                onClick={handleFavoriteClick}
                disabled={isFavBusy} // ✅ чтобы не было двойных кликов → двойных POST
              >
                <IconHeart style={{ color: isFavorite ? "#B4A9FF" : "#fff" }} />
              </Button>

              <Button
                className={s.hero__iconbtn}
                aria-label="Refresh movie"
                onClick={fetchMovie}
              >
                <IconRefresh />
              </Button>
            </div>
          </div>
        </div>

        <div className={s.hero__posterWrapper}>
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className={s.hero__poster}
          />
        </div>
      </div>

      {isAuthOpen && (
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => {
            setIsAuthOpen(false);
            setPendingFavoriteAction(null);
          }}
          onLogin={handleAuthSuccess}
          onRegister={handleAuthSuccess}
        />
      )}

      {isTrailerOpen && (
        <TrailerModal
          isOpen={isTrailerOpen}
          onClose={() => setIsTrailerOpen(false)}
          trailerUrl={movie.trailerUrl}
        />
      )}
    </section>
  );
};

export default Hero;
