import type { FC } from "react";
import type { Movie } from "../../types/movie";
import s from "./MovieCard.module.scss";
import { useNavigate } from "react-router-dom";

type MovieCardProps = {
  movie: Movie;
  onAddFavorite?: () => void;
  rank?: number;
  showRank?: boolean;
  fullWidth?: boolean;
};

const MovieCard: FC<MovieCardProps> = ({
  movie,
  rank,
  showRank,
  onAddFavorite,
  fullWidth,
}) => {
  const navigate = useNavigate();

  const goToDetails = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div
      className={`${s.card} ${fullWidth ? s.cardFullWidth : ""}`}
      role="link"
      tabIndex={0}
      aria-label={`Open movie ${movie.title}`}
      data-testid="movie-card"
      data-movie-id={movie.id}
      onClick={goToDetails}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          goToDetails();
        }
      }}
    >
      {showRank && rank && <span className={s.card__rank}>{rank}</span>}

      <div className={s.card__inner}>
        <img
          src={movie.posterUrl}
          loading="lazy"
          alt={movie.title}
          className={s.card__image}
        />
      </div>

      {onAddFavorite && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation(); // важно: не открывать details при клике на кнопку
            onAddFavorite();
          }}
          aria-label="Add to favorites"
          data-testid="movie-card-favorite"
        >
          В избранное
        </button>
      )}
    </div>
  );
};

export default MovieCard;
