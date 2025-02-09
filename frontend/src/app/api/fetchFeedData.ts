export const fetchFeedData = async () => {
    try {
      const response = await fetch(
        'https://gorillionaire-backend-f98ffccafae9.herokuapp.com/feed'
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      return {
        ...data,
        data: data.data.slice(0, 10)
      };
    } catch (error) {
      console.error('Error fetching feed data:', error);
      return null;
    }
};

export const fetchTweetsData = async () => {
    try {
      const response = await fetch(
        'https://gorillionaire-backend-f98ffccafae9.herokuapp.com/tweets'
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      return {
        ...data,
        data: data.data.slice(0, 10)
      };
    } catch (error) {
      console.error('Error fetching tweets data:', error);
      return null;
    }
};

export const fetchPricesData = async () => {
    try {
      const response = await fetch(
        'https://gorillionaire-backend-f98ffccafae9.herokuapp.com/prices'
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      return {
        ...data,
        data: data.data.slice(0, 10)
      };
    } catch (error) {
      console.error('Error fetching prices data:', error);
      return null;
    }
};