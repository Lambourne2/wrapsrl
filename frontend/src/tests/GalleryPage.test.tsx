import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import GalleryPage from '../pages/GalleryPage';
import DecalService from '../services/decalService';

// Mock the DecalService
jest.mock('../services/decalService');
const mockDecalService = DecalService as jest.Mocked<typeof DecalService>;

describe('GalleryPage Component', () => {
  const mockDecals = [
    {
      _id: 'decal1',
      name: 'Flaming Wolf',
      prompt: 'flaming cybernetic wolf',
      colors: ['#FF0000', '#000000'],
      status: 'completed',
      previewUrl: 'http://example.com/preview1.png',
      createdAt: '2025-04-09T12:00:00Z'
    },
    {
      _id: 'decal2',
      name: 'Neon Dragon',
      prompt: 'neon dragon with geometric patterns',
      colors: ['#00FF00', '#0000FF'],
      status: 'processing',
      createdAt: '2025-04-09T13:00:00Z'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the loading state initially', () => {
    // Mock the service to delay response
    mockDecalService.getDecals.mockImplementationOnce(() => new Promise(resolve => {
      setTimeout(() => resolve(mockDecals), 100);
    }));

    render(
      <BrowserRouter>
        <GalleryPage />
      </BrowserRouter>
    );

    expect(screen.getByText('Loading decals...')).toBeInTheDocument();
  });

  it('renders the decals when loaded', async () => {
    // Mock the service to return decals
    mockDecalService.getDecals.mockResolvedValueOnce(mockDecals);

    render(
      <BrowserRouter>
        <GalleryPage />
      </BrowserRouter>
    );

    // Wait for decals to load
    await waitFor(() => {
      expect(screen.getByText('Flaming Wolf')).toBeInTheDocument();
      expect(screen.getByText('Neon Dragon')).toBeInTheDocument();
    });

    // Check that status badges are displayed correctly
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Processing')).toBeInTheDocument();

    // Check that the service was called
    expect(mockDecalService.getDecals).toHaveBeenCalledTimes(1);
  });

  it('renders the empty state when no decals are found', async () => {
    // Mock the service to return empty array
    mockDecalService.getDecals.mockResolvedValueOnce([]);

    render(
      <BrowserRouter>
        <GalleryPage />
      </BrowserRouter>
    );

    // Wait for empty state to be displayed
    await waitFor(() => {
      expect(screen.getByText('No decals found')).toBeInTheDocument();
      expect(screen.getByText('Create your first decal to get started!')).toBeInTheDocument();
    });
  });

  it('handles errors when fetching decals', async () => {
    // Mock the service to throw an error
    mockDecalService.getDecals.mockRejectedValueOnce(new Error('Failed to fetch'));

    render(
      <BrowserRouter>
        <GalleryPage />
      </BrowserRouter>
    );

    // Wait for error message to be displayed
    await waitFor(() => {
      expect(screen.getByText('Failed to load decals. Please try again later.')).toBeInTheDocument();
    });
  });
});
