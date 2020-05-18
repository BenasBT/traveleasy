package com.traveleasy.traveleasybackend.controllers;

import com.traveleasy.traveleasybackend.models.PriceTypes;
import com.traveleasy.traveleasybackend.models.entities.*;
import com.traveleasy.traveleasybackend.payload.CheckoutRequest;
import com.traveleasy.traveleasybackend.repositories.ArchiveRepository;
import com.traveleasy.traveleasybackend.repositories.PurchaseRepository;
import com.traveleasy.traveleasybackend.repositories.UserRepository;
import org.json.JSONObject;
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

import java.awt.*;
import java.sql.Time;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static org.junit.Assert.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringJUnit4ClassRunner.class)
public class CheckoutControllerTest {

    @InjectMocks
    private CheckoutController checkoutController;

    private MockMvc mockMvc;

    @Before
    public void setUp() throws Exception {
        this.mockMvc = MockMvcBuilders.standaloneSetup(checkoutController)
                .build();
    }

    @Mock
    ArchiveRepository archiveRepository;

    @Mock
    UserRepository userRepository;

    @Mock
    PurchaseRepository purchaseRepository;

    DateFormat timeFormat = new SimpleDateFormat("HH:mm");

    @Test
    public void archiveCheckout() throws Exception {

        CheckoutRequest checkoutRequest = new CheckoutRequest();

        List<EventEntity> eventEntities = new ArrayList<>();

        UserEntity userEntity = new UserEntity();
        ServiceEntity serviceEntity = new ServiceEntity();

        serviceEntity.setUser(userEntity);
        serviceEntity.setName("test");
        serviceEntity.setDescription("test");
        serviceEntity.setPrice_type(PriceTypes.DAY);

        EventEntity eventEntity = new EventEntity();
        eventEntity.setPrice(1);
        eventEntity.setPrice_counter(1);
        eventEntity.setStart_date(new Date());
        eventEntity.setEnd_date(new Date());
        eventEntity.setStart_time(new Time(timeFormat.parse("00:00").getTime()));
        eventEntity.setEnd_time(new Time(timeFormat.parse("00:00").getTime()));
        eventEntity.setUser(userEntity);
        eventEntity.setService(serviceEntity);

        List<PurchaseEntity> purchase = new ArrayList<>();
        List<ArchiveEntity> archiveEntities = new ArrayList<>();

        eventEntities.add(eventEntity);
        JSONObject jo = new JSONObject();
        jo.put("events" , eventEntities);
        jo.put("price",111);
        jo.put("card_number",111);
        jo.put("expiration_date",111);
        jo.put("ccv_cvc",111);

        System.out.println(jo.toString());
        String request = "{\n" +
                "  \"ccv_cvc\": 111,\n" +
                "  \"card_number\": 111,\n" +
                "  \"price\": 111,\n" +
                "  \"expiration_date\": 111,\n" +
                "  \"events\": [\n" +
                "    {\n" +
                "      \"end_date\": \"2000-01-01\",\n" +
                "      \"start_time\": \"00:00:00\",\n" +
                "      \"service\": {\n" +
                "        \"max_people_count\": 0,\n" +
                "        \"min_people_count\": 0,\n" +
                "        \"price\": 0,\n" +
                "        \"service_category\": [],\n" +
                "        \"name\": \"test\",\n" +
                "        \"description\": \"test\",\n" +
                "        \"price_type\": \"DAY\",\n" +
                "        \"user\": {\n" +
                "          \"emailVerified\": false,\n" +
                "          \"roleEntities\": []\n" +
                "        },\n" +
                "        \"service_photo\": []\n" +
                "      },\n" +
                "      \"price\": 1,\n" +
                "      \"end_time\": \"00:00:00\",\n" +
                "      \"people_count\": 0,\n" +
                "      \"fixed_date\": false,\n" +
                "      \"user\": {\n" +
                "        \"emailVerified\": false,\n" +
                "        \"roleEntities\": []\n" +
                "      },\n" +
                "      \"price_counter\": 1,\n" +
                "      \"start_date\": \"2000-01-01\"\n" +
                "    }\n" +
                "  ]\n" +
                "}";

        when( purchaseRepository.findAll()).thenReturn(purchase);
        when( archiveRepository.findAll()).thenReturn(archiveEntities);

        mockMvc.perform(post("/checkout/").contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(request).with(new RequestPostProcessor() {
            @Override
            public MockHttpServletRequest postProcessRequest(MockHttpServletRequest request) {
                request.addUserRole("USER");
                return request;
            }
        }))
                .andExpect(status().isOk());
    }


