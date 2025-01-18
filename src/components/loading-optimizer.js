export const preloadExperts = () => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'fetch';
  link.href = '/api/experts';
  document.head.appendChild(link);
};

export const preloadImages = (experts) => {
  experts.forEach(expert => {
    if (expert?.personalInfo?.image) {
      const img = new Image();
      img.src = expert.personalInfo.image;
    }
  });
}; 