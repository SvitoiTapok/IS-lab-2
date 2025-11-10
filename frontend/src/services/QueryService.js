
const API_BASE_URL = 'http://localhost:8080/api';

const queryService = {
    countCitiesAboveSeaLevel: async (meters) => {
        try {
            const response = await fetch(`${API_BASE_URL}/countAboveSeaLevel?meters=${meters}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error counting cities above sea level:', error);
            throw error;
        }
    },

    getCitiesWithPopulationLessThan: async (population) => {
        try {
            const response = await fetch(`${API_BASE_URL}/citiesWithPopulationLessThan?population=${population}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error getting cities with population less than:', error);
            throw error;
        }
    },

    getUniqueTelephoneCodes: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/uniqueTelephoneCodes`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error getting unique telephone codes:', error);
            throw error;
        }
    },

    calculateRoute: async (fromCityId, toCityId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/calculateRoute`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fromCityId: fromCityId,
                    toCityId: toCityId
                })
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error calculating route:', error);
            throw error;
        }
    },

    calculateMaxMinPopulationRoute: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/maxMinPopulationRoute`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error calculating max-min population route:', error);
            throw error;
        }
    },

};

export default queryService;