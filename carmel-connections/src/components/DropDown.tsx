import React, { useState, ReactElement } from 'react';

interface DropdownParentProps {
  title: string;
  children: ReactElement; // Children should be a ReactElement for cloneElement
  childComponentProps: any; // Type for the props passed to the child
}
const DropdownParent: React.FC<DropdownParentProps> = ({ title, children, childComponentProps }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false); // Explicitly type useState

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Clone the child component and pass the props
  // Ensure the type of 'children' is compatible with the props being passed
  const childWithProps = React.cloneElement<any>(children, childComponentProps);

  return (
    <div style={{ marginBottom: '10px' }}>
      <button onClick={toggleDropdown}>
        {isOpen ? 'Hide' : 'Show'} {title}
      </button>

      {isOpen && (
        <div style={{  }}>
          {childWithProps}
        </div>
      )}
    </div>
  );
};

export default DropdownParent