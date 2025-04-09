import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import CreatePage from '../pages/CreatePage';
import DecalService from '../services/decalService';

// Mock the DecalService
jest.mock('../services/decalService');
const mockDecalService = DecalService as jest.Mocked<typeof DecalService>;

// Mock the DecalCreator component
jest.mock('../components/DecalCreator', () => ({
  __esModule: true,
  default: ({ onSubmit }: { onSubmit: (data: any) => void }) => (
    <div data-testid="decal-creator">
      <button 
        data-testid="mock-submit-button" 
        onClick={() => onSubmit({ prompt: 'test prompt', colors: ['#FF0000'] })}
      >
        Mock Submit
      </button>
    </div>
  ),
}));

describe('CreatePage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component correctly', () => {
    render(
      <BrowserRouter>
        <CreatePage />
      </BrowserRouter>
    );

    expect(screen.getByText('Create New Decal')).toBeInTheDocument();
    expect(screen.getByTestId('decal-creator')).toBeInTheDocument();
  });

  it('handles successful decal generation', async () => {
    // Mock the DecalService methods
    mockDecalService.generateDecal.mockResolvedValueOnce({
      decalId: 'test-id-123',
      status: 'processing',
      message: 'Decal generation started'
    });
    
    mockDecalService.checkDecalStatus.mockResolvedValueOnce('completed');
    mockDecalService.downloadDecal.mockResolvedValueOnce('http://example.com/decal.zip');

    render(
      <BrowserRouter>
        <CreatePage />
      </BrowserRouter>
    );

    // Trigger the form submission
    screen.getByTestId('mock-submit-button').click();

    // Check that the loading state is shown
    expect(await screen.findByText('Generating your decal...')).toBeInTheDocument();

    // Wait for the status check and download URL to be available
    await waitFor(() => {
      expect(screen.getByText('Download Your Decal')).toBeInTheDocument();
    });

    // Verify the service calls
    expect(mockDecalService.generateDecal).toHaveBeenCalledWith('test prompt', ['#FF0000']);
    expect(mockDecalService.checkDecalStatus).toHaveBeenCalledWith('test-id-123');
    expect(mockDecalService.downloadDecal).toHaveBeenCalledWith('test-id-123');
  });

  it('handles failed decal generation', async () => {
    // Mock the DecalService methods to simulate an error
    mockDecalService.generateDecal.mockRejectedValueOnce(new Error('API error'));

    render(
      <BrowserRouter>
        <CreatePage />
      </BrowserRouter>
    );

    // Trigger the form submission
    screen.getByTestId('mock-submit-button').click();

    // Check that the error message is shown
    await waitFor(() => {
      expect(screen.getByText('Error generating decal. Please try again.')).toBeInTheDocument();
    });
  });

  it('handles processing status updates', async () => {
    // Mock the DecalService methods
    mockDecalService.generateDecal.mockResolvedValueOnce({
      decalId: 'test-id-123',
      status: 'processing',
      message: 'Decal generation started'
    });
    
    // First check returns processing, second returns completed
    mockDecalService.checkDecalStatus
      .mockResolvedValueOnce('processing')
      .mockResolvedValueOnce('completed');
    
    mockDecalService.downloadDecal.mockResolvedValueOnce('http://example.com/decal.zip');

    render(
      <BrowserRouter>
        <CreatePage />
      </BrowserRouter>
    );

    // Trigger the form submission
    screen.getByTestId('mock-submit-button').click();

    // Check that the processing state is shown
    expect(await screen.findByText('Processing your decal...')).toBeInTheDocument();

    // Wait for the status to update to completed
    await waitFor(() => {
      expect(screen.getByText('Download Your Decal')).toBeInTheDocument();
    });
  });
});
