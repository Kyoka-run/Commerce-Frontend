import ProductCard from "./shared/ProductCard";

const products = [
  {
    image: "https://images.pexels.com/photos/29020349/pexels-photo-29020349/free-photo-of-modern-smartphone-on-wooden-surface.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    productName: "iPhone 13 Pro Max",
    description:
      "The iPhone 13 Pro Max offers exceptional performance with its A15 Bionic chip, stunning Super Retina XDR display, and advanced camera features for breathtaking photos.",
    specialPrice: 720,
    price: 780,
  },
  {
    image: "https://files.refurbed.com/ii/samsung-galaxy-s21-5g-1618197343.jpg?t=fitdesign&h=600&w=800&t=convert&f=webp",
    productName: "Samsung Galaxy S21",
    description:
      "Experience the brilliance of the Samsung Galaxy S21 with its vibrant AMOLED display, powerful camera, and sleek design that fits perfectly in your hand.",
    specialPrice: 699,
    price: 799,
  },
  {
    image: "https://caseface.ie/wp-content/uploads/silicone-Google-Pixel-6-case-blue.png",
    productName: "Google Pixel 6",
    description:
      "The Google Pixel 6 boasts cutting-edge AI features, exceptional photo quality, and a stunning display, making it a perfect choice for Android enthusiasts.",
    price: 599,
    specialPrice: 400,
  }
];

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8" data-testid="about-container">
      <h1 className="text-slate-800 text-4xl font-bold text-center mb-12" data-testid="about-heading">
        About Us
      </h1>
      <div className="flex flex-col lg:flex-row justify-between items-center mb-12" data-testid="about-intro">
        <div className="w-full md:w-1/2 text-center md:text-left">
          <p className="text-lg mb-4" data-testid="about-description">
            Welcome to our e-commerce store! We are dedicated to providing the
            best products and services to our customers. Our mission is to offer
            a seamless shopping experience while ensuring the highest quality of
            our offerings.
          </p>
        </div>

        <div className="w-full md:w-1/2 mb-6 md:mb-0">
          <img
            src="https://images.pexels.com/photos/4968390/pexels-photo-4968390.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="About Us"
            className="w-full h-auto rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105"
            data-testid="about-image"></img>
        </div>
      </div>


      <div className="py-7 space-y-8" data-testid="products-showcase">
        <h1 className="text-slate-800 text-4xl font-bold text-center" data-testid="products-heading">
          Our Products
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="product-cards-container">
          {products.map((product, index) => (
            <ProductCard
              key={index}
              image={product.image}
              productName={product.productName}
              description={product.description}
              specialPrice={product.specialPrice}
              price={product.price}
              about
              data-testid={`about-product-card-${index}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default About;