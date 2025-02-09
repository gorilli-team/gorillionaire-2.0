export const fetchFeedData = async () => {
    try {
      const response = await fetch(
        'https://gorillionaire-backend-f98ffccafae9.herokuapp.com/tweets'
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching feed data:', error);
      return null;
    }
};
  