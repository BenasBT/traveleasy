package com.traveleasy.traveleasybackend.controllers;


import com.traveleasy.traveleasybackend.models.entities.ArchiveEntity;
import com.traveleasy.traveleasybackend.models.entities.EventEntity;
import com.traveleasy.traveleasybackend.models.entities.PurchaseEntity;
import com.traveleasy.traveleasybackend.payload.ArchiveResponce;
import com.traveleasy.traveleasybackend.payload.CheckoutRequest;
import com.traveleasy.traveleasybackend.payload.PurchaseResponse;
import com.traveleasy.traveleasybackend.repositories.ArchiveRepository;
import com.traveleasy.traveleasybackend.repositories.PurchaseRepository;
import com.traveleasy.traveleasybackend.repositories.UserRepository;
import com.traveleasy.traveleasybackend.security.CurrentUser;
import com.traveleasy.traveleasybackend.security.UserPrincipal;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@CrossOrigin
@RestController
@RequestMapping("/checkout")
public class CheckoutController {


    @Autowired
    ArchiveRepository archiveRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PurchaseRepository purchaseRepository;

    @PostMapping(value = "/")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<?> archiveCheckout(@CurrentUser UserPrincipal user,
                                            @RequestBody CheckoutRequest checkoutRequest){


       List<ArchiveEntity> archiveEntitys = new ArrayList<ArchiveEntity>();

        List<ArchiveEntity>  archiveIndex = archiveRepository.findAll();
        List<PurchaseEntity> purchaseIndex = purchaseRepository.findAll();

        long archive_id = 0;
        long purchase_id = 0;
        for(ArchiveEntity archiveEntity : archiveIndex){
            if (archiveEntity.getArchive_id() >= archive_id){
                archive_id = archiveEntity.getArchive_id() + 1;
            }
        }
        for(PurchaseEntity purchaseEntity : purchaseIndex){
            if (purchaseEntity.getPurchase() >= purchase_id){
                purchase_id = purchaseEntity.getPurchase() + 1;
            }
        }
       ArchiveEntity archiveEntity;
       PurchaseEntity purchaseEntity;


        for(EventEntity eventEntity : checkoutRequest.getEvents()) {
            archiveEntity = new ArchiveEntity();
            purchaseEntity = new PurchaseEntity();

            archiveEntity.setUser(eventEntity.getUser());
            purchaseEntity.setUser(eventEntity.getUser());

            archiveEntity.setProvider(eventEntity.getService().getUser());
            purchaseEntity.setProvider(eventEntity.getService().getUser());

            purchaseEntity.setService(eventEntity.getService());
            archiveEntity.setService_name(eventEntity.getService().getName());
            archiveEntity.setService_description(eventEntity.getService().getDescription());
            archiveEntity.setFull_price(checkoutRequest.getPrice());
            purchaseEntity.setFull_price(checkoutRequest.getPrice());
            archiveEntity.setService_price(eventEntity.getService().getPrice());

            archiveEntity.setService_price_type(eventEntity.getService().getPrice_type());

            archiveEntity.setEvent_price_counter(eventEntity.getPrice_counter());
            purchaseEntity.setPrice_counter(eventEntity.getPrice_counter());

            archiveEntity.setEvent_price(eventEntity.getPrice());
            purchaseEntity.setPrice(eventEntity.getPrice());

            archiveEntity.setEvent_start_date(eventEntity.getStart_date());
            purchaseEntity.setStart_date(eventEntity.getStart_date());

            archiveEntity.setEvent_start_time(eventEntity.getStart_time());
            purchaseEntity.setStart_time(eventEntity.getStart_time());

            archiveEntity.setEvent_end_date(eventEntity.getEnd_date());
            purchaseEntity.setEnd_date(eventEntity.getEnd_date());

            archiveEntity.setEvent_end_time(eventEntity.getEnd_time());
            purchaseEntity.setEnd_time(eventEntity.getEnd_time());

            archiveEntity.setEvent_people_count(eventEntity.getPeople_count());
            purchaseEntity.setPeople_count(eventEntity.getPeople_count());

            archiveEntity.setArchive_id(archive_id);
            purchaseEntity.setPurchase(purchase_id);

            archiveRepository.save(archiveEntity);
            purchaseRepository.save(purchaseEntity);
        }

        return new ResponseEntity<>("OK", HttpStatus.OK);
    }


    private List<ArchiveEntity> findWithSameId(long archive_id,List<ArchiveEntity> archiveEntities ){
        List<ArchiveEntity> archiveEntityList = new ArrayList<>();
        log.error("id {}",archive_id);
        for (ArchiveEntity archiveEntity: archiveEntities){
            if(archiveEntity.getArchive_id() == archive_id){
                log.error("ent id {}",archiveEntity.getId());
                archiveEntityList.add(archiveEntity);
            }
        }
        return  archiveEntityList;
    }

