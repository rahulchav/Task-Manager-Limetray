import React from 'react';
import { IconCheck } from '@tabler/icons-react';

interface CustomCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ checked, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <label className="inline-flex items-center gap-2 cursor-pointer relative select-none">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          className="
            appearance-none w-5 h-5 rounded border-2 border-gray-400 
            checked:bg-app-color checked:border-app-color
            flex items-center justify-center 
            relative cursor-pointer
          "
        />
        {checked && (
          <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <IconCheck size={16} className="text-white" stroke={3} />
          </span>
        )}
      </div>
    </label>
  );
};

export default CustomCheckbox;
