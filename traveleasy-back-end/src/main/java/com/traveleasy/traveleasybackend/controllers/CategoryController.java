package com.traveleasy.traveleasybackend.controllers;

import com.traveleasy.traveleasybackend.models.entities.CategoryEntity;
import com.traveleasy.traveleasybackend.repositories.CategoryRepository;
import com.traveleasy.traveleasybackend.repositories.ServiceRepository;
import com.traveleasy.traveleasybackend.security.CurrentUser;
import com.traveleasy.traveleasybackend.security.UserPrincipal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@CrossOrigin
@RestController
@RequestMapping("/category")
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @GetMapping
    @PreAuthorize("hasRole('ROLE_USER')")
    public List<CategoryEntity> getAllCategories() {
        return categoryRepository.findAll();

    }

    @GetMapping("/t")
    @PreAuthorize("hasRole('ROLE_USER')")
    public String t(@CurrentUser UserPrincipal userPrincipal) {
        return userPrincipal.getId().toString();

    }

    @GetMapping("/approve/{id}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<?> approveCategy(@PathVariable("id") long id) {

        CategoryEntity categoryEntity = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        categoryEntity.setValid(true);

        categoryRepository.save(categoryEntity);

        return new ResponseEntity("Ok", HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<?> deleteCategory(@PathVariable("id") long id) {

        CategoryEntity categoryEntity = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("category not found"));


        categoryRepository.delete(
                categoryEntity
        );

        return new ResponseEntity("Ok", HttpStatus.OK);

    }

}
