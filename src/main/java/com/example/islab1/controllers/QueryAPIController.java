package com.example.islab1.controllers;

import com.example.islab1.util.City;
import com.example.islab1.util.QueryBean;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;


@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class QueryAPIController {

    private QueryBean queryBean;
    @Autowired
    public QueryAPIController(QueryBean queryBean) {
        this.queryBean = queryBean;
    }

    @GetMapping("/countAboveSeaLevel")
    public ResponseEntity<Long> countCitiesAboveSeaLevel(@RequestParam double meters) {
        try {
            Long count = queryBean.countCitiesAboveSeaLevel(meters);
            return ResponseEntity.ok(count);
        }
        catch (Exception e) {
            return ResponseEntity.status(400).body(null);
        }
    }
    @GetMapping("/citiesWithPopulationLessThan")
    public ResponseEntity<List<City>> getCitiesWithPopulationLessThan(@RequestParam long population) {
        try {
            List<City> list = queryBean.getCitiesWithPopulationLessThan(population);
            return ResponseEntity.ok(list);
        }
        catch (Exception e) {
            return ResponseEntity.status(400).body(null);
        }
    }

    @GetMapping("/uniqueTelephoneCodes")
    public ResponseEntity<List<Integer>> getUniqueTelephoneCodes() {
        try {
            List<Integer> list = queryBean.getUniqueTelephoneCodes();
            return ResponseEntity.ok(list);
        }
        catch (Exception e) {
            return ResponseEntity.status(400).body(null);
        }
    }

    @Data
    private class RouteRequest{
        @NotNull
        private Integer fromCityId;

        @NotNull
        private Integer toCityId;
    }

    @PostMapping("/calculateRoute")
    public ResponseEntity<Double> calculateRoute(@RequestBody RouteRequest request) {
        try {
            double dist = queryBean.calculateRouteDistance(request.getFromCityId(), request.getToCityId());
            return ResponseEntity.ok(dist);
        }
        catch (Exception e) {
            return ResponseEntity.status(400).body(null);
        }
    }

    @GetMapping("/maxMinPopulationRoute")
    public ResponseEntity<Double> calculateMaxMinPopulationRoute() {
        try {
            double dist = queryBean.calculateMaxMinPopulationRoute();
            return ResponseEntity.ok(dist);
        }
        catch (Exception e) {
            return ResponseEntity.status(400).body(null);
        }
    }


}
