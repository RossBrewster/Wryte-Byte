import React from 'react';
import * as RadioGroup from '@radix-ui/react-radio-group';

interface Option {
  value: string;
  label: string;
}

interface StyledRadioGroupProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
}

const StyledRadioGroup: React.FC<StyledRadioGroupProps> = ({ options, value, onChange }) => {
  return (
    <RadioGroup.Root
      value={value}
      onValueChange={onChange}
      className="flex flex-col space-y-2"
    >
      {options.map((option) => (
        <RadioGroup.Item
          key={option.value}
          value={option.value}
          className="flex items-center"
        >
          <RadioGroup.Indicator className="w-4 h-4 mr-2 rounded-full bg-green-500" />
          <span className="text-sm">{option.label}</span>
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  );
};

export default StyledRadioGroup;