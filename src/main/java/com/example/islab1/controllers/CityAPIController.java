package com.example.islab1.controllers;

import com.example.islab1.DBApi.CitiesRepository;
import com.example.islab1.DBApi.CoordinatesRepository;
import com.example.islab1.util.City;
import com.example.islab1.util.Climate;
import com.example.islab1.util.Coordinates;
import com.example.islab1.util.Human;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class CityAPIController {
    @Autowired
    private CitiesRepository citiesRepository;
    @DeleteMapping



    @GetMapping("/getCities")
    public ResponseEntity<Page<City>> getCity(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "3") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortOrder,
            @RequestParam(defaultValue = "") String name,
            @RequestParam(defaultValue = "") String climate,
            @RequestParam(defaultValue = "") String human
    ) {
        try {
            System.out.println(name + "dfasdfasdfasdfas" + page + size + sortBy);
            Sort sort = sortOrder.equalsIgnoreCase("desc")
                    ? Sort.by(sortBy).descending()
                    : Sort.by(sortBy).ascending();
            Pageable pageable = PageRequest.of(page, size, sort);
            Specification<City> spec = buildSpecification(
                    name, climate, human
            );
            Page<City> cities = citiesRepository.findAll(spec, pageable);
            return ResponseEntity.ok(cities);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(400).body(null);
        }
    }

    @PostMapping("/addCity")
    public ResponseEntity<City> addCity(@RequestBody City city) {
        try {
            System.out.println(city);
            citiesRepository.save(city);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            System.out.println(city);
            return ResponseEntity.status(400).body(null);
        }
        return ResponseEntity.ok(city);
    }
    @PatchMapping("/updateCity/{id}")
    public ResponseEntity<City> updateCity(
            @PathVariable Integer id,
            @RequestBody City updatedCity) {
        try {

            City existingCity = citiesRepository.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException("City not found with id: " + id));

            // Обновляем только переданные поля
            if (updatedCity.getName() != null) {
                existingCity.setName(updatedCity.getName());
            }
            if (updatedCity.getCoordinates() != null) {
                existingCity.setCoordinates(updatedCity.getCoordinates());
            }
            if (updatedCity.getArea() != null) {
                existingCity.setArea(updatedCity.getArea());
            }
            if (updatedCity.getPopulation() != null) {
                existingCity.setPopulation(updatedCity.getPopulation());
            }
            if (updatedCity.getEstablishmentDate() != null) {
                existingCity.setEstablishmentDate(updatedCity.getEstablishmentDate());
            }
            if (updatedCity.getCapital() != null) {
                existingCity.setCapital(updatedCity.getCapital());
            }
            if (updatedCity.getMetersAboveSeaLevel() != 0) {
                existingCity.setMetersAboveSeaLevel(updatedCity.getMetersAboveSeaLevel());
            }
            if (updatedCity.getPopulationDensity() != null) {
                existingCity.setPopulationDensity(updatedCity.getPopulationDensity());
            }
            if (updatedCity.getTelephoneCode() != 0) {
                existingCity.setTelephoneCode(updatedCity.getTelephoneCode());
            }
            if (updatedCity.getClimate() != null) {
                existingCity.setClimate(updatedCity.getClimate());
            }
            if (updatedCity.getHuman() != null) {
                existingCity.setHuman(updatedCity.getHuman());
            }

            City savedCity = citiesRepository.save(existingCity);
            return ResponseEntity.ok(savedCity);

        } catch (Exception e) {
            return ResponseEntity.status(400).body(null);
        }
    }

    @DeleteMapping("/deleteCity/{id}")
    public ResponseEntity<?> deleteCity(@PathVariable Integer id) {
        try {
            if (!citiesRepository.existsById(id)) {
                return ResponseEntity.status(404).body("City not found with id: " + id);
            }
            citiesRepository.deleteById(id);
            return ResponseEntity.ok().body("City deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Error deleting city: " + e.getMessage());
        }
    }


    private Specification<City> buildSpecification(String nameFilter, String climateFilter, String governorFilter) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (nameFilter != null && !nameFilter.trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("name")),
                        "%" + nameFilter.toLowerCase() + "%"
                ));
            }

            if (climateFilter != null && !climateFilter.trim().isEmpty()) {
                try {
                    Climate climate = Climate.valueOf(climateFilter.toUpperCase());
                    predicates.add(criteriaBuilder.equal(root.get("climate"), climate));
                } catch (IllegalArgumentException e) {
                    // Игнорируем неверный climate
                }
            }

            if (governorFilter != null && !governorFilter.trim().isEmpty()) {
                var humanJoin = root.join("human");
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(humanJoin.get("name")),
                        "%" + governorFilter.toLowerCase() + "%"
                ));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
