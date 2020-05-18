package com.traveleasy.traveleasybackend.controllers;

import com.traveleasy.traveleasybackend.models.AuthProvider;
import com.traveleasy.traveleasybackend.models.entities.UserEntity;
import com.traveleasy.traveleasybackend.repositories.UserRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.request.RequestPostProcessor;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.junit.Assert.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@RunWith(SpringJUnit4ClassRunner.class)
public class UserControllerTest {

    @InjectMocks
    private UserController userController;

    @Mock
    UserRepository userRepository;

    private MockMvc mockMvc;

    @Before
    public void setUp() throws Exception {
        this.mockMvc = MockMvcBuilders.standaloneSetup(userController)
                .build();
    }

    @Test
    public void getCurrentUser() throws Exception {
        UserEntity user = new UserEntity();
        user.setEmail("test");
        user.setProvider(AuthProvider.local);
        user.setName("test");
        user.setPassword("test");
        user.setId((long) 1);

        when( userRepository.findById((long)1)).thenReturn(java.util.Optional.of(user));

        mockMvc.perform(get("/user/me").with(new RequestPostProcessor() {
                    @Override
                    public MockHttpServletRequest postProcessRequest(MockHttpServletRequest request) {
                        request.setParameter("id","1");
                        request.addUserRole("USER");
                        return request;
                    }
                })
        )
                .andExpect(status().isOk());
    }


    @Test
    public void getUser() throws Exception {
        UserEntity user = new UserEntity();
        user.setEmail("test");
        user.setProvider(AuthProvider.local);
        user.setName("test");
        user.setPassword("test");
        user.setId((long) 1);

        when( userRepository.findById((long)1)).thenReturn(java.util.Optional.of(user));

        mockMvc.perform(get("/user/1"))
                .andExpect(status().isOk());

    }

}