package com.traveleasy.traveleasybackend.controllers;

import com.traveleasy.traveleasybackend.models.PriceTypes;
import com.traveleasy.traveleasybackend.models.RoleName;
import com.traveleasy.traveleasybackend.models.StatusName;
import com.traveleasy.traveleasybackend.models.entities.*;
import com.traveleasy.traveleasybackend.payload.AddServiceRequest;
import com.traveleasy.traveleasybackend.repositories.*;
import com.traveleasy.traveleasybackend.security.CurrentUser;
import com.traveleasy.traveleasybackend.security.UserPrincipal;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.Time;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Slf4j
@CrossOrigin
@RestController
@RequestMapping("/service")
public class ServiceController {

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PriceTypeRepository priceTypeRepository;

    @Autowired
    private MarkedRepository markedRepository;

    DateFormat timeFormat = new SimpleDateFormat("HH:mm");
    DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
    LocalDateTime localDateTime = LocalDateTime.now();

    @GetMapping
    @PreAuthorize("hasRole('ROLE_USER')")
    public List<ServiceEntity> getServices() {
        return serviceRepository.findAll();
    }

    @GetMapping("/prices")
    @PreAuthorize("hasRole('ROLE_USER')")
    public List<PriceTypeEntity> getPrices() {
        return priceTypeRepository.findAll();
    }

