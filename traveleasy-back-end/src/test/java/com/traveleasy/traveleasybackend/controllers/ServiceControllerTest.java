package com.traveleasy.traveleasybackend.controllers;

import com.traveleasy.traveleasybackend.models.PriceTypes;
import com.traveleasy.traveleasybackend.models.entities.*;
import com.traveleasy.traveleasybackend.repositories.*;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.RequestPostProcessor;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringJUnit4ClassRunner.class)
public class ServiceControllerTest {

    @InjectMocks
    private ServiceController serviceController;

    private MockMvc mockMvc;

    @Before
    public void setUp() throws Exception {
        this.mockMvc = MockMvcBuilders.standaloneSetup(serviceController)
                .build();
    }

    @Mock
    private ServiceRepository serviceRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PriceTypeRepository priceTypeRepository;

    @Mock
    private MarkedRepository markedRepository;


    @Test
    public void getServices() throws Exception {
        List<ServiceEntity> serviceEntities = new ArrayList<ServiceEntity>();

        UserEntity userEntity = new UserEntity();
        userEntity.setId((long)1);

        ServiceEntity serviceEntity = new ServiceEntity();
        serviceEntity.setUser(userEntity);

        serviceEntities.add(serviceEntity);

        when( serviceRepository.findAll() ).thenReturn(serviceEntities);
        when( userRepository.findById((long) 1)).thenReturn(java.util.Optional.of(userEntity));

        mockMvc.perform(get("/service/").with(new RequestPostProcessor() {
            @Override
            public MockHttpServletRequest postProcessRequest(MockHttpServletRequest request) {
                request.setParameter("id","1");
                request.addUserRole("USER");
                return request;
            }
        }))
                .andExpect(status().isOk());
    }

    @Test
    public void getPrices() throws Exception {
        List<PriceTypeEntity> priceTypeEntities = new ArrayList<PriceTypeEntity>();

        UserEntity userEntity = new UserEntity();
        userEntity.setId((long)1);

        PriceTypeEntity priceTypeEntity = new PriceTypeEntity();
        priceTypeEntity.setName(PriceTypes.DAY);

        priceTypeEntities.add(priceTypeEntity);

        when( priceTypeRepository.findAll() ).thenReturn(priceTypeEntities);
        when( userRepository.findById((long) 1)).thenReturn(java.util.Optional.of(userEntity));

        mockMvc.perform(get("/service/prices").with(new RequestPostProcessor() {
            @Override
            public MockHttpServletRequest postProcessRequest(MockHttpServletRequest request) {
                request.setParameter("id","1");
                request.addUserRole("USER");
                return request;
            }
        }))
                .andExpect(status().isOk());
    }


    @Test
    public void getUserServices() throws Exception {
        List<ServiceEntity> serviceEntities = new ArrayList<ServiceEntity>();

        UserEntity userEntity = new UserEntity();
        userEntity.setId((long)1);

        ServiceEntity serviceEntity = new ServiceEntity();
        serviceEntity.setUser(userEntity);

        serviceEntities.add(serviceEntity);

        when( serviceRepository.findAllByUser(userEntity) ).thenReturn(serviceEntities);
        when( userRepository.findById((long) 1)).thenReturn(java.util.Optional.of(userEntity));

        mockMvc.perform(get("/service/user/1").with(new RequestPostProcessor() {
            @Override
            public MockHttpServletRequest postProcessRequest(MockHttpServletRequest request) {
                request.setParameter("id","1");
                request.addUserRole("USER");
                return request;
            }
        }))
                .andExpect(status().isOk());
    }

    @Test
    public void getMyServices() throws Exception {
        List<ServiceEntity> serviceEntities = new ArrayList<ServiceEntity>();

        UserEntity userEntity = new UserEntity();
        userEntity.setId((long)1);

        ServiceEntity serviceEntity = new ServiceEntity();
        serviceEntity.setUser(userEntity);

        serviceEntities.add(serviceEntity);

        when( serviceRepository.findAllByUser(userEntity) ).thenReturn(serviceEntities);
        when( serviceRepository.findById((long) 1)).thenReturn(java.util.Optional.of(serviceEntity));

        mockMvc.perform(get("/service/1").with(new RequestPostProcessor() {
            @Override
            public MockHttpServletRequest postProcessRequest(MockHttpServletRequest request) {
                request.setParameter("id","1");
                request.addUserRole("USER");
                return request;
            }
        }))
                .andExpect(status().isOk());
    }

    @Test
    public void markService() throws Exception {
        UserEntity userEntity = new UserEntity();
        userEntity.setId((long)1);
        ServiceEntity serviceEntity = new ServiceEntity();
        serviceEntity.setUser(userEntity);
        serviceEntity.setId((long)1);

        List<MarkedSericeEntity> markedSericeEntities = new ArrayList<>();
        MarkedSericeEntity markedSericeEntity = new MarkedSericeEntity();
        markedSericeEntity.setUser(userEntity);
        markedSericeEntity.setService(serviceEntity);

        markedSericeEntities.add(markedSericeEntity);

        ServiceEntity serviceEntity1 = new ServiceEntity();
        serviceEntity.setId((long)2);


        when( userRepository.findById((long) 1)).thenReturn(java.util.Optional.of(userEntity));
        when( markedRepository.findAllByUser((long)1)).thenReturn(markedSericeEntities);
        when( serviceRepository.findById((long) 1)).thenReturn(java.util.Optional.of(serviceEntity));

        when( serviceRepository.findById((long) 2)).thenReturn(java.util.Optional.of(serviceEntity1));


        mockMvc.perform(get("/service/mark/1").with(new RequestPostProcessor() {
            @Override
            public MockHttpServletRequest postProcessRequest(MockHttpServletRequest request) {
                request.setParameter("id","1");
                request.addUserRole("USER");
                return request;
            }
        }))
                .andExpect(status().isOk());

        mockMvc.perform(get("/service/mark/2").with(new RequestPostProcessor() {
            @Override
            public MockHttpServletRequest postProcessRequest(MockHttpServletRequest request) {
                request.setParameter("id","1");
                request.addUserRole("USER");
                return request;
            }
        }))
                .andExpect(status().is(208));
    }

