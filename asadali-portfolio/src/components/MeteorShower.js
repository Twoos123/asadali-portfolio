import React, { useEffect, useRef } from 'react';
import '../styles/MeteorShower.css';

const MeteorShower = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let meteors = [];
    let animationFrameId;

    const createMeteor = () => {
      const size = Math.random() * 2 + 1;
      meteors.push({
        x: Math.random() * canvas.width,
        y: -10,
        size,
        speed: Math.random() * 2 + 3,
        length: size * 15,
      });
    };

    const drawMeteor = (meteor) => {
      ctx.beginPath();
      ctx.moveTo(meteor.x, meteor.y);
      ctx.lineTo(meteor.x - meteor.length, meteor.y + meteor.length);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = meteor.size;
      ctx.stroke();
    };

    const updateMeteor = (meteor) => {
      meteor.x -= meteor.speed;
      meteor.y += meteor.speed;
      return meteor.y < canvas.height && meteor.x > 0;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      meteors = meteors.filter(updateMeteor);
      meteors.forEach(drawMeteor);

      if (Math.random() < 0.1) createMeteor();

      animationFrameId = requestAnimationFrame(animate);
    };

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="meteor-shower" />;
};

export default MeteorShower;
