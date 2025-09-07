import React from "react";
import styles from "./Card.module.css";
import {
    FaPlay,
    FaHeart,
    FaShare,
    FaComment,
    FaEllipsisH,
} from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";

const Card = ({
    type = "news",
    title,
    description,
    image,
    date,
    source,
    onClick,
    isFavorite = false,
    onFavoriteToggle = () => {},
    artist,
    album,
    previewUrl,
    username,
    userAvatar,
    likes,
    comments,
    shares,
    className = "",
}) => {
    const handleFavoriteClick = (e) => {
        e.stopPropagation();
        onFavoriteToggle();
    };
    const renderContent = () => {
        switch (type) {
            case "music":
                return (
                    <div className={styles.musicContent}>
                        <div className={styles.musicInfo}>
                            <h3 className={styles.title}>{title}</h3>
                            <p className={styles.artist}>{artist}</p>
                            {album && <p className={styles.album}>{album}</p>}
                        </div>
                        <div className={styles.musicActions}>
                            {previewUrl && (
                                <button
                                    className={styles.playButton}
                                    onClick={() => onClick?.()}
                                >
                                    <FaPlay />
                                </button>
                            )}
                            <button
                                className={`${styles.favoriteButton} ${
                                    isFavorite ? styles.favorited : ""
                                }`}
                                onClick={handleFavoriteClick}
                                aria-label={
                                    isFavorite
                                        ? "Remove from favorites"
                                        : "Add to favorites"
                                }
                            >
                                <FaHeart />
                            </button>
                        </div>
                    </div>
                );

            case "social":
                return (
                    <div className={styles.socialContent}>
                        <div className={styles.userInfo}>
                            <div className={styles.avatar}>
                                {userAvatar ? (
                                    <img
                                        src={userAvatar}
                                        alt={username}
                                        width={40}
                                        height={40}
                                        className={styles.avatarImage}
                                    />
                                ) : (
                                    <div className={styles.avatarPlaceholder}>
                                        {username?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div>
                                <div className={styles.username}>
                                    {username}
                                </div>
                                {date && (
                                    <div className={styles.timestamp}>
                                        {formatDistanceToNow(new Date(date), {
                                            addSuffix: true,
                                        })}
                                    </div>
                                )}
                            </div>
                            <div className={styles.socialActions}>
                                <button
                                    className={`${styles.favoriteButton} ${
                                        isFavorite ? styles.favorited : ""
                                    }`}
                                    onClick={handleFavoriteClick}
                                    aria-label={
                                        isFavorite
                                            ? "Remove from favorites"
                                            : "Add to favorites"
                                    }
                                >
                                    <FaHeart />
                                </button>
                                <button className={styles.moreOptions}>
                                    <FaEllipsisH />
                                </button>
                            </div>
                        </div>

                        <div className={styles.postContent}>
                            {description && (
                                <p className={styles.description}>
                                    {description}
                                </p>
                            )}
                            {image && (
                                <div className={styles.imageContainer}>
                                    <img
                                        src={image}
                                        alt={title || "Post image"}
                                        className={styles.postImage}
                                    />
                                </div>
                            )}
                        </div>

                        <div className={styles.postActions}>
                            <button className={styles.actionButton}>
                                <FaHeart /> {likes || 0}
                            </button>
                            <button className={styles.actionButton}>
                                <FaComment /> {comments || 0}
                            </button>
                            <button className={styles.actionButton}>
                                <FaShare /> {shares || 0}
                            </button>
                        </div>
                    </div>
                );

            case "news":
            default:
                return (
                    <div className={styles.newsContent}>
                        {image && (
                            <div className={styles.imageContainer}>
                                <img
                                    src={image}
                                    alt={title}
                                    className={styles.newsImage}
                                />
                            </div>
                        )}
                        <div className={styles.newsInfo}>
                            <div className={styles.newsHeader}>
                                <h3 className={styles.title}>{title}</h3>
                                <button
                                    className={`${styles.favoriteButton} ${
                                        isFavorite ? styles.favorited : ""
                                    }`}
                                    onClick={handleFavoriteClick}
                                    aria-label={
                                        isFavorite
                                            ? "Remove from favorites"
                                            : "Add to favorites"
                                    }
                                >
                                    <FaHeart />
                                </button>
                            </div>
                            {description && (
                                <p className={styles.description}>
                                    {description}
                                </p>
                            )}
                            <div className={styles.meta}>
                                {source && (
                                    <span className={styles.source}>
                                        {source}
                                    </span>
                                )}
                                {date && (
                                    <span className={styles.date}>
                                        {formatDistanceToNow(new Date(date), {
                                            addSuffix: true,
                                        })}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className={`${styles.card} ${styles[type]} ${className}`}>
            {renderContent()}
        </div>
    );
};

export default Card;
