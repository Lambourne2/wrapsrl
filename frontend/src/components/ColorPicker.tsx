import React from 'react';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="color"
        value={color}
        onChange={handleChange}
        className="w-10 h-10 rounded cursor-pointer"
      />
      <span className="text-sm font-mono">{color.toUpperCase()}</span>
    </div>
  );
};

export default ColorPicker;