    private Double findFullPrice(long archive_id,List<ArchiveEntity> archiveEntities ){
        Double fullPrice = (double) 0;
        log.error("id {}",archive_id);
        for (ArchiveEntity archiveEntity: archiveEntities){
            if(archiveEntity.getArchive_id() == archive_id){
                return archiveEntity.getFull_price();
            }
        }
        return  fullPrice;
    }

    @GetMapping(value = "/")
    @PreAuthorize("hasRole('ROLE_USER')")
    public List<ArchiveResponce> archiveCheckout(@CurrentUser UserPrincipal user){

        List<ArchiveEntity> archiveEntities = archiveRepository.findAllByUser(
                userRepository.findById(user.getId()).orElseThrow(() -> new RuntimeException("User not found"))
        );
        List<ArchiveResponce> archiveResponse = new ArrayList<>();


        List<Long> ids = new ArrayList<>();
        for(ArchiveEntity archiveEntity : archiveEntities){
            if(!ids.contains(archiveEntity.getArchive_id()))
                ids.add(archiveEntity.getArchive_id());
        }
        log.error("{}",ids);
        ArchiveResponce archive ;
        for(Long id : ids){
            archive = new ArchiveResponce();
            archive.setId(id);
            archive.setPrice(findFullPrice(id,archiveEntities));
            archive.setArchiveEntities(findWithSameId(id,archiveEntities));
            archiveResponse.add(archive);
        }


        return archiveResponse;
    }

    private List<PurchaseEntity> findPurchasesWithSameId(long purchase_id,List<PurchaseEntity> purchaseEntities ){
        List<PurchaseEntity> purchaseEntityList = new ArrayList<>();
        log.error("id {}",purchase_id);
        for (PurchaseEntity purchaseEntity: purchaseEntities){
            if(purchaseEntity.getPurchase() == purchase_id){
                purchaseEntityList.add(purchaseEntity);
            }
        }
        return  purchaseEntityList;
    }

    private Double findFullPurchasePrice(long purchase_id,List<PurchaseEntity> purchaseEntities ){
        Double fullPrice = (double) 0;
        log.error("id {}",purchase_id);
        for (PurchaseEntity purchaseEntity: purchaseEntities){
            if(purchaseEntity.getPurchase() == purchase_id){
                return purchaseEntity.getFull_price();
            }
        }
        return  fullPrice;
    }

    @GetMapping(value = "/purchases")
    @PreAuthorize("hasRole('ROLE_USER')")
    public List<PurchaseResponse> getUserPurchases(@CurrentUser UserPrincipal user){

        List<PurchaseEntity> purchaseEntities = purchaseRepository.findAllByUser(
                userRepository.findById(user.getId()).orElseThrow(() -> new RuntimeException("User not found"))
        );
        List<PurchaseResponse> purchaseResponses = new ArrayList<>();


        List<Long> ids = new ArrayList<>();
        for(PurchaseEntity purchaseEntity : purchaseEntities){
            if(!ids.contains(purchaseEntity.getPurchase()))
                ids.add(purchaseEntity.getPurchase());
        }
        log.error("{}",ids);
        PurchaseResponse purchase ;
        for(Long id : ids){
            purchase = new PurchaseResponse();
            purchase.setId(id);
            purchase.setPrice(findFullPurchasePrice(id,purchaseEntities));
            purchase.setEvents(findPurchasesWithSameId(id,purchaseEntities));
            purchaseResponses.add(purchase);
        }


        return purchaseResponses;
    }

    @GetMapping(value = "/managed")
    @PreAuthorize("hasRole('ROLE_USER')")
    public List<PurchaseEntity> getManagedPurchases(@CurrentUser UserPrincipal user){

        return purchaseRepository.findAllByProvider(
                userRepository.findById(user.getId()).orElseThrow(() -> new RuntimeException("User not found"))
        );
    }

    @DeleteMapping(value = "/{id}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<?> deletePurchasedEvent(@CurrentUser UserPrincipal user,@PathVariable("id") long id){


        purchaseRepository.delete(purchaseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Purchase not found")));

        return new ResponseEntity<>("OK", HttpStatus.OK);
    }

    @DeleteMapping(value = "purchase/{id}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<?> deletePurchased(@CurrentUser UserPrincipal user,@PathVariable("id") long id){
        List<PurchaseEntity> purchaseEntities = purchaseRepository.findAllByPurchase(id);
        purchaseRepository.deleteAll(purchaseEntities);

        return new ResponseEntity<>("OK", HttpStatus.OK);
    }
}
