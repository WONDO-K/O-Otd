package com.threeheads.gallery.controller;

import com.threeheads.gallery.model.entity.MyLike;
import com.threeheads.gallery.model.dto.AddCollectionDto;
import com.threeheads.gallery.model.dto.CollectionDto;
import com.threeheads.gallery.model.dto.GalleryDetailDto;
import com.threeheads.gallery.model.service.GalleryServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/gallery")
public class GalleryRestController {
    private GalleryServiceImpl service;

    @PostMapping("/my-collection")
    public ResponseEntity<?> addCollection(@RequestBody AddCollectionDto dto){
        MyLike result =  service.addCollection(dto);
        if(result!=null)
            return ResponseEntity.ok(true);
        else{
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("addCollection에러");
        }
    }

    @GetMapping("/my-collection/{userId}")
    public ResponseEntity<?> getCollectionList(@PathVariable("userId") Long userId){
        List<CollectionDto> list = service.getCollectionList(userId);
        if(list !=null)
           return ResponseEntity.ok(list);
        else
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("getCollectionList 에러");
    }
    @GetMapping("/{galleryId}")
    public ResponseEntity<?> getGalleryDetail(@PathVariable("galleryId") int galleryId){
        GalleryDetailDto galleryDetailDto = service.getGalleryDetail(galleryId);
        return ResponseEntity.ok(galleryDetailDto);
    }

}
