package com.traveleasy.traveleasybackend.controllers;

import com.traveleasy.traveleasybackend.models.entities.PhotoEntity;
import com.traveleasy.traveleasybackend.repositories.PhotoRepository;
import com.traveleasy.traveleasybackend.security.CurrentUser;
import com.traveleasy.traveleasybackend.security.UserPrincipal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import javax.mail.Multipart;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;


@Slf4j
@CrossOrigin
@Controller
@RequestMapping("/photo")
public class PhotoController {

    @Autowired
    PhotoRepository photoRepository;

    private static byte[] readContentIntoByteArray(File file)
    {
        FileInputStream fileInputStream = null;
        byte[] bFile = new byte[(int) file.length()];
        try
        {
            //convert file into array of bytes
            fileInputStream = new FileInputStream(file);
            fileInputStream.read(bFile);
            fileInputStream.close();
            for (int i = 0; i < bFile.length; i++)
            {
                System.out.print((char) bFile[i]);
            }
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }
        return bFile;
    }


    @GetMapping(value = "/test2/")
    @ResponseBody
    public MultipartFile t(@CurrentUser UserPrincipal userPrincipal) {

        File fileDownload = new File("/home/anthon/Projects/traveleasy/ftp/1/3840x2160.svg");

        Path path = Paths.get("/home/anthon/Projects/traveleasy/ftp/1/3840x2160.svg");
        String name = "3840x2160.svg";
        String originalFileName = "3840x2160.svg";
        String contentType = "text/plain";
        byte[] content = null;
        try {
            content = Files.readAllBytes(path);
        } catch (final IOException e) {
        }

return null;
    }


    @GetMapping(value = "/test")
    @ResponseBody
    public byte[] t2(@CurrentUser UserPrincipal userPrincipal) {

        File fileDownload = new File("/home/anthon/Projects/traveleasy/ftp/1/Acrylic.jpg");
        try {
            return Files.readAllBytes(fileDownload.toPath());
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }


    @GetMapping(value = "/{id}")
    @ResponseBody
    public byte[] getPhoto(@PathVariable("id") Long id) {
        Optional<PhotoEntity> photoEntity = photoRepository.findById(id);

        if(photoEntity.isPresent()) {
            File fileDownload = new File(photoEntity.get().getDir());
            try {
                return Files.readAllBytes(fileDownload.toPath());
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return null;
    }

    @DeleteMapping(value = "/{id}")
    @ResponseBody
    public ResponseEntity<?> deletePhoto(@PathVariable("id") Long id) {
        Optional<PhotoEntity> photoEntity = photoRepository.findById(id);

        if(photoEntity.isPresent()) {
            File file = new File(photoEntity.get().getDir());
            if(!file.exists()){
                return new ResponseEntity<>("Photo not found", HttpStatus.BAD_REQUEST);
            }else {
                file.delete();
                photoRepository.delete(photoEntity.get());
                return new ResponseEntity<>("Photo deleted", HttpStatus.OK);
            }
        }
        return new ResponseEntity<>("Photo not found", HttpStatus.BAD_REQUEST);
    }
}
