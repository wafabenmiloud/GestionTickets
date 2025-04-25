import React from 'react';

export default function Home() {
  const role = localStorage.getItem('role');
  return (
    <div>
      <h1>Bienvenue sur la plateforme de support</h1>
      <p>Connecté en tant que : <strong>{role}</strong></p>
    </div>
  );
}