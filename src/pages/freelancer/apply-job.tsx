const handlePublish = (data: any) => {
  // Safely trim string fields by providing a fallback
  const title = (data.title || '').trim();
  const description = (data.description || '').trim();
  // ...existing processing logic...
  // e.g., publish job using title and description
};
