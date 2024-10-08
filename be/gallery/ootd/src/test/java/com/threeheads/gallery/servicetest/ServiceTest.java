package com.threeheads.gallery.servicetest;

import com.threeheads.gallery.AbstractTest;
import com.threeheads.gallery.model.dto.GalleryDetailDto;
import com.threeheads.gallery.model.dto.GalleryListResponseDto;
import com.threeheads.gallery.model.entity.Gallery;
import com.threeheads.gallery.model.entity.MyLike;
import com.threeheads.gallery.model.dto.AddCollectionDto;
import com.threeheads.gallery.model.dto.CollectionDto;
import com.threeheads.gallery.model.service.GalleryService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.*;


public class ServiceTest extends AbstractTest {

    @Autowired
    private GalleryService service;

    @Test
    public void addCollection(){
        AddCollectionDto dto = new AddCollectionDto();
        dto.setClothesId(1);
        dto.setUserId(1);

        MyLike result = service.addCollection(dto);


        // 결과가 null이 아님을 확인
        assertNotNull(result, "Result should not be null");

        // 결과의 클래스가 Like인지 확인
        assertTrue(result instanceof MyLike, "Result should be an instance of Like");
    }

    @Test
    public void getCollectionList(){
        long userId = 1;
        List<CollectionDto> result = service.getCollectionList(userId);
        assertNotNull(result,"Result should not be null");
    }

    @Test
    public void getGalleryDetail(){
        int galleryId = 1;
        GalleryDetailDto result=service.getGalleryDetail(galleryId);
        assertEquals(result.getCategory(),"casual_look");
        assertEquals(result.getImageUrl(),"https://o-otd.b-cdn.net/ootd_images/ootd_images_part_1/img_1.png");
        assertEquals(result.getImageId(),1);
        assertEquals(result.getLikesCount(),0);
    }

    @Test
    public void getGalleryListforEmpty(){
        String type = "";
        List<GalleryListResponseDto> result=service.getGalleryList(type);
        assertEquals(result.size(),20);
    }

    @Test
    public void getGalleryListforNotEmpty(){
        String type = "casual_look";
        List<GalleryListResponseDto> result=service.getGalleryList(type);
        assertEquals(result.size(),20);
    }

    @Test
    public void delMyCollection(){
        long clothesId = 1;
        boolean result = service.delMyCollection(clothesId);
        assertTrue(result);
    }

    @Test
    public void searchLook(){
        String type ="casual_look";
        List<Gallery> result = service.searchLook("casual_look");
        assertEquals(result.size(),20);
    }

    @Test
    public void getWeekPick(){
        List<Gallery> result = service.getWeekPick();
        assertEquals(result.size(),10);
    }

}
