package com.traveleasy.traveleasybackend.controllers;

import com.traveleasy.traveleasybackend.models.RoleName;
import com.traveleasy.traveleasybackend.models.entities.CategoryEntity;
import com.traveleasy.traveleasybackend.models.entities.PhotoEntity;
import com.traveleasy.traveleasybackend.models.entities.ServiceEntity;
import com.traveleasy.traveleasybackend.models.entities.UserEntity;
import com.traveleasy.traveleasybackend.payload.AddServiceRequest;
import com.traveleasy.traveleasybackend.payload.AuthResponse;
import com.traveleasy.traveleasybackend.repositories.CategoryRepository;
import com.traveleasy.traveleasybackend.repositories.RoleRepository;
import com.traveleasy.traveleasybackend.repositories.ServiceRepository;
import com.traveleasy.traveleasybackend.repositories.UserRepository;
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

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
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

    @GetMapping
    @PreAuthorize("hasRole('ROLE_USER')")
    public List<ServiceEntity> getServices() {
        return serviceRepository.findAll();
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('ROLE_USER')")
    public List<ServiceEntity> getMyServices(@CurrentUser UserPrincipal userPrincipal) {

        return serviceRepository.findAllByUser(
                userRepository.findById(userPrincipal.getId()).orElseThrow(
                        () -> new RuntimeException("Cant find current user")
                )
        );
    }


    @PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<?> addFiles(@CurrentUser UserPrincipal userPrincipal,
                                      @RequestParam("file") MultipartFile[] files,
                                      @RequestParam("data") String addServiceRequestRaw){

        log.error("add called addServiceRequestString {}",addServiceRequestRaw);
        DateFormat formatter = new SimpleDateFormat("HH:mm");

        JSONObject jsonObject = new JSONObject(addServiceRequestRaw);

        AddServiceRequest addServiceRequest = new AddServiceRequest();

        addServiceRequest.setName(jsonObject.getString("name"));
        addServiceRequest.setDescription(jsonObject.getString("description"));

        JSONArray categoriesJson = jsonObject.getJSONArray("categories");
        List<CategoryEntity> categoryEntities = new ArrayList<>();

        for(int i = 0 ; i < categoriesJson.length(); i++){
            JSONObject jsonCategory = categoriesJson.getJSONObject(i);
//            CategoryEntity categoryEntity = new CategoryEntity(
//                    jsonCategory.getLong("id"),
//                    jsonCategory.getString("name")
//            );
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

        if(!jsonObject.getString("price").equals("")) {
            addServiceRequest.setPrice(jsonObject.getDouble("price"));
        }

        try {
            String date = jsonObject.getString("start_date");
            if(!date.equals("")) {
                addServiceRequest.setStart_date(new SimpleDateFormat("MM-dd-yyyy").parse(
                        date
                ));
            }

            date = jsonObject.getString("end_date");
            if(!date.equals("")) {
                addServiceRequest.setEnd_date(new SimpleDateFormat("MM-dd-yyyy").parse(
                        date
                ));
            }

            addServiceRequest.setStart_time(
                    new java.sql.Time(formatter.parse(
                            jsonObject.getString("start_time")
                    ).getTime())
            );

            addServiceRequest.setEnd_time(
                    new java.sql.Time(formatter.parse(
                            jsonObject.getString("end_time")
                    ).getTime())
            );

        } catch (ParseException e) {
            e.printStackTrace();
        }

        if(!jsonObject.getString("min_people_count").equals("")) {
            addServiceRequest.setMin_people_count(jsonObject.getInt("min_people_count"));
        }
        if(!jsonObject.getString("max_people_count").equals("")) {
            addServiceRequest.setMax_people_count(jsonObject.getInt("max_people_count"));
        }

        log.error("jsonObject {}",jsonObject);
        log.error("addServiceRequest {}",addServiceRequest);


        ServiceEntity serviceEntity = new ServiceEntity();

        serviceEntity.setName(addServiceRequest.getName());
        serviceEntity.setDescription(addServiceRequest.getDescription());

        serviceEntity.setStart_date(addServiceRequest.getStart_date());
        serviceEntity.setStart_time(addServiceRequest.getStart_time());

        serviceEntity.setEnd_date(addServiceRequest.getEnd_date());
        serviceEntity.setEnd_time(addServiceRequest.getEnd_time());

        serviceEntity.setPrice(addServiceRequest.getPrice());

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

        serviceRepository.save(serviceEntity);

        String dir = "/home/anthon/Projects/traveleasy/ftp/" + serviceEntity.getId() + "/";

        Set<PhotoEntity> photoEntitySet = new HashSet<>();
        for (int i = 0; i < files.length; i++) {

            try {
                PhotoEntity photoEntity = new PhotoEntity();
                if (Files.notExists(Paths.get(dir))) {
                    log.error("Nera dir");
                    new File(dir).mkdirs();
                }

                File convertfile = new File(dir + files[i].getOriginalFilename() );

                convertfile.createNewFile();
                FileOutputStream fout = new FileOutputStream(convertfile);
                fout.write(files[i].getBytes());
                fout.close();

                photoEntity.setName(files[i].getOriginalFilename());
                photoEntity.setDir(dir + files[i].getOriginalFilename());
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

}