    @Test
    public void testArchiveCheckout() throws Exception {

        List<ArchiveEntity> archiveEntities = new ArrayList<ArchiveEntity>();

        ArchiveEntity archiveEntity = new ArchiveEntity();
        archiveEntity.setEvent_price(1);
        archiveEntity.setArchive_id((long)1);
        archiveEntities.add(archiveEntity);
        UserEntity userEntity = new UserEntity();
        userEntity.setId((long)1);

        when( archiveRepository.findAllByUser((userEntity) )).thenReturn(archiveEntities);
        when( userRepository.findById((long) 1)).thenReturn(java.util.Optional.of(userEntity));

        mockMvc.perform(get("/checkout/").with(new RequestPostProcessor() {
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
    public void getUserPurchases() throws Exception {
        List<PurchaseEntity> purchaseEntities = new ArrayList<PurchaseEntity>();

        PurchaseEntity purchaseEntity = new PurchaseEntity();
        purchaseEntity.setPurchase((long)1);

        purchaseEntities.add(purchaseEntity);
        UserEntity userEntity = new UserEntity();
        userEntity.setId((long)1);

        when( purchaseRepository.findAllByUser((userEntity) )).thenReturn(purchaseEntities);
        when( userRepository.findById((long) 1)).thenReturn(java.util.Optional.of(userEntity));

        mockMvc.perform(get("/checkout/purchases").with(new RequestPostProcessor() {
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
    public void getManagedPurchases() throws Exception {
        List<PurchaseEntity> purchaseEntities = new ArrayList<PurchaseEntity>();

        PurchaseEntity purchaseEntity = new PurchaseEntity();
        purchaseEntity.setPurchase((long)1);

        purchaseEntities.add(purchaseEntity);
        UserEntity userEntity = new UserEntity();
        userEntity.setId((long)1);

        when( purchaseRepository.findAllByUser((userEntity) )).thenReturn(purchaseEntities);
        when( userRepository.findById((long) 1)).thenReturn(java.util.Optional.of(userEntity));

        mockMvc.perform(get("/checkout/managed").with(new RequestPostProcessor() {
            @Override
            public MockHttpServletRequest postProcessRequest(MockHttpServletRequest request) {
                request.setParameter("id","1");
                request.addUserRole("PROVIDER");
                return request;
            }
        }))
                .andExpect(status().isOk());

    }

    @Test
    public void deletePurchasedEvent() throws Exception {
        List<PurchaseEntity> purchaseEntities = new ArrayList<PurchaseEntity>();

        PurchaseEntity purchaseEntity = new PurchaseEntity();
        purchaseEntity.setPurchase((long)1);
        purchaseEntity.setId((long)1);


        when( purchaseRepository.findById((long) 1)).thenReturn(java.util.Optional.of(purchaseEntity));

        mockMvc.perform(delete("/checkout/1").with(new RequestPostProcessor() {
            @Override
            public MockHttpServletRequest postProcessRequest(MockHttpServletRequest request) {
                request.setParameter("id","1");
                request.addUserRole("PROVIDER");
                request.addUserRole("USER");
                return request;
            }
        }))
                .andExpect(status().isOk());
    }

    @Test
    public void deletePurchased() throws Exception {
        List<PurchaseEntity> purchaseEntities = new ArrayList<PurchaseEntity>();

        PurchaseEntity purchaseEntity = new PurchaseEntity();
        purchaseEntity.setPurchase((long)1);
        purchaseEntity.setId((long)1);

        purchaseEntities.add(purchaseEntity);

        when( purchaseRepository.findAllByPurchase((long) 1)).thenReturn(purchaseEntities);

        mockMvc.perform(delete("/checkout/purchase/1").with(new RequestPostProcessor() {
            @Override
            public MockHttpServletRequest postProcessRequest(MockHttpServletRequest request) {
                request.setParameter("id","1");
                request.addUserRole("PROVIDER");
                request.addUserRole("USER");
                return request;
            }
        }))
                .andExpect(status().isOk());
    }
}