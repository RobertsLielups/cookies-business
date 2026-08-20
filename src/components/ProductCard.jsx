import { Link } from 'react-router-dom';

function ProductCard({ id, name, description, image, imageAlt }) {
  return (
    <Link to={`/products/${id}`} className="product-card">
      <img className="product-card__image" src={image} alt={imageAlt} />
      <div className="product-card__body">
        <h3 className="product-card__title">{name}</h3>
        <p className="product-card__description">{description}</p>
      </div>
    </Link>
  );
}

export default ProductCard;
