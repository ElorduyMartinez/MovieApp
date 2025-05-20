export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'short' }).toLowerCase();
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

// Comprobar si una fecha es en el futuro
export const isFutureDate = (dateString: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Resetear las horas para comparar solo fechas
  
  const date = new Date(dateString);
  date.setHours(0, 0, 0, 0);
  
  return date >= today;
};