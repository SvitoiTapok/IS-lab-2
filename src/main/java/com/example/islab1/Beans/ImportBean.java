package com.example.islab1.Beans;

import com.example.islab1.DBApi.CitiesRepository;
import com.example.islab1.DBApi.CoordinatesRepository;
import com.example.islab1.DBApi.HumanRepository;
import com.example.islab1.DTO.DTOCity;
import com.example.islab1.util.City;
import com.example.islab1.util.Parser;
import com.example.islab1.util.StringComparator;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class ImportBean {
    private final CitiesRepository citiesRepository;
    private final CoordinatesRepository coordinatesRepository;
    private final HumanRepository humanRepository;
    private final Validator validator;

    @Autowired
    public ImportBean(CitiesRepository citiesRepository, HumanRepository humanRepository, CoordinatesRepository coordinatesRepository) {
        this.citiesRepository = citiesRepository;
        this.humanRepository = humanRepository;
        this.coordinatesRepository = coordinatesRepository;
        this.validator = Validation.buildDefaultValidatorFactory().getValidator();
    }

    public ResponseEntity<?> importFile(MultipartFile file) {
        String contentType = file.getContentType();
        String originalName = file.getOriginalFilename();

        List<Map<String, Object>> objects;
        try {
            if (originalName.endsWith(".json") ||
                    "application/json".equals(contentType)) {
                objects = Parser.parseJsonFile(file);

//            } else if (originalName.endsWith(".xml") ||
//                    "application/xml".equals(contentType)) {
//                cities = Parser.parseXmlFile(file);
//            } else if (originalName.endsWith(".csv") ||
//                    "text/csv".equals(contentType)) {
//                cities = Parser.parseCsvFile(file);
            } else {
                return ResponseEntity.badRequest()
                        .body("Неподдерживаемый формат файла");
            }
        } catch (NullPointerException e) {
            return ResponseEntity.badRequest()
                    .body("Неподдерживаемый формат файла");
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Невозможно получить массив объектов");
        }
        Parser.printListOfMaps(objects);
        try {
            List<DTOCity> cities = new ArrayList<>();
            String responseMessage = "";
            for (int i = 0; i < objects.size(); i++) {
                System.out.println(i);
                List<String> stringFieldNames = new ArrayList<>(List.of("name", "climate", "establishmentDate"));
                List<String> boolFieldNames = new ArrayList<>(List.of("capital"));
                List<String> numberFieldNames = new ArrayList<>(List.of("coordinatesID", "area", "population", "metersAboveSeaLevel", "telephoneCode", "humanID", "populationDensity"));
                //если не совпадает количество аргументов - джиджис
                if (objects.get(i).size() != 11)
                    throw new Exception("Несоответствующее количество полей в записи номер " + (i + 1));
                Map<String, Object> currentObj = objects.get(i);

                DTOCity currentCity = new DTOCity();
                for (String fieldName : currentObj.keySet()) {
                    System.out.println(fieldName);
                    List<String> source;
                    if (currentObj.get(fieldName) instanceof Number) source = numberFieldNames;
                    else if (currentObj.get(fieldName) instanceof String) source = stringFieldNames;
                    else if (currentObj.get(fieldName) instanceof Boolean) source = boolFieldNames;
                    else
                        throw new Exception("Неподдерживаемый формат значения поля " + fieldName + " в объекте под номером " + (i + 1));
                    if (source.isEmpty())
                        throw new Exception("Несоответствующее количество полей определенного типа в объекте с номерном " + (i + 1));
                    double value = -1;
                    String mostSimilar = null;
                    for (String field : source) {
                        double x = StringComparator.similarity(field, fieldName);
                        if (x > value) {
                            value = x;
                            mostSimilar = field;
                        }
                    }
                    System.out.println(mostSimilar);
                    if (value < 0.7)
                        throw new Exception("Не найдено совпадений для поля " + fieldName + "в объекте под номером " + (i + 1));
                    currentCity.setFieldByName(mostSimilar, currentObj.get(fieldName));
                    if (value != 1) {
                        responseMessage = responseMessage + "В записи номер " + (i+1) + "название поля " + fieldName + "воспринято как " + mostSimilar + ".\n";
                    }
                    System.out.println(value);
                    source.remove(mostSimilar);
                    System.out.println("wrf");
                }
                Set<ConstraintViolation<DTOCity>> violations = validator.validate(currentCity);
                if (!violations.isEmpty()) {
                    String errorMessage = violations.stream()
                            .map(v -> v.getPropertyPath() + ": " + v.getMessage())
                            .collect(Collectors.joining(", "));
                    throw new IllegalArgumentException("Ошибка валидации: " + errorMessage);
                }
                currentCity.setHuman(humanRepository.findById(currentCity.getHumanID()).orElseThrow(() -> new IllegalArgumentException("Город с ID " + currentCity.getHumanID() + " не найден")));
                currentCity.setCoordinates(coordinatesRepository.findById(currentCity.getHumanID()).orElseThrow(() -> new IllegalArgumentException("Координаты с ID " + currentCity.getHumanID() + " не найден")));
                cities.add(currentCity);
            }
            Parser.printListOfMaps(objects);
            cities.stream().map(DTOCity::toCity).forEach(citiesRepository::save);
            return ResponseEntity.ok("Успешно добавлено ");
        } catch (IllegalArgumentException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Климат не предусмотрен системой");
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Ошибка обработки файла: " + e.getMessage());
        }
    }
}
