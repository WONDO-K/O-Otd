package com.threeheads.gallery.controller;

import com.threeheads.gallery.model.dto.GalleryListResponseDto;
import com.threeheads.gallery.model.entity.Gallery;
import com.threeheads.gallery.model.entity.MyLike;
import com.threeheads.gallery.model.dto.AddCollectionDto;
import com.threeheads.gallery.model.dto.CollectionDto;
import com.threeheads.gallery.model.dto.GalleryDetailDto;
import com.threeheads.gallery.model.service.GalleryServiceImpl;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.apache.commons.net.ftp.FTP;
import org.apache.commons.net.ftp.FTPClient;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@AllArgsConstructor
@Slf4j
public class GalleryRestController {
    private GalleryServiceImpl service;

    // 마이 컬럭션 추가
    @PostMapping("/my-collection")
    public ResponseEntity<?> addCollection(@RequestBody AddCollectionDto dto){
        MyLike result =  service.addCollection(dto);
        if(result!=null)
            return ResponseEntity.ok(true);
        else{
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("addCollection에러");
        }
    }

    // 마이 컬랙션 리스트조회
    @GetMapping("/my-collection/{userId}")
    public ResponseEntity<?> getCollectionList(@PathVariable("userId") Long userId){
        List<CollectionDto> list = service.getCollectionList(userId);
        if(list !=null)
           return ResponseEntity.ok(list);
        else
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("getCollectionList 에러");
    }

    // 갤러리 상세 조회
    @GetMapping("/{galleryId}")
    public ResponseEntity<?> getGalleryDetail(@PathVariable("galleryId") int galleryId){
        GalleryDetailDto galleryDetailDto = service.getGalleryDetail(galleryId);
        return ResponseEntity.ok(galleryDetailDto);
    }
    // 갤러리 지연로딩 리스크 조회
    @GetMapping("/list")
    public ResponseEntity<?> getGalleryList(@RequestParam String type){
        List<GalleryListResponseDto> result = service.getGalleryList(type);
        return ResponseEntity.ok(result);
    }

    // 마이 컬럭션 제거
    @DeleteMapping("/my-collection")
    public ResponseEntity<?> delMyCollection(@RequestParam long clothesId){
        boolean result = service.delMyCollection(clothesId);
        if(result)
            return ResponseEntity.ok(true);
        else
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("delMyCollection 에러");
    }

    // 룩검색
    @GetMapping("/gallery")
    public ResponseEntity<?> searchLook(@RequestParam String type){
        List<Gallery> result = service.searchLook(type);
        return ResponseEntity.ok(result);
    }

    // 금주의 픽
    @GetMapping("/week-pick")
    public ResponseEntity<?> getWeekPick(){
        List<Gallery> result = service.getWeekPick();
        return ResponseEntity.ok(result);
    }

    @PostMapping("/ai")
    public ResponseEntity<?> getAiResult(@RequestBody List<String> image_urls){
        Object result = service.getAiResult(image_urls);
        if(result instanceof String || result == null)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Ai service에러, "+result);
        else
            return ResponseEntity.ok(result);
    }

    @PostMapping(value = "/upload_cdn", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadImage(@RequestParam("userId") int userId, @RequestParam("file") MultipartFile file) {
        log.info("upload controller: {}", true); // 로그 출력
        try{
            log.info("upload controller in try: {}", true); // 로그 출력
            String result = service.uploadImage(userId, file);
            Map<String,String> responseMap = new HashMap<>();
            responseMap.put("url",result);
            return ResponseEntity.ok(responseMap);
        }
        catch (Exception e){
            log.info("upload controller err: {}", e.getMessage()); // 로그 출력
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("upload_cdn, "+e.getMessage());
        }

    }
}
