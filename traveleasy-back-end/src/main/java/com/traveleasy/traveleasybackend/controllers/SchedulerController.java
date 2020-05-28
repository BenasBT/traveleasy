package com.traveleasy.traveleasybackend.controllers;

import com.traveleasy.traveleasybackend.models.PriceTypes;
import com.traveleasy.traveleasybackend.models.entities.EventEntity;
import com.traveleasy.traveleasybackend.models.entities.PurchaseEntity;
import com.traveleasy.traveleasybackend.models.entities.ServiceEntity;
import com.traveleasy.traveleasybackend.repositories.EventRepository;
import com.traveleasy.traveleasybackend.repositories.PurchaseRepository;
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

import java.sql.Time;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
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

    @Autowired
    PurchaseRepository purchaseRepository;

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

    @GetMapping("/myEvents")
    @PreAuthorize("hasRole('ROLE_USER')")
    public List<EventEntity> getMyServicesEvents(@CurrentUser UserPrincipal userPrincipal) {

        return eventRepository.findAllByProvider(
                userRepository.findById(userPrincipal.getId()).orElseThrow(() -> new RuntimeException("User not found"))
        );

    }

    private Date fixDate(Date dt){
        Calendar c = Calendar.getInstance();
        c.setTime(dt);
        c.add(Calendar.DATE, 1);
        dt = c.getTime();
        return dt;
    }
    private boolean validate(EventEntity newEvent){
        List<EventEntity> eventEntities = eventRepository.findAllByService(newEvent.getService());

        for(EventEntity event : eventEntities) {

            if (newEvent.getId() != event.getId()){


                if (newEvent.isFixed_date() || event.isFixed_date()) {
                    //simple check when date is fixed
                    if (dateFormat.format(event.getStart_date())
                            .equals(dateFormat.format(newEvent.getStart_date()))) {
                        log.error("This Date is taken fixed event {}", newEvent.getStart_date());
                        return false;

                    }else if(event.getEnd_date() != null){
                        if(newEvent.getStart_date().compareTo(event.getEnd_date()) <= 0
                                && newEvent.getStart_date().compareTo(event.getStart_date()) >= 0){
                            log.error("Event exists during this time");
                            return false;
                        }
                    }else if (newEvent.getEnd_date() != null){
                        if(event.getStart_date().compareTo(newEvent.getEnd_date()) <= 0
                                && event.getStart_date().compareTo(newEvent.getStart_date()) >= 0){
                            log.error("A fixed event exists during this time");
                            return false;
                        }
                    }
                } else {
                    if (newEvent.getEnd_date() == null) {
                        if (dateFormat.format(event.getStart_date())
                                .equals(dateFormat.format(newEvent.getStart_date()))) {

                            if (event.getStart_time() != null && event.getEnd_time() != null) {
                                if (newEvent.getStart_time().compareTo(event.getEnd_time()) <= 0
                                        && newEvent.getEnd_time().compareTo(event.getStart_time()) >= 0) {
                                    //this time is taken
                                    log.error("This Time is taken {} -- {} for {} {} -- {}",
                                            newEvent.getStart_time(), newEvent.getEnd_time(),
                                            event.getId(),event.getStart_date(), event.getEnd_date());

                                    return false;
                                }
                            }
                        }
                    }else if((newEvent.getStart_date().compareTo(event.getEnd_date()) <= 0
                            && newEvent.getStart_date().compareTo(event.getStart_date()) >= 0)
                            || dateFormat.format(newEvent.getStart_date())
                                .equals(dateFormat.format(event.getEnd_date())) ){

                        log.error("New Event starts during old event");
                        return !CompareEventTimes(newEvent, event);

                    }else if( (newEvent.getEnd_date().compareTo(event.getEnd_date()) <= 0
                            && newEvent.getEnd_date().compareTo(event.getStart_date()) >= 0)
                            || dateFormat.format(newEvent.getEnd_date())
                            .equals(dateFormat.format(event.getStart_date()))){

                        log.error("New Event ends during old event");
                        return !CompareEventTimes(newEvent, event);

                    }else if(newEvent.getStart_date().compareTo(event.getStart_date()) < 0
                            && newEvent.getEnd_date().compareTo(event.getEnd_date()) > 0){

                        log.error("Event exists during selected time");
                        return false;
                    }

                }
            }
        }

        return true;
    }

    private boolean valideteWithPurchases(EventEntity newEvent){
        log.error("{}",newEvent);
        List<PurchaseEntity> purchaseEntities = purchaseRepository.findAllByService(newEvent.getService());
        for(PurchaseEntity event : purchaseEntities) {

                if (newEvent.isFixed_date()) {
                    //simple check when date is fixed
                    if (dateFormat.format(event.getStart_date())
                            .equals(dateFormat.format(newEvent.getStart_date()))) {
                        log.error("This Date is taken fixed event {}", newEvent.getStart_date());
                        return false;

                    }else if(event.getEnd_date() != null){

                        if(newEvent.getStart_date().compareTo(event.getEnd_date()) <= 0
                                && newEvent.getStart_date().compareTo(event.getStart_date()) >= 0){
                            log.error("Event exists during this time");
                            return false;
                        }
                    }else if (newEvent.getEnd_date() != null){
                        if(event.getStart_date().compareTo(newEvent.getEnd_date()) <= 0
                                && event.getStart_date().compareTo(newEvent.getStart_date()) >= 0){
                            log.error("A fixed event exists during this time");
                            return false;
                        }
                    }
                } else {
                    if (newEvent.getEnd_date() == null) {
                        if (dateFormat.format(event.getStart_date())
                                .equals(dateFormat.format(newEvent.getStart_date()))) {

                            if (event.getStart_time() != null && event.getEnd_time() != null) {
                                if (newEvent.getStart_time().compareTo(event.getEnd_time()) <= 0
                                        && newEvent.getEnd_time().compareTo(event.getStart_time()) >= 0) {
                                    //this time is taken
                                    log.error("This Time is taken {} -- {} for {} {} -- {}",
                                            newEvent.getStart_time(), newEvent.getEnd_time(),
                                            event.getId(),event.getStart_date(), event.getEnd_date());

                                    return false;
                                }
                            }
                        }
                    }else if((newEvent.getStart_date().compareTo(event.getEnd_date()) <= 0
                            && newEvent.getStart_date().compareTo(event.getStart_date()) >= 0)
                            || dateFormat.format(newEvent.getStart_date())
                            .equals(dateFormat.format(event.getEnd_date())) ){

                        log.error("New Event starts during old event");
                        return !CompareEventTimesWithPurchase(newEvent, event);

                    }else if( (newEvent.getEnd_date().compareTo(event.getEnd_date()) <= 0
                            && newEvent.getEnd_date().compareTo(event.getStart_date()) >= 0)
                            || dateFormat.format(newEvent.getEnd_date())
                            .equals(dateFormat.format(event.getStart_date()))){

                        log.error("New Event ends during old event");
                        return !CompareEventTimesWithPurchase(newEvent, event);

                    }else if(newEvent.getStart_date().compareTo(event.getStart_date()) < 0
                            && newEvent.getEnd_date().compareTo(event.getEnd_date()) > 0){

                        log.error("Event exists during selected time");
                        return false;
                    }

                }

        }

        return true;
    }

    private boolean CompareEventTimesWithPurchase(EventEntity newEvent, PurchaseEntity purchase) {
        if(dateFormat.format(newEvent.getStart_date())
                .equals(dateFormat.format(purchase.getEnd_date()))){
            log.error("New Event starts at the same date as old event ends" );
            log.error("time {}",newEvent.getStart_time().compareTo(purchase.getEnd_time()));
            if(newEvent.getStart_time().compareTo(purchase.getEnd_time()) > 0){
                log.error("New event starts after old one ends");
                return false;
            }
            log.error("New event starts before old one ends");
        }else if(dateFormat.format(newEvent.getEnd_date())
                .equals(dateFormat.format(purchase.getStart_date()))){

            log.error("New Event ends at the same date as old event starts");
            log.error("time {}",newEvent.getStart_time().compareTo(purchase.getEnd_time()));
            if(newEvent.getEnd_time().compareTo(purchase.getStart_time()) < 0){
                log.error("New event ends before old one starts");
                return false;
            }
            log.error("New event ends after old one starts");
        }
        return true;
    }

    private boolean CompareEventTimes(EventEntity newEvent, EventEntity event) {
        if(dateFormat.format(newEvent.getStart_date())
                .equals(dateFormat.format(event.getEnd_date()))){
            log.error("New Event starts at the same date as old event ends" );
            log.error("time {}",newEvent.getStart_time().compareTo(event.getEnd_time()));
            if(newEvent.getStart_time().compareTo(event.getEnd_time()) > 0){
                log.error("New event starts after old one ends");
                return false;
            }
            log.error("New event starts before old one ends");
        }else if(dateFormat.format(newEvent.getEnd_date())
                .equals(dateFormat.format(event.getStart_date()))){

            log.error("New Event ends at the same date as old event starts");
            log.error("time {}",newEvent.getStart_time().compareTo(event.getEnd_time()));
            if(newEvent.getEnd_time().compareTo(event.getStart_time()) < 0){
                log.error("New event ends before old one starts");
                return false;
            }
            log.error("New event ends after old one starts");
        }
        return true;
    }

    @PostMapping(value = "/add" )
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<?> addServiceEvent(@CurrentUser UserPrincipal userPrincipal,
                                             @RequestBody String eventEntityRaw){

        JSONObject jsonObject = new JSONObject(eventEntityRaw);

        EventEntity eventEntity = new EventEntity();


        eventEntity.setUser(userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found")));

        ServiceEntity serviceEntity = serviceRepository.findById(jsonObject.getJSONObject("service")
                .getLong("id"))
                .orElseThrow(() -> new RuntimeException("service not found"));

        eventEntity.setService(
                serviceEntity
        );

        eventEntity.setProvider(userRepository.findById(serviceEntity.getUser().getId())
                .orElseThrow(() -> new RuntimeException("Provider not found")));


        eventEntity.setFixed_date(jsonObject.getBoolean("fixed_date"));

        try {
            String date = jsonObject.getString("start_date");

            if (!date.equals("")) {
                eventEntity.setStart_date(
                        dateFormat.parse(date)//Timezone bug ?
                );
            }

            eventEntity.setStart_time(
                    new java.sql.Time(timeFormat.parse(
                            jsonObject.getString("start_time")
                    ).getTime())
            );

            if(!eventEntity.isFixed_date()) {

                date = jsonObject.getString("end_date");
                if (!date.equals("")) {
                    eventEntity.setEnd_date(
                            dateFormat.parse(date)//Timezone bug ?
                    );
                }

                eventEntity.setEnd_time(
                        new java.sql.Time(timeFormat.parse(
                                jsonObject.getString("end_time")
                        ).getTime())
                );
            }

        } catch (ParseException e) {
            e.printStackTrace();
            return new ResponseEntity<>("Failed " , HttpStatus.BAD_REQUEST);
        }

        eventEntity.setPeople_count(jsonObject.getInt("people_count"));
        eventEntity.setPrice_counter(jsonObject.getDouble("price_counter"));


        if(!valideteWithPurchases(eventEntity)) {
            return new ResponseEntity<>("Event time is taken" , HttpStatus.CONFLICT);
        }
        if(eventEntity.getStart_date() != null && !jsonObject.getString("start_date").equals("")) {
            eventEntity.setStart_date(fixDate(eventEntity.getStart_date()));
        }
        if(eventEntity.getEnd_date() != null && !jsonObject.getString("end_date").equals("")) {
            eventEntity.setEnd_date(fixDate(eventEntity.getEnd_date()));
        }


        try {
            eventEntity.setPrice(calculatePrice(eventEntity));
        } catch (ParseException e) {
            e.printStackTrace();
        }
        eventRepository.save(eventEntity);

        return new ResponseEntity<>("Event Added " , HttpStatus.OK);
    }

    private double calculatePrice(EventEntity eventEntity) throws ParseException {
        double price = 0;
        long hours,hours2,days;
        switch (eventEntity.getService().getPrice_type()){
            case KM:
            case UNIT:
                log.error("{}",eventEntity.getPrice_counter());
                price = eventEntity.getPrice_counter() * eventEntity.getService().getPrice();
                break;

            case PERSON:
                price = eventEntity.getPeople_count() * eventEntity.getService().getPrice();
                break;

            case DAY:
                if (eventEntity.isFixed_date() || eventEntity.getEnd_date() == null){
                    price = eventEntity.getService().getPrice();
                    }else{
                        days =ChronoUnit.DAYS.between(
                            LocalDate.ofInstant(eventEntity.getStart_date().toInstant(), ZoneId.systemDefault()),
                            LocalDate.ofInstant(eventEntity.getEnd_date().toInstant(), ZoneId.systemDefault())
                    ) + 1;
                    price = days * eventEntity.getService().getPrice();
                }
                break;
            case HOUR:
                if (eventEntity.isFixed_date()){

                    if(eventEntity.getStart_time() != null){
                        //nuo start time iki 24:00

                            hours = ((new Time(timeFormat.parse(
                                    "24:00:00"
                                    ).getTime()).getTime() -

                                    eventEntity.getStart_time().getTime() )
                                            / (1000*60*60)) % 24;

                        if(hours == 0){
                            hours =1;
                        }if(hours < 0){
                            hours = 24 + hours;
                        }
                        log.info("Hours {} nuo start {} time iki 24:00",hours,eventEntity.getStart_time());
                        price = eventEntity.getService().getPrice() * hours;
                    }else {
                        //visa para
                        price = eventEntity.getService().getPrice() * 24;
                    }

                }else  if(eventEntity.getEnd_date() == null && eventEntity.getEnd_time() != null){
                    //Laikas tarp start time ir end time, nera pabaigos datos
                    hours =  (eventEntity.getEnd_time().getTime() - eventEntity.getStart_time().getTime() ) / (1000*60*60) % 24;
                    if(hours == 0){
                        hours =1;
                    }if(hours < 0){
                        hours = 24 + hours;
                    }
                    log.info("Hours {} nuo start {} time iki  {} ",hours,eventEntity.getStart_time(),eventEntity.getEnd_time());

                    price = eventEntity.getService().getPrice() * hours;

                }
                else{
                    //Tarp dvieju datu imant tik pasirenktas valandas
                     days =ChronoUnit.DAYS.between(
                            LocalDate.ofInstant(eventEntity.getStart_date().toInstant(), ZoneId.systemDefault()),
                            LocalDate.ofInstant(eventEntity.getEnd_date().toInstant(), ZoneId.systemDefault())
                    ) + 1;

                    hours =  (new Time(timeFormat.parse(
                            "24:00:00"
                                ).getTime()).getTime() - eventEntity.getStart_time().getTime() ) / (1000*60*60) % 24;

                    hours2 =  ( eventEntity.getEnd_time().getTime() ) / (1000*60*60) % 24;

                    if(hours == 0){
                        hours =1;
                    }if(hours < 0){
                        hours = 24 + hours;
                    }
                    log.info("Hours {} nuo start {} time iki  {} ",hours,eventEntity.getStart_time(),eventEntity.getEnd_time());
                    if(days - 2 >= 0) {
                        price = ((days - 2) * 24) * eventEntity.getService().getPrice();
                    }else {
                        price = 0;
                    }
                    log.info(" price {} for days {} ",price,days);
                    price += hours2 * eventEntity.getService().getPrice();
                    log.info(" price {} for hours {} ",hours2 * eventEntity.getService().getPrice(),hours2);
                    price += hours * eventEntity.getService().getPrice();
                    log.info(" price {} for hours {} ",hours * eventEntity.getService().getPrice(),hours);
                    log.info("Days {} hours {} price {}",days,hours,price);
                }

                break;

            default:
                break;

        }

        return price;
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
                        dateFormat.parse(date)//Timezone bug ?
                );
            }

            if (!jsonObject.getString("start_time").equals("")) {
                log.error(jsonObject.getString("start_time"));
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
                            dateFormat.parse(date)//Timezone bug ?
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

        eventEntity.setPrice_counter(jsonObject.getDouble("price_counter"));

        if(!validate(eventEntity)) {
            return new ResponseEntity<>("Event time is taken" , HttpStatus.CONFLICT);
        }
        if(eventEntity.getStart_date() != null) {
            eventEntity.setStart_date(fixDate(eventEntity.getStart_date()));
        }
        if(eventEntity.getEnd_date() != null) {
            eventEntity.setEnd_date(fixDate(eventEntity.getEnd_date()));
        }

        try {
            eventEntity.setPrice(calculatePrice(eventEntity));
        } catch (ParseException e) {
            e.printStackTrace();
        }

        eventRepository.save(eventEntity);

        return new ResponseEntity<>("Event Added " , HttpStatus.OK);
    }
}
