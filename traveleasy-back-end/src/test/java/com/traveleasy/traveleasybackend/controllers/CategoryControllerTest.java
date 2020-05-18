package com.traveleasy.traveleasybackend.controllers;

import com.traveleasy.traveleasybackend.models.entities.CategoryEntity;
import com.traveleasy.traveleasybackend.repositories.CategoryRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.RequestPostProcessor;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import static org.junit.Assert.*;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringJUnit4ClassRunner.class)
public class CategoryControllerTest {

    @InjectMocks
    private CategoryController categoryController;

    @Mock
    CategoryRepository categoryRepository;

    private MockMvc mockMvc;

    @Before
    public void setUp() throws Exception {
        this.mockMvc = MockMvcBuilders.standaloneSetup(categoryController)
                .build();
    }


    @Test
    public void getAllCategories() throws Exception {
        CategoryEntity categoryEntity = new CategoryEntity();
        List<CategoryEntity> categoryEntities = new ArrayList<CategoryEntity>();
        categoryEntities.add(categoryEntity);
        when( categoryRepository.findAll()).thenReturn(categoryEntities);

        mockMvc.perform(get("/category/").with(new RequestPostProcessor() {
            @Override
            public MockHttpServletRequest postProcessRequest(MockHttpServletRequest request) {
                request.addUserRole("USER");
                return request;
            }
        }))
                .andExpect(status().isOk());
    }


    @Test
    public void approveCategy() throws Exception {

        CategoryEntity categoryEntity = new CategoryEntity();
        categoryEntity.setId((long)1);
        when( categoryRepository.findById((long) 1)).thenReturn(java.util.Optional.of(categoryEntity));

        mockMvc.perform(get("/category/approve/1").with(new RequestPostProcessor() {
            @Override
            public MockHttpServletRequest postProcessRequest(MockHttpServletRequest request) {
                request.addUserRole("ADMIN");
                return request;
            }
        }))
                .andExpect(status().isOk());
    }

    @Test
    public void deleteCategory() throws Exception {

        CategoryEntity categoryEntity = new CategoryEntity();
        categoryEntity.setId((long)1);
        when( categoryRepository.findById((long) 1)).thenReturn(java.util.Optional.of(categoryEntity));

        mockMvc.perform(delete("/category/1").with(new RequestPostProcessor() {
            @Override
            public MockHttpServletRequest postProcessRequest(MockHttpServletRequest request) {
                request.addUserRole("ADMIN");
                return request;
            }
        }))
                .andExpect(status().isOk());
    }



}