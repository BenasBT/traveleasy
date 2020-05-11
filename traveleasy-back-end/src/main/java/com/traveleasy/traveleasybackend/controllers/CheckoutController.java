package com.traveleasy.traveleasybackend.controllers;


import com.traveleasy.traveleasybackend.models.entities.ArchiveEntity;
import com.traveleasy.traveleasybackend.models.entities.EventEntity;
import com.traveleasy.traveleasybackend.payload.ArchiveResponce;
import com.traveleasy.traveleasybackend.payload.CheckoutRequest;
import com.traveleasy.traveleasybackend.repositories.ArchiveRepository;
import com.traveleasy.traveleasybackend.repositories.UserRepository;
import com.traveleasy.traveleasybackend.security.CurrentUser;
import com.traveleasy.traveleasybackend.security.UserPrincipal;
import lombok.extern.slf4j.Slf4j;
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

    @PostMapping(value = "/archive")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<?> archiveCheckout(@CurrentUser UserPrincipal user,
                                            @RequestBody CheckoutRequest checkoutRequest){

       List<ArchiveEntity> archiveEntitys = new ArrayList<ArchiveEntity>();
        List<ArchiveEntity>  archiveIndex = archiveRepository.findAll();
        long archive_id = 0;
        for(ArchiveEntity archiveEntity : archiveIndex){
            if (archiveEntity.getArchive_id() >= archive_id){
                archive_id = archiveEntity.getArchive_id() + 1;
            }
        }
       ArchiveEntity archiveEntity;


        for(EventEntity eventEntity : checkoutRequest.getEvents()) {
            log.error("{}", eventEntity.getService().getName());
            archiveEntity = new ArchiveEntity();
            archiveEntity.setUser(eventEntity.getUser());
            log.error("User id{}",eventEntity.getUser().getId());

            archiveEntity.setProvider(eventEntity.getService().getUser());

            archiveEntity.setService_name(eventEntity.getService().getName());
            archiveEntity.setService_description(eventEntity.getService().getDescription());

            archiveEntity.setFull_price(checkoutRequest.getPrice());
            archiveEntity.setService_price(eventEntity.getService().getPrice());
            archiveEntity.setService_price_type(eventEntity.getService().getPrice_type());

            archiveEntity.setEvent_start_date(eventEntity.getStart_date());
            archiveEntity.setEvent_start_time(eventEntity.getStart_time());
            archiveEntity.setEvent_end_date(eventEntity.getEnd_date());
            archiveEntity.setEvent_end_time(eventEntity.getEnd_time());

            archiveEntity.setEvent_people_count(eventEntity.getPeople_count());

            archiveEntity.setArchive_id(archive_id);
            log.error("User id{}",archiveEntity.getUser().getId());
            archiveRepository.save(archiveEntity);
        }

        log.error("{}",checkoutRequest.getExpiration_date());

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
}
