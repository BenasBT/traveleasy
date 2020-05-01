package com.traveleasy.traveleasybackend.controllers;

import com.traveleasy.traveleasybackend.models.entities.CategoryEntity;
import com.traveleasy.traveleasybackend.repositories.CategoryRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@CrossOrigin
@RestController
@RequestMapping("/category")
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping
    @PreAuthorize("hasRole('ROLE_USER')")
    public List<CategoryEntity> getCategories() {
        return categoryRepository.findAllValid();

    }


}
