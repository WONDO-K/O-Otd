package com.threeheads.gallery.servicetest;

import com.threeheads.gallery.AbstractTest;
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

        //assertEquals(result instanceof Like,);

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
}
