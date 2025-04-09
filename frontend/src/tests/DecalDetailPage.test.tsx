import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom';
import DecalDetailPage from '../pages/DecalDetailPage';
import DecalService from '../services/decalService';

// Mock the DecalService
jest.mock('../services/decalService');
const mockDecalService = DecalService as jest.Mocked<typeof DecalService>;

// Mock the Three.js components
jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => <div data-testid="canvas">{children}</div>,
}));

jest.mock('@react-three/drei', () => ({
  OrbitControls: () => <div data-testid="orbit-controls" />,
}));

// Mock the OctaneModel component
jest.mock('../components/OctaneModel', () => ({
  __esModule: true,
  default: ({ textureUrl, colors }: { textureUrl: string | null, colors: string[] }) => (
    <div data-testid="octane-model">
      <div>Texture URL: {textureUrl || 'none'}</div>
      <div>Colors: {colors.join(', ')}</div>
    </div>
  ),
}));

describe('DecalDetailPage Component', () => {
  const mockDecal = {
    _id: 'decal1',
    name: 'Flaming Wolf',
    prompt: 'flaming cybernetic wolf',
    colors: ['#FF0000', '#000000'],
    status: 'completed',
    imageUrl: 'http://example.com/image1.png',
    previewUrl: 'http://example.com/preview1.png',
    downloadUrl: 'http://example.com/download1.zip',
    createdAt: '2025-04-09T12:00:00Z',
    updatedAt: '2025-04-09T12:30:00Z'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the loading state initially', () => {
    // Mock the service to delay response
    mockDecalService.getDecalById.mockImplementationOnce(() => new Promise(resolve => {
      setTimeout(() => resolve(mockDecal), 100);
    }));

    render(
      <MemoryRouter initialEntries={['/decals/decal1']}>
        <Routes>
          <Route path="/decals/:id" element={<DecalDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Loading decal details...')).toBeInTheDocument();
  });

  it('renders the decal details when loaded', async () => {
    // Mock the service to return a decal
    mockDecalService.getDecalById.mockResolvedValueOnce(mockDecal);

    render(
      <MemoryRouter initialEntries={['/decals/decal1']}>
        <Routes>
          <Route path="/decals/:id" element={<DecalDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for decal details to load
    await waitFor(() => {
      expect(screen.getByText('Flaming Wolf')).toBeInTheDocument();
      expect(screen.getByText('flaming cybernetic wolf')).toBeInTheDocument();
    });

    // Check that status badge is displayed correctly
    expect(screen.getByText('Completed')).toBeInTheDocument();

    // Check that the download button is displayed
    expect(screen.getByText('Download Decal Package')).toBeInTheDocument();

    // Check that the 3D preview is rendered
    expect(screen.getByTestId('canvas')).toBeInTheDocument();
    expect(screen.getByTestId('octane-model')).toBeInTheDocument();

    // Check that the service was called with the correct ID
    expect(mockDecalService.getDecalById).toHaveBeenCalledWith('decal1');
  });

  it('handles download button click', async () => {
    // Mock the services
    mockDecalService.getDecalById.mockResolvedValueOnce(mockDecal);
    mockDecalService.downloadDecal.mockResolvedValueOnce('http://example.com/download1.zip');

    // Mock document.createElement and other DOM methods
    const mockAnchor = {
      href: '',
      download: '',
      click: jest.fn(),
    };
    
    const originalCreateElement = document.createElement;
    document.createElement = jest.fn().mockImplementation((tag) => {
      if (tag === 'a') return mockAnchor;
      return originalCreateElement(tag);
    });
    
    const originalAppendChild = document.body.appendChild;
    document.body.appendChild = jest.fn();
    
    const originalRemoveChild = document.body.removeChild;
    document.body.removeChild = jest.fn();

    render(
      <MemoryRouter initialEntries={['/decals/decal1']}>
        <Routes>
          <Route path="/decals/:id" element={<DecalDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for decal details to load
    await waitFor(() => {
      expect(screen.getByText('Download Decal Package')).toBeInTheDocument();
    });

    // Click the download button
    screen.getByText('Download Decal Package').click();

    // Wait for the download to be triggered
    await waitFor(() => {
      expect(mockDecalService.downloadDecal).toHaveBeenCalledWith('decal1');
      expect(mockAnchor.href).toBe('http://example.com/download1.zip');
      expect(mockAnchor.click).toHaveBeenCalled();
    });

    // Restore original methods
    document.createElement = originalCreateElement;
    document.body.appendChild = originalAppendChild;
    document.body.removeChild = originalRemoveChild;
  });

  it('handles errors when fetching decal details', async () => {
    // Mock the service to throw an error
    mockDecalService.getDecalById.mockRejectedValueOnce(new Error('Failed to fetch'));

    render(
      <MemoryRouter initialEntries={['/decals/decal1']}>
        <Routes>
          <Route path="/decals/:id" element={<DecalDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for error message to be displayed
    await waitFor(() => {
      expect(screen.getByText('Failed to load decal details. Please try again later.')).toBeInTheDocument();
    });
  });

  it('handles processing status and polling', async () => {
    // Create a processing decal
    const processingDecal = {
      ...mockDecal,
      status: 'processing',
      downloadUrl: undefined
    };

    // Mock the services
    mockDecalService.getDecalById
      .mockResolvedValueOnce(processingDecal)
      .mockResolvedValueOnce({...processingDecal, status: 'completed', downloadUrl: 'http://example.com/download1.zip'});

    // Use fake timers to control polling
    jest.useFakeTimers();

    render(
      <MemoryRouter initialEntries={['/decals/decal1']}>
        <Routes>
          <Route path="/decals/:id" element={<DecalDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Processing')).toBeInTheDocument();
    });

    // Fast-forward past the polling interval
    jest.advanceTimersByTime(5000);

    // Wait for status update
    await waitFor(() => {
      expect(screen.getByText('Completed')).toBeInTheDocument();
      expect(screen.getByText('Download Decal Package')).toBeInTheDocument();
    });

    // Restore real timers
    jest.useRealTimers();
  });
});
