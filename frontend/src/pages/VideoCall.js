import React from 'react';

export default function VideoCall() {
  // Use the provided Daily room URL
  const roomUrl = "https://docvitav.daily.co/0W2nAlfgnvwsu70JINwJ";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-green-100 px-2">
      <iframe
        title="Video Call"
        src={roomUrl}
        allow="camera; microphone; fullscreen; display-capture"
        className="w-full max-w-xs aspect-video rounded-xl shadow-lg"
        style={{ minHeight: 320, border: 0 }}
      />
      <div className="mt-6 text-center text-blue-900 font-semibold">
        Hi, I'm your AI therapist. I'm here to listen and help you.
      </div>
    </div>
  );
} 