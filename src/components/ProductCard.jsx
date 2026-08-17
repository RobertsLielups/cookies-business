function ProductCard({ name, description, badge, image, imageAlt }) {
  return (
    <article className="product-card">
      <img className="product-card__image" src={image} alt={imageAlt} />
      <div className="product-card__body">
        {badge && <span className="product-card__badge">{badge}</span>}
        <h3 className="product-card__title">{name}</h3>
        <p className="product-card__description">{description}</p>
      </div>
    </article>
  );
}

export default ProductCard;
