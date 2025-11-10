package com.example.islab1.util;

import com.example.islab1.DBApi.CitiesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class QueryBean {


    private final CitiesRepository citiesRepository;

    @Autowired
    public QueryBean(CitiesRepository citiesRepository) {
        this.citiesRepository = citiesRepository;
    }

    public long countCitiesAboveSeaLevel(double minMeters) {
        try {
            List<City> allCities = citiesRepository.findAll();
            long count = allCities.stream()
                    .filter(city -> city.getMetersAboveSeaLevel() > minMeters)
                    .count();

            return count;
        } catch (Exception e) {
            return -1;
        }
    }

    public List<City> getCitiesWithPopulationLessThan(long maxPopulation) {
        try {
            List<City> allCities = citiesRepository.findAll();
            List<City> filteredCities = allCities.stream()
                    .filter(city -> city.getPopulation() < maxPopulation)
                    .collect(Collectors.toList());

            return filteredCities;
        } catch (Exception e) {
            return null;
        }
    }

    public List<Integer> getUniqueTelephoneCodes() {
        try {
            List<City> allCities = citiesRepository.findAll();
            List<Integer> uniqueCodes = allCities.stream()
                    .map(City::getTelephoneCode)
                    .distinct()
                    .sorted()
                    .collect(Collectors.toList());

            return uniqueCodes;
        } catch (Exception e) {
            return null;
        }
    }

    public double calculateRouteDistance(Integer fromCityId, Integer toCityId) {
        try {
            Optional<City> fromCity = citiesRepository.findById(fromCityId);
            Optional<City> toCity = citiesRepository.findById(toCityId);
            if (fromCity.isPresent() && toCity.isPresent()) {
                return calculateDistance(fromCity, toCity);
            }else {
                return -1;
            }
        } catch (Exception e) {
            return -1;
        }
    }

    public double calculateMaxMinPopulationRoute() {
        try {
            List<City> allCities = citiesRepository.findAll();

            if (allCities.isEmpty()) {
                return -1;
            }

            Optional<City> maxPopulationCity = allCities.stream()
                    .max(Comparator.comparing(City::getPopulation));

            Optional<City> minPopulationCity = allCities.stream()
                    .min(Comparator.comparing(City::getPopulation));
            return calculateDistance(maxPopulationCity, minPopulationCity);
        } catch (Exception e) {
            return -1;
        }
    }
    private double calculateDistance(Optional<City> fromCity, Optional<City> toCity) {
        float x1 = fromCity.get().getCoordinates().getX();
        int y1 = fromCity.get().getCoordinates().getY();
        float x2 = toCity.get().getCoordinates().getX();
        int y2 = toCity.get().getCoordinates().getY();
        return Math.pow(Math.pow(x1-x2, 2)+Math.pow(y1*1.0+y2*1.0, 2), 0.5);
    }
}
