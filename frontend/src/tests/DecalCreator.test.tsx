import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DecalCreator from '../components/DecalCreator';

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

describe('DecalCreator Component', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component correctly', () => {
    render(
      <BrowserRouter>
        <DecalCreator onSubmit={mockOnSubmit} />
      </BrowserRouter>
    );

    // Check that the main elements are rendered
    expect(screen.getByText('Create Your Decal')).toBeInTheDocument();
    expect(screen.getByText('Preview')).toBeInTheDocument();
    expect(screen.getByLabelText('Describe your decal')).toBeInTheDocument();
    expect(screen.getByText('Choose your colors (max 5)')).toBeInTheDocument();
    expect(screen.getByText('Generate Decal')).toBeInTheDocument();
    
    // Check that the 3D preview is rendered
    expect(screen.getByTestId('canvas')).toBeInTheDocument();
    expect(screen.getByTestId('octane-model')).toBeInTheDocument();
  });

  it('allows entering a prompt and selecting colors', () => {
    render(
      <BrowserRouter>
        <DecalCreator onSubmit={mockOnSubmit} />
      </BrowserRouter>
    );

    // Enter a prompt
    const promptInput = screen.getByLabelText('Describe your decal');
    fireEvent.change(promptInput, { target: { value: 'flaming cybernetic wolf' } });
    
    // Check that the prompt was updated
    expect(promptInput).toHaveValue('flaming cybernetic wolf');
    
    // Check that the color pickers are rendered (default 3 colors)
    const colorPickers = document.querySelectorAll('input[type="color"]');
    expect(colorPickers.length).toBe(3);
  });

  it('allows adding and removing colors', () => {
    render(
      <BrowserRouter>
        <DecalCreator onSubmit={mockOnSubmit} />
      </BrowserRouter>
    );

    // Initially there should be 3 colors
    let colorPickers = document.querySelectorAll('input[type="color"]');
    expect(colorPickers.length).toBe(3);
    
    // Add a color
    fireEvent.click(screen.getByText('+ Add another color'));
    
    // Now there should be 4 colors
    colorPickers = document.querySelectorAll('input[type="color"]');
    expect(colorPickers.length).toBe(4);
    
    // Remove a color
    const removeButtons = screen.getAllByText('Remove');
    fireEvent.click(removeButtons[0]);
    
    // Now there should be 3 colors again
    colorPickers = document.querySelectorAll('input[type="color"]');
    expect(colorPickers.length).toBe(3);
  });

  it('submits the form with prompt and colors', async () => {
    render(
      <BrowserRouter>
        <DecalCreator onSubmit={mockOnSubmit} />
      </BrowserRouter>
    );

    // Enter a prompt
    const promptInput = screen.getByLabelText('Describe your decal');
    fireEvent.change(promptInput, { target: { value: 'flaming cybernetic wolf' } });
    
    // Submit the form
    const submitButton = screen.getByText('Generate Decal');
    fireEvent.click(submitButton);
    
    // Check that onSubmit was called with the correct data
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).toHaveBeenCalledWith({
      prompt: 'flaming cybernetic wolf',
      colors: ['#FF0000', '#000000', '#FFFFFF'], // Default colors
    });
    
    // Wait for the generation to complete (simulated)
    await waitFor(() => {
      expect(screen.getByText('Download Decal Package')).toBeInTheDocument();
    });
  });

  it('disables the submit button when prompt is empty', () => {
    render(
      <BrowserRouter>
        <DecalCreator onSubmit={mockOnSubmit} />
      </BrowserRouter>
    );

    // The submit button should be disabled initially (empty prompt)
    const submitButton = screen.getByText('Generate Decal');
    expect(submitButton).toBeDisabled();
    
    // Enter a prompt
    const promptInput = screen.getByLabelText('Describe your decal');
    fireEvent.change(promptInput, { target: { value: 'flaming cybernetic wolf' } });
    
    // Now the button should be enabled
    expect(submitButton).not.toBeDisabled();
    
    // Clear the prompt
    fireEvent.change(promptInput, { target: { value: '' } });
    
    // The button should be disabled again
    expect(submitButton).toBeDisabled();
  });
});
