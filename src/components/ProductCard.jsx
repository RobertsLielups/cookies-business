function ProductCard({ title, description, badge, imageAlt }) {
  return (
    <article className="product-card">
      <div
        className="product-card__image image-placeholder"
        role="img"
        aria-label={imageAlt}
      >
        {title}
      </div>
      <div className="product-card__body">
        {badge && <span className="product-card__badge">{badge}</span>}
        <h3 className="product-card__title">{title}</h3>
        <p className="product-card__description">{description}</p>
      </div>
    </article>
  );
}

export default ProductCard;