    @Test
    public void unmarkService() throws Exception {

        UserEntity userEntity = new UserEntity();
        userEntity.setId((long)1);
        ServiceEntity serviceEntity = new ServiceEntity();
        serviceEntity.setUser(userEntity);
        serviceEntity.setId((long)1);
        MarkedSericeEntity markedSericeEntity = new MarkedSericeEntity();
        markedSericeEntity.setUser(userEntity);
        markedSericeEntity.setService(serviceEntity);

        when( markedRepository.findAllByUserAndService((long)1,(long)1)).thenReturn(java.util.Optional.of(markedSericeEntity));

        mockMvc.perform(get("/service/unmark/1").with(new RequestPostProcessor() {
            @Override
            public MockHttpServletRequest postProcessRequest(MockHttpServletRequest request) {
                request.setParameter("id","1");
                request.addUserRole("USER");
                return request;
            }
        }))
                .andExpect(status().isOk());
    }

    @Test
    public void aproveService() throws Exception {
        List<ServiceEntity> serviceEntities = new ArrayList<ServiceEntity>();

        UserEntity userEntity = new UserEntity();
        userEntity.setId((long)1);

        ServiceEntity serviceEntity = new ServiceEntity();
        serviceEntity.setUser(userEntity);

        serviceEntities.add(serviceEntity);

        when( serviceRepository.findById((long) 1) ).thenReturn(java.util.Optional.of(serviceEntity));

        mockMvc.perform(get("/service/approve/1").with(new RequestPostProcessor() {
            @Override
            public MockHttpServletRequest postProcessRequest(MockHttpServletRequest request) {
                request.setParameter("id","1");
                request.addUserRole("USER");
                return request;
            }
        }))
                .andExpect(status().isOk());
    }

    @Test
    public void denyService() throws Exception {

        List<ServiceEntity> serviceEntities = new ArrayList<ServiceEntity>();

        UserEntity userEntity = new UserEntity();
        userEntity.setId((long)1);

        ServiceEntity serviceEntity = new ServiceEntity();
        serviceEntity.setUser(userEntity);

        serviceEntities.add(serviceEntity);

        when( serviceRepository.findById((long) 1) ).thenReturn(java.util.Optional.of(serviceEntity));

        mockMvc.perform(get("/service/deny/1").with(new RequestPostProcessor() {
            @Override
            public MockHttpServletRequest postProcessRequest(MockHttpServletRequest request) {
                request.setParameter("id","1");
                request.addUserRole("USER");
                return request;
            }
        }))
                .andExpect(status().isOk());
    }

    @Test
    public void getMarked() throws Exception {
        List<MarkedSericeEntity>  markedSericeEntities = new ArrayList<>();

        UserEntity userEntity = new UserEntity();
        userEntity.setId((long)1);
        ServiceEntity serviceEntity = new ServiceEntity();
        serviceEntity.setUser(userEntity);
        serviceEntity.setId((long)1);
        MarkedSericeEntity markedSericeEntity = new MarkedSericeEntity();
        markedSericeEntity.setUser(userEntity);
        markedSericeEntity.setService(serviceEntity);

        markedSericeEntities.add(markedSericeEntity);

        when( markedRepository.findAllByUser((long)1)).thenReturn(markedSericeEntities);

        mockMvc.perform(get("/service/marked").with(new RequestPostProcessor() {
            @Override
            public MockHttpServletRequest postProcessRequest(MockHttpServletRequest request) {
                request.setParameter("id","1");
                request.addUserRole("USER");
                return request;
            }
        }))
                .andExpect(status().isOk());
    }

    @Test
    public void deleteService() throws Exception {
        List<ServiceEntity> serviceEntities = new ArrayList<ServiceEntity>();

        UserEntity userEntity = new UserEntity();
        userEntity.setId((long)1);

        ServiceEntity serviceEntity = new ServiceEntity();
        serviceEntity.setUser(userEntity);

        serviceEntities.add(serviceEntity);

        when( serviceRepository.findAllByUser(userEntity) ).thenReturn(serviceEntities);
        when( serviceRepository.findById((long) 1)).thenReturn(java.util.Optional.of(serviceEntity));

        mockMvc.perform(delete("/service/1").with(new RequestPostProcessor() {
            @Override
            public MockHttpServletRequest postProcessRequest(MockHttpServletRequest request) {
                request.setParameter("id","1");
                request.addUserRole("USER");
                return request;
            }
        }))
                .andExpect(status().isOk());
    }
}