const handlePublish = async (eventData) => {
  try {
    const response = await fetch('http://localhost:5000/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    });
    
    if (response.ok) {
      alert("Event Published Successfully!");
      // Refresh list or redirect
    }
  } catch (error) {
    console.error("Error creating event:", error);
  }
};