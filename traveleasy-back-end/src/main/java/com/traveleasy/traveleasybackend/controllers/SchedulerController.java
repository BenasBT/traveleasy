package com.traveleasy.traveleasybackend.controllers;

import com.traveleasy.traveleasybackend.models.entities.EventEntity;
import com.traveleasy.traveleasybackend.repositories.EventRepository;
import com.traveleasy.traveleasybackend.repositories.ServiceRepository;
import com.traveleasy.traveleasybackend.repositories.UserRepository;
import com.traveleasy.traveleasybackend.security.CurrentUser;
import com.traveleasy.traveleasybackend.security.UserPrincipal;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Slf4j
@CrossOrigin
@RestController
@RequestMapping("/scheduler")
public class SchedulerController {

    @Autowired
    EventRepository eventRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    ServiceRepository serviceRepository;

    DateFormat timeFormat = new SimpleDateFormat("HH:mm");
    DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
    LocalDateTime localDateTime = LocalDateTime.now();


    @GetMapping("/")
    @PreAuthorize("hasRole('ROLE_USER')")
    public List<EventEntity> getMyEvents(@CurrentUser UserPrincipal userPrincipal) {

        return eventRepository.findAllByUser(userRepository.findById(userPrincipal.getId())
        .orElseThrow(()->new RuntimeException("User not found")));

    }

    @GetMapping("{id}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public EventEntity getMyEventss(@CurrentUser UserPrincipal userPrincipal,
                                           @PathVariable("id") Long id) {

        return eventRepository.findById(id)
                .orElseThrow(()->new RuntimeException("User not found"));

    }

    private Date fixDate(Date dt){
        Calendar c = Calendar.getInstance();
        c.setTime(dt);
        c.add(Calendar.DATE, 1);
        dt = c.getTime();
        return dt;
    }

    @PostMapping(value = "/add" )
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<?> addServiceEvent(@CurrentUser UserPrincipal userPrincipal,
                                             @RequestBody String eventEntityRaw){

        JSONObject jsonObject = new JSONObject(eventEntityRaw);

        DateFormat formatter = new SimpleDateFormat("HH:mm");
        EventEntity eventEntity = new EventEntity();


        eventEntity.setUser(userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found")));

        eventEntity.setService(
                serviceRepository.findById(jsonObject.getJSONObject("service")
                .getLong("id"))
                .orElseThrow(() -> new RuntimeException("service not found"))
        );

        eventEntity.setFixed_date(jsonObject.getBoolean("fixed_date"));

        try {
            String date = jsonObject.getString("start_date");

            if (!date.equals("")) {
                eventEntity.setStart_date(
                        fixDate(dateFormat.parse(date))//Timezone bug ?
                );
            }

            eventEntity.setStart_time(
                    new java.sql.Time(formatter.parse(
                            jsonObject.getString("start_time")
                    ).getTime())
            );

            if(!eventEntity.isFixed_date()) {

                date = jsonObject.getString("end_date");
                if (!date.equals("")) {
                    eventEntity.setEnd_date(
                            fixDate(dateFormat.parse(date))//Timezone bug ?
                    );
                }

                eventEntity.setEnd_time(
                        new java.sql.Time(formatter.parse(
                                jsonObject.getString("end_time")
                        ).getTime())
                );
            }

        } catch (ParseException e) {
            e.printStackTrace();
            return new ResponseEntity<>("Failed " , HttpStatus.BAD_REQUEST);
        }

        eventEntity.setPeople_count(jsonObject.getInt("people_count"));

        eventRepository.save(eventEntity);

        return new ResponseEntity<>("Event Added " , HttpStatus.OK);
    }

    @DeleteMapping(value = "/delete/{id}" )
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<?> deleteServiceEvent(@CurrentUser UserPrincipal userPrincipal,
                                             @PathVariable("id") long id){

        eventRepository.delete(
                eventRepository.findById(id).orElseThrow(() -> new RuntimeException("event not found"))
        );

        return new ResponseEntity<>("Event Added " , HttpStatus.OK);
    }

    @DeleteMapping(value = "/delete/" )
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<?> deleteServiceEvent(@CurrentUser UserPrincipal userPrincipal){

        eventRepository.deleteAll(
                eventRepository.findAllByUser(
                        userRepository.findById(userPrincipal.getId()).orElseThrow(
                                () -> new RuntimeException("user not found")
                        )
                )
        );

        return new ResponseEntity<>("Event Added " , HttpStatus.OK);
    }

    @PatchMapping(value = "/edit" )
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<?> editServiceEvent(@CurrentUser UserPrincipal userPrincipal,
                                             @RequestBody String eventEntityRaw){

        JSONObject jsonObject = new JSONObject(eventEntityRaw);

        DateFormat formatter = new SimpleDateFormat("HH:mm");

        EventEntity eventEntity = eventRepository.findById(
                jsonObject.getLong("id")
        ).orElseThrow(()-> new RuntimeException("event not found"));

        eventEntity.setFixed_date(jsonObject.getBoolean("fixed_date"));

        try {
            String date = jsonObject.getString("start_date");

            if (!date.equals("")) {
                eventEntity.setStart_date(
                        fixDate(dateFormat.parse(date))//Timezone bug ?
                );
            }
            if (!jsonObject.getString("end_time").equals("")) {
                eventEntity.setStart_time(
                        new java.sql.Time(formatter.parse(
                                jsonObject.getString("start_time")
                        ).getTime())
                );
            }

            if(!eventEntity.isFixed_date()) {

                date = jsonObject.getString("end_date");
                if (!date.equals("")) {
                    eventEntity.setEnd_date(
                            fixDate(dateFormat.parse(date))//Timezone bug ?
                    );
                }

                if (!jsonObject.getString("end_time").equals("")) {
                    eventEntity.setEnd_time(
                            new java.sql.Time(formatter.parse(
                                    jsonObject.getString("end_time")
                            ).getTime())
                    );
                }
            }else {
                eventEntity.setEnd_date(null);
                eventEntity.setEnd_time(null);
            }

        } catch (ParseException e) {
            e.printStackTrace();
            return new ResponseEntity<>("Failed " , HttpStatus.BAD_REQUEST);
        }

        eventEntity.setPeople_count(jsonObject.getInt("people_count"));
        log.error("{}",eventEntity);
        log.error("{}",eventEntity.getPeople_count());
        log.error("{}",eventEntity.getStart_date());
        eventRepository.save(eventEntity);

        return new ResponseEntity<>("Event Added " , HttpStatus.OK);
    }
}
