package com.threeheads.gallery.controller;

import com.threeheads.gallery.model.dto.GalleryListResponseDto;
import com.threeheads.gallery.model.entity.Gallery;
import com.threeheads.gallery.model.entity.MyLike;
import com.threeheads.gallery.model.dto.AddCollectionDto;
import com.threeheads.gallery.model.dto.CollectionDto;
import com.threeheads.gallery.model.dto.GalleryDetailDto;
import com.threeheads.gallery.model.service.GalleryServiceImpl;
import lombok.AllArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
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

    @GetMapping("/gallery/list")
    public ResponseEntity<?> getGalleryList(@RequestParam String type){
        List<GalleryListResponseDto> result = service.getGalleryList(type);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/gallery/my-collection")
    public ResponseEntity<?> delMyCollection(@RequestParam long clothesId){
        boolean result = service.delMyCollection(clothesId);
        if(result)
            return ResponseEntity.ok(true);
        else
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("delMyCollection 에러");
    }

    @GetMapping("/gallery")
    public ResponseEntity<?> searchLook(@RequestParam String type){
        List<Gallery> result = service.searchLook(type);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/gallery/week-pick")
    public ResponseEntity<?> getWeekPick(){
        List<Gallery> result = service.getWeekPick();
        return ResponseEntity.ok(result);
    }
}
