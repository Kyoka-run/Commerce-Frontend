import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import HomeBanner from './HomeBanner';

// Mock the bannerLists
vi.mock('../../utils', () => ({
  bannerLists: [
    {
      id: 1,
      image: 'test-image-1.jpg',
      title: 'Test Title 1',
      subtitle: 'Test Subtitle 1',
      description: 'Test Description 1'
    },
    {
      id: 2,
      image: 'test-image-2.jpg',
      title: 'Test Title 2',
      subtitle: 'Test Subtitle 2',
      description: 'Test Description 2'
    }
  ]
}));

// Mock Swiper components
vi.mock('swiper/react', () => ({
  Swiper: vi.fn(({ children }) => <div data-testid="swiper-mock">{children}</div>),
  SwiperSlide: vi.fn(({ children }) => <div data-testid="swiper-slide-mock">{children}</div>)
}));

// Mock Swiper modules
vi.mock('swiper/modules', () => ({
  Autoplay: 'autoplay-mock',
  Pagination: 'pagination-mock',
  EffectFade: 'effect-fade-mock',
  Navigation: 'navigation-mock'
}));

describe('HomeBanner Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the banner container', () => {
    renderWithProviders(<HomeBanner />);
    
    expect(screen.getByTestId('home-banner')).toBeInTheDocument();
    expect(screen.getByTestId('swiper-mock')).toBeInTheDocument();
  });

  it('renders the correct number of banner slides', () => {
    renderWithProviders(<HomeBanner />);
    
    // We should see 2 slides based on our mock data
    const slides = screen.getAllByTestId('swiper-slide-mock');
    expect(slides).toHaveLength(2);
  });

  it('renders banner content for each slide', () => {
    renderWithProviders(<HomeBanner />);
    
    // Check first banner
    expect(screen.getByTestId('banner-title-1')).toBeInTheDocument();
    expect(screen.getByTestId('banner-subtitle-1')).toBeInTheDocument();
    expect(screen.getByTestId('banner-description-1')).toBeInTheDocument();
    expect(screen.getByTestId('banner-shop-link-1')).toBeInTheDocument();
    expect(screen.getByTestId('banner-image-1')).toBeInTheDocument();
    
    // Check second banner
    expect(screen.getByTestId('banner-title-2')).toBeInTheDocument();
    expect(screen.getByTestId('banner-subtitle-2')).toBeInTheDocument();
    expect(screen.getByTestId('banner-description-2')).toBeInTheDocument();
    expect(screen.getByTestId('banner-shop-link-2')).toBeInTheDocument();
    expect(screen.getByTestId('banner-image-2')).toBeInTheDocument();
  });

  it('displays the correct banner content', () => {
    renderWithProviders(<HomeBanner />);
    
    // Check first banner content
    expect(screen.getByTestId('banner-title-1')).toHaveTextContent('Test Title 1');
    expect(screen.getByTestId('banner-subtitle-1')).toHaveTextContent('Test Subtitle 1');
    expect(screen.getByTestId('banner-description-1')).toHaveTextContent('Test Description 1');
    
    // Check second banner content
    expect(screen.getByTestId('banner-title-2')).toHaveTextContent('Test Title 2');
    expect(screen.getByTestId('banner-subtitle-2')).toHaveTextContent('Test Subtitle 2');
    expect(screen.getByTestId('banner-description-2')).toHaveTextContent('Test Description 2');
  });

  it('has working shop links that point to products page', () => {
    renderWithProviders(<HomeBanner />);
    
    const shopLink1 = screen.getByTestId('banner-shop-link-1');
    const shopLink2 = screen.getByTestId('banner-shop-link-2');
    
    expect(shopLink1).toHaveAttribute('href', '/products');
    expect(shopLink2).toHaveAttribute('href', '/products');
    expect(shopLink1).toHaveTextContent('Shop');
    expect(shopLink2).toHaveTextContent('Shop');
  });

  it('renders banner images with correct src attributes', () => {
    renderWithProviders(<HomeBanner />);
    
    const image1 = screen.getByTestId('banner-image-1');
    const image2 = screen.getByTestId('banner-image-2');
    
    expect(image1).toHaveAttribute('src', 'test-image-1.jpg');
    expect(image2).toHaveAttribute('src', 'test-image-2.jpg');
    
    expect(image1).toHaveAttribute('alt', 'Test Title 1');
    expect(image2).toHaveAttribute('alt', 'Test Title 2');
  });
});