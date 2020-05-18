package com.traveleasy.traveleasybackend.controllers;

import com.traveleasy.traveleasybackend.models.PriceTypes;
import com.traveleasy.traveleasybackend.models.entities.EventEntity;
import com.traveleasy.traveleasybackend.models.entities.PurchaseEntity;
import com.traveleasy.traveleasybackend.models.entities.ServiceEntity;
import com.traveleasy.traveleasybackend.models.entities.UserEntity;
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

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringJUnit4ClassRunner.class)
public class SchedulerControllerTest {

    @InjectMocks
    private SchedulerController schedulerController;

    private MockMvc mockMvc;

    @Before
    public void setUp() throws Exception {
        this.mockMvc = MockMvcBuilders.standaloneSetup(schedulerController)
                .build();
    }

    @Mock
    EventRepository eventRepository;

    @Mock
    UserRepository userRepository;

    @Mock
    ServiceRepository serviceRepository;

    DateFormat timeFormat = new SimpleDateFormat("HH:mm");
    DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

    @Test
    public void getMyEvents() throws Exception {
        List<EventEntity>  eventEntities = new ArrayList<EventEntity>();

        UserEntity userEntity = new UserEntity();
        userEntity.setId((long)1);

        EventEntity eventEntity = new EventEntity();
        eventEntity.setUser(userEntity);

        eventEntities.add(eventEntity);

        when( eventRepository.findAllByUser((userEntity) )).thenReturn(eventEntities);
        when( userRepository.findById((long) 1)).thenReturn(java.util.Optional.of(userEntity));

        mockMvc.perform(get("/scheduler/").with(new RequestPostProcessor() {
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
    public void getMyEventss() throws Exception {

        List<EventEntity>  eventEntities = new ArrayList<EventEntity>();

        UserEntity userEntity = new UserEntity();
        userEntity.setId((long)1);

        EventEntity eventEntity = new EventEntity();
        eventEntity.setUser(userEntity);
        eventEntity.setId((long) 1);

        eventEntities.add(eventEntity);

        when( eventRepository.findById((long) 1)).thenReturn(java.util.Optional.of(eventEntity));

        mockMvc.perform(get("/scheduler/1").with(new RequestPostProcessor() {
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
    public void getMyServicesEvents() throws Exception {
        List<EventEntity>  eventEntities = new ArrayList<EventEntity>();

        UserEntity userEntity = new UserEntity();
        userEntity.setId((long)1);

        EventEntity eventEntity = new EventEntity();
        eventEntity.setUser(userEntity);
        eventEntity.setId((long) 1);

        eventEntities.add(eventEntity);

        when( eventRepository.findAllByProvider(userEntity)).thenReturn(eventEntities);
        when( userRepository.findById((long) 1)).thenReturn(java.util.Optional.of(userEntity));

        mockMvc.perform(get("/scheduler/myEvents").with(new RequestPostProcessor() {
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
    public void addServiceEvent() throws Exception {
        List<EventEntity>  eventEntities = new ArrayList<EventEntity>();

        UserEntity userEntity = new UserEntity();
        userEntity.setId((long)1);

        EventEntity eventEntity = new EventEntity();
        eventEntity.setUser(userEntity);
        eventEntity.setId((long) 1);
        eventEntity.setPrice_counter(1);

        ServiceEntity serviceEntity = new ServiceEntity();
        serviceEntity.setId((long) 1);
        serviceEntity.setUser(userEntity);
        serviceEntity.setPrice_type(PriceTypes.UNIT);

        eventEntity.setService(serviceEntity);

        eventEntities.add(eventEntity);

        when( eventRepository.findAllByProvider(userEntity)).thenReturn(eventEntities);
        when( serviceRepository.findById((long) 1)).thenReturn(java.util.Optional.of(serviceEntity));
        when( userRepository.findById((long) 1)).thenReturn(java.util.Optional.of(userEntity));

        String request = "{\n" +
                "  \"service\": {\n" +
                "    \"id\": 1,\n" +
                "    \"user\": {\n" +
                "      \"id\": 1,\n" +
                "      \"roleEntities\": [\n" +
                "        {\n" +
                "          \"id\": 0,\n" +
                "          \"name\": \"ROLE_ADMIN\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"id\": 2,\n" +
                "          \"name\": \"ROLE_PROVIDER\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"id\": 1,\n" +
                "          \"name\": \"ROLE_USER\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    \"name\": \"Baidariu nuoma\",\n" +
                "    \"description\": \"Baidariu nuoma\",\n" +
                "    \"price\": 12,\n" +
                "    \"price_type\": \"UNIT\",\n" +
                "    \"start_time\": \"07:30:00\",\n" +
                "    \"end_time\": \"17:30:00\",\n" +
                "    \"start_date\": \"2020-05-11\",\n" +
                "    \"end_date\": \"2020-05-15\",\n" +
                "    \"min_people_count\": 0,\n" +
                "    \"max_people_count\": 0,\n" +
                "    \"status\": \"ACTIVE\"\n" +
                "  },\n" +
                "  \"fixed_date\": true,\n" +
                "  \"start_date\": \"2020-05-11\",\n" +
                "  \"start_time\": \"07:30\",\n" +
                "  \"end_date\": \"\",\n" +
                "  \"end_time\": \"\",\n" +
                "  \"people_count\": 0,\n" +
                "  \"price_counter\": 0\n" +
                "}";

        mockMvc.perform(post("/scheduler/add")
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(request)
                .with(new RequestPostProcessor() {
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
    public void deleteServiceEvent() throws Exception {
        List<EventEntity>  eventEntities = new ArrayList<EventEntity>();

        UserEntity userEntity = new UserEntity();
        userEntity.setId((long)1);

        EventEntity eventEntity = new EventEntity();
        eventEntity.setUser(userEntity);
        eventEntity.setId((long) 1);

        eventEntities.add(eventEntity);

        when( eventRepository.findById((long) 1)).thenReturn(java.util.Optional.of(eventEntity));

        mockMvc.perform(delete("/scheduler/delete/1").with(new RequestPostProcessor() {
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
    public void testDeleteServiceEvent() throws Exception {
        List<EventEntity>  eventEntities = new ArrayList<EventEntity>();

        UserEntity userEntity = new UserEntity();
        userEntity.setId((long)1);

        EventEntity eventEntity = new EventEntity();
        eventEntity.setProvider(userEntity);
        eventEntity.setUser(userEntity);
        eventEntity.setId((long) 1);

        eventEntities.add(eventEntity);

        when( eventRepository.findById((long) 1)).thenReturn(java.util.Optional.of(eventEntity));
        when( eventRepository.findAllByUser(userEntity)).thenReturn(eventEntities);
        when( userRepository.findById((long) 1)).thenReturn(java.util.Optional.of(userEntity));

        mockMvc.perform(delete("/scheduler/delete/").with(new RequestPostProcessor() {
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
    public void editServiceEvent() throws Exception {
        List<EventEntity>  eventEntities = new ArrayList<EventEntity>();

        UserEntity userEntity = new UserEntity();
        userEntity.setId((long)1);

        EventEntity eventEntity = new EventEntity();
        eventEntity.setUser(userEntity);
        eventEntity.setId((long) 1);
        eventEntity.setPrice_counter(1);



        ServiceEntity serviceEntity = new ServiceEntity();
        serviceEntity.setId((long) 1);
        serviceEntity.setUser(userEntity);
        serviceEntity.setPrice_type(PriceTypes.UNIT);

        eventEntity.setService(serviceEntity);

        eventEntities.add(eventEntity);

        when( eventRepository.findAllByProvider(userEntity)).thenReturn(eventEntities);
        when( eventRepository.findById(((long) 1))).thenReturn(java.util.Optional.of(eventEntity));
        when( serviceRepository.findById((long) 1)).thenReturn(java.util.Optional.of(serviceEntity));
        when( userRepository.findById((long) 1)).thenReturn(java.util.Optional.of(userEntity));

        String request = "{" +
                "\"id\":\"1\", \n" +
                "  \"service\": {\n" +
                "    \"id\": 1,\n" +
                "    \"user\": {\n" +
                "      \"id\": 1,\n" +
                "      \"roleEntities\": [\n" +
                "        {\n" +
                "          \"id\": 0,\n" +
                "          \"name\": \"ROLE_ADMIN\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"id\": 2,\n" +
                "          \"name\": \"ROLE_PROVIDER\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"id\": 1,\n" +
                "          \"name\": \"ROLE_USER\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    \"name\": \"Baidariu nuoma\",\n" +
                "    \"description\": \"Baidariu nuoma\",\n" +
                "    \"price\": 12,\n" +
                "    \"price_type\": \"UNIT\",\n" +
                "    \"start_time\": \"07:30:00\",\n" +
                "    \"end_time\": \"17:30:00\",\n" +
                "    \"start_date\": \"2020-05-11\",\n" +
                "    \"end_date\": \"2020-05-15\",\n" +
                "    \"min_people_count\": 0,\n" +
                "    \"max_people_count\": 0,\n" +
                "    \"status\": \"ACTIVE\"\n" +
                "  },\n" +
                "  \"fixed_date\": true,\n" +
                "  \"start_date\": \"2020-05-11\",\n" +
                "  \"start_time\": \"07:30\",\n" +
                "  \"end_date\": \"\",\n" +
                "  \"end_time\": \"\",\n" +
                "  \"people_count\": 0,\n" +
                "  \"price_counter\": 0\n" +
                "}";

        mockMvc.perform(patch("/scheduler/edit")
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(request)
                .with(new RequestPostProcessor() {
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