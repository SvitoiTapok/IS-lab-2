const API_BASE_URL = 'http://localhost:8080/api';

const cityService = {
    getAllCities: async (page, size, sortBy, sortOrder, nameFilter, climateFilter, humanFilter) => {
        try {
            const response = await fetch(`${API_BASE_URL}/getCities?page=${page}&size=${size}&sortBy=${sortBy}&sortOrder=${sortOrder}&name=${nameFilter}&climate=${climateFilter}&human=${humanFilter}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching cities:', error);
            throw error;
        }
    },
    addCity: async (cityData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/addCity`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cityData)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching humans:', error);
            throw error;
        }
    },
    patchCity: async (cityId, cityData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/updateCity/${cityId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cityData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error updating city:', error);
            throw error;
        }
    },
    deleteCity: async (cityId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/deleteCity/${cityId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return 0;
        } catch (error) {
            console.error('Error updating city:', error);
            throw error;
        }
    },

    importCity: async (formData) => {
        const response = await fetch('http://localhost:8080/api/importCity', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            return await response.text();
        } else {
            throw new Error(await response.text())
        }

    }


};

export default cityService;