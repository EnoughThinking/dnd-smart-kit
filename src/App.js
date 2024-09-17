import React, { useState } from 'react';
import { DndContext, useDraggable } from '@dnd-kit/core';
import axios from 'axios';

const Draggable = ({ id, x, y, name, onNameChange }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const style = {
    position: 'absolute',
    top: y,
    left: x,
    transform: `translate3d(${transform?.x}px, ${transform?.y}px, 0)`,
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <span>📍</span>
      <input
        type="text"
        value={name}
        onChange={(e) => onNameChange(id, e.target.value)}
        placeholder="Enter point name"
      />
    </div>
  );
};

const ImageWithPoints = () => {
  const [points, setPoints] = useState([]);

  const addPoint = (event) => {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setPoints([...points, { id: points.length, x, y, name: '' }]);
  };

  const handleNameChange = (id, newName) => {
    setPoints((prevPoints) =>
      prevPoints.map((point) =>
        point.id === id ? { ...point, name: newName } : point
      )
    );
  };

  const savePoints = async () => {
    try {
      console.log('Saving points:', points);
      const response = await axios.post('http://localhost:5000/save-points', points, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Points saved:', response.data);
    } catch (error) {
      console.error('Error saving points:', error);
    }
  };

  return (
    <div>
      <div
        style={{ position: 'relative', width: '500px', height: '300px', border: '1px solid black' }}
        onClick={addPoint}
      >
        <img
          src={`${process.env.PUBLIC_URL}/plan.jpg`}
          alt="Map"
          style={{ width: '100%', height: '100%' }}
        />
        <DndContext>
          {points.map((point) => (
            <Draggable
              key={point.id}
              id={point.id}
              x={point.x}
              y={point.y}
              name={point.name}
              onNameChange={handleNameChange}
            />
          ))}
        </DndContext>
      </div>
      <button onClick={savePoints}>Save Points</button>
    </div>
  );
};

const App = () => {
  return (
    <div>
      <h1>Identify Points on Image</h1>
      <ImageWithPoints />
    </div>
  );
};

export default App;
