import React from 'react';
import Button from './Button';

// Example usage of the Button component
export const ButtonExamples: React.FC = () => {
  const handleClick = () => {
    console.log('Button clicked!');
  };

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <h3>Button Component Examples</h3>

      {/* Default button */}
      <Button onClick={handleClick}>
        Default Button
      </Button>

      {/* Primary button */}
      <Button variant="primary" onClick={handleClick}>
        Primary Button
      </Button>

      {/* Secondary button */}
      <Button variant="secondary" onClick={handleClick}>
        Secondary Button
      </Button>

      {/* Danger button */}
      <Button variant="danger" onClick={handleClick}>
        Danger Button
      </Button>

      {/* Ghost button */}
      <Button variant="ghost" onClick={handleClick}>
        Ghost Button
      </Button>

      {/* Different sizes */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <Button size="small" onClick={handleClick}>
          Small
        </Button>
        <Button size="medium" onClick={handleClick}>
          Medium
        </Button>
        <Button size="large" onClick={handleClick}>
          Large
        </Button>
      </div>

      {/* Disabled button */}
      <Button disabled onClick={handleClick}>
        Disabled Button
      </Button>
    </div>
  );
};