import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/effect-fade';
import 'swiper/css/autoplay';

// Import Swiper styles
import 'swiper/css';
import { Autoplay, Pagination, EffectFade, Navigation } from 'swiper/modules';
import { bannerLists } from '../../utils';
import { Link } from 'react-router-dom';

const colors = ["bg-banner-color1", "bg-banner-color2", "bg-banner-color3"];

const HomeBanner = () => {
  return (
    <div className='py-2 rounded-md' data-testid="home-banner">
      <Swiper
        grabCursor={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        navigation
        modules={[Pagination, EffectFade, Navigation, Autoplay]}
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        slidesPerView={1}
        data-testid="swiper-container">

        {bannerLists.map((item, i) => (
          <SwiperSlide key={item.id} data-testid={`banner-slide-${item.id}`}>
            <div className={`carousel-item rounded-md sm:h-[500px] h-96 ${colors[i]}`}>
              <div className='flex items-center justify-center'>
                <div className='hidden lg:flex justify-center w-1/2 p-8'>
                  <div className='text-center'>
                    <h3 className='text-3xl text-white font-bold' data-testid={`banner-title-${item.id}`}>
                      {item.title}
                    </h3>
                    <h1 className='text-5xl text-white font-bold mt-2' data-testid={`banner-subtitle-${item.id}`}>
                      {item.subtitle}
                    </h1>
                    <p className='text-white font-bold mt-4' data-testid={`banner-description-${item.id}`}>
                      {item.description}
                    </p>
                    <Link
                      className='mt-6 inline-block bg-black text-white py-2 px-4 rounded hover:bg-gray-800'
                      to="/products"
                      data-testid={`banner-shop-link-${item.id}`}>
                      Shop
                    </Link>
                  </div>
                </div>
                <div className='w-full flex justify-center lg:w-1/2 p-4'>
                  <img
                    src={item?.image}
                    alt={item.title}
                    data-testid={`banner-image-${item.id}`}
                  />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}


export default HomeBanner;