    @GetMapping("/user/{id}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public List<ServiceEntity> getUserServices(@PathVariable("id") long id) {

        return serviceRepository.findAllByUser(
                userRepository.findById(id).orElseThrow(
                        () -> new RuntimeException("Cant find current user")
                )
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ServiceEntity getMyServices(@PathVariable("id") long id) {

        return serviceRepository.findById(id).orElseThrow(()->new RuntimeException("Service not found")) ;
    }

    @GetMapping("/mark/{id}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<?> markService(@PathVariable("id") long id,
                                         @CurrentUser UserPrincipal userPrincipal) {

        MarkedSericeEntity markedSericeEntity = new MarkedSericeEntity();
        UserEntity userEntity = userRepository.findById(userPrincipal.getId())
                .orElseThrow( () -> new RuntimeException("User not found"));

        List<MarkedSericeEntity> markedSericeEntities = markedRepository.findAllByUser(userEntity.getId());

        for(MarkedSericeEntity mse : markedSericeEntities){
            if(mse.getService().getId() == id){
                return new ResponseEntity<>("this service already marked",HttpStatus.ALREADY_REPORTED);
            }
        }
        markedSericeEntity.setService(
                serviceRepository.findById(id).orElseThrow(() -> new RuntimeException("Service not found"))
        );
        markedSericeEntity.setUser(userEntity);

        markedRepository.save(markedSericeEntity);
        return new ResponseEntity<>("Ok",HttpStatus.OK) ;
    }

    @GetMapping("/unmark/{id}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<?> unmarkService(@PathVariable("id") long id,
                                         @CurrentUser UserPrincipal userPrincipal) {

        markedRepository.delete(markedRepository.findAllByUserAndService(userPrincipal.getId(),id)
                .orElseThrow( () -> new RuntimeException("Marked service not found")));
        return new ResponseEntity<>("Ok" , HttpStatus.OK);
    }

    @GetMapping("/approve/{id}")
    @PreAuthorize("hasRole('ROLE_USER')") //TODO FIX TO ADMIN
    public ResponseEntity<?> aproveService(@PathVariable("id") long id,
                                           @CurrentUser UserPrincipal userPrincipal) {

        ServiceEntity serviceEntity = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        serviceEntity.setStatus(StatusName.ACTIVE);
        serviceRepository.save(serviceEntity);

        return new ResponseEntity<>("Ok" , HttpStatus.OK);
    }

    @GetMapping("/deny/{id}")
    @PreAuthorize("hasRole('ROLE_USER')")//TODO FIX TO ADMIN
    public ResponseEntity<?> denyService(@PathVariable("id") long id,
                                           @CurrentUser UserPrincipal userPrincipal) {

        ServiceEntity serviceEntity = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        serviceEntity.setStatus(StatusName.DENIED);
        serviceRepository.save(serviceEntity);

        return new ResponseEntity<>("Ok" , HttpStatus.OK);
    }

    @GetMapping("/marked")
    @PreAuthorize("hasRole('ROLE_USER')")
    public List<ServiceEntity> getMarked(@CurrentUser UserPrincipal userPrincipal) {

        List<MarkedSericeEntity> markedSericeEntities = markedRepository.findAllByUser(userPrincipal.getId());
        List<ServiceEntity> serviceEntities = new ArrayList<>();
        for(MarkedSericeEntity marked: markedSericeEntities){
            serviceEntities.add(marked.getService());
        }
        return serviceEntities;
    }

    private AddServiceRequest formatServiceRequest(JSONObject jsonObject){
        AddServiceRequest addServiceRequest = new AddServiceRequest();

        addServiceRequest.setName(jsonObject.getString("name"));
        addServiceRequest.setDescription(jsonObject.getString("description"));

        JSONArray categoriesJson = jsonObject.getJSONArray("categories");
        List<CategoryEntity> categoryEntities = new ArrayList<>();

        for(int i = 0 ; i < categoriesJson.length(); i++){
            JSONObject jsonCategory = categoriesJson.getJSONObject(i);

            categoryRepository.findById(jsonCategory.getLong("id"))
                    .ifPresent(categoryEntities::add);

        }
        addServiceRequest.setCategoryEntities(categoryEntities);

        addServiceRequest.setNewCategoryChecked(jsonObject.getBoolean("newCategoryChecked"));
        addServiceRequest.setNewCategory(jsonObject.getString("newCategory"));

        if(addServiceRequest.isNewCategoryChecked()){
            CategoryEntity categoryEntity = new CategoryEntity();
            categoryEntity.setName(addServiceRequest.getNewCategory());
            categoryEntity.setValid(false);
            categoryRepository.save(categoryEntity);

            categoryRepository.findById(categoryEntity.getId())
                    .ifPresent(categoryEntities::add);

        }


        addServiceRequest.setPrice(jsonObject.getDouble("price"));
        addServiceRequest.setPrice_type(
                PriceTypes.valueOf(jsonObject.getString("price_type"))
        );

        String date = jsonObject.getString("start_date");
        if(!date.equals("")) {
            addServiceRequest.setStart_date(date);
            log.error("addServiceRequest getStart_date {}",addServiceRequest.getStart_date());
        }

        date = jsonObject.getString("end_date");
        if(!date.equals("")) {
            addServiceRequest.setEnd_date(date);
            log.error("addServiceRequest getEnd_date {}",addServiceRequest.getEnd_date());

        }
        if(!jsonObject.getString("start_time").equals("")) {
            addServiceRequest.setStart_time(
//                    new java.sql.Time(formatter.parse(
                    jsonObject.getString("start_time")
//                    ).getTime())
            );
        }
        if(!jsonObject.getString("end_time").equals("")) {
            addServiceRequest.setEnd_time(
//                    new java.sql.Time(formatter.parse(
                    jsonObject.getString("end_time")
//                    ).getTime())
            );
        }

        addServiceRequest.setMin_people_count(jsonObject.getInt("min_people_count"));

        addServiceRequest.setMax_people_count(jsonObject.getInt("max_people_count"));

        return addServiceRequest;
    }

    private Date fixDate(Date dt){
        Calendar c = Calendar.getInstance();
        c.setTime(dt);
        c.add(Calendar.DATE, 1);
        dt = c.getTime();
        return dt;
    }

    private ServiceEntity formatServiceEntity(@CurrentUser UserPrincipal userPrincipal,
                                              AddServiceRequest addServiceRequest,
                                              ServiceEntity serviceEntity) {

        serviceEntity.setName(addServiceRequest.getName());
        serviceEntity.setDescription(addServiceRequest.getDescription());

        try {
            if(addServiceRequest.getStart_date() !=null){
                serviceEntity.setStart_date(
                        fixDate(dateFormat.parse(addServiceRequest.getStart_date()))//Timezone bug ?
                );
            }

            if(addServiceRequest.getStart_time() !=null) {
                serviceEntity.setStart_time(
                        new Time(timeFormat.parse(addServiceRequest.getStart_time()).getTime())
                );
            }

            if(addServiceRequest.getEnd_date() !=null) {
                serviceEntity.setEnd_date(
                        fixDate(dateFormat.parse(addServiceRequest.getEnd_date())) //Timezone bug ?
                );
            }

            if(addServiceRequest.getStart_time() !=null) {
                serviceEntity.setEnd_time(
                        new Time(timeFormat.parse(addServiceRequest.getEnd_time()).getTime())
                );
            }

        } catch (ParseException e) {
            e.printStackTrace();
        }


        serviceEntity.setPrice(addServiceRequest.getPrice());
        serviceEntity.setPrice_type(addServiceRequest.getPrice_type());

        serviceEntity.setMin_people_count(addServiceRequest.getMin_people_count());
        serviceEntity.setMax_people_count(addServiceRequest.getMax_people_count());


        serviceEntity.setService_category(new HashSet<>(addServiceRequest.getCategoryEntities()));

        Optional<UserEntity> userEntity = userRepository.findById(userPrincipal.getId());
        if(userEntity.isPresent()) {
            userEntity.get().getRoleEntities().add(
                    roleRepository.findByName(RoleName.ROLE_PROVIDER)
                            .orElseThrow(() -> new RuntimeException("User Role not set.")));

            serviceEntity.setUser(userEntity.get());
        }

        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss");

        LocalDateTime now = LocalDateTime.now();

        log.error("now {} ",dtf.format(now));
        log.error("start {} ",serviceEntity.getStart_date());
        log.error("end {} ",serviceEntity.getEnd_date());

        return serviceEntity;
    }

    @PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<?> addService(@CurrentUser UserPrincipal userPrincipal,
                                      @RequestParam("file") MultipartFile[] files,
                                      @RequestParam("data") String addServiceRequestRaw){

        JSONObject jsonObject = new JSONObject(addServiceRequestRaw);

        AddServiceRequest addServiceRequest =formatServiceRequest(jsonObject);

        ServiceEntity serviceEntity = new ServiceEntity();
        formatServiceEntity(userPrincipal, addServiceRequest,serviceEntity);

        serviceEntity.setStatus(StatusName.PENDING);

        serviceRepository.save(serviceEntity);

        String dir = "/home/anthon/Projects/traveleasy/ftp/" + serviceEntity.getId() + "/";

        Set<PhotoEntity> photoEntitySet = new HashSet<>();
        for (int i = 0; i < files.length; i++) {

            try {
                PhotoEntity photoEntity = new PhotoEntity();
                if (Files.notExists(Paths.get(dir))) {
                    new File(dir).mkdirs();
                }

                File convertfile = new File(dir + files[i].getOriginalFilename() );

                convertfile.createNewFile();
                FileOutputStream fout = new FileOutputStream(convertfile);
                fout.write(files[i].getBytes());
                fout.close();

                photoEntity.setName(files[i].getOriginalFilename());
                photoEntity.setDir(dir + files[i].getOriginalFilename());
                photoEntity.setService(serviceEntity);
                photoEntitySet.add(photoEntity);

            } catch (IOException e) {
                e.printStackTrace();
                serviceRepository.delete(serviceEntity);
                return  new ResponseEntity<>("Failed", HttpStatus.BAD_REQUEST);
            }
        }

        serviceEntity.setService_photo(photoEntitySet);

        serviceRepository.save(serviceEntity);


        return ResponseEntity.ok().build();
    }



    @PatchMapping(value = "/edit", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<?> editService(@CurrentUser UserPrincipal userPrincipal,
                                      @RequestParam("file") MultipartFile[] files,
                                      @RequestParam("data") String addServiceRequestRaw){

        DateFormat timeFormat = new SimpleDateFormat("HH:mm");
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

        JSONObject jsonObject = new JSONObject(addServiceRequestRaw);


        ServiceEntity serviceEntity = serviceRepository.findById(jsonObject.getLong("id"))
                .orElseThrow(()-> new RuntimeException("Service not found"));


        AddServiceRequest addServiceRequest = formatServiceRequest(jsonObject);


        formatServiceEntity(userPrincipal, addServiceRequest,serviceEntity);

        String dir = "/home/anthon/Projects/traveleasy/ftp/" + serviceEntity.getId() + "/";

        Set<PhotoEntity> photoEntitySet = new HashSet<>();
        for (int i = 0; i < files.length; i++) {

            try {
                PhotoEntity photoEntity = new PhotoEntity();
                if (Files.notExists(Paths.get(dir))) {
                    new File(dir).mkdirs();
                }

                File convertfile = new File(dir + files[i].getOriginalFilename() );

                convertfile.createNewFile();
                FileOutputStream fout = new FileOutputStream(convertfile);
                fout.write(files[i].getBytes());
                fout.close();

                photoEntity.setName(files[i].getOriginalFilename());
                photoEntity.setDir(dir + files[i].getOriginalFilename());
                photoEntity.setService(serviceEntity);
                photoEntitySet.add(photoEntity);

            } catch (IOException e) {
                e.printStackTrace();
                serviceRepository.delete(serviceEntity);
                return  new ResponseEntity<>("Failed", HttpStatus.BAD_REQUEST);
            }
        }
        photoEntitySet.addAll(serviceEntity.getService_photo());
        serviceEntity.setService_photo(photoEntitySet);

        serviceRepository.save(serviceEntity);


        return ResponseEntity.ok().build();
    }


    @DeleteMapping (value = "/{id}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<?> deleteService(@CurrentUser UserPrincipal userPrincipal,@PathVariable("id") long id){
        ServiceEntity serviceEntity = serviceRepository.findById(id).orElseThrow(() -> new RuntimeException("Could not find Service"));
        log.error("{}",serviceEntity.getId());
        serviceRepository.delete(serviceEntity);
        return new ResponseEntity<>("Service Deleted",HttpStatus.OK);
    }



}






