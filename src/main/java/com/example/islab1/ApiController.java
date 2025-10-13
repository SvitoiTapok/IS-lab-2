package com.example.islab1;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ApiController {

    @GetMapping("/hello")
    public String hello() {
        return "Hello mother fucker!";
    }

    @GetMapping("/test")
    public String test() {
        return "Test API is working!";
    }
